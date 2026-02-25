import { useState, useRef } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { mockApi, api_video } from '../lib/api';
import { Upload, X, FileVideo, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragCounter, setDragCounter] = useState(0);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        toast.error('Please upload a valid video file.');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit for demo
        toast.error('File size too large. Max 50MB allowed.');
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragCounter(0);
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('File size too large. Max 50MB allowed.');
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      toast.error('Please upload a valid video file.');
    }
  };

  const handleCoverChange = (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }
      setCoverImage(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setCoverPreviewUrl(url);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("video", file as File);          // video file
      formData.append("cover_image", coverImage as File); // cover image
      formData.append("title", title);
      formData.append("description", description);

      await api_video.post("/upload-video/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success('Video uploaded successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">Upload Video</h1>
        <p className="text-muted-foreground mt-1">Share your content with the world.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => { if (dragCounter === 0) fileInputRef.current?.click(); }}
              className={`relative border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center p-12 text-center cursor-pointer ${
                file ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              {previewUrl ? (
                <div className="w-full space-y-4">
                  <video 
                    src={previewUrl} 
                    className="w-full aspect-video rounded-xl bg-black shadow-lg" 
                    controls 
                  />
                  <div className="flex items-center justify-between bg-background p-3 rounded-xl border">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileVideo className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate">{file?.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Select video to upload</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-6">
                    Click to select or drag and drop a file here
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="flex items-center gap-4">
                {coverPreviewUrl ? (
                  <div className="relative">
                    <img src={coverPreviewUrl} alt="Cover" className="w-32 h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-32 h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </button>
                )}
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a catchy title"
                  className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-black focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's your video about?"
                  className="w-full p-4 rounded-xl bg-muted/50 border border-black focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
            </div>

            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      Uploading...
                    </span>
                    <span className="text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isUploading || !file || !title.trim() || !description.trim()}
              className="w-full h-12 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90   transition-all flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upload Video'
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Upload Guidelines
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="mt-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <span>Maximum file size is 50MB for the demo.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <span>Supported formats: MP4, MOV, WebM.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <span>Ensure your content follows our community guidelines.</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 border border-dashed">
            <p className="text-xs text-center text-muted-foreground">
              Your video will be processed and optimized for all devices after upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

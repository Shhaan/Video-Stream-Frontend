import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api_video, mockApi } from '../lib/api';
import { motion } from 'motion/react';
import VideoHsl from '../components/VideoHsl';

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [recommendedvideo, setRecommendedvideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api_video.get('/get-videos/?id=' + id);
        const found = response.data 
        setVideo(found);
      } catch (error) {
        console.error('Failed to fetch video:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchRecommendedVideo = async () => {
      try {
        const response = await api_video.get('/get-videos/?exclude_id=' + id);
        const found = response.data 
        setRecommendedvideo(found);
      } catch (error) {
        console.error('Failed to fetch video:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendedVideo()
    fetchVideo();
  }, [id]);

  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="aspect-video w-full bg-muted animate-pulse rounded-2xl mb-6" />
        <div className="h-8 bg-muted animate-pulse rounded w-1/2 mb-4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Video not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 block">Return to home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
           
           
           <VideoHsl key={video.id} src={video.hls_url} />
           

          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-display font-bold tracking-tight leading-tight">
              {video.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-background">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} 
                    alt={video.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">{video?.user?.name}</h3>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg mb-4">Up next</h3>
           {recommendedvideo &&recommendedvideo.map((video: any, i: number) => (
             
          
            <div key={i} onClick={()=>navigate(`/video/${video.id}`)} className="flex gap-3 group cursor-pointer">
              <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={video.cover_image} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 py-0.5 rounded">
                  {formatDuration(video.duration_seconds || 0)}
                </div>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h4 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {video.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">Creator Channel</p>
                <p className="text-xs text-muted-foreground">120K views • 1 day ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

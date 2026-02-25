import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api_video, mockApi } from '../lib/api';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, MessageSquare, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import VideoHsl from '../components/VideoHsl';

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [recommendedvideo, setRecommendedvideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
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
                  <h3 className="font-bold text-lg leading-none">{video.author}</h3>
                  <p className="text-sm text-muted-foreground mt-1">1.2M subscribers</p>
                </div>
                <button className="ml-4 px-6 py-2.5 bg-foreground text-background font-bold rounded-full hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>

              <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full self-start sm:self-center">
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-l-full transition-colors ${isLiked ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-bold">45K</span>
                  </button>
                  <div className="w-px h-6 bg-border" />
                  <button className="px-4 py-2 hover:bg-accent rounded-r-full transition-colors">
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Share</span>
                </button>
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{video.createdAt}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
              <button className="text-sm font-bold mt-2 hover:opacity-70">Show more</button>
            </div>
          </div>

          <div className="pt-8 border-t">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl font-bold">482 Comments</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground cursor-pointer hover:text-foreground">
                <MessageSquare className="w-4 h-4" />
                <span>Sort by</span>
              </div>
            </div>
            
            <div className="flex gap-4 mb-8">
              <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
              <div className="flex-1 space-y-4">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="w-full border-b bg-transparent py-2 focus:border-foreground outline-none transition-colors"
                />
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 text-sm font-bold hover:bg-accent rounded-full">Cancel</button>
                  <button className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-full opacity-50 cursor-not-allowed">Comment</button>
                </div>
              </div>
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
                  4:20
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

import { useState, useEffect, useRef, useCallback } from 'react';
import { mockApi,api_video } from '../lib/api';
import { VideoCard } from '../components/VideoCard';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [videos, setVideos] = useState<any[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchVideos = async (url: string = "/get-videos/") => {
    try {
      const response = await api_video.get(url);
      setVideos(prev => url === "/get-videos/" ? response.data.results : [...prev, ...response.data.results]);
      setNext(response.data.next);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const lastVideoRef = useCallback((node: any) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && next) {
        setIsLoadingMore(true);
        fetchVideos(next);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, next]);

  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Recommended</h1>
          <p className="text-muted-foreground mt-1">Videos you might like based on your interests.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg self-start">
          <button className="p-2 bg-background shadow-sm rounded-md">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-background/50 rounded-md transition-colors">
            <List className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button className="p-2 hover:bg-background/50 rounded-md transition-colors flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-video rounded-xl bg-muted animate-pulse" />
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
        >
          {videos.map((video, index) => (
            <div key={video.id} ref={index === videos.length - 1 ? lastVideoRef : null}>
              <VideoCard video={video} />
            </div>
          ))}
        </motion.div>
      )}

      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted p-6 rounded-full mb-4">
            <LayoutGrid className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No videos found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            It looks like there are no videos yet. Be the first to upload one!
          </p>
        </div>
      )}
    </div>
  );
}

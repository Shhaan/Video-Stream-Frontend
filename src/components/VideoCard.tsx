import { Link } from 'react-router-dom';
import { Play, MoreVertical, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    author: string;
    views: string;
    createdAt: string;
  };
}

export function VideoCard(props: any) {
  const { video } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col gap-3"
    >
      <Link to={`/video/${video.id}`} className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          12:45
        </div>
      </Link>

      <div className="flex gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} 
            alt={video.author}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/video/${video.id}`} className="font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </Link>
            <button className="p-1 hover:bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors cursor-pointer">
            {video.author}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <span>{video.views} views</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>{video.createdAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

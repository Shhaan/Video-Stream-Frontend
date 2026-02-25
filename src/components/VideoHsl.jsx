import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const VideoHsl = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  useEffect(() => {
    let hls;

    if (videoRef.current && !error) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const availableQualities = hls.levels.map((l) => l.height);

          playerRef.current = new Plyr(videoRef.current, {
            controls: [
              "play",
              "progress",
              "current-time",
              "mute",
              "volume",
              "settings",
              "fullscreen"
            ],
            settings: ["quality"],
            quality: {
              default: availableQualities[0],
              options: availableQualities,
              forced: true,
              onChange: (quality) => {
                hls.levels.forEach((level, index) => {
                  if (level.height === quality) {
                    hls.currentLevel = index;
                  }
                });
              },
            },
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          hls.destroy();
          if (playerRef.current) playerRef.current.destroy();
          setError(true);
        });
      } else {
        // Safari native HLS
        videoRef.current.src = src;
        playerRef.current = new Plyr(videoRef.current);

        const handleError = () => {
          if (playerRef.current) playerRef.current.destroy();
          setError(true);
        };
        videoRef.current.addEventListener('error', handleError);

        // Store cleanup
        return () => {
          videoRef.current.removeEventListener('error', handleError);
        };
      }
    }

    return () => {
      if (hls) hls.destroy();
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [src, error]);

  return (
    <div className="h-full">
      {error ? (
        <div className="flex items-center justify-center h-full bg-black text-white">
          <div className="text-center">
            <p className="text-lg font-semibold">Video failed to load</p>
            <p className="text-sm text-gray-400">Something went wrong.</p>
          </div>
        </div>
      ) : (
        <video ref={videoRef} className="plyr-react plyr w-full h-full" />
      )}
    </div>
  );
};

export default VideoHsl;
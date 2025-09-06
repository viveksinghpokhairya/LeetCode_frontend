import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden 
                 bg-white/5 backdrop-blur-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video cursor-pointer"
      />

      {/* Minimal Overlay Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 flex items-center gap-3 
                    transition-opacity ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}
                    bg-black/30 backdrop-blur-sm`}
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="text-white w-4 h-4" />
          ) : (
            <Play className="text-white w-4 h-4" />
          )}
        </button>

        {/* Progress Bar */}
        <span className="text-xs text-white">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            if (videoRef.current) {
              videoRef.current.currentTime = Number(e.target.value);
            }
          }}
          className="flex-1 accent-white cursor-pointer"
        />
        <span className="text-xs text-white">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Editorial;

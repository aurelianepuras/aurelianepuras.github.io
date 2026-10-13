import { useState } from 'react';

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  description?: string;
  index?: number;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function VideoPlayer({ title, videoUrl, thumbnail, description, index }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(videoUrl);
  const thumbnailUrl = thumbnail || (videoId ? getYouTubeThumbnail(videoId) : null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <article className="group">
      <div className="media notch aspect-video">
        {!isPlaying ? (
          <>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                width={640}
                height={360}
                loading="lazy"
                
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-navy/40 dark:text-ivory-light/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            )}
           <button
  onClick={handlePlay}
  className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
  aria-label={`Redă ${title}`}
>
  {/* Overlay negru care apare la hover */}
  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  
  {/* Butonul rotund care apare la hover – roșu YouTube */}
  <div className="relative w-11 h-11 bg-[#FF0000] rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  </div>
</button>
            <div className="absolute top-3 right-3 bg-[#FF0000] text-white px-3 py-1 font-mono text-[10px] tracking-[0.16em] uppercase">
              YouTube
            </div>
          </>
        ) : (
          videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )
        )}
      </div>
      <div className="card-meta">
        <small>{index !== undefined ? String(index + 1).padStart(2, '0') : 'VIDEO'}</small>
        <span className="go" aria-hidden="true">▶︎</span>
      </div>
      <h3 className="card-title line-clamp-2">{title}</h3>
      {description && (
        <p className="mt-2 text-[15px] leading-relaxed line-clamp-2" style={{ color: 'var(--mute)' }}>
          {description}
        </p>
      )}
    </article>
  );
}
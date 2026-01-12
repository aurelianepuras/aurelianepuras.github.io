import { useState } from 'react';

interface VideoPlayerProps {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  description?: string;
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

export default function VideoPlayer({ title, videoUrl, thumbnail, description }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(videoUrl);
  const thumbnailUrl = thumbnail || (videoId ? getYouTubeThumbnail(videoId) : null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <article className="group bg-ivory-card dark:bg-navy-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-navy/10 dark:border-ivory-light/10">
      <div className="relative aspect-video overflow-hidden bg-ivory dark:bg-navy-deep">
        {!isPlaying ? (
          <>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
              className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors cursor-pointer"
              aria-label={`Redă ${title}`}
            >
              <div className="w-16 h-16 bg-gold-warm/90 dark:bg-gold-bright/90 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </button>
            <div className="absolute top-3 right-3 bg-gold-warm dark:bg-gold-bright text-navy px-3 py-1 rounded-2xl text-xs font-semibold">
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
      <div className="p-6">
        {/* Titlu modificat: text-3xl, leading-tight și font-serif pentru consistență */}
        <h3 className="text-3xl font-serif text-navy dark:text-ivory-light group-hover:text-gold-warm dark:group-hover:text-gold-bright transition-all duration-300 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        {description && (
          <p className="mt-3 text-navy/70 dark:text-ivory-light/70 line-clamp-2">
            {description}
          </p>
        )}
        
        {!isPlaying && (
          <div className="mt-4 flex items-center text-gold-warm dark:text-gold-bright font-medium">
            Redă videoclipul
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
      </div>
    </article>
  );
}
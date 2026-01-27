import { useEffect, useState, useRef } from 'react';

interface Track {
  id: number;
  title: string;
  audio_file: string;
  duration: string;
}

interface MusicPlayerProps {
  albumTitle: string;
  artist: string;
  albumCover: string;
  currentTrackTitle: string;
  tracks: Track[];
  albumDescription?: string;
  productionNotes?: string;
}

export default function MusicPlayer({
  albumTitle,
  artist,
  albumCover,
  currentTrackTitle,
  tracks,
  albumDescription,
  productionNotes,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasTracks = tracks.length > 0;
  const currentTrack = hasTracks ? tracks[currentTrackIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setAudioError(null);
    };
    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasTracks) return;

    if (isPlaying) {
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex, hasTracks]);

  useEffect(() => {
    setAudioError(null);
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleTrackClick = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-ivory-card dark:bg-navy-card rounded-2xl overflow-hidden border border-navy/10 dark:border-ivory-light/10">
        <div className="grid md:grid-cols-[300px_1fr] gap-0">
          <div className="relative aspect-square md:aspect-auto">
            <img
              src={albumCover}
              alt={albumTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy dark:text-ivory-light mb-2">
                {albumTitle}
              </h2>
              <p className="text-lg text-navy/70 dark:text-ivory-light/70 mb-8">
                {artist}
              </p>
              {hasTracks && (
                <p className="text-gold-warm dark:text-gold-bright font-medium mb-8">
                  {currentTrack?.title}
                </p>
              )}
            </div>

              <div className="space-y-6">
              <div
                className="relative h-1 bg-navy/20 dark:bg-ivory-light/20 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
                role="slider"
                aria-label="Progress control"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const delta = e.key === 'ArrowLeft' ? -5 : 5;
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
                    }
                  }
                }}
              >
                <div
                  className="absolute h-full bg-gold-warm dark:bg-gold-bright rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold-warm dark:bg-gold-bright rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-navy/60 dark:text-ivory-light/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentTrackIndex === 0}
                    className="p-2 text-navy dark:text-ivory-light hover:text-gold-warm dark:hover:text-gold-bright transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous track"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-gold-warm dark:bg-gold-bright hover:bg-gold-bright dark:hover:bg-gold-warm text-navy flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentTrackIndex === tracks.length - 1}
                    className="p-2 text-navy dark:text-ivory-light hover:text-gold-warm dark:hover:text-gold-bright transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next track"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => setVolume(volume > 0 ? 0 : 1)}
                  className="p-2 text-navy dark:text-ivory-light hover:text-gold-warm dark:hover:text-gold-bright transition-all duration-300"
                  aria-label={volume > 0 ? 'Mute' : 'Unmute'}
                >
                  {volume > 0 ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {hasTracks && (
              <div className="mt-8 space-y-2">
                {tracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackClick(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      index === currentTrackIndex
                        ? 'bg-ivory dark:bg-navy-deep'
                        : 'hover:bg-ivory/50 dark:hover:bg-navy-deep/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-navy/40 dark:text-ivory-light/40 w-6">
                        {track.id}
                      </span>
                      <span
                        className={`font-medium ${
                          index === currentTrackIndex
                            ? 'text-gold-warm dark:text-gold-bright'
                            : 'text-navy dark:text-ivory-light'
                        }`}
                      >
                        {track.title}
                      </span>
                    </div>
                    <span className="text-sm text-navy/60 dark:text-ivory-light/60">
                      {track.duration}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {(albumDescription || productionNotes) && (
        <div className="grid md:grid-cols-2 gap-6">
          {albumDescription && (
            <div className="bg-ivory-card dark:bg-navy-card rounded-2xl p-8 border border-navy/10 dark:border-ivory-light/10">
              <h3 className="font-serif text-2xl font-bold text-navy dark:text-ivory-light mb-4">
                Despre acest album
              </h3>
              <p className="text-navy/70 dark:text-ivory-light/70 leading-relaxed">
                {albumDescription}
              </p>
            </div>
          )}
          {productionNotes && (
            <div className="bg-ivory-card dark:bg-navy-card rounded-2xl p-8 border border-navy/10 dark:border-ivory-light/10">
              <h3 className="font-serif text-2xl font-bold text-navy dark:text-ivory-light mb-4">
                Note de producție
              </h3>
              <p className="text-navy/70 dark:text-ivory-light/70 leading-relaxed">
                {productionNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {hasTracks && (
        <audio
          ref={audioRef}
          src={currentTrack?.audio_file}
          preload="metadata"
          onError={() => {
            setIsPlaying(false);
            setAudioError('Piesa audio nu a putut fi redată. Încearcă alt track sau reîncarcă pagina.');
          }}
        />
      )}

      {audioError && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-2xl space-y-3">
          <p className="text-sm text-red-800 dark:text-red-200">
            {audioError}
          </p>
          <button
            onClick={() => {
              setAudioError(null);
              if (audioRef.current) {
                audioRef.current.load();
              }
            }}
            className="text-sm text-red-800 dark:text-red-200 underline hover:no-underline"
          >
            Încearcă din nou
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useRef, useMemo } from 'react';
import waveforms from '../data/waveforms.json';

const WAVES = waveforms as Record<string, number[]>;

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
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setAudioError(null);
      }
    };
    // metadatele pot fi deja încărcate înainte ca playerul să pornească
    if (audio.readyState >= 1) updateDuration();
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
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
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
  const peaks = currentTrack ? WAVES[currentTrack.audio_file] : undefined;
  // forma undei: câte o bară pentru fiecare bucată din înregistrare
  const waveBars = useMemo(() => peaks ? (
    <svg viewBox={`0 0 ${peaks.length * 3} 100`} preserveAspectRatio="none" aria-hidden="true">
      {peaks.map((p, i) => {
        const h = Math.max(4, p * 100);
        return <rect key={i} x={i * 3} y={(100 - h) / 2} width={2} height={h} rx={1} />;
      })}
    </svg>
  ) : null, [peaks]);

  const playIcon = isPlaying ? (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
  ) : (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
  );

  return (
    <>
      <div className="mp">
        <div className={`mp-art ${isPlaying ? 'is-playing' : ''}`}>
          <div className="mp-vinyl" aria-hidden="true">
            <div className="mp-label" style={{ backgroundImage: `url(${albumCover})` }} />
          </div>
          <div className="mp-sleeve notch">
            <img src={albumCover} alt={albumTitle} width={600} height={600} />
          </div>
        </div>

        <div className="mp-body">
          <p className="eyebrow">Album</p>
          <h2 className="mp-title">{albumTitle}</h2>
          <p className="mp-artist">{artist}</p>

          <div className="mp-now">
            <button onClick={togglePlay} className="mp-play" aria-label={isPlaying ? 'Pauză' : 'Redă'} disabled={!hasTracks}>
              {playIcon}
            </button>
            <div className="mp-now-text">
              <small>{isPlaying ? 'Acum se aude' : 'Pregătit'}</small>
              <b>{currentTrack?.title || currentTrackTitle}</b>
            </div>
            <div className="mp-skip">
              <button onClick={handlePrevious} disabled={currentTrackIndex === 0} aria-label="Piesa anterioară">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              <button onClick={handleNext} disabled={currentTrackIndex === tracks.length - 1} aria-label="Piesa următoare">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" /></svg>
              </button>
              <button onClick={() => setVolume(volume > 0 ? 0 : 1)} aria-label={volume > 0 ? 'Fără sunet' : 'Cu sunet'}>
                {volume > 0 ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={peaks ? 'mp-bar mp-bar-wave' : 'mp-bar'}
            onClick={handleProgressClick}
            role="slider"
            aria-label="Progres piesă"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${formatTime(currentTime)} din ${formatTime(duration)}`}
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
            {peaks ? (
              <>
                <div className="mp-wave">{waveBars}</div>
                <div className="mp-wave mp-wave-on" style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>{waveBars}</div>
              </>
            ) : (
              <span style={{ transform: `scaleX(${progress / 100})` }} />
            )}
          </div>
          <div className="mp-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {hasTracks && (
            <ol className="mp-list">
              {tracks.map((track, index) => (
                <li key={track.id}>
                  <button onClick={() => handleTrackClick(index)} className={index === currentTrackIndex ? 'on' : ''} aria-current={index === currentTrackIndex ? 'true' : undefined}>
                    <small>{String(track.id).padStart(2, '0')}</small>
                    <span>{track.title}</span>
                    <em>{track.duration}</em>
                    <i aria-hidden="true">{index === currentTrackIndex && isPlaying ? '❚❚' : '▶︎'}</i>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {(albumDescription || productionNotes) && (
        <div className="mp-notes">
          {albumDescription && (
            <div>
              <p className="eyebrow">Despre acest album</p>
              <p className="mp-desc">{albumDescription}</p>
            </div>
          )}
          {productionNotes && (
            <div>
              <p className="eyebrow">Note de producție</p>
              <p className="mp-prod">{productionNotes}</p>
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
        <div className="mp-error" role="alert">
          <p>{audioError}</p>
          <button
            onClick={() => {
              setAudioError(null);
              if (audioRef.current) {
                audioRef.current.load();
              }
            }}
            className="link-u"
          >
            Încearcă din nou
          </button>
        </div>
      )}
    </>
  );
}

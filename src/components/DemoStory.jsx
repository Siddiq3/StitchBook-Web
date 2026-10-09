import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// Real screen recordings from the StitchBook app (SS Tailors demo shop), played
// one after another like a short tour. Each step's bar fills with its clip; the
// tour advances when a clip ends. Videos load only when the tour scrolls into
// view, pause when it leaves, and never autoplay for reduced-motion visitors
// (they get the poster and a Play button). Pause/Play is always available.
export default function DemoStory({ steps }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const video = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { if (inView) setLoaded(true); }, [inView]);
  // Read by the video's own ready event, so a clip that mounts after the
  // crossfade still starts when it should
  const shouldPlay = useRef(false);
  shouldPlay.current = playing && inView;

  // Play only while visible and not paused
  useEffect(() => {
    const v = video.current;
    if (!v || !loaded) return;
    if (playing && inView) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing, inView, index, loaded]);

  const go = (next) => { setProgress(0); setIndex((next + steps.length) % steps.length); };
  const step = steps[index];

  return (
    <div ref={ref} className="ds">
      <div className="ds-copy">
        <ol className="ds-steps">
          {steps.map((s, i) => (
            <li key={s.key}>
              <button type="button" className={`ds-step ${i === index ? 'is-active' : ''}`} onClick={() => go(i)} aria-current={i === index ? 'step' : undefined}>
                <span className="ds-step-title">{s.title}</span>
                <AnimatePresence initial={false}>
                  {i === index && (
                    <motion.span
                      className="ds-step-body"
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {s.body}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="ds-bar" aria-hidden="true">
                  <span className="ds-bar-fill" style={{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }} />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="ds-controls">
          <button type="button" className="ds-icon" onClick={() => go(index - 1)} aria-label="Previous clip"><ChevronLeft size={18} /></button>
          <button type="button" className="ds-icon" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause demo' : 'Play demo'}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button type="button" className="ds-icon" onClick={() => go(index + 1)} aria-label="Next clip"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="ds-stage">
        <figure className="lp-phone ds-phone">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.key}
              className="ds-media"
              initial={reduce ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {loaded ? (
                <video
                  ref={video}
                  src={step.video}
                  poster={step.poster}
                  muted
                  playsInline
                  preload="auto"
                  aria-label={step.alt}
                  onLoadedMetadata={(e) => { if (shouldPlay.current) e.currentTarget.play().catch(() => setPlaying(false)); }}
                  onTimeUpdate={(e) => setProgress(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)}
                  onEnded={() => go(index + 1)}
                />
              ) : (
                <img src={step.poster} alt={step.alt} loading="lazy" />
              )}
            </motion.div>
          </AnimatePresence>
        </figure>
        {!playing && (
          <button type="button" className="ds-play" onClick={() => setPlaying(true)} aria-label="Play demo"><Play size={22} /></button>
        )}
      </div>
    </div>
  );
}

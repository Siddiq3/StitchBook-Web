import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const labels = { orders: 'Orders made simple', neworder: 'Take orders quickly', measure: 'The right fit, saved', staff: 'Keep your team together' };

// One recording drives the slide progress. The second phone previews the next
// feature without fetching another video. Off-screen playback remains paused.
export default function DemoStory({ steps }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const video = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const shouldPlay = useRef(false);
  shouldPlay.current = playing && inView;

  useEffect(() => { if (inView) setLoaded(true); }, [inView]);
  useEffect(() => {
    const v = video.current;
    if (!v || !loaded) return;
    if (playing && inView) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing, inView, index, loaded]);

  const go = next => {
    setProgress(0);
    setFailed(false);
    setIndex((next + steps.length) % steps.length);
  };
  const step = steps[index];
  const next = steps[(index + 1) % steps.length];
  const transition = { duration: reduce ? 0 : 0.3 };

  return (
    <section ref={ref} className="ds ds-showcase" aria-label="StitchBook feature tour" aria-roledescription="carousel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step.key} className="ds-slide"
          initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={transition}>
          <div className="ds-stage">
            <figure className="lp-phone ds-phone">
              <div className="ds-media">
                {loaded && !failed ? (
                  <video ref={video} src={step.video} poster={step.poster} muted playsInline preload="metadata"
                    aria-label={step.alt}
                    onLoadedMetadata={e => { if (shouldPlay.current) e.currentTarget.play().catch(() => setPlaying(false)); }}
                    onTimeUpdate={e => setProgress(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)}
                    onEnded={() => go(index + 1)} onError={() => { setFailed(true); setPlaying(false); }} />
                ) : <img src={step.poster} alt={step.alt} loading="lazy" />}
              </div>
            </figure>
            <figure className="lp-phone ds-phone ds-next-phone">
              <img src={next.poster} alt={`Next feature: ${next.alt}`} loading="lazy" />
              <figcaption>Up next</figcaption>
            </figure>
          </div>
          <div className="ds-copy" id="demo-slide-content" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
            <span className="ds-badge">{labels[step.key] || 'Made for your shop'}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {failed && <p role="status">The video could not load. You can still explore the other steps.</p>}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="ds-controls">
        <div className="ds-progress-group">
          <div className="ds-dots" aria-label="Choose a demo step">
            {steps.map((s, i) => (
              <button key={s.key} type="button" className={`ds-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)} aria-label={`Show ${s.title}`} aria-current={i === index ? 'step' : undefined}
                aria-controls="demo-slide-content">
                <span className="ds-dot-track" aria-hidden="true"><span style={{ transform: `scaleX(${i === index ? progress : 0})` }} /></span>
              </button>
            ))}
          </div>
          <button type="button" className="ds-icon" onClick={() => { if (failed) setFailed(false); setPlaying(p => !p); }}
            aria-label={playing ? 'Pause demo' : 'Play demo'}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        </div>
        <div className="ds-arrows">
          <button type="button" className="ds-icon" onClick={() => go(index - 1)} aria-label="Previous clip"><ChevronLeft size={20} /></button>
          <button type="button" className="ds-icon" onClick={() => go(index + 1)} aria-label="Next clip"><ChevronRight size={20} /></button>
        </div>
      </div>
    </section>
  );
}

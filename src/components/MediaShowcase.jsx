import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

function Preview({ step, paused }) {
  const ref = useRef(null);
  const video = useRef(null);
  const visible = useInView(ref, { amount: 0.5 });
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const shouldPlay = visible && !paused && !failed;

  useEffect(() => { if (shouldPlay) setLoaded(true); }, [shouldPlay]);
  useEffect(() => {
    if (!video.current) return;
    if (shouldPlay) video.current.play().catch(() => {});
    else video.current.pause();
  }, [shouldPlay, loaded]);

  return (
    <a ref={ref} className="ms-card" href="#features" aria-label={`Watch demo: ${step.title}`}>
      <span className="ms-label">{step.label}</span>
      <span className="ms-screen">
        {loaded && !failed ? (
          <video ref={video} src={step.video} poster={step.poster} muted loop playsInline preload="metadata"
            aria-label={step.alt} onError={() => setFailed(true)}
            onLoadedData={() => { if (shouldPlay) video.current?.play().catch(() => {}); }} />
        ) : <img src={step.poster} alt={step.alt} width="720" height="1600" decoding="async" />}
      </span>
    </a>
  );
}

export default function MediaShowcase({ steps }) {
  const reduced = useReducedMotion();
  const [manualPause, setManualPause] = useState(null);
  const paused = manualPause ?? Boolean(reduced);
  return (
    <div className="ms" aria-label="StitchBook app previews">
      <div className="ms-track">
        {steps.map(step => <Preview key={step.key} step={step} paused={paused} />)}
      </div>
      <div className="ms-caption">
        <p>Real app screens. A smoother day at your shop.</p>
        <button type="button" className="ms-toggle" onClick={() => setManualPause(!paused)}
          aria-label={paused ? 'Play previews' : 'Pause previews'}>
          {paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Play previews' : 'Pause previews'}
        </button>
      </div>
      <p className="ms-swipe">Swipe to explore the app. Tap a preview for the full tour.</p>
    </div>
  );
}

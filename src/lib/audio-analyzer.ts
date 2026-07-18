// Audio Analyzer Service for premium sub-audible music-reactive ambient animation system.

export interface AmbientAudioData {
  bass: number;
  mid: number;
  treble: number;
  volume: number;
  isPlaying: boolean;
  reducedMotion: boolean;
}

declare global {
  interface Window {
    __ambientAudioData?: AmbientAudioData;
  }
}

// Global state initialization
if (typeof window !== "undefined") {
  window.__ambientAudioData = {
    bass: 0,
    mid: 0,
    treble: 0,
    volume: 0,
    isPlaying: false,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  // Keep preference updated
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    if (window.__ambientAudioData) {
      window.__ambientAudioData.reducedMotion = e.matches;
    }
  });
}

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;
let dataArray: Uint8Array = new Uint8Array(0);
let animationFrameId: number | null = null;

// Smoothed frequency state variables to eliminate jitter
let smoothedBass = 0;
let smoothedMid = 0;
let smoothedTreble = 0;
let smoothedVol = 0;

export function initAudioAnalyzer(audioElement: HTMLAudioElement) {
  if (typeof window === "undefined" || analyser) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256; // 128 bins (frequency bins)

    // Connect source to analyser and output destination
    source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  } catch (err) {
    console.warn("AudioContext setup failed (user interaction required first):", err);
  }
}

export function startAnalyzerLoop() {
  if (typeof window === "undefined" || !analyser || animationFrameId !== null) return;

  if (window.__ambientAudioData) {
    window.__ambientAudioData.isPlaying = true;
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const loop = () => {
    if (!analyser || !dataArray.length) return;

    analyser.getByteFrequencyData(dataArray);

    // Calculate raw energy bands (fractions from 0 to 1)
    // Bass (low frequency bins e.g. 0 to 8)
    let rawBass = 0;
    const bassBins = 8;
    for (let i = 0; i < bassBins; i++) {
      rawBass += dataArray[i];
    }
    rawBass = rawBass / bassBins / 255;

    // Mid range frequencies (bins 8 to 40)
    let rawMid = 0;
    const midBins = 32;
    for (let i = 8; i < 8 + midBins; i++) {
      rawMid += dataArray[i];
    }
    rawMid = rawMid / midBins / 255;

    // Treble range frequencies (bins 40 to 100)
    let rawTreble = 0;
    const trebleBins = 60;
    for (let i = 40; i < 40 + trebleBins; i++) {
      rawTreble += dataArray[i];
    }
    rawTreble = rawTreble / trebleBins / 255;

    // Overall volume / amplitude (all bins)
    let rawVol = 0;
    const totalBins = dataArray.length;
    for (let i = 0; i < totalBins; i++) {
      rawVol += dataArray[i];
    }
    rawVol = rawVol / totalBins / 255;

    // Low-pass filter interpolation to smooth out sudden jumps / jitter
    const k = 0.10; // Smoothing coefficient (0.10 gives smooth breathing rhythm)
    smoothedBass = smoothedBass * (1 - k) + rawBass * k;
    smoothedMid = smoothedMid * (1 - k) + rawMid * k;
    smoothedTreble = smoothedTreble * (1 - k) + rawTreble * k;
    smoothedVol = smoothedVol * (1 - k) + rawVol * k;

    // Assign to window level global variables
    if (window.__ambientAudioData) {
      window.__ambientAudioData.bass = smoothedBass;
      window.__ambientAudioData.mid = smoothedMid;
      window.__ambientAudioData.treble = smoothedTreble;
      window.__ambientAudioData.volume = smoothedVol;
    }

    animationFrameId = requestAnimationFrame(loop);
  };

  animationFrameId = requestAnimationFrame(loop);
}

export function stopAnalyzerLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (window.__ambientAudioData) {
    window.__ambientAudioData.isPlaying = false;
    window.__ambientAudioData.bass = 0;
    window.__ambientAudioData.mid = 0;
    window.__ambientAudioData.treble = 0;
    window.__ambientAudioData.volume = 0;
  }
}

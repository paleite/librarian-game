let context: AudioContext | null = null;
let masterGain: GainNode | null = null;
let filter: BiquadFilterNode | null = null;
let baseOscillator: OscillatorNode | null = null;
let fifthOscillator: OscillatorNode | null = null;
let shimmerOscillator: OscillatorNode | null = null;
let baseGain: GainNode | null = null;
let fifthGain: GainNode | null = null;
let shimmerGain: GainNode | null = null;
let started = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  context ??= new AudioContextConstructor();

  return context;
}

function createVoice(
  audioContext: AudioContext,
  frequency: number,
  type: OscillatorType,
) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.0001;

  oscillator.connect(gain);

  return { oscillator, gain };
}

function ensureStarted(): AudioContext | null {
  const audioContext = getContext();

  if (!audioContext) {
    return null;
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  if (started) {
    return audioContext;
  }

  masterGain = audioContext.createGain();
  filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  masterGain.gain.value = 0.0001;

  const base = createVoice(audioContext, 110, "sine");
  const fifth = createVoice(audioContext, 165, "triangle");
  const shimmer = createVoice(audioContext, 330, "sine");

  baseOscillator = base.oscillator;
  fifthOscillator = fifth.oscillator;
  shimmerOscillator = shimmer.oscillator;
  baseGain = base.gain;
  fifthGain = fifth.gain;
  shimmerGain = shimmer.gain;

  base.gain.connect(filter);
  fifth.gain.connect(filter);
  shimmer.gain.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(audioContext.destination);

  base.oscillator.start();
  fifth.oscillator.start();
  shimmer.oscillator.start();

  started = true;

  return audioContext;
}

function ramp(node: AudioParam | undefined, value: number, seconds: number) {
  if (!node || !context) {
    return;
  }

  const now = context.currentTime;
  node.cancelScheduledValues(now);
  node.setValueAtTime(Math.max(0.0001, node.value), now);
  node.exponentialRampToValueAtTime(Math.max(0.0001, value), now + seconds);
}

export function updateLibraryMusic({
  active,
  completionProgress,
  nightProgress,
}: {
  active: boolean;
  completionProgress: number;
  nightProgress: number;
}) {
  const audioContext = ensureStarted();

  if (!audioContext || !masterGain || !filter) {
    return;
  }

  const progress = Math.max(0, Math.min(1, completionProgress));
  const night = Math.max(0, Math.min(1, nightProgress));

  ramp(masterGain.gain, active ? 0.028 : 0.0001, 0.8);
  ramp(baseGain?.gain, active ? 0.42 : 0.0001, 0.8);
  ramp(fifthGain?.gain, active ? 0.05 + progress * 0.24 : 0.0001, 1.2);
  ramp(shimmerGain?.gain, active ? 0.01 + progress * 0.13 : 0.0001, 1.4);

  const cutoff = 2200 - night * 1100 + progress * 600;
  filter.frequency.setTargetAtTime(
    cutoff,
    audioContext.currentTime,
    0.6,
  );

  if (baseOscillator && fifthOscillator && shimmerOscillator) {
    const root = progress > 0.72 ? 123.47 : progress > 0.34 ? 116.54 : 110;

    baseOscillator.frequency.setTargetAtTime(
      root,
      audioContext.currentTime,
      0.8,
    );
    fifthOscillator.frequency.setTargetAtTime(
      root * 1.5,
      audioContext.currentTime,
      0.8,
    );
    shimmerOscillator.frequency.setTargetAtTime(
      root * (night > 0.6 ? 2 : 3),
      audioContext.currentTime,
      0.8,
    );
  }
}

export function unlockLibraryAudio() {
  const audioContext = ensureStarted();

  if (audioContext?.state === "suspended") {
    void audioContext.resume();
  }
}

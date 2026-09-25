import type { PlacementFeedback } from "@/game/rules/placement-feedback";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
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

  audioContext ??= new AudioContextConstructor();

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

function tone(
  frequency: number,
  durationSeconds: number,
  gainValue: number,
  type: OscillatorType = "sine",
  delaySeconds = 0,
) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startAt = context.currentTime + delaySeconds;
  const endAt = startAt + durationSeconds;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(endAt + 0.02);
}

function pulseDevice(milliseconds: number) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(milliseconds);
  }
}

export function playPickupCue() {
  tone(410, 0.065, 0.035, "triangle");
}

export function playPlacementCue(feedback: PlacementFeedback) {
  if (feedback === "exact") {
    tone(620, 0.08, 0.04, "triangle");
    tone(830, 0.1, 0.035, "triangle", 0.055);
    pulseDevice(18);
    return;
  }

  if (feedback === "correct-section") {
    tone(520, 0.09, 0.03, "sine");
    pulseDevice(10);
    return;
  }

  tone(180, 0.11, 0.025, "square");
}

export function playRowCompleteCue() {
  tone(523.25, 0.13, 0.045, "triangle");
  tone(659.25, 0.13, 0.04, "triangle", 0.09);
  tone(783.99, 0.18, 0.04, "triangle", 0.18);
  pulseDevice(28);
}

export function playSecretCue() {
  tone(740, 0.11, 0.04, "sine");
  tone(987, 0.15, 0.035, "sine", 0.08);
  pulseDevice(24);
}

export function playRecallCue() {
  tone(330, 0.16, 0.03, "sine");
  tone(440, 0.2, 0.035, "sine", 0.08);
  tone(660, 0.24, 0.03, "sine", 0.16);
}

export function playAchievementCue() {
  tone(660, 0.12, 0.035, "triangle");
  tone(880, 0.12, 0.035, "triangle", 0.08);
  tone(1100, 0.18, 0.03, "triangle", 0.16);
  pulseDevice(35);
}

/*
  Village Theme test track
  BPM: 90
  Key: D major
  Loop length: 16 bars, 4/4, 64 beats, about 42.67 seconds
  Mood: warm, peaceful, humble, and lightly hopeful early medieval village
  Instruments: soft square lead, triangle bass, soft pulse arpeggio, quiet noise percussion
  How to change notes later: edit MELODY_NOTES, HARMONY_BARS, BASS_NOTES,
  ARPEGGIO_NOTES, or PERCUSSION_HITS below. Keep beats inside 0-64 for the loop.
*/

const VILLAGE_THEME_BPM = 90;
const VILLAGE_THEME_BEATS_PER_BAR = 4;
const VILLAGE_THEME_BAR_COUNT = 16;
const VILLAGE_THEME_LOOP_BEATS = VILLAGE_THEME_BEATS_PER_BAR * VILLAGE_THEME_BAR_COUNT;
const VILLAGE_THEME_LOOP_SECONDS = (60 / VILLAGE_THEME_BPM) * VILLAGE_THEME_LOOP_BEATS;
const VILLAGE_THEME_DEFAULT_VOLUME = 0.62;
const VILLAGE_THEME_LOOKAHEAD_MS = 45;
const VILLAGE_THEME_SCHEDULE_AHEAD_SECONDS = 0.38;

let villageAudioContext = null;
let villageTrackGain = null;
let villageVolumeGain = null;
let villageCompressor = null;
let villagePulseWave = null;
let villageNoiseBuffer = null;
let villageScheduler = null;
let villageLoopStart = 0;
let villageNextEventIndex = 0;
let villageIsPlaying = false;
let villageWantsPlayback = false;
let villageHiddenSuspended = false;
let villageVisibilityInstalled = false;
let villageFadeTimer = null;
let villageVolume = VILLAGE_THEME_DEFAULT_VOLUME;
const villageSources = new Set();

// Harmony: one chord per bar, following a calm D-major village progression.
const HARMONY_BARS = [
  { name: 'D', root: 'D2', arp: { root: 'D4', third: 'F#4', fifth: 'A4', rootHigh: 'D5' } },
  { name: 'D', root: 'D2', arp: { root: 'D4', third: 'F#4', fifth: 'A4', rootHigh: 'D5' } },
  { name: 'G', root: 'G2', arp: { root: 'G3', third: 'B3', fifth: 'D4', rootHigh: 'G4' } },
  { name: 'G', root: 'G2', arp: { root: 'G3', third: 'B3', fifth: 'D4', rootHigh: 'G4' } },
  { name: 'Bm', root: 'B1', arp: { root: 'B3', third: 'D4', fifth: 'F#4', rootHigh: 'B4' } },
  { name: 'Bm', root: 'B1', arp: { root: 'B3', third: 'D4', fifth: 'F#4', rootHigh: 'B4' } },
  { name: 'A', root: 'A1', arp: { root: 'A3', third: 'C#4', fifth: 'E4', rootHigh: 'A4' } },
  { name: 'A', root: 'A1', arp: { root: 'A3', third: 'C#4', fifth: 'E4', rootHigh: 'A4' } },
  { name: 'D', root: 'D2', arp: { root: 'D4', third: 'F#4', fifth: 'A4', rootHigh: 'D5' } },
  { name: 'D', root: 'D2', arp: { root: 'D4', third: 'F#4', fifth: 'A4', rootHigh: 'D5' } },
  { name: 'G', root: 'G2', arp: { root: 'G3', third: 'B3', fifth: 'D4', rootHigh: 'G4' } },
  { name: 'G', root: 'G2', arp: { root: 'G3', third: 'B3', fifth: 'D4', rootHigh: 'G4' } },
  { name: 'Em', root: 'E2', arp: { root: 'E3', third: 'G3', fifth: 'B3', rootHigh: 'E4' } },
  { name: 'Em', root: 'E2', arp: { root: 'E3', third: 'G3', fifth: 'B3', rootHigh: 'E4' } },
  { name: 'A', root: 'A1', arp: { root: 'A3', third: 'C#4', fifth: 'E4', rootHigh: 'A4' } },
  { name: 'A', root: 'A1', arp: { root: 'A3', third: 'C#4', fifth: 'E4', rootHigh: 'A4' } }
];

// Melody notes: small original D-major phrases with rests so the loop can breathe.
const MELODY_NOTES = [
  { beat: 14, note: 'A4', duration: 0.45, velocity: 0.55 },
  { beat: 14.75, note: 'B4', duration: 0.45, velocity: 0.55 },
  { beat: 15.5, note: 'A4', duration: 0.38, velocity: 0.5 },

  { beat: 16, note: 'F#4', duration: 0.75, velocity: 0.85 },
  { beat: 17, note: 'A4', duration: 0.6, velocity: 0.78 },
  { beat: 18, note: 'B4', duration: 0.75, velocity: 0.9 },
  { beat: 19, note: 'A4', duration: 0.6, velocity: 0.76 },
  { beat: 20, note: 'F#4', duration: 0.7, velocity: 0.76 },
  { beat: 21.5, note: 'E4', duration: 0.55, velocity: 0.65 },
  { beat: 22.5, note: 'F#4', duration: 0.6, velocity: 0.74 },
  { beat: 24, note: 'E4', duration: 0.65, velocity: 0.72 },
  { beat: 25, note: 'F#4', duration: 0.6, velocity: 0.72 },
  { beat: 26, note: 'A4', duration: 0.75, velocity: 0.85 },
  { beat: 27, note: 'B4', duration: 0.55, velocity: 0.78 },
  { beat: 28, note: 'A4', duration: 0.7, velocity: 0.74 },
  { beat: 29, note: 'F#4', duration: 0.6, velocity: 0.68 },
  { beat: 30, note: 'E4', duration: 0.6, velocity: 0.62 },
  { beat: 31.25, note: 'C#4', duration: 0.5, velocity: 0.5 },

  { beat: 32, note: 'A4', duration: 0.65, velocity: 0.78 },
  { beat: 33, note: 'B4', duration: 0.6, velocity: 0.8 },
  { beat: 34, note: 'A4', duration: 0.6, velocity: 0.72 },
  { beat: 35.25, note: 'F#4', duration: 0.5, velocity: 0.6 },
  { beat: 36, note: 'D5', duration: 0.65, velocity: 0.82 },
  { beat: 37, note: 'C#5', duration: 0.55, velocity: 0.74 },
  { beat: 38, note: 'B4', duration: 0.6, velocity: 0.72 },
  { beat: 39.25, note: 'A4', duration: 0.5, velocity: 0.62 },
  { beat: 40, note: 'G4', duration: 0.65, velocity: 0.72 },
  { beat: 41, note: 'A4', duration: 0.6, velocity: 0.74 },
  { beat: 42, note: 'B4', duration: 0.7, velocity: 0.78 },
  { beat: 43, note: 'D5', duration: 0.55, velocity: 0.8 },
  { beat: 44, note: 'B4', duration: 0.6, velocity: 0.7 },
  { beat: 45, note: 'A4', duration: 0.55, velocity: 0.66 },
  { beat: 46.25, note: 'G4', duration: 0.55, velocity: 0.58 },
  { beat: 47.25, note: 'F#4', duration: 0.45, velocity: 0.52 },

  { beat: 48, note: 'G4', duration: 0.7, velocity: 0.68 },
  { beat: 49.25, note: 'F#4', duration: 0.55, velocity: 0.58 },
  { beat: 50.5, note: 'E4', duration: 0.65, velocity: 0.56 },
  { beat: 52, note: 'B3', duration: 0.55, velocity: 0.5 },
  { beat: 53, note: 'D4', duration: 0.6, velocity: 0.55 },
  { beat: 54.25, note: 'E4', duration: 0.55, velocity: 0.58 },
  { beat: 55.25, note: 'F#4', duration: 0.5, velocity: 0.58 },
  { beat: 56, note: 'E4', duration: 0.6, velocity: 0.62 },
  { beat: 57, note: 'F#4', duration: 0.55, velocity: 0.64 },
  { beat: 58.25, note: 'A4', duration: 0.6, velocity: 0.7 },
  { beat: 59.25, note: 'C#5', duration: 0.5, velocity: 0.64 },
  { beat: 60, note: 'B4', duration: 0.6, velocity: 0.58 },
  { beat: 61, note: 'A4', duration: 0.55, velocity: 0.54 },
  { beat: 62, note: 'E4', duration: 0.55, velocity: 0.48 },
  { beat: 63, note: 'C#4', duration: 0.45, velocity: 0.42 }
];

// Bass notes: simple roots on beats 1 and 3 for a warm foundation.
const BASS_NOTES = HARMONY_BARS.flatMap((bar, index) => {
  const beat = index * VILLAGE_THEME_BEATS_PER_BAR;
  const lastBar = index === HARMONY_BARS.length - 1;
  return [
    { beat, note: bar.root, duration: 1.55, velocity: 0.72 },
    { beat: beat + 2, note: bar.root, duration: lastBar ? 1.15 : 1.4, velocity: lastBar ? 0.58 : 0.62 }
  ];
});

// Arpeggio notes: steady eighth-note pulse chords, softened to feel like a small lute pattern.
const ARPEGGIO_PATTERNS = [
  ['root', 'fifth', 'third', 'fifth', 'rootHigh', 'fifth', 'third', 'fifth'],
  ['root', 'third', 'fifth', 'third', 'rootHigh', 'fifth', 'third', 'root'],
  ['fifth', 'rootHigh', 'third', 'fifth', 'root', 'third', 'fifth', 'third'],
  ['root', 'fifth', 'third', 'fifth', 'third', 'fifth', 'root', 'fifth']
];

const ARPEGGIO_NOTES = HARMONY_BARS.flatMap((bar, index) => {
  const section = index < 4 ? 0 : index < 8 ? 1 : index < 12 ? 2 : 3;
  const pattern = ARPEGGIO_PATTERNS[section];
  const start = index * VILLAGE_THEME_BEATS_PER_BAR;
  return pattern.map((role, step) => ({
    beat: start + step * 0.5,
    note: bar.arp[role],
    duration: index === 15 && step >= 6 ? 0.25 : 0.34,
    velocity: step % 2 === 0 ? 0.62 : 0.5
  }));
});

// Percussion hits: restrained noise-channel kick, snare, and occasional high ticks.
const PERCUSSION_HITS = HARMONY_BARS.flatMap((_, index) => {
  const beat = index * VILLAGE_THEME_BEATS_PER_BAR;
  const soft = index < 4 ? 0.75 : 1;
  const hits = [
    { beat, kind: 'kick', velocity: 0.44 * soft },
    { beat: beat + 1, kind: 'snare', velocity: 0.32 * soft },
    { beat: beat + 2, kind: 'kick', velocity: 0.36 * soft },
    { beat: beat + 3, kind: 'snare', velocity: 0.28 * soft }
  ];
  if ([3, 7, 11, 15].includes(index)) {
    hits.push({ beat: beat + 1.5, kind: 'hat', velocity: 0.18 });
    hits.push({ beat: beat + 3.5, kind: 'hat', velocity: 0.15 });
  } else if ([5, 9, 13].includes(index)) {
    hits.push({ beat: beat + 2.5, kind: 'hat', velocity: 0.13 });
  }
  return hits;
});

const VILLAGE_THEME_EVENTS = [
  ...MELODY_NOTES.map(event => ({ type: 'melody', ...event })),
  ...BASS_NOTES.map(event => ({ type: 'bass', ...event })),
  ...ARPEGGIO_NOTES.map(event => ({ type: 'arpeggio', ...event })),
  ...PERCUSSION_HITS.map(event => ({ type: 'percussion', ...event }))
].sort((a, b) => a.beat - b.beat || eventSortOrder(a.type) - eventSortOrder(b.type));

function eventSortOrder(type) {
  return { bass: 0, percussion: 1, arpeggio: 2, melody: 3 }[type] || 4;
}

function beatToSeconds(beat) {
  return (60 / VILLAGE_THEME_BPM) * beat;
}

function clamp01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(1, number));
}

function getAudioContextConstructor() {
  return window.AudioContext || window.webkitAudioContext;
}

function ensureVillageAudio() {
  if (villageAudioContext) return villageAudioContext;
  const AudioContextConstructor = getAudioContextConstructor();
  if (!AudioContextConstructor) throw new Error('Web Audio API is not available in this browser.');
  villageAudioContext = new AudioContextConstructor();
  villageTrackGain = villageAudioContext.createGain();
  villageVolumeGain = villageAudioContext.createGain();
  villageCompressor = villageAudioContext.createDynamicsCompressor();
  villageTrackGain.gain.value = 0.0001;
  villageVolumeGain.gain.value = villageVolume;
  villageCompressor.threshold.value = -18;
  villageCompressor.knee.value = 16;
  villageCompressor.ratio.value = 3;
  villageCompressor.attack.value = 0.004;
  villageCompressor.release.value = 0.18;
  villageTrackGain.connect(villageVolumeGain);
  villageVolumeGain.connect(villageCompressor);
  villageCompressor.connect(villageAudioContext.destination);
  villagePulseWave = createPulseWave(villageAudioContext, 0.34);
  villageNoiseBuffer = createNoiseBuffer(villageAudioContext);
  installVillageVisibilityHandler();
  return villageAudioContext;
}

function createPulseWave(context, duty) {
  const harmonics = 32;
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  for (let n = 1; n < harmonics; n++) {
    imag[n] = (2 / (n * Math.PI)) * Math.sin(2 * Math.PI * n * duty);
  }
  return context.createPeriodicWave(real, imag, { disableNormalization: false });
}

function createNoiseBuffer(context) {
  const seconds = 1;
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function noteToFrequency(note) {
  const match = String(note).match(/^([A-G]#?)(-?\d)$/);
  if (!match) throw new Error('Invalid note name: ' + note);
  const pitchClass = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }[match[1]];
  const octave = Number(match[2]);
  const midi = (octave + 1) * 12 + pitchClass;
  return 440 * 2 ** ((midi - 69) / 12);
}

function trackVillageSource(source) {
  villageSources.add(source);
  source.addEventListener('ended', () => villageSources.delete(source), { once: true });
}

function scheduleEnvelope(gain, start, end, peak, attack, release, sustain) {
  const safePeak = Math.max(0.0001, peak);
  const attackEnd = Math.min(end - 0.01, start + attack);
  const releaseStart = Math.max(attackEnd + 0.01, end - release);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(safePeak, attackEnd);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, safePeak * sustain), releaseStart);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
}

function scheduleOscillatorNote(event, start, settings) {
  const context = villageAudioContext;
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const duration = beatToSeconds(event.duration);
  const end = start + duration;
  const peak = settings.gain * (event.velocity ?? 1);
  oscillator.frequency.setValueAtTime(noteToFrequency(event.note), start);
  if (settings.wave === 'pulse') oscillator.setPeriodicWave(villagePulseWave);
  else oscillator.type = settings.wave;
  filter.type = settings.filterType || 'lowpass';
  filter.frequency.setValueAtTime(settings.filterFrequency, start);
  filter.Q.value = settings.q ?? 0.7;
  scheduleEnvelope(gain, start, end, peak, settings.attack, settings.release, settings.sustain);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(villageTrackGain);
  trackVillageSource(oscillator);
  oscillator.start(start);
  oscillator.stop(end + 0.04);
}

function schedulePercussionHit(event, start) {
  const context = villageAudioContext;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const settings = {
    kick: { duration: 0.13, gain: 0.045, filter: 'lowpass', frequency: 135, endFrequency: 55, q: 0.7 },
    snare: { duration: 0.095, gain: 0.026, filter: 'bandpass', frequency: 950, q: 0.85 },
    hat: { duration: 0.045, gain: 0.013, filter: 'highpass', frequency: 5200, q: 0.5 }
  }[event.kind];
  const velocity = event.velocity ?? 1;
  const end = start + settings.duration;
  source.buffer = villageNoiseBuffer;
  source.loop = true;
  filter.type = settings.filter;
  filter.frequency.setValueAtTime(settings.frequency, start);
  if (settings.endFrequency) {
    filter.frequency.exponentialRampToValueAtTime(settings.endFrequency, end);
  }
  filter.Q.value = settings.q;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, settings.gain * velocity), start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(villageTrackGain);
  trackVillageSource(source);
  source.start(start, Math.random() * 0.25);
  source.stop(end + 0.03);
}

function scheduleVillageEvent(event, start) {
  if (event.type === 'melody') {
    scheduleOscillatorNote(event, start, {
      wave: 'square',
      gain: 0.043,
      filterFrequency: 2200,
      attack: 0.018,
      release: 0.08,
      sustain: 0.55
    });
    return;
  }
  if (event.type === 'bass') {
    scheduleOscillatorNote(event, start, {
      wave: 'triangle',
      gain: 0.036,
      filterFrequency: 520,
      attack: 0.025,
      release: 0.18,
      sustain: 0.72
    });
    return;
  }
  if (event.type === 'arpeggio') {
    scheduleOscillatorNote(event, start, {
      wave: 'pulse',
      gain: 0.021,
      filterFrequency: 1500,
      attack: 0.006,
      release: 0.075,
      sustain: 0.34
    });
    return;
  }
  if (event.type === 'percussion') {
    schedulePercussionHit(event, start);
  }
}

function scheduleVillageEvents() {
  if (!villageIsPlaying || !villageAudioContext) return;
  const context = villageAudioContext;
  while (villageLoopStart + VILLAGE_THEME_LOOP_SECONDS < context.currentTime - 0.05) {
    villageLoopStart += VILLAGE_THEME_LOOP_SECONDS;
    villageNextEventIndex = 0;
  }
  let guard = 0;
  const scheduleUntil = context.currentTime + VILLAGE_THEME_SCHEDULE_AHEAD_SECONDS;
  while (villageIsPlaying && guard < VILLAGE_THEME_EVENTS.length * 2) {
    guard++;
    if (villageNextEventIndex >= VILLAGE_THEME_EVENTS.length) {
      villageNextEventIndex = 0;
      villageLoopStart += VILLAGE_THEME_LOOP_SECONDS;
    }
    const event = VILLAGE_THEME_EVENTS[villageNextEventIndex];
    const eventTime = villageLoopStart + beatToSeconds(event.beat);
    if (eventTime > scheduleUntil) break;
    if (eventTime >= context.currentTime - 0.02) {
      scheduleVillageEvent(event, eventTime);
    }
    villageNextEventIndex++;
  }
}

function startVillageScheduler() {
  if (villageScheduler) return;
  villageScheduler = window.setInterval(scheduleVillageEvents, VILLAGE_THEME_LOOKAHEAD_MS);
  scheduleVillageEvents();
}

function clearVillageScheduler() {
  if (!villageScheduler) return;
  window.clearInterval(villageScheduler);
  villageScheduler = null;
}

function installVillageVisibilityHandler() {
  if (villageVisibilityInstalled || typeof document === 'undefined') return;
  villageVisibilityInstalled = true;
  document.addEventListener('visibilitychange', () => {
    if (!villageAudioContext) {
      if (!document.hidden && villageWantsPlayback) startVillageTheme();
      return;
    }
    if (document.hidden) {
      villageHiddenSuspended = villageWantsPlayback && villageAudioContext.state === 'running';
      if (villageWantsPlayback) villageAudioContext.suspend();
      return;
    }
    if (villageWantsPlayback && !villageIsPlaying) {
      startVillageTheme();
      return;
    }
    if (villageWantsPlayback && villageHiddenSuspended) {
      villageAudioContext.resume().finally(() => {
        villageHiddenSuspended = false;
      });
    }
  });
}

export async function startVillageTheme() {
  villageWantsPlayback = true;
  installVillageVisibilityHandler();
  if (typeof document !== 'undefined' && document.hidden) return;
  const context = ensureVillageAudio();
  if (villageFadeTimer) {
    window.clearTimeout(villageFadeTimer);
    villageFadeTimer = null;
  }
  if (villageIsPlaying) {
    if (context.state === 'suspended') await context.resume();
    return;
  }
  if (context.state === 'suspended') await context.resume();
  villageIsPlaying = true;
  villageLoopStart = context.currentTime + 0.08;
  villageNextEventIndex = 0;
  villageTrackGain.gain.cancelScheduledValues(context.currentTime);
  villageTrackGain.gain.setValueAtTime(0.0001, context.currentTime);
  villageTrackGain.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.8);
  startVillageScheduler();
}

export function stopVillageTheme() {
  villageWantsPlayback = false;
  villageHiddenSuspended = false;
  clearVillageScheduler();
  if (!villageAudioContext || !villageTrackGain) {
    villageIsPlaying = false;
    return;
  }
  const context = villageAudioContext;
  const now = context.currentTime;
  villageIsPlaying = false;
  villageTrackGain.gain.cancelScheduledValues(now);
  villageTrackGain.gain.setValueAtTime(Math.max(0.0001, villageTrackGain.gain.value), now);
  villageTrackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
  if (villageFadeTimer) window.clearTimeout(villageFadeTimer);
  villageFadeTimer = window.setTimeout(() => {
    villageSources.forEach(source => {
      try {
        source.stop(0);
      } catch (_) {
        // Already stopped sources are removed by their ended event.
      }
    });
    villageSources.clear();
    if (villageTrackGain) villageTrackGain.gain.value = 0.0001;
    villageFadeTimer = null;
  }, 850);
}

export function setMusicVolume(value) {
  villageVolume = clamp01(value);
  if (villageVolumeGain && villageAudioContext) {
    const now = villageAudioContext.currentTime;
    villageVolumeGain.gain.cancelScheduledValues(now);
    villageVolumeGain.gain.linearRampToValueAtTime(villageVolume, now + 0.05);
  }
  return villageVolume;
}

export function getVillageThemeVolume() {
  return villageVolume;
}

if (typeof window !== 'undefined') {
  window.startVillageTheme = startVillageTheme;
  window.stopVillageTheme = stopVillageTheme;
  window.setMusicVolume = setMusicVolume;
  window.getVillageThemeVolume = getVillageThemeVolume;
}

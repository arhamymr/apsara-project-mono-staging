// Shared utilities for Assistant components

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
};

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

export function filterApps<T extends { id: string; name: string }>(
  apps: T[],
  q: string,
): T[] {
  const s = q.trim().toLowerCase();
  if (!s) return apps;
  return apps.filter((a) => a.name?.toLowerCase().includes(s));
}

// Speech synthesis (TTS)
export function speak(text: string) {
  try {
    if (typeof window === 'undefined') return;
    const synth: SpeechSynthesis | undefined = window.speechSynthesis;
    if (!synth) return;
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  } catch {
    // no-op
  }
}

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    SpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

export function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') return null;
  const RecognitionCtor =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!RecognitionCtor) return null;
  const recognition = new RecognitionCtor();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true;
  return recognition;
}

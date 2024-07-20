import { useState } from "react";

interface Props {
  answer: string;
}

const SpeechSynthesis =
  (window as any).speechSynthesis || (window as any).webkitSpeechSynthesis;

let synth: SpeechSynthesis | null = null;

try {
  synth = SpeechSynthesis;
} catch (err) {
  console.error("SpeechSynthesis is not supported");
}

const getUtterance = function (text: string) {
  if (synth) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.voice = synth
      .getVoices()
      .filter((voice: SpeechSynthesisVoice) => voice.lang === "en-US")[0];
    return utterance;
  }
};

export const SpeechOutputBrowser = ({ answer }: Props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const startOrStopSpeech = (answer: string) => {
    if (synth != null) {
      if (isPlaying) {
        synth.cancel(); // removes all utterances from the utterance queue.
        setIsPlaying(false);
        return;
      }
      const utterance: SpeechSynthesisUtterance | undefined =
        getUtterance(answer);

      if (!utterance) {
        return;
      }

      synth.speak(utterance);

      utterance.onstart = () => {
        setIsPlaying(true);
        return;
      };

      utterance.onend = () => {
        setIsPlaying(false);
        return;
      };
    }
  };
  const color = isPlaying ? "text-red-500" : "text-black";

  return (
    <button
      className={`btn btn-circle btn-outline ${color}`}
      title="Speak answer"
      aria-label="Speak answer"
      onClick={() => startOrStopSpeech(answer)}
      disabled={!synth}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 10h1l9 9-4.5-4.5 1.5-1.5L21 3h-1l-9 9-1.5 1.5L3 13v-1z"
        />
      </svg>
    </button>
  );
};

import { useState } from "react";

interface Props {
  url: string | null;
}

let audio = new Audio();

export const SpeechOutputAzure = ({ url }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const startOrStopAudio = async () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (!url) {
      console.error("Speech output is not yet available.");
      return;
    }
    audio = new Audio(url);
    await audio.play();
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
  };

  const color = isPlaying ? "text-red-500" : "text-black";
  return (
    <button
      className={`btn btn-circle btn-outline ${color}`}
      title="Speak answer"
      aria-label="Speak answer"
      onClick={() => startOrStopAudio()}
      disabled={!url}
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

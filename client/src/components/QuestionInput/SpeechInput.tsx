import { SetStateAction, useState } from "react";

interface Props {
  updateQuestion: (question: string) => void;
}

const SpeechRecognition =
  (window as any).speechRecognition || (window as any).webkitSpeechRecognition;
let speechRecognition: {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: (event: {
    results: { transcript: SetStateAction<string> }[][];
  }) => void;
  onend: () => void;
  onerror: (event: { error: string }) => void;
  stop: () => void;
} | null = null;
try {
  speechRecognition = new SpeechRecognition();
  if (speechRecognition != null) {
    speechRecognition.lang = "en-US";
    speechRecognition.interimResults = true;
  }
} catch (err) {
  console.error("SpeechRecognition not supported");
  speechRecognition = null;
}

export const SpeechInput = ({ updateQuestion }: Props) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = () => {
    if (speechRecognition == null) {
      console.error("SpeechRecognition not supported");
      return;
    }

    speechRecognition.onresult = (event: {
      results: { transcript: SetStateAction<string> }[][];
    }) => {
      let input = "";
      for (const result of event.results) {
        input += result[0].transcript;
      }
      updateQuestion(input);
    };
    speechRecognition.onend = () => {
      // NOTE: In some browsers (e.g. Chrome), the recording will stop automatically after a few seconds of silence.
      setIsRecording(false);
    };
    speechRecognition.onerror = (event: { error: string }) => {
      if (speechRecognition) {
        speechRecognition.stop();
        if (event.error == "no-speech") {
          alert(
            "No speech was detected. Please check your system audio settings and try again."
          );
        } else if (event.error == "language-not-supported") {
          alert(
            `Speech recognition error detected: ${event.error}. The speech recognition input functionality does not yet work on all browsers, like Edge in Mac OS X with ARM chips. Try another browser/OS.`
          );
        } else {
          alert(`Speech recognition error detected: ${event.error}.`);
        }
      }
    };

    setIsRecording(true);
    speechRecognition.start();
  };

  const stopRecording = () => {
    if (speechRecognition == null) {
      console.error("SpeechRecognition not supported");
      return;
    }
    speechRecognition.stop();
    setIsRecording(false);
  };

  if (speechRecognition == null) {
    return <></>;
  }
  return (
    <>
      {!isRecording && (
        <div className="flex items-center">
          <div className="tooltip" data-tip="Ask question with voice">
            <button
              className="btn btn-circle btn-outline"
              onClick={startRecording}
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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l6.16-3.422A12.042 12.042 0 0118 6.84V5a9.97 9.97 0 00-3-7.195A9.97 9.97 0 0012 1m0 13v8m0-8l-6.16 3.422A12.042 12.042 0 016 6.84V5a9.97 9.97 0 013-7.195A9.97 9.97 0 0112 1v12z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {isRecording && (
        <div className="flex items-center">
          <div className="tooltip" data-tip="Stop recording question">
            <button
              className="btn btn-circle btn-outline"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12h3m4 0h-3m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m2 0a6 6 0 00-12 0 6 6 0 0012 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

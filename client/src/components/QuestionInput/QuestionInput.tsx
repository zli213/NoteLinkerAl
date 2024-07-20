import { useState, useEffect, useContext } from "react";
// import { LoginContext } from "../../loginContext";
// import { requireLogin } from "../../authConfig";
import { SpeechInput } from "./SpeechInput";

interface Props {
  onSend: (question: string) => void;
  disabled: boolean;
  initQuestion?: string;
  placeholder?: string;
  clearOnSend?: boolean;
  showSpeechInput?: boolean;
}

export const QuestionInput = ({
  onSend,
  disabled,
  placeholder,
  clearOnSend,
  initQuestion,
  showSpeechInput,
}: Props) => {
  const [question, setQuestion] = useState<string>("");
  // const { loggedIn } = useContext(LoginContext);

  useEffect(() => {
    initQuestion && setQuestion(initQuestion);
  }, [initQuestion]);

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return;
    }

    onSend(question);

    if (clearOnSend) {
      setQuestion("");
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = ev.target.value;
    if (!newValue) {
      setQuestion("");
    } else if (newValue.length <= 1000) {
      setQuestion(newValue);
    }
  };

  // const disableRequiredAccessControl = requireLogin && !loggedIn;
  // const sendQuestionDisabled = disabled || !question.trim() || (requireLogin && !loggedIn);

  // if (disableRequiredAccessControl) {
  //     placeholder = "Please login to continue...";
  // }

  return (
    <div className="flex items-start space-x-2">
      <textarea
        className="textarea textarea-bordered w-full resize-none"
        // disabled={disableRequiredAccessControl}
        placeholder={placeholder}
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      ></textarea>
      <button
        className="btn btn-primary"
        // disabled={sendQuestionDisabled}
        onClick={sendQuestion}
        title="Submit question"
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
      {showSpeechInput && <SpeechInput updateQuestion={setQuestion} />}
    </div>
  );
};

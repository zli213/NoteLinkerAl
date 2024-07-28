import { useState, useEffect } from "react";
import { SpeechInput } from "./SpeechInput";
import { Send } from "lucide-react";
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

  return (
    <div className="flex space-x-2 items-center">
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
        <Send />
      </button>
      {showSpeechInput && <SpeechInput updateQuestion={setQuestion} />}
    </div>
  );
};

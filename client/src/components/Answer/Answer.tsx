import { useMemo } from "react";
import DOMPurify from "dompurify";
import { ChatAppResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";
import { SpeechOutputBrowser } from "./SpeechOutputBrowser";
import { SpeechOutputAzure } from "./SpeechOutputAzure";

interface Props {
  answer: ChatAppResponse;
  isSelected?: boolean;
  isStreaming: boolean;
  onCitationClicked: (filePath: string) => void;
  onThoughtProcessClicked: () => void;
  onSupportingContentClicked: () => void;
  onFollowupQuestionClicked?: (question: string) => void;
  showFollowupQuestions?: boolean;
  showSpeechOutputBrowser?: boolean;
  showSpeechOutputAzure?: boolean;
  speechUrl: string | null;
}

export const Answer = ({
  answer,
  isSelected,
  isStreaming,
  onCitationClicked,
  onThoughtProcessClicked,
  onSupportingContentClicked,
  onFollowupQuestionClicked,
  showFollowupQuestions,
  showSpeechOutputAzure,
  showSpeechOutputBrowser,
  speechUrl,
}: Props) => {
  const followupQuestions = answer.context?.followup_questions;
  const messageContent = answer.message.content;
  const parsedAnswer = useMemo(
    () => parseAnswerToHtml(messageContent, isStreaming, onCitationClicked),
    [answer]
  );

  const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);

  return (
    <div
      className={`p-4 border rounded-lg ${
        isSelected ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <AnswerIcon />
        <div className="flex space-x-2">
          <button
            className="btn btn-sm btn-circle btn-outline"
            onClick={() => onThoughtProcessClicked()}
            disabled={!answer.context.thoughts?.length}
            title="Show thought process"
          >
            <i className="fas fa-lightbulb"></i>
          </button>
          <button
            className="btn btn-sm btn-circle btn-outline"
            onClick={() => onSupportingContentClicked()}
            disabled={!answer.context.data_points}
            title="Show supporting content"
          >
            <i className="fas fa-clipboard-list"></i>
          </button>
          {showSpeechOutputAzure && <SpeechOutputAzure url={speechUrl} />}
          {showSpeechOutputBrowser && (
            <SpeechOutputBrowser answer={sanitizedAnswerHtml} />
          )}
        </div>
      </div>

      <div
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}
      ></div>

      {!!parsedAnswer.citations.length && (
        <div className="mb-4">
          <span className="font-bold">Citations:</span>
          <div className="flex flex-wrap gap-2">
            {parsedAnswer.citations.map((x, i) => {
              const path = getCitationFilePath(x);
              return (
                <a
                  key={i}
                  className="link link-primary"
                  title={x}
                  onClick={() => onCitationClicked(path)}
                >
                  {`${++i}. ${x}`}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {!!followupQuestions?.length &&
        showFollowupQuestions &&
        onFollowupQuestionClicked && (
          <div>
            <span className="font-bold">Follow-up questions:</span>
            <div className="flex flex-wrap gap-2">
              {followupQuestions.map((x, i) => {
                return (
                  <a
                    key={i}
                    className="link link-primary"
                    title={x}
                    onClick={() => onFollowupQuestionClicked(x)}
                  >
                    {`${x}`}
                  </a>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

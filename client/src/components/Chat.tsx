import { useRef, useState, useEffect, useContext } from "react";
import readNDJSONStream from "ndjson-readablestream";
import {
  chatApi,
  getSpeechApi,
  RetrievalMode,
  ChatAppResponse,
  ChatAppResponseOrError,
  ChatAppRequest,
  ResponseMessage,
  VectorFieldOptions,
  GPT4VInput,
} from "./../api";
import { Answer, AnswerError, AnswerLoading } from "./Answer";
import { QuestionInput } from "./QuestionInput";
// import { ExampleList } from "./Example";
import { UserChatMessage } from "./UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "./AnalysisPanel";
import { useAuth } from "../store/AuthContext";
import { UploadFile } from "./UploadFIle";
import { GPT4VSettings } from "./GPT4VSettings";
import { VectorSettings } from "./VectorSettings";
// import { useMsal } from "@azure/msal-react";
// import { LoginContext } from "../../loginContext";

const Chat = () => {
  const [promptTemplate, setPromptTemplate] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.3);
  const [seed, setSeed] = useState<number | null>(null);
  const [minimumRerankerScore, setMinimumRerankerScore] = useState<number>(0);
  const [minimumSearchScore, setMinimumSearchScore] = useState<number>(0);
  const [retrieveCount, setRetrieveCount] = useState<number>(3);
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>(
    RetrievalMode.Hybrid
  );
  const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
  const [shouldStream, setShouldStream] = useState<boolean>(true);
  const [useSemanticCaptions, setUseSemanticCaptions] =
    useState<boolean>(false);
  const [excludeCategory, setExcludeCategory] = useState<string>("");
  const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] =
    useState<boolean>(false);
  const [vectorFieldList, setVectorFieldList] = useState<VectorFieldOptions[]>([
    VectorFieldOptions.Embedding,
  ]);
  const [useOidSecurityFilter, setUseOidSecurityFilter] =
    useState<boolean>(false);
  const [useGroupsSecurityFilter, setUseGroupsSecurityFilter] =
    useState<boolean>(false);
  const [gpt4vInput, setGPT4VInput] = useState<GPT4VInput>(
    GPT4VInput.TextAndImages
  );
  const [useGPT4V, setUseGPT4V] = useState<boolean>(false);

  const lastQuestionRef = useRef<string>("");
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();

  const [activeCitation, setActiveCitation] = useState<string>();
  const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<
    AnalysisPanelTabs | undefined
  >(undefined);

  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
  const [answers, setAnswers] = useState<
    [user: string, response: ChatAppResponse][]
  >([]);
  const [streamedAnswers, setStreamedAnswers] = useState<
    [user: string, response: ChatAppResponse][]
  >([]);
  const [speechUrls, setSpeechUrls] = useState<(string | null)[]>([]);

  const [showGPT4VOptions, setShowGPT4VOptions] = useState<boolean>(false);
  const [showSemanticRankerOption, setShowSemanticRankerOption] =
    useState<boolean>(false);
  const [showVectorOption, setShowVectorOption] = useState<boolean>(false);
  const [showUserUpload, setShowUserUpload] = useState<boolean>(false);
  const [showSpeechInput, setShowSpeechInput] = useState<boolean>(false);
  const [showSpeechOutputBrowser, setShowSpeechOutputBrowser] =
    useState<boolean>(false);
  const [showSpeechOutputAzure, setShowSpeechOutputAzure] =
    useState<boolean>(false);

  const handleAsyncRequest = async (
    question: string,
    answers: [string, ChatAppResponse][],
    responseBody: ReadableStream<any>
  ) => {
    let answer: string = "";
    let askResponse: ChatAppResponse = {} as ChatAppResponse;

    const updateState = (newContent: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          answer += newContent;
          const latestResponse: ChatAppResponse = {
            ...askResponse,
            message: { content: answer, role: askResponse.message.role },
          };
          setStreamedAnswers([...answers, [question, latestResponse]]);
          resolve(null);
        }, 33);
      });
    };
    try {
      setIsStreaming(true);
      for await (const event of readNDJSONStream(responseBody)) {
        if (event["context"] && event["context"]["data_points"]) {
          event["message"] = event["delta"];
          askResponse = event as ChatAppResponse;
        } else if (event["delta"]["content"]) {
          setIsLoading(false);
          await updateState(event["delta"]["content"]);
        } else if (event["context"]) {
          askResponse.context = { ...askResponse.context, ...event["context"] };
        } else if (event["error"]) {
          throw Error(event["error"]);
        }
      }
    } finally {
      setIsStreaming(false);
    }
    const fullResponse: ChatAppResponse = {
      ...askResponse,
      message: { content: answer, role: askResponse.message.role },
    };
    return fullResponse;
  };
  const { isLoggedIn } = useAuth();

  const makeApiRequest = async (question: string) => {
    lastQuestionRef.current = question;

    error && setError(undefined);
    setIsLoading(true);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);
    const token = isLoggedIn ? localStorage.getItem("token") : undefined;

    try {
      const messages: ResponseMessage[] = answers.flatMap((a) => [
        { content: a[0], role: "user" },
        { content: a[1].message.content, role: "assistant" },
      ]);

      const request: ChatAppRequest = {
        messages: [...messages, { content: question, role: "user" }],
        context: {
          overrides: {
            prompt_template:
              promptTemplate.length === 0 ? undefined : promptTemplate,
            exclude_category:
              excludeCategory.length === 0 ? undefined : excludeCategory,
            top: retrieveCount,
            temperature: temperature,
            minimum_reranker_score: minimumRerankerScore,
            minimum_search_score: minimumSearchScore,
            retrieval_mode: retrievalMode,
            semantic_ranker: useSemanticRanker,
            semantic_captions: useSemanticCaptions,
            suggest_followup_questions: useSuggestFollowupQuestions,
            use_oid_security_filter: useOidSecurityFilter,
            use_groups_security_filter: useGroupsSecurityFilter,
            vector_fields: vectorFieldList,
            use_gpt4v: useGPT4V,
            gpt4v_input: gpt4vInput,
            ...(seed !== null ? { seed: seed } : {}),
          },
        },
        session_state: answers.length
          ? answers[answers.length - 1][1].session_state
          : null,
      };

      const response = await chatApi(request, shouldStream, token || "");
      if (!response.body) {
        throw Error("No response body");
      }
      if (shouldStream) {
        const parsedResponse: ChatAppResponse = await handleAsyncRequest(
          question,
          answers,
          response.body
        );
        setAnswers([...answers, [question, parsedResponse]]);
      } else {
        const parsedResponse: ChatAppResponseOrError = await response.json();
        if (response.status > 299 || !response.ok) {
          throw Error(parsedResponse.error || "Unknown error");
        }
        setAnswers([...answers, [question, parsedResponse as ChatAppResponse]]);
      }
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    lastQuestionRef.current = "";
    error && setError(undefined);
    setActiveCitation(undefined);
    setActiveAnalysisPanelTab(undefined);
    setAnswers([]);
    setStreamedAnswers([]);
    setIsLoading(false);
    setIsStreaming(false);
  };

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [isLoading]
  );
  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "auto" }),
    [streamedAnswers]
  );

  useEffect(() => {
    if (answers && showSpeechOutputAzure) {
      for (let i = 0; i < answers.length; i++) {
        if (!speechUrls[i]) {
          getSpeechApi(answers[i][1].message.content).then((speechUrl) => {
            setSpeechUrls([
              ...speechUrls.slice(0, i),
              speechUrl,
              ...speechUrls.slice(i + 1),
            ]);
          });
        }
      }
    }
  }, [answers]);

  const onPromptTemplateChange = (
    _ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    setPromptTemplate(newValue || "");
  };

  const onTemperatureChange = (
    _ev?: React.SyntheticEvent<HTMLElement, Event>,
    newValue?: string
  ) => {
    setTemperature(parseFloat(newValue || "0"));
  };

  const onSeedChange = (
    _ev?: React.SyntheticEvent<HTMLElement, Event>,
    newValue?: string
  ) => {
    setSeed(parseInt(newValue || ""));
  };

  const onMinimumSearchScoreChange = (
    _ev?: React.SyntheticEvent<HTMLElement, Event>,
    newValue?: string
  ) => {
    setMinimumSearchScore(parseFloat(newValue || "0"));
  };

  const onMinimumRerankerScoreChange = (
    _ev?: React.SyntheticEvent<HTMLElement, Event>,
    newValue?: string
  ) => {
    setMinimumRerankerScore(parseFloat(newValue || "0"));
  };

  const onRetrieveCountChange = (
    _ev?: React.SyntheticEvent<HTMLElement, Event>,
    newValue?: string
  ) => {
    setRetrieveCount(parseInt(newValue || "3"));
  };

  const onUseSemanticRankerChange = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseSemanticRanker(!!checked);
  };

  const onUseSemanticCaptionsChange = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseSemanticCaptions(!!checked);
  };

  const onShouldStreamChange = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setShouldStream(!!checked);
  };

  const onExcludeCategoryChanged = (
    _ev?: React.FormEvent,
    newValue?: string
  ) => {
    setExcludeCategory(newValue || "");
  };

  const onUseSuggestFollowupQuestionsChange = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseSuggestFollowupQuestions(!!checked);
  };

  const onUseOidSecurityFilterChange = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseOidSecurityFilter(!!checked);
  };

  const onUseGroupsSecurityFilterChange = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    setUseGroupsSecurityFilter(!!checked);
  };

  const onExampleClicked = (example: string) => {
    makeApiRequest(example);
  };

  const onShowCitation = (citation: string, index: number) => {
    if (
      activeCitation === citation &&
      activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab &&
      selectedAnswer === index
    ) {
      setActiveAnalysisPanelTab(undefined);
    } else {
      setActiveCitation(citation);
      setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
    }

    setSelectedAnswer(index);
  };

  const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
    if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
      setActiveAnalysisPanelTab(undefined);
    } else {
      setActiveAnalysisPanelTab(tab);
    }

    setSelectedAnswer(index);
  };

  return (
    <div className="p-4 bg-white border border-gray-400 w-11/12 h-5/6 rounded-md flex flex-col justify-between">
      <div className="flex justify-between mb-4">
        <button
          className="btn btn-primary"
          onClick={clearChat}
          disabled={!lastQuestionRef.current || isLoading}
        >
          Clear Chat
        </button>
        {/* <UploadFile className="btn" /> */}
      </div>
      <div className="flex flex-col">
        {!lastQuestionRef.current ? (
          <div className="text-center">
            {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
            <h1 className="text-2xl font-bold mt-4">Chat with your data</h1>
            <h2 className="text-lg mt-2">Ask anything or try an example</h2>
            {/* <ExampleList
              onExampleClicked={onExampleClicked}
              useGPT4V={useGPT4V}
            /> */}
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            {isStreaming &&
              streamedAnswers.map((streamedAnswer, index) => (
                <div key={index}>
                  <UserChatMessage message={streamedAnswer[0]} />
                  <div className="bg-gray-100 p-4 rounded-lg my-2">
                    <Answer
                      isStreaming={true}
                      key={index}
                      answer={streamedAnswer[1]}
                      isSelected={false}
                      onCitationClicked={(c) => onShowCitation(c, index)}
                      onThoughtProcessClicked={() =>
                        onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)
                      }
                      onSupportingContentClicked={() =>
                        onToggleTab(
                          AnalysisPanelTabs.SupportingContentTab,
                          index
                        )
                      }
                      onFollowupQuestionClicked={(q) => makeApiRequest(q)}
                      showFollowupQuestions={
                        useSuggestFollowupQuestions &&
                        answers.length - 1 === index
                      }
                      showSpeechOutputAzure={showSpeechOutputAzure}
                      showSpeechOutputBrowser={showSpeechOutputBrowser}
                      speechUrl={speechUrls[index]}
                    />
                  </div>
                </div>
              ))}
            {!isStreaming &&
              answers.map((answer, index) => (
                <div key={index}>
                  <UserChatMessage message={answer[0]} />
                  <div className="bg-gray-100 p-4 rounded-lg my-2">
                    <Answer
                      isStreaming={false}
                      key={index}
                      answer={answer[1]}
                      isSelected={
                        selectedAnswer === index &&
                        activeAnalysisPanelTab !== undefined
                      }
                      onCitationClicked={(c) => onShowCitation(c, index)}
                      onThoughtProcessClicked={() =>
                        onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)
                      }
                      onSupportingContentClicked={() =>
                        onToggleTab(
                          AnalysisPanelTabs.SupportingContentTab,
                          index
                        )
                      }
                      onFollowupQuestionClicked={(q) => makeApiRequest(q)}
                      showFollowupQuestions={
                        useSuggestFollowupQuestions &&
                        answers.length - 1 === index
                      }
                      showSpeechOutputAzure={showSpeechOutputAzure}
                      showSpeechOutputBrowser={showSpeechOutputBrowser}
                      speechUrl={speechUrls[index]}
                    />
                  </div>
                </div>
              ))}
            {isLoading && (
              <>
                <UserChatMessage message={lastQuestionRef.current} />
                <div className="bg-gray-100 p-4 rounded-lg my-2">
                  <AnswerLoading />
                </div>
              </>
            )}
            {error ? (
              <>
                <UserChatMessage message={lastQuestionRef.current} />
                <div className="bg-gray-100 p-4 rounded-lg my-2">
                  <AnswerError
                    error={error.toString()}
                    onRetry={() => makeApiRequest(lastQuestionRef.current)}
                  />
                </div>
              </>
            ) : null}
            <div ref={chatMessageStreamEnd} />
          </div>
        )}

        <div className="mt-4">
          <QuestionInput
            clearOnSend
            placeholder="Type a new question (e.g. does my plan cover annual eye exams?)"
            disabled={isLoading}
            onSend={(question) => makeApiRequest(question)}
            showSpeechInput={showSpeechInput}
          />
        </div>
      </div>

      {answers.length > 0 && activeAnalysisPanelTab && (
        <AnalysisPanel
          className="mt-4"
          activeCitation={activeCitation}
          onActiveTabChanged={(x) => onToggleTab(x, selectedAnswer)}
          citationHeight="810px"
          answer={answers[selectedAnswer][1]}
          activeTab={activeAnalysisPanelTab}
        />
      )}
    </div>
  );
};

export default Chat;

import { useState, useEffect } from "react";
import { SupportingContent } from "../SupportingContent";
import { ChatAppResponse } from "../../api";
import { AnalysisPanelTabs } from "./AnalysisPanelTabs";
import { ThoughtProcess } from "./ThoughtProcess";
// import { useMsal } from "@azure/msal-react";
import { getHeaders } from "../../api";
// import { useLogin, getToken } from "../../authConfig";
// import type { AuthConfigType } from "../../authConfig";

interface Props {
  className: string;
  activeTab: AnalysisPanelTabs;
  onActiveTabChanged: (tab: AnalysisPanelTabs) => void;
  activeCitation: string | undefined;
  citationHeight: string;
  answer: ChatAppResponse;
}

const pivotItemDisabledStyle = "text-gray-400 cursor-not-allowed";

export const AnalysisPanel = ({
  answer,
  activeTab,
  activeCitation,
  citationHeight,
  className,
  onActiveTabChanged,
}: Props) => {
  const isDisabledThoughtProcessTab: boolean = !answer.context.thoughts;
  const isDisabledSupportingContentTab: boolean = !answer.context.data_points;
  const isDisabledCitationTab: boolean = !activeCitation;
  const [citation, setCitation] = useState("");

  // const client = useLogin ? useMsal().instance : undefined;

  const fetchCitation = async () => {
    // const token = client ? await getToken(client) : undefined;
    const token = undefined;
    if (activeCitation) {
      // Get hash from the URL as it may contain #page=N
      // which helps browser PDF renderer jump to correct page N
      const originalHash = activeCitation.indexOf("#")
        ? activeCitation.split("#")[1]
        : "";
      const response = await fetch(activeCitation, {
        method: "GET",
        headers: await getHeaders(token),
      });
      const citationContent = await response.blob();
      let citationObjectUrl = URL.createObjectURL(citationContent);
      // Add hash back to the new blob URL
      if (originalHash) {
        citationObjectUrl += "#" + originalHash;
      }
      setCitation(citationObjectUrl);
    }
  };
  useEffect(() => {
    fetchCitation();
  }, [activeCitation]);

  const renderFileViewer = () => {
    if (!activeCitation) {
      return null;
    }

    const fileExtension = activeCitation.split(".").pop()?.toLowerCase();
    switch (fileExtension) {
      case "png":
        return (
          <img src={citation} className="w-full h-auto" alt="Citation Image" />
        );
      case "md":
        return;
      default:
        return (
          <iframe
            title="Citation"
            src={citation}
            width="100%"
            height={citationHeight}
          />
        );
    }
  };

  return (
    <div className={`tabs ${className}`}>
      <button
        className={`tab tab-bordered ${
          activeTab === AnalysisPanelTabs.ThoughtProcessTab ? "tab-active" : ""
        } ${isDisabledThoughtProcessTab ? pivotItemDisabledStyle : ""}`}
        onClick={() =>
          !isDisabledThoughtProcessTab &&
          onActiveTabChanged(AnalysisPanelTabs.ThoughtProcessTab)
        }
        disabled={isDisabledThoughtProcessTab}
      >
        Thought process
      </button>
      <button
        className={`tab tab-bordered ${
          activeTab === AnalysisPanelTabs.SupportingContentTab
            ? "tab-active"
            : ""
        } ${isDisabledSupportingContentTab ? pivotItemDisabledStyle : ""}`}
        onClick={() =>
          !isDisabledSupportingContentTab &&
          onActiveTabChanged(AnalysisPanelTabs.SupportingContentTab)
        }
        disabled={isDisabledSupportingContentTab}
      >
        Supporting content
      </button>
      <button
        className={`tab tab-bordered ${
          activeTab === AnalysisPanelTabs.CitationTab ? "tab-active" : ""
        } ${isDisabledCitationTab ? pivotItemDisabledStyle : ""}`}
        onClick={() =>
          !isDisabledCitationTab &&
          onActiveTabChanged(AnalysisPanelTabs.CitationTab)
        }
        disabled={isDisabledCitationTab}
      >
        Citation
      </button>
      <div className="p-4">
        {activeTab === AnalysisPanelTabs.ThoughtProcessTab && (
          <ThoughtProcess thoughts={answer.context.thoughts || []} />
        )}
        {activeTab === AnalysisPanelTabs.SupportingContentTab && (
          <SupportingContent supportingContent={answer.context.data_points} />
        )}
        {activeTab === AnalysisPanelTabs.CitationTab && renderFileViewer()}
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { RetrievalMode, VectorFieldOptions } from "../../api";
import { toolTipText } from "../../i18n/tooltips";

interface Props {
  showImageOptions?: boolean;
  defaultRetrievalMode: RetrievalMode;
  updateRetrievalMode: (retrievalMode: RetrievalMode) => void;
  updateVectorFields: (options: VectorFieldOptions[]) => void;
}

export const VectorSettings = ({
  updateRetrievalMode,
  updateVectorFields,
  showImageOptions,
  defaultRetrievalMode,
}: Props) => {
  const [retrievalMode, setRetrievalMode] =
    useState<RetrievalMode>(defaultRetrievalMode);
  const [vectorFieldOption, setVectorFieldOption] =
    useState<VectorFieldOptions>(VectorFieldOptions.Both);

  const onRetrievalModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMode = e.target.value as RetrievalMode;
    setRetrievalMode(selectedMode);
    updateRetrievalMode(selectedMode);
  };

  const onVectorFieldsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as VectorFieldOptions;
    setVectorFieldOption(selectedOption);
    updateVectorFields([selectedOption]);
  };

  useEffect(() => {
    showImageOptions
      ? updateVectorFields([
          VectorFieldOptions.Embedding,
          VectorFieldOptions.ImageEmbedding,
        ])
      : updateVectorFields([VectorFieldOptions.Embedding]);
  }, [showImageOptions]);

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label htmlFor="retrievalMode" className="label">
          <span className="label-text">Retrieval mode</span>
          <span className="tooltip" data-tip={toolTipText.retrievalMode}>
            ?
          </span>
        </label>
        <select
          id="retrievalMode"
          className="select select-bordered"
          value={retrievalMode}
          onChange={onRetrievalModeChange}
        >
          <option value={RetrievalMode.Hybrid}>Vectors + Text (Hybrid)</option>
          <option value={RetrievalMode.Vectors}>Vectors</option>
          <option value={RetrievalMode.Text}>Text</option>
        </select>
      </div>

      {showImageOptions &&
        [RetrievalMode.Vectors, RetrievalMode.Hybrid].includes(
          retrievalMode
        ) && (
          <div className="form-control">
            <label htmlFor="vectorFields" className="label">
              <span className="label-text">
                Vector fields (Multi-query vector search)
              </span>
              <span className="tooltip" data-tip={toolTipText.vectorFields}>
                ?
              </span>
            </label>
            <select
              id="vectorFields"
              className="select select-bordered"
              value={vectorFieldOption}
              onChange={onVectorFieldsChange}
            >
              <option value={VectorFieldOptions.Embedding}>
                Text Embeddings
              </option>
              <option value={VectorFieldOptions.ImageEmbedding}>
                Image Embeddings
              </option>
              <option value={VectorFieldOptions.Both}>
                Text and Image embeddings
              </option>
            </select>
          </div>
        )}
    </div>
  );
};

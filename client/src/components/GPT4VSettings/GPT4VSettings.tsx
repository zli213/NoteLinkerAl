import { useEffect, useState } from "react";
import { GPT4VInput } from "../../api";
import { toolTipText } from "../../i18n/tooltips";

interface Props {
  gpt4vInputs: GPT4VInput;
  isUseGPT4V: boolean;
  updateGPT4VInputs: (input: GPT4VInput) => void;
  updateUseGPT4V: (useGPT4V: boolean) => void;
}

export const GPT4VSettings = ({
  updateGPT4VInputs,
  updateUseGPT4V,
  isUseGPT4V,
  gpt4vInputs,
}: Props) => {
  const [useGPT4V, setUseGPT4V] = useState<boolean>(isUseGPT4V);
  const [vectorFieldOption, setVectorFieldOption] = useState<GPT4VInput>(
    gpt4vInputs || GPT4VInput.TextAndImages
  );

  const onuseGPT4V = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    updateUseGPT4V(checked);
    setUseGPT4V(checked);
  };

  const onSetGPT4VInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as GPT4VInput;
    updateGPT4VInputs(selectedOption);
    setVectorFieldOption(selectedOption);
  };

  useEffect(() => {
    if (useGPT4V) {
      updateGPT4VInputs(GPT4VInput.TextAndImages);
    }
  }, [useGPT4V]);

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label htmlFor="useGPT4V" className="label">
          <span className="label-text">Use GPT vision model</span>
          <span className="tooltip" data-tip={toolTipText.useGPT4Vision}>
            ?
          </span>
        </label>
        <input
          type="checkbox"
          id="useGPT4V"
          className="toggle toggle-primary"
          checked={useGPT4V}
          onChange={onuseGPT4V}
        />
      </div>
      {useGPT4V && (
        <div className="form-control">
          <label htmlFor="gpt4VInput" className="label">
            <span className="label-text">GPT vision model inputs</span>
            <span className="tooltip" data-tip={toolTipText.gpt4VisionInputs}>
              ?
            </span>
          </label>
          <select
            id="gpt4VInput"
            className="select select-bordered"
            value={vectorFieldOption}
            onChange={onSetGPT4VInput}
          >
            <option value={GPT4VInput.TextAndImages}>Images and text</option>
            <option value={GPT4VInput.Images}>Images</option>
            <option value={GPT4VInput.Texts}>Text</option>
          </select>
        </div>
      )}
    </div>
  );
};

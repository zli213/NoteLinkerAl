import React, { useState, ChangeEvent } from "react";
// import { useMsal } from "@azure/msal-react";
// import { Add24Regular, Delete24Regular } from "@fluentui/react-icons";
// import { SimpleAPIResponse, uploadFileApi, deleteUploadedFileApi, listUploadedFilesApi } from "../../api";
// import { useLogin, getToken } from "../../authConfig";

interface Props {
  className?: string;
  disabled?: boolean;
}

export const UploadFile: React.FC<Props> = ({ className, disabled }: Props) => {
  const [isCalloutVisible, setIsCalloutVisible] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletionStatus, setDeletionStatus] = useState<{
    [filename: string]: "pending" | "error" | "success";
  }>({});
  //   const [uploadedFile, setUploadedFile] = useState<SimpleAPIResponse>();
  const [uploadedFileError, setUploadedFileError] = useState<string>();
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  //   if (!useLogin) {
  //     throw new Error("The UploadFile component requires useLogin to be true");
  //   }

  //   const client = useMsal().instance;

  const handleButtonClick = async () => {
    setIsCalloutVisible(!isCalloutVisible);
    // try {
    //   const idToken = await getToken(client);
    //   if (!idToken) {
    //     throw new Error("No authentication token available");
    //   }
    //   listUploadedFiles(idToken);
    // } catch (error) {
    //   console.error(error);
    //   setIsLoading(false);
    // }
  };

  const listUploadedFiles = async (idToken: string) => {
    // listUploadedFilesApi(idToken).then(files => {
    //   setIsLoading(false);
    //   setDeletionStatus({});
    //   setUploadedFiles(files);
    // });
  };

  const handleRemoveFile = async (filename: string) => {
    setDeletionStatus({ ...deletionStatus, [filename]: "pending" });

    // try {
    //   const idToken = await getToken(client);
    //   if (!idToken) {
    //     throw new Error("No authentication token available");
    //   }

    //   await deleteUploadedFileApi(filename, idToken);
    //   setDeletionStatus({ ...deletionStatus, [filename]: "success" });
    //   listUploadedFiles(idToken);
    // } catch (error) {
    //   setDeletionStatus({ ...deletionStatus, [filename]: "error" });
    //   console.error(error);
    // }
  };

  const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setIsUploading(true);
    const file: File = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // try {
    //   const idToken = await getToken(client);
    //   if (!idToken) {
    //     throw new Error("No authentication token available");
    //   }
    //   const response: SimpleAPIResponse = await uploadFileApi(formData, idToken);
    //   setUploadedFile(response);
    //   setIsUploading(false);
    //   setUploadedFileError(undefined);
    //   listUploadedFiles(idToken);
    // } catch (error) {
    //   console.error(error);
    //   setIsUploading(false);
    //   setUploadedFileError(`Error uploading file - please try again or contact admin.`);
    // }
  };

  return (
    <div className={`p-4 ${className ?? ""}`}>
      <div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          onClick={handleButtonClick}
        />
        {isCalloutVisible && (
          <div className="callout shadow-lg p-4 mt-4" role="dialog">
            <form encType="multipart/form-data">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload file:</span>
                </label>
                <input
                  accept=".txt, .md, .json, .png, .jpg, .jpeg, .bmp, .heic, .tiff, .pdf, .docx, .xlsx, .pptx, .html"
                  className="input input-bordered"
                  type="file"
                  onChange={handleUploadFile}
                />
              </div>
            </form>

            {isUploading && <div className="text">Uploading files...</div>}
            {!isUploading && uploadedFileError && (
              <div className="text">{uploadedFileError}</div>
            )}
            {/* {!isUploading && uploadedFile && <div className="text">{uploadedFile.message}</div>} */}

            <h3 className="text-lg font-bold mt-4">
              Previously uploaded files:
            </h3>

            {isLoading && <div className="text">Loading...</div>}
            {!isLoading && uploadedFiles.length === 0 && (
              <div className="text">No files uploaded yet</div>
            )}
            {uploadedFiles.map((filename, index) => (
              <div
                key={index}
                className="flex items-center justify-between mt-2"
              >
                <div className="item">{filename}</div>
                <button
                  className="btn btn-error btn-xs"
                  onClick={() => handleRemoveFile(filename)}
                  disabled={
                    deletionStatus[filename] === "pending" ||
                    deletionStatus[filename] === "success"
                  }
                >
                  {!deletionStatus[filename] && "Delete file"}
                  {deletionStatus[filename] === "pending" && "Deleting file..."}
                  {deletionStatus[filename] === "error" && "Error deleting."}
                  {deletionStatus[filename] === "success" && "File deleted"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

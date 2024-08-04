import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";

const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
const BACKEND_URI = apiUrl + "/api";
import {
  ChatAppResponse,
  ChatAppResponseOrError,
  ChatAppRequest,
  Config,
  SimpleAPIResponse,
} from "./models";

export async function getHeaders(
  idToken: string | undefined
): Promise<Record<string, string>> {
  if (idToken) {
    return { Authorization: `Bearer ${idToken}` };
  }
  return {};
}

export async function configApi(): Promise<Config> {
  const response = await fetch(`${BACKEND_URI}/config`, {
    method: "GET",
  });

  return (await response.json()) as Config;
}

export async function askApi(
  request: ChatAppRequest,
  idToken: string | undefined
): Promise<ChatAppResponse> {
  const headers = await getHeaders(idToken);
  const response = await fetch(`${BACKEND_URI}/openai/chat`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const parsedResponse: ChatAppResponseOrError = await response.json();
  if (response.status > 299 || !response.ok) {
    throw Error(parsedResponse.error || "Unknown error");
  }

  return parsedResponse as ChatAppResponse;
}

export async function chatApi(
  request: ChatAppRequest,
  shouldStream: boolean,
  idToken: string | undefined
): Promise<Response> {
  let url = `${BACKEND_URI}/chat`;
  if (shouldStream) {
    url += "/stream";
  }
  const headers = await getHeaders(idToken);
  return await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export async function getSpeechApi(text: string): Promise<string | null> {
  return await fetch("/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  })
    .then((response) => {
      if (response.status == 200) {
        return response.blob();
      } else if (response.status == 400) {
        console.error("Speech synthesis is not enabled.");
        return null;
      } else {
        console.error("Unable to get speech synthesis.");
        return null;
      }
    })
    .then((blob) => (blob ? URL.createObjectURL(blob) : null));
}

export function getCitationFilePath(citation: string): string {
  return `${BACKEND_URI}/content/${citation}`;
}

export async function uploadFileApi(
  request: FormData
): Promise<SimpleAPIResponse> {
  const authContext = useContext(AuthContext);
  const { getToken } = authContext || { getToken: null };
  const idToken = await getToken?.();
  const headers = await getHeaders(idToken);
  const response = await fetch("/upload", {
    method: "POST",
    headers,
    body: request,
  });

  if (!response.ok) {
    throw new Error(`Uploading files failed: ${response.statusText}`);
  }

  const dataResponse: SimpleAPIResponse = await response.json();
  return dataResponse;
}

export async function deleteUploadedFileApi(
  filename: string
): Promise<SimpleAPIResponse> {
  const authContext = useContext(AuthContext);
  const { getToken } = authContext || { getToken: null };
  const idToken = await getToken?.();
  const headers = await getHeaders(idToken);
  const response = await fetch("/delete_uploaded", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    throw new Error(`Deleting file failed: ${response.statusText}`);
  }

  const dataResponse: SimpleAPIResponse = await response.json();
  return dataResponse;
}

export async function listUploadedFilesApi(): Promise<string[]> {
  const authContext = useContext(AuthContext);
  const { getToken } = authContext || { getToken: null };
  const idToken = await getToken?.();
  const headers = await getHeaders(idToken);
  const response = await fetch(`/list_uploaded`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Listing files failed: ${response.statusText}`);
  }

  const dataResponse: string[] = await response.json();
  return dataResponse;
}

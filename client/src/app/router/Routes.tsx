// src/app/router/Routes.js
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import Inbox from "../../features/inbox/Inbox";
import NotesPage from "../../features/notes/NotesPage";
import Notebooks from "../../features/notebooks/Notebooks";
import App from "../layout/App";
import TrashPage from "../../features/trashPage/TrashPage";
import HistoryPage from "../../features/historyPage/HistoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "inbox", element: <Inbox /> },
      { path: "notes", element: <NotesPage /> },
      { path: "notebooks", element: <Notebooks /> },
      { path: "trash", element: <TrashPage /> },
      { path: "history", element: <HistoryPage /> },
    ],
  },
]);

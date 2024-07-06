import { ArrowLeftToLine } from "lucide-react";
import logo from "../../../client/public/images/logo.svg";
const WebHead = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img src={logo} alt="logo" className="w-6 h-6 mr-1" />
        <h1 className="text-2xl font-bold">NoteLinkerAl</h1>
      </div>
      <button className="btn btn-circle btn-sm btn-link">
        <ArrowLeftToLine size={24} color="black" />
      </button>
    </div>
  );
};

export default WebHead;

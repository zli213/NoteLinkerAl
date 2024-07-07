import CardStack from "../../components/CardStack";
import TimeLine from "../../components/TimeLine";
import RichTextEditor from "../../components/RichTextEditor";
import Editor from "../../components/Editor";
export default function Inbox() {
  return (
    <div className="flex flex-col justify-around items-center h-screen flex-grow">
      <TimeLine />
      <div className="mb-8">
        {/* Card Box */}
        <div className="bg-orange-300 rounded-3xl p-6 pt-10 shadow-lg w-[400px] h-[350px]">
          {/* Dialog Box */}
          <div className="flex justify-center">
            <CardStack />
          </div>
        </div>
      </div>
      {/* <RichTextEditor /> */}
      <Editor />
    </div>
  );
}

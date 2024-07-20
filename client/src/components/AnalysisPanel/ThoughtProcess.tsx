import SyntaxHighlighter from "react-syntax-highlighter";
import { Thoughts } from "../../api";

interface Props {
  thoughts: Thoughts[];
}

export const ThoughtProcess = ({ thoughts }: Props) => {
  return (
    <ul className="list-disc pl-5">
      {thoughts.map((t, ind) => {
        return (
          <li className="mb-4" key={ind}>
            <div className="font-bold mb-2">{t.title}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {t.props &&
                (Object.keys(t.props) || []).map((k: any) => (
                  <span className="bg-gray-200 p-1 rounded" key={k}>
                    {k}: {JSON.stringify(t.props?.[k])}
                  </span>
                ))}
            </div>
            {Array.isArray(t.description) ? (
              <SyntaxHighlighter
                language="json"
                wrapLongLines
                className="bg-gray-100 p-2 rounded"
              >
                {JSON.stringify(t.description, null, 2)}
              </SyntaxHighlighter>
            ) : (
              <div>{t.description}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

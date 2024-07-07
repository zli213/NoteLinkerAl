import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Undo,
  Redo,
} from "lucide-react";

const RichTextEditor = () => {
  const [isEditable, setIsEditable] = useState(true);
  const editorRef = useRef(null);

  const execCommand = (command: string, value: string | undefined = "") => {
    document.execCommand(command, false, value);
  };

  const handleFontChange = (e: { target: { value: string | undefined } }) => {
    execCommand("fontName", e.target.value);
  };

  const handleFontSizeChange = (e: {
    target: { value: string | undefined };
  }) => {
    execCommand("fontSize", e.target.value);
  };

  const handleColorChange = (e: { target: { value: string | undefined } }) => {
    execCommand("foreColor", e.target.value);
  };

  const handleBackgroundChange = (e: {
    target: { value: string | undefined };
  }) => {
    execCommand("backColor", e.target.value);
  };

  const handleLinkInsert = () => {
    const url = prompt("Enter the URL:");
    if (url) execCommand("createLink", url);
  };

  const handleImageInsert = () => {
    const url = prompt("Enter the image URL:");
    if (url) execCommand("insertImage", url);
  };

  useEffect(() => {
    if (editorRef.current) {
      (editorRef.current as HTMLDivElement).contentEditable =
        isEditable.toString();
    }
  }, [isEditable]);

  const defaultContent = `
    <h2><font face="STKaiti">Vue.js 是什么</font></h2>
    <p><i><strong>Vue</strong> 是一套用于构建用户界面的<font color="#42b983"><strong>渐进式框架</strong></font></i>。
    与其它大型框架不同的是，Vue 被设计为可以<span style="background-color: orange;"><font color="#ffffff">自底向上</font></span>逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。
    <strike>另一方面</strike>，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。</p>
  `;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        React Rich Text Editor
      </h1>

      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setIsEditable(!isEditable)}
        >
          {isEditable ? "View Mode" : "Edit Mode"}
        </button>
      </div>

      <div className="border border-gray-300 p-2 mb-4 flex flex-wrap items-center">
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("undo")}
        >
          <Undo size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("redo")}
        >
          <Redo size={20} />
        </button>

        <select className="border mx-1" onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Sans serif">Sans serif</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Palatino">Palatino</option>
          <option value="Garamond">Garamond</option>
          <option value="Bookman">Bookman</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Arial Black">Arial Black</option>
          <option value="Impact">Impact</option>
        </select>

        <select className="border mx-1" onChange={handleFontSizeChange}>
          {[1, 2, 3, 4, 5, 6, 7].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <input type="color" className="mx-1" onChange={handleColorChange} />
        <input
          type="color"
          className="mx-1"
          onChange={handleBackgroundChange}
        />

        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("bold")}
        >
          <Bold size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("italic")}
        >
          <Italic size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("underline")}
        >
          <Underline size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("strikeThrough")}
        >
          <Strikethrough size={20} />
        </button>

        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("justifyLeft")}
        >
          <AlignLeft size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("justifyCenter")}
        >
          <AlignCenter size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("justifyRight")}
        >
          <AlignRight size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("justifyFull")}
        >
          <AlignJustify size={20} />
        </button>

        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("insertUnorderedList")}
        >
          <List size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={() => execCommand("insertOrderedList")}
        >
          <ListOrdered size={20} />
        </button>

        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={handleLinkInsert}
        >
          <Link size={20} />
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={handleImageInsert}
        >
          <Image size={20} />
        </button>
      </div>

      <div
        ref={editorRef}
        className="border border-gray-300 p-4 min-h-[200px] focus:outline-none"
        contentEditable={isEditable}
        dangerouslySetInnerHTML={{ __html: defaultContent }}
      />
    </div>
  );
};

export default RichTextEditor;

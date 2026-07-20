import { useRef, useEffect } from "react";

const DEFAULT_TOOLS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "h1",
  "h2",
  "quote",
  "code",
  "ul",
  "ol",
  "hr",
  "table",
  "link",
  "image",
  "clear",
];

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  tools = DEFAULT_TOOLS,
  readOnly = false,
  minHeight = 300,
  
  className = "",
}) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  /* Auto resize */
  const resizeEditor = () => {
    const el = editorRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
  };

  /* Sync external value */
  useEffect(() => {
    if (
      editorRef.current &&
      !isInternalChange.current &&
      value !== editorRef.current.innerHTML
    ) {
      editorRef.current.innerHTML = value || "";
      resizeEditor();
    }
    isInternalChange.current = false;
  }, [value]);

  const emitChange = () => {
    isInternalChange.current = true;
    onChange?.(editorRef.current.innerHTML);
    resizeEditor();
  };

  const exec = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
    emitChange();
  };

  const insertHTML = (html) => {
    exec("insertHTML", html);
  };

  /* ---------- TABLE FUNCTIONS ---------- */

  const insertTable = () => {
    const rows = Number(prompt("Rows?", 2));
    const cols = Number(prompt("Columns?", 2));
    if (!rows || !cols) return;

    let table = `
      <table class="border border-gray-400 border-collapse w-full my-2">
        <tbody>
    `;

    for (let r = 0; r < rows; r++) {
      table += "<tr>";
      for (let c = 0; c < cols; c++) {
        table += `<td class="border border-gray-400 px-2 py-1 min-w-[60px]">&nbsp;</td>`;
      }
      table += "</tr>";
    }

    table += "</tbody></table><p></p>";
    insertHTML(table);
  };

  /* ---------- TOOLBAR ---------- */

  const TOOLBAR = {
    bold: () => exec("bold"),
    italic: () => exec("italic"),
    underline: () => exec("underline"),
    strike: () => exec("strikeThrough"),
    h1: () => insertHTML(`<h1>${window.getSelection() || ""}</h1>`),
    h2: () => insertHTML(`<h2>${window.getSelection() || ""}</h2>`),
    quote: () => insertHTML(`<blockquote>${window.getSelection() || ""}</blockquote>`),
    code: () => insertHTML(`<pre><code>${window.getSelection() || ""}</code></pre>`),
    ul: () => exec("insertUnorderedList"),
    ol: () => exec("insertOrderedList"),
    hr: () => insertHTML("<hr />"),
    table: insertTable,
    link: () => {
      const url = prompt("Enter URL");
      if (url) exec("createLink", url);
    },
    image: () => {
      const url = prompt("Enter image URL");
      if (url) exec("insertImage", url);
    },
    clear: () => {
      editorRef.current.innerHTML = "<p></p>";
      emitChange();
    },
  };

  return (
    <div className={`border rounded-lg w-4xl bg-white ${className}`}>
      {!readOnly && (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
          {tools.map((tool) => (
            <button
              key={tool}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                TOOLBAR[tool]?.();
              }}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-200"
            >
              {tool.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={emitChange}
        data-placeholder={placeholder}
        className="relative p-3 outline-none overflow-hidden prose max-w-none
          empty:before:content-[attr(data-placeholder)]
          empty:before:text-gray-400"
        style={{ minHeight }}
        suppressContentEditableWarning
      />
    </div>
  );
}

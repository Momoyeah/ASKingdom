import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { toc } from "./toc";

const importAllMarkdown = import.meta.glob("./content/**/*.md", { as: "raw", eager: true });

const flattenTOC = (toc) =>
  toc.flatMap((section) =>
    section.children.map((item) => ({
      title: item.title,
      path: item.path,
      section: section.title,
    }))
  );

const fileMap = Object.fromEntries(
  Object.entries(importAllMarkdown).map(([key, value]) => [key.replace("./", ""), value])
);

export default function App() {
  const flatTOC = flattenTOC(toc);
  const [selected, setSelected] = useState(flatTOC[0]);
  const [openMap, setOpenMap] = useState({});

  const toggleASK = (q) => {
    setOpenMap((prev) => ({ ...prev, [q]: !prev[q] }));
  };

  const parseASK = (raw) => {
    const lines = raw.split("\n");
    const content = [];
    let main = "";
    let currentAsk = null;

    lines.forEach((line) => {
      if (line.startsWith("【ASK】")) {
        if (currentAsk) content.push(currentAsk);
        currentAsk = { q: line.replace("【ASK】", "").trim(), a: "" };
      } else if (currentAsk && (line.startsWith("\t") || line.startsWith("  "))) {
        currentAsk.a += line.trimStart() + "\n";
      } else {
        if (currentAsk) {
          content.push(currentAsk);
          currentAsk = null;
        }
        main += line + "\n";
      }
    });
    if (currentAsk) content.push(currentAsk);

    return { main: main.trim(), asks: content };
  };

  const raw = fileMap[selected.path];
  const { main, asks } = parseASK(raw || "");

  useEffect(() => {
    if (window.MathJax) window.MathJax.typeset();
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: "260px", background: "#f9f9f9", padding: "16px", overflowY: "auto", borderRight: "1px solid #ddd" }}>
        <h2>🧠 目录</h2>
        {toc.map((section) => (
          <div key={section.title}>
            <div style={{ fontWeight: "bold", marginTop: "16px" }}>{section.title}</div>
            {section.children.map((item) => (
              <button
                key={item.path}
                onClick={() => setSelected({ title: item.title, path: item.path, section: section.title })}
                style={{
                  display: "block",
                  background: item.path === selected.path ? "#007bff" : "transparent",
                  color: item.path === selected.path ? "white" : "#333",
                  border: "none",
                  padding: "6px 12px",
                  textAlign: "left",
                  borderRadius: "4px",
                  cursor: "pointer",
                  margin: "2px 0",
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        <h1>{selected.section} / {selected.title}</h1>
        <ReactMarkdown
          children={main}
          remarkPlugins={[remarkGfm, remarkDirective]}
          rehypePlugins={[rehypeKatex]}
        />
        <hr />
        {asks.map((item, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <button
              onClick={() => toggleASK(item.q)}
              style={{
                fontWeight: "bold",
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              【ASK】{item.q}
            </button>
            {openMap[item.q] && (
              <div style={{ background: "#f1f3f5", marginTop: "8px", padding: "12px", borderRadius: "6px" }}>
                <ReactMarkdown
                  children={item.a}
                  remarkPlugins={[remarkGfm, remarkDirective]}
                  rehypePlugins={[rehypeKatex]}
                />
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

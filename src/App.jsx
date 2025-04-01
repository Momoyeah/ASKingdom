import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// 自动读取所有 Markdown 文件
const importAllMarkdown = import.meta.glob("./content/**/*.md", { as: "raw", eager: true });

// 自动生成 TOC（支持两级目录：主题/子文件.md）
const generateTOC = () => {
  const tree = {};
  for (const path in importAllMarkdown) {
    const parts = path.replace("./content/", "").split("/");
    if (parts.length === 2) {
      const [section, file] = parts;
      const title = file.replace(/\.md$/, "");
      if (!tree[section]) tree[section] = [];
      tree[section].push({ title, path: `content/${section}/${file}` });
    }
  }
  return Object.entries(tree).map(([section, children]) => ({ title: section, children }));
};

const toc = generateTOC();

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

  const toggleQA = (q) => {
    setOpenMap((prev) => ({ ...prev, [q]: !prev[q] }));
  };

  const parseQA = (raw) => {
  const lines = raw.split("\n");
  const qas = [];
  let main = "";
  let currentQA = null;
  let inAnswer = false;

  for (let line of lines) {
    if (line.startsWith("【ASK】")) {
      if (currentQA) qas.push(currentQA);
      currentQA = { q: line.replace("【ASK】", "").trim(), a: "" };
    } else if (line.includes("<!-- answer -->")) {
      inAnswer = true;
    } else if (line.includes("<!-- end -->")) {
      inAnswer = false;
    } else if (inAnswer && currentQA) {
      currentQA.a += line + "\n";
    } else if (!currentQA) {
      main += line + "\n";
    }
  }

  if (currentQA) qas.push(currentQA);
  return { main, qas };
};

  const raw = fileMap[selected.path];
  const { main, qas } = parseQA(raw || "");

  useEffect(() => {
    if (window.MathJax) window.MathJax.typeset();
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside
        style={{
          width: "clamp(180px, 25vw, 260px)",
          background: "#f9f9f9",
          padding: "16px",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>🧠 目录</h2>
        {toc.map((section) => (
          <div key={section.title}>
            <div style={{ fontWeight: "bold", marginTop: "24px" }}>{section.title}</div>
            {section.children.map((item) => (
              <button
                key={item.path}
                onClick={() =>
                  setSelected({ title: item.title, path: item.path, section: section.title })
                }
                style={{
                  display: "block",
                  background: item.path === selected.path ? "#007bff" : "transparent",
                  color: item.path === selected.path ? "white" : "#333",
                  fontSize: "24px",
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
        <h1>
          {selected.section} / {selected.title}
        </h1>
        <ReactMarkdown
          children={main}
          remarkPlugins={[remarkGfm, remarkDirective]}
          rehypePlugins={[rehypeKatex]}
        />
        <hr />
        {qas.map((item, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <button
              onClick={() => toggleQA(item.q)}
              style={{
                fontWeight: "bold",
                background: "none",
                border: "none",
                color: "#8B658B",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ASK {item.q}
            </button>
            {openMap[item.q] && (
              <div
                style={{
                  background: "#FFFAFA",
                  marginTop: "8px",
                  padding: "16px",
                  borderRadius: "6px",
                }}
              >
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

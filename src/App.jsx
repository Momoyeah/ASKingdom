import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';

const files = import.meta.glob('./content/*.md', { as: 'raw', eager: true });

const parseContent = (raw) => {
  const titleMatch = raw.match(/^#\s+(.*)/);
  const title = titleMatch ? titleMatch[1] : 'Untitled';
  const body = raw.replace(/^#\s+.*\n/, '');
  return { title, raw: body };
};

const content = {};
for (const path in files) {
  const name = path.split('/').pop().replace('.md', '');
  content[name] = parseContent(files[path]);
}

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState(Object.keys(content)[0]);
  const [openQ, setOpenQ] = useState(null);

  const topic = content[selectedTopic];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (window.MathJax) window.MathJax.typeset();
  });

  const renderers = {
    h3: ({ children }) => {
      const text = children[0];
      return (
        <button
          onClick={() => setOpenQ(openQ === text ? null : text)}
          style={{
            fontWeight: 'bold',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#007bff',
            fontSize: '16px',
            marginTop: '16px',
          }}
        >
          ❓ {text}
        </button>
      );
    },
    p: ({ children }) => {
      if (!openQ) return null;
      return <div style={{ margin: '8px 0', paddingLeft: '12px' }}>{children}</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '240px', background: '#f8f9fa', padding: '16px' }}>
        <h2>📘 目录</h2>
        {Object.keys(content).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedTopic(key);
              setOpenQ(null);
            }}
            style={{
              display: 'block',
              width: '100%',
              background: key === selectedTopic ? '#007bff' : 'transparent',
              color: key === selectedTopic ? 'white' : '#333',
              border: 'none',
              textAlign: 'left',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            {key}
          </button>
        ))}
      </aside>
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <h1>{topic.title}</h1>
        <ReactMarkdown
          children={topic.raw}
          remarkPlugins={[remarkGfm, remarkDirective]}
          components={renderers}
        />
      </main>
    </div>
  );
}

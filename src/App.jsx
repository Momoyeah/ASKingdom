import React, { useState, useEffect } from 'react';

const content = {
  Oscillation: {
    title: "Dynamic System",
    knowledge: `## Negative Feedback Loop\n\n$$
\\tau_E \\cdot \\frac{\\mathrm{d} r_E}{\\mathrm{d} t} = -r_E - W_{I \\to E} \\cdot r_I \\\\
\\tau_I \\cdot \\frac{\\mathrm{d} r_I}{\\mathrm{d} t} = -r_I + W_{E \\to I} \\cdot r_E
$$`,
    qa: [
      {
        question: "τ（tau）是什么意思？",
        answer: "τ 是时间常数，表示神经元群体反应变化的速度。越大表示响应越慢。"
      },
      {
        question: "r 是什么意思？",
        answer: "r 表示 firing rate（放电率），代表一群神经元的活动强度。"
      },
      {
        question: "为什么 rE 前面是负号？",
        answer: "负号表示神经活动的自然衰减，是负反馈的一部分。"
      }
    ]
  }
};

function useMathJax() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => window.MathJax && window.MathJax.typeset();
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
}

export default function App() {
  useMathJax();
  const [selectedTopic, setSelectedTopic] = useState('Oscillation');
  const [openIndex, setOpenIndex] = useState(null);
  const topic = content[selectedTopic];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <aside style={{ width: '240px', background: '#f8f9fa', borderRight: '1px solid #ccc', padding: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>📘 目录</h2>
        {Object.keys(content).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedTopic(key);
              setOpenIndex(null);
            }}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '8px',
              background: key === selectedTopic ? '#007bff' : 'transparent',
              color: key === selectedTopic ? 'white' : '#333',
              border: 'none',
              textAlign: 'left',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {key}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>{topic.title}</h1>
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
          <div dangerouslySetInnerHTML={{ __html: topic.knowledge.replace(/\n/g, '<br/>') }} />
        </div>

        {topic.qa.map((item, index) => (
          <div key={index} style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
            >
              ❓ {item.question}
            </button>
            {openIndex === index && (
              <div style={{ padding: '12px', background: '#f1f3f5', marginTop: '8px', borderRadius: '6px' }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

import React, { useState } from "react";

const content = {
  Oscillation: {
    title: "Oscillation",
    knowledge: `## Negative Feedback Loop\n\n$$
\\tau_E \\cdot \\frac{dr_E}{dt} = -r_E - W_{I \\to E} \\cdot r_I\\\\
\\tau_I \\cdot \\frac{dr_I}{dt} = -r_I + W_{E \\to I} \\cdot r_E
$$`,
    qa: [
      {
        question: "τ（tau）是什么意思？",
        answer: "τ 是时间常数，表示该神经元群体反应变化的速度。数值越大，反应越慢，系统越“惯性”。"
      },
      {
        question: "r 是什么意思？",
        answer: "r 表示 firing rate，即神经元群体的平均放电率，是随时间变化的动态变量。"
      },
      {
        question: "为什么 rE 前面是负号？",
        answer: "因为是一个负反馈系统，表示兴奋性神经元的活动会自然衰减，除非有外部输入或循环激励。"
      },
      {
        question: "为什么自抑制衰减用负的 firing rate 来算？为什么是线性的？为什么没有额外参数？",
        answer: "这是模型的简化设定，线性假设便于分析和计算。实际神经动力学可能是非线性的，但线性能捕捉核心机制。"
      },
      {
        question: "对比这个简化模型和更复杂模型有什么差异？",
        answer: "复杂模型可能会引入非线性函数（如 sigmoid）、多个群体、随机扰动等，可以模拟更真实的大脑动力学，但分析更困难。"
      }
    ]
  }
};

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState("Oscillation");
  const [openIndex, setOpenIndex] = useState(null);
  const selected = content[selectedTopic];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 250, borderRight: "1px solid #ccc", padding: 16 }}>
        <h2>📚 目录</h2>
        {Object.keys(content).map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setSelectedTopic(topic);
              setOpenIndex(null);
            }}
            style={{
              display: "block",
              margin: "8px 0",
              fontWeight: selectedTopic === topic ? "bold" : "normal"
            }}
          >
            {topic}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
        <h1>{selected.title}</h1>
        <div style={{ whiteSpace: "pre-wrap", marginBottom: 24 }}>{selected.knowledge}</div>

        {selected.qa.map((item, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              ❓ {item.question}
            </button>
            {openIndex === index && (
              <div style={{ padding: 12, backgroundColor: "#f0f0f0", marginTop: 8 }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
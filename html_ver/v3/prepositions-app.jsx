import { useState, useEffect, useRef } from "react";

const PREPOSITIONS = ["in", "on", "at", "under", "over", "between", "behind", "next to", "above", "below"];

const DRAG_DROP_LEVELS = [
  {
    scene: "🏠",
    question: "Where is the cat?",
    image: "🐱",
    target: "📦",
    targetLabel: "the box",
    answer: "in",
    options: ["in", "on", "under", "behind"],
    hint: "The cat is hiding INSIDE the box.",
  },
  {
    scene: "🌳",
    question: "Where is the bird?",
    image: "🐦",
    target: "🌳",
    targetLabel: "the tree",
    answer: "on",
    options: ["in", "on", "under", "above"],
    hint: "The bird is sitting ON top of a branch.",
  },
  {
    scene: "🏙️",
    question: "Where is the meeting?",
    image: "📅",
    target: "🕒",
    targetLabel: "3 o'clock",
    answer: "at",
    options: ["in", "on", "at", "by"],
    hint: "We use AT for specific times.",
  },
  {
    scene: "🌉",
    question: "Where is the dog?",
    image: "🐕",
    target: "🛏️",
    targetLabel: "the bed",
    answer: "under",
    options: ["on", "in", "under", "over"],
    hint: "The dog is hiding UNDER the bed.",
  },
];

const FILL_BLANKS = [
  { sentence: "She lives ___ London.", answer: "in", options: ["in", "at", "on", "by"], emoji: "🇬🇧" },
  { sentence: "The book is ___ the table.", answer: "on", options: ["in", "on", "at", "under"], emoji: "📚" },
  { sentence: "We meet ___ Monday.", answer: "on", options: ["in", "at", "on", "by"], emoji: "📅" },
  { sentence: "The keys are ___ my bag.", answer: "in", options: ["on", "at", "in", "over"], emoji: "👜" },
  { sentence: "She arrived ___ midnight.", answer: "at", options: ["in", "on", "at", "by"], emoji: "🌙" },
  { sentence: "He lives ___ the countryside.", answer: "in", options: ["in", "on", "at", "by"], emoji: "🌾" },
];

const SENTENCE_PARTS = [
  {
    prompt: "Build: The cat is [preposition] the mat.",
    words: ["The", "cat", "is", "on", "under", "the", "mat", "."],
    correct: ["The", "cat", "is", "on", "the", "mat", "."],
    emoji: "🐱",
  },
  {
    prompt: "Build: She was born in July.",
    words: ["She", "was", "born", "in", "at", "on", "July", "."],
    correct: ["She", "was", "born", "in", "July", "."],
    emoji: "🎂",
  },
  {
    prompt: "Build: The birds fly over the mountains.",
    words: ["The", "birds", "fly", "over", "under", "the", "mountains", "."],
    correct: ["The", "birds", "fly", "over", "the", "mountains", "."],
    emoji: "🏔️",
  },
];

const XPBar = ({ xp, level }) => {
  const maxXP = level * 100;
  const pct = Math.min((xp / maxXP) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 14 }}>LVL {level}</span>
      <div style={{ width: 120, height: 12, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#FFD700,#FF8C00)", borderRadius: 99, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 12 }}>{xp}/{maxXP} XP</span>
    </div>
  );
};

const Particle = ({ x, y, color, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 9999,
      animation: "particle 0.9s forwards", color, fontSize: 20,
    }}>⭐</div>
  );
};

export default function App() {
  const [screen, setScreen] = useState("home"); // home | drag | fill | sentence | complete
  const [dragIdx, setDragIdx] = useState(0);
  const [fillIdx, setFillIdx] = useState(0);
  const [sentIdx, setSentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | "correct" | "wrong"
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [particles, setParticles] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [dropped, setDropped] = useState(null);
  const [builtSentence, setBuiltSentence] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [score, setScore] = useState(0);
  const dropRef = useRef(null);

  const addXP = (amt, e) => {
    const newXP = xp + amt;
    const maxXP = level * 100;
    if (newXP >= maxXP) {
      setLevel(l => l + 1);
      setXP(newXP - maxXP);
    } else {
      setXP(newXP);
    }
    if (e) {
      setParticles(p => [...p, { x: e.clientX, y: e.clientY, id: Date.now() }]);
    }
  };

  const handleFillSelect = (opt, e) => {
    if (feedback) return;
    const correct = FILL_BLANKS[fillIdx].answer;
    setSelected(opt);
    if (opt === correct) {
      setFeedback("correct");
      setStreak(s => s + 1);
      setScore(s => s + 1);
      addXP(streak >= 2 ? 20 : 10, e);
    } else {
      setFeedback("wrong");
      setStreak(0);
    }
  };

  const nextFill = () => {
    if (fillIdx + 1 >= FILL_BLANKS.length) {
      setScreen("sentence");
      setSentIdx(0);
      setBuiltSentence([]);
      setUsedWords([]);
    } else {
      setFillIdx(i => i + 1);
    }
    setSelected(null);
    setFeedback(null);
  };

  const handleDragDrop = (word) => {
    const correct = DRAG_DROP_LEVELS[dragIdx].answer;
    setDropped(word);
    if (word === correct) {
      setFeedback("correct");
      setStreak(s => s + 1);
      setScore(s => s + 1);
      addXP(streak >= 2 ? 20 : 10);
    } else {
      setFeedback("wrong");
      setStreak(0);
    }
  };

  const nextDrag = () => {
    if (dragIdx + 1 >= DRAG_DROP_LEVELS.length) {
      setScreen("fill");
      setFillIdx(0);
    } else {
      setDragIdx(i => i + 1);
    }
    setDropped(null);
    setFeedback(null);
  };

  const addWord = (word, idx) => {
    if (usedWords.includes(idx)) return;
    setBuiltSentence(s => [...s, word]);
    setUsedWords(u => [...u, idx]);
    setFeedback(null);
  };

  const removeWord = (pos) => {
    const newSent = builtSentence.filter((_, i) => i !== pos);
    setBuiltSentence(newSent);
    const wordToRemove = builtSentence[pos];
    const level_words = SENTENCE_PARTS[sentIdx].words;
    const firstIdx = level_words.findIndex((w, i) => w === wordToRemove && !usedWords.slice(0, usedWords.indexOf(usedWords.find((u, i2) => i2 === pos))).includes(i));
    setUsedWords(u => u.filter((_, i) => i !== pos));
    setFeedback(null);
  };

  const checkSentence = (e) => {
    const correct = SENTENCE_PARTS[sentIdx].correct;
    const isCorrect = JSON.stringify(builtSentence) === JSON.stringify(correct);
    if (isCorrect) {
      setFeedback("correct");
      setScore(s => s + 1);
      addXP(streak >= 2 ? 25 : 15, e);
      setStreak(s => s + 1);
    } else {
      setFeedback("wrong");
      setStreak(0);
    }
  };

  const nextSentence = () => {
    if (sentIdx + 1 >= SENTENCE_PARTS.length) {
      setScreen("complete");
    } else {
      setSentIdx(i => i + 1);
      setBuiltSentence([]);
      setUsedWords([]);
    }
    setFeedback(null);
  };

  const resetApp = () => {
    setScreen("home");
    setDragIdx(0); setFillIdx(0); setSentIdx(0);
    setSelected(null); setFeedback(null);
    setDropped(null); setBuiltSentence([]); setUsedWords([]);
    setScore(0); setStreak(0);
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #11998e 100%)",
      fontFamily: "'Nunito', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 16px",
      position: "relative", overflow: "hidden",
    },
    card: {
      background: "rgba(255,255,255,0.07)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 24, padding: 28,
      maxWidth: 480, width: "100%",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    },
    btn: (color = "#7C3AED", hover = false) => ({
      background: color,
      color: "#fff",
      border: "none",
      borderRadius: 14,
      padding: "12px 24px",
      fontFamily: "'Fredoka One', cursive",
      fontSize: 17,
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      transition: "transform 0.1s, box-shadow 0.1s",
    }),
    tag: (active, correct, wrong) => ({
      padding: "10px 18px",
      borderRadius: 12,
      fontFamily: "'Fredoka One', cursive",
      fontSize: 16,
      cursor: "pointer",
      border: `2px solid ${correct ? "#10B981" : wrong ? "#EF4444" : active ? "#FFD700" : "rgba(255,255,255,0.3)"}`,
      background: correct ? "rgba(16,185,129,0.2)" : wrong ? "rgba(239,68,68,0.2)" : active ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.07)",
      color: "#fff",
      transition: "all 0.2s",
      transform: active ? "scale(1.05)" : "scale(1)",
    }),
  };

  const currentDrag = DRAG_DROP_LEVELS[dragIdx];
  const currentFill = FILL_BLANKS[fillIdx];
  const currentSent = SENTENCE_PARTS[sentIdx];

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes particle { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-80px) scale(0)} }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes wobble { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-5deg)} 75%{transform:rotate(5deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .pop { animation: pop 0.4s ease forwards; }
        .wobble { animation: wobble 0.4s ease; }
        button:active { transform: scale(0.95) !important; }
        .word-chip { transition: all 0.2s; }
        .word-chip:hover { transform: translateY(-2px); }
      `}</style>

      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} color="#FFD700" onDone={() => setParticles(ps => ps.filter(x => x.id !== p.id))} />
      ))}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 480, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#fff" }}>
          🌍 PrepQuest
        </div>
        <XPBar xp={xp} level={level} />
      </div>

      {streak >= 2 && screen !== "home" && screen !== "complete" && (
        <div style={{ background: "linear-gradient(90deg,#FF8C00,#FFD700)", borderRadius: 99, padding: "4px 14px", marginBottom: 12, fontFamily: "'Fredoka One', cursive", fontSize: 14, color: "#fff", animation: "float 2s infinite" }}>
          🔥 {streak} streak! Bonus XP active!
        </div>
      )}

      {/* HOME */}
      {screen === "home" && (
        <div style={{ ...styles.card, textAlign: "center" }} className="pop">
          <div style={{ fontSize: 64, marginBottom: 8, animation: "float 3s infinite" }}>🌐</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 32, margin: "0 0 8px" }}>PrepQuest</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24, fontSize: 16 }}>
            Master English prepositions through fun mini-games! 🎮
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button style={{ ...styles.btn("linear-gradient(135deg,#7C3AED,#A855F7)"), padding: "16px 24px", fontSize: 18 }}
              onClick={() => setScreen("drag")}>
              🕹️ Start Adventure
            </button>
          </div>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 16 }}>
            {[["🎯","Drag & Drop"],["✏️","Fill Blanks"],["🔨","Build It"]].map(([icon, label]) => (
              <div key={label} style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRAG & DROP */}
      {screen === "drag" && (
        <div style={styles.card} className="pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#A78BFA", fontSize: 14 }}>
              🎯 DRAG & DROP · {dragIdx + 1}/{DRAG_DROP_LEVELS.length}
            </span>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 14 }}>⭐ {score}</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 6, animation: "float 2s infinite" }}>{currentDrag.image}</div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 20, margin: 0 }}>{currentDrag.question}</h2>
          </div>

          {/* Drop Zone */}
          <div ref={dropRef} style={{
            border: `2px dashed ${dropped ? (feedback === "correct" ? "#10B981" : "#EF4444") : "rgba(255,255,255,0.4)"}`,
            borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 20,
            background: dropped ? (feedback === "correct" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)") : "rgba(255,255,255,0.04)",
            transition: "all 0.3s",
          }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); if (!feedback) handleDragDrop(dragging); }}
          >
            <div style={{ fontSize: 32 }}>{currentDrag.target}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}>
              {dropped ? (
                <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: feedback === "correct" ? "#10B981" : "#EF4444" }}>
                  "{dropped}" {currentDrag.targetLabel} {feedback === "correct" ? "✅" : "❌"}
                </span>
              ) : `Drop the preposition here`}
            </div>
          </div>

          {/* Word Options */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 16 }}>
            {currentDrag.options.map(opt => (
              <div key={opt}
                draggable
                onDragStart={() => setDragging(opt)}
                onClick={() => !feedback && handleDragDrop(opt)}
                className="word-chip"
                style={{
                  ...styles.tag(dragging === opt, dropped === opt && feedback === "correct", dropped === opt && feedback === "wrong"),
                  cursor: feedback ? "default" : "grab",
                  opacity: feedback && dropped !== opt ? 0.5 : 1,
                }}>
                {opt}
              </div>
            ))}
          </div>

          {feedback && (
            <div className="pop" style={{
              background: feedback === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${feedback === "correct" ? "#10B981" : "#EF4444"}`,
              borderRadius: 12, padding: 12, marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", color: feedback === "correct" ? "#10B981" : "#EF4444", fontSize: 16 }}>
                {feedback === "correct" ? "🎉 Correct! +" + (streak >= 2 ? "20" : "10") + " XP" : "❌ Not quite!"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>{currentDrag.hint}</div>
            </div>
          )}

          {feedback && (
            <button style={{ ...styles.btn("linear-gradient(135deg,#7C3AED,#06B6D4)"), width: "100%" }} onClick={nextDrag}>
              {dragIdx + 1 >= DRAG_DROP_LEVELS.length ? "Next Level →" : "Next Question →"}
            </button>
          )}
        </div>
      )}

      {/* FILL IN THE BLANK */}
      {screen === "fill" && (
        <div style={styles.card} className="pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#A78BFA", fontSize: 14 }}>
              ✏️ FILL BLANK · {fillIdx + 1}/{FILL_BLANKS.length}
            </span>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 14 }}>⭐ {score}</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 8, animation: "float 2s infinite" }}>{currentFill.emoji}</div>
            <div style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 22, lineHeight: 1.5 }}>
              {currentFill.sentence.split("___").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span style={{
                      display: "inline-block", minWidth: 60, borderBottom: `3px solid ${selected ? (feedback === "correct" ? "#10B981" : "#EF4444") : "#FFD700"}`,
                      color: selected ? (feedback === "correct" ? "#10B981" : "#EF4444") : "#FFD700",
                      marginX: 4, padding: "0 6px",
                    }}>
                      {selected || "___"}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 16 }}>
            {currentFill.options.map(opt => (
              <button key={opt} className="word-chip"
                onClick={(e) => handleFillSelect(opt, e)}
                style={{
                  ...styles.tag(selected === opt, selected === opt && feedback === "correct", selected === opt && feedback === "wrong"),
                  cursor: feedback ? "default" : "pointer",
                  opacity: feedback && selected !== opt ? 0.5 : 1,
                }}>
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="pop" style={{
              background: feedback === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${feedback === "correct" ? "#10B981" : "#EF4444"}`,
              borderRadius: 12, padding: 12, marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", color: feedback === "correct" ? "#10B981" : "#EF4444", fontSize: 16 }}>
                {feedback === "correct" ? `🎉 "${currentFill.answer}" is correct! +${streak >= 2 ? "20" : "10"} XP` : `❌ The answer is "${currentFill.answer}"`}
              </div>
            </div>
          )}

          {feedback && (
            <button style={{ ...styles.btn("linear-gradient(135deg,#7C3AED,#06B6D4)"), width: "100%" }} onClick={nextFill}>
              {fillIdx + 1 >= FILL_BLANKS.length ? "Final Challenge →" : "Next Question →"}
            </button>
          )}
        </div>
      )}

      {/* SENTENCE BUILDER */}
      {screen === "sentence" && (
        <div style={styles.card} className="pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#A78BFA", fontSize: 14 }}>
              🔨 BUILD IT · {sentIdx + 1}/{SENTENCE_PARTS.length}
            </span>
            <span style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 14 }}>⭐ {score}</span>
          </div>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 6 }}>{currentSent.emoji}</div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>{currentSent.prompt}</p>
          </div>

          {/* Built sentence display */}
          <div style={{
            minHeight: 56, background: "rgba(255,255,255,0.06)", borderRadius: 14,
            padding: 12, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center",
            border: `2px solid ${feedback === "correct" ? "#10B981" : feedback === "wrong" ? "#EF4444" : "rgba(255,255,255,0.15)"}`,
          }}>
            {builtSentence.length === 0 ? (
              <span style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic", fontSize: 14 }}>Tap words below to build the sentence...</span>
            ) : builtSentence.map((word, i) => (
              <span key={i} onClick={() => !feedback && removeWord(i)} className="word-chip" style={{
                background: "rgba(124,58,237,0.4)", border: "1px solid rgba(167,139,250,0.5)",
                borderRadius: 8, padding: "4px 10px", color: "#fff", fontFamily: "'Fredoka One', cursive",
                cursor: "pointer", fontSize: 15,
              }}>{word}</span>
            ))}
          </div>

          {/* Word bank */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" }}>
            {currentSent.words.map((word, i) => (
              <span key={i} onClick={() => !feedback && addWord(word, i)} className="word-chip" style={{
                background: usedWords.includes(i) ? "rgba(255,255,255,0.05)" : "rgba(6,182,212,0.2)",
                border: `1px solid ${usedWords.includes(i) ? "rgba(255,255,255,0.1)" : "rgba(6,182,212,0.5)"}`,
                borderRadius: 8, padding: "6px 12px", color: usedWords.includes(i) ? "rgba(255,255,255,0.2)" : "#fff",
                cursor: usedWords.includes(i) ? "default" : "pointer",
                fontFamily: "'Fredoka One', cursive", fontSize: 15,
                textDecoration: usedWords.includes(i) ? "line-through" : "none",
              }}>{word}</span>
            ))}
          </div>

          {feedback && (
            <div className="pop" style={{
              background: feedback === "correct" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${feedback === "correct" ? "#10B981" : "#EF4444"}`,
              borderRadius: 12, padding: 12, marginBottom: 12, textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", color: feedback === "correct" ? "#10B981" : "#EF4444", fontSize: 16 }}>
                {feedback === "correct" ? `🎉 Perfect! +${streak >= 2 ? "25" : "15"} XP` : `❌ Not quite! Try: "${currentSent.correct.join(" ")}"`}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            {!feedback && (
              <>
                <button style={{ ...styles.btn("rgba(255,255,255,0.1)"), flex: 1, fontSize: 14 }}
                  onClick={() => { setBuiltSentence([]); setUsedWords([]); }}>
                  🔄 Clear
                </button>
                <button style={{ ...styles.btn("linear-gradient(135deg,#7C3AED,#06B6D4)"), flex: 2 }}
                  onClick={checkSentence} disabled={builtSentence.length === 0}>
                  ✅ Check
                </button>
              </>
            )}
            {feedback && (
              <button style={{ ...styles.btn("linear-gradient(135deg,#7C3AED,#06B6D4)"), width: "100%" }}
                onClick={nextSentence}>
                {sentIdx + 1 >= SENTENCE_PARTS.length ? "🏆 See Results" : "Next →"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* COMPLETE */}
      {screen === "complete" && (
        <div style={{ ...styles.card, textAlign: "center" }} className="pop">
          <div style={{ fontSize: 72, animation: "float 2s infinite" }}>🏆</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 32, margin: "8px 0" }}>Quest Complete!</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>You've mastered the preposition challenges!</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
            {[["⭐", score, "Score"], ["🔥", streak, "Streak"], ["📊", level, "Level"]].map(([icon, val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>{icon}</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 24 }}>{val}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Fredoka One', cursive", color: "#A78BFA", marginBottom: 8 }}>📚 Quick Reference</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {[["in","place/time period"],["on","surface/day"],["at","specific time/place"],["over","above/across"],["under","below"]].map(([prep, use]) => (
                <div key={prep} style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 12 }}>
                  <span style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700" }}>{prep}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}> = {use}</span>
                </div>
              ))}
            </div>
          </div>

          <button style={{ ...styles.btn("linear-gradient(135deg,#7C3AED,#A855F7)"), width: "100%", fontSize: 18, padding: "16px" }}
            onClick={resetApp}>
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  );
}

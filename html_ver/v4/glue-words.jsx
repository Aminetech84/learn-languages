import { useState, useEffect } from "react";

// A1 Glue words: word, scene emoji, simple label
const WORDS = [
  { word: "in",      scene: "🏠📦",  label: "inside something",    wrong: "on"   },
  { word: "on",      scene: "📱🛋️",  label: "on top of something", wrong: "in"   },
  { word: "at",      scene: "🕒📍",  label: "a specific place/time",wrong: "by"  },
  { word: "under",   scene: "🐕🛏️",  label: "below something",     wrong: "over" },
  { word: "over",    scene: "🌈🏙️",  label: "above, crossing",     wrong: "under"},
  { word: "by",      scene: "🧍🚪",  label: "next to / near",      wrong: "at"   },
  { word: "with",    scene: "👫☕",   label: "together",            wrong: "by"   },
  { word: "for",     scene: "🎁👤",  label: "intended for someone", wrong: "from" },
  { word: "from",    scene: "✈️🗺️",  label: "origin / where from", wrong: "for"  },
  { word: "about",   scene: "💬❓",  label: "the topic / subject",  wrong: "with" },
];

const BATCH_SIZE = 3;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const BATCHES = chunk(WORDS, BATCH_SIZE);

// Phase: "learn" | "quiz"
export default function App() {
  const [batchIdx, setBatchIdx] = useState(0);
  const [phase, setPhase] = useState("learn"); // learn | quiz | done
  const [learnStep, setLearnStep] = useState(0); // which word in batch
  const [quizQueue, setQuizQueue] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null); // null | "correct" | "wrong"
  const [swapped, setSwapped] = useState(false);
  const [totalLearned, setTotalLearned] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const batch = BATCHES[batchIdx] || [];
  const currentWord = batch[learnStep];

  // Setup quiz when entering quiz phase
  useEffect(() => {
    if (phase === "quiz") {
      const q = [...batch].sort(() => Math.random() - 0.5);
      setQuizQueue(q);
      setQuizIdx(0);
      setPicked(null);
      setSwapped(false);
      makeChoices(q[0], false);
    }
  }, [phase]);

  const makeChoices = (word, swap) => {
    if (!word) return;
    const correct = word.word;
    const wrong = word.wrong;
    const opts = swap ? [wrong, correct] : [correct, wrong];
    // randomize order
    setChoices(Math.random() > 0.5 ? opts : [opts[1], opts[0]]);
  };

  const nextLearn = () => {
    if (learnStep + 1 < batch.length) {
      setLearnStep(s => s + 1);
      setAnimKey(k => k + 1);
    } else {
      setPhase("quiz");
    }
  };

  const handlePick = (choice) => {
    if (picked) return;
    const qWord = quizQueue[quizIdx];
    if (choice === qWord.word) {
      setPicked("correct");
      setTotalLearned(t => t + 1);
    } else {
      setPicked("wrong");
    }
  };

  const nextQuiz = () => {
    const qWord = quizQueue[quizIdx];
    if (picked === "wrong") {
      // swap choices and retry same word
      const newSwap = !swapped;
      setSwapped(newSwap);
      makeChoices(qWord, newSwap);
      setPicked(null);
      return;
    }
    // correct — move on
    const next = quizIdx + 1;
    if (next >= quizQueue.length) {
      // batch done
      if (batchIdx + 1 >= BATCHES.length) {
        setPhase("done");
      } else {
        setBatchIdx(i => i + 1);
        setLearnStep(0);
        setPhase("learn");
        setAnimKey(k => k + 1);
      }
    } else {
      setQuizIdx(next);
      setPicked(null);
      setSwapped(false);
      makeChoices(quizQueue[next], false);
    }
  };

  const totalWords = WORDS.length;
  const progress = Math.round((totalLearned / totalWords) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F3EE",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop { 0%{transform:scale(0.92)} 60%{transform:scale(1.04)} 100%{transform:scale(1)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        .slide { animation: slideUp 0.38s cubic-bezier(.22,.68,0,1.2) both; }
        .pop { animation: pop 0.3s ease both; }
        .shake { animation: shake 0.35s ease; }
        button { cursor: pointer; border: none; outline: none; }
      `}</style>

      {/* Top bar */}
      <div style={{ width: "100%", maxWidth: 420, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1a1a", letterSpacing: -0.5 }}>
            glue<span style={{ color: "#FF6B35" }}>words</span>
          </span>
          <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>
            {totalLearned}/{totalWords} learned
          </span>
        </div>
        <div style={{ height: 6, background: "#E8E2DA", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #FF6B35, #FF9F1C)",
            borderRadius: 99, transition: "width 0.5s ease"
          }} />
        </div>
      </div>

      {/* LEARN PHASE */}
      {phase === "learn" && currentWord && (
        <div key={animKey} className="slide" style={{
          width: "100%", maxWidth: 420,
          background: "#fff",
          borderRadius: 28,
          padding: 36,
          boxShadow: "0 4px 40px rgba(0,0,0,0.07)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#bbb", textTransform: "uppercase", marginBottom: 20 }}>
            Batch {batchIdx + 1} · Word {learnStep + 1} of {batch.length}
          </div>

          {/* Scene */}
          <div style={{
            fontSize: 64, marginBottom: 20, lineHeight: 1,
            background: "#F7F3EE", borderRadius: 20, padding: "20px 24px",
            display: "inline-block",
          }}>
            {currentWord.scene}
          </div>

          {/* Word */}
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: 52,
            color: "#1a1a1a", letterSpacing: -2,
            marginBottom: 8,
          }}>
            {currentWord.word}
          </div>

          {/* Label */}
          <div style={{
            fontSize: 16, color: "#666", fontWeight: 500,
            marginBottom: 36,
          }}>
            {currentWord.label}
          </div>

          <button
            onClick={nextLearn}
            style={{
              width: "100%", padding: "16px 0",
              background: "#1a1a1a", color: "#fff",
              borderRadius: 16, fontSize: 16, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              transition: "transform 0.1s, background 0.2s",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {learnStep + 1 < batch.length ? "Got it →" : "Quiz time →"}
          </button>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === "quiz" && quizQueue[quizIdx] && (
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#aaa", fontWeight: 600, marginBottom: 24, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Which word fits?
          </div>

          {/* Scene */}
          <div key={`scene-${quizIdx}-${swapped}`} className="slide" style={{
            background: "#fff", borderRadius: 28,
            padding: 32, marginBottom: 20,
            boxShadow: "0 4px 40px rgba(0,0,0,0.07)",
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{quizQueue[quizIdx].scene}</div>
            <div style={{ fontSize: 15, color: "#888", fontWeight: 500 }}>{quizQueue[quizIdx].label}</div>
          </div>

          {/* Choices */}
          <div style={{ display: "flex", gap: 12 }}>
            {choices.map((choice, i) => {
              const isCorrect = choice === quizQueue[quizIdx].word;
              const isPicked = picked !== null;
              let bg = "#fff";
              let border = "2px solid #E8E2DA";
              let color = "#1a1a1a";
              if (isPicked) {
                if (isCorrect) { bg = "#ECFDF5"; border = "2px solid #10B981"; color = "#065F46"; }
                else if (choice !== quizQueue[quizIdx].word && picked === "wrong") {
                  bg = "#FEF2F2"; border = "2px solid #EF4444"; color = "#991B1B";
                }
              }
              return (
                <button key={`${choice}-${i}-${swapped}`}
                  onClick={() => handlePick(choice)}
                  className={isPicked && !isCorrect && picked === "wrong" ? "shake" : ""}
                  style={{
                    flex: 1, padding: "22px 0",
                    background: bg, border, borderRadius: 18,
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800, fontSize: 28, color,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {picked && (
            <div className="pop" style={{ marginTop: 20 }}>
              {picked === "correct" ? (
                <div style={{ color: "#10B981", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
                  ✓ Correct!
                </div>
              ) : (
                <div style={{ color: "#EF4444", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
                  Try again →
                </div>
              )}
              <button
                onClick={nextQuiz}
                style={{
                  width: "100%", padding: "15px 0",
                  background: picked === "correct" ? "#1a1a1a" : "#EF4444",
                  color: "#fff", borderRadius: 16,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: 16,
                  transition: "transform 0.1s",
                }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {picked === "wrong" ? "Try again" : quizIdx + 1 >= quizQueue.length ? batchIdx + 1 >= BATCHES.length ? "Finish →" : "Next batch →" : "Next →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* DONE */}
      {phase === "done" && (
        <div className="slide" style={{
          width: "100%", maxWidth: 420,
          background: "#fff", borderRadius: 28,
          padding: 40, textAlign: "center",
          boxShadow: "0 4px 40px rgba(0,0,0,0.07)",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: "#1a1a1a", letterSpacing: -1, marginBottom: 8 }}>
            All done!
          </div>
          <div style={{ color: "#888", fontSize: 15, marginBottom: 32 }}>
            You know all {totalWords} A1 glue words.<br />You're ready for the next level.
          </div>
          <button
            onClick={() => { setBatchIdx(0); setLearnStep(0); setPhase("learn"); setTotalLearned(0); setAnimKey(k => k+1); }}
            style={{
              width: "100%", padding: "16px 0",
              background: "#FF6B35", color: "#fff",
              borderRadius: 16, fontSize: 16, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

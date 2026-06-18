import { useState, useEffect, useCallback } from "react";

// ── CSS ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --bg: #0F0E0C;
    --bg2: #171614;
    --surface: #1E1C19;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --ink: #F0EDE8;
    --ink2: #9C9690;
    --ink3: #5A5650;
    --accent: #C8A96E;
    --accent-dim: rgba(200,169,110,0.12);
    --accent-border: rgba(200,169,110,0.3);
    --green: #4E9B6F;
    --green-dim: rgba(78,155,111,0.1);
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
    --mono: 'DM Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cl-root {
    background: var(--bg);
    color: var(--ink);
    font-family: var(--sans);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem 4rem;
  }

  .cl-screen {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* WELCOME */
  .cl-welcome {
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    gap: 0;
    padding: 2rem 0;
  }

  .welcome-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 2rem;
    animation: fadeUp 0.6s 0.2s both;
  }

  .welcome-title {
    font-family: var(--serif);
    font-size: clamp(36px, 7vw, 56px);
    font-weight: 400;
    line-height: 1.15;
    color: var(--ink);
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s 0.4s both;
  }

  .welcome-title em { font-style: italic; color: var(--accent); }

  .welcome-sub {
    font-size: 16px;
    color: var(--ink2);
    line-height: 1.7;
    max-width: 420px;
    margin: 0 auto 3rem;
    animation: fadeUp 0.6s 0.6s both;
  }

  .welcome-btn {
    background: var(--accent);
    color: var(--bg);
    border: none;
    border-radius: 10px;
    padding: 14px 36px;
    font-family: var(--sans);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    animation: fadeUp 0.6s 0.8s both;
    transition: opacity 0.15s, transform 0.1s;
  }

  .welcome-btn:hover { opacity: 0.88; }
  .welcome-btn:active { transform: scale(0.97); }

  /* PICKER */
  .cl-picker {
    padding: 3rem 0 2rem;
    gap: 0;
  }

  .picker-top {
    width: 100%;
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .picker-q {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 400;
    font-style: italic;
    color: var(--ink);
    margin-bottom: 8px;
  }

  .picker-sub {
    font-size: 13px;
    color: var(--ink3);
    font-family: var(--mono);
    letter-spacing: 0.04em;
  }

  .word-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    margin-bottom: 2rem;
  }

  .word-tile {
    background: var(--surface);
    border: 0.5px solid var(--border2);
    border-radius: 12px;
    padding: 18px 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .word-tile:hover { border-color: var(--accent-border); background: var(--accent-dim); }
  .word-tile.selected { border-color: var(--accent); background: var(--accent-dim); }

  .tile-word { font-family: var(--serif); font-size: 20px; font-weight: 400; color: var(--ink); }
  .tile-pos { font-family: var(--mono); font-size: 10px; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.07em; }

  .picker-hint {
    font-size: 13px;
    color: var(--ink3);
    font-family: var(--mono);
    text-align: center;
    margin-bottom: 1.5rem;
    min-height: 18px;
    transition: opacity 0.3s;
  }

  .picker-actions { display: flex; gap: 10px; width: 100%; }

  .btn-ghost {
    flex: 1;
    padding: 11px;
    background: transparent;
    border: 0.5px solid var(--border2);
    border-radius: 10px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink3);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.04em;
  }

  .btn-ghost:hover { border-color: var(--ink3); color: var(--ink2); }

  .btn-go {
    flex: 2;
    padding: 11px;
    background: var(--accent);
    border: none;
    border-radius: 10px;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 500;
    color: var(--bg);
    cursor: pointer;
    opacity: 0.35;
    pointer-events: none;
    transition: all 0.2s;
  }

  .btn-go.ready { opacity: 1; pointer-events: all; }
  .btn-go.ready:hover { opacity: 0.88; }

  /* BUILDER */
  .cl-builder {
    padding: 2rem 0;
    gap: 0;
    align-items: flex-start;
  }

  .builder-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2rem;
  }

  .builder-logo { font-family: var(--mono); font-size: 11px; color: var(--ink3); letter-spacing: 0.08em; text-transform: uppercase; }
  .builder-prog { font-family: var(--mono); font-size: 11px; color: var(--ink3); }

  .story-so-far {
    width: 100%;
    min-height: 60px;
    margin-bottom: 1.5rem;
    padding: 0 0 1.25rem;
    border-bottom: 0.5px solid var(--border);
  }

  .story-line { font-family: var(--serif); font-size: 15px; font-style: italic; color: var(--ink3); line-height: 1.8; margin-bottom: 4px; transition: color 0.5s; }
  .story-line.current { color: var(--ink2); }
  .story-line.fresh { color: var(--green); }

  .sentence-stage { width: 100%; margin-bottom: 2rem; min-height: 90px; }

  .sentence-text { font-family: var(--serif); font-size: clamp(20px, 3.5vw, 28px); line-height: 1.75; color: var(--ink); }

  .token { display: inline; white-space: pre; opacity: 0; transition: opacity 0.45s ease; }
  .token.in { opacity: 1; }
  .token.new { color: var(--accent); }
  .token.settle { color: var(--ink); transition: color 1.4s ease, opacity 0.45s ease; }

  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
  .cursor {
    display: inline-block;
    width: 2px;
    height: 0.85em;
    background: var(--accent);
    vertical-align: text-bottom;
    margin-left: 1px;
    animation: blink 1.1s infinite;
  }

  .step-bar { width: 100%; height: 2px; background: var(--border2); border-radius: 99px; margin-bottom: 1.5rem; overflow: hidden; }
  .step-fill { height: 100%; background: var(--accent); border-radius: 99px; transition: width 0.4s ease; }

  .step-hint { font-family: var(--mono); font-size: 11px; color: var(--ink3); letter-spacing: 0.05em; margin-bottom: 1.5rem; min-height: 16px; }

  .builder-actions { display: flex; align-items: center; justify-content: space-between; width: 100%; }
  .action-left { display: flex; gap: 8px; }

  .btn-sm {
    padding: 8px 16px;
    background: transparent;
    border: 0.5px solid var(--border2);
    border-radius: 8px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink3);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.04em;
  }

  .btn-sm:hover { border-color: var(--ink3); color: var(--ink2); }

  .btn-advance {
    padding: 10px 28px;
    background: var(--accent);
    color: var(--bg);
    border: none;
    border-radius: 10px;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
  }

  .btn-advance:hover { opacity: 0.88; }
  .btn-advance:active { transform: scale(0.97); }
  .btn-advance.next-line { background: var(--green); }
  .btn-advance.done { background: var(--ink2); }

  /* DONE */
  .cl-done {
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 3rem 0;
    gap: 0;
  }

  .done-eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); margin-bottom: 1.5rem; }
  .done-title { font-family: var(--serif); font-size: clamp(28px,5vw,42px); font-weight: 400; font-style: italic; color: var(--ink); margin-bottom: 2.5rem; line-height: 1.3; }

  .done-story { width: 100%; background: var(--surface); border: 0.5px solid var(--border2); border-radius: 16px; padding: 2rem; text-align: left; margin-bottom: 2rem; }
  .done-story-line { font-family: var(--serif); font-size: 17px; font-style: italic; color: var(--ink2); line-height: 1.9; }
  .done-story-line + .done-story-line { margin-top: 8px; }

  .done-anchor { font-family: var(--mono); font-size: 12px; color: var(--ink3); margin-bottom: 2rem; letter-spacing: 0.05em; }
  .done-anchor span { color: var(--accent); }

  .done-actions { display: flex; gap: 10px; width: 100%; }

  .btn-outline {
    flex: 1;
    padding: 12px;
    background: transparent;
    border: 0.5px solid var(--border2);
    border-radius: 10px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink3);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.04em;
  }

  .btn-outline:hover { border-color: var(--accent-border); color: var(--accent); }

  .btn-solid {
    flex: 2;
    padding: 12px;
    background: var(--accent);
    border: none;
    border-radius: 10px;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 500;
    color: var(--bg);
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .btn-solid:hover { opacity: 0.88; }

  /* OVERLAY */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,14,12,0.92);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 100;
    padding: 0 1rem 2rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .overlay.open { opacity: 1; pointer-events: all; }

  .overlay-card {
    width: 100%;
    max-width: 560px;
    background: var(--surface);
    border: 0.5px solid var(--border2);
    border-radius: 20px 20px 16px 16px;
    padding: 1.75rem;
    transform: translateY(30px);
    transition: transform 0.35s ease;
  }

  .overlay.open .overlay-card { transform: translateY(0); }

  .ov-phase { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
  .ov-line { font-family: var(--serif); font-size: 16px; font-style: italic; color: var(--ink2); line-height: 1.7; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 0.5px solid var(--border); }
  .ov-title { font-size: 12px; color: var(--ink3); margin-bottom: 1rem; font-family: var(--mono); letter-spacing: 0.05em; }

  .know-words { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }

  .know-word {
    background: var(--bg);
    border: 0.5px solid var(--border2);
    border-radius: 10px;
    padding: 10px 14px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    min-width: 80px;
  }

  .know-word:hover { border-color: var(--accent-border); }
  .know-word.k-yes { border-color: var(--green); background: var(--green-dim); }
  .know-word.k-seen { border-color: var(--accent-border); background: var(--accent-dim); }
  .know-word.k-no { opacity: 0.45; }

  .kw-text { font-family: var(--serif); font-size: 17px; color: var(--ink); display: block; margin-bottom: 3px; }
  .kw-state { font-family: var(--mono); font-size: 10px; color: var(--ink3); display: block; letter-spacing: 0.05em; }
  .know-word.k-yes .kw-state { color: var(--green); }
  .know-word.k-seen .kw-state { color: var(--accent); }

  .mission-box { display: none; background: var(--accent-dim); border: 0.5px solid var(--accent-border); border-radius: 12px; padding: 14px 16px; margin-bottom: 1.25rem; }
  .mission-box.visible { display: block; }
  .mission-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .mission-text { font-size: 14px; color: var(--ink2); line-height: 1.6; }
  .mission-text strong { color: var(--ink); font-weight: 500; }

  .ov-actions { display: flex; gap: 8px; }

  .ov-btn-ghost {
    flex: 1; padding: 11px; background: transparent;
    border: 0.5px solid var(--border2); border-radius: 10px;
    font-family: var(--mono); font-size: 12px; color: var(--ink3);
    cursor: pointer; transition: all 0.15s; letter-spacing: 0.04em;
  }

  .ov-btn-ghost:hover { color: var(--ink2); border-color: var(--ink3); }

  .ov-btn-next {
    flex: 2; padding: 11px; background: var(--accent); color: var(--bg);
    border: none; border-radius: 10px; font-family: var(--sans);
    font-size: 14px; font-weight: 500; cursor: pointer;
    opacity: 0.35; pointer-events: none; transition: all 0.2s;
  }

  .ov-btn-next.ready { opacity: 1; pointer-events: all; }
  .ov-btn-next.ready:hover { opacity: 0.88; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// ── DATA ──
const WORD_BANK = [
  { word: "woman",  pos: "noun",  hint: "a person — the anchor of your story" },
  { word: "man",    pos: "noun",  hint: "a person — someone carrying a weight" },
  { word: "child",  pos: "noun",  hint: "a small person — the world is new to them" },
  { word: "mother", pos: "noun",  hint: "a role — someone who gives without asking" },
  { word: "friend", pos: "noun",  hint: "a bond — the one you call" },
  { word: "life",   pos: "noun",  hint: "the biggest word in the bank" },
  { word: "work",   pos: "noun",  hint: "what fills the days" },
  { word: "home",   pos: "noun",  hint: "a place — or a feeling" },
  { word: "time",   pos: "noun",  hint: "the one thing no one has enough of" },
  { word: "hope",   pos: "noun",  hint: "small, but it holds everything" },
  { word: "love",   pos: "verb",  hint: "the reason most stories exist" },
  { word: "water",  pos: "noun",  hint: "simple, necessary, universal" },
];

const STORIES = {
  woman: [
    { steps: [
      { tokens: ["woman"],                                                hint: "noun — anchor" },
      { tokens: ["The ", "woman"],                                        hint: "the — this specific one" },
      { tokens: ["The ", "young ", "woman"],                              hint: "young — adjective" },
      { tokens: ["The ", "young ", "woman ", "gets up"],                  hint: "gets up — phrasal verb" },
      { tokens: ["The ", "young ", "woman ", "gets up ", "early,"],       hint: "early — adverb" },
      { tokens: ["The ", "young ", "woman ", "gets up ", "early, ", "before ", "the ", "light."], hint: "before the light — time phrase" },
    ]},
    { steps: [
      { tokens: ["She ", "loves"],                                        hint: "she loves — pronoun + verb" },
      { tokens: ["She ", "loves ", "her ", "work,"],                      hint: "her work — what drives her" },
      { tokens: ["She ", "loves ", "her ", "work, ", "and ", "carries on"], hint: "carries on — phrasal verb" },
      { tokens: ["She ", "loves ", "her ", "work, ", "and ", "carries on ", "happily ", "all ", "day."], hint: "happily — happy + -ly" },
    ]},
    { steps: [
      { tokens: ["At ", "night,"],                                        hint: "at night — time phrase" },
      { tokens: ["At ", "night, ", "she ", "sits down"],                  hint: "sits down — phrasal verb" },
      { tokens: ["At ", "night, ", "she ", "sits down ", "and ", "writes"], hint: "writes — verb root" },
      { tokens: ["At ", "night, ", "she ", "sits down ", "and ", "writes ", "a ", "story —"], hint: "a story — indefinite article + noun" },
      { tokens: ["At ", "night, ", "she ", "sits down ", "and ", "writes ", "a ", "story — ", "her ", "own."], hint: "her own — possession, identity" },
    ]},
  ],
  man: [
    { steps: [
      { tokens: ["man"],                                                  hint: "noun — anchor" },
      { tokens: ["The ", "old ", "man"],                                  hint: "old — adjective" },
      { tokens: ["The ", "old ", "man ", "sits back"],                    hint: "sits back — phrasal verb" },
      { tokens: ["The ", "old ", "man ", "sits back ", "by ", "the ", "door,"], hint: "by the door — place" },
      { tokens: ["The ", "old ", "man ", "sits back ", "by ", "the ", "door, ", "alone."], hint: "alone — adverb" },
    ]},
    { steps: [
      { tokens: ["He ", "thinks"],                                        hint: "he thinks — pronoun + verb" },
      { tokens: ["He ", "thinks ", "about ", "his ", "life,"],            hint: "about his life — prepositional phrase" },
      { tokens: ["He ", "thinks ", "about ", "his ", "life, ", "the ", "long ", "road,"], hint: "the long road — metaphor" },
      { tokens: ["He ", "thinks ", "about ", "his ", "life, ", "the ", "long ", "road, ", "the ", "people ", "he ", "loved."], hint: "the people he loved — relative clause" },
    ]},
    { steps: [
      { tokens: ["But ", "he ", "does not ", "feel ", "sad."],            hint: "but — contrast" },
      { tokens: ["But ", "he ", "does not ", "feel ", "sad. ", "He ", "smiles,"], hint: "he smiles — new action" },
      { tokens: ["But ", "he ", "does not ", "feel ", "sad. ", "He ", "smiles, ", "slowly,"], hint: "slowly — adverb" },
      { tokens: ["But ", "he ", "does not ", "feel ", "sad. ", "He ", "smiles, ", "slowly, ", "like ", "a ", "man ", "who ", "knows."], hint: "like a man who knows — comparison" },
    ]},
  ],
  child: [
    { steps: [
      { tokens: ["child"],                                                hint: "noun — anchor" },
      { tokens: ["The ", "child"],                                        hint: "the — this one" },
      { tokens: ["The ", "child ", "was ", "afraid"],                     hint: "afraid — adjective" },
      { tokens: ["The ", "child ", "was ", "afraid ", "of ", "the ", "dark."], hint: "of the dark — prepositional phrase" },
    ]},
    { steps: [
      { tokens: ["So ", "she ", "turned on"],                             hint: "turned on — phrasal verb" },
      { tokens: ["So ", "she ", "turned on ", "the ", "light,"],          hint: "the light — noun" },
      { tokens: ["So ", "she ", "turned on ", "the ", "light, ", "and ", "held on"],  hint: "held on — phrasal verb" },
      { tokens: ["So ", "she ", "turned on ", "the ", "light, ", "and ", "held on ", "to ", "her ", "mother's ", "hand."], hint: "her mother's hand — possession" },
    ]},
    { steps: [
      { tokens: ["In ", "the ", "morning,"],                              hint: "in the morning — time" },
      { tokens: ["In ", "the ", "morning, ", "she ", "was not ", "afraid ", "anymore."], hint: "not anymore — negation of past" },
      { tokens: ["In ", "the ", "morning, ", "she ", "was not ", "afraid ", "anymore. ", "She ", "had ", "grown up,"], hint: "grown up — phrasal verb, past" },
      { tokens: ["In ", "the ", "morning, ", "she ", "was not ", "afraid ", "anymore. ", "She ", "had ", "grown up, ", "a ", "little."], hint: "a little — degree phrase" },
    ]},
  ],
  mother: [
    { steps: [
      { tokens: ["mother"],                                               hint: "noun — anchor" },
      { tokens: ["The ", "mother"],                                       hint: "the — this one" },
      { tokens: ["The ", "mother ", "wakes up"],                          hint: "wakes up — phrasal verb" },
      { tokens: ["The ", "mother ", "wakes up ", "before ", "everyone."], hint: "before everyone — time phrase" },
    ]},
    { steps: [
      { tokens: ["She ", "makes"],                                        hint: "she makes — verb" },
      { tokens: ["She ", "makes ", "hot ", "food,"],                      hint: "hot food — adjective + noun" },
      { tokens: ["She ", "makes ", "hot ", "food, ", "quietly,"],         hint: "quietly — adverb" },
      { tokens: ["She ", "makes ", "hot ", "food, ", "quietly, ", "so ", "no one ", "wakes."], hint: "so no one wakes — purpose clause" },
    ]},
    { steps: [
      { tokens: ["She ", "asks ", "for ", "nothing."],                    hint: "asks for nothing — giving without return" },
      { tokens: ["She ", "asks ", "for ", "nothing. ", "That ", "is ", "her ", "power."], hint: "that is her power — statement" },
      { tokens: ["She ", "asks ", "for ", "nothing. ", "That ", "is ", "her ", "power. ", "And ", "her ", "story."], hint: "and her story — the close" },
    ]},
  ],
  friend: [
    { steps: [
      { tokens: ["friend"],                                               hint: "noun — anchor" },
      { tokens: ["A ", "friend"],                                         hint: "a — indefinite, any friend" },
      { tokens: ["A ", "friend ", "calls."],                              hint: "calls — verb, present simple" },
      { tokens: ["A ", "friend ", "calls. ", "You ", "pick up."],         hint: "pick up — phrasal verb" },
    ]},
    { steps: [
      { tokens: ["You ", "do not ", "speak ", "much."],                   hint: "do not speak — negation" },
      { tokens: ["You ", "do not ", "speak ", "much. ", "You ", "do not ", "need to."], hint: "do not need to — implied understanding" },
      { tokens: ["You ", "do not ", "speak ", "much. ", "You ", "do not ", "need to. ", "The ", "call ", "is ", "enough."], hint: "the call is enough — simple truth" },
    ]},
    { steps: [
      { tokens: ["After,"],                                               hint: "after — time connector" },
      { tokens: ["After, ", "you ", "feel ", "strong."],                  hint: "feel strong — verb + adjective" },
      { tokens: ["After, ", "you ", "feel ", "strong. ", "That ", "is ", "what ", "a ", "friend ", "does."], hint: "that is what — defining clause" },
      { tokens: ["After, ", "you ", "feel ", "strong. ", "That ", "is ", "what ", "a ", "friend ", "does. ", "Without ", "a ", "word."], hint: "without a word — prepositional close" },
    ]},
  ],
  life: [
    { steps: [
      { tokens: ["life"],                                                 hint: "noun — the biggest anchor" },
      { tokens: ["Life ", "is ", "short."],                               hint: "is — linking verb" },
      { tokens: ["Life ", "is ", "short. ", "Everyone ", "knows."],       hint: "everyone knows — universal truth" },
      { tokens: ["Life ", "is ", "short. ", "Everyone ", "knows. ", "No one ", "believes it."], hint: "no one believes it — the contradiction" },
    ]},
    { steps: [
      { tokens: ["But ", "some ", "people "],                             hint: "but — contrast" },
      { tokens: ["But ", "some ", "people ", "wake up ", "early."],       hint: "wake up early — choice" },
      { tokens: ["But ", "some ", "people ", "wake up ", "early. ", "They ", "make things."], hint: "make things — verb + object" },
      { tokens: ["But ", "some ", "people ", "wake up ", "early. ", "They ", "make things. ", "They ", "love ", "deeply."], hint: "deeply — deep + -ly" },
    ]},
    { steps: [
      { tokens: ["And ", "when ", "their ", "time ", "runs out,"],        hint: "runs out — phrasal verb" },
      { tokens: ["And ", "when ", "their ", "time ", "runs out, ", "they ", "leave ", "something."], hint: "leave something — they gave" },
      { tokens: ["And ", "when ", "their ", "time ", "runs out, ", "they ", "leave ", "something. ", "A ", "story."], hint: "a story — the final word" },
    ]},
  ],
  work: [
    { steps: [
      { tokens: ["work"],                                                 hint: "noun — the anchor" },
      { tokens: ["The ", "work ", "is ", "hard."],                        hint: "is hard — adjective" },
      { tokens: ["The ", "work ", "is ", "hard. ", "It ", "is ", "always ", "hard."], hint: "always — frequency adverb" },
      { tokens: ["The ", "work ", "is ", "hard. ", "It ", "is ", "always ", "hard. ", "But ", "he ", "keeps on."], hint: "keeps on — phrasal verb" },
    ]},
    { steps: [
      { tokens: ["Every ", "morning,"],                                   hint: "every morning — time phrase" },
      { tokens: ["Every ", "morning, ", "he ", "gets up."],               hint: "gets up — phrasal verb" },
      { tokens: ["Every ", "morning, ", "he ", "gets up. ", "He ", "does not ", "wait."], hint: "does not wait — action, not hesitation" },
      { tokens: ["Every ", "morning, ", "he ", "gets up. ", "He ", "does not ", "wait. ", "He ", "goes out."], hint: "goes out — phrasal verb" },
    ]},
    { steps: [
      { tokens: ["One ", "day,"],                                         hint: "one day — future marker" },
      { tokens: ["One ", "day, ", "it ", "will ", "be ", "enough."],      hint: "will be — future simple" },
      { tokens: ["One ", "day, ", "it ", "will ", "be ", "enough. ", "He ", "believes this."], hint: "he believes this — faith" },
      { tokens: ["One ", "day, ", "it ", "will ", "be ", "enough. ", "He ", "believes this. ", "That ", "is ", "why ", "he ", "works."], hint: "that is why — causal close" },
    ]},
  ],
  hope: [
    { steps: [
      { tokens: ["hope"],                                                 hint: "noun — the lightest anchor" },
      { tokens: ["Hope ", "is ", "small."],                               hint: "is small — adjective" },
      { tokens: ["Hope ", "is ", "small. ", "You ", "can ", "miss it."],  hint: "can miss it — possibility" },
      { tokens: ["Hope ", "is ", "small. ", "You ", "can ", "miss it. ", "Most ", "people ", "do."], hint: "most people do — universal" },
    ]},
    { steps: [
      { tokens: ["But ", "she ", "held on."],                             hint: "held on — phrasal verb" },
      { tokens: ["But ", "she ", "held on. ", "On ", "bad ", "days,"],    hint: "on bad days — time phrase" },
      { tokens: ["But ", "she ", "held on. ", "On ", "bad ", "days, ", "on ", "long ", "nights,"], hint: "long nights — contrast" },
      { tokens: ["But ", "she ", "held on. ", "On ", "bad ", "days, ", "on ", "long ", "nights, ", "she ", "held on."], hint: "repetition — she held on" },
    ]},
    { steps: [
      { tokens: ["And ", "one ", "morning,"],                             hint: "and one morning — the turn" },
      { tokens: ["And ", "one ", "morning, ", "the ", "light ", "came back."], hint: "came back — phrasal verb" },
      { tokens: ["And ", "one ", "morning, ", "the ", "light ", "came back. ", "It ", "always ", "does,"], hint: "it always does — truth" },
      { tokens: ["And ", "one ", "morning, ", "the ", "light ", "came back. ", "It ", "always ", "does, ", "for ", "those ", "who ", "hold on."], hint: "for those who — relative clause" },
    ]},
  ],
  water: [
    { steps: [
      { tokens: ["water"],                                                hint: "noun — simple, universal" },
      { tokens: ["Water ", "runs."],                                      hint: "runs — verb, present simple" },
      { tokens: ["Water ", "runs. ", "It ", "does not ", "stop."],        hint: "does not stop — negation" },
      { tokens: ["Water ", "runs. ", "It ", "does not ", "stop. ", "It ", "finds ", "a ", "way."], hint: "finds a way — verb phrase" },
    ]},
    { steps: [
      { tokens: ["People ", "are ", "like ", "water."],                   hint: "are like — comparison" },
      { tokens: ["People ", "are ", "like ", "water. ", "They ", "move."], hint: "they move — action" },
      { tokens: ["People ", "are ", "like ", "water. ", "They ", "move. ", "They ", "go around."], hint: "go around — phrasal verb" },
      { tokens: ["People ", "are ", "like ", "water. ", "They ", "move. ", "They ", "go around. ", "They ", "carry on."], hint: "carry on — phrasal verb" },
    ]},
    { steps: [
      { tokens: ["The ", "ones ", "who ", "stop"],                        hint: "the ones who — relative clause" },
      { tokens: ["The ", "ones ", "who ", "stop ", "go ", "deep."],       hint: "go deep — phrasal verb" },
      { tokens: ["The ", "ones ", "who ", "stop ", "go ", "deep. ", "They ", "become ", "still."], hint: "become still — change + adjective" },
      { tokens: ["The ", "ones ", "who ", "stop ", "go ", "deep. ", "They ", "become ", "still. ", "And ", "clear."], hint: "and clear — parallel adjective" },
    ]},
  ],
  love: [
    { steps: [
      { tokens: ["love"],                                                 hint: "verb/noun — the anchor" },
      { tokens: ["Love ", "is ", "not ", "easy."],                        hint: "is not — negation" },
      { tokens: ["Love ", "is ", "not ", "easy. ", "Everyone ", "finds out."], hint: "finds out — phrasal verb" },
      { tokens: ["Love ", "is ", "not ", "easy. ", "Everyone ", "finds out. ", "Sooner ", "or ", "later."], hint: "sooner or later — time expression" },
    ]},
    { steps: [
      { tokens: ["But ", "she ", "tried."],                               hint: "but she tried — contrast + action" },
      { tokens: ["But ", "she ", "tried. ", "She ", "gave ", "what ", "she ", "had."], hint: "gave what she had — all of it" },
      { tokens: ["But ", "she ", "tried. ", "She ", "gave ", "what ", "she ", "had. ", "And ", "lost ", "some."], hint: "and lost some — consequence" },
      { tokens: ["But ", "she ", "tried. ", "She ", "gave ", "what ", "she ", "had. ", "And ", "lost ", "some. ", "And ", "kept ", "on."], hint: "kept on — phrasal verb" },
    ]},
    { steps: [
      { tokens: ["That ", "is ", "love,"],                                hint: "that is — defining" },
      { tokens: ["That ", "is ", "love, ", "she ", "thinks —"],           hint: "she thinks — interjection" },
      { tokens: ["That ", "is ", "love, ", "she ", "thinks — ", "not ", "the ", "feeling."], hint: "not the feeling — what it is not" },
      { tokens: ["That ", "is ", "love, ", "she ", "thinks — ", "not ", "the ", "feeling. ", "The ", "choice."], hint: "the choice — what it truly is" },
    ]},
  ],
  time: [
    { steps: [
      { tokens: ["time"],                                                 hint: "noun — the silent anchor" },
      { tokens: ["Time ", "moves."],                                      hint: "moves — verb" },
      { tokens: ["Time ", "moves. ", "It ", "does not ", "look back."],   hint: "does not look back — negation" },
      { tokens: ["Time ", "moves. ", "It ", "does not ", "look back. ", "We ", "do."], hint: "we do — contrast" },
    ]},
    { steps: [
      { tokens: ["He ", "lost ", "a ", "year,"],                         hint: "lost a year — verb + time noun" },
      { tokens: ["He ", "lost ", "a ", "year, ", "then ", "another."],    hint: "then another — sequence" },
      { tokens: ["He ", "lost ", "a ", "year, ", "then ", "another. ", "He ", "did not ", "notice."], hint: "did not notice — past negation" },
      { tokens: ["He ", "lost ", "a ", "year, ", "then ", "another. ", "He ", "did not ", "notice. ", "Until ", "one ", "day,"], hint: "until one day — the turn" },
      { tokens: ["He ", "lost ", "a ", "year, ", "then ", "another. ", "He ", "did not ", "notice. ", "Until ", "one ", "day, ", "he ", "did."], hint: "he did — short, heavy" },
    ]},
    { steps: [
      { tokens: ["So ", "he ", "started."],                               hint: "so he started — consequence" },
      { tokens: ["So ", "he ", "started. ", "Late,"],                     hint: "late — adverb" },
      { tokens: ["So ", "he ", "started. ", "Late, ", "but ", "he ", "started."], hint: "repetition — but he started" },
      { tokens: ["So ", "he ", "started. ", "Late, ", "but ", "he ", "started. ", "That ", "is ", "enough."], hint: "that is enough — the truth" },
    ]},
  ],
  home: [
    { steps: [
      { tokens: ["home"],                                                 hint: "noun — a place or a feeling" },
      { tokens: ["Home ", "is ", "not ", "always ", "a ", "place."],      hint: "not always — qualification" },
      { tokens: ["Home ", "is ", "not ", "always ", "a ", "place. ", "Sometimes"],  hint: "sometimes — adverb" },
      { tokens: ["Home ", "is ", "not ", "always ", "a ", "place. ", "Sometimes ", "it ", "is ", "a ", "person."], hint: "it is a person — redefinition" },
    ]},
    { steps: [
      { tokens: ["She ", "found ", "hers"],                              hint: "found hers — past + possessive" },
      { tokens: ["She ", "found ", "hers ", "late,"],                     hint: "late — adverb of time" },
      { tokens: ["She ", "found ", "hers ", "late, ", "in ", "a ", "small ", "city,"], hint: "in a small city — place" },
      { tokens: ["She ", "found ", "hers ", "late, ", "in ", "a ", "small ", "city, ", "in ", "a ", "quiet ", "room."], hint: "in a quiet room — the final place" },
    ]},
    { steps: [
      { tokens: ["She ", "did not ", "go back."],                        hint: "did not go back — choice" },
      { tokens: ["She ", "did not ", "go back. ", "She ", "did not ", "need to."], hint: "did not need to — completion" },
      { tokens: ["She ", "did not ", "go back. ", "She ", "did not ", "need to. ", "She ", "was ", "already ", "there."], hint: "already there — arrival" },
    ]},
  ],
};

const STOP_WORDS = new Set(['the','a','an','and','but','or','so','because','though','while','if','when','where','how','why','then','now','in','on','at','to','of','for','by','with','from','into','about','as','than','up','down','out','off','over','under','back','away','through','across','along','around','without','between','within','against','per','very','just','during','he','she','they','it','we','you','i','his','her','their','its','our','your','my','that','this','these','those','not','no','nor','also','even','only','just','yet','still','already','almost','never','always','sometimes','well','together','after','before','until','since','like','than','such','both','either','neither']);

const MISSIONS = [
  w => `Say a sentence with <strong>${w}</strong> out loud today — to anyone, or just to yourself.`,
  w => `Find <strong>${w}</strong> somewhere today — a sign, a message, a song. Notice it.`,
  w => `Write one sentence using <strong>${w}</strong> before you sleep tonight.`,
  w => `Use <strong>${w}</strong> in a real conversation today, even once.`,
  w => `Think of a memory where <strong>${w}</strong> fits. Hold it for a moment.`,
];

function extractContentWords(tokens) {
  const seen = new Set();
  const result = [];
  tokens.forEach(t => {
    const clean = t.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (clean.length > 2 && !STOP_WORDS.has(clean) && !seen.has(clean)) {
      seen.add(clean);
      result.push(clean);
    }
  });
  return result.slice(0, 5);
}

// ── SCREENS ──

function WelcomeScreen({ onStart }) {
  return (
    <div className="cl-screen cl-welcome">
      <p className="welcome-eyebrow">CoreLang</p>
      <h1 className="welcome-title">Let's build a story<br /><em>together</em></h1>
      <p className="welcome-sub">You pick the first word. The story grows from there — one piece at a time. Someday you'll build this yourself.</p>
      <button className="welcome-btn" onClick={onStart}>Choose your first word →</button>
    </div>
  );
}

function PickerScreen({ onStart }) {
  const [shuffleOffset, setShuffleOffset] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [hint, setHint] = useState('');

  const visibleWords = (() => {
    const words = WORD_BANK.slice(shuffleOffset % WORD_BANK.length);
    const wrapped = words.concat(WORD_BANK.slice(0, shuffleOffset % WORD_BANK.length));
    return wrapped.slice(0, 6);
  })();

  function selectWord(w) {
    setSelectedWord(w.word);
    setHint(w.hint);
  }

  function shuffle() {
    setShuffleOffset(o => o + 6);
    setSelectedWord(null);
    setHint('');
  }

  return (
    <div className="cl-screen cl-picker">
      <div className="picker-top">
        <p className="picker-q">Which word do you recognise?</p>
        <p className="picker-sub">pick the one that feels familiar</p>
      </div>
      <div className="word-grid">
        {visibleWords.map(w => (
          <div
            key={w.word}
            className={`word-tile ${selectedWord === w.word ? 'selected' : ''}`}
            onClick={() => selectWord(w)}
          >
            <span className="tile-word">{w.word}</span>
            <span className="tile-pos">{w.pos}</span>
          </div>
        ))}
      </div>
      <p className="picker-hint">{hint}</p>
      <div className="picker-actions">
        <button className="btn-ghost" onClick={shuffle}>show others</button>
        <button
          className={`btn-go ${selectedWord ? 'ready' : ''}`}
          onClick={() => selectedWord && onStart(selectedWord)}
        >
          build my story →
        </button>
      </div>
    </div>
  );
}

function BuilderScreen({ selectedWord, onDone }) {
  const story = STORIES[selectedWord] || STORIES.woman;
  const [lineIdx, setLineIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(-1);
  const [completedLines, setCompletedLines] = useState([]);
  const [settledTokens, setSettledTokens] = useState(new Set());
  const [overlay, setOverlay] = useState(null); // { tokens, isLast }

  const line = story[lineIdx];
  const totalLines = story.length;
  const totalSteps = line.steps.length;
  const stepData = stepIdx >= 0 ? line.steps[stepIdx] : null;
  const prevTokenCount = stepIdx > 0 ? line.steps[stepIdx - 1].tokens.length : 0;
  const pct = stepIdx < 0 ? 0 : Math.round(((stepIdx + 1) / totalSteps) * 100);
  const isLastStep = stepIdx === totalSteps - 1;
  const isLastLine = lineIdx === totalLines - 1;

  // Settle new tokens after render
  useEffect(() => {
    if (!stepData) return;
    const timer = setTimeout(() => {
      setSettledTokens(new Set(stepData.tokens.map((_, i) => i)));
    }, 1000);
    return () => clearTimeout(timer);
  }, [stepIdx, lineIdx]);

  function advance() {
    if (isLastStep) {
      const tokens = line.steps[totalSteps - 1].tokens;
      const newCompleted = [...completedLines, tokens.join('')];
      setCompletedLines(newCompleted);
      setOverlay({ tokens, isLast: isLastLine });
    } else {
      setSettledTokens(new Set());
      setStepIdx(s => s + 1);
    }
  }

  function prevStep() {
    setSettledTokens(new Set());
    if (stepIdx > 0) setStepIdx(s => s - 1);
    else if (stepIdx === 0) setStepIdx(-1);
  }

  function closeOverlay() {
    if (overlay.isLast) {
      onDone(completedLines, selectedWord);
    } else {
      setOverlay(null);
      setLineIdx(l => l + 1);
      setStepIdx(-1);
      setSettledTokens(new Set());
    }
  }

  let advanceClass = 'btn-advance';
  let advanceLabel = '→';
  if (isLastStep && isLastLine) { advanceClass += ' done'; advanceLabel = 'finish story →'; }
  else if (isLastStep) { advanceClass += ' next-line'; advanceLabel = 'next line →'; }

  useEffect(() => {
    function onKey(e) {
      if (overlay) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <>
      <div className="cl-screen cl-builder">
        <div className="builder-top">
          <span className="builder-logo">CoreLang</span>
          <span className="builder-prog">line {lineIdx + 1} / {totalLines}</span>
        </div>

        <div className="story-so-far">
          {completedLines.map((l, i) => (
            <div key={i} className={`story-line ${i === completedLines.length - 1 ? 'current' : ''}`}>{l}</div>
          ))}
        </div>

        <div className="sentence-stage">
          <div className="sentence-text">
            {!stepData ? (
              <span className="cursor" />
            ) : (
              <>
                {stepData.tokens.map((t, i) => {
                  const isNew = i >= prevTokenCount;
                  const isSettled = settledTokens.has(i);
                  let cls = 'token in';
                  if (isNew && !isSettled) cls += ' new';
                  if (isSettled) cls += ' settle';
                  return <span key={i} className={cls}>{t}</span>;
                })}
                {stepIdx < totalSteps - 1 && <span className="cursor" />}
              </>
            )}
          </div>
        </div>

        <div className="step-bar">
          <div className="step-fill" style={{ width: pct + '%' }} />
        </div>

        <p className="step-hint">{stepData?.hint || ''}</p>

        <div className="builder-actions">
          <div className="action-left">
            <button className="btn-sm" onClick={prevStep}>←</button>
          </div>
          <button className={advanceClass} onClick={advance}>{advanceLabel}</button>
        </div>
      </div>

      {overlay && (
        <KnowOverlay
          tokens={overlay.tokens}
          selectedWord={selectedWord}
          isLast={overlay.isLast}
          onClose={closeOverlay}
          onSkip={closeOverlay}
        />
      )}
    </>
  );
}

function KnowOverlay({ tokens, selectedWord, isLast, onClose, onSkip }) {
  const words = extractContentWords(tokens);
  const [wordStates, setWordStates] = useState(() => Object.fromEntries(words.map(w => [w, null])));
  const [mission] = useState(() => {
    const missionWord = words[0] || selectedWord;
    const fn = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    return fn(missionWord);
  });

  const allRated = Object.values(wordStates).every(v => v !== null);

  function cycleWord(w) {
    const states = [null, 'yes', 'seen', 'no'];
    setWordStates(prev => {
      const cur = states.indexOf(prev[w]);
      return { ...prev, [w]: states[(cur + 1) % states.length] };
    });
  }

  const stateLabels = { null: 'tap to rate', yes: 'I know it ✓', seen: 'seen it ~', no: 'new to me' };
  const stateClasses = { null: '', yes: 'k-yes', seen: 'k-seen', no: 'k-no' };

  return (
    <div className="overlay open">
      <div className="overlay-card">
        <p className="ov-phase">line complete</p>
        <p className="ov-line">{tokens.join('')}</p>
        <p className="ov-title">tap each word — how well do you know it?</p>
        <div className="know-words">
          {words.map(w => (
            <div key={w} className={`know-word ${stateClasses[wordStates[w]] || ''}`} onClick={() => cycleWord(w)}>
              <span className="kw-text">{w}</span>
              <span className="kw-state">{stateLabels[wordStates[w]]}</span>
            </div>
          ))}
        </div>
        <div className={`mission-box ${allRated ? 'visible' : ''}`}>
          <p className="mission-label">your mission</p>
          <p className="mission-text" dangerouslySetInnerHTML={{ __html: mission }} />
        </div>
        <div className="ov-actions">
          <button className="ov-btn-ghost" onClick={onSkip}>skip</button>
          <button className={`ov-btn-next ${allRated ? 'ready' : ''}`} onClick={allRated ? onClose : undefined}>
            {isLast ? 'finish →' : 'continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DoneScreen({ completedLines, selectedWord, onRestart }) {
  return (
    <div className="cl-screen cl-done">
      <p className="done-eyebrow">your story</p>
      <h2 className="done-title">You built this<br />from one word.</h2>
      <div className="done-story">
        {completedLines.map((l, i) => (
          <div key={i} className="done-story-line">{l}</div>
        ))}
      </div>
      <p className="done-anchor">started with: <span>{selectedWord}</span></p>
      <div className="done-actions">
        <button className="btn-outline" onClick={onRestart}>start over</button>
        <button className="btn-solid" onClick={onRestart}>build another →</button>
      </div>
    </div>
  );
}

// ── APP ──
export default function App2() {
  const [screen, setScreen] = useState('welcome'); // welcome | picker | builder | done
  const [selectedWord, setSelectedWord] = useState(null);
  const [completedLines, setCompletedLines] = useState([]);

  function handlePickerStart(word) {
    setSelectedWord(word);
    setScreen('builder');
  }

  function handleBuilderDone(lines, word) {
    setCompletedLines(lines);
    setSelectedWord(word);
    setScreen('done');
  }

  function handleRestart() {
    setSelectedWord(null);
    setCompletedLines([]);
    setScreen('picker');
  }

  return (
    <>
      <style>{css}</style>
      <div className="cl-root">
        {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('picker')} />}
        {screen === 'picker' && <PickerScreen onStart={handlePickerStart} />}
        {screen === 'builder' && <BuilderScreen selectedWord={selectedWord} onDone={handleBuilderDone} />}
        {screen === 'done' && <DoneScreen completedLines={completedLines} selectedWord={selectedWord} onRestart={handleRestart} />}
      </div>
    </>
  );
}

import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const BG      = "#07101A";
const SURF    = "#0D1B28";
const CARD    = "#132333";
const BORDER  = "#1A3045";
const ACCENT  = "#2E86AB";
const GREEN   = "#4ADE80";
const PURPLE  = "#8B5CF6";
const EMERALD = "#10B981";
const TEXT    = "#D8E8F2";
const MUTED   = "#4A6478";
const GOLD    = "#F59E0B";

// ─── WORD BANK ───────────────────────────────────────────────────────────────
const WORDS = [
  { id:"woman", en:"woman", ar:"امرأة", pos:"noun" },
  { id:"child", en:"child", ar:"طفل",  pos:"noun" },
  { id:"life",  en:"life",  ar:"حياة", pos:"noun" },
  { id:"work",  en:"work",  ar:"عمل",  pos:"noun / verb" },
  { id:"hope",  en:"hope",  ar:"أمل",  pos:"noun / verb" },
  { id:"time",  en:"time",  ar:"وقت",  pos:"noun" },
];

// ─── STORY DATA ──────────────────────────────────────────────────────────────
// Each step: spans[] = { t: text, new?: true, key?: string for tooltip }
const STORIES = {
  woman: {
    nextWord:"child",
    mission:'Use "woman" once today — in a message, a call, or even your own thoughts.',
    checkinResponses:{
      yes:"That's the whole point. The word is yours now.",
      almost:"Almost counts. Tomorrow, it becomes easier.",
      no:"That's honest. Today's word is waiting for you.",
    },
    drafts:[
      { id:0, label:"Draft 1", sub:"Root verbs", color:ACCENT,
        steps:[
          { spans:[{t:"woman",n:true,k:"anchor · noun"}], hint:"anchor · noun" },
          { spans:[{t:"The "},{t:"woman",k:"noun"}], hint:"The · determiner" },
          { spans:[{t:"The "},{t:"young ",n:true,k:"young · adjective"},{t:"woman"}], hint:"young · adjective" },
          { spans:[{t:"The young woman "},{t:"goes",n:true,k:"goes · verb root"}], hint:"goes · verb root" },
          { spans:[{t:"The young woman goes "},{t:"to work",n:true,k:"to work · destination phrase"}], hint:"to work · destination" },
          { spans:[{t:"The young woman goes to work "},{t:"happily",n:true,k:"happily · adverb of manner"}], hint:"happily · adverb" },
          { spans:[{t:"The young woman goes to work happily "},{t:"all day long.",n:true,k:"all day long · time phrase"}], hint:"all day long · time phrase" },
        ]},
      { id:1, label:"Draft 2", sub:"Phrasal verbs", color:PURPLE,
        steps:[
          { spans:[{t:"The young woman "},{t:"carries on",n:true,k:"carries on · phrasal verb (= continues)"},{t:" working happily all day long."}], hint:"carries on · phrasal verb swap" },
          { spans:[{t:"The young woman carries on working "},{t:"quietly",n:true,k:"quietly · manner adverb"},{t:" all day long."}], hint:"quietly · new adverb" },
          { spans:[{t:"The young woman carries on working quietly, "},{t:"day after day.",n:true,k:"day after day · rhythm phrase"}], hint:"day after day · rhythm phrase" },
        ]},
      { id:2, label:"Draft 3", sub:"Morphology", color:EMERALD,
        steps:[
          { spans:[{t:"The young woman carries on working "},{t:"tirelessly",n:true,k:"tire + less + ly · affix chain"},{t:", day after day."}], hint:"tire + less + ly" },
          { spans:[{t:"The young woman carries on working tirelessly, day after day, "},{t:"unbothered.",n:true,k:"un + bother + ed · prefix + suffix"}], hint:"un + bother + ed" },
        ]},
    ]},

  child:{
    nextWord:"hope",
    mission:'Use "child" once today — in a message, a story you tell, or a memory.',
    checkinResponses:{
      yes:"One word at a time. You're building something real.",
      almost:"Close enough. The habit is forming.",
      no:"No pressure. It'll come naturally — keep going.",
    },
    drafts:[
      { id:0, label:"Draft 1", sub:"Root verbs", color:ACCENT,
        steps:[
          { spans:[{t:"child",n:true,k:"anchor · noun"}], hint:"anchor · noun" },
          { spans:[{t:"A "},{t:"child",k:"noun"}], hint:"A · indefinite article" },
          { spans:[{t:"A "},{t:"small ",n:true,k:"small · adjective"},{t:"child"}], hint:"small · adjective" },
          { spans:[{t:"A small child "},{t:"sits",n:true,k:"sits · verb root"}], hint:"sits · verb root" },
          { spans:[{t:"A small child sits "},{t:"alone",n:true,k:"alone · adverb"}], hint:"alone · adverb" },
          { spans:[{t:"A small child sits alone "},{t:"and waits.",n:true,k:"and · coordinating conjunction"}], hint:"and · connector" },
          { spans:[{t:"A small child sits alone and waits "},{t:"in the quiet.",n:true,k:"in · preposition · sets the scene"}], hint:"in the quiet · setting" },
        ]},
      { id:1, label:"Draft 2", sub:"Phrasal verbs", color:PURPLE,
        steps:[
          { spans:[{t:"A small child "},{t:"holds on",n:true,k:"holds on · phrasal verb (= persists)"},{t:" and waits in the quiet."}], hint:"holds on · phrasal verb" },
          { spans:[{t:"A small child holds on and waits, "},{t:"very still,",n:true,k:"very still · intensifier phrase"},{t:" in the quiet."}], hint:"very still · intensifier" },
        ]},
      { id:2, label:"Draft 3", sub:"Morphology", color:EMERALD,
        steps:[
          { spans:[{t:"A small child holds on and waits, "},{t:"motionless,",n:true,k:"motion + less · noun → adjective"},{t:" in the quiet."}], hint:"motion + less" },
          { spans:[{t:"A small child holds on and waits, motionless, in the "},{t:"stillness.",n:true,k:"still + ness · adjective → noun"}], hint:"still + ness" },
        ]},
    ]},

  hope:{
    nextWord:"time",
    mission:'Use "hope" once today — say it out loud, write it, or use it to describe something real.',
    checkinResponses:{
      yes:"That's the habit. Small activations compound.",
      almost:"That still counts. The word is moving from passive to active.",
      no:"Honest. Try again today — just once is enough.",
    },
    drafts:[
      { id:0, label:"Draft 1", sub:"Root verbs", color:ACCENT,
        steps:[
          { spans:[{t:"hope",n:true,k:"anchor · noun / verb"}], hint:"anchor · noun/verb" },
          { spans:[{t:"Real "},{t:"hope",k:"noun"}], hint:"Real · adjective" },
          { spans:[{t:"Real hope "},{t:"does not",n:true,k:"does not · negation structure"},{t:" leave."}], hint:"does not · negation" },
          { spans:[{t:"Real hope does not "},{t:"leave.",n:true,k:"leave · verb root"}], hint:"leave · verb root" },
          { spans:[{t:"Real hope does not leave. "},{t:"It waits,",n:true,k:"It · pronoun reference (= hope)"}], hint:"It · pronoun" },
          { spans:[{t:"Real hope does not leave. It waits, "},{t:"quietly,",n:true,k:"quietly · manner adverb"}], hint:"quietly · adverb" },
          { spans:[{t:"Real hope does not leave. It waits, quietly, "},{t:"until you return.",n:true,k:"until · subordinating conjunction"}], hint:"until · subordinator" },
        ]},
      { id:1, label:"Draft 2", sub:"Phrasal verbs", color:PURPLE,
        steps:[
          { spans:[{t:"Real hope does not "},{t:"give up.",n:true,k:"give up · phrasal verb (= surrender)"},{t:" It waits, quietly, until you return."}], hint:"give up · phrasal verb" },
          { spans:[{t:"Real hope does not give up. It "},{t:"holds on,",n:true,k:"holds on · phrasal verb (= persists)"},{t:" quietly, until you return."}], hint:"holds on · persistence" },
        ]},
      { id:2, label:"Draft 3", sub:"Morphology", color:EMERALD,
        steps:[
          { spans:[{t:"Real hope does not give up. It holds on, "},{t:"steadfastly,",n:true,k:"steadfast + ly · adjective → adverb"},{t:" until you return."}], hint:"steadfast + ly" },
          { spans:[{t:"Real hope does not give up. It holds on, steadfastly, "},{t:"unbroken.",n:true,k:"un + break + en · prefix + past participle"}], hint:"un + break + en" },
        ]},
    ]},

  life:{
    nextWord:"work",
    mission:'Use "life" once today — in a sentence that means something to you.',
    checkinResponses:{
      yes:"The best way to learn a word is to mean it.",
      almost:"That's closer than it sounds. Keep going.",
      no:"Try it once today. Just once. No pressure.",
    },
    drafts:[
      { id:0, label:"Draft 1", sub:"Root verbs", color:ACCENT,
        steps:[
          { spans:[{t:"life",n:true,k:"anchor · noun"}], hint:"anchor · noun" },
          { spans:[{t:"A good "},{t:"life",k:"noun"}], hint:"A good · determiner + adjective" },
          { spans:[{t:"A good life "},{t:"takes",n:true,k:"takes · verb root (= requires)"}], hint:"takes · verb root" },
          { spans:[{t:"A good life takes "},{t:"time",n:true,k:"time · noun object"}], hint:"time · object" },
          { spans:[{t:"A good life takes time "},{t:"to build.",n:true,k:"to build · infinitive of purpose"}], hint:"to build · infinitive" },
          { spans:[{t:"A good life takes time to build, "},{t:"slowly.",n:true,k:"slowly · manner adverb"}], hint:"slowly · adverb" },
          { spans:[{t:"A good life takes time to build, slowly, "},{t:"day by day.",n:true,k:"day by day · rhythm phrase"}], hint:"day by day · rhythm" },
        ]},
      { id:1, label:"Draft 2", sub:"Phrasal verbs", color:PURPLE,
        steps:[
          { spans:[{t:"A good life "},{t:"comes together",n:true,k:"comes together · phrasal verb (= assembles)"},{t:" slowly, day by day."}], hint:"comes together · phrasal verb" },
          { spans:[{t:"A good life comes together slowly, "},{t:"piece by piece,",n:true,k:"piece by piece · rhythm phrase"},{t:" day by day."}], hint:"piece by piece · rhythm" },
        ]},
      { id:2, label:"Draft 3", sub:"Morphology", color:EMERALD,
        steps:[
          { spans:[{t:"A good life comes together slowly, piece by piece, "},{t:"gradually.",n:true,k:"gradual + ly · adjective → adverb"}], hint:"gradual + ly" },
          { spans:[{t:"A good life comes together gradually, piece by piece — "},{t:"unhurried.",n:true,k:"un + hurry + ed · prefix + suffix"}], hint:"un + hurry + ed" },
        ]},
    ]},

  work:{
    nextWord:"woman",
    mission:'Use "work" once today — describe something you\'re doing, or something you value about it.',
    checkinResponses:{
      yes:"The word is no longer abstract. It belongs to a moment now.",
      almost:"That's still activation. It counts.",
      no:"No worries. Today is another chance.",
    },
    drafts:[
      { id:0, label:"Draft 1", sub:"Root verbs", color:ACCENT,
        steps:[
          { spans:[{t:"work",n:true,k:"anchor · noun / verb"}], hint:"anchor · noun/verb" },
          { spans:[{t:"Good "},{t:"work",k:"noun"}], hint:"Good · adjective" },
          { spans:[{t:"Good work "},{t:"never",n:true,k:"never · adverb of frequency"},{t:" lies."}], hint:"never · frequency adverb" },
          { spans:[{t:"Good work never "},{t:"lies.",n:true,k:"lies · verb root (= deceives)"}], hint:"lies · verb root" },
          { spans:[{t:"Good work never lies. "},{t:"It stays.",n:true,k:"It · pronoun reference (= good work)"}], hint:"It · pronoun" },
          { spans:[{t:"Good work never lies. It stays "},{t:"long after",n:true,k:"long after · time phrase"},{t:" you go."}], hint:"long after · time" },
          { spans:[{t:"Good work never lies. It stays long after "},{t:"you go.",n:true,k:"you go · subject + verb = departure"}], hint:"you go · closure" },
        ]},
      { id:1, label:"Draft 2", sub:"Phrasal verbs", color:PURPLE,
        steps:[
          { spans:[{t:"Good work never lies. It "},{t:"lives on",n:true,k:"lives on · phrasal verb (= continues to exist)"},{t:" long after you go."}], hint:"lives on · phrasal verb" },
          { spans:[{t:"Good work never lies. It lives on, "},{t:"quietly,",n:true,k:"quietly · manner adverb"},{t:" long after you go."}], hint:"quietly · adverb" },
        ]},
      { id:2, label:"Draft 3", sub:"Morphology", color:EMERALD,
        steps:[
          { spans:[{t:"Good work never lies. It lives on, "},{t:"silently,",n:true,k:"silent + ly · adjective → adverb"},{t:" long after you go."}], hint:"silent + ly" },
          { spans:[{t:"Good work never lies. It lives on, silently, "},{t:"undeniable.",n:true,k:"un + deny + able · prefix chain"}], hint:"un + deny + able" },
        ]},
    ]},

  time:{
    nextWord:"life",
    mission:'Use "time" once today — say something true about it.',
    checkinResponses:{
      yes:"The word is active now. That's the whole mechanism.",
      almost:"Almost active. The gap between 'seen' and 'said' is small — keep going.",
      no:"Time is patient. Try once more today.",
    },
    drafts:[
      { id:0, label:"Draft 1", sub:"Root verbs", color:ACCENT,
        steps:[
          { spans:[{t:"time",n:true,k:"anchor · noun"}], hint:"anchor · noun" },
          { spans:[{t:"All "},{t:"time",k:"noun"}], hint:"All · universal quantifier" },
          { spans:[{t:"All time "},{t:"moves",n:true,k:"moves · verb root"}], hint:"moves · verb root" },
          { spans:[{t:"All time moves "},{t:"forward.",n:true,k:"forward · direction adverb"}], hint:"forward · direction" },
          { spans:[{t:"All time moves forward. "},{t:"We go",n:true,k:"We · first person plural"},{t:" with it."}], hint:"We · subject" },
          { spans:[{t:"All time moves forward. We go with it, "},{t:"whether we want to",n:true,k:"whether · concession clause"},{t:" or not."}], hint:"whether · concession" },
          { spans:[{t:"All time moves forward. We go with it, whether we want to or not, "},{t:"always.",n:true,k:"always · frequency adverb"}], hint:"always · adverb" },
        ]},
      { id:1, label:"Draft 2", sub:"Phrasal verbs", color:PURPLE,
        steps:[
          { spans:[{t:"All time "},{t:"moves on.",n:true,k:"moves on · phrasal verb (= continues forward)"},{t:" We go with it, always."}], hint:"moves on · phrasal verb" },
          { spans:[{t:"All time moves on. We "},{t:"go along",n:true,k:"go along · phrasal verb (= comply, accompany)"},{t:" with it, always."}], hint:"go along · phrasal verb" },
        ]},
      { id:2, label:"Draft 3", sub:"Morphology", color:EMERALD,
        steps:[
          { spans:[{t:"All time moves on. We go along with it, "},{t:"willingly",n:true,k:"willing + ly · adjective → adverb"},{t:" or not, always."}], hint:"willing + ly" },
          { spans:[{t:"All time moves on. We go along with it, willingly or not, always — "},{t:"unstoppable.",n:true,k:"un + stop + able · prefix chain"}], hint:"un + stop + able" },
        ]},
    ]},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const px = (n) => `${n}px`;
const row = (extra={}) => ({ display:"flex", alignItems:"center", ...extra });
const col = (extra={}) => ({ display:"flex", flexDirection:"column", ...extra });

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
function Shell({ children }) {
  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:"'Inter',-apple-system,sans-serif", color:TEXT, overflowX:"hidden" }}>
      <div style={{ maxWidth:460, margin:"0 auto", padding:"0 20px" }}>
        {children}
      </div>
    </div>
  );
}

function Logo({ small }) {
  const s = small ? 15 : 18;
  return (
    <div style={row({ gap:8 })}>
      <div style={{ width:s*1.4, height:s*1.4, background:ACCENT, borderRadius:px(s*0.25), display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:"#fff", fontSize:px(s*0.7), fontWeight:800, letterSpacing:"-0.5px" }}>C</span>
      </div>
      <span style={{ fontWeight:700, fontSize:px(s), letterSpacing:"-0.5px" }}>
        Core<span style={{ color:ACCENT }}>Lang</span>
      </span>
    </div>
  );
}

function Btn({ children, onClick, color=ACCENT, ghost=false, full=false, size="md" }) {
  const [hover, setHover] = useState(false);
  const pad = size==="sm" ? "10px 18px" : "14px 28px";
  const fs  = size==="sm" ? 13 : 15;
  const bg  = ghost ? "transparent" : hover ? color+"DD" : color;
  const bdr = ghost ? `1px solid ${color}50` : "none";
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        padding:pad, borderRadius:px(10), fontWeight:600, fontSize:px(fs),
        border:bdr, cursor:"pointer", background:bg, color:ghost?color:"#fff",
        width:full?"100%":"auto", transition:"all 0.15s", outline:"none",
        letterSpacing:"-0.2px",
      }}
    >{children}</button>
  );
}

function Bar({ current, total, color=ACCENT }) {
  return (
    <div style={{ background:BORDER, borderRadius:99, height:3, overflow:"hidden" }}>
      <div style={{ height:"100%", background:color, borderRadius:99, width:`${Math.round((current/total)*100)}%`, transition:"width 0.4s ease" }}/>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{ background:color+"22", color, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>
      {label}
    </span>
  );
}

function Divider() {
  return <div style={{ height:1, background:BORDER, margin:"24px 0" }}/>;
}

// ─── SCREEN 1: WELCOME ───────────────────────────────────────────────────────
function Welcome({ onStart }) {
  return (
    <Shell>
      <div style={{ ...col({ justifyContent:"space-between", minHeight:"100vh", paddingTop:48, paddingBottom:48 }) }}>
        <Logo/>
        <div style={col({ gap:24 })}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px", color:ACCENT, textTransform:"uppercase", marginBottom:16 }}>
              A language engine
            </div>
            <h1 style={{ fontSize:40, fontWeight:800, lineHeight:1.1, letterSpacing:"-1.5px", margin:0, color:"#fff" }}>
              We start<br/>with a word.
            </h1>
            <h1 style={{ fontSize:40, fontWeight:800, lineHeight:1.1, letterSpacing:"-1.5px", margin:0, marginTop:4 }}>
              We reach a{" "}
              <span style={{ color:ACCENT }}>story.</span>
            </h1>
          </div>
          <p style={{ fontSize:16, lineHeight:1.7, color:MUTED, margin:0, maxWidth:340 }}>
            Pick one word you recognise. Watch a sentence grow from it — word by word, across three drafts.
          </p>
          <div style={row({ gap:24 })}>
            <div style={col({ gap:4 })}>
              <span style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-1px" }}>196</span>
              <span style={{ fontSize:11, color:MUTED }}>root words</span>
            </div>
            <div style={{ width:1, height:36, background:BORDER }}/>
            <div style={col({ gap:4 })}>
              <span style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-1px" }}>1,200+</span>
              <span style={{ fontSize:11, color:MUTED }}>words unlocked</span>
            </div>
            <div style={{ width:1, height:36, background:BORDER }}/>
            <div style={col({ gap:4 })}>
              <span style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-1px" }}>60 days</span>
              <span style={{ fontSize:11, color:MUTED }}>to a full story</span>
            </div>
          </div>
        </div>
        <Btn onClick={onStart} full>Begin →</Btn>
      </div>
    </Shell>
  );
}

// ─── SCREEN 2: WORD PICKER ───────────────────────────────────────────────────
function WordPicker({ onPick }) {
  const [selected, setSelected] = useState(null);
  return (
    <Shell>
      <div style={{ paddingTop:40, paddingBottom:48 }}>
        <Logo small/>
        <div style={{ marginTop:36, marginBottom:8, fontSize:22, fontWeight:800, letterSpacing:"-0.8px", color:"#fff" }}>
          Which of these feels familiar?
        </div>
        <p style={{ fontSize:14, color:MUTED, margin:"0 0 32px" }}>
          Tap the word that comes closest to something you already know.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {WORDS.map(w => {
            const active = selected === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelected(w.id)}
                style={{
                  background: active ? ACCENT+"22" : CARD,
                  border: `1.5px solid ${active ? ACCENT : BORDER}`,
                  borderRadius:14, padding:"20px 16px", cursor:"pointer",
                  textAlign:"left", transition:"all 0.15s", outline:"none",
                }}
              >
                <div style={{ fontSize:22, fontWeight:800, color: active ? ACCENT : "#fff", letterSpacing:"-0.5px" }}>{w.en}</div>
                <div style={{ fontSize:16, color:MUTED, marginTop:4, fontFamily:"'Arabic UI Text', 'Segoe UI', sans-serif", direction:"rtl" }}>{w.ar}</div>
                <div style={{ fontSize:10, color:MUTED, marginTop:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>{w.pos}</div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop:28 }}>
          <Btn onClick={() => selected && onPick(selected)} full color={selected ? ACCENT : MUTED}>
            {selected ? `Start with "${selected}" →` : "Select a word to begin"}
          </Btn>
        </div>
      </div>
    </Shell>
  );
}

// ─── SCREEN 3: STORY BUILDER ─────────────────────────────────────────────────
function StoryBuilder({ anchor, draftIdx, stepIdx, onNext, onDraftDone }) {
  const story  = STORIES[anchor];
  const draft  = story.drafts[draftIdx];
  const step   = draft.steps[stepIdx];
  const isLast = stepIdx === draft.steps.length - 1;
  const [tooltip, setTooltip] = useState(null);
  const [anim, setAnim] = useState(false);
  const prevStep = useRef(stepIdx);

  useEffect(() => {
    if (prevStep.current !== stepIdx) {
      setAnim(true);
      setTimeout(() => setAnim(false), 600);
      prevStep.current = stepIdx;
      setTooltip(null);
    }
  }, [stepIdx]);

  const newSpan = step.spans.find(s => s.n);

  return (
    <Shell>
      <div style={{ paddingTop:36, paddingBottom:48 }}>
        {/* Header */}
        <div style={row({ justifyContent:"space-between", marginBottom:20 })}>
          <Logo small/>
          <Tag label={`${draft.label} · ${draft.sub}`} color={draft.color}/>
        </div>

        {/* Progress */}
        <Bar current={stepIdx+1} total={draft.steps.length} color={draft.color}/>
        <div style={{ ...row({ justifyContent:"space-between" }), marginTop:8, marginBottom:32 }}>
          <span style={{ fontSize:12, color:MUTED }}>Step {stepIdx+1} of {draft.steps.length}</span>
          <span style={{ fontSize:12, color:MUTED }}>Draft {draftIdx+1} of {story.drafts.length}</span>
        </div>

        {/* Sentence display */}
        <div style={{ background:SURF, borderRadius:16, padding:"28px 24px", border:`1px solid ${BORDER}`, marginBottom:20, minHeight:100 }}>
          <p style={{ fontSize:22, fontWeight:600, lineHeight:1.6, margin:0, letterSpacing:"-0.3px" }}>
            {step.spans.map((s,i) => (
              <span
                key={i}
                onClick={() => s.k && setTooltip(tooltip === s.k ? null : s.k)}
                style={{
                  color: s.n ? GREEN : TEXT,
                  background: s.n && anim ? GREEN+"18" : "transparent",
                  borderRadius:4,
                  cursor: s.k ? "pointer" : "default",
                  transition: "all 0.4s",
                  textDecoration: s.k && !s.n ? "underline dotted "+MUTED : "none",
                  textUnderlineOffset:3,
                }}
              >{s.t}</span>
            ))}
          </p>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:10, padding:"12px 16px", marginBottom:20, ...row({ gap:8 }) }}>
            <span style={{ fontSize:13, color:ACCENT }}>◈</span>
            <span style={{ fontSize:13, color:TEXT }}>{tooltip}</span>
          </div>
        )}

        {/* Hint */}
        {!tooltip && step.hint && (
          <div style={{ ...row({ gap:6 }), marginBottom:20 }}>
            <span style={{ fontSize:12, color:MUTED }}>↳</span>
            <span style={{ fontSize:12, color:MUTED, fontStyle:"italic" }}>{step.hint}</span>
          </div>
        )}

        {/* Instruction */}
        <div style={{ background:CARD, borderRadius:10, padding:"12px 16px", marginBottom:28, border:`1px solid ${BORDER}` }}>
          <p style={{ fontSize:13, color:MUTED, margin:0, lineHeight:1.6 }}>
            {stepIdx === 0
              ? `Your anchor word. The story starts here.`
              : `Tap the highlighted word to see how it fits into the structure.`}
          </p>
        </div>

        <Btn
          onClick={isLast ? onDraftDone : onNext}
          full
          color={draft.color}
        >
          {isLast ? "Complete this draft →" : "Next word →"}
        </Btn>
      </div>
    </Shell>
  );
}

// ─── SCREEN 4: KNOW IT ───────────────────────────────────────────────────────
function KnowIt({ anchor, draftIdx, onDone }) {
  const draft = STORIES[anchor].drafts[draftIdx];
  const newWords = draft.steps
    .flatMap(s => s.spans.filter(sp => sp.n && sp.k))
    .map(sp => ({ text: sp.t.trim().replace(/[.,]$/, ""), key: sp.k }));

  const [marks, setMarks] = useState({});
  const options = [
    { id:"know", label:"Know it",    color:GREEN  },
    { id:"seen", label:"Seen it",    color:GOLD   },
    { id:"new",  label:"New to me",  color:ACCENT },
  ];
  const done = newWords.every(w => marks[w.text]);

  return (
    <Shell>
      <div style={{ paddingTop:40, paddingBottom:48 }}>
        <Logo small/>
        <div style={{ marginTop:32, marginBottom:8, fontSize:20, fontWeight:800, letterSpacing:"-0.6px", color:"#fff" }}>
          How well do you know each word?
        </div>
        <p style={{ fontSize:14, color:MUTED, margin:"0 0 32px" }}>Be honest — this shapes your path forward.</p>

        {newWords.map((w,i) => (
          <div key={i} style={{ marginBottom:16 }}>
            <div style={{ ...row({ justifyContent:"space-between", marginBottom:10 }) }}>
              <span style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{w.text}</span>
              <span style={{ fontSize:11, color:MUTED, fontStyle:"italic" }}>{w.key}</span>
            </div>
            <div style={row({ gap:8 })}>
              {options.map(o => {
                const active = marks[w.text] === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setMarks(prev=>({...prev,[w.text]:o.id}))}
                    style={{
                      flex:1, padding:"10px 0", borderRadius:8, border:`1.5px solid ${active ? o.color : BORDER}`,
                      background: active ? o.color+"22" : CARD, color: active ? o.color : MUTED,
                      fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s", outline:"none",
                    }}
                  >{o.label}</button>
                );
              })}
            </div>
          </div>
        ))}

        <Divider/>
        <Btn onClick={done ? onDone : undefined} full color={done ? ACCENT : MUTED}>
          {done ? "Continue →" : `Mark all words (${Object.keys(marks).length}/${newWords.length})`}
        </Btn>
      </div>
    </Shell>
  );
}

// ─── SCREEN 5: MISSION ───────────────────────────────────────────────────────
function Mission({ anchor, draftIdx, onDone }) {
  const story = STORIES[anchor];
  const draft = story.drafts[draftIdx];
  return (
    <Shell>
      <div style={{ ...col({ justifyContent:"space-between", minHeight:"100vh", paddingTop:40, paddingBottom:48 }) }}>
        <Logo small/>
        <div style={col({ gap:20 })}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px", color:GOLD, textTransform:"uppercase" }}>
            Your mission
          </div>
          <div style={{ background:SURF, border:`1px solid ${BORDER}`, borderRadius:16, padding:"28px 24px" }}>
            <p style={{ fontSize:18, fontWeight:600, lineHeight:1.7, margin:0, color:"#fff", letterSpacing:"-0.3px" }}>
              {story.mission}
            </p>
          </div>
          <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, margin:0 }}>
            Not a quiz. Not a test. Just one real use — a message, a thought out loud, a sentence you write to no one. That's how passive becomes active.
          </p>
          <div style={{ background:draft.color+"12", border:`1px solid ${draft.color}30`, borderRadius:12, padding:"14px 18px" }}>
            <p style={{ fontSize:13, color:draft.color, margin:0, fontWeight:500 }}>
              ✓ {draft.label} complete · {draft.sub} unlocked
            </p>
          </div>
        </div>
        <Btn onClick={onDone} full color={GOLD}>Got it →</Btn>
      </div>
    </Shell>
  );
}

// ─── SCREEN 6: COMPLETE ──────────────────────────────────────────────────────
function Complete({ anchor, draftIdx, onNextDraft, onCheckin }) {
  const story  = STORIES[anchor];
  const draft  = story.drafts[draftIdx];
  const isLast = draftIdx === story.drafts.length - 1;
  const finalStep = draft.steps[draft.steps.length - 1];

  return (
    <Shell>
      <div style={{ paddingTop:40, paddingBottom:48 }}>
        <Logo small/>
        <div style={{ marginTop:32 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px", color:GREEN, textTransform:"uppercase", marginBottom:16 }}>
            {isLast ? "All three drafts complete" : `${draft.label} complete`}
          </div>
          <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:"-1px", color:"#fff", margin:"0 0 24px" }}>
            You built this from one word.
          </h2>

          {/* Final sentence */}
          <div style={{ background:SURF, borderRadius:16, padding:"28px 24px", border:`1.5px solid ${GREEN}40`, marginBottom:24 }}>
            <p style={{ fontSize:18, fontWeight:600, lineHeight:1.7, margin:0, color:"#fff", letterSpacing:"-0.2px" }}>
              {finalStep.spans.map((s,i)=><span key={i}>{s.t}</span>)}
            </p>
            <div style={{ marginTop:16, ...row({ gap:8 }) }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:GREEN }}/>
              <span style={{ fontSize:12, color:MUTED }}>{draft.label} · {draft.sub}</span>
            </div>
          </div>

          {/* Draft pills */}
          <div style={row({ gap:8, marginBottom:32, flexWrap:"wrap" })}>
            {story.drafts.map((d,i) => (
              <div key={i} style={{
                padding:"6px 14px", borderRadius:99,
                background: i <= draftIdx ? d.color+"22" : CARD,
                border:`1px solid ${i <= draftIdx ? d.color+"60" : BORDER}`,
                fontSize:12, fontWeight:600,
                color: i <= draftIdx ? d.color : MUTED,
              }}>
                {i <= draftIdx ? "✓ " : ""}{d.label}
              </div>
            ))}
          </div>

          {/* Next word teaser */}
          <div style={{ background:CARD, borderRadius:12, padding:"16px 18px", border:`1px solid ${BORDER}`, marginBottom:28 }}>
            <div style={{ fontSize:11, color:MUTED, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Tomorrow's anchor</div>
            <div style={row({ justifyContent:"space-between", alignItems:"center" })}>
              <span style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{story.nextWord}</span>
              <span style={{ fontSize:14, color:MUTED, fontFamily:"'Arabic UI Text','Segoe UI',sans-serif", direction:"rtl" }}>
                {WORDS.find(w=>w.id===story.nextWord)?.ar}
              </span>
            </div>
          </div>

          {isLast
            ? <Btn onClick={onCheckin} full color={ACCENT}>See you tomorrow →</Btn>
            : <Btn onClick={onNextDraft} full color={story.drafts[draftIdx+1].color}>
                Continue to {story.drafts[draftIdx+1].label} — {story.drafts[draftIdx+1].sub} →
              </Btn>
          }
        </div>
      </div>
    </Shell>
  );
}

// ─── SCREEN 7: CHECK-IN ──────────────────────────────────────────────────────
function CheckIn({ anchor, onRestart }) {
  const story = STORIES[anchor];
  const [ans, setAns] = useState(null);
  const options = [
    { id:"yes",    label:"Yes, I used it",     color:GREEN  },
    { id:"almost", label:"I tried, almost",    color:GOLD   },
    { id:"no",     label:"Honestly, no",       color:MUTED  },
  ];
  return (
    <Shell>
      <div style={{ ...col({ justifyContent:"space-between", minHeight:"100vh", paddingTop:40, paddingBottom:48 }) }}>
        <Logo small/>
        <div style={col({ gap:20 })}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px", color:ACCENT, textTransform:"uppercase", marginBottom:16 }}>
              Day 2 check-in
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.8px", color:"#fff", margin:0 }}>
              Yesterday you said you'd use "{anchor}".
            </h2>
            <p style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.8px", color:MUTED, margin:"4px 0 0" }}>
              Did you?
            </p>
          </div>

          <div style={col({ gap:10 })}>
            {options.map(o => (
              <button
                key={o.id}
                onClick={() => setAns(o.id)}
                style={{
                  padding:"16px 20px", borderRadius:12, textAlign:"left", cursor:"pointer",
                  border:`1.5px solid ${ans===o.id ? o.color : BORDER}`,
                  background: ans===o.id ? o.color+"18" : CARD,
                  color: ans===o.id ? o.color : TEXT,
                  fontSize:15, fontWeight:600, transition:"all 0.15s", outline:"none",
                }}
              >{o.label}</button>
            ))}
          </div>

          {ans && (
            <div style={{ background:SURF, borderRadius:12, padding:"18px 20px", border:`1px solid ${BORDER}` }}>
              <p style={{ fontSize:15, lineHeight:1.7, color:TEXT, margin:0 }}>
                {story.checkinResponses[ans]}
              </p>
            </div>
          )}
        </div>

        {ans && (
          <Btn onClick={onRestart} full>Start today's story →</Btn>
        )}
      </div>
    </Shell>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function CoreLang() {
  const [screen,   setScreen]   = useState("welcome");
  const [anchor,   setAnchor]   = useState(null);
  const [draftIdx, setDraftIdx] = useState(0);
  const [stepIdx,  setStepIdx]  = useState(0);

  const reset = () => { setScreen("welcome"); setAnchor(null); setDraftIdx(0); setStepIdx(0); };

  if (screen==="welcome")
    return <Welcome onStart={()=>setScreen("picker")}/>;

  if (screen==="picker")
    return <WordPicker onPick={id=>{ setAnchor(id); setDraftIdx(0); setStepIdx(0); setScreen("story"); }}/>;

  if (screen==="story")
    return (
      <StoryBuilder
        anchor={anchor} draftIdx={draftIdx} stepIdx={stepIdx}
        onNext={()=>setStepIdx(s=>s+1)}
        onDraftDone={()=>setScreen("knowit")}
      />
    );

  if (screen==="knowit")
    return <KnowIt anchor={anchor} draftIdx={draftIdx} onDone={()=>setScreen("mission")}/>;

  if (screen==="mission")
    return <Mission anchor={anchor} draftIdx={draftIdx} onDone={()=>setScreen("complete")}/>;

  if (screen==="complete")
    return (
      <Complete
        anchor={anchor} draftIdx={draftIdx}
        onNextDraft={()=>{ setDraftIdx(d=>d+1); setStepIdx(0); setScreen("story"); }}
        onCheckin={()=>setScreen("checkin")}
      />
    );

  if (screen==="checkin")
    return <CheckIn anchor={anchor} onRestart={reset}/>;

  return null;
}

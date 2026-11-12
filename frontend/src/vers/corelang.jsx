import { useState, useEffect } from "react";

// CoreLang — a word grows into a sentence across three phases: roots → phrasal verbs → morphology.
// In each sentence, [text|key] marks a newly added word; the key is the tap hint.

const CSS = `:root{
  --bg:#07101A; --surf:#0D1B28; --card:#132333; --border:#1A3045;
  --accent:#2E86AB; --green:#4ADE80; --purple:#8B5CF6; --emerald:#10B981;
  --text:#D8E8F2; --muted:#4A6478; --gold:#F59E0B;
}
.cl,.cl *{box-sizing:border-box;}
.cl{min-height:100vh;
  margin:0; background:var(--bg); color:var(--text);
  font-family:'Inter',-apple-system,sans-serif;
  padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px);
}
.cl-app{max-width:460px; margin:0 auto; padding:0 20px; min-height:100vh;}
button{font-family:inherit; outline:none;}
.row{display:flex; align-items:center;}
.col{display:flex; flex-direction:column;}
.between{justify-content:space-between;}
.wrap{flex-wrap:wrap;}
.screen{display:flex; flex-direction:column; min-height:100vh; padding-top:36px; padding-bottom:48px;}
.screen.split{justify-content:space-between;}
.logo{display:flex; align-items:center; gap:8px;}
.logo .mark{width:25px; height:25px; background:var(--accent); border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:13px;}
.logo.small .mark{width:21px; height:21px; font-size:11px; border-radius:5px;}
.logo span.name{font-weight:700; font-size:18px; letter-spacing:-0.5px;}
.logo.small span.name{font-size:15px;}
.logo .name b{color:var(--accent); font-weight:700;}
.btn{padding:14px 28px; border-radius:10px; font-weight:600; font-size:15px; border:none; cursor:pointer; color:#fff; width:100%; letter-spacing:-0.2px; transition:opacity .15s;}
.btn:active{opacity:.8;}
.btn.ghost{background:transparent !important; border:1px solid;}
.bar{background:var(--border); border-radius:99px; height:3px; overflow:hidden;}
.bar > div{height:100%; border-radius:99px; transition:width .4s ease;}
.tag{border-radius:99px; padding:3px 10px; font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase;}
.divider{height:1px; background:var(--border); margin:24px 0;}
.eyebrow{font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px;}
.card{background:var(--card); border-radius:12px; border:1px solid var(--border);}
.surf{background:var(--surf); border-radius:16px; border:1px solid var(--border);}

@keyframes newWord{ 0%{background:rgba(74,222,128,.22);} 100%{background:transparent;} }
.new-word{color:var(--green); border-radius:4px; animation:newWord .8s ease;}
.tap-word{text-decoration:underline dotted var(--muted); text-underline-offset:3px; cursor:pointer; border-radius:4px;}

/* welcome */
.stat{display:flex; flex-direction:column; gap:4px;}
.stat .num{font-size:26px; font-weight:800; color:#fff; letter-spacing:-1px;}
.stat .lbl{font-size:11px; color:var(--muted);}
.stat-div{width:1px; height:36px; background:var(--border);}

/* word picker */
.word-grid{display:grid; grid-template-columns:1fr 1fr; gap:12px;}
.word-card{background:var(--card); border:1.5px solid var(--border); border-radius:14px; padding:20px 16px; text-align:left; cursor:pointer;}
.word-card.active{background:rgba(46,134,171,.13); border-color:var(--accent);}
.word-card .en{font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.5px;}
.word-card.active .en{color:var(--accent);}
.word-card .ar{font-size:16px; color:var(--muted); margin-top:4px; direction:rtl;}
.word-card .pos{font-size:10px; color:var(--muted); margin-top:8px; text-transform:uppercase; letter-spacing:.5px;}

/* story */
.sentence{font-size:22px; font-weight:600; line-height:1.6; margin:0; letter-spacing:-.3px;}
.tooltip{padding:12px 16px; margin-bottom:20px; gap:8px;}
.hint{gap:6px; margin-bottom:20px; font-size:12px; color:var(--muted); font-style:italic;}
.instruction{padding:12px 16px; margin-bottom:28px; font-size:13px; color:var(--muted); line-height:1.6;}

/* know it */
.mark-row{gap:8px;}
.mark-btn{flex:1; padding:10px 0; border-radius:8px; border:1.5px solid var(--border); background:var(--card); color:var(--muted); font-size:12px; font-weight:600; cursor:pointer;}

/* complete */
.pill{padding:6px 14px; border-radius:99px; font-size:12px; font-weight:600; border:1px solid var(--border); background:var(--card); color:var(--muted);}`;

const ACCENT="#2E86AB", GREEN="#4ADE80", PURPLE="#8B5CF6", EMERALD="#10B981", MUTED="#4A6478", GOLD="#F59E0B", BORDER="#1A3045", CARD="#132333";

const WORDS=[
 {id:"woman",en:"woman",ar:"امرأة",pos:"noun"},
 {id:"child",en:"child",ar:"طفل",pos:"noun"},
 {id:"life",en:"life",ar:"حياة",pos:"noun"},
 {id:"work",en:"work",ar:"عمل",pos:"noun / verb"},
 {id:"hope",en:"hope",ar:"أمل",pos:"noun / verb"},
 {id:"time",en:"time",ar:"وقت",pos:"noun"},
];

// sentence helpers: [text|key] marks a new word; p1 grows chunk by chunk
const BRK=/\[([^\]|]+)\|([^\]]+)\]|([^\[]+)/g;
function T(s){const spans=[],hs=[];let m;BRK.lastIndex=0;while((m=BRK.exec(s))){if(m[1]){spans.push({t:m[1],n:1,k:m[2]});hs.push(m[2]);}else spans.push({t:m[3]});}return{spans,hint:hs.join(" / ")};}
function P1(a){const plain=[a[0].replace(/\[([^\]|]+)\|[^\]]+\]/g,"$1")],steps=[T(a[0])];for(let i=1;i<a.length;i++){const[c,k]=a[i].split("|");steps.push({spans:[{t:plain.join(" ")+" "},{t:c,n:1,k}],hint:k});plain.push(c);}return steps;}
function D(id,ak,p1,p2,p3){return[
 {id:0,label:"Phase 1",sub:"Roots",color:ACCENT,steps:[{spans:[{t:id,n:1,k:ak}],hint:ak},...P1(p1)]},
 {id:1,label:"Phase 2",sub:"Phrasal verbs",color:PURPLE,steps:p2.map(T)},
 {id:2,label:"Phase 3",sub:"Morphology",color:EMERALD,steps:p3.map(T)}];}

const STORIES={
 woman:{nextWord:"child",mission:'Use "woman" once today — in a message, a call, or even your own thoughts.',
  checkinResponses:{yes:"That's the whole point. The word is yours now.",almost:"Almost counts. Tomorrow, it becomes easier.",no:"That's honest. Today's word is waiting for you."},
  drafts:D("woman","anchor · noun",
 ["[The|The · determiner] woman","makes food,|makes · verb root","sits with her child,|sits with · verb + preposition","and tells|and · connector / tells · verb root","a story.|a story · determiner + noun"],
 ["The woman makes food, sits [down|sits down · phrasal verb (= takes a seat)] with her child, and tells a story.","The woman makes food, sits down with her child, and [reads out|reads out · phrasal verb (= says aloud)] a story."],
 ["The woman makes food, sits down with her child, and [happily|happy + ly · adjective → adverb] reads out a story.","The woman makes food, sits down with her child, and happily reads out a story, like a [storyteller|story + tell + er · compound + suffix]."])},
 child:{nextWord:"hope",mission:'Use "child" once today — in a message, a story you tell, or a memory.',
  checkinResponses:{yes:"One word at a time. You're building something real.",almost:"Close enough. The habit is forming.",no:"No pressure. It'll come naturally — keep going."},
  drafts:D("child","anchor · noun",
 ["[The|The · determiner] child","runs|runs · verb root","to the door|to the door · direction phrase","and calls|and · connector / calls · verb root","his mother.|his mother · possessive + noun"],
 ["The child runs [in|runs in · phrasal verb (= enters quickly)] through the door and calls his mother.","The child runs in through the door and calls [out|calls out · phrasal verb (= shouts)] for his mother."],
 ["The child runs in through the door and calls out [happily|happy + ly · adjective → adverb] for his mother.","The child runs in through the door and calls out happily for his mother, [unafraid|un + afraid · negative prefix] of the dark."])},
 hope:{nextWord:"time",mission:'Use "hope" once today — say it out loud, write it, or use it to describe something real.',
  checkinResponses:{yes:"That's the habit. Small activations compound.",almost:"That still counts. The word is moving from passive to active.",no:"Honest. Try again today — just once is enough."},
  drafts:D("hope","anchor · noun / verb",
 ["[I|I · subject pronoun] hope","my father|my father · possessive + noun","comes in a week,|comes · verb root / in a week · time phrase","so we can|so · result connector / we can · subject + modal","go together.|go · verb root / together · adverb"],
 ["I hope my father [comes back|comes back · phrasal verb (= returns)] in a week, so we can go together.","I hope my father comes back in a week, so we can [go out|go out · phrasal verb (= leave the house for fun)] together."],
 ["[Hopefully|hope + ful + ly · noun → adjective → adverb] my father comes back in a week, so we can go out together.","Hopefully my father comes back in a week, so we can go out together and be [happier|happy + er · comparative]."])},
 life:{nextWord:"work",mission:'Use "life" once today — in a sentence that means something to you.',
  checkinResponses:{yes:"The best way to learn a word is to mean it.",almost:"That's closer than it sounds. Keep going.",no:"Try it once today. Just once. No pressure."},
  drafts:D("life","anchor · noun",
 ["Life [is|is · linking verb]","hard,|hard · adjective","but a good friend|but · contrast connector / good friend · adjective + noun","helps.|helps · verb root"],
 ["Life is hard, but a good friend helps you [out|helps out · phrasal verb (= supports)].","Life is hard, but a good friend helps you out and [keeps you going|keeps going · phrasal verb (= continues)]."],
 ["Life is hard, but a good [friendship|friend + ship · noun → abstract noun] helps you out and keeps you going.","Life is hard, but a good friendship helps you out and gives you the [strength|strong → strength · adjective → noun] to keep going."])},
 work:{nextWord:"woman",mission:'Use "work" once today — describe something you\'re doing, or something you value about it.',
  checkinResponses:{yes:"The word is no longer abstract. It belongs to a moment now.",almost:"That's still activation. It counts.",no:"No worries. Today is another chance."},
  drafts:D("work","anchor · noun / verb",
 ["[I go to|I go to · subject + verb + direction] work","early|early · adverb of time","and come back|and · connector / come back · verb + direction word","late.|late · adverb of time"],
 ["I go [in|go in · phrasal verb (= arrive at a place)] to work early and come back late.","I [get up|get up · phrasal verb (= leave your bed)] early, go in to work, and come back late."],
 ["I get up early, go in to my [workplace|work + place · compound noun], and come back late.","I get up early, go in to my workplace, and come back [later|late + er · comparative] than my [coworkers|co + work + er · prefix + suffix]."])},
 time:{nextWord:"life",mission:'Use "time" once today — say something true about it.',
  checkinResponses:{yes:"The word is active now. That's the whole mechanism.",almost:"Almost active. The gap between 'seen' and 'said' is small — keep going.",no:"Time is patient. Try once more today."},
  drafts:D("time","anchor · noun",
 ["[I never have|I never have · subject + adverb + verb] time","for my friends.|for my friends · preposition phrase"],
 ["I never have time [to meet up|meet up · phrasal verb (= get together)] with my friends."],
 ["I never have time to meet up with my friends, so our [friendship|friend + ship · noun → abstract noun] grows [weaker|weak + er · comparative].","I never have time to meet up with my friends, so our friendship grows weaker, [sadly|sad + ly · adjective → adverb]."])},
};

const INIT={screen:"welcome",anchor:null,draftIdx:0,stepIdx:0,tooltip:null,marks:{},ans:null,pick:null};
const H1={fontSize:40,fontWeight:800,lineHeight:1.1,letterSpacing:-1.5,margin:0};

const Logo=({small})=>(<div className={"logo"+(small?" small":"")}><div className="mark">C</div><span className="name">Core<b>Lang</b></span></div>);
const Btn=({label,onClick,color})=>(<button className="btn" style={{background:color}} onClick={onClick}>{label}</button>);

export default function CoreLang(){
  const [S,setS]=useState(INIT);
  const up=(p)=>setS(s=>({...s,...p}));
  useEffect(()=>{window.scrollTo(0,0);},[S.screen,S.draftIdx,S.stepIdx]);

  const story=S.anchor?STORIES[S.anchor]:null;
  const draft=story?story.drafts[S.draftIdx]:null;
  const isLastDraft=story?S.draftIdx===story.drafts.length-1:false;

  const storyNext=()=>S.stepIdx<draft.steps.length-1?up({stepIdx:S.stepIdx+1,tooltip:null}):up({screen:"knowit"});
  const nextDraft=()=>up({draftIdx:S.draftIdx+1,stepIdx:0,tooltip:null,screen:"story"});

  const screens={
    welcome:()=>(
      <div className="screen split">
        <Logo/>
        <div className="col" style={{gap:24}}>
          <div>
            <div className="eyebrow" style={{color:ACCENT}}>A language engine</div>
            <h1 style={{...H1,color:"#fff"}}>We start<br/>with a word.</h1>
            <h1 style={{...H1,margin:"4px 0 0"}}>We reach a <span style={{color:ACCENT}}>story.</span></h1>
          </div>
          <p style={{fontSize:16,lineHeight:1.7,color:MUTED,margin:0,maxWidth:340}}>Pick one word you recognise. Watch a sentence grow from it — word by word, across three drafts.</p>
          <div className="row" style={{gap:24}}>
            <div className="stat"><span className="num">196</span><span className="lbl">root words</span></div>
            <div className="stat-div"/>
            <div className="stat"><span className="num">1,200+</span><span className="lbl">words unlocked</span></div>
            <div className="stat-div"/>
            <div className="stat"><span className="num">60 days</span><span className="lbl">to a full story</span></div>
          </div>
        </div>
        <Btn label="Begin →" onClick={()=>up({screen:"picker"})} color={ACCENT}/>
      </div>),

    picker:()=>(
      <div className="screen">
        <Logo small/>
        <div style={{marginTop:36,marginBottom:8,fontSize:22,fontWeight:800,letterSpacing:-0.8,color:"#fff"}}>Which of these feels familiar?</div>
        <p style={{fontSize:14,color:MUTED,margin:"0 0 32px"}}>Tap the word that comes closest to something you already know.</p>
        <div className="word-grid">
          {WORDS.map(w=>(
            <button key={w.id} className={"word-card"+(S.pick===w.id?" active":"")} onClick={()=>up({pick:w.id})}>
              <div className="en">{w.en}</div><div className="ar">{w.ar}</div><div className="pos">{w.pos}</div>
            </button>))}
        </div>
        <div style={{marginTop:28}}>
          <Btn label={S.pick?`Start with "${S.pick}" →`:"Select a word to begin"} color={S.pick?ACCENT:MUTED}
            onClick={()=>S.pick&&up({anchor:S.pick,draftIdx:0,stepIdx:0,screen:"story"})}/>
        </div>
      </div>),

    story:()=>{
      const step=draft.steps[S.stepIdx], isLast=S.stepIdx===draft.steps.length-1;
      return (
        <div className="screen">
          <div className="row between" style={{marginBottom:20}}>
            <Logo small/>
            <span className="tag" style={{background:draft.color+"22",color:draft.color}}>{draft.label} · {draft.sub}</span>
          </div>
          <div className="bar"><div style={{width:Math.round((S.stepIdx+1)/draft.steps.length*100)+"%",background:draft.color}}/></div>
          <div className="row between" style={{marginTop:8,marginBottom:32}}>
            <span style={{fontSize:12,color:MUTED}}>Step {S.stepIdx+1} of {draft.steps.length}</span>
            <span style={{fontSize:12,color:MUTED}}>Phase {S.draftIdx+1} of {story.drafts.length}</span>
          </div>
          <div className="surf" style={{padding:"28px 24px",marginBottom:20,minHeight:100}}>
            <p className="sentence">
              {step.spans.map((s,i)=>(
                <span key={S.draftIdx+"-"+S.stepIdx+"-"+i} className={(s.n?"new-word ":"")+(s.k?"tap-word":"")}
                  onClick={s.k?()=>up({tooltip:S.tooltip===s.k?null:s.k}):undefined}>{s.t}</span>))}
            </p>
          </div>
          {S.tooltip
            ? <div className="card tooltip row" style={{padding:"12px 16px",marginBottom:20}}><span style={{color:ACCENT}}>◈</span><span style={{fontSize:13}}>{S.tooltip}</span></div>
            : step.hint ? <div className="row hint"><span>↳</span><span>{step.hint}</span></div> : null}
          <div className="card instruction">{S.stepIdx===0?"Your anchor word. The story starts here.":"Tap the highlighted word to see how it fits into the structure."}</div>
          <Btn label={isLast?"Complete this draft →":"Next word →"} onClick={storyNext} color={draft.color}/>
        </div>);
    },

    knowit:()=>{
      const opts=[{id:"know",label:"Know it",color:GREEN},{id:"seen",label:"Seen it",color:GOLD},{id:"new",label:"New to me",color:ACCENT}];
      const newWords=draft.steps.flatMap(s=>s.spans.filter(sp=>sp.n&&sp.k)).map(sp=>({text:sp.t.trim().replace(/[.,]$/,""),key:sp.k}));
      const marked=newWords.filter(w=>S.marks[w.text]).length, done=marked===newWords.length;
      return (
        <div className="screen">
          <Logo small/>
          <div style={{marginTop:32,marginBottom:8,fontSize:20,fontWeight:800,letterSpacing:-0.6,color:"#fff"}}>How well do you know each word?</div>
          <p style={{fontSize:14,color:MUTED,margin:"0 0 32px"}}>Be honest — this shapes your path forward.</p>
          {newWords.map(w=>(
            <div key={w.text} style={{marginBottom:16}}>
              <div className="row between" style={{marginBottom:10}}>
                <span style={{fontSize:18,fontWeight:700,color:"#fff"}}>{w.text}</span>
                <span style={{fontSize:11,color:MUTED,fontStyle:"italic"}}>{w.key}</span>
              </div>
              <div className="row mark-row">
                {opts.map(o=>(
                  <button key={o.id} className="mark-btn"
                    style={S.marks[w.text]===o.id?{borderColor:o.color,background:o.color+"22",color:o.color}:undefined}
                    onClick={()=>up({marks:{...S.marks,[w.text]:o.id}})}>{o.label}</button>))}
              </div>
            </div>))}
          <div className="divider"/>
          <Btn label={done?"Continue →":`Mark all words (${marked}/${newWords.length})`} color={done?ACCENT:MUTED} onClick={()=>done&&up({screen:"mission"})}/>
        </div>);
    },

    mission:()=>(
      <div className="screen split">
        <Logo small/>
        <div className="col" style={{gap:20}}>
          <div className="eyebrow" style={{color:GOLD}}>Your mission</div>
          <div className="surf" style={{padding:"28px 24px"}}>
            <p style={{fontSize:18,fontWeight:600,lineHeight:1.7,margin:0,color:"#fff",letterSpacing:-0.3}}>{story.mission}</p>
          </div>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,margin:0}}>Not a quiz. Not a test. Just one real use — a message, a thought out loud, a sentence you write to no one. That's how passive becomes active.</p>
          <div style={{background:draft.color+"12",border:"1px solid "+draft.color+"30",borderRadius:12,padding:"14px 18px"}}>
            <p style={{fontSize:13,color:draft.color,margin:0,fontWeight:500}}>✓ {draft.label} complete · {draft.sub} unlocked</p>
          </div>
        </div>
        <Btn label="Got it →" onClick={()=>up({screen:"complete"})} color={GOLD}/>
      </div>),

    complete:()=>{
      const last=draft.steps[draft.steps.length-1];
      const nextWord=WORDS.find(w=>w.id===story.nextWord), nd=story.drafts[S.draftIdx+1];
      return (
        <div className="screen">
          <Logo small/>
          <div style={{marginTop:32}}>
            <div className="eyebrow" style={{color:GREEN}}>{isLastDraft?"All three phases complete":draft.label+" complete"}</div>
            <h2 style={{fontSize:26,fontWeight:800,letterSpacing:-1,color:"#fff",margin:"0 0 24px"}}>You built this from one word.</h2>
            <div className="surf" style={{padding:"28px 24px",borderColor:GREEN+"40",marginBottom:24}}>
              <p style={{fontSize:18,fontWeight:600,lineHeight:1.7,margin:0,color:"#fff",letterSpacing:-0.2}}>{last.spans.map(s=>s.t).join("")}</p>
              <div className="row" style={{marginTop:16,gap:8}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:GREEN}}/>
                <span style={{fontSize:12,color:MUTED}}>{draft.label} · {draft.sub}</span>
              </div>
            </div>
            <div className="row wrap" style={{gap:8,marginBottom:32}}>
              {story.drafts.map((d,i)=>(
                <div key={d.id} className="pill" style={i<=S.draftIdx?{background:d.color+"22",borderColor:d.color+"60",color:d.color}:undefined}>{i<=S.draftIdx?"✓ ":""}{d.label}</div>))}
            </div>
            <div className="card" style={{padding:"16px 18px",marginBottom:28}}>
              <div style={{fontSize:11,color:MUTED,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Tomorrow's anchor</div>
              <div className="row between">
                <span style={{fontSize:20,fontWeight:800,color:"#fff"}}>{story.nextWord}</span>
                <span style={{fontSize:14,color:MUTED,direction:"rtl"}}>{nextWord?nextWord.ar:""}</span>
              </div>
            </div>
            {isLastDraft
              ? <Btn label="See you tomorrow →" onClick={()=>up({screen:"checkin"})} color={ACCENT}/>
              : <Btn label={`Continue to ${nd.label} — ${nd.sub} →`} onClick={nextDraft} color={nd.color}/>}
          </div>
        </div>);
    },

    checkin:()=>{
      const opts=[{id:"yes",label:"Yes, I used it",color:GREEN},{id:"almost",label:"I tried, almost",color:GOLD},{id:"no",label:"Honestly, no",color:MUTED}];
      return (
        <div className="screen split">
          <Logo small/>
          <div className="col" style={{gap:20}}>
            <div>
              <div className="eyebrow" style={{color:ACCENT}}>Day 2 check-in</div>
              <h2 style={{fontSize:22,fontWeight:800,letterSpacing:-0.8,color:"#fff",margin:0}}>Yesterday you said you'd use "{S.anchor}".</h2>
              <p style={{fontSize:22,fontWeight:800,letterSpacing:-0.8,color:MUTED,margin:"4px 0 0"}}>Did you?</p>
            </div>
            <div className="col" style={{gap:10}}>
              {opts.map(o=>(
                <button key={o.id} className="mark-btn"
                  style={{flex:"none",width:"100%",textAlign:"left",padding:"16px 20px",...(S.ans===o.id?{borderColor:o.color,background:o.color+"18",color:o.color}:{})}}
                  onClick={()=>up({ans:o.id})}>{o.label}</button>))}
            </div>
            {S.ans&&<div className="card" style={{padding:"18px 20px"}}><p style={{fontSize:15,lineHeight:1.7,margin:0}}>{story.checkinResponses[S.ans]}</p></div>}
          </div>
          {S.ans&&<Btn label="Start today's story →" onClick={()=>setS(INIT)} color={ACCENT}/>}
        </div>);
    },
  };

  return (
    <div className="cl">
      <style>{CSS}</style>
      <div className="cl-app">{screens[S.screen]()}</div>
    </div>
  );
}

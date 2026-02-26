import { useState, useRef, useEffect, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07090f;--surf:rgba(255,255,255,.046);--border:rgba(255,255,255,.09);
  --fg:#f1f5f9;--muted:#8899b4;
  --i:#6366f1;--c:#22d3ee;--p:#a855f7;--pk:#ec4899;--o:#f97316;
}
.lm-light{
  --bg:#eef2ff;--surf:rgba(255,255,255,.78);--border:rgba(99,102,241,.17);
  --fg:#0f172a;--muted:#64748b;
}
html,body,#root{height:100%}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--fg);overflow-x:hidden;transition:background .4s,color .4s}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(99,102,241,.4);border-radius:10px}

.syne{font-family:'Syne',sans-serif}
.mono{font-family:'JetBrains Mono',monospace}
.grad{background:linear-gradient(135deg,#6366f1,#22d3ee,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.grad-warm{background:linear-gradient(135deg,#f97316,#ec4899,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

.glass{background:var(--surf);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);border:1px solid var(--border);border-radius:20px}
.glass-sm{background:var(--surf);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:14px}

.btn-grad{background:linear-gradient(135deg,#6366f1,#22d3ee,#a855f7);background-size:200% 200%;animation:gradShift 3s ease infinite;border:none;cursor:pointer;color:#fff;font-family:'Syne',sans-serif;font-weight:700;transition:transform .2s,box-shadow .2s}
.btn-grad:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 40px rgba(99,102,241,.5)}
.btn-grad:active{transform:scale(.97)}
@keyframes gradShift{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}

.orb{position:fixed;border-radius:50%;filter:blur(90px);opacity:.2;pointer-events:none;z-index:0;animation:orbFloat 9s ease-in-out infinite}
.lm-light .orb{opacity:.09}
.orb1{width:440px;height:440px;background:#6366f1;top:-120px;right:-120px}
.orb2{width:340px;height:340px;background:#22d3ee;bottom:50px;left:-90px;animation-delay:3s}
.orb3{width:280px;height:280px;background:#a855f7;top:48%;left:40%;animation-delay:5.5s}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(24px,-30px) scale(1.05)}66%{transform:translate(-16px,24px) scale(.96)}}

.ring{position:absolute;border-radius:50%;border:3px solid transparent}
.r1{inset:0;border-top-color:#6366f1;animation:spin 1.2s linear infinite}
.r2{inset:12px;border-top-color:#22d3ee;animation:spinR .9s linear infinite}
.r3{inset:24px;border-top-color:#a855f7;animation:spin 1.6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinR{to{transform:rotate(-360deg)}}

@keyframes thinking{0%,80%,100%{transform:scale(.4);opacity:.3}40%{transform:scale(1);opacity:1}}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;background:linear-gradient(135deg,#6366f1,#22d3ee)}

@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .5s ease forwards}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}

.bar-track{height:6px;background:rgba(255,255,255,.1);border-radius:10px;overflow:hidden}
.bar-fill{height:100%;background:linear-gradient(90deg,#6366f1,#22d3ee);border-radius:10px;transition:width .8s cubic-bezier(.34,1.56,.64,1)}

.chov{transition:transform .3s,box-shadow .3s,border-color .3s}
.chov:hover{transform:translateY(-4px);border-color:rgba(99,102,241,.4)!important;box-shadow:0 20px 60px rgba(0,0,0,.3),0 0 30px rgba(99,102,241,.15)}

.rw{position:relative;overflow:hidden}
@keyframes ripAnim{from{width:0;height:0;opacity:1}to{width:200px;height:200px;margin-left:-100px;margin-top:-100px;opacity:0}}
.rip-el{position:absolute;border-radius:50%;background:rgba(255,255,255,.25);animation:ripAnim .6s ease-out;pointer-events:none}

.opt{padding:13px 18px;border-radius:12px;border:1.5px solid var(--border);background:transparent;color:var(--fg);text-align:left;cursor:pointer;width:100%;display:flex;justify-content:space-between;align-items:center;transition:border-color .25s,background .25s;font-family:'DM Sans',sans-serif;font-size:15px}
.opt:hover:not(:disabled){border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.06)}

.sbi{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:12px;cursor:pointer;border:none;background:transparent;color:var(--muted);font-size:18px;transition:background .2s,color .2s,box-shadow .2s}
.sbi:hover{background:rgba(99,102,241,.18);color:#6366f1}
.sbi.active{background:rgba(99,102,241,.22);color:#6366f1;box-shadow:0 0 18px rgba(99,102,241,.3)}

.tdot{width:13px;height:13px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#22d3ee);box-shadow:0 0 10px rgba(99,102,241,.5);flex-shrink:0}
.drop-active{border-color:#6366f1!important;background:rgba(99,102,241,.08)!important;transform:scale(1.01)}

@keyframes cfall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,.4)}50%{box-shadow:0 0 50px rgba(99,102,241,.8),0 0 80px rgba(34,211,238,.3)}}
.tab-content{animation:fadeUp .4s ease forwards}

/* ── card flip (flashcards) ── */
.flip-card{perspective:1000px;cursor:pointer}
.flip-inner{position:relative;width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d}
.flip-card.flipped .flip-inner{transform:rotateY(180deg)}
.flip-front,.flip-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:16px;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center}
.flip-back{transform:rotateY(180deg)}

/* ── pomodoro ── */
@keyframes timerPulse{0%,100%{opacity:1}50%{opacity:.7}}
.timer-active{animation:timerPulse 2s ease-in-out infinite}

/* ── mindmap ── */
.mm-node{cursor:pointer;transition:transform .2s}
.mm-node:hover{transform:scale(1.08)}

/* ── wallpaper palette btn ── */
.pal-btn{border:2px solid transparent;border-radius:12px;cursor:pointer;padding:10px 14px;transition:all .25s;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;background:var(--surf)}
.pal-btn.active{border-color:var(--i);box-shadow:0 0 18px rgba(99,102,241,.35)}
.pal-btn:hover{transform:translateY(-2px)}

/* ── poem card ── */
.poem-line{opacity:0;animation:fadeUp .4s ease forwards}

/* ── error banner ── */
.err{padding:14px 18px;border-radius:14px;background:rgba(236,72,153,.1);border:1px solid rgba(236,72,153,.3);color:#ec4899;font-size:13px;line-height:1.6}

/* ── tag pill ── */
.pill{padding:4px 12px;border-radius:100px;font-size:12px;border:1px solid}
`

function injectCSS() {
  if (document.getElementById('lm-css')) return
  const s = document.createElement('style')
  s.id = 'lm-css'
  s.textContent = CSS
  document.head.appendChild(s)
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEMO DATA
═══════════════════════════════════════════════════════════════════════════ */
const DEMO = {
  subject: 'Machine Learning',
  summary: {
    overview: 'This lecture covers ML fundamentals: supervised/unsupervised learning, neural networks, regularisation, and evaluation metrics. Students learn both the mathematical intuition and practical skills needed for real-world ML.',
    keyPoints: [
      'Supervised learning maps labelled inputs to outputs — classification (spam) and regression (price prediction) are core tasks.',
      'The bias-variance tradeoff governs model complexity: L1/L2 regularisation and dropout help find the optimal balance.',
      'Feature engineering — transforming raw data into informative representations — is the single highest-impact step in any ML pipeline.',
      'Neural networks learn hierarchical patterns through backpropagation, adjusting weights via gradient descent to minimise loss.',
      'Reliable evaluation requires held-out test sets, k-fold cross-validation, and metrics matched to the task (accuracy, F1, AUC-ROC).',
    ],
    conclusion: 'Effective ML is equal parts mathematical rigour and engineering judgement — knowing when and why to use each algorithm defines a strong practitioner.',
  },
  quiz: {
    questions: [
      { question: 'Which regularisation technique encourages sparsity by zeroing out irrelevant weights?', options: ['L2 (Ridge)', 'L1 (Lasso)', 'Dropout', 'Batch Norm'], correct: 1, explanation: 'L1 adds absolute weight values to the loss, producing sparse models ideal for feature selection.' },
      { question: 'What is the primary purpose of a validation set?', options: ['Train final weights', 'Tune hyperparameters without touching the test set', 'Augment training data', 'Compute final accuracy'], correct: 1, explanation: 'The validation set tunes hyperparameters and monitors overfitting, keeping the test set truly unseen.' },
      { question: 'What does learning rate control in gradient descent?', options: ['Epoch count', 'Magnitude of each weight update', 'Layer count', 'Dropout rate'], correct: 1, explanation: 'Learning rate scales each parameter update step — too high diverges, too low converges very slowly.' },
      { question: 'Which ensemble method trains many trees on random data/feature subsets?', options: ['SVM', 'KNN', 'Random Forest', 'Naive Bayes'], correct: 2, explanation: 'Random Forest averages decorrelated trees grown on bootstrapped samples, reducing variance significantly.' },
      { question: 'The vanishing gradient problem most severely affects which architecture?', options: ['CNNs', 'Deep RNNs', 'Shallow MLPs', 'Linear models'], correct: 1, explanation: 'Deep RNNs multiply gradients across many time steps, shrinking them exponentially — motivating LSTMs.' },
    ],
  },
  flashcards: [
    { front: 'Overfitting', back: 'Model learns training data too well, including noise — performs poorly on unseen data.' },
    { front: 'Gradient Descent', back: 'Optimisation algorithm that iteratively moves parameters in the direction of steepest loss decrease.' },
    { front: 'Bias-Variance Tradeoff', back: 'Tension between underfitting (high bias) and overfitting (high variance) — regularisation mediates this.' },
    { front: 'Backpropagation', back: 'Algorithm computing gradients of loss with respect to all weights via the chain rule — enables NN training.' },
    { front: 'Cross-Validation', back: 'Technique splitting data into k folds to estimate model performance more reliably than a single split.' },
    { front: 'Feature Engineering', back: 'Process of creating or transforming input features to make patterns more learnable for a model.' },
    { front: 'Softmax', back: 'Activation function converting raw scores to probability distribution for multi-class classification.' },
    { front: 'Dropout', back: 'Regularisation technique randomly zeroing neurons during training to prevent co-adaptation.' },
  ],
  hardTopics: {
    topics: [
      { name: 'Backpropagation & Gradient Flow', difficulty: 9, reason: 'Requires chain rule through arbitrary computational graphs plus handling vanishing/exploding gradients.', tips: ['Chain Rule', 'Computational Graphs', 'Gradient Clipping'] },
      { name: 'Bias-Variance Tradeoff', difficulty: 7, reason: 'Simple concept but mathematically nuanced — students conflate error sources and misapply regularisation.', tips: ['Learning Curves', 'Regularisation', 'Cross-Validation'] },
      { name: 'Attention & Transformers', difficulty: 8, reason: 'Multi-head self-attention involves dense matrix operations and positional encodings needing strong linear algebra.', tips: ['Scaled Dot-Product', 'Multi-Head Attention', 'Positional Encoding'] },
    ],
  },
  studyPlan: {
    days: [
      { day:1, theme:'Foundations', totalTime:'2h 30m', topics:['ML paradigms'], blocks:[{topic:'Supervised vs Unsupervised',time:'45 min',activity:'Read slides 1–12; build comparison table with examples.'},{topic:'Maths Prerequisites',time:'45 min',activity:'Review matrix ops and Bayes theorem on Khan Academy.'},{topic:'Flashcard Recall',time:'30 min',activity:'Create and self-test 20 Anki cards for key terms.'},{topic:'Buffer',time:'30 min',activity:'Revisit any shaky definitions from flashcard session.'}] },
      { day:2, theme:'Supervised Learning', totalTime:'3h', topics:['Regression','Classification'], blocks:[{topic:'Linear & Logistic Regression',time:'60 min',activity:'Derive gradient descent update rules from scratch on paper.'},{topic:'Decision Trees',time:'60 min',activity:'Code a CART tree; vary max_depth 1–10 and plot accuracy curves.'},{topic:'Kaggle Practice',time:'60 min',activity:'Train 3 classifiers on Titanic dataset; compare F1 scores.'}] },
      { day:3, theme:'Neural Networks', totalTime:'3h 30m', topics:['MLP','Backprop'], blocks:[{topic:'MLP Forward Pass',time:'45 min',activity:'Draw 3-layer network; trace one sample through all layers.'},{topic:'Backprop Derivation',time:'75 min',activity:'Manually compute gradients for a 2-layer network on paper.'},{topic:'PyTorch Lab',time:'60 min',activity:'Implement the same network; verify .grad matches your manual calc.'},{topic:'Reflection',time:'30 min',activity:'Write a plain-English paragraph explaining backprop to a friend.'}] },
      { day:4, theme:'Regularisation', totalTime:'2h 45m', topics:['L1/L2','Dropout'], blocks:[{topic:'Bias-Variance Curves',time:'45 min',activity:'Plot training/validation loss across 5 model complexities.'},{topic:'L1 vs L2 Lab',time:'60 min',activity:'Compare weight distributions experimentally in sklearn.'},{topic:'Dropout & Batch Norm',time:'60 min',activity:'Add dropout (p=0.3) to PyTorch model; monitor training stability.'}] },
      { day:5, theme:'Evaluation Metrics', totalTime:'2h', topics:['AUC-ROC','F1'], blocks:[{topic:'Metric Landscape',time:'45 min',activity:'For each metric write when to use it and why in one sentence.'},{topic:'CV Lab',time:'45 min',activity:'Implement 5-fold CV from scratch; compare to sklearn.'},{topic:'Practice Problems',time:'30 min',activity:'Solve 5 metric-calculation problems with full working.'}] },
      { day:6, theme:'Advanced Topics', totalTime:'3h', topics:['Transformers','Transfer Learning'], blocks:[{topic:'Attention Mechanisms',time:'75 min',activity:'Watch 3Blue1Brown attention video; draw the attention matrix for a toy example.'},{topic:'Transfer Learning',time:'60 min',activity:'Fine-tune DistilBERT on sentiment task using HuggingFace.'},{topic:'Concept Map',time:'45 min',activity:'Build mind map connecting all topics from the week.'}] },
      { day:7, theme:'Review & Mock Exam', totalTime:'3h', topics:['Full review','Practice exam'], blocks:[{topic:'Summary Review',time:'60 min',activity:'Re-read notes; flag any topic you cannot explain from memory.'},{topic:'Mock Exam',time:'75 min',activity:'Complete 20-question practice exam under timed conditions.'},{topic:'Gap Analysis',time:'45 min',activity:'For every wrong answer, write the correct reasoning and revisit that section.'}] },
    ],
  },
  videos: {
    videos: [
      { title:'Backpropagation, Intuitively', channel:'3Blue1Brown', duration:'14:32', description:'Animated walkthrough of gradient flow through computational graphs — the clearest visual explanation available.', url:'https://www.youtube.com/watch?v=Ilg3gGewQ5U' },
      { title:'Bias and Variance — Clearly Explained', channel:'StatQuest', duration:'20:15', description:'Visual breakdown of the bias-variance tradeoff with concrete examples and regularisation strategies.', url:'https://www.youtube.com/watch?v=EuBBz3bI-aA' },
      { title:'Attention Is All You Need — Paper Explained', channel:'Yannic Kilcher', duration:'26:41', description:'Deep dive into the Transformer paper: scaled dot-product attention, multi-head attention, and positional encodings.', url:'https://www.youtube.com/watch?v=iDulhoQ2pro' },
    ],
  },
  mindmap: {
    root: 'Machine Learning',
    branches: [
      { label:'Supervised Learning', color:'#6366f1', children:['Linear Regression','Decision Trees','Neural Networks'] },
      { label:'Unsupervised', color:'#22d3ee', children:['K-Means','PCA','Autoencoders'] },
      { label:'Optimisation', color:'#a855f7', children:['Gradient Descent','Adam','Learning Rate Schedules'] },
      { label:'Regularisation', color:'#ec4899', children:['L1/L2','Dropout','Early Stopping'] },
      { label:'Evaluation', color:'#f97316', children:['Cross-Validation','AUC-ROC','F1 Score'] },
    ],
  },
  poem: `When features are many and labels are few,
Supervised learning will guide what you do.
The gradient descends down the loss hill so steep,
While backprop computes every gradient we keep.

Overfit the training? Regularise that!
Dropout kills neurons — take care of that stat.
Cross-validate wisely, your AUC should soar —
Machine Learning mastered? Go learn even more! 🎓`,
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED MICRO-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */
function RippleBtn({ onClick, children, className, style, disabled }) {
  const ref = useRef(null)
  function handle(e) {
    if (disabled) return
    const el = document.createElement('span')
    el.className = 'rip-el'
    const r = ref.current.getBoundingClientRect()
    el.style.left = `${e.clientX - r.left}px`
    el.style.top = `${e.clientY - r.top}px`
    ref.current.appendChild(el)
    setTimeout(() => el.remove(), 700)
    onClick && onClick(e)
  }
  return <button ref={ref} onClick={handle} className={`rw ${className || ''}`} style={style} disabled={disabled}>{children}</button>
}

function Dots() {
  return (
    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
      {[0,1,2].map(i => <span key={i} className="dot" style={{ animation:`thinking 1.4s ${i*.16}s ease-in-out infinite` }} />)}
    </div>
  )
}

function Confetti({ active }) {
  if (!active) return null
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id:i, left:`${Math.random()*100}%`,
    delay:`${Math.random()*1.8}s`, dur:`${2+Math.random()*2}s`,
    color:['#6366f1','#22d3ee','#a855f7','#ec4899','#f97316','#facc15'][i%6],
    size:`${6+Math.random()*8}px`, br:Math.random()>.5?'50%':'2px',
  }))
  return (
    <div style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:9999 }}>
      {pieces.map(p => <div key={p.id} style={{ position:'absolute',left:p.left,top:'-20px',width:p.size,height:p.size,background:p.color,borderRadius:p.br,animation:`cfall ${p.dur} ${p.delay} ease-in forwards` }} />)}
    </div>
  )
}

const STAGES = [
  'Uploading PDF…','Extracting text with PyMuPDF…','Parsing pages…',
  'Analysing concepts…','Generating summary…','Building quiz…',
  'Crafting study plan…','Finding videos…','Generating flashcards…','Finalising…'
]

function ProcessingScreen({ stage, progress, fileName }) {
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'65vh',gap:32,padding:40 }}>
      <div style={{ position:'relative',width:120,height:120 }}>
        <div className="ring r1"/><div className="ring r2"/><div className="ring r3"/>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,animation:'pulseGlow 2s ease infinite' }}>🧠</div>
      </div>
      <div style={{ textAlign:'center' }}>
        <h2 className="syne" style={{ fontSize:26,fontWeight:700,marginBottom:8 }}>
          Python AI is <span className="grad">analysing</span> your lecture
        </h2>
        {fileName && <p style={{ color:'var(--muted)',fontSize:13,marginBottom:6 }}>📄 {fileName}</p>}
        <p style={{ color:'var(--muted)',marginBottom:16 }}>{STAGES[Math.min(stage,STAGES.length-1)]}</p>
        <Dots />
      </div>
      <div style={{ width:'100%',maxWidth:420 }}>
        <div className="bar-track"><div className="bar-fill" style={{ width:`${progress}%` }}/></div>
        <div style={{ display:'flex',justifyContent:'space-between',marginTop:8,fontSize:12,color:'var(--muted)' }}>
          <span>PyMuPDF + FastAPI + Claude Opus</span>
          <span className="mono" style={{ color:'#22d3ee' }}>{progress}%</span>
        </div>
      </div>
      <div style={{ display:'flex',gap:7 }}>
        {STAGES.slice(0,8).map((_,i) => <div key={i} style={{ height:7,borderRadius:10,width:i<=stage?26:7,background:i<=stage?'linear-gradient(90deg,#6366f1,#22d3ee)':'rgba(255,255,255,.1)',transition:'all .4s ease' }}/>)}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   UPLOAD SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function UploadScreen({ onUpload }) {
  const [dragging, setDragging] = useState(false)
  const ref = useRef(null)

  function handle(file) {
    if (!file) return
    if (file.type !== 'application/pdf') { alert('Please upload a PDF file.'); return }
    onUpload(file, false)
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:32,padding:'30px 20px',maxWidth:680,margin:'0 auto' }}>
      <div style={{ padding:'5px 15px',borderRadius:100,background:'rgba(99,102,241,.12)',border:'1px solid rgba(99,102,241,.25)',fontSize:11,fontWeight:700,letterSpacing:2,color:'#6366f1',textTransform:'uppercase' }}>
        ✦ Python + Claude AI Engine
      </div>

      <div style={{ textAlign:'center' }}>
        <h1 className="syne" style={{ fontSize:'clamp(24px,5vw,50px)',fontWeight:800,lineHeight:1.15,marginBottom:16 }}>
          Turn Your Lecture PDFs into a<br/>
          <span className="grad">Smart Study System</span>
        </h1>
        <p style={{ color:'var(--muted)',fontSize:16,maxWidth:480,margin:'0 auto',lineHeight:1.75 }}>
          Upload a lecture PDF — Python extracts text page-by-page, Claude AI generates summaries, quizzes, flashcards, mind maps, wallpapers, poems, and a 7-day study plan.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handle(e.dataTransfer.files[0])}}
        onClick={()=>ref.current.click()}
        className={`glass ${dragging?'drop-active':''}`}
        style={{ width:'100%',maxWidth:500,border:'2px dashed rgba(99,102,241,.35)',borderRadius:24,padding:'44px 32px',textAlign:'center',cursor:'pointer',transition:'all .3s',animation:'pulseGlow 3s ease infinite' }}
      >
        <input ref={ref} type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>handle(e.target.files[0])}/>
        <div style={{ width:70,height:70,borderRadius:20,margin:'0 auto 16px',background:'linear-gradient(135deg,rgba(99,102,241,.18),rgba(34,211,238,.18))',border:'1.5px solid rgba(99,102,241,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,transition:'transform .3s',transform:dragging?'scale(1.18)':'scale(1)' }}>📄</div>
        <h3 className="syne" style={{ fontSize:20,fontWeight:700,marginBottom:8 }}>{dragging?'Drop it! 🎯':'Drop your lecture PDF here'}</h3>
        <p style={{ color:'var(--muted)',fontSize:14,marginBottom:22 }}>or click to browse · text-based PDFs only</p>
        <div style={{ display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap' }}>
          {['📋 Summary','🎯 Quiz','🃏 Flashcards','🗺 Mind Map','🎨 Wallpaper','📅 Study Plan','📜 Poem','🍅 Pomodoro'].map(l => (
            <span key={l} style={{ padding:'4px 11px',borderRadius:100,fontSize:11,background:'rgba(255,255,255,.05)',border:'1px solid var(--border)' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',justifyContent:'center' }}>
        <RippleBtn onClick={()=>onUpload(null,true)} className="btn-grad"
          style={{ padding:'14px 32px',borderRadius:16,fontSize:15,display:'flex',alignItems:'center',gap:8 }}>
          ✨ Try Demo Lecture
        </RippleBtn>
        <span style={{ color:'var(--muted)',fontSize:14 }}>No PDF or API key needed</span>
      </div>

      {/* Tech stack */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,width:'100%' }}>
        {[
          {icon:'🐍',label:'FastAPI',sub:'Python backend'},
          {icon:'📄',label:'PyMuPDF',sub:'PDF extraction'},
          {icon:'🧠',label:'Claude Opus',sub:'AI analysis'},
          {icon:'🎨',label:'SVG Wallpapers',sub:'Downloadable'},
          {icon:'🃏',label:'Flashcards',sub:'With flip animation'},
          {icon:'🗺',label:'Mind Map',sub:'Visual learning'},
          {icon:'📜',label:'AI Poem',sub:'Mnemonic helper'},
          {icon:'🍅',label:'Pomodoro',sub:'Built-in timer'},
        ].map(f => (
          <div key={f.label} className="glass-sm" style={{ padding:'12px 14px',textAlign:'center' }}>
            <div style={{ fontSize:20,marginBottom:4 }}>{f.icon}</div>
            <div className="syne" style={{ fontSize:12,fontWeight:700,marginBottom:2 }}>{f.label}</div>
            <div style={{ fontSize:10,color:'var(--muted)' }}>{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD TABS
═══════════════════════════════════════════════════════════════════════════ */

/* ── Summary ── */
function SummaryTab({ data }) {
  if (!data) return null
  const AC = ['#6366f1','#22d3ee','#a855f7','#ec4899','#f97316']
  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:18 }}>
      <div className="glass chov" style={{ padding:26 }}>
        <div style={{ display:'flex',gap:10,alignItems:'center',marginBottom:16 }}>
          <span style={{ fontSize:20 }}>📋</span>
          <h3 className="syne" style={{ fontSize:17,fontWeight:700 }}>Overview</h3>
        </div>
        <p style={{ color:'var(--muted)',lineHeight:1.82 }}>{data.overview}</p>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14 }}>
        {data.keyPoints.map((pt,i) => (
          <div key={i} className={`glass-sm chov fu d${Math.min(i+1,5)}`} style={{ padding:18,opacity:0,animationFillMode:'forwards' }}>
            <div style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
              <div style={{ width:28,height:28,borderRadius:8,flexShrink:0,background:`linear-gradient(135deg,${AC[i%5]},${AC[(i+1)%5]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff' }}>{i+1}</div>
              <p style={{ fontSize:14,lineHeight:1.78,color:'var(--muted)' }}>{pt}</p>
            </div>
          </div>
        ))}
      </div>
      {data.conclusion && (
        <div className="glass chov" style={{ padding:22,borderLeft:'3px solid #6366f1',borderRadius:'0 20px 20px 0' }}>
          <div style={{ display:'flex',gap:10,marginBottom:8 }}><span>💡</span><span className="syne" style={{ fontWeight:600 }}>Key Takeaway</span></div>
          <p style={{ color:'var(--muted)',lineHeight:1.78,fontStyle:'italic' }}>{data.conclusion}</p>
        </div>
      )}
    </div>
  )
}

/* ── Quiz ── */
function QuizTab({ data }) {
  const [cur,setCur]=useState(0),[sel,setSel]=useState(null),[ans,setAns]=useState(false)
  const [score,setScore]=useState(0),[done,setDone]=useState(false),[conf,setConf]=useState(false)
  const [log,setLog]=useState([])
  if (!data?.questions?.length) return null
  const q=data.questions[cur]; const total=data.questions.length
  function pick(idx){ if(ans)return; setSel(idx);setAns(true); if(idx===q.correct)setScore(s=>s+1); setLog(l=>[...l,idx===q.correct]) }
  function next(){ if(cur+1>=total){setDone(true);const f=log.filter(Boolean).length+(sel===q.correct?1:0);if(f/total>=.7){setConf(true);setTimeout(()=>setConf(false),4500)}}else{setCur(c=>c+1);setSel(null);setAns(false)} }
  function reset(){ setCur(0);setSel(null);setAns(false);setScore(0);setDone(false);setLog([]) }
  if(done){ const f=log.filter(Boolean).length; const pct=Math.round(f/total*100)
    return <div className="tab-content" style={{ textAlign:'center',padding:'40px 20px' }}><Confetti active={conf}/><div style={{ fontSize:68,marginBottom:14 }}>{pct>=80?'🎉':pct>=60?'👏':'📚'}</div><h2 className="syne" style={{ fontSize:28,fontWeight:800,marginBottom:8 }}>{pct>=80?'Excellent!':pct>=60?'Good job!':'Keep studying!'}</h2><p className="grad syne" style={{ fontSize:52,fontWeight:800,marginBottom:8 }}>{pct}%</p><p style={{ color:'var(--muted)',marginBottom:28 }}>You got <strong style={{ color:'var(--fg)' }}>{f}</strong> of <strong style={{ color:'var(--fg)' }}>{total}</strong> correct.</p><div style={{ display:'flex',gap:8,justifyContent:'center',marginBottom:32 }}>{log.map((r,i)=><div key={i} style={{ width:12,height:12,borderRadius:'50%',background:r?'#22d3ee':'#ec4899' }}/>)}</div><RippleBtn onClick={reset} className="btn-grad" style={{ padding:'14px 36px',borderRadius:14,fontSize:15 }}>Try Again</RippleBtn></div>
  }
  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:18 }}>
      <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{ color:'var(--muted)',fontSize:14 }}>Question {cur+1} of {total}</span><span className="mono" style={{ color:'#22d3ee',fontWeight:600 }}>{score}/{total}</span></div>
      <div className="bar-track"><div className="bar-fill" style={{ width:`${cur/total*100}%` }}/></div>
      <div className="glass" style={{ padding:26 }}>
        <p style={{ fontSize:10,letterSpacing:2,color:'#6366f1',fontWeight:700,marginBottom:12,textTransform:'uppercase' }}>Question {cur+1}</p>
        <h3 className="syne" style={{ fontSize:19,fontWeight:700,lineHeight:1.5,marginBottom:22 }}>{q.question}</h3>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {q.options.map((opt,idx)=>{
            let border='var(--border)',bg='transparent',icon=null
            if(ans){ if(idx===q.correct){border='#22d3ee';bg='rgba(34,211,238,.08)';icon='✓'}else if(idx===sel){border='#ec4899';bg='rgba(236,72,153,.08)';icon='✗'} }
            else if(idx===sel){border='#6366f1';bg='rgba(99,102,241,.08)'}
            return <button key={idx} onClick={()=>pick(idx)} disabled={ans} className="opt" style={{ borderColor:border,background:bg,cursor:ans?'default':'pointer' }}><span>{opt}</span>{icon&&<span style={{ fontWeight:700,color:idx===q.correct?'#22d3ee':'#ec4899' }}>{icon}</span>}</button>
          })}
        </div>
        {ans&&<div style={{ marginTop:18,padding:14,borderRadius:12,background:'rgba(99,102,241,.08)',border:'1px solid rgba(99,102,241,.2)' }}><p style={{ fontSize:13,color:'var(--muted)',lineHeight:1.65 }}><strong style={{ color:'#6366f1' }}>Explanation: </strong>{q.explanation}</p></div>}
      </div>
      {ans&&<RippleBtn onClick={next} className="btn-grad" style={{ padding:'14px 28px',borderRadius:14,fontSize:15,width:'100%' }}>{cur+1>=total?'See Results 🎯':'Next Question →'}</RippleBtn>}
    </div>
  )
}

/* ── Flashcards ── */
function FlashcardsTab({ data, subject }) {
  const [cur, setCur] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState(data || [])
  const [known, setKnown] = useState(new Set())

  async function fetchMore() {
    setLoading(true)
    try {
      const resp = await fetch('/api/flashcards', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ subject, existingTerms: cards.map(c=>c.front) })
      })
      const json = await resp.json()
      if (json.ok) setCards(c => [...c, ...json.cards])
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function markKnown() {
    setKnown(k => { const s=new Set(k); s.add(cur); return s })
    setFlipped(false)
    setTimeout(() => setCur(c => (c+1) % cards.length), 300)
  }
  function next() { setFlipped(false); setTimeout(()=>setCur(c=>(c+1)%cards.length), 300) }
  function prev() { setFlipped(false); setTimeout(()=>setCur(c=>(c-1+cards.length)%cards.length), 300) }

  if (!cards.length) return null
  const card = cards[cur]
  const progress = Math.round((known.size / cards.length) * 100)

  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:20,alignItems:'center' }}>
      {/* Stats */}
      <div style={{ display:'flex',gap:16,width:'100%',justifyContent:'space-between',alignItems:'center' }}>
        <span style={{ color:'var(--muted)',fontSize:14 }}>Card {cur+1} of {cards.length}</span>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ color:'var(--muted)',fontSize:12 }}>Mastered:</span>
          <span className="mono" style={{ color:'#22d3ee',fontWeight:700 }}>{known.size}/{cards.length}</span>
        </div>
      </div>
      <div className="bar-track" style={{ width:'100%' }}>
        <div className="bar-fill" style={{ width:`${progress}%` }}/>
      </div>

      {/* Card */}
      <div className={`flip-card ${flipped?'flipped':''}`}
        style={{ width:'100%',maxWidth:500,height:260 }}
        onClick={()=>setFlipped(f=>!f)}>
        <div className="flip-inner">
          <div className="flip-front glass" style={{
            border:`1.5px solid ${known.has(cur)?'rgba(34,211,238,.4)':'var(--border)'}`,
            flexDirection:'column', gap:12,
          }}>
            <span style={{ fontSize:11,letterSpacing:2,color:'#6366f1',fontWeight:700,textTransform:'uppercase' }}>TERM</span>
            <h3 className="syne" style={{ fontSize:22,fontWeight:800 }}>{card.front}</h3>
            <span style={{ fontSize:12,color:'var(--muted)' }}>Click to reveal definition →</span>
            {known.has(cur) && <span style={{ position:'absolute',top:12,right:14,fontSize:18 }}>✅</span>}
          </div>
          <div className="flip-back" style={{
            background:'linear-gradient(135deg,rgba(99,102,241,.18),rgba(34,211,238,.12))',
            border:'1.5px solid rgba(99,102,241,.35)',
            flexDirection:'column', gap:12,
          }}>
            <span style={{ fontSize:11,letterSpacing:2,color:'#22d3ee',fontWeight:700,textTransform:'uppercase' }}>DEFINITION</span>
            <p style={{ color:'var(--fg)',fontSize:15,lineHeight:1.75 }}>{card.back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center' }}>
        <button onClick={prev} style={{ padding:'10px 18px',borderRadius:12,border:'1.5px solid var(--border)',background:'transparent',color:'var(--fg)',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13 }}>← Prev</button>
        <button onClick={markKnown} style={{ padding:'10px 18px',borderRadius:12,border:'1.5px solid rgba(34,211,238,.4)',background:'rgba(34,211,238,.08)',color:'#22d3ee',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13 }}>✓ Got it!</button>
        <button onClick={next} style={{ padding:'10px 18px',borderRadius:12,border:'1.5px solid var(--border)',background:'transparent',color:'var(--fg)',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13 }}>Next →</button>
        <RippleBtn onClick={fetchMore} className="btn-grad" disabled={loading} style={{ padding:'10px 18px',borderRadius:12,fontSize:13,display:'flex',alignItems:'center',gap:6 }}>
          {loading?<Dots/>:<>✨ More Cards</>}
        </RippleBtn>
      </div>

      {/* Card grid */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10,width:'100%',marginTop:8 }}>
        {cards.map((c,i)=>(
          <div key={i} onClick={()=>{setCur(i);setFlipped(false)}}
            className="glass-sm"
            style={{ padding:'12px 14px',cursor:'pointer',borderColor:i===cur?'rgba(99,102,241,.5)':known.has(i)?'rgba(34,211,238,.3)':'var(--border)',opacity:1,transition:'all .2s' }}>
            <div style={{ fontSize:11,color:'var(--muted)',marginBottom:4,display:'flex',justifyContent:'space-between' }}>
              <span>#{i+1}</span>{known.has(i)&&<span>✅</span>}
            </div>
            <p style={{ fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.front}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Mind Map ── */
function MindMapTab({ data, subject, overview }) {
  const [loading, setLoading] = useState(false)
  const [map, setMap] = useState(data)
  const [selBranch, setSelBranch] = useState(null)

  async function refreshMap() {
    setLoading(true)
    try {
      const resp = await fetch('/api/mindmap', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ subject, overview })
      })
      const json = await resp.json()
      if (json.ok) setMap(json.mindmap)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  if (!map) return null
  const W = 700, H = 500, cx = W/2, cy = H/2, R1 = 160, R2 = 290
  const branches = map.branches || []
  const angleStep = (2 * Math.PI) / branches.length

  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:18 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <h3 className="syne" style={{ fontWeight:700,fontSize:16 }}>🗺 Mind Map: {map.root}</h3>
        <RippleBtn onClick={refreshMap} className="btn-grad" disabled={loading}
          style={{ padding:'9px 18px',borderRadius:12,fontSize:13,display:'flex',alignItems:'center',gap:6 }}>
          {loading?<Dots/>:<>🔄 Regenerate</>}
        </RippleBtn>
      </div>

      <div className="glass" style={{ padding:20,overflowX:'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxHeight:520 }}>
          <defs>
            {branches.map((b,i) => (
              <radialGradient key={i} id={`bg${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={b.color} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={b.color} stopOpacity="0.05"/>
              </radialGradient>
            ))}
          </defs>

          {/* Branch lines + child lines */}
          {branches.map((b, bi) => {
            const angle = bi * angleStep - Math.PI/2
            const bx = cx + Math.cos(angle) * R1
            const by = cy + Math.sin(angle) * R1
            const nChildren = b.children?.length || 0
            return (
              <g key={bi}>
                <line x1={cx} y1={cy} x2={bx} y2={by} stroke={b.color} strokeWidth="2" strokeOpacity="0.5"/>
                {(b.children||[]).map((ch, ci) => {
                  const cAngle = angle + (ci - (nChildren-1)/2) * 0.55
                  const chx = cx + Math.cos(cAngle) * R2
                  const chy = cy + Math.sin(cAngle) * R2
                  return (
                    <g key={ci}>
                      <line x1={bx} y1={by} x2={chx} y2={chy} stroke={b.color} strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4,4"/>
                      <circle cx={chx} cy={chy} r="30" fill={`url(#bg${bi})`} stroke={b.color} strokeWidth="1" strokeOpacity="0.4"/>
                      <text x={chx} y={chy} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={b.color} fillOpacity="0.85" style={{ fontFamily:'monospace' }}>
                        {ch.length>10?ch.slice(0,10)+'…':ch}
                      </text>
                    </g>
                  )
                })}
              </g>
            )
          })}

          {/* Root */}
          <circle cx={cx} cy={cy} r="55" fill="rgba(99,102,241,.18)" stroke="#6366f1" strokeWidth="2"/>
          <text x={cx} y={cy-6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#f1f5f9" style={{ fontFamily:'Syne,sans-serif' }}>
            {(map.root||'').slice(0,12)}
          </text>
          <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill="#94a3b8">CORE</text>

          {/* Branches */}
          {branches.map((b, bi) => {
            const angle = bi * angleStep - Math.PI/2
            const bx = cx + Math.cos(angle) * R1
            const by = cy + Math.sin(angle) * R1
            const selected = selBranch === bi
            return (
              <g key={bi} className="mm-node" onClick={()=>setSelBranch(selBranch===bi?null:bi)}>
                <circle cx={bx} cy={by} r={selected?42:36} fill={`url(#bg${bi})`} stroke={b.color} strokeWidth={selected?2.5:1.5} style={{ filter:selected?`drop-shadow(0 0 10px ${b.color})`:'none' }}/>
                <text x={bx} y={by-4} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={b.color} style={{ fontFamily:'Syne,sans-serif' }}>
                  {(b.label||'').slice(0,10)}
                </text>
                <text x={bx} y={by+8} textAnchor="middle" fontSize="8" fill={b.color} fillOpacity="0.7">
                  {b.children?.length||0} sub-topics
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected branch detail */}
      {selBranch !== null && branches[selBranch] && (
        <div className="glass-sm fu" style={{ padding:18 }}>
          <h4 className="syne" style={{ fontWeight:700,marginBottom:12,color:branches[selBranch].color }}>
            {branches[selBranch].label}
          </h4>
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            {(branches[selBranch].children||[]).map((ch,i)=>(
              <span key={i} className="pill" style={{ background:`${branches[selBranch].color}18`,borderColor:`${branches[selBranch].color}44`,color:branches[selBranch].color }}>
                {ch}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Wallpaper Generator ── */
const PALETTES = [
  { key:'cosmic',  label:'🌌 Cosmic',  colors:['#6366f1','#22d3ee','#a855f7'] },
  { key:'ocean',   label:'🌊 Ocean',   colors:['#0ea5e9','#06b6d4','#3b82f6'] },
  { key:'forest',  label:'🌿 Forest',  colors:['#10b981','#34d399','#6ee7b7'] },
  { key:'fire',    label:'🔥 Fire',    colors:['#f97316','#ef4444','#facc15'] },
  { key:'mono',    label:'⬛ Mono',    colors:['#ffffff','#d4d4d4','#737373'] },
]

function WallpaperTab({ subject, keyTerms }) {
  const [palette, setPalette] = useState('cosmic')
  const [svg, setSvg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const resp = await fetch('/api/wallpaper', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ subject, keyTerms, palette })
      })
      const json = await resp.json()
      if (json.ok) setSvg(json.svg)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function download() {
    if (!svg) return
    const blob = new Blob([svg], { type:'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${subject}-wallpaper.svg`; a.click()
    URL.revokeObjectURL(url)
  }

  const pal = PALETTES.find(p=>p.key===palette)

  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:20 }}>
      <div className="glass" style={{ padding:24 }}>
        <h3 className="syne" style={{ fontWeight:700,fontSize:17,marginBottom:6 }}>🎨 AI Study Wallpaper Generator</h3>
        <p style={{ color:'var(--muted)',fontSize:14,marginBottom:20 }}>
          Generate a 1920×1080 desktop wallpaper themed around your lecture — downloadable as SVG.
        </p>

        {/* Palette selector */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:12,fontWeight:700,letterSpacing:1,color:'var(--muted)',textTransform:'uppercase',marginBottom:10 }}>Choose Palette</p>
          <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
            {PALETTES.map(p => (
              <button key={p.key} onClick={()=>setPalette(p.key)} className={`pal-btn ${palette===p.key?'active':''}`}
                style={{ display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ display:'flex',gap:4 }}>
                  {p.colors.map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:'50%',background:c }}/>)}
                </div>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
          <RippleBtn onClick={generate} className="btn-grad" disabled={loading}
            style={{ padding:'13px 28px',borderRadius:14,fontSize:14,display:'flex',alignItems:'center',gap:8 }}>
            {loading?<><Dots/><span>Generating…</span></>:<>🎨 Generate Wallpaper</>}
          </RippleBtn>
          {svg && (
            <button onClick={download} style={{ padding:'13px 28px',borderRadius:14,border:'1.5px solid rgba(99,102,241,.4)',background:'transparent',color:'#6366f1',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',gap:8 }}>
              ⬇ Download SVG
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {svg ? (
        <div className="glass" style={{ padding:16,overflow:'hidden',borderRadius:20 }}>
          <p style={{ fontSize:12,color:'var(--muted)',marginBottom:10 }}>Preview (1920×1080) · Click to zoom</p>
          <div
            style={{ borderRadius:14,overflow:'hidden',border:'1px solid var(--border)',cursor:'zoom-in' }}
            onClick={() => { const w=window.open('','_blank'); w.document.write(`<body style="margin:0;background:#000"><img src="data:image/svg+xml,${encodeURIComponent(svg)}" style="width:100%;height:100vh;object-fit:contain"/></body>`) }}
          >
            <img src={`data:image/svg+xml,${encodeURIComponent(svg)}`} alt="wallpaper preview" style={{ width:'100%',display:'block' }}/>
          </div>
        </div>
      ) : (
        <div className="glass" style={{ padding:40,textAlign:'center',borderStyle:'dashed' }}>
          <div style={{ fontSize:48,marginBottom:12 }}>🎨</div>
          <p style={{ color:'var(--muted)' }}>Your wallpaper will appear here — click Generate to start</p>
        </div>
      )}
    </div>
  )
}

/* ── Poem ── */
function PoemTab({ poem, subject, keyPoints }) {
  const [text, setText] = useState(poem)
  const [loading, setLoading] = useState(false)

  async function regenerate() {
    setLoading(true)
    try {
      const resp = await fetch('/api/poem', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ subject, keyPoints })
      })
      const json = await resp.json()
      if (json.ok) setText(json.poem)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  function copy() {
    navigator.clipboard.writeText(text||'')
    alert('Poem copied to clipboard! 📋')
  }

  const lines = (text||'').split('\n').filter(l=>l.trim())

  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:20 }}>
      <div className="glass" style={{ padding:28 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,flexWrap:'wrap',gap:12 }}>
          <div>
            <h3 className="syne" style={{ fontWeight:700,fontSize:17,marginBottom:4 }}>📜 AI Mnemonic Poem</h3>
            <p style={{ color:'var(--muted)',fontSize:13 }}>A rhyming poem to help you remember the key ideas</p>
          </div>
          <div style={{ display:'flex',gap:10 }}>
            <RippleBtn onClick={regenerate} className="btn-grad" disabled={loading}
              style={{ padding:'9px 18px',borderRadius:12,fontSize:13,display:'flex',alignItems:'center',gap:6 }}>
              {loading?<Dots/>:<>✨ Regenerate</>}
            </RippleBtn>
            <button onClick={copy} style={{ padding:'9px 18px',borderRadius:12,border:'1.5px solid rgba(99,102,241,.4)',background:'transparent',color:'#6366f1',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13,cursor:'pointer' }}>
              📋 Copy
            </button>
          </div>
        </div>

        <div style={{
          background:'linear-gradient(135deg,rgba(99,102,241,.08),rgba(168,85,247,.06))',
          border:'1px solid rgba(99,102,241,.2)', borderRadius:16, padding:28,
        }}>
          {lines.map((line, i) => (
            <p key={i} className="poem-line syne" style={{
              fontSize:17, lineHeight:1.9, fontWeight:500,
              animationDelay:`${i*0.12}s`, animationFillMode:'forwards',
              color: i % 2 === 0 ? 'var(--fg)' : 'var(--muted)',
              marginBottom: i === lines.length-1 ? 0 : 4,
            }}>{line}</p>
          ))}
        </div>
      </div>

      <div className="glass-sm" style={{ padding:18 }}>
        <p style={{ fontSize:12,color:'var(--muted)',lineHeight:1.7 }}>
          💡 <strong style={{ color:'var(--fg)' }}>How to use this poem:</strong> Read it aloud 3 times before your exam. Rhyming structures activate different memory pathways than plain facts. You can also set it as your phone wallpaper or sticky note!
        </p>
      </div>
    </div>
  )
}

/* ── Pomodoro Timer ── */
function PomodoroTab() {
  const [mode, setMode] = useState('work')   // work | short | long
  const [timeLeft, setTimeLeft] = useState(25*60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [total, setTotal] = useState(0)
  const intervalRef = useRef(null)

  const MODES = {
    work:  { label:'🍅 Focus', mins:25, color:'#6366f1' },
    short: { label:'☕ Short Break', mins:5, color:'#22d3ee' },
    long:  { label:'🌴 Long Break', mins:15, color:'#10b981' },
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (mode === 'work') { setSessions(s=>s+1); setTotal(t2=>t2+25) }
            try { new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAA==').play() } catch {}
            return 0
          }
          return t-1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function setModeAndReset(m) {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    setTimeLeft(MODES[m].mins * 60)
  }

  const mm = MODES[mode]
  const mins = String(Math.floor(timeLeft/60)).padStart(2,'0')
  const secs = String(timeLeft%60).padStart(2,'0')
  const pct = ((mm.mins*60-timeLeft)/(mm.mins*60))*100
  const circumference = 2*Math.PI*110

  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:24,padding:'20px 0' }}>
      {/* Mode selector */}
      <div className="glass-sm" style={{ display:'flex',gap:6,padding:6 }}>
        {Object.entries(MODES).map(([k,v])=>(
          <button key={k} onClick={()=>setModeAndReset(k)} style={{
            padding:'9px 16px',borderRadius:10,border:'none',cursor:'pointer',
            background: mode===k?v.color:'transparent',
            color: mode===k?'#fff':'var(--muted)',
            fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,transition:'all .25s',
          }}>{v.label}</button>
        ))}
      </div>

      {/* Circular timer */}
      <div style={{ position:'relative',width:260,height:260 }} className={running?'timer-active':''}>
        <svg width="260" height="260" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="12"/>
          <circle cx="130" cy="130" r="110" fill="none" stroke={mm.color} strokeWidth="12"
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={circumference*(1-pct/100)}
            transform="rotate(-90 130 130)"
            style={{ transition:'stroke-dashoffset .5s ease',filter:`drop-shadow(0 0 12px ${mm.color})` }}/>
        </svg>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center' }}>
          <div className="mono" style={{ fontSize:52,fontWeight:700,color:'var(--fg)',letterSpacing:2 }}>{mins}:{secs}</div>
          <div className="syne" style={{ fontSize:13,color:mm.color,fontWeight:700,marginTop:4 }}>{mm.label}</div>
          <div style={{ fontSize:11,color:'var(--muted)',marginTop:4 }}>Session {sessions+1}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex',gap:14,alignItems:'center' }}>
        <button onClick={()=>setModeAndReset(mode)} style={{ width:44,height:44,borderRadius:'50%',border:'1.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontSize:18 }}>↺</button>
        <RippleBtn onClick={()=>setRunning(r=>!r)} className="btn-grad"
          style={{ width:68,height:68,borderRadius:'50%',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center' }}>
          {running?'⏸':'▶'}
        </RippleBtn>
        <button onClick={()=>{clearInterval(intervalRef.current);setRunning(false);setTimeLeft(mm.mins*60)}} style={{ width:44,height:44,borderRadius:'50%',border:'1.5px solid var(--border)',background:'transparent',color:'var(--muted)',cursor:'pointer',fontSize:18 }}>⏹</button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,width:'100%',maxWidth:380 }}>
        {[
          {label:'Sessions Done',val:sessions,col:'#6366f1'},
          {label:'Focus Minutes',val:total,col:'#22d3ee'},
          {label:'Next Break',val:sessions%4===3?'Long':'Short',col:'#10b981'},
        ].map(s=>(
          <div key={s.label} className="glass-sm" style={{ padding:'14px',textAlign:'center' }}>
            <div className="mono" style={{ fontSize:22,fontWeight:700,color:s.col,marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:11,color:'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-sm" style={{ padding:16,maxWidth:380,width:'100%' }}>
        <p style={{ fontSize:12,color:'var(--muted)',lineHeight:1.7,textAlign:'center' }}>
          💡 Work 4 focus sessions → earn a long break. Study shows 25-min focused intervals dramatically improve retention and reduce mental fatigue.
        </p>
      </div>
    </div>
  )
}

/* ── Hard Topics ── */
function HardTopicsTab({ data }) {
  if (!data?.topics?.length) return null
  const cols = [{a:'#ec4899',b:'#f97316',l:'Very Hard'},{a:'#f97316',b:'#facc15',l:'Hard'},{a:'#a855f7',b:'#6366f1',l:'Moderate'}]
  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <p style={{ color:'var(--muted)',fontSize:14 }}>AI detected <strong style={{ color:'var(--fg)' }}>{data.topics.length}</strong> challenging topics based on conceptual density analysis.</p>
      {data.topics.map((t,i) => {
        const c=cols[Math.min(i,2)]
        return (
          <div key={i} className={`glass chov fu d${Math.min(i+1,5)}`} style={{ padding:22,opacity:0,animationFillMode:'forwards' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12,flexWrap:'wrap',gap:8 }}>
              <div style={{ display:'flex',gap:10,alignItems:'center' }}>
                <span style={{ padding:'3px 10px',borderRadius:8,fontSize:11,fontWeight:700,background:`linear-gradient(135deg,${c.a},${c.b})`,color:'#fff' }}>{c.l}</span>
                <h4 className="syne" style={{ fontWeight:700,fontSize:16 }}>{t.name}</h4>
              </div>
              <span className="mono" style={{ fontSize:13,color:'var(--muted)' }}>{t.difficulty}/10</span>
            </div>
            <p style={{ color:'var(--muted)',fontSize:14,lineHeight:1.72,marginBottom:14 }}>{t.reason}</p>
            <div style={{ marginBottom:14 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--muted)',marginBottom:6 }}><span>Complexity</span><span className="mono" style={{ color:c.a }}>{t.difficulty*10}%</span></div>
              <div className="bar-track"><div style={{ height:'100%',width:`${t.difficulty*10}%`,background:`linear-gradient(90deg,${c.a},${c.b})`,borderRadius:10,transition:`width 1.2s ${i*.15}s cubic-bezier(.34,1.56,.64,1)` }}/></div>
            </div>
            <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
              {t.tips.map((tip,j)=><span key={j} className="pill" style={{ background:'rgba(99,102,241,.12)',borderColor:'rgba(99,102,241,.22)',color:'#6366f1' }}>{tip}</span>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Study Plan ── */
function StudyPlanTab({ data }) {
  const [sel, setSel] = useState(0)
  if (!data?.days?.length) return null
  const DC=['#6366f1','#8b5cf6','#a855f7','#c026d3','#db2777','#e11d48','#f97316']
  function toGCal(day) {
    const base='https://calendar.google.com/calendar/render?action=TEMPLATE'
    const title=encodeURIComponent(`📚 LectureMind: Day ${day.day} – ${day.theme}`)
    const details=encodeURIComponent(day.blocks.map(b=>`• ${b.topic} (${b.time}): ${b.activity}`).join('\n'))
    window.open(`${base}&text=${title}&details=${details}`,'_blank')
  }
  const day=data.days[sel]
  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:18 }}>
      <div style={{ display:'flex',gap:8,overflowX:'auto',paddingBottom:4 }}>
        {data.days.map((d,i)=>(
          <button key={i} onClick={()=>setSel(i)} style={{ flexShrink:0,padding:'10px 16px',borderRadius:14,border:`1.5px solid ${sel===i?DC[i]:'var(--border)'}`,background:sel===i?`${DC[i]}22`:'var(--surf)',color:sel===i?DC[i]:'var(--muted)',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,transition:'all .25s',minWidth:72,textAlign:'center' }}>
            <div style={{ fontSize:9,letterSpacing:1,opacity:.7,marginBottom:2 }}>DAY</div>{d.day}
          </button>
        ))}
      </div>
      <div className="glass" style={{ padding:26 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22,flexWrap:'wrap',gap:12 }}>
          <div>
            <span style={{ display:'inline-block',padding:'3px 12px',borderRadius:100,background:`${DC[sel]}22`,color:DC[sel],fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:8 }}>DAY {day.day}</span>
            <h3 className="syne" style={{ fontSize:19,fontWeight:700 }}>{day.theme}</h3>
          </div>
          <div style={{ textAlign:'right' }}><div style={{ fontSize:11,color:'var(--muted)',marginBottom:4 }}>Total time</div><div className="mono" style={{ color:'#22d3ee',fontWeight:600 }}>{day.totalTime}</div></div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:16,marginBottom:24 }}>
          {day.blocks.map((b,i)=>(
            <div key={i} style={{ display:'flex',gap:14,alignItems:'flex-start' }}>
              <div className="tdot" style={{ marginTop:5,background:`linear-gradient(135deg,${DC[sel]},${DC[(sel+1)%7]})` }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4,flexWrap:'wrap',gap:4 }}><span style={{ fontWeight:600,fontSize:15 }}>{b.topic}</span><span className="mono" style={{ fontSize:12,color:'var(--muted)' }}>{b.time}</span></div>
                <p style={{ fontSize:13,color:'var(--muted)',lineHeight:1.68 }}>{b.activity}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
          <RippleBtn onClick={()=>toGCal(day)} className="btn-grad rw" style={{ padding:'11px 22px',borderRadius:12,fontSize:13,display:'flex',alignItems:'center',gap:7 }}>📅 Add to Google Calendar</RippleBtn>
          <button onClick={()=>data.days.forEach((d,i)=>setTimeout(()=>toGCal(d),i*400))} style={{ padding:'11px 22px',borderRadius:12,border:'1.5px solid rgba(99,102,241,.4)',background:'transparent',color:'#6366f1',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:7,transition:'all .2s' }}>📆 Export Full Week</button>
        </div>
      </div>
    </div>
  )
}

/* ── Videos ── */
function VideosTab({ data }) {
  if (!data?.videos?.length) return null
  const BG=['linear-gradient(135deg,#6366f1,#22d3ee)','linear-gradient(135deg,#a855f7,#ec4899)','linear-gradient(135deg,#f97316,#facc15)']
  return (
    <div className="tab-content" style={{ display:'flex',flexDirection:'column',gap:16 }}>
      <p style={{ color:'var(--muted)',fontSize:14 }}>AI-curated videos targeting your hardest topics — watch before Day 1.</p>
      {data.videos.map((v,i)=>(
        <div key={i} className={`glass chov fu d${i+1}`} style={{ overflow:'hidden',opacity:0,animationFillMode:'forwards' }}>
          <div style={{ display:'flex',flexWrap:'wrap' }}>
            <div style={{ width:180,minHeight:115,flexShrink:0,background:BG[i],display:'flex',alignItems:'center',justifyContent:'center',position:'relative' }}>
              <span style={{ fontSize:36 }}>▶️</span>
              <div style={{ position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,.7)',padding:'2px 7px',borderRadius:4,fontSize:11,color:'#fff',fontFamily:'JetBrains Mono,monospace' }}>{v.duration}</div>
            </div>
            <div style={{ flex:1,padding:'18px 20px',display:'flex',flexDirection:'column',justifyContent:'space-between',minWidth:0 }}>
              <div>
                <span style={{ fontSize:10,color:'#6366f1',fontWeight:700,letterSpacing:1.5,textTransform:'uppercase' }}>Video {i+1}</span>
                <h4 className="syne" style={{ fontSize:15,fontWeight:700,margin:'6px 0 8px',lineHeight:1.45 }}>{v.title}</h4>
                <p style={{ fontSize:13,color:'var(--muted)',lineHeight:1.65 }}>{v.description}</p>
              </div>
              <div style={{ display:'flex',gap:10,marginTop:14,alignItems:'center',flexWrap:'wrap' }}>
                <a href={v.url} target="_blank" rel="noreferrer" style={{ padding:'9px 18px',borderRadius:10,background:'linear-gradient(135deg,#6366f1,#22d3ee)',color:'#fff',textDecoration:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,display:'inline-flex',alignItems:'center',gap:6,transition:'transform .2s,box-shadow .2s' }} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,.5)'}} onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>▶ Watch Now</a>
                <span style={{ fontSize:12,color:'var(--muted)' }}>via {v.channel}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR + RIGHT PANEL
═══════════════════════════════════════════════════════════════════════════ */
const ALL_TABS = [
  { key:'summary',    icon:'📋', label:'Summary'    },
  { key:'quiz',       icon:'🎯', label:'Quiz'       },
  { key:'flashcards', icon:'🃏', label:'Flashcards'  },
  { key:'mindmap',    icon:'🗺', label:'Mind Map'   },
  { key:'wallpaper',  icon:'🎨', label:'Wallpaper'  },
  { key:'poem',       icon:'📜', label:'Poem'       },
  { key:'pomodoro',   icon:'🍅', label:'Pomodoro'   },
  { key:'hardTopics', icon:'🔥', label:'Hard Topics' },
  { key:'studyPlan',  icon:'📅', label:'Study Plan'  },
  { key:'videos',     icon:'🎥', label:'Videos'     },
]

function Sidebar({ tab, setTab, dark, toggleDark, count }) {
  return (
    <div className="glass" style={{ width:64,display:'flex',flexDirection:'column',alignItems:'center',padding:'12px 8px',gap:4,borderRadius:20,flexShrink:0 }}>
      <div style={{ width:36,height:36,borderRadius:10,marginBottom:8,background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:800,color:'#fff',boxShadow:'0 0 18px rgba(99,102,241,.5)' }}>L</div>
      {ALL_TABS.map(it=>(
        <button key={it.key} title={it.label} onClick={()=>setTab(it.key)} className={`sbi ${tab===it.key?'active':''}`}>{it.icon}</button>
      ))}
      <div style={{ flex:1 }}/>
      <div title="Sessions" style={{ width:36,height:36,borderRadius:10,background:'rgba(34,211,238,.12)',border:'1px solid rgba(34,211,238,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'JetBrains Mono,monospace',fontSize:13,fontWeight:700,color:'#22d3ee',marginBottom:4 }}>{count}</div>
      <button className="sbi" onClick={toggleDark} title="Toggle theme" style={{ fontSize:16 }}>{dark?'☀️':'🌙'}</button>
    </div>
  )
}

function RightPanel({ results, recent }) {
  return (
    <div style={{ width:210,flexShrink:0,display:'flex',flexDirection:'column',gap:12 }}>
      <div className="glass-sm" style={{ padding:18 }}>
        <p style={{ fontSize:10,fontWeight:700,color:'var(--muted)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14 }}>AI Confidence</p>
        {results.hardTopics.topics.map((t,i)=>{
          const cols=['#ec4899','#f97316','#a855f7']
          return (
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5 }}>
                <span style={{ color:'var(--muted)',maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{t.name}</span>
                <span className="mono" style={{ color:cols[i],flexShrink:0 }}>{t.difficulty*10}%</span>
              </div>
              <div className="bar-track"><div style={{ height:'100%',width:`${t.difficulty*10}%`,background:`linear-gradient(90deg,${cols[i]},${cols[(i+1)%3]})`,borderRadius:10,transition:`width 1.2s ${i*.15}s cubic-bezier(.34,1.56,.64,1)` }}/></div>
            </div>
          )
        })}
      </div>
      <div className="glass-sm" style={{ padding:18 }}>
        <p style={{ fontSize:10,fontWeight:700,color:'var(--muted)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14 }}>Recent Uploads</p>
        {recent.map((r,i)=>(
          <div key={i} style={{ display:'flex',gap:8,alignItems:'center',marginBottom:8,padding:'7px 9px',borderRadius:10,background:'rgba(255,255,255,.04)' }}>
            <span style={{ fontSize:13 }}>📄</span>
            <span style={{ fontSize:11,color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{r}</span>
          </div>
        ))}
      </div>
      <div className="glass-sm" style={{ padding:18 }}>
        <p style={{ fontSize:10,fontWeight:700,color:'var(--muted)',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14 }}>Quick Stats</p>
        {[
          {l:'Key Points',v:results.summary.keyPoints.length,c:'#6366f1'},
          {l:'Quiz Qs',v:results.quiz.questions.length,c:'#22d3ee'},
          {l:'Flashcards',v:results.flashcards?.length||8,c:'#a855f7'},
          {l:'Study Days',v:results.studyPlan.days.length,c:'#ec4899'},
          {l:'Videos',v:results.videos.videos.length,c:'#f97316'},
        ].map(s=>(
          <div key={s.l} style={{ display:'flex',justifyContent:'space-between',marginBottom:10,fontSize:13 }}>
            <span style={{ color:'var(--muted)' }}>{s.l}</span>
            <span className="mono" style={{ color:s.c,fontWeight:700 }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
const RECENT = ['Intro to ML.pdf','NLP Lecture 3.pdf','CV Basics.pdf']

export default function App() {
  const [dark,    setDark]    = useState(true)
  const [screen,  setScreen]  = useState('upload')
  const [tab,     setTab]     = useState('summary')
  const [stage,   setStage]   = useState(0)
  const [progress,setProgress]= useState(0)
  const [results, setResults] = useState(null)
  const [fileName,setFileName]= useState('')
  const [uploads, setUploads] = useState(3)
  const [error,   setError]   = useState(null)

  useEffect(()=>{ injectCSS() },[])
  useEffect(()=>{ document.body.className=dark?'':'lm-light' },[dark])

  async function handleUpload(file, isDemo) {
    setError(null)
    const name = isDemo ? 'Demo: Machine Learning' : (file?.name||'lecture.pdf')
    setFileName(name); setScreen('processing'); setProgress(0); setStage(0)

    if (isDemo) {
      for (let i=0;i<=9;i++) { await new Promise(r=>setTimeout(r,320)); setStage(i); setProgress(Math.round(i/9*100)) }
      await new Promise(r=>setTimeout(r,400))
      setResults(DEMO); setUploads(u=>u+1); setScreen('dashboard'); setTab('summary')
      return
    }

    try {
      setStage(1); setProgress(10)
      const form = new FormData()
      form.append('file', file)
      setStage(3); setProgress(30)
      const resp = await fetch('/api/analyze', { method:'POST', body:form })
      setStage(6); setProgress(70)
      if (!resp.ok) {
        const err = await resp.json().catch(()=>({detail:resp.statusText}))
        throw new Error(err.detail || `Server error ${resp.status}`)
      }
      const json = await resp.json()
      setStage(9); setProgress(100)
      await new Promise(r=>setTimeout(r,500))
      setResults(json.data); setUploads(u=>u+1); setScreen('dashboard'); setTab('summary')
    } catch(e) {
      setError(e.message||String(e)); setScreen('upload')
    }
  }

  const Bg = () => <><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></>

  if (screen==='upload') return (
    <div style={{ position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <Bg/>
      <nav style={{ position:'relative',zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 24px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,fontWeight:800,color:'#fff' }}>L</div>
          <span className="syne" style={{ fontSize:17,fontWeight:800 }}>LectureMind</span>
          <span style={{ padding:'3px 8px',borderRadius:6,background:'rgba(99,102,241,.15)',fontSize:10,color:'#6366f1',fontWeight:700 }}>v2 · Python</span>
        </div>
        <button onClick={()=>setDark(d=>!d)} style={{ padding:'8px 16px',borderRadius:10,border:'1px solid var(--border)',background:'var(--surf)',color:'var(--fg)',cursor:'pointer',fontSize:13,fontFamily:'DM Sans,sans-serif' }}>{dark?'☀️ Light':'🌙 Dark'}</button>
      </nav>
      <div style={{ position:'relative',zIndex:1,flex:1,display:'flex',flexDirection:'column',justifyContent:'center' }}>
        {error&&<div className="err" style={{ margin:'0 auto 20px',maxWidth:600,width:'90%' }}><strong>⚠️ Error:</strong> {error}</div>}
        <UploadScreen onUpload={handleUpload}/>
      </div>
    </div>
  )

  if (screen==='processing') return (
    <div style={{ position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <Bg/>
      <div style={{ position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:10,padding:'16px 22px' }}>
        <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#22d3ee)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff' }}>L</div>
        <span className="syne" style={{ fontSize:16,fontWeight:800 }}>LectureMind</span>
      </div>
      <div style={{ position:'relative',zIndex:1,flex:1 }}><ProcessingScreen stage={stage} progress={progress} fileName={fileName}/></div>
    </div>
  )

  if (screen==='dashboard' && results) return (
    <div style={{ position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <Bg/>
      <div style={{ position:'relative',zIndex:1,flex:1,display:'flex',gap:12,padding:14,maxWidth:1180,margin:'0 auto',width:'100%',alignItems:'flex-start' }}>
        <Sidebar tab={tab} setTab={setTab} dark={dark} toggleDark={()=>setDark(d=>!d)} count={uploads}/>
        <div style={{ flex:1,display:'flex',flexDirection:'column',gap:12,minWidth:0 }}>
          {/* Header */}
          <div className="glass" style={{ padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10 }}>
            <div>
              <h2 className="syne" style={{ fontWeight:800,fontSize:17,marginBottom:3 }}>{fileName.replace(/\.pdf$/i,'')}</h2>
              <p style={{ fontSize:12,color:'var(--muted)' }}>
                {results.subject&&<><span style={{ color:'#6366f1',fontWeight:600 }}>{results.subject}</span> · </>}
                {results.quiz.questions.length} questions · {results.flashcards?.length||8} flashcards · {results.studyPlan.days.length}-day plan
              </p>
            </div>
            <RippleBtn onClick={()=>{setScreen('upload');setResults(null);setError(null)}} className="rw"
              style={{ padding:'9px 16px',borderRadius:10,border:'1.5px solid rgba(99,102,241,.4)',background:'transparent',color:'#6366f1',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,cursor:'pointer' }}>
              ↑ Upload New PDF
            </RippleBtn>
          </div>

          {/* Tab bar */}
          <div className="glass" style={{ padding:6,display:'flex',gap:3,overflowX:'auto' }}>
            {ALL_TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} style={{ padding:'8px 13px',borderRadius:11,flexShrink:0,border:'none',cursor:'pointer',background:tab===t.key?'linear-gradient(135deg,rgba(99,102,241,.28),rgba(34,211,238,.14))':'transparent',color:tab===t.key?'var(--fg)':'var(--muted)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,borderBottom:tab===t.key?'2px solid #6366f1':'2px solid transparent',transition:'all .25s',display:'flex',alignItems:'center',gap:5 }}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={tab} style={{ flex:1,overflowY:'auto',paddingBottom:20 }}>
            {tab==='summary'    && <SummaryTab    data={results.summary}/>}
            {tab==='quiz'       && <QuizTab       data={results.quiz}/>}
            {tab==='flashcards' && <FlashcardsTab data={results.flashcards} subject={results.subject||fileName}/>}
            {tab==='mindmap'    && <MindMapTab    data={results.mindmap} subject={results.subject||fileName} overview={results.summary?.overview||''}/>}
            {tab==='wallpaper'  && <WallpaperTab  subject={results.subject||fileName} keyTerms={(results.flashcards||[]).map(f=>f.front)}/>}
            {tab==='poem'       && <PoemTab       poem={results.poem} subject={results.subject||fileName} keyPoints={results.summary?.keyPoints||[]}/>}
            {tab==='pomodoro'   && <PomodoroTab/>}
            {tab==='hardTopics' && <HardTopicsTab data={results.hardTopics}/>}
            {tab==='studyPlan'  && <StudyPlanTab  data={results.studyPlan}/>}
            {tab==='videos'     && <VideosTab     data={results.videos}/>}
          </div>
        </div>
        <RightPanel results={results} recent={RECENT}/>
      </div>
    </div>
  )

  return null
}

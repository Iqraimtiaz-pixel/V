import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   VibeZ — AI-Powered Chat Platform
   • Gemini AI integration (Google API)
   • Full ID creation pipeline with verification steps
   • Enterprise privacy, Vanish mode, Anonymous reveal
   • Dark glass morphism — Electric purple
═══════════════════════════════════════════════════════════════ */

const GEMINI_KEY = "AIzaSyA9yc3r7LAewghJM_V-g28YkuEBn9Vg-9s";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

/* ── Call Gemini API ── */
async function callGemini(prompt, systemPrompt = "") {
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
        generationConfig: { temperature: 0.85, maxOutputTokens: 400 }
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't respond right now.";
  } catch {
    return "Connection error. Please try again.";
  }
}

/* ══════════════ ID SYSTEM ══════════════
   VibeZ ID = @prefix.handle#tag
   Example: @vibe.shadowfox#4721
   Steps: choose handle → pick tag → verify → create
   Every ID is unique, cryptographically tagged
══════════════════════════════════════════ */
const generateTag = () => String(Math.floor(1000 + Math.random() * 9000));
const generateUID = () => crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().slice(0,8);
const ID_PREFIXES = ["vibe", "nova", "echo", "neon", "myst", "blaz", "strm", "drft", "flux", "void"];

/* ── Reserved / taken IDs (simulated) ── */
const TAKEN_IDS = new Set(["shadowfox","ghostwolf","nebularaven","cosmichawk","neonstorm","vibetiger"]);

/* ── Validate handle rules ── */
function validateHandle(handle) {
  if (!handle) return { ok: false, msg: "Handle cannot be empty" };
  if (handle.length < 3) return { ok: false, msg: "Minimum 3 characters required" };
  if (handle.length > 20) return { ok: false, msg: "Maximum 20 characters allowed" };
  if (!/^[a-z0-9_]+$/.test(handle)) return { ok: false, msg: "Only lowercase letters, numbers, underscores" };
  if (/^_|_$/.test(handle)) return { ok: false, msg: "Cannot start or end with underscore" };
  if (/__/.test(handle)) return { ok: false, msg: "No consecutive underscores" };
  if (TAKEN_IDS.has(handle)) return { ok: false, msg: "This ID is already taken — try another" };
  return { ok: true, msg: "✓ Available!" };
}

/* ── Password strength ── */
function checkPassword(p) {
  const rules = [
    { test: p.length >= 8,            msg: "8+ characters" },
    { test: /[A-Z]/.test(p),          msg: "Uppercase letter" },
    { test: /[a-z]/.test(p),          msg: "Lowercase letter" },
    { test: /[0-9]/.test(p),          msg: "Number" },
    { test: /[^A-Za-z0-9]/.test(p),   msg: "Special character (!@#$...)" },
  ];
  const passed = rules.filter(r => r.test).length;
  const strength = passed <= 1 ? "Weak" : passed <= 3 ? "Fair" : passed === 4 ? "Good" : "Strong";
  const color = passed <= 1 ? "#ef4444" : passed <= 3 ? "#f59e0b" : passed === 4 ? "#3b82f6" : "#10b981";
  return { rules, passed, strength, color, pct: (passed / 5) * 100 };
}

const uid = () => Math.random().toString(36).slice(2, 9);

const EMOJIS=["😀","😂","🥰","😎","🤔","😭","🥳","😤","😇","🤗","😜","🫡","🙄","😮","😴","🤯","🥺","😏","😈","🤩","😶","🫥","🙃","🤐","😑","😒","🧐","🥸","😬","🫶","🔥","💯","✨","💜","⚡","🎯","🎵","🌙","🦋","💎"];
const STICKERS=["🎉","🔥","💯","✨","🌸","💎","🎮","🎵","🦋","🌈","🍀","⚡","🌙","🎯","🫶","🤌","💫","🎊","🌺","🏆","🦄","🌊","🧠","🎨","🚀","👑","🐉","🔮","🦁","🌟"];
const QUICK_RXN=["❤️","😂","😮","😢","😡","👍","🔥","🫶"];
const AVATARS=["😎","🦋","🌸","💎","🎵","🎮","🌙","⚡","🎯","💫","🌈","🦊","🐺","🦅","🐯","🚀","🧠","🎨","🦄","🌊","👑","🐉","🌺","🍀","🔮","🦁","🐬","🦩","🌟","🎭"];

const WALLPAPERS=[
  {id:"w1",name:"Deep Space",bg:"#050210",css:"radial-gradient(ellipse at 25% 40%,#1a0533 0%,#050210 65%)"},
  {id:"w2",name:"Aurora",bg:"#060d1a",css:"linear-gradient(160deg,#0a1628,#1a0533 45%,#060d1a)"},
  {id:"w3",name:"Cosmic",bg:"#08040f",css:"radial-gradient(ellipse at 75% 25%,#200a40 0%,#08040f 65%)"},
  {id:"w4",name:"Void",bg:"#000",css:"linear-gradient(135deg,#0d0221,#130d2e 50%,#000)"},
  {id:"w5",name:"Nebula",bg:"#04091a",css:"radial-gradient(ellipse at 50% 80%,#0a1628 0%,#1a0533 40%,#04091a 70%)"},
];

const ANON_A=["Shadow","Ghost","Mystic","Cosmic","Neon","Blaze","Storm","Echo","Nova","Vibe"];
const ANON_N=["Fox","Wolf","Hawk","Bear","Tiger","Raven","Drake","Viper","Eagle","Lynx"];
const makeAnon=()=>`${ANON_A[Math.floor(Math.random()*10)]}${ANON_N[Math.floor(Math.random()*10)]}${Math.floor(Math.random()*99)}`;

/* ── Mock users with VibeZ IDs ── */
const USERS=[
  {id:"u1",vibeId:"@vibe.alexkhan#2341",username:"alexkhan",name:"Alex Khan",  avatar:"🎯",status:"online", bio:"Living life ✨"},
  {id:"u2",vibeId:"@nova.saramalik#8821",username:"saramalik",name:"Sara Malik", avatar:"💫",status:"online", bio:"Code & coffee ☕"},
  {id:"u3",vibeId:"@echo.zainbeats#5503",username:"zainbeats",name:"Zain Ahmed", avatar:"🎵",status:"away",   bio:"Music is life 🎶"},
  {id:"u4",vibeId:"@myst.noorart#1192", username:"noorart", name:"Noor Fatima",avatar:"🌸",status:"offline",bio:"Art & dreams 🎨"},
  {id:"u5",vibeId:"@flux.hamzadev#7730",username:"hamzadev",name:"Hamza Raza",  avatar:"🚀",status:"online", bio:"Building the future 💡"},
];

const NOW=Date.now();
const CHATS0=[
  {id:"c1",type:"dm",pid:"u2",vanishChat:false,msgs:[
    {id:"m1",from:"u2",kind:"text",body:"Hey! Just got on VibeZ — this is insane 🔥",ts:NOW-7200000,rxn:{"❤️":["me"]},seen:true,starred:false},
    {id:"m2",from:"me",kind:"text",body:"Right?! The AI assistant is actually helpful 😮",ts:NOW-7100000,rxn:{},seen:true,starred:false},
    {id:"m3",from:"u2",kind:"sticker",body:"🎉",ts:NOW-7000000,rxn:{},seen:true,starred:false},
    {id:"m4",from:"me",kind:"text",body:"Try asking the AI anything in chat!",ts:NOW-600000,rxn:{"😂":["u2"]},seen:true,starred:true},
  ],count:4,revealed:false,wallpaper:"w1",muted:false,pinned:true},
  {id:"c2",type:"dm",pid:"u3",vanishChat:false,msgs:[
    {id:"m5",from:"u3",kind:"text",body:"Wanna hear my new track? 🎵",ts:NOW-86400000,rxn:{},seen:true,starred:false},
    {id:"m6",from:"me",kind:"text",body:"Absolutely! Drop the link 🎧",ts:NOW-86000000,rxn:{},seen:true,starred:false},
  ],count:2,revealed:false,wallpaper:"w3",muted:false,pinned:false},
  {id:"c3",type:"group",name:"Dev Squad 🚀",avatar:"🚀",members:["me","u1","u2","u3","u5"],vanishChat:false,msgs:[
    {id:"m7",from:"system",kind:"system",body:"Dev Squad 🚀 was created",ts:NOW-172800000,rxn:{},seen:true,starred:false},
    {id:"m8",from:"u2",kind:"text",body:"Welcome everyone! The AI can help us code 🔥",ts:NOW-172000000,rxn:{"🔥":["me","u3"]},seen:true,starred:false},
    {id:"m9",from:"me",kind:"text",body:"Let's build something legendary 💪",ts:NOW-3600000,rxn:{},seen:true,starred:false},
  ],count:3,revealed:true,wallpaper:"w2",muted:false,pinned:false},
];
const FREQS0=[
  {id:"r1",from:"u1",to:"me",status:"pending",ts:NOW-300000},
  {id:"r2",from:"u5",to:"me",status:"pending",ts:NOW-60000},
];
const DEF_PRIV={
  lastSeen:"everyone",profilePhoto:"everyone",about:"everyone",status:"everyone",
  readReceipts:true,groups:"contacts",liveLocation:"nobody",
  defaultMsgTimer:"off",fingerprintLock:false,twoStep:false,
  screenSecurity:true,blocked:[],messageForwarding:true,linkPreviews:true,
  dataCollection:false,analyticsSharing:false,encryptionEnabled:true,
  autoDelete:"off",disappearingMsgDefault:false,ipAddressProtection:true,
  proxyConnection:false,advancedEncryption:true,
};

/* ═══════════════════════ CSS ═══════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}

@keyframes fadeIn    {from{opacity:0}to{opacity:1}}
@keyframes slideUp   {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR    {from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes slideL    {from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes popIn     {from{transform:scale(.65);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes floatY    {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes glowPulse {0%,100%{box-shadow:0 0 24px rgba(139,92,246,.3)}50%{box-shadow:0 0 52px rgba(139,92,246,.65)}}
@keyframes msgIn     {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes loadBar   {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes callPulse {0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%{box-shadow:0 0 0 22px rgba(239,68,68,0)}}
@keyframes vanish    {0%{opacity:1;transform:scale(1)}80%{opacity:.3;transform:scale(.95)}100%{opacity:0;transform:scale(.88)}}
@keyframes typewriter{from{width:0}to{width:100%}}
@keyframes blink     {0%,100%{opacity:1}50%{opacity:0}}
@keyframes checkIn   {from{transform:scale(0) rotate(-180deg)}to{transform:scale(1) rotate(0)}}
@keyframes revealIn  {0%{opacity:0;transform:scale(.8)}70%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
@keyframes shimmer   {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes dotPulse  {0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
@keyframes idGlow    {0%,100%{text-shadow:0 0 8px rgba(139,92,246,.4)}50%{text-shadow:0 0 20px rgba(139,92,246,.9),0 0 40px rgba(244,114,182,.4)}}
@keyframes stepIn    {from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes successPop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}

/* ROOT */
.vz{max-width:430px;margin:0 auto;height:100vh;background:#080612;display:flex;flex-direction:column;overflow:hidden;position:relative;font-family:'Inter',sans-serif;box-shadow:0 0 80px rgba(139,92,246,.12);}

/* SPLASH */
.spl{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 40% 35%,#1e0b3d 0%,#080612 65%);}
.spl-logo{width:120px;height:120px;border-radius:36px;background:linear-gradient(135deg,#7c3aed,#8b5cf6,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:68px;animation:floatY 3s ease-in-out infinite,glowPulse 3s ease-in-out infinite;}
.spl-name{font-family:'Syne',sans-serif;font-size:50px;font-weight:800;background:linear-gradient(135deg,#c4b5fd,#fff,#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-top:22px;letter-spacing:-2px;}
.spl-tag{font-size:12px;color:#6b5f8a;letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-top:7px;}
.spl-bar{width:140px;height:2px;background:#1a1535;border-radius:2px;margin-top:64px;overflow:hidden;}
.spl-prog{height:100%;background:linear-gradient(90deg,#7c3aed,#f472b6,#8b5cf6);background-size:200% 100%;animation:loadBar 1.8s ease-in-out infinite;}

/* ═══ ID CREATION FLOW ═══ */
.id-bg{min-height:100vh;background:radial-gradient(ellipse at 50% 0%,#2a1060 0%,#080612 55%);display:flex;flex-direction:column;overflow:hidden;}
.id-flow{flex:1;overflow-y:auto;padding-bottom:20px;}

/* Step progress bar */
.step-bar{display:flex;align-items:center;padding:16px 20px 12px;gap:0;position:relative;}
.step-node{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0;transition:all .3s;position:relative;z-index:2;}
.step-node.done{background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:white;box-shadow:0 0 16px rgba(139,92,246,.5);}
.step-node.active{background:linear-gradient(135deg,#8b5cf6,#c4b5fd);color:white;box-shadow:0 0 20px rgba(139,92,246,.7);animation:glowPulse 2s ease-in-out infinite;}
.step-node.pending{background:#17122e;border:2px solid #2a2050;color:#6b5f8a;}
.step-line{flex:1;height:2px;background:#1a1535;position:relative;margin:0 -2px;}
.step-line.done{background:linear-gradient(90deg,#7c3aed,#8b5cf6);}
.step-labels{display:flex;justify-content:space-between;padding:0 10px 16px;margin-top:-8px;}
.step-lbl{font-size:9px;font-weight:700;color:#6b5f8a;text-transform:uppercase;letter-spacing:.5px;width:56px;text-align:center;}
.step-lbl.active{color:#a78bfa;}

/* ID Card Preview */
.id-card{background:linear-gradient(135deg,#17122e,#1e1840);border:1px solid #3d2d6e;border-radius:20px;padding:20px;margin:0 20px 20px;position:relative;overflow:hidden;}
.id-card::before{content:'';position:absolute;top:-50%;right:-30%;width:200px;height:200px;background:radial-gradient(circle,rgba(139,92,246,.15),transparent 70%);pointer-events:none;}
.id-card-logo{font-size:11px;font-weight:800;color:#8b5cf6;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
.id-card-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f472b6);display:flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:10px;border:2px solid #3d2d6e;}
.id-card-name{font-size:18px;font-weight:800;color:#ede9fe;margin-bottom:4px;font-family:'Syne',sans-serif;}
.id-badge{font-family:'JetBrains Mono',monospace;font-size:14px;color:#a78bfa;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);border-radius:8px;padding:6px 12px;display:inline-block;animation:idGlow 2s ease-in-out infinite;}
.uid-badge{font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b5f8a;margin-top:8px;}
.id-card-chips{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;}
.id-chip{font-size:10px;font-weight:700;letter-spacing:.5px;padding:4px 9px;border-radius:8px;text-transform:uppercase;}
.id-chip.enc{background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);color:#10b981;}
.id-chip.e2e{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.25);color:#a78bfa;}
.id-chip.anon{background:rgba(45,212,191,.1);border:1px solid rgba(45,212,191,.25);color:#2dd4bf;}

/* Form elements */
.id-section{padding:0 20px;margin-bottom:20px;}
.f-lbl{font-size:11px;font-weight:700;color:#8b5cf6;letter-spacing:.8px;text-transform:uppercase;margin-bottom:7px;display:flex;align-items:center;gap:6px;}
.f-inp{width:100%;padding:14px 15px;background:#110e22;border:1.5px solid #2a2050;border-radius:14px;font-size:15px;font-family:'Inter',sans-serif;color:#ede9fe;outline:none;transition:all .2s;}
.f-inp:focus{border-color:#8b5cf6;background:#17122e;box-shadow:0 0 0 3px rgba(139,92,246,.12);}
.f-inp::placeholder{color:#3d3060;}
.f-inp.ok{border-color:#10b981;background:#0d1a14;}
.f-inp.err{border-color:#ef4444;background:#1a0d0d;}
.f-msg{font-size:12px;font-weight:600;margin-top:6px;display:flex;align-items:center;gap:4px;}
.f-msg.ok{color:#10b981;}
.f-msg.err{color:#ef4444;}
.f-msg.info{color:#6b5f8a;}

/* Password strength */
.pw-bar-wrap{height:4px;background:#1a1535;border-radius:2px;margin-top:8px;overflow:hidden;}
.pw-bar{height:100%;border-radius:2px;transition:all .4s;}
.pw-rules{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;}
.pw-rule{font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px;}
.pw-rule.pass{color:#10b981;}
.pw-rule.fail{color:#3d3060;}

/* Handle checker */
.handle-preview{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;color:#c4b5fd;padding:14px 16px;background:#0d0a1f;border:1.5px solid #2a2050;border-radius:14px;margin-top:8px;min-height:52px;display:flex;align-items:center;gap:2px;}
.handle-cursor{width:2px;height:20px;background:#8b5cf6;animation:blink 1s ease-in-out infinite;margin-left:1px;}
.tag-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px;}
.tag-btn{padding:10px 6px;background:#110e22;border:1.5px solid #2a2050;border-radius:12px;font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600;color:#6b5f8a;cursor:pointer;transition:all .15s;text-align:center;}
.tag-btn:hover{border-color:#8b5cf6;color:#c4b5fd;background:#17122e;}
.tag-btn.on{border-color:#8b5cf6;background:rgba(139,92,246,.15);color:#c4b5fd;box-shadow:0 0 12px rgba(139,92,246,.3);}

/* OTP / Verification */
.otp-grid{display:flex;gap:10px;justify-content:center;margin:20px 0;}
.otp-cell{width:48px;height:56px;background:#110e22;border:2px solid #2a2050;border-radius:14px;font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace;color:#ede9fe;text-align:center;outline:none;transition:all .2s;caret-color:#8b5cf6;}
.otp-cell:focus{border-color:#8b5cf6;background:#17122e;box-shadow:0 0 0 3px rgba(139,92,246,.15);}
.otp-cell.filled{border-color:#10b981;background:#0d1a14;color:#10b981;}

/* Verify phone section */
.phone-country{display:flex;align-items:center;gap:10px;background:#110e22;border:1.5px solid #2a2050;border-radius:14px;padding:4px 4px 4px 14px;margin-bottom:10px;}
.phone-flag{font-size:22px;}
.phone-code{font-size:15px;font-weight:700;color:#a78bfa;font-family:'JetBrains Mono',monospace;}
.phone-inp-inner{flex:1;padding:10px 14px;background:#17122e;border:none;border-radius:10px;font-size:15px;font-family:'JetBrains Mono',monospace;color:#ede9fe;outline:none;}
.phone-inp-inner::placeholder{color:#3d3060;}

/* ID Success */
.id-success-wrap{padding:20px;text-align:center;}
.success-icon{font-size:80px;animation:successPop .5s ease;display:block;margin-bottom:16px;}
.success-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;background:linear-gradient(135deg,#c4b5fd,#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;}
.success-sub{font-size:14px;color:#6b5f8a;line-height:1.65;margin-bottom:20px;}

/* Avatar grid */
.av-grid{display:flex;flex-wrap:wrap;gap:7px;}
.av-it{width:44px;height:44px;border-radius:12px;cursor:pointer;border:2px solid #2a2050;transition:all .15s;display:flex;align-items:center;justify-content:center;font-size:22px;background:#110e22;}
.av-it.on{border-color:#8b5cf6;background:#1e1840;box-shadow:0 0 14px rgba(139,92,246,.4);}

/* Prefix selector */
.prefix-scroll{display:flex;gap:8px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:none;}
.prefix-scroll::-webkit-scrollbar{display:none;}
.prefix-btn{flex-shrink:0;padding:8px 14px;background:#110e22;border:1.5px solid #2a2050;border-radius:20px;font-size:13px;font-weight:700;color:#6b5f8a;cursor:pointer;transition:all .15s;font-family:'JetBrains Mono',monospace;}
.prefix-btn:hover{border-color:#8b5cf6;color:#c4b5fd;}
.prefix-btn.on{background:rgba(139,92,246,.15);border-color:#8b5cf6;color:#c4b5fd;box-shadow:0 0 10px rgba(139,92,246,.25);}

/* Main buttons */
.btn-main{width:100%;padding:15px;background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:white;border:none;border-radius:16px;font-size:16px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;box-shadow:0 6px 28px rgba(139,92,246,.4);transition:all .15s;letter-spacing:.3px;}
.btn-main:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(139,92,246,.55);}
.btn-main:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-ghost{width:100%;padding:13px;background:transparent;border:1.5px solid #2a2050;color:#a89cc8;border-radius:16px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all .15s;margin-top:10px;}
.btn-ghost:hover{border-color:#8b5cf6;color:#c4b5fd;}

/* Login tab toggle */
.tab-wrap{display:flex;background:#0d0a1f;border-radius:16px;padding:4px;gap:4px;margin-bottom:20px;}
.tab-btn{flex:1;padding:10px;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif;background:transparent;color:#6b5f8a;}
.tab-btn.on{background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:white;box-shadow:0 4px 20px rgba(139,92,246,.4);}

/* Encryption notice */
.enc-note{display:flex;align-items:center;gap:8px;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.2);border-radius:12px;padding:10px 14px;margin-bottom:18px;}
.enc-txt{font-size:12px;color:#10b981;font-weight:600;line-height:1.4;}

/* ════ MAIN APP STYLES ════ */
.hdr{background:rgba(8,6,18,.97);padding:12px 14px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid #17122e;backdrop-filter:blur(24px);position:relative;z-index:20;}
.hdr-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#4c2f8a 30%,#8b5cf6 50%,#4c2f8a 70%,transparent);}
.hdr-brand{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;background:linear-gradient(135deg,#c4b5fd,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hdr-enc{display:flex;align-items:center;gap:4px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);border-radius:8px;padding:3px 8px;}
.hdr-enc-txt{font-size:10px;color:#10b981;font-weight:700;letter-spacing:.5px;}
.ico-btn{background:none;border:none;color:#6b5f8a;font-size:20px;cursor:pointer;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.ico-btn:hover{background:#17122e;color:#c4b5fd;}
.bot-nav{background:rgba(8,6,18,.98);border-top:1px solid #1a1535;display:flex;flex-shrink:0;padding:6px 0 8px;position:relative;}
.bot-nav::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#4c2f8a 20%,#8b5cf6 50%,#4c2f8a 80%,transparent);}
.n-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0;background:none;border:none;cursor:pointer;font-size:9px;font-weight:700;color:#6b5f8a;font-family:'Inter',sans-serif;letter-spacing:.4px;transition:color .15s;position:relative;text-transform:uppercase;}
.n-btn.on{color:#8b5cf6;}
.n-badge{position:absolute;top:3px;right:calc(50% - 22px);background:#ef4444;color:white;border-radius:10px;min-width:16px;height:16px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid #080612;}
.c-row{display:flex;align-items:center;gap:12px;padding:12px 15px;cursor:pointer;transition:background .1s;position:relative;}
.c-row:hover{background:rgba(139,92,246,.05);}
.c-row::after{content:'';position:absolute;bottom:0;left:70px;right:15px;height:1px;background:#17122e;}
.c-ava{width:52px;height:52px;border-radius:50%;background:#17122e;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;position:relative;border:2px solid #2a2050;overflow:hidden;}
.c-ava img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.c-ava.online{border-color:#10b981;box-shadow:0 0 10px rgba(16,185,129,.3);}
.st-dot{position:absolute;bottom:1px;right:1px;width:13px;height:13px;border-radius:50%;border:2.5px solid #080612;}
.anon-tag{font-size:10px;background:linear-gradient(90deg,#7c3aed,#f472b6);color:white;border-radius:8px;padding:2px 7px;font-weight:700;flex-shrink:0;}
.vanish-tag{font-size:10px;background:rgba(45,212,191,.15);border:1px solid rgba(45,212,191,.3);color:#2dd4bf;border-radius:8px;padding:2px 7px;font-weight:700;flex-shrink:0;}
.srch-bar{padding:8px 13px;background:#080612;border-bottom:1px solid #17122e;}
.srch-inner{display:flex;align-items:center;gap:8px;background:#110e22;border:1.5px solid #2a2050;border-radius:16px;padding:9px 13px;}
.srch-inp{flex:1;background:none;border:none;outline:none;font-size:14px;font-family:'Inter',sans-serif;color:#ede9fe;}
.srch-inp::placeholder{color:#3d3060;}

/* CHAT SCREEN */
.ch-scr{display:flex;flex-direction:column;height:100vh;animation:slideR .22s ease;position:relative;}
.ch-top{background:rgba(8,6,18,.96);padding:10px 12px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #17122e;flex-shrink:0;z-index:10;backdrop-filter:blur(24px);}
.ch-ava{width:42px;height:42px;border-radius:50%;background:#17122e;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:2px solid #2a2050;position:relative;overflow:hidden;}
.ch-ava img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.rev-bar{background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.15);padding:6px 15px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.rev-track{flex:1;height:4px;background:#17122e;border-radius:2px;overflow:hidden;}
.rev-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#f472b6);border-radius:2px;transition:width .5s ease;}
.vanish-banner{background:linear-gradient(135deg,rgba(45,212,191,.1),rgba(139,92,246,.1));border-bottom:1px solid rgba(45,212,191,.2);padding:10px 15px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.msgs{flex:1;overflow-y:auto;padding:12px 10px;display:flex;flex-direction:column;gap:2px;}
.msgs::-webkit-scrollbar{width:0;}
.mw{display:flex;flex-direction:column;margin-bottom:2px;animation:msgIn .2s ease;}
.mw.me{align-items:flex-end;}
.mw.them{align-items:flex-start;}
.mb{max-width:82%;padding:9px 13px;border-radius:18px;}
.mb.me{background:linear-gradient(135deg,#7c3aed,#8b5cf6);border-radius:18px 18px 4px 18px;box-shadow:0 4px 20px rgba(139,92,246,.35);}
.mb.them{background:#17122e;border:1px solid #2a2050;border-radius:18px 18px 18px 4px;}
.mb.ai-msg{background:linear-gradient(135deg,#0d1a2e,#0a1628);border:1px solid rgba(45,212,191,.25);border-radius:18px 18px 18px 4px;}
.mb-txt{font-size:15px;line-height:1.55;word-break:break-word;}
.mb.me .mb-txt{color:white;}
.mb.them .mb-txt,.mb.ai-msg .mb-txt{color:#ede9fe;}
.mb-meta{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:3px;}
.mb-time{font-size:11px;color:rgba(255,255,255,.5);}
.mb.them .mb-time{color:#6b5f8a;}
.mb-tick{font-size:12px;color:#a78bfa;}
.mb-stk{font-size:58px;line-height:1;background:transparent!important;border:none!important;box-shadow:none!important;padding:4px 8px;}
.mb-sys{text-align:center;font-size:12px;color:#6b5f8a;background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.1);border-radius:10px;padding:5px 14px;margin:8px auto;max-width:270px;}
.mb-aud{display:flex;align-items:center;gap:10px;min-width:160px;}
.play-b{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);border:none;color:white;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.mb.them .play-b,.mb.ai-msg .play-b{background:#2a2050;}
.wv{flex:1;height:4px;background:rgba(255,255,255,.15);border-radius:2px;}
.wv-f{width:40%;height:100%;background:rgba(255,255,255,.7);border-radius:2px;}
.mb.them .wv,.mb.ai-msg .wv{background:#2a2050;}
.mb.them .wv-f,.mb.ai-msg .wv-f{background:#8b5cf6;}
.rxn-row{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;}
.rxn-chip{font-size:14px;background:#17122e;border:1px solid #2a2050;border-radius:14px;padding:3px 9px;cursor:pointer;display:flex;align-items:center;gap:3px;transition:all .12s;}
.rxn-chip.me{border-color:#8b5cf6;background:rgba(139,92,246,.15);}
.rxn-pop{position:absolute;bottom:calc(100% + 8px);background:#0d0a1f;border:1px solid #2a2050;border-radius:28px;padding:6px 10px;display:flex;gap:4px;z-index:50;box-shadow:0 12px 40px rgba(0,0,0,.6);animation:popIn .15s ease;backdrop-filter:blur(20px);}
.rxn-pb{font-size:22px;cursor:pointer;padding:4px;border-radius:10px;border:none;background:none;transition:transform .1s;}
.rxn-pb:hover{transform:scale(1.35);}
.ctx-menu{position:absolute;background:#0d0a1f;border:1px solid #2a2050;border-radius:16px;padding:6px;z-index:100;box-shadow:0 12px 40px rgba(0,0,0,.7);min-width:155px;animation:popIn .15s ease;}
.ctx-item{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:#ede9fe;transition:background .1s;}
.ctx-item:hover{background:#17122e;}
.ctx-item.danger{color:#ef4444;}

/* AI typing indicator */
.ai-typing{display:flex;align-items:center;gap:6px;padding:10px 14px;background:#0d1a2e;border:1px solid rgba(45,212,191,.2);border-radius:18px;width:fit-content;}
.ai-dot{width:7px;height:7px;border-radius:50%;background:#2dd4bf;animation:dotPulse 1.2s ease-in-out infinite;}
.ai-dot:nth-child(2){animation-delay:.2s;}
.ai-dot:nth-child(3){animation-delay:.4s;}
.ai-badge{font-size:10px;font-weight:700;color:#2dd4bf;letter-spacing:.5px;text-transform:uppercase;}

/* INPUT BAR */
.inp-bar{background:rgba(8,6,18,.98);padding:10px 12px;display:flex;align-items:flex-end;gap:9px;border-top:1px solid #17122e;flex-shrink:0;backdrop-filter:blur(20px);}
.inp-box{flex:1;background:#110e22;border:1.5px solid #2a2050;border-radius:26px;display:flex;align-items:center;overflow:hidden;transition:border .2s;}
.inp-box:focus-within{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.1);}
.inp-icon{background:none;border:none;color:#6b5f8a;font-size:19px;cursor:pointer;padding:10px 8px;flex-shrink:0;transition:color .15s;}
.inp-icon:hover{color:#c4b5fd;}
.msg-inp{flex:1;background:none;border:none;outline:none;font-size:15px;font-family:'Inter',sans-serif;color:#ede9fe;padding:11px 4px;}
.msg-inp::placeholder{color:#3d3060;}
.snd-btn{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#8b5cf6);border:none;color:white;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 6px 28px rgba(139,92,246,.5);transition:all .15s;}
.snd-btn:hover{transform:scale(1.08);}
.vanish-tog-btn{background:none;border:none;cursor:pointer;padding:10px 7px;font-size:19px;transition:all .15s;position:relative;}
.vanish-tog-btn.active{filter:drop-shadow(0 0 6px rgba(45,212,191,.8));}
.vanish-ind{position:absolute;top:6px;right:3px;width:7px;height:7px;border-radius:50%;background:#2dd4bf;border:2px solid #110e22;}

/* Trays */
.tray{background:#0d0a1f;border-top:1px solid #17122e;padding:14px;max-height:230px;overflow-y:auto;flex-shrink:0;animation:slideUp .18s ease;}
.tray-lbl{font-size:11px;color:#6b5f8a;font-weight:700;letter-spacing:.8px;margin-bottom:10px;text-transform:uppercase;}
.e-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:2px;}
.e-cell{font-size:23px;cursor:pointer;padding:7px;border-radius:10px;text-align:center;background:none;border:none;transition:background .1s;}
.e-cell:hover{background:#17122e;}
.sk-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;}
.sk-cell{font-size:36px;cursor:pointer;padding:10px;border-radius:14px;text-align:center;background:#17122e;border:1px solid #2a2050;transition:all .15s;}
.sk-cell:hover{background:#231b48;transform:scale(1.14);border-color:#8b5cf6;}
.at-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
.at-item{background:#17122e;border:1px solid #2a2050;border-radius:18px;padding:15px 6px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:all .15s;}
.at-item:hover{background:#231b48;border-color:#8b5cf6;transform:translateY(-2px);}

/* MODALS */
.m-overlay{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.75);display:flex;align-items:flex-end;justify-content:center;animation:fadeIn .2s ease;backdrop-filter:blur(6px);}
.m-sheet{width:100%;max-width:430px;background:#0d0a1f;border-radius:28px 28px 0 0;padding:20px 18px 42px;max-height:92vh;overflow-y:auto;animation:slideUp .25s ease;border-top:1px solid #2a2050;}
.m-handle{width:44px;height:4px;background:#2a2050;border-radius:2px;margin:0 auto 20px;}
.m-title{font-size:20px;font-weight:800;color:#ede9fe;margin-bottom:5px;font-family:'Syne',sans-serif;}
.m-sub{font-size:13px;color:#6b5f8a;margin-bottom:16px;}
.u-ava{width:48px;height:48px;border-radius:50%;background:#17122e;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:2px solid #2a2050;position:relative;overflow:hidden;}
.u-ava img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.u-row{display:flex;align-items:center;gap:12px;padding:11px 13px;border-radius:16px;cursor:pointer;transition:background .1s;}
.u-row:hover{background:#17122e;}
.u-name{font-size:15px;font-weight:700;color:#ede9fe;}
.u-sub{font-size:12px;color:#6b5f8a;margin-top:1px;}
.chk-c{width:26px;height:26px;border-radius:50%;border:2px solid #2a2050;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;}
.chk-c.on{background:linear-gradient(135deg,#7c3aed,#8b5cf6);border-color:#8b5cf6;color:white;font-size:13px;}
.fr-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#17122e;border:1px solid #2a2050;border-radius:18px;margin-bottom:8px;}
.fr-acts{display:flex;gap:6px;flex-shrink:0;align-items:center;}
.btn-sm{padding:7px 13px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:all .12s;white-space:nowrap;}
.btn-acc{background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:white;}
.btn-dec{background:#231b48;color:#6b5f8a;}
.btn-add{background:linear-gradient(135deg,#7c3aed,#f472b6);color:white;}
.btn-snt{background:#231b48;color:#6b5f8a;}
.btn-fri{background:rgba(139,92,246,.12);color:#a78bfa;border:1px solid #2a2050!important;}
.btn-msg{background:#231b48;color:#8b5cf6;border:1px solid #2a2050!important;}
.sec-lbl{font-size:11px;font-weight:700;color:#8b5cf6;letter-spacing:.8px;text-transform:uppercase;padding:14px 0 7px;}

/* PROFILE */
.prof-hero{background:radial-gradient(ellipse at 50% 10%,#2a1060 0%,#080612 70%);padding:28px 20px 22px;text-align:center;}
.prof-ring{width:94px;height:94px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f472b6);padding:3px;margin:0 auto 13px;cursor:pointer;position:relative;}
.prof-ring-inner{width:100%;height:100%;border-radius:50%;background:#17122e;display:flex;align-items:center;justify-content:center;font-size:50px;overflow:hidden;}
.prof-ring-inner img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.prof-cam{position:absolute;bottom:2px;right:2px;width:26px;height:26px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;border:2.5px solid #080612;}
.prof-name{font-size:24px;font-weight:800;color:#ede9fe;font-family:'Syne',sans-serif;}
.prof-id{font-family:'JetBrains Mono',monospace;font-size:13px;color:#a78bfa;margin-top:4px;animation:idGlow 3s ease-in-out infinite;}
.prof-bio{font-size:14px;color:#a89cc8;line-height:1.55;margin-top:8px;}
.enc-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.25);border-radius:20px;padding:5px 14px;margin-top:12px;}
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px;}
.stat-box{background:#17122e;border:1px solid #2a2050;border-radius:16px;padding:14px 10px;text-align:center;}
.stat-v{font-size:26px;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Syne',sans-serif;}
.stat-l{font-size:12px;color:#6b5f8a;margin-top:3px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.set-section{margin:0 14px 14px;background:#17122e;border:1px solid #2a2050;border-radius:20px;overflow:hidden;}
.set-sect-lbl{font-size:10px;font-weight:700;color:#8b5cf6;letter-spacing:1px;text-transform:uppercase;padding:13px 16px 5px;}
.set-row{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;transition:background .1s;border-top:1px solid #1a1535;}
.set-row:first-of-type{border-top:none;}
.set-row:hover{background:rgba(139,92,246,.05);}
.set-ico{width:40px;height:40px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.priv-sect{background:#17122e;border:1px solid #2a2050;border-radius:18px;overflow:hidden;margin-bottom:12px;}
.priv-row{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;transition:background .1s;border-top:1px solid #1a1535;}
.priv-row:first-child{border-top:none;}
.priv-row:hover{background:rgba(139,92,246,.05);}
.priv-ico{width:40px;height:40px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.sub-scr{position:absolute;inset:0;background:#080612;z-index:300;display:flex;flex-direction:column;animation:slideR .2s ease;max-width:430px;}
.sub-hdr{background:rgba(8,6,18,.97);padding:12px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #17122e;flex-shrink:0;}
.sub-body{flex:1;overflow-y:auto;padding:14px;}
.opt-sect{background:#17122e;border:1px solid #2a2050;border-radius:18px;overflow:hidden;margin-bottom:12px;}
.opt-row{display:flex;align-items:center;padding:13px 16px;cursor:pointer;transition:background .1s;border-top:1px solid #1a1535;gap:12px;}
.opt-row:first-child{border-top:none;}
.opt-row:hover{background:rgba(139,92,246,.05);}
.opt-r{width:22px;height:22px;border-radius:50%;border:2.5px solid #2a2050;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.opt-r.on{border-color:#8b5cf6;background:linear-gradient(135deg,#7c3aed,#8b5cf6);}
.opt-r.on::after{content:'';width:8px;height:8px;border-radius:50%;background:white;}
.info-box{background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.15);border-radius:14px;padding:12px 14px;margin-top:12px;}
.info-txt{font-size:13px;color:#6b5f8a;line-height:1.65;}
.tgl{width:48px;height:27px;border-radius:14px;cursor:pointer;position:relative;transition:background .25s;flex-shrink:0;}
.tgl-knob{position:absolute;top:3px;width:21px;height:21px;border-radius:50%;background:white;box-shadow:0 2px 6px rgba(0,0,0,.3);transition:left .22s;}

/* Wall picker */
.wall-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.wall-it{height:80px;border-radius:14px;cursor:pointer;border:2.5px solid #2a2050;transition:all .15s;position:relative;overflow:hidden;}
.wall-it:hover{border-color:#8b5cf6;transform:scale(1.03);}
.wall-it.on{border-color:#8b5cf6;box-shadow:0 0 18px rgba(139,92,246,.5);}
.wall-lbl{position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:11px;font-weight:700;color:white;padding:4px 0;background:linear-gradient(transparent,rgba(0,0,0,.7));}

/* DP */
.dp-preview{width:86px;height:86px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#f472b6);padding:3px;margin:0 auto 18px;}
.dp-preview-inner{width:100%;height:100%;border-radius:50%;background:#17122e;display:flex;align-items:center;justify-content:center;font-size:46px;overflow:hidden;}
.dp-preview-inner img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.dp-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;}
.dp-it{width:100%;aspect-ratio:1;border-radius:13px;background:#17122e;border:2px solid #2a2050;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;transition:all .15s;}
.dp-it:hover,.dp-it.on{border-color:#8b5cf6;background:#1e1840;box-shadow:0 0 12px rgba(139,92,246,.4);}
.upload-btn{width:100%;padding:13px;background:#17122e;border:2px dashed #2a2050;border-radius:14px;color:#6b5f8a;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;margin-top:10px;}
.upload-btn:hover{border-color:#8b5cf6;color:#c4b5fd;background:#1e1840;}
.call-ov{position:fixed;inset:0;z-index:900;background:radial-gradient(ellipse at 50% 30%,#2a1060 0%,#080612 65%);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:fadeIn .3s ease;}
.call-av{width:110px;height:110px;border-radius:50%;background:#17122e;border:3px solid #2a2050;display:flex;align-items:center;justify-content:center;font-size:60px;margin-bottom:18px;animation:floatY 3s ease-in-out infinite;overflow:hidden;}
.call-av img{width:100%;height:100%;object-fit:cover;border-radius:50%;}
.call-btns{display:flex;gap:26px;align-items:center;}
.call-btn{width:62px;height:62px;border-radius:50%;border:none;font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.call-end{background:linear-gradient(135deg,#ef4444,#dc2626);width:72px;height:72px;font-size:30px;animation:callPulse 1.5s infinite;}
.call-side{background:#17122e;color:#a89cc8;border:1.5px solid #2a2050;}
.rev-ov{position:fixed;inset:0;z-index:888;background:radial-gradient(ellipse at 50% 40%,#3d1280 0%,#080612 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;animation:revealIn .4s ease;}
.toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:999;background:#0d0a1f;color:#ede9fe;padding:12px 22px;border-radius:28px;font-size:14px;font-weight:700;white-space:nowrap;box-shadow:0 8px 40px rgba(0,0,0,.6);animation:slideUp .25s ease;font-family:'Inter',sans-serif;max-width:92vw;text-align:center;border:1px solid #2a2050;}
.toast.success{background:linear-gradient(135deg,#7c3aed,#8b5cf6);border-color:transparent;}
.toast.warn{background:linear-gradient(135deg,#f59e0b,#d97706);border-color:transparent;}
::-webkit-scrollbar{width:0;}
`;

/* ──────────── TOGGLE + RADIO HELPERS ──────────── */
function Toggle({on,onChange}){
  return <div className="tgl" style={{background:on?"linear-gradient(135deg,#7c3aed,#8b5cf6)":"#231b48"}} onClick={()=>onChange(!on)}><div className="tgl-knob" style={{left:on?"24px":"3px"}}/></div>;
}
function RadioGroup({opts,val,onChange}){
  return <div className="opt-sect">{opts.map(o=><div key={o.v} className="opt-row" onClick={()=>onChange(o.v)}><div style={{flex:1}}><div style={{fontWeight:700,color:"#ede9fe",fontSize:15}}>{o.label}</div>{o.desc&&<div style={{fontSize:12,color:"#6b5f8a",marginTop:2}}>{o.desc}</div>}</div><div className={`opt-r ${val===o.v?"on":""}`}/></div>)}</div>;
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function VibeZ(){
  /* ── Screens: splash | id-create | id-login | app ── */
  const [screen,    setScreen]    = useState("splash");
  /* ID Creation steps: 1=name+avatar, 2=handle, 3=tag, 4=password, 5=phone, 6=otp, 7=done */
  const [idStep,    setIdStep]    = useState(1);
  const [authMode,  setAuthMode]  = useState("create"); // create | login

  /* ID Creation state */
  const [displayName,setDisplayName]=useState("");
  const [avatar,    setAvatar]    = useState("😎");
  const [prefix,    setPrefix]    = useState("vibe");
  const [handle,    setHandle]    = useState("");
  const [selectedTag,setSelectedTag]=useState("");
  const [tagOptions,setTagOptions]=useState([]);
  const [password,  setPassword]  = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [phone,     setPhone]     = useState("");
  const [otp,       setOtp]       = useState(["","","","","",""]);
  const [sentOtp,   setSentOtp]   = useState("");
  const [profileImg,setProfileImg]= useState(null);

  /* Login state */
  const [loginId,   setLoginId]   = useState("");
  const [loginPw,   setLoginPw]   = useState("");

  /* App state */
  const [me,        setMe]        = useState(null);
  const [page,      setPage]      = useState("chats");
  const [chats,     setChats]     = useState(CHATS0);
  const [openId,    setOpenId]    = useState(null);
  const [msgIn,     setMsgIn]     = useState("");
  const [tray,      setTray]      = useState(null);
  const [rxnT,      setRxnT]      = useState(null);
  const [ctxMenu,   setCtxMenu]   = useState(null);
  const [vanish,    setVanish]    = useState(false);
  const [call,      setCall]      = useState(null);
  const [freqs,     setFreqs]     = useState(FREQS0);
  const [friends,   setFriends]   = useState(["u2","u3"]);
  const [grpDlg,    setGrpDlg]    = useState(false);
  const [grpName,   setGrpName]   = useState("");
  const [grpMems,   setGrpMems]   = useState([]);
  const [srch,      setSrch]      = useState("");
  const [showSrch,  setShowSrch]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [revAnim,   setRevAnim]   = useState(false);
  const [freqDlg,   setFreqDlg]   = useState(false);
  const [priv,      setPriv]      = useState(DEF_PRIV);
  const [privSub,   setPrivSub]   = useState(null);
  const [dpDlg,     setDpDlg]     = useState(false);
  const [wallDlg,   setWallDlg]   = useState(false);
  const [editDlg,   setEditDlg]   = useState(false);
  const [editName,  setEditName]  = useState("");
  const [editBio,   setEditBio]   = useState("");
  const [aiTyping,  setAiTyping]  = useState(false);
  const [starredDlg,setStarredDlg]=useState(false);
  const msgEnd = useRef(null);
  const inpRef  = useRef(null);
  const fileRef = useRef(null);
  const otpRefs = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];

  useEffect(()=>{setTimeout(()=>setScreen("id-auth"),2800);},[]);
  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"});},[openId,chats]);

  /* Generate tag options when handle set */
  useEffect(()=>{
    if(handle.length>=3){
      const tags=Array.from({length:8},()=>generateTag());
      setTagOptions(tags);
      setSelectedTag(tags[0]);
    }
  },[handle]);

  const toast_show=useCallback((msg,type="info")=>{setToast({msg,type});setTimeout(()=>setToast(null),3200);},[]);

  /* ── ID helpers ── */
  const fullId=`@${prefix}.${handle||"..."}#${selectedTag||"????"}`;
  const handleV=validateHandle(handle);
  const pwStrength=checkPassword(password);

  /* ── Send OTP (simulated) ── */
  const sendOtp=()=>{
    const code=String(Math.floor(100000+Math.random()*900000));
    setSentOtp(code);
    toast_show(`OTP sent to +${phone} — Demo: ${code}`,"success");
    setIdStep(6);
  };

  /* ── Verify OTP ── */
  const verifyOtp=()=>{
    const entered=otp.join("");
    if(entered===sentOtp||entered==="123456"){
      setIdStep(7);
    } else {
      toast_show("Incorrect OTP — try again","warn");
    }
  };

  /* ── Finish ID creation → enter app ── */
  const finishCreate=()=>{
    const uid_hex=generateUID();
    const newMe={
      id:"me",
      vibeId:fullId,
      uid:uid_hex,
      username:handle,
      name:displayName||handle,
      avatar,
      profileImg:profileImg||null,
      status:"online",
      bio:"Hey there! I'm on VibeZ.",
      joinedAt:new Date().toLocaleDateString(),
      verified:true,
    };
    setMe(newMe);
    setScreen("app");
    toast_show(`Welcome to VibeZ! Your ID: ${fullId} ⚡`,"success");
  };

  /* ── Login (demo) ── */
  const doLogin=()=>{
    const found=USERS.find(u=>u.vibeId===loginId||u.username===loginId.replace("@","").split(".")[1]?.split("#")[0]);
    const user=found?{...found,id:"me",verified:true,uid:generateUID(),joinedAt:"Jan 2024",profileImg:null}:{
      id:"me",vibeId:loginId||"@vibe.user#0000",uid:generateUID(),username:"user",
      name:"VibeZ User",avatar:"😎",status:"online",bio:"Hey there!",joinedAt:"Today",verified:false,profileImg:null
    };
    setMe(user);setScreen("app");toast_show("Welcome back! ⚡","success");
  };

  /* ── OTP input handler ── */
  const handleOtpInput=(i,val)=>{
    const v=val.replace(/\D/g,"").slice(-1);
    const newOtp=[...otp];newOtp[i]=v;setOtp(newOtp);
    if(v&&i<5)otpRefs[i+1]?.current?.focus();
    if(!v&&i>0)otpRefs[i-1]?.current?.focus();
  };

  /* ── AI Chat ── */
  const sendAiMsg=async(chatId,userMsg)=>{
    setAiTyping(true);
    const systemPrompt=`You are VibeZ AI, a friendly and smart assistant built into the VibeZ chat app. You help users with anything — from casual conversation to coding, writing, advice, and more. Be concise (2-4 sentences max unless asked for more), warm, and use occasional emojis. The user's VibeZ ID is ${me?.vibeId||"unknown"}.`;
    const reply=await callGemini(userMsg,systemPrompt);
    setAiTyping(false);
    const aiMsg={id:uid(),from:"ai",kind:"text",body:reply,ts:Date.now(),rxn:{},seen:true,starred:false};
    setChats(prev=>prev.map(c=>c.id===chatId?{...c,msgs:[...c.msgs,aiMsg]}:c));
  };

  /* ── Helpers ── */
  const getU=id=>USERS.find(u=>u.id===id)||{name:"Unknown",avatar:"👤",status:"offline",bio:"",vibeId:"@?"};
  const oChat=chats.find(c=>c.id===openId);
  const getCN=c=>{if(c.type==="group")return c.name;if(!c.revealed&&c.count<50)return makeAnon();return getU(c.pid).name;};
  const getCA=c=>{if(c.type==="group")return c.avatar;if(!c.revealed&&c.count<50)return"🎭";return getU(c.pid).avatar;};
  const fmt=ts=>{const d=new Date(ts),n=new Date(),df=n-d;if(df<60000)return"now";if(df<3600000)return Math.floor(df/60000)+"m";if(df<86400000)return d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return d.toLocaleDateString([],{month:"short",day:"numeric"});};
  const fmtVal=v=>{const m={everyone:"Everyone",contacts:"Contacts",nobody:"Nobody","24h":"24h","7d":"7d","90d":"90d",off:"Off"};return m[v]||v;};

  /* ── Send message ── */
  const sendMsg=(kind="text",body=null)=>{
    const c=body||msgIn.trim();if(!c||!openId)return;
    const m={id:uid(),from:"me",kind,body:c,ts:Date.now(),rxn:{},seen:false,starred:false,vanish};
    setChats(prev=>prev.map(ch=>{
      if(ch.id!==openId)return ch;
      const msgs=[...ch.msgs,m];const count=ch.count+1;const wasRev=ch.revealed;const revealed=count>=50;
      if(revealed&&!wasRev){setTimeout(()=>{setRevAnim(true);setTimeout(()=>setRevAnim(false),4000);},200);}
      return{...ch,msgs,count,revealed};
    }));
    if(vanish){const id=m.id;setTimeout(()=>setChats(prev=>prev.map(ch=>ch.id!==openId?ch:{...ch,msgs:ch.msgs.filter(x=>x.id!==id)})),10000);}
    setMsgIn("");setTray(null);
    /* Trigger AI if message starts with @ or /ai */
    if(c.startsWith("@ai ")||c.startsWith("/ai ")){
      sendAiMsg(openId,c.replace(/^(@ai|\/ai)\s+/i,""));
    }
  };

  const toggleVanishChat=()=>{setChats(prev=>prev.map(c=>{if(c.id!==openId)return c;const v=!c.vanishChat;toast_show(v?"👻 Vanish Chat ON":"Vanish Chat OFF");return{...c,vanishChat:v};}));};
  const addRxn=(cId,mId,em)=>{setChats(prev=>prev.map(c=>c.id!==cId?c:{...c,msgs:c.msgs.map(m=>m.id!==mId?m:{...m,rxn:{...m.rxn,[em]:(m.rxn[em]||[]).includes("me")?(m.rxn[em]).filter(u=>u!=="me"):[...(m.rxn[em]||[]),"me"]}})}));setRxnT(null);};
  const deleteMsg=msgId=>{setChats(prev=>prev.map(c=>c.id!==openId?c:{...c,msgs:c.msgs.filter(m=>m.id!==msgId)}));setCtxMenu(null);toast_show("Message deleted");};
  const starMsg=msgId=>{setChats(prev=>prev.map(c=>c.id!==openId?c:{...c,msgs:c.msgs.map(m=>m.id===msgId?{...m,starred:!m.starred}:m)}));setCtxMenu(null);toast_show("⭐ Message starred");};

  const pendIn=freqs.filter(r=>r.to==="me"&&r.status==="pending");
  const pendOut=freqs.filter(r=>r.from==="me"&&r.status==="pending");
  const sendFR=toId=>{if(friends.includes(toId)){toast_show("Already friends 👫");return;}if(pendOut.find(r=>r.to===toId)){toast_show("Request already sent ⏳");return;}const inc=pendIn.find(r=>r.from===toId);if(inc){accFR(inc.id);return;}setFreqs(p=>[...p,{id:uid(),from:"me",to:toId,status:"pending",ts:Date.now()}]);toast_show("Friend request sent! 🫶","success");};
  const accFR=reqId=>{const req=freqs.find(r=>r.id===reqId);if(!req)return;setFreqs(p=>p.map(r=>r.id===reqId?{...r,status:"accepted"}:r));setFriends(p=>[...p,req.from]);toast_show(`${getU(req.from).name} is now your friend! 🎉`,"success");};
  const decFR=reqId=>{setFreqs(p=>p.map(r=>r.id===reqId?{...r,status:"declined"}:r));toast_show("Request declined");};
  const getFS=uid=>{if(friends.includes(uid))return"friend";if(pendOut.find(r=>r.to===uid))return"sent";if(pendIn.find(r=>r.from===uid))return"incoming";return"none";};
  const mkGrp=()=>{if(!grpName.trim())return;const ng={id:uid(),type:"group",name:grpName,avatar:"🚀",members:["me",...grpMems],vanishChat:false,msgs:[{id:uid(),from:"system",kind:"system",body:`"${grpName}" was created 🎉`,ts:Date.now(),rxn:{},seen:true,starred:false}],count:1,revealed:true,wallpaper:"w1",muted:false,pinned:false};setChats(p=>[ng,...p]);setGrpDlg(false);setGrpName("");setGrpMems([]);toast_show(`"${grpName}" created!`,"success");};
  const openDM=pid=>{const ex=chats.find(c=>c.type==="dm"&&c.pid===pid);if(ex){setOpenId(ex.id);setPage("chats");return;}const nc={id:uid(),type:"dm",pid,vanishChat:false,msgs:[],count:0,revealed:false,wallpaper:"w1",muted:false,pinned:false};setChats(p=>[nc,...p]);setOpenId(nc.id);setPage("chats");};
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{setProfileImg(ev.target.result);toast_show("Photo updated! 📸","success");setDpDlg(false);};r.readAsDataURL(f);};
  const setChatWall=wid=>{setChats(prev=>prev.map(c=>c.id===openId?{...c,wallpaper:wid}:c));setWallDlg(false);toast_show("Wallpaper changed 🎨","success");};
  const setP=(k,v)=>setPriv(p=>({...p,[k]:v}));
  const VIS=[{v:"everyone",label:"Everyone",desc:"All VibeZ users"},{v:"contacts",label:"My Contacts",desc:"Contacts only"},{v:"nobody",label:"Nobody",desc:"Hidden from all"}];
  const GRP=[{v:"everyone",label:"Everyone"},{v:"contacts",label:"My Contacts"},{v:"nobody",label:"Nobody"}];
  const TMR=[{v:"off",label:"Off"},{v:"24h",label:"24 Hours"},{v:"7d",label:"7 Days"},{v:"90d",label:"90 Days"}];
  const filtChats=[...chats.filter(c=>c.pinned),...chats.filter(c=>!c.pinned)].filter(c=>!srch||getCN(c).toLowerCase().includes(srch.toLowerCase()));
  const starredMsgs=chats.flatMap(c=>c.msgs.filter(m=>m.starred).map(m=>({...m,chatName:getCN(c),chatId:c.id})));

  const PRIV_SECTIONS=[
    {title:"Visibility",items:[{key:"lastSeen",ico:"🕐",bg:"#1e1040",name:"Last Seen",type:"vis"},{key:"profilePhoto",ico:"🖼️",bg:"#1a2040",name:"Profile Photo",type:"vis"},{key:"about",ico:"ℹ️",bg:"#1e2840",name:"About",type:"vis"},{key:"status",ico:"🔵",bg:"#1a2040",name:"Status",type:"vis"}]},
    {title:"Messaging",items:[{key:"readReceipts",ico:"✓✓",bg:"#1e1040",name:"Read Receipts",type:"toggle"},{key:"groups",ico:"👥",bg:"#201040",name:"Groups",type:"grp"},{key:"liveLocation",ico:"📍",bg:"#1a2040",name:"Live Location",type:"vis"},{key:"messageForwarding",ico:"↗️",bg:"#1a2040",name:"Message Forwarding",type:"toggle"},{key:"linkPreviews",ico:"🔗",bg:"#1e1040",name:"Link Previews",type:"toggle"}]},
    {title:"Disappearing",items:[{key:"defaultMsgTimer",ico:"⏱️",bg:"#201840",name:"Default Timer",type:"tmr"},{key:"disappearingMsgDefault",ico:"👻",bg:"#1e1040",name:"Vanish Mode Default",type:"toggle"},{key:"autoDelete",ico:"🗑️",bg:"#281020",name:"Auto-Delete History",type:"nav"}]},
    {title:"Security",items:[{key:"encryptionEnabled",ico:"🔐",bg:"#182840",name:"End-to-End Encryption",type:"toggle"},{key:"advancedEncryption",ico:"🛡️",bg:"#1e1040",name:"Advanced Encryption",type:"toggle"},{key:"screenSecurity",ico:"📱",bg:"#1a2040",name:"Screen Security",type:"toggle"},{key:"fingerprintLock",ico:"👆",bg:"#1e1040",name:"Fingerprint Lock",type:"toggle"},{key:"twoStep",ico:"🔑",bg:"#1e1040",name:"Two-Step Verification",type:"nav"}]},
    {title:"Network",items:[{key:"ipAddressProtection",ico:"🌐",bg:"#182040",name:"IP Protection",type:"toggle"},{key:"proxyConnection",ico:"🔀",bg:"#1a2040",name:"Proxy Connection",type:"toggle"},{key:"dataCollection",ico:"📊",bg:"#281020",name:"Data Collection",type:"toggle"},{key:"analyticsSharing",ico:"📈",bg:"#281020",name:"Analytics Sharing",type:"toggle"}]},
    {title:"Account",items:[{key:"blocked",ico:"🚫",bg:"#281020",name:"Blocked Contacts",type:"nav"},{key:"twoStep",ico:"🔒",bg:"#1e1040",name:"Two-Step Verification",type:"nav"},{key:"changeNumber",ico:"📱",bg:"#182040",name:"Change Number",type:"nav"}]},
  ];

  /* ═══════════ RENDER ═══════════ */
  return(
    <>
      <style>{CSS}</style>
      <div className="vz" onClick={()=>setCtxMenu(null)}>
        {toast&&<div className={`toast ${toast.type}`}>{toast.msg}</div>}
        {revAnim&&(<div className="rev-ov" onClick={()=>setRevAnim(false)} style={{zIndex:888}}><span style={{fontSize:90,animation:"successPop .5s ease",display:"block",textAlign:"center"}}>🎭✨</span><div style={{fontSize:28,fontWeight:800,background:"linear-gradient(135deg,#c4b5fd,#f9a8d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginTop:16,textAlign:"center",fontFamily:"'Syne',sans-serif"}}>Identity Revealed!</div><div style={{fontSize:15,color:"#a89cc8",marginTop:10,textAlign:"center",padding:"0 30px",lineHeight:1.65}}>50 messages done! Both real identities are now visible. Tap to continue.</div></div>)}
        {call&&(<div className="call-ov"><div className="call-av">{call.img?<img src={call.img} alt=""/>:call.av}</div><div style={{fontSize:28,fontWeight:800,color:"#ede9fe",marginBottom:8,fontFamily:"'Syne',sans-serif",textAlign:"center"}}>{call.name}</div><div style={{fontSize:14,color:"#6b5f8a",marginBottom:50}}>{call.type==="video"?"Video Call":"Voice Call"} in progress…</div><div className="call-btns">{call.type==="video"&&<button className="call-btn call-side">🎤</button>}<button className="call-btn call-end" onClick={()=>{setCall(null);toast_show("Call ended 📵");}}>📵</button>{call.type==="video"&&<button className="call-btn call-side">📷</button>}</div></div>)}

        {/* ════ SPLASH ════ */}
        {screen==="splash"&&(
          <div className="spl">
            <div className="spl-logo">⚡</div>
            <div className="spl-name">VibeZ</div>
            <div className="spl-tag">Connect · Vibe · Vanish</div>
            <div className="spl-bar"><div className="spl-prog"/></div>
          </div>
        )}

        {/* ════ ID AUTH SCREEN (Create / Login) ════ */}
        {screen==="id-auth"&&(
          <div className="id-bg">
            <div style={{padding:"16px 20px 0",textAlign:"center"}}>
              <div style={{fontSize:32,fontWeight:800,fontFamily:"'Syne',sans-serif",background:"linear-gradient(135deg,#c4b5fd,#fff,#f9a8d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>VibeZ ⚡</div>
              <div style={{fontSize:12,color:"#6b5f8a",letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>Secure · Private · Encrypted</div>
            </div>

            {/* Login/Create tabs */}
            <div style={{padding:"16px 20px 0"}}>
              <div className="tab-wrap">
                <button className={`tab-btn ${authMode==="create"?"on":""}`} onClick={()=>{setAuthMode("create");setIdStep(1);}}>Create ID</button>
                <button className={`tab-btn ${authMode==="login"?"on":""}`} onClick={()=>setAuthMode("login")}>Login</button>
              </div>
            </div>

            {/* ── LOGIN FORM ── */}
            {authMode==="login"&&(
              <div className="id-section" style={{marginTop:8}}>
                <div className="enc-note"><span style={{fontSize:16}}>🔐</span><span className="enc-txt">End-to-end encrypted — Your VibeZ ID is your key</span></div>
                <div className="f-lbl">Your VibeZ ID or Username</div>
                <div style={{position:"relative"}}>
                  <input className="f-inp" style={{fontFamily:"'JetBrains Mono',monospace"}} placeholder="@prefix.handle#tag" value={loginId} onChange={e=>setLoginId(e.target.value)}/>
                </div>
                <div className="f-msg info" style={{marginTop:6}}>Example: @vibe.shadowfox#4721 or just your handle</div>
                <div style={{marginTop:14}}>
                  <div className="f-lbl">Password</div>
                  <input className="f-inp" type="password" placeholder="••••••••" value={loginPw} onChange={e=>setLoginPw(e.target.value)}/>
                </div>
                <button className="btn-main" style={{marginTop:20}} onClick={doLogin}>Login →</button>
                <div style={{fontSize:12,color:"#3d3060",textAlign:"center",marginTop:10}}>Demo: type any ID or leave blank to enter</div>
                <button className="btn-ghost" onClick={()=>{setAuthMode("create");setIdStep(1);}}>Create a new VibeZ ID</button>
              </div>
            )}

            {/* ── ID CREATION FLOW ── */}
            {authMode==="create"&&(
              <div className="id-flow">
                {/* Step progress */}
                <div className="step-bar">
                  {[1,2,3,4,5,6].map((s,i)=>(
                    <>
                      <div key={`node-${s}`} className={`step-node ${idStep>s?"done":idStep===s?"active":"pending"}`}>{idStep>s?"✓":s}</div>
                      {i<5&&<div key={`line-${s}`} className={`step-line ${idStep>s?"done":""}`}/>}
                    </>
                  ))}
                </div>
                <div className="step-labels">
                  {["Profile","Handle","Tag","Password","Phone","Verify"].map((l,i)=>
                    <div key={l} className={`step-lbl ${idStep===i+1?"active":""}`}>{l}</div>
                  )}
                </div>

                {/* Live ID card preview */}
                {idStep>=2&&(
                  <div className="id-card">
                    <div className="id-card-logo">⚡ VibeZ ID</div>
                    <div className="id-card-avatar">{profileImg?<img src={profileImg} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:avatar}</div>
                    <div className="id-card-name">{displayName||"Your Name"}</div>
                    <div className="id-badge">{fullId}</div>
                    <div className="uid-badge">UID: {generateUID()} · Encrypted · Verified</div>
                    <div className="id-card-chips">
                      <span className="id-chip enc">🔐 E2E</span>
                      <span className="id-chip e2e">🛡️ Encrypted</span>
                      <span className="id-chip anon">👻 Anonymous</span>
                    </div>
                  </div>
                )}

                {/* STEP 1: Name + Avatar */}
                {idStep===1&&(
                  <div className="id-section" style={{animation:"stepIn .3s ease"}}>
                    <div style={{textAlign:"center",marginBottom:20}}>
                      <div style={{fontSize:24,fontWeight:800,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>Create Your VibeZ ID</div>
                      <div style={{fontSize:13,color:"#6b5f8a",marginTop:6,lineHeight:1.6}}>Your unique identity on VibeZ. Choose wisely — this is how people will know you.</div>
                    </div>
                    <div className="enc-note">
                      <span style={{fontSize:16}}>🛡️</span>
                      <span className="enc-txt">Your ID is hashed and encrypted. VibeZ cannot see your real identity.</span>
                    </div>
                    <div className="f-lbl">📷 Profile Photo (Optional)</div>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                      <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#f472b6)",padding:3,cursor:"pointer"}} onClick={()=>fileRef.current?.click()}>
                        <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"#17122e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,overflow:"hidden"}}>
                          {profileImg?<img src={profileImg} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:avatar}
                        </div>
                      </div>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
                    <div className="f-lbl">Choose Avatar</div>
                    <div className="av-grid" style={{marginBottom:16}}>{AVATARS.slice(0,20).map(a=><div key={a} className={`av-it ${avatar===a?"on":""}`} onClick={()=>setAvatar(a)}>{a}</div>)}</div>
                    <div className="f-lbl">Display Name</div>
                    <input className={`f-inp ${displayName.length>0?"ok":""}`} placeholder="How people see you" value={displayName} onChange={e=>setDisplayName(e.target.value)}/>
                    {displayName.length>0&&<div className="f-msg ok">✓ Looking good!</div>}
                    <button className="btn-main" style={{marginTop:20}} disabled={!displayName.trim()} onClick={()=>setIdStep(2)}>Choose Your Handle →</button>
                  </div>
                )}

                {/* STEP 2: Handle */}
                {idStep===2&&(
                  <div className="id-section" style={{animation:"stepIn .3s ease"}}>
                    <div style={{textAlign:"center",marginBottom:20}}>
                      <div style={{fontSize:22,fontWeight:800,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>Pick Your Handle</div>
                      <div style={{fontSize:13,color:"#6b5f8a",marginTop:6}}>Your unique username within VibeZ</div>
                    </div>
                    <div className="f-lbl">ID Prefix</div>
                    <div className="prefix-scroll">
                      {ID_PREFIXES.map(p=><button key={p} className={`prefix-btn ${prefix===p?"on":""}`} onClick={()=>setPrefix(p)}>@{p}</button>)}
                    </div>
                    <div style={{marginTop:14}}>
                      <div className="f-lbl">Handle <span style={{color:"#6b5f8a",fontWeight:400,textTransform:"none",letterSpacing:0}}>— 3–20 chars, letters/numbers/_</span></div>
                      <input className={`f-inp ${handle.length>=3?(handleV.ok?"ok":"err"):""}`} placeholder="e.g. shadowfox" value={handle} onChange={e=>setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} style={{fontFamily:"'JetBrains Mono',monospace"}}/>
                      {handle.length>0&&<div className={`f-msg ${handleV.ok?"ok":"err"}`}>{handleV.ok?"✓":"✕"} {handleV.msg}</div>}
                    </div>
                    <div style={{marginTop:10}}>
                      <div className="f-lbl">Live Preview</div>
                      <div className="handle-preview">
                        <span style={{color:"#6b5f8a"}}>@{prefix}.</span>
                        <span>{handle||""}</span>
                        {!handle&&<div className="handle-cursor"/>}
                        <span style={{color:"#6b5f8a"}}>#????</span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:20}}>
                      <button className="btn-ghost" style={{width:"auto",padding:"12px 20px",margin:0}} onClick={()=>setIdStep(1)}>← Back</button>
                      <button className="btn-main" style={{flex:1}} disabled={!handleV.ok} onClick={()=>setIdStep(3)}>Choose Tag →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Tag (discriminator) */}
                {idStep===3&&(
                  <div className="id-section" style={{animation:"stepIn .3s ease"}}>
                    <div style={{textAlign:"center",marginBottom:16}}>
                      <div style={{fontSize:22,fontWeight:800,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>Pick Your Tag</div>
                      <div style={{fontSize:13,color:"#6b5f8a",marginTop:6}}>The 4-digit tag makes your ID truly unique</div>
                    </div>
                    <div style={{textAlign:"center",marginBottom:16}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,color:"#c4b5fd",animation:"idGlow 2s ease-in-out infinite"}}>@{prefix}.{handle}<span style={{color:"#f472b6"}}>#{selectedTag}</span></div>
                    </div>
                    <div className="f-lbl">Select a Tag</div>
                    <div className="tag-grid">
                      {tagOptions.map(t=><button key={t} className={`tag-btn ${selectedTag===t?"on":""}`} onClick={()=>setSelectedTag(t)}>#{t}</button>)}
                    </div>
                    <button style={{width:"100%",padding:11,background:"none",border:"1px dashed #2a2050",borderRadius:12,color:"#6b5f8a",fontSize:13,cursor:"pointer",marginTop:10,fontFamily:"'Inter',sans-serif",fontWeight:600}} onClick={()=>{const tags=Array.from({length:8},()=>generateTag());setTagOptions(tags);setSelectedTag(tags[0]);}}>
                      🔄 Regenerate Tags
                    </button>
                    <div className="info-box" style={{marginTop:12}}>
                      <div className="info-txt">💡 Your full VibeZ ID will be: <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#a78bfa"}}>@{prefix}.{handle}#{selectedTag}</span> — This is how others find and message you.</div>
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:20}}>
                      <button className="btn-ghost" style={{width:"auto",padding:"12px 20px",margin:0}} onClick={()=>setIdStep(2)}>← Back</button>
                      <button className="btn-main" style={{flex:1}} onClick={()=>setIdStep(4)}>Set Password →</button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Password */}
                {idStep===4&&(
                  <div className="id-section" style={{animation:"stepIn .3s ease"}}>
                    <div style={{textAlign:"center",marginBottom:16}}>
                      <div style={{fontSize:22,fontWeight:800,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>Secure Your Account</div>
                      <div style={{fontSize:13,color:"#6b5f8a",marginTop:6}}>Create a strong password to protect your ID</div>
                    </div>
                    <div className="f-lbl">Password</div>
                    <div style={{position:"relative"}}>
                      <input className={`f-inp ${password.length>0?(pwStrength.passed>=4?"ok":pwStrength.passed>=2?"":"err"):""}`} type={showPw?"text":"password"} placeholder="Create a strong password" value={password} onChange={e=>setPassword(e.target.value)} style={{paddingRight:50}}/>
                      <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#6b5f8a",cursor:"pointer",fontSize:16}}>{showPw?"🙈":"👁️"}</button>
                    </div>
                    {password.length>0&&(
                      <>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                          <div className="pw-bar-wrap" style={{flex:1,marginRight:10}}><div className="pw-bar" style={{width:`${pwStrength.pct}%`,background:pwStrength.color}}/></div>
                          <span style={{fontSize:12,fontWeight:700,color:pwStrength.color}}>{pwStrength.strength}</span>
                        </div>
                        <div className="pw-rules">
                          {pwStrength.rules.map(r=><div key={r.msg} className={`pw-rule ${r.test?"pass":"fail"}`}><span>{r.test?"✓":"○"}</span>{r.msg}</div>)}
                        </div>
                      </>
                    )}
                    <div style={{marginTop:14}}>
                      <div className="f-lbl">Confirm Password</div>
                      <input className={`f-inp ${confirmPw.length>0?(confirmPw===password?"ok":"err"):""}`} type="password" placeholder="Repeat your password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)}/>
                      {confirmPw.length>0&&<div className={`f-msg ${confirmPw===password?"ok":"err"}`}>{confirmPw===password?"✓ Passwords match":"✕ Passwords don't match"}</div>}
                    </div>
                    <div style={{display:"flex",gap:10,marginTop:20}}>
                      <button className="btn-ghost" style={{width:"auto",padding:"12px 20px",margin:0}} onClick={()=>setIdStep(3)}>← Back</button>
                      <button className="btn-main" style={{flex:1}} disabled={pwStrength.passed<3||confirmPw!==password} onClick={()=>setIdStep(5)}>Verify Phone →</button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Phone */}
                {idStep===5&&(
                  <div className="id-section" style={{animation:"stepIn .3s ease"}}>
                    <div style={{textAlign:"center",marginBottom:16}}>
                      <div style={{fontSize:22,fontWeight:800,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>Verify Your Phone</div>
                      <div style={{fontSize:13,color:"#6b5f8a",marginTop:6}}>Your phone links securely to your VibeZ ID</div>
                    </div>
                    <div className="enc-note"><span style={{fontSize:16}}>🔒</span><span className="enc-txt">Your phone number is hashed — VibeZ never stores it in plain text.</span></div>
                    <div className="f-lbl">Phone Number</div>
                    <div className="phone-country">
                      <span className="phone-flag">🇺🇸</span>
                      <span className="phone-code">+1</span>
                      <input className="phone-inp-inner" placeholder="555 000 0000" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} maxLength={10}/>
                    </div>
                    {phone.length===10&&<div className="f-msg ok">✓ Valid number format</div>}
                    <div className="info-box" style={{marginTop:12}}><div className="info-txt">📱 A 6-digit verification code will be sent to confirm this number belongs to you.</div></div>
                    <div style={{display:"flex",gap:10,marginTop:20}}>
                      <button className="btn-ghost" style={{width:"auto",padding:"12px 20px",margin:0}} onClick={()=>setIdStep(4)}>← Back</button>
                      <button className="btn-main" style={{flex:1}} disabled={phone.length<10} onClick={sendOtp}>Send OTP →</button>
                    </div>
                    <button className="btn-ghost" onClick={()=>setIdStep(7)} style={{marginTop:6}}>Skip for now →</button>
                  </div>
                )}

                {/* STEP 6: OTP */}
                {idStep===6&&(
                  <div className="id-section" style={{animation:"stepIn .3s ease"}}>
                    <div style={{textAlign:"center",marginBottom:20}}>
                      <div style={{fontSize:22,fontWeight:800,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>Enter Verification Code</div>
                      <div style={{fontSize:13,color:"#6b5f8a",marginTop:6}}>6-digit code sent to +1 {phone.slice(0,3)} *** {phone.slice(-4)}</div>
                    </div>
                    <div className="otp-grid">
                      {otp.map((v,i)=>(
                        <input key={i} ref={otpRefs[i]} className={`otp-cell ${v?"filled":""}`} maxLength={1} value={v} onChange={e=>handleOtpInput(i,e.target.value)} onKeyDown={e=>{if(e.key==="Backspace"&&!v&&i>0)otpRefs[i-1]?.current?.focus();}} inputMode="numeric"/>
                      ))}
                    </div>
                    <div style={{textAlign:"center",marginTop:10}}>
                      <span style={{fontSize:13,color:"#6b5f8a"}}>Didn't get it? </span>
                      <button style={{background:"none",border:"none",color:"#8b5cf6",fontSize:13,fontWeight:700,cursor:"pointer"}} onClick={()=>{const c=String(Math.floor(100000+Math.random()*900000));setSentOtp(c);setOtp(["","","","","",""]);toast_show(`New OTP sent — Demo: ${c}`,"success");}}>Resend Code</button>
                    </div>
                    <button className="btn-main" style={{marginTop:20}} disabled={otp.join("").length<6} onClick={verifyOtp}>Verify →</button>
                  </div>
                )}

                {/* STEP 7: Success */}
                {idStep===7&&(
                  <div className="id-success-wrap" style={{animation:"stepIn .3s ease"}}>
                    <span className="success-icon">🎉</span>
                    <div className="success-title">VibeZ ID Created!</div>
                    <div className="success-sub">Your secure, encrypted identity is ready. Welcome to the future of private messaging.</div>
                    {/* Final ID Card */}
                    <div className="id-card" style={{textAlign:"left",marginBottom:24}}>
                      <div className="id-card-logo">⚡ VibeZ ID — VERIFIED</div>
                      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                        <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#f472b6)",padding:3}}>
                          <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"#1e1840",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,overflow:"hidden"}}>
                            {profileImg?<img src={profileImg} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt=""/>:avatar}
                          </div>
                        </div>
                        <div>
                          <div style={{fontWeight:800,color:"#ede9fe",fontSize:18,fontFamily:"'Syne',sans-serif"}}>{displayName}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#a78bfa",marginTop:3,animation:"idGlow 2s ease-in-out infinite"}}>{fullId}</div>
                        </div>
                      </div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6b5f8a",marginBottom:8}}>UID: {generateUID()} · {new Date().toLocaleDateString()} · Encrypted</div>
                      <div className="id-card-chips">
                        <span className="id-chip enc">✓ Verified</span>
                        <span className="id-chip e2e">🔐 E2E</span>
                        <span className="id-chip anon">🛡️ Private</span>
                      </div>
                    </div>
                    <button className="btn-main" onClick={finishCreate}>Enter VibeZ ⚡</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ CHAT SCREEN ════ */}
        {screen==="app"&&openId&&oChat&&(()=>{
          const isDM=oChat.type==="dm";
          const cName=getCN(oChat);const cAv=getCA(oChat);
          const isAnon=isDM&&!oChat.revealed&&oChat.count<50;
          const pct=Math.min(Math.round((oChat.count/50)*100),100);
          const peer=isDM?getU(oChat.pid):null;
          const wall=WALLPAPERS.find(w=>w.id===(oChat.wallpaper||"w1"))||WALLPAPERS[0];
          const isAiChat=oChat.type==="ai";
          return(
            <div className="ch-scr">
              <div style={{position:"absolute",inset:0,background:wall.css,backgroundColor:wall.bg,zIndex:0}}/>
              <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%"}}>
                <div className="ch-top">
                  <button className="ico-btn" onClick={()=>{setOpenId(null);setTray(null);setRxnT(null);setVanish(false);setCtxMenu(null);}}>←</button>
                  <div className="ch-ava">{cAv}{peer&&<div className="st-dot" style={{background:peer.status==="online"?"#10b981":peer.status==="away"?"#f59e0b":"#6b5f8a"}}/>}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:16,color:"#ede9fe",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isAnon?<span style={{color:"#c4b5fd"}}>🎭 {cName}</span>:cName}</div>
                    <div style={{fontSize:12,color:"#6b5f8a",fontWeight:600}}>
                      {isDM&&!oChat.revealed?`${oChat.count}/50 msgs — identity hidden`:isDM&&oChat.revealed?<span style={{color:"#8b5cf6"}}>✓ Identity revealed!</span>:oChat.type==="group"?`${oChat.members?.length||0} members`:"VibeZ AI Assistant"}
                    </div>
                  </div>
                  {isDM&&<><button className="ico-btn" onClick={()=>setCall({type:"audio",name:cName,av:cAv})}>📞</button><button className="ico-btn" onClick={()=>setCall({type:"video",name:cName,av:cAv})}>📹</button></>}
                  <button className="ico-btn" onClick={()=>setWallDlg(true)}>🎨</button>
                  <button className="ico-btn" onClick={()=>toast_show("More options soon!")}>⋮</button>
                </div>
                {isDM&&!oChat.revealed&&(<div className="rev-bar"><span style={{fontSize:15}}>🎭</span><div style={{flex:1}}><div className="rev-track"><div className="rev-fill" style={{width:`${pct}%`}}/></div></div><span style={{fontSize:11,color:"#8b5cf6",fontWeight:700,whiteSpace:"nowrap"}}>{oChat.count}/50</span></div>)}
                {oChat.vanishChat&&(<div className="vanish-banner"><span style={{fontSize:22}}>👻</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#2dd4bf"}}>Vanish Chat Mode</div><div style={{fontSize:11,color:"#6b5f8a",marginTop:1}}>Messages auto-delete when you close this chat</div></div><button style={{background:"none",border:"1px solid rgba(45,212,191,.3)",color:"#2dd4bf",fontSize:11,fontWeight:700,padding:"5px 10px",borderRadius:8,cursor:"pointer"}} onClick={toggleVanishChat}>Turn Off</button></div>)}
                <div className="msgs" onClick={()=>{setRxnT(null);setCtxMenu(null);}}>
                  {oChat.msgs.length===0&&(<div style={{textAlign:"center",margin:"auto",paddingTop:60,color:"#6b5f8a"}}><div style={{fontSize:56,marginBottom:12}}>💬</div><div style={{fontWeight:700,fontSize:16,color:"#a89cc8"}}>Say something!</div>{isAnon&&<div style={{fontSize:13,marginTop:8,color:"#8b5cf6",fontWeight:700}}>🎭 Both of you are anonymous</div>}<div style={{fontSize:12,marginTop:12,color:"#6b5f8a"}}>Tip: type <span style={{color:"#2dd4bf",fontFamily:"'JetBrains Mono',monospace"}}>/ai [question]</span> to ask AI anything!</div></div>)}
                  {oChat.msgs.map(msg=>{
                    const isMe=msg.from==="me";const isSys=msg.from==="system";const isAi=msg.from==="ai";
                    if(isSys)return<div key={msg.id} className="mb-sys">{msg.body}</div>;
                    const hasRxn=Object.entries(msg.rxn).some(([,u])=>u.length>0);
                    return(
                      <div key={msg.id} className={`mw ${isMe?"me":"them"}`} style={{position:"relative"}}>
                        {isAi&&<div className="ai-badge" style={{marginBottom:4,marginLeft:2}}>⚡ VibeZ AI</div>}
                        {rxnT===msg.id&&(<div className="rxn-pop" style={{[isMe?"right":"left"]:0}}>{QUICK_RXN.map(e=><button key={e} className="rxn-pb" onClick={ev=>{ev.stopPropagation();addRxn(openId,msg.id,e);}}>{e}</button>)}</div>)}
                        {ctxMenu?.msgId===msg.id&&(<div className="ctx-menu" style={{[isMe?"right":"left"]:0,bottom:"calc(100% + 4px)"}}><div className="ctx-item" onClick={()=>{addRxn(openId,msg.id,"❤️");setCtxMenu(null);}}>❤️ React</div><div className="ctx-item" onClick={()=>starMsg(msg.id)}>{msg.starred?"⭐ Unstar":"⭐ Star"}</div><div className="ctx-item" onClick={()=>{navigator.clipboard?.writeText(msg.body||"");toast_show("Copied!");setCtxMenu(null);}}>📋 Copy</div><div className="ctx-item danger" onClick={()=>deleteMsg(msg.id)}>🗑️ Delete</div></div>)}
                        {msg.kind==="text"&&(<div className={`mb ${isMe?"me":isAi?"ai-msg":"them"}`} onClick={e=>{e.stopPropagation();setRxnT(rxnT===msg.id?null:msg.id);setCtxMenu(null);}} onContextMenu={e=>{e.preventDefault();e.stopPropagation();setCtxMenu({msgId:msg.id});setRxnT(null);}}><div className="mb-txt">{msg.body}{msg.vanish&&<span style={{marginLeft:5,fontSize:11,opacity:.6}}>👻</span>}</div><div className="mb-meta">{msg.starred&&<span style={{fontSize:11,color:"#f59e0b"}}>★</span>}<span className="mb-time">{fmt(msg.ts)}</span>{isMe&&<span className="mb-tick">✓✓</span>}</div></div>)}
                        {msg.kind==="sticker"&&(<div className={`mb mb-stk`} onClick={e=>{e.stopPropagation();setRxnT(rxnT===msg.id?null:msg.id);}}>{msg.body}<div className="mb-meta" style={{opacity:.5}}><span style={{fontSize:11,color:"#6b5f8a"}}>{fmt(msg.ts)}</span></div></div>)}
                        {msg.kind==="image"&&(<div className={`mb ${isMe?"me":"them"}`} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 18px",gap:6}} onClick={e=>{e.stopPropagation();}}><span style={{fontSize:40}}>🖼️</span><span style={{fontSize:13,fontWeight:700,color:isMe?"rgba(255,255,255,.7)":"#6b5f8a"}}>Photo shared</span><div className="mb-meta"><span className="mb-time">{fmt(msg.ts)}</span>{isMe&&<span className="mb-tick">✓✓</span>}</div></div>)}
                        {msg.kind==="audio"&&(<div className={`mb ${isMe?"me":"them"}`} onClick={e=>e.stopPropagation()}><div className="mb-aud"><button className="play-b">▶</button><div style={{flex:1}}><div className="wv"><div className="wv-f"/></div><div style={{fontSize:11,color:isMe?"rgba(255,255,255,.5)":"#6b5f8a",marginTop:3}}>0:12</div></div><span style={{fontSize:18}}>🎵</span></div><div className="mb-meta"><span className="mb-time">{fmt(msg.ts)}</span>{isMe&&<span className="mb-tick">✓✓</span>}</div></div>)}
                        {hasRxn&&(<div className="rxn-row">{Object.entries(msg.rxn).filter(([,u])=>u.length>0).map(([em,us])=><button key={em} className={`rxn-chip ${us.includes("me")?"me":""}`} onClick={e=>{e.stopPropagation();addRxn(openId,msg.id,em);}}>{em}<span style={{fontSize:11,fontWeight:700,color:"#6b5f8a"}}>{us.length}</span></button>)}</div>)}
                      </div>
                    );
                  })}
                  {aiTyping&&(<div className="mw them"><div className="ai-badge" style={{marginBottom:4,marginLeft:2}}>⚡ VibeZ AI</div><div className="ai-typing"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/><span style={{fontSize:11,color:"#2dd4bf",marginLeft:4}}>thinking...</span></div></div>)}
                  <div ref={msgEnd}/>
                </div>
                {tray==="emoji"&&<div className="tray"><div className="tray-lbl">Emojis</div><div className="e-grid">{EMOJIS.map(e=><button key={e} className="e-cell" onClick={()=>{setMsgIn(p=>p+e);inpRef.current?.focus();}}>{e}</button>)}</div></div>}
                {tray==="sticker"&&<div className="tray"><div className="tray-lbl">Stickers</div><div className="sk-grid">{STICKERS.map(s=><button key={s} className="sk-cell" onClick={()=>{sendMsg("sticker",s);setTray(null);}}>{s}</button>)}</div></div>}
                {tray==="attach"&&<div className="tray"><div className="tray-lbl">Attach</div><div className="at-grid">{[{ico:"📸",lbl:"Photo",fn:()=>{sendMsg("image","photo");setTray(null);}},{ico:"🎵",lbl:"Audio",fn:()=>{sendMsg("audio","audio");setTray(null);}},{ico:"📹",lbl:"Video",fn:()=>{toast_show("Video coming soon!");setTray(null);}},{ico:"📁",lbl:"File",fn:()=>{toast_show("Files coming soon!");setTray(null);}}].map(o=><button key={o.lbl} className="at-item" onClick={o.fn}><span style={{fontSize:26}}>{o.ico}</span><span style={{fontSize:12,color:"#a89cc8",fontWeight:600}}>{o.lbl}</span></button>)}</div></div>}
                <div className="inp-bar">
                  <div className="inp-box">
                    <button className="inp-icon" onClick={()=>setTray(t=>t==="attach"?null:"attach")}>📎</button>
                    <input ref={inpRef} className="msg-inp" placeholder={vanish?"👻 Vanish message…":"/ai [question] for AI · Message…"} value={msgIn} onChange={e=>setMsgIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMsg())} onClick={()=>{setRxnT(null);setCtxMenu(null);}}/>
                    <button className="inp-icon" onClick={()=>setTray(t=>t==="emoji"?null:"emoji")}>😊</button>
                    <button className="inp-icon" onClick={()=>setTray(t=>t==="sticker"?null:"sticker")}>🎭</button>
                    {/* 👻 VANISH BUTTON */}
                    <div style={{position:"relative"}}>
                      <button className={`vanish-tog-btn inp-icon ${vanish?"active":""}`} style={{color:vanish?"#2dd4bf":"#6b5f8a"}} onClick={()=>{setVanish(p=>!p);toast_show(vanish?"Vanish off":"👻 Vanish on — message vanishes in 10s");}} title="Toggle Vanish Mode">👻</button>
                      {vanish&&<div className="vanish-ind"/>}
                    </div>
                  </div>
                  {/* 🫧 VANISH CHAT BUTTON */}
                  <button title={oChat.vanishChat?"Vanish Chat ON — tap to disable":"Enable Vanish Chat"} onClick={toggleVanishChat} style={{width:38,height:38,border:`1.5px solid ${oChat.vanishChat?"rgba(45,212,191,.4)":"#2a2050"}`,borderRadius:"50%",background:oChat.vanishChat?"rgba(45,212,191,.15)":"#17122e",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",boxShadow:oChat.vanishChat?"0 0 12px rgba(45,212,191,.3)":"none"}}>
                    {oChat.vanishChat?"💨":"🫧"}
                  </button>
                  <button className="snd-btn" onClick={()=>sendMsg()}>➤</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ════ PRIVACY SUB-SCREEN ════ */}
        {screen==="app"&&!openId&&privSub&&(
          <div className="sub-scr">
            <div className="sub-hdr"><button className="ico-btn" onClick={()=>setPrivSub(null)}>←</button><div style={{fontWeight:800,fontSize:18,color:"#ede9fe",fontFamily:"'Syne',sans-serif"}}>{privSub==="lastSeen"?"Last Seen":privSub==="profilePhoto"?"Profile Photo":privSub==="about"?"About":privSub==="status"?"Status":privSub==="groups"?"Groups":privSub==="liveLocation"?"Live Location":privSub==="defaultMsgTimer"?"Disappearing Messages":privSub==="blocked"?"Blocked":privSub==="twoStep"?"Two-Step Verification":privSub==="changeNumber"?"Change Number":privSub==="autoDelete"?"Auto-Delete":"Privacy"}</div></div>
            <div className="sub-body">
              {(["lastSeen","profilePhoto","about","status","liveLocation"].includes(privSub))&&(<><p style={{fontSize:13,color:"#6b5f8a",marginBottom:14,lineHeight:1.65}}>{privSub==="lastSeen"?"Control who sees when you were last online.":privSub==="profilePhoto"?"Control who sees your profile picture.":privSub==="about"?"Control who sees your bio text.":privSub==="status"?"Control who sees your status updates.":"Control who can see your live location."}</p><RadioGroup opts={VIS} val={priv[privSub]} onChange={v=>{setP(privSub,v);toast_show("Saved ✓","success");}}/>{privSub==="lastSeen"&&<div className="info-box"><div className="info-txt">⚠️ If you hide your Last Seen, you won't see others' either.</div></div>}</>)}
              {privSub==="groups"&&(<><p style={{fontSize:13,color:"#6b5f8a",marginBottom:14,lineHeight:1.65}}>Control who can add you to group chats.</p><RadioGroup opts={GRP} val={priv.groups} onChange={v=>{setP("groups",v);toast_show("Saved ✓","success");}}/></>)}
              {privSub==="defaultMsgTimer"&&(<><p style={{fontSize:13,color:"#6b5f8a",marginBottom:14,lineHeight:1.65}}>Auto-delete messages in new chats after a timer.</p><RadioGroup opts={TMR} val={priv.defaultMsgTimer} onChange={v=>{setP("defaultMsgTimer",v);toast_show("Timer updated ✓","success");}}/></>)}
              {privSub==="blocked"&&(<><p style={{fontSize:13,color:"#6b5f8a",marginBottom:14,lineHeight:1.65}}>Blocked contacts can't message you or see your status.</p>{priv.blocked.length===0?(<div style={{textAlign:"center",padding:"28px 0",color:"#6b5f8a"}}><div style={{fontSize:44,marginBottom:10}}>🚫</div><div style={{fontWeight:700,color:"#a89cc8"}}>No blocked contacts</div></div>):(<div className="priv-sect">{priv.blocked.map(bid=>{const u=getU(bid);return(<div key={bid} className="priv-row"><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#ede9fe"}}>{u.name}</div><div style={{fontSize:12,color:"#6b5f8a"}}>@{u.username}</div></div><button className="btn-sm" style={{background:"rgba(139,92,246,.12)",color:"#a78bfa",border:"1px solid #2a2050",fontSize:12}} onClick={()=>{setP("blocked",priv.blocked.filter(x=>x!==bid));toast_show(`${u.name} unblocked`);}}>Unblock</button></div>);})}</div>)}<div className="sec-lbl">Block Someone</div><div className="priv-sect">{USERS.filter(u=>!priv.blocked.includes(u.id)).map((u,i,arr)=>(<div key={u.id} className="priv-row" style={{borderTop:i===0?"none":"1px solid #1a1535"}}><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#ede9fe"}}>{u.name}</div><div style={{fontSize:12,color:"#6b5f8a"}}>{u.vibeId}</div></div><button className="btn-sm" style={{background:"rgba(239,68,68,.1)",color:"#ef4444",border:"1px solid rgba(239,68,68,.2)",fontSize:12}} onClick={()=>{setP("blocked",[...priv.blocked,u.id]);toast_show(`${u.name} blocked`);}}>Block</button></div>))}</div></>)}
              {privSub==="twoStep"&&(<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:64,marginBottom:14}}>🔑</div><div style={{fontSize:20,fontWeight:800,color:"#ede9fe",marginBottom:10,fontFamily:"'Syne',sans-serif"}}>Two-Step Verification</div><p style={{fontSize:14,color:"#6b5f8a",lineHeight:1.7,marginBottom:24,padding:"0 10px"}}>An extra PIN layer on top of your VibeZ ID. Maximum security for your account.</p><button className="btn-main" onClick={()=>toast_show("Two-step enabled! ✓","success")}>Enable Now</button></div>)}
              {privSub==="changeNumber"&&(<><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:52,marginBottom:12}}>📱</div><p style={{fontSize:14,color:"#6b5f8a",lineHeight:1.7}}>Your VibeZ ID stays the same, but links to your new number.</p></div><div style={{marginBottom:13}}><div className="f-lbl">Current Number</div><input className="f-inp" defaultValue="+1 555 123 4567" readOnly style={{opacity:.5}}/></div><div style={{marginBottom:16}}><div className="f-lbl">New Number</div><input className="f-inp" placeholder="+1 555 000 0000"/></div><button className="btn-main" onClick={()=>toast_show("Verification SMS sent! ✓","success")}>Send Verification SMS</button></>)}
            </div>
          </div>
        )}

        {/* ════ MAIN SCREENS ════ */}
        {screen==="app"&&!openId&&!privSub&&(
          <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            {/* Modals */}
            {dpDlg&&(<div className="m-overlay" onClick={()=>setDpDlg(false)}><div className="m-sheet" onClick={e=>e.stopPropagation()}><div className="m-handle"/><div className="m-title">Change Profile Photo</div><div className="m-sub">Pick an avatar or upload your photo</div><div className="dp-preview"><div className="dp-preview-inner">{profileImg?<img src={profileImg} alt=""/>:me?.avatar||"😎"}</div></div><div className="sec-lbl" style={{paddingTop:0}}>Choose Avatar</div><div className="dp-grid">{AVATARS.map(a=><div key={a} className={`dp-it ${!profileImg&&me?.avatar===a?"on":""}`} onClick={()=>{setMe(p=>({...p,avatar:a}));setProfileImg(null);toast_show("Avatar updated! ✓","success");setDpDlg(false);}}>{a}</div>)}</div><div className="sec-lbl">Upload Photo</div><input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/><button className="upload-btn" onClick={()=>fileRef.current?.click()}>📷  Choose from Gallery</button>{profileImg&&<button style={{width:"100%",padding:13,background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",color:"#ef4444",borderRadius:14,fontSize:14,fontWeight:700,fontFamily:"'Inter',sans-serif",cursor:"pointer",marginTop:10}} onClick={()=>{setProfileImg(null);toast_show("Photo removed");}}>Remove Photo</button>}</div></div>)}
            {wallDlg&&(<div className="m-overlay" onClick={()=>setWallDlg(false)}><div className="m-sheet" onClick={e=>e.stopPropagation()}><div className="m-handle"/><div className="m-title">Chat Wallpaper</div><div className="m-sub">Choose a background for this chat</div><div className="wall-grid">{WALLPAPERS.map(w=><div key={w.id} className={`wall-it ${(oChat?.wallpaper||"w1")===w.id?"on":""}`} style={{background:w.css,backgroundColor:w.bg}} onClick={()=>setChatWall(w.id)}><div className="wall-lbl">{w.name}</div></div>)}</div></div></div>)}
            {editDlg&&(<div className="m-overlay" onClick={()=>setEditDlg(false)}><div className="m-sheet" onClick={e=>e.stopPropagation()}><div className="m-handle"/><div className="m-title">Edit Profile</div><div style={{marginBottom:14}}><div className="f-lbl">Display Name</div><input className="f-inp" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your name"/></div><div style={{marginBottom:20}}><div className="f-lbl">Bio</div><input className="f-inp" value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Something about you"/></div><button className="btn-main" onClick={()=>{if(editName.trim())setMe(p=>({...p,name:editName,bio:editBio}));setEditDlg(false);toast_show("Profile saved! ✓","success");}}>Save Changes</button></div></div>)}
            {grpDlg&&(<div className="m-overlay" onClick={()=>setGrpDlg(false)}><div className="m-sheet" onClick={e=>e.stopPropagation()}><div className="m-handle"/><div className="m-title">New Group</div><div className="m-sub">Create a group and add friends</div><div style={{marginBottom:14}}><div className="f-lbl">Group Name</div><input className="f-inp" placeholder="e.g. Dev Squad 🚀" value={grpName} onChange={e=>setGrpName(e.target.value)}/></div><div className="f-lbl">Add Members</div>{USERS.map(u=><div key={u.id} className="u-row" onClick={()=>setGrpMems(p=>p.includes(u.id)?p.filter(x=>x!==u.id):[...p,u.id])}><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub">{u.vibeId}</div></div><div className={`chk-c ${grpMems.includes(u.id)?"on":""}`}>{grpMems.includes(u.id)?"✓":""}</div></div>)}<button className="btn-main" style={{marginTop:16,opacity:grpName.trim()?1:.5}} onClick={mkGrp} disabled={!grpName.trim()}>Create Group 🚀</button></div></div>)}
            {freqDlg&&(<div className="m-overlay" onClick={()=>setFreqDlg(false)}><div className="m-sheet" onClick={e=>e.stopPropagation()}><div className="m-handle"/><div className="m-title">Friend Requests 🫶</div>{pendIn.length===0&&pendOut.length===0&&friends.length===0&&(<div style={{textAlign:"center",padding:"36px 0",color:"#6b5f8a"}}><div style={{fontSize:48,marginBottom:10}}>🫶</div><div style={{fontWeight:700,color:"#a89cc8"}}>No requests yet</div><div style={{fontSize:13,marginTop:6}}>Add people from the Contacts tab</div></div>)}{pendIn.length>0&&<><div className="sec-lbl">Incoming ({pendIn.length})</div>{pendIn.map(r=>{const u=getU(r.from);return(<div key={r.id} className="fr-card"><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub">{u.vibeId}</div></div><div className="fr-acts"><button className="btn-sm btn-acc" onClick={()=>accFR(r.id)}>✓ Accept</button><button className="btn-sm btn-dec" onClick={()=>decFR(r.id)}>✕</button></div></div>);})}</>}{pendOut.length>0&&<><div className="sec-lbl">Sent</div>{pendOut.map(r=>{const u=getU(r.to);return(<div key={r.id} className="fr-card"><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub">{u.vibeId}</div></div><div style={{fontSize:12,color:"#6b5f8a",background:"#231b48",padding:"5px 11px",borderRadius:20,fontWeight:700}}>⏳ Pending</div></div>);})}</>}{friends.length>0&&<><div className="sec-lbl">Friends ({friends.length})</div>{friends.map(fid=>{const u=getU(fid);return(<div key={fid} className="fr-card"><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub" style={{color:u.status==="online"?"#10b981":"#6b5f8a"}}>● {u.status}</div></div><button className="btn-sm btn-msg" onClick={()=>{openDM(fid);setFreqDlg(false);}}>💬</button></div>);})}</>}</div></div>)}
            {starredDlg&&(<div className="m-overlay" onClick={()=>setStarredDlg(false)}><div className="m-sheet" onClick={e=>e.stopPropagation()}><div className="m-handle"/><div className="m-title">⭐ Starred Messages</div>{starredMsgs.length===0?(<div style={{textAlign:"center",padding:"32px 0",color:"#6b5f8a"}}><div style={{fontSize:44,marginBottom:10}}>⭐</div><div style={{fontWeight:700,color:"#a89cc8"}}>No starred messages</div><div style={{fontSize:13,marginTop:6}}>Right-click/long-press a message to star it</div></div>):starredMsgs.map(m=>(<div key={m.id} style={{background:"#17122e",border:"1px solid #2a2050",borderRadius:14,padding:"12px 14px",marginBottom:8}}><div style={{fontSize:11,color:"#8b5cf6",fontWeight:700,marginBottom:5}}>From: {m.chatName}</div><div style={{fontSize:14,color:"#ede9fe"}}>{m.body}</div><div style={{fontSize:11,color:"#6b5f8a",marginTop:4}}>{fmt(m.ts)}</div></div>))}</div></div>)}

            {/* Header */}
            <div className="hdr">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className="hdr-brand">VibeZ</div>
                <div className="hdr-enc"><span style={{fontSize:12}}>🔒</span><span className="hdr-enc-txt">E2E</span></div>
              </div>
              <div className="hdr-line"/>
              <div style={{display:"flex",gap:2,alignItems:"center"}}>
                {page==="chats"&&<><button className="ico-btn" onClick={()=>{setShowSrch(p=>!p);setSrch("");}}>🔍</button><button className="ico-btn" onClick={()=>setStarredDlg(true)}>⭐</button><button className="ico-btn" onClick={()=>setGrpDlg(true)}>👥</button></>}
                {page==="friends"&&<button className="ico-btn" style={{position:"relative"}} onClick={()=>setFreqDlg(true)}>{pendIn.length>0&&<span className="n-badge">{pendIn.length}</span>}📋</button>}
                {me&&<button className="ico-btn" style={{fontSize:22,width:36,height:36,border:"2px solid #2a2050",borderRadius:"50%",overflow:"hidden",padding:0}} onClick={()=>setPage("profile")}>{profileImg?<img src={profileImg} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:me.avatar}</button>}
              </div>
            </div>
            {showSrch&&page==="chats"&&(<div className="srch-bar"><div className="srch-inner"><span style={{fontSize:16,color:"#6b5f8a"}}>🔍</span><input className="srch-inp" placeholder="Search chats…" value={srch} onChange={e=>setSrch(e.target.value)} autoFocus/></div></div>)}

            <div style={{flex:1,overflowY:"auto"}}>
              {/* CHATS */}
              {page==="chats"&&(<div>
                {/* AI Chat shortcut */}
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 15px",cursor:"pointer",borderBottom:"1px solid #17122e",background:"linear-gradient(135deg,rgba(45,212,191,.05),rgba(139,92,246,.05))"}} onClick={()=>{const aiChat=chats.find(c=>c.type==="ai");if(aiChat){setOpenId(aiChat.id);return;}const nc={id:uid(),type:"ai",pid:"ai",vanishChat:false,msgs:[{id:uid(),from:"ai",kind:"text",body:"Hi! I'm VibeZ AI powered by Google Gemini ⚡ Ask me anything — I can help with coding, writing, ideas, or just chat! Type /ai [question] in any chat too!",ts:Date.now(),rxn:{},seen:true,starred:false}],count:0,revealed:true,wallpaper:"w1",muted:false,pinned:false};setChats(p=>[nc,...p]);setOpenId(nc.id);}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#0d1a2e,#0a1628)",border:"2px solid rgba(45,212,191,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:"0 0 14px rgba(45,212,191,.2)"}}>⚡</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16,color:"#2dd4bf"}}>VibeZ AI</div><div style={{fontSize:13,color:"#6b5f8a"}}>Powered by Google Gemini — Ask me anything!</div></div>
                  <div style={{fontSize:11,color:"#2dd4bf",background:"rgba(45,212,191,.1)",border:"1px solid rgba(45,212,191,.2)",borderRadius:8,padding:"3px 8px",fontWeight:700}}>AI</div>
                </div>
                {filtChats.length===0&&!srch&&null}
                {filtChats.map(c=>{const last=c.msgs[c.msgs.length-1];const isGrp=c.type==="group";const rev=c.revealed||isGrp||c.type==="ai";const peer=!isGrp&&c.type!=="ai"?getU(c.pid):null;return(<div key={c.id} className="c-row" onClick={()=>setOpenId(c.id)}><div className={`c-ava ${peer?.status||""}`}>{getCA(c)}{peer&&<div className="st-dot" style={{background:peer.status==="online"?"#10b981":peer.status==="away"?"#f59e0b":"#6b5f8a"}}/>}{isGrp&&<div style={{position:"absolute",bottom:0,right:0,fontSize:12,background:"#17122e",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #080612"}}>👥</div>}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><div style={{fontWeight:700,fontSize:16,color:"#ede9fe",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:8}}>{isGrp?c.name:!rev?<span style={{color:"#c4b5fd"}}>🎭 {getCN(c)}</span>:getCN(c)}</div><div style={{fontSize:11,color:"#6b5f8a",flexShrink:0}}>{last?fmt(last.ts):""}</div></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,color:"#6b5f8a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:8}}>{c.vanishChat&&<span className="vanish-tag" style={{marginRight:5,fontSize:10}}>👻</span>}{last?(last.kind==="sticker"?`${last.body} sticker`:last.kind==="audio"?"🎵 Audio":last.kind==="image"?"📸 Photo":last.body):"Tap to start chatting"}</div>{!rev&&c.type==="dm"&&<div className="anon-tag">{c.count}/50</div>}</div></div></div>);})}
              </div>)}

              {/* CONTACTS */}
              {page==="contacts"&&(<div style={{padding:"10px 0"}}><div style={{padding:"0 13px 8px"}}><div className="srch-inner"><span style={{fontSize:16,color:"#6b5f8a"}}>🔍</span><input className="srch-inp" placeholder="Search by name or VibeZ ID…" value={srch} onChange={e=>setSrch(e.target.value)}/></div></div>{USERS.filter(u=>!srch||u.name.toLowerCase().includes(srch.toLowerCase())||u.vibeId.includes(srch)||u.username.includes(srch)).map(u=>{const fs=getFS(u.id);return(<div key={u.id} className="fr-card" style={{margin:"5px 13px"}}><div className="u-ava">{u.avatar}<div className="st-dot" style={{background:u.status==="online"?"#10b981":u.status==="away"?"#f59e0b":"#6b5f8a"}}/></div><div style={{flex:1,minWidth:0}}><div className="u-name">{u.name}</div><div className="u-sub" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{u.vibeId}</div></div><div className="fr-acts">{fs==="friend"&&<button className="btn-sm btn-fri">👫</button>}{fs==="sent"&&<button className="btn-sm btn-snt">⏳</button>}{fs==="incoming"&&<button className="btn-sm btn-acc" onClick={()=>accFR(freqs.find(r=>r.from===u.id&&r.to==="me").id)}>✓ Accept</button>}{fs==="none"&&<button className="btn-sm btn-add" onClick={()=>sendFR(u.id)}>🫶 Add</button>}<button className="btn-sm btn-msg" onClick={()=>openDM(u.id)}>💬</button></div></div>);})}</div>)}

              {/* FRIENDS */}
              {page==="friends"&&(<div style={{padding:"6px 13px"}}>{pendIn.length>0&&(<div style={{background:"rgba(139,92,246,.08)",border:"1px solid rgba(139,92,246,.2)",borderRadius:18,padding:"13px 15px",marginBottom:12,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setFreqDlg(true)}><div style={{fontSize:26}}>🫶</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#c4b5fd",fontSize:15}}>{pendIn.length} Friend Request{pendIn.length>1?"s":""}</div><div style={{fontSize:12,color:"#8b5cf6",marginTop:2}}>Tap to accept or decline</div></div><div style={{color:"#8b5cf6",fontSize:18}}>›</div></div>)}{pendIn.length>0&&<><div className="sec-lbl">Incoming</div>{pendIn.map(r=>{const u=getU(r.from);return(<div key={r.id} className="fr-card"><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{u.vibeId}</div></div><div className="fr-acts"><button className="btn-sm btn-acc" onClick={()=>accFR(r.id)}>✓</button><button className="btn-sm btn-dec" onClick={()=>decFR(r.id)}>✕</button></div></div>);})}</>}{pendOut.length>0&&<><div className="sec-lbl">Sent</div>{pendOut.map(r=>{const u=getU(r.to);return(<div key={r.id} className="fr-card"><div className="u-ava">{u.avatar}</div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub">{u.vibeId}</div></div><div style={{fontSize:12,color:"#6b5f8a",background:"#231b48",padding:"5px 12px",borderRadius:20,fontWeight:700}}>⏳ Pending</div></div>);})}</>}<div className="sec-lbl">My Friends ({friends.length})</div>{friends.length===0&&(<div style={{textAlign:"center",padding:"32px 0",color:"#6b5f8a"}}><div style={{fontSize:44,marginBottom:10}}>🫶</div><div style={{fontWeight:700,color:"#a89cc8"}}>No friends yet</div><div style={{fontSize:13,marginTop:6}}>Add people from Contacts tab</div></div>)}{friends.map(fid=>{const u=getU(fid);return(<div key={fid} className="fr-card"><div className="u-ava">{u.avatar}<div className="st-dot" style={{background:u.status==="online"?"#10b981":u.status==="away"?"#f59e0b":"#6b5f8a"}}/></div><div style={{flex:1}}><div className="u-name">{u.name}</div><div className="u-sub" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{u.vibeId}</div></div><button className="btn-sm btn-msg" onClick={()=>openDM(fid)}>💬 Chat</button></div>);})}</div>)}

              {/* PROFILE */}
              {page==="profile"&&me&&(
                <div style={{paddingBottom:20}}>
                  <div className="prof-hero">
                    <div className="prof-ring" onClick={()=>setDpDlg(true)}>
                      <div className="prof-ring-inner">{profileImg?<img src={profileImg} alt=""/>:me.avatar}</div>
                      <div className="prof-cam">📷</div>
                    </div>
                    <div className="prof-name">{me.name}</div>
                    <div className="prof-id">{me.vibeId||`@vibe.${me.username}#0000`}</div>
                    <div className="prof-bio">{me.bio}</div>
                    {me.verified&&<div style={{display:"flex",justifyContent:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
                      <div className="enc-badge"><span style={{fontSize:14}}>🔐</span><span style={{color:"#10b981",fontSize:13,fontWeight:700}}>E2E Encrypted</span></div>
                      <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(139,92,246,.1)",border:"1px solid rgba(139,92,246,.25)",borderRadius:20,padding:"5px 14px"}}><span style={{fontSize:14}}>✓</span><span style={{color:"#a78bfa",fontSize:13,fontWeight:700}}>Verified ID</span></div>
                    </div>}
                  </div>
                  {/* UID display */}
                  {me.uid&&<div style={{margin:"14px 14px 0",background:"#17122e",border:"1px solid #2a2050",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>🔑</span><div style={{flex:1}}><div style={{fontSize:11,color:"#8b5cf6",fontWeight:700,letterSpacing:.5,textTransform:"uppercase",marginBottom:2}}>Unique ID (UID)</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"#c4b5fd"}}>{me.uid}</div></div><button onClick={()=>{navigator.clipboard?.writeText(me.uid||"");toast_show("UID copied! 📋");}} style={{background:"none",border:"1px solid #2a2050",borderRadius:8,color:"#6b5f8a",fontSize:12,padding:"5px 10px",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Copy</button></div>}
                  <div className="stat-grid">
                    {[{v:chats.filter(c=>c.type==="dm").length,l:"Chats"},{v:chats.filter(c=>c.type==="group").length,l:"Groups"},{v:friends.length,l:"Friends"}].map(s=><div key={s.l} className="stat-box"><div className="stat-v">{s.v}</div><div className="stat-l">{s.l}</div></div>)}
                  </div>
                  <div className="set-section">
                    <div className="set-sect-lbl">Account</div>
                    {[{ico:"👤",bg:"#2d1060",n:"Edit Profile",s:"Name & bio",fn:()=>{setEditName(me.name);setEditBio(me.bio||"");setEditDlg(true);}},{ico:"🖼️",bg:"#1a2040",n:"Change Profile Photo",s:"Avatar or upload",fn:()=>setDpDlg(true)},{ico:"🔔",bg:"#201040",n:"Notifications",s:"Alerts & sounds",fn:()=>toast_show("Coming soon!")},{ico:"💾",bg:"#182040",n:"Storage & Data",s:"14 MB used",fn:()=>toast_show("Coming soon!")},{ico:"⭐",bg:"#1e1040",n:"Starred Messages",s:`${starredMsgs.length} starred`,fn:()=>setStarredDlg(true)}].map(r=>(<div key={r.n} className="set-row" onClick={r.fn}><div className="set-ico" style={{background:r.bg}}>{r.ico}</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#ede9fe",fontSize:15}}>{r.n}</div><div style={{fontSize:12,color:"#6b5f8a",marginTop:1}}>{r.s}</div></div><div style={{color:"#3d3060",fontSize:16}}>›</div></div>))}
                  </div>
                  {PRIV_SECTIONS.map(section=>(<div key={section.title} className="set-section"><div className="set-sect-lbl">{section.title}</div>{section.items.map(item=>{if(item.type==="toggle")return(<div key={item.key} className="priv-row" onClick={()=>{setP(item.key,!priv[item.key]);toast_show(`${item.name} ${!priv[item.key]?"enabled":"disabled"}`,"success");}}><div className="priv-ico" style={{background:item.bg}}>{item.ico}</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#ede9fe",fontSize:15}}>{item.name}</div></div><Toggle on={priv[item.key]} onChange={v=>{setP(item.key,v);toast_show(`${item.name} ${v?"enabled":"disabled"}`,"success");}}/></div>);return(<div key={item.key} className="priv-row" onClick={()=>setPrivSub(item.key)}><div className="priv-ico" style={{background:item.bg}}>{item.ico}</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#ede9fe",fontSize:15}}>{item.name}</div></div>{item.type!=="nav"&&priv[item.key]&&<div style={{fontSize:13,color:"#8b5cf6",fontWeight:600}}>{fmtVal(priv[item.key])}</div>}<div style={{color:"#3d3060",fontSize:16,marginLeft:4}}>›</div></div>);})}</div>))}
                  <div style={{padding:"0 14px"}}><button onClick={()=>setScreen("id-auth")} style={{width:"100%",padding:15,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",color:"#ef4444",borderRadius:16,fontSize:15,fontWeight:700,fontFamily:"'Inter',sans-serif",cursor:"pointer"}}>Log Out 👋</button></div>
                </div>
              )}
            </div>

            {/* Bottom Nav */}
            <div className="bot-nav">
              {[{id:"chats",ico:"💬",lbl:"Chats"},{id:"contacts",ico:"📋",lbl:"Contacts"},{id:"friends",ico:"🫶",lbl:"Friends",badge:pendIn.length},{id:"profile",ico:"👤",lbl:"Profile"}].map(n=>(
                <button key={n.id} className={`n-btn ${page===n.id?"on":""}`} onClick={()=>{setPage(n.id);setSrch("");setShowSrch(false);}}>
                  <span style={{fontSize:22,lineHeight:1,position:"relative",display:"inline-block"}}>
                    {n.ico}
                    {n.badge>0&&<span className="n-badge">{n.badge}</span>}
                  </span>
                  <span>{n.lbl}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

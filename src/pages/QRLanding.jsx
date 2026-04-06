import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "https://asistence-controller-backend-production.up.railway.app/api";

/* ─── Design tokens ─── */
const T = {
  yellow:"#F5B800",yellowHov:"#FFD23F",yellowGlow:"rgba(245,184,0,0.15)",
  black:"#0A0A0A",dark1:"#111111",dark2:"#181818",dark3:"#222222",dark4:"#2A2A2A",
  border:"#2E2E2E",text:"#FFFFFF",textSub:"#AAAAAA",textMute:"#666666",
  success:"#4ADE80",danger:"#F87171",warning:"#FBBF24",info:"#60A5FA",
};

const DAYS  = ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"];
const DAY_LABELS = { LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado" };
const MEALS = [
  { id:"desayuno",label:"Desayuno",     icon:"🌅",color:"#FBBF24" },
  { id:"media",   label:"Media mañana", icon:"🍎",color:"#4ADE80" },
  { id:"almuerzo",label:"Almuerzo",     icon:"🍽️",color:"#60A5FA" },
  { id:"merienda",label:"Merienda",     icon:"🥤",color:"#A78BFA" },
  { id:"cena",    label:"Cena",         icon:"🌙",color:"#FB923C" },
];
const MUSCLE_GROUPS = [
  {id:"pecho",label:"Pecho",icon:"🫁",color:"#F87171"},{id:"espalda",label:"Espalda",icon:"🔙",color:"#60A5FA"},
  {id:"biceps",label:"Bíceps",icon:"💪",color:"#F5B800"},{id:"triceps",label:"Tríceps",icon:"🦾",color:"#A78BFA"},
  {id:"hombros",label:"Hombros",icon:"🏋️",color:"#34D399"},{id:"abdomen",label:"Abdomen",icon:"⬛",color:"#FBBF24"},
  {id:"piernas",label:"Piernas",icon:"🦵",color:"#F472B6"},{id:"gluteos",label:"Glúteos",icon:"🍑",color:"#FB7185"},
  {id:"pantorrilla",label:"Pantorrillas",icon:"🦶",color:"#6EE7B7"},{id:"antebrazo",label:"Antebrazo",icon:"🤜",color:"#FB923C"},
];

function injectFont() {
  if (document.getElementById("solgym-font")) return;
  const l = document.createElement("link"); l.id="solgym-font"; l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(l);
}

function Badge({text,color}){return <span style={{background:`${color}22`,color,padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"700",whiteSpace:"nowrap"}}>{text}</span>;}

function PBtn({children,onClick,variant="primary",disabled,full,style:extra}){
  const [hov,setHov]=useState(false);
  const s={primary:{bg:T.yellow,fg:"#000",hov:T.yellowHov},ghost:{bg:T.yellowGlow,fg:T.yellow,hov:"rgba(245,184,0,0.25)"},outline:{bg:"transparent",fg:T.textSub,hov:T.dark3}}[variant];
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{background:hov?s.hov:s.bg,color:s.fg,border:variant==="outline"?`1px solid ${T.border}`:"none",borderRadius:"10px",padding:"12px 22px",cursor:disabled?"not-allowed":"pointer",fontSize:"13px",fontWeight:"700",fontFamily:"Nunito, sans-serif",width:full?"100%":undefined,opacity:disabled?0.5:1,transition:"background 0.15s",...extra}}>{children}</button>;
}

/* Steps */
function StepSearch({onSelect}){
  const [query,setQuery]=useState("");
  const [results,setResults]=useState([]);
  const [searching,setSearching]=useState(false);
  useEffect(()=>{
    if(query.trim().length<2){setResults([]);return;}
    const t=setTimeout(async()=>{
      setSearching(true);
      try{const r=await fetch(`${API}/members/public/search?search=${encodeURIComponent(query)}`);setResults(await r.json());}
      catch{}finally{setSearching(false);}
    },300);
    return()=>clearTimeout(t);
  },[query]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"48px",marginBottom:"8px"}}>🏋️</div>
        <h2 style={{color:T.yellow,fontFamily:"Bebas Neue, sans-serif",fontSize:"32px",letterSpacing:"2px",margin:"0 0 6px"}}>REGISTRO DE ASISTENCIA</h2>
        <p style={{color:T.textSub,fontSize:"13px",margin:0}}>Busca tu nombre para registrar tu ingreso</p>
      </div>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:T.textMute,fontSize:"16px"}}>🔍</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Escribe tu nombre y apellido..."
          style={{width:"100%",boxSizing:"border-box",background:T.dark3,border:`2px solid ${T.yellow}`,borderRadius:"12px",padding:"14px 14px 14px 44px",color:T.text,fontSize:"15px",outline:"none",fontFamily:"Nunito, sans-serif"}}/>
      </div>
      {searching&&<p style={{color:T.textMute,fontSize:"12px",textAlign:"center",margin:0}}>Buscando...</p>}
      {results.length>0&&(
        <div style={{background:T.dark2,borderRadius:"12px",border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {results.map(u=>(
            <div key={u.id} onClick={()=>onSelect(u)} style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:"14px",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.dark3} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:"42px",height:"42px",borderRadius:"50%",background:T.yellowGlow,border:`1px solid ${T.yellow}44`,display:"flex",alignItems:"center",justifyContent:"center",color:T.yellow,fontWeight:"800",fontSize:"16px",fontFamily:"Bebas Neue, sans-serif",flexShrink:0}}>{u.name[0]}</div>
              <div style={{flex:1}}>
                <p style={{color:T.text,margin:0,fontWeight:"700",fontSize:"15px"}}>{u.name}</p>
                <p style={{color:T.textMute,margin:"2px 0 0",fontSize:"12px"}}>Plan {u.plan??"-"} {u.daysLeft!==null&&u.daysLeft<=7?`· ⚠️ ${u.daysLeft}d`:""}</p>
              </div>
              <span style={{color:T.yellow,fontSize:"20px"}}>→</span>
            </div>
          ))}
        </div>
      )}
      {query.trim().length>=2&&results.length===0&&!searching&&(
        <div style={{background:T.dark2,borderRadius:"12px",border:`1px solid ${T.border}`,padding:"24px",textAlign:"center",color:T.textMute,fontSize:"13px"}}>No se encontró ningún miembro</div>
      )}
    </div>
  );
}

function StepEmail({user,onSend,onBack}){
  const [email,setEmail]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(false);
  const submit=()=>{
    if(!email.trim()){setError("Ingresa tu correo");return;}
    if(email.toLowerCase()!==user.email.toLowerCase()){setError("El correo no coincide con el registrado");return;}
    setLoading(true);setTimeout(()=>{setLoading(false);onSend(email);},600);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{background:T.dark3,borderRadius:"12px",padding:"16px 18px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"14px"}}>
        <div style={{width:"46px",height:"46px",borderRadius:"50%",background:T.yellowGlow,border:`1px solid ${T.yellow}44`,display:"flex",alignItems:"center",justifyContent:"center",color:T.yellow,fontWeight:"800",fontSize:"18px",fontFamily:"Bebas Neue, sans-serif",flexShrink:0}}>{user.name[0]}</div>
        <div><p style={{color:T.text,margin:0,fontWeight:"700",fontSize:"16px"}}>{user.name}</p><p style={{color:T.textSub,margin:"2px 0 0",fontSize:"12px"}}>Plan {user.plan??"-"}</p></div>
      </div>
      <div><h3 style={{color:T.text,fontFamily:"Bebas Neue, sans-serif",fontSize:"22px",letterSpacing:"1px",margin:"0 0 6px"}}>VERIFICA TU CORREO</h3><p style={{color:T.textSub,fontSize:"13px",margin:0}}>Ingresa el correo con el que te registraste</p></div>
      <div>
        <label style={{color:T.textSub,fontSize:"11px",letterSpacing:"0.8px",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>Correo electrónico</label>
        <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}} placeholder="tu@correo.com" onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{width:"100%",boxSizing:"border-box",background:T.dark3,border:`2px solid ${error?T.danger:T.border}`,borderRadius:"12px",padding:"13px 16px",color:T.text,fontSize:"14px",outline:"none",fontFamily:"Nunito, sans-serif"}}/>
        {error&&<p style={{color:T.danger,fontSize:"12px",margin:"6px 0 0"}}>⚠ {error}</p>}
      </div>
      <div style={{display:"flex",gap:"10px"}}><PBtn variant="outline" onClick={onBack} style={{flex:1}}>← Volver</PBtn><PBtn onClick={submit} disabled={loading} style={{flex:2}}>{loading?"Enviando...":"📨 Enviar código"}</PBtn></div>
    </div>
  );
}

function StepCode({user,email,code,onVerify,onResend,onBack}){
  const [digits,setDigits]=useState(["","","","","",""]);const [error,setError]=useState("");const [loading,setLoading]=useState(false);const [resent,setResent]=useState(false);const refs=useRef([]);
  const handleInput=(i,val)=>{if(!/^\d*$/.test(val))return;const n=[...digits];n[i]=val.slice(-1);setDigits(n);setError("");if(val&&i<5)refs.current[i+1]?.focus();};
  const handleKey=(i,e)=>{if(e.key==="Backspace"&&!digits[i]&&i>0)refs.current[i-1]?.focus();};
  const handlePaste=e=>{const p=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);if(p.length===6){setDigits(p.split(""));refs.current[5]?.focus();}};
  const verify=()=>{const entered=digits.join("");if(entered.length<6){setError("Ingresa el código completo");return;}setLoading(true);setTimeout(()=>{if(entered===code){onVerify();}else{setError("Código incorrecto");setDigits(["","","","","",""]);refs.current[0]?.focus();}setLoading(false);},400);};
  const resend=()=>{onResend();setResent(true);setDigits(["","","","","",""]);refs.current[0]?.focus();setTimeout(()=>setResent(false),3000);};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"22px"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:"40px",marginBottom:"8px"}}>📬</div><h3 style={{color:T.text,fontFamily:"Bebas Neue, sans-serif",fontSize:"24px",letterSpacing:"1px",margin:"0 0 8px"}}>CÓDIGO ENVIADO</h3><p style={{color:T.textSub,fontSize:"13px",margin:0}}>Revisa tu correo <span style={{color:T.yellow,fontWeight:"700"}}>{email}</span></p></div>
      <div style={{background:T.dark3,borderRadius:"10px",padding:"10px 14px",border:`1px solid ${T.border}`,textAlign:"center"}}><p style={{color:T.textMute,fontSize:"10px",margin:"0 0 2px",letterSpacing:"1px"}}>MODO DEMO — código</p><p style={{color:T.yellow,fontSize:"20px",fontWeight:"800",fontFamily:"Bebas Neue, sans-serif",letterSpacing:"4px",margin:0}}>{code}</p></div>
      <div style={{display:"flex",gap:"8px",justifyContent:"center"}} onPaste={handlePaste}>
        {digits.map((d,i)=><input key={i} ref={el=>refs.current[i]=el} value={d} onChange={e=>handleInput(i,e.target.value)} onKeyDown={e=>handleKey(i,e)} maxLength={1} inputMode="numeric"
          style={{width:"44px",height:"54px",textAlign:"center",background:T.dark3,border:`2px solid ${d?T.yellow:error?T.danger:T.border}`,borderRadius:"10px",color:T.text,fontSize:"22px",fontWeight:"800",fontFamily:"Bebas Neue, sans-serif",outline:"none"}}/>)}
      </div>
      {error&&<p style={{color:T.danger,fontSize:"12px",textAlign:"center",margin:"-10px 0 0"}}>⚠ {error}</p>}
      <PBtn onClick={verify} disabled={loading||digits.join("").length<6} full>{loading?"Verificando...":"✅ Confirmar código"}</PBtn>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:T.textMute,cursor:"pointer",fontSize:"12px",fontFamily:"Nunito, sans-serif"}}>← Volver</button>
        {resent?<span style={{color:T.success,fontSize:"12px"}}>✓ Reenviado</span>:<button onClick={resend} style={{background:"none",border:"none",color:T.yellow,cursor:"pointer",fontSize:"12px",fontFamily:"Nunito, sans-serif",textDecoration:"underline"}}>Reenviar código</button>}
      </div>
    </div>
  );
}

function StepSuccess({user,onViewProfile}){
  const now=new Date();
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"20px",textAlign:"center"}}>
      <div><div style={{fontSize:"60px",marginBottom:"10px"}}>🎉</div><h2 style={{color:T.success,fontFamily:"Bebas Neue, sans-serif",fontSize:"28px",letterSpacing:"1px",margin:"0 0 6px"}}>¡ASISTENCIA REGISTRADA!</h2><p style={{color:T.textSub,fontSize:"14px",margin:0}}>Bienvenido/a, <span style={{color:T.yellow,fontWeight:"700"}}>{user.name.split(" ")[0]}</span></p></div>
      <div style={{background:T.dark3,borderRadius:"12px",padding:"18px",border:`1px solid ${T.success}33`}}>
        <p style={{color:T.textMute,fontSize:"11px",margin:"0 0 4px",letterSpacing:"0.8px"}}>ENTRADA REGISTRADA</p>
        <p style={{color:T.yellow,fontFamily:"Bebas Neue, sans-serif",fontSize:"36px",margin:0,letterSpacing:"2px"}}>{now.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"})}</p>
        <p style={{color:T.textSub,fontSize:"12px",margin:"4px 0 0",textTransform:"capitalize"}}>{now.toLocaleDateString("es-PE",{weekday:"long",day:"2-digit",month:"long"})}</p>
      </div>
      {user.daysLeft!==null&&user.daysLeft<=7&&<div style={{background:"rgba(251,191,36,0.1)",border:`1px solid ${T.warning}44`,borderRadius:"10px",padding:"12px 16px"}}><p style={{color:T.warning,fontSize:"13px",fontWeight:"700",margin:0}}>⚠️ Tu membresía vence en {user.daysLeft} día{user.daysLeft!==1?"s":""}</p></div>}
      <PBtn onClick={onViewProfile} full style={{padding:"14px",fontSize:"14px"}}>👤 Ver mi rutina y alimentación →</PBtn>
    </div>
  );
}

function MemberProfile({user,routines,nutrition,onLogout}){
  const [tab,setTab]=useState("rutina");
  const [activeDay,setActiveDay]=useState("LUNES");
  const muscleInfo=id=>MUSCLE_GROUPS.find(m=>m.id===id)??{label:id,color:T.textMute,icon:"💪"};
  const dayExercises=routines[activeDay]??[];
  const dayMeals=nutrition[activeDay]??{};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{background:T.dark2,borderRadius:"14px",padding:"16px 18px",border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"14px"}}>
        <div style={{width:"50px",height:"50px",borderRadius:"50%",background:`linear-gradient(135deg,${T.yellow},#C89300)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:"800",fontSize:"20px",fontFamily:"Bebas Neue, sans-serif",flexShrink:0}}>{user.name[0]}</div>
        <div style={{flex:1}}><p style={{color:T.text,margin:0,fontWeight:"700",fontSize:"16px"}}>{user.name}</p><p style={{color:T.textSub,margin:"2px 0 0",fontSize:"12px"}}>Plan {user.plan??"-"}</p></div>
        <button onClick={onLogout} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:"8px",padding:"6px 12px",color:T.textMute,cursor:"pointer",fontSize:"11px",fontFamily:"Nunito, sans-serif"}}>Salir</button>
      </div>
      <div style={{display:"flex",background:T.dark2,borderRadius:"10px",padding:"3px",border:`1px solid ${T.border}`}}>
        {[["rutina","🏋️ Mi Rutina"],["nutricion","🥗 Mi Alimentación"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:tab===id?T.yellow:"transparent",color:tab===id?"#000":T.textSub,border:"none",borderRadius:"8px",padding:"10px",cursor:"pointer",fontSize:"13px",fontWeight:"700",fontFamily:"Nunito, sans-serif"}}>{label}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:"4px",overflowX:"auto"}}>
        {DAYS.map(day=>{
          const count=tab==="rutina"?(routines[day]??[]).length:Object.values(nutrition[day]??{}).filter(m=>m?.food).length;
          return(<button key={day} onClick={()=>setActiveDay(day)} style={{background:activeDay===day?T.yellow:T.dark3,color:activeDay===day?"#000":T.textSub,border:`1px solid ${activeDay===day?T.yellow:T.border}`,borderRadius:"8px",padding:"7px 12px",cursor:"pointer",fontSize:"11px",fontWeight:"700",fontFamily:"Nunito, sans-serif",whiteSpace:"nowrap",flexShrink:0}}>
            {DAY_LABELS[day]}{count>0&&<span style={{marginLeft:"5px",background:activeDay===day?"#00000033":`${T.yellow}33`,color:activeDay===day?"#000":T.yellow,fontSize:"9px",padding:"1px 5px",borderRadius:"8px"}}>{count}</span>}
          </button>);
        })}
      </div>
      {tab==="rutina"&&(
        dayExercises.length===0
          ?<div style={{padding:"32px",textAlign:"center",color:T.textMute,fontSize:"13px",background:T.dark3,borderRadius:"12px",border:`1px dashed ${T.border}`}}>Sin ejercicios para {DAY_LABELS[activeDay]}</div>
          :<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {dayExercises.map((ex,i)=>{const mg=muscleInfo(ex.muscle);return(
              <div key={ex.uid??i} style={{background:T.dark3,borderRadius:"10px",padding:"14px 16px",border:`1px solid ${T.border}`,display:"flex",gap:"12px",alignItems:"center"}}>
                <div style={{width:"28px",height:"28px",borderRadius:"50%",background:T.yellowGlow,border:`1px solid ${T.yellow}44`,display:"flex",alignItems:"center",justifyContent:"center",color:T.yellow,fontSize:"11px",fontWeight:"800",flexShrink:0,fontFamily:"Bebas Neue, sans-serif"}}>{i+1}</div>
                <div style={{flex:1}}><p style={{color:T.text,margin:"0 0 5px",fontSize:"13px",fontWeight:"700"}}>{ex.name}</p><div style={{display:"flex",gap:"5px"}}><Badge text={`${mg.icon} ${mg.label}`} color={mg.color}/><Badge text={ex.type} color={T.textMute}/></div></div>
                <div style={{display:"flex",gap:"8px"}}>
                  {[{v:ex.sets,l:"Series"},{v:ex.reps,l:"Reps"},{v:ex.rest??ex.restSecs,l:"Seg"}].map(({v,l})=>(
                    <div key={l} style={{textAlign:"center",background:T.dark4,borderRadius:"8px",padding:"6px 10px"}}><p style={{color:T.yellow,fontFamily:"Bebas Neue, sans-serif",fontSize:"18px",margin:0,lineHeight:1}}>{v}</p><p style={{color:T.textMute,fontSize:"9px",margin:"2px 0 0"}}>{l}</p></div>
                  ))}
                </div>
              </div>
            );})}
          </div>
      )}
      {tab==="nutricion"&&(
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {MEALS.map(meal=>{const d=dayMeals[meal.id]??{};const filled=!!d.food?.trim();return(
            <div key={meal.id} style={{background:T.dark3,borderRadius:"10px",padding:"14px 16px",border:`1px solid ${filled?meal.color+"55":T.border}`,borderLeft:`3px solid ${filled?meal.color:T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:filled?"8px":0}}><span style={{fontSize:"18px"}}>{meal.icon}</span><p style={{color:meal.color,margin:0,fontSize:"11px",fontWeight:"700",letterSpacing:"0.8px"}}>{meal.label.toUpperCase()}</p>{!filled&&<p style={{color:T.textMute,margin:0,fontSize:"12px"}}>— Sin planificar</p>}</div>
              {filled&&<><p style={{color:T.text,margin:"0 0 4px",fontSize:"14px",fontWeight:"600"}}>{d.food}</p>{d.notes&&<p style={{color:T.textSub,margin:"0 0 8px",fontSize:"12px",fontStyle:"italic"}}>"{d.notes}"</p>}<div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>{[{k:"calorias",l:"Kcal",c:T.yellow},{k:"proteinas",l:"Proteínas",c:"#60A5FA"},{k:"carbos",l:"Carbos",c:"#FBBF24"},{k:"grasas",l:"Grasas",c:"#F87171"}].map(({k,l,c})=>d[k]?<span key={k} style={{background:`${c}15`,color:c,padding:"2px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:"700"}}>{l}: {d[k]}{k==="calorias"?"kcal":"g"}</span>:null)}</div></>}
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

export default function QRLanding() {
  const [step,   setStep]   = useState("search");
  const [user,   setUser]   = useState(null);
  const [email,  setEmail]  = useState("");
  const [code,   setCode]   = useState("");
  const [routines,  setRoutines]  = useState({});
  const [nutrition, setNutrition] = useState({});

  useEffect(() => { injectFont(); }, []);

  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSelect = (u) => { setUser(u); setStep("email"); };

const handleSendCode = async (em) => {
  try {
    await fetch(`${API}/members/public/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: user.id, email: em }),
    });
    setEmail(em);
    setStep("code");
  } catch (e) {
    alert("Error al enviar código");
  }
};

 const handleVerify = async (enteredCode) => {
  try {
    const r = await fetch(`${API}/members/public/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: user.id, code: enteredCode }),
    });
    const data = await r.json();
    if (!data.verified) throw new Error("Código incorrecto");

    // Registrar asistencia
    await fetch(`${API}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: user.id, verifiedBy: "qr" }),
    });

    // Cargar rutina y nutrición
    const [ro, nu] = await Promise.all([
      fetch(`${API}/routines/public/${user.id}`).then(x => x.json()),
      fetch(`${API}/nutrition/public/${user.id}`).then(x => x.json()),
    ]);
    setRoutines(ro);
    setNutrition(nu);
    setStep("success");
  } catch (e) {
    alert(e.message);
  }
};

  const handleLogout = () => { setStep("search"); setUser(null); setEmail(""); setCode(""); setRoutines({}); setNutrition({}); };

  return (
    <div style={{ minHeight:"100vh", background:T.black, fontFamily:"Nunito, sans-serif", display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 16px 48px" }}>
      <div style={{ width:"100%", maxWidth:"480px", marginBottom:"28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}><span style={{ fontSize:"22px" }}>🏋️</span><span style={{ color:T.yellow, fontFamily:"Bebas Neue, sans-serif", fontSize:"24px", letterSpacing:"3px" }}>SOLGYM</span></div>
        <span style={{ color:T.textMute, fontSize:"11px", letterSpacing:"1px" }}>PORTAL MIEMBROS</span>
      </div>
      <div style={{ width:"100%", maxWidth:"480px", background:T.dark1, borderRadius:"20px", border:`1px solid ${T.border}`, padding:"28px 24px", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
        {step==="search"  && <StepSearch  onSelect={handleSelect} />}
        {step==="email"   && <StepEmail   user={user} onSend={handleSendCode} onBack={()=>setStep("search")} />}
        {step==="code"    && <StepCode    user={user} email={email} code={code} onVerify={handleVerify} onResend={()=>handleSendCode(email)} onBack={()=>setStep("email")} />}
        {step==="success" && <StepSuccess user={user} onViewProfile={()=>setStep("profile")} />}
        {step==="profile" && <MemberProfile user={user} routines={routines} nutrition={nutrition} onLogout={handleLogout} />}
      </div>
      <p style={{ color:T.textMute, fontSize:"11px", marginTop:"24px" }}>SOLGYM 2829 · Sistema de gestión</p>
    </div>
  );
}

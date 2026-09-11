
const lessons = [
  {id:'SS', title:'SS — Velocidad de obturación', tag:'Movimiento', body:`SS decide cuánto tiempo captura luz el sensor. En deporte, cuanto más rápido sea el obturador, mejor congelas al jugador. 1/1000 congela mucho más que 1/125. El precio: cuanto más rápido disparas, menos luz entra. Regla mental: <b>movimiento borroso → sube SS</b>.`},
  {id:'ISO', title:'ISO — Ganancia / sensibilidad', tag:'Luz y ruido', body:`Subir ISO hace que la imagen resulte más luminosa, pero aumenta el ruido. En deporte interior, muchas veces es mejor aceptar ISO alto que obtener una foto movida. Regla mental: <b>necesito luz pero no puedo bajar SS → sube ISO</b>.`},
  {id:'F', title:'F — Apertura', tag:'Luz y profundidad', body:`Un número F bajo (por ejemplo F2.8) significa una apertura grande: entra más luz y la profundidad de campo disminuye. Un F alto (F8) deja entrar menos luz y aumenta la zona enfocada. En pabellón suele interesar abrir bastante si el objetivo lo permite.`},
  {id:'MODOS', title:'Modos P · A · S · M', tag:'Control', body:`<b>M</b>: tú controlas SS y F; el ISO puede ser manual o automático. <b>S</b>: eliges SS y la cámara busca apertura. <b>A</b>: eliges F y la cámara busca SS. <b>P</b>: la cámara toma más decisiones. Para aprender deporte, M es el destino; S puede ser útil para interiorizar la velocidad.`},
  {id:'AF', title:'AFS · AFF · AFC · MF', tag:'Enfoque GH5', body:`<b>AFS</b>: sujeto quieto. <b>AFC</b>: enfoque continuo, normalmente el más útil para jugadores en movimiento. <b>AFF</b>: intenta detectar si el sujeto empieza a moverse. <b>MF</b>: manual. Si la GH5 enfoca el fondo mientras el jugador corre, revisa AFC y el área de enfoque.`},
  {id:'WB', title:'Balance de blancos', tag:'Color', body:`El balance de blancos corrige dominantes de color. Si la pista sale demasiado amarilla o azul, puedes usar Auto WB o fijar una temperatura Kelvin. No afecta a que el movimiento salga congelado; afecta principalmente al color.`},
];

const questions = [
  {skill:'SS', q:'El jugador está correctamente expuesto, pero las manos y el balón salen movidos. ¿Qué tocarías primero?', opts:['Subir SS','Subir ISO','Subir F','Cambiar WB'], a:0, exp:'Sube SS para congelar mejor el movimiento. Después tendrás que recuperar la luz perdida con ISO o apertura.'},
  {skill:'ISO', q:'Estás en F2.8 y 1/800. La foto sigue oscura y no quieres perder congelación. ¿Qué harías?', opts:['Bajar ISO','Subir ISO','Bajar SS a 1/125','Cerrar a F8'], a:1, exp:'Si necesitas mantener SS alto y ya estás bastante abierto, subir ISO es la solución lógica aunque aumente el ruido.'},
  {skill:'F', q:'¿Qué deja entrar más luz?', opts:['F8','F5.6','F4','F2.8'], a:3, exp:'Cuanto menor es el número F, mayor es la apertura y más luz entra.'},
  {skill:'MODOS', q:'Quieres controlar personalmente velocidad y apertura. ¿Qué modo eliges?', opts:['P','A','S','M'], a:3, exp:'En M controlas tanto SS como F. Es el modo más didáctico para dominar exposición.'},
  {skill:'AF', q:'La cámara enfoca a aficionados quietos detrás del jugador que corre. ¿Qué revisarías?', opts:['AFC y área de enfoque','Balance de blancos','ISO','Formato RAW'], a:0, exp:'Para sujetos móviles necesitas enfoque continuo y un área de enfoque adecuada sobre el jugador.'},
  {skill:'WB', q:'La foto está nítida pero toda la pista sale amarilla. ¿Qué parámetro está implicado?', opts:['SS','ISO','WB','Ráfaga'], a:2, exp:'El balance de blancos corrige la dominante de color.'},
  {skill:'SS', q:'¿Qué congela más el movimiento?', opts:['1/60','1/125','1/250','1/1000'], a:3, exp:'1/1000 es una exposición mucho más corta y congela mejor la acción.'},
  {skill:'F', q:'Si pasas de F2.8 a F5.6 manteniendo todo lo demás, la imagen tenderá a...', opts:['Quedar más clara','Quedar más oscura','Tener más ruido necesariamente','Congelar más movimiento'], a:1, exp:'F5.6 es una apertura menor que F2.8, así que entra menos luz.'},
];

const state = JSON.parse(localStorage.getItem('camlabState') || '{"xp":0,"answered":0,"correct":0,"skills":{},"lastDay":"","streak":0}');
function save(){localStorage.setItem('camlabState',JSON.stringify(state)); renderHeader();}
function renderHeader(){
  document.getElementById('xp').textContent = state.xp || 0;
  document.getElementById('streak').textContent = state.streak || 0;
}
function touchDay(){
  const today = new Date().toISOString().slice(0,10);
  if(state.lastDay === today) return;
  const y = new Date(); y.setDate(y.getDate()-1);
  const yesterday = y.toISOString().slice(0,10);
  state.streak = state.lastDay === yesterday ? (state.streak||0)+1 : 1;
  state.lastDay = today; save();
}
function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='progress') renderProgress();
  if(id==='quiz') newQuestion();
}
function renderLessons(){
  const root = document.getElementById('lessons');
  root.innerHTML = lessons.map((l,i)=>`
    <div class="card lesson" onclick="this.classList.toggle('open')">
      <span class="badge">Nivel ${i+1} · ${l.tag}</span>
      <h3>${l.title}</h3>
      <div class="lesson-body">${l.body}</div>
    </div>`).join('');
}
let currentQ = 0;
function newQuestion(){
  currentQ = Math.floor(Math.random()*questions.length);
  renderQuestion();
}
function renderQuestion(){
  const q = questions[currentQ];
  document.getElementById('quizCard').innerHTML = `
    <span class="badge">${q.skill}</span>
    <h3>${q.q}</h3>
    <div id="opts">${q.opts.map((o,i)=>`<button class="option" onclick="answer(${i})">${o}</button>`).join('')}</div>`;
}
function answer(i){
  const q=questions[currentQ], buttons=[...document.querySelectorAll('.option')];
  buttons.forEach((b,idx)=>{b.disabled=true;if(idx===q.a)b.classList.add('correct');if(idx===i && i!==q.a)b.classList.add('wrong')});
  state.answered=(state.answered||0)+1;
  state.skills[q.skill]=state.skills[q.skill]||{c:0,t:0};
  state.skills[q.skill].t++;
  if(i===q.a){state.correct=(state.correct||0)+1;state.skills[q.skill].c++;state.xp=(state.xp||0)+10;}
  else state.xp=(state.xp||0)+2;
  touchDay(); save();
  document.getElementById('quizCard').insertAdjacentHTML('beforeend',`
    <div class="explain">${q.exp}</div>
    <button class="primary" style="margin-top:14px" onclick="newQuestion()">Siguiente</button>`);
}
const isoVals=[200,400,800,1600,3200,6400,12800];
const ssVals=[60,125,200,250,500,800,1000,1600];
const fVals=[1.8,2.8,4,5.6,8,11,16];

function updateSim(){
  const iso=isoVals[+isoRange.value], ss=ssVals[+ssRange.value], f=fVals[+fRange.value];
  isoOut.textContent=iso; ssOut.textContent='1/'+ss; fOut.textContent=f.toFixed(1);
  let move=Math.min(100, Math.max(10, 20 + (Math.log2(ss/125))*27));
  let noise=Math.min(100, Math.max(5, 12 + (Math.log2(iso/400))*18));
  // referencia aproximada: ISO1600, 1/250, F2.8 = exposición media
  let ev = Math.log2(iso/1600) - Math.log2(ss/250) - 2*Math.log2(f/2.8);
  let light=Math.max(5, Math.min(100, 58 + ev*22));
  setMeter('move',move, move>72?'Muy buena':move>48?'Aceptable':'Movido');
  setMeter('noise',noise, noise>70?'Alto':noise>40?'Medio':'Bajo');
  setMeter('light',light, light>75?'Clara':light>38?'Correcta':'Oscura');
  let tip='';
  if(move<48) tip='Primero resolvería el movimiento: sube SS. Después compensa la pérdida de luz.';
  else if(light<38) tip='Has congelado bien, pero falta luz. Prueba a subir ISO o abrir F.';
  else if(noise>72) tip='La exposición funciona, pero estás pagando mucho en ruido. Si puedes, abre F antes de bajar SS.';
  else tip='Configuración equilibrada para esta simulación. Ahora piensa qué sacrificio aceptarías si cambia la luz.';
  simTip.textContent=tip;
}
function setMeter(id,v,text){document.getElementById(id+'Meter').style.width=v+'%';document.getElementById(id+'Text').textContent=text}

function buildAssist(){
  const use=useType.value, scene=sceneType.value, light=lightType.value;
  let html='';
  if(use==='photo'){
    let ss = scene==='fast'?'1/800–1/1000':scene==='general'?'1/500':'1/250';
    let iso = light==='indoor'?'ISO 1600–3200 como punto de partida':'ISO 200–800 como punto de partida';
    let f = light==='indoor'?'Abre todo lo razonable: F2.8 aprox. si tu objetivo lo permite':'F2.8–F5.6 según fondo y luz';
    html=`<div class="card"><div class="result-big">Punto de partida · Foto</div><div class="result-list">
      <b>Modo:</b> M<br><b>SS:</b> ${ss}<br><b>ISO:</b> ${iso}<br><b>F:</b> ${f}<br><b>AF:</b> AFC para jugadores en movimiento<br><br>
      <b>Orden mental:</b> 1) congela el movimiento con SS, 2) abre F, 3) usa ISO para recuperar luz.
      <br><br><small>Esto es un punto de partida educativo, no una exposición garantizada: la luz real del pabellón manda.</small>
    </div></div>`;
  } else {
    let fps = scene==='fast'?'50/60 fps si quieres movimiento más fluido o posibilidad de ralentizar':'25/30 fps para uso normal';
    html=`<div class="card"><div class="result-big">Punto de partida · Vídeo</div><div class="result-list">
      <b>FPS:</b> ${fps}<br>
      <b>Shutter:</b> como regla de inicio, aproximadamente el doble de los fps (p.ej. 1/100 para 50 fps)<br>
      <b>F:</b> abre si necesitas luz y separación del fondo<br>
      <b>ISO:</b> súbelo solo lo necesario para exponer correctamente<br>
      <b>WB:</b> fija Kelvin si el pabellón cambia de color entre planos.
    </div></div>`;
  }
  assistResult.innerHTML=html;
}
function renderProgress(){
  const names={SS:'SS / movimiento',ISO:'ISO / ruido',F:'F / apertura',MODOS:'Modos',AF:'Enfoque',WB:'Balance blancos'};
  progressBars.innerHTML=Object.keys(names).map(k=>{
    const s=state.skills[k]||{c:0,t:0}; const pct=s.t?Math.round(s.c/s.t*100):0;
    return `<div class="progress-item"><div class="progress-title"><span>${names[k]}</span><b>${pct}%</b></div><div class="progress-track"><i style="width:${pct}%"></i></div></div>`;
  }).join('') + `<div class="explain">Preguntas respondidas: <b>${state.answered||0}</b> · Aciertos: <b>${state.correct||0}</b></div>`;
}
function resetProgress(){
  if(confirm('¿Seguro que quieres reiniciar tu progreso?')){
    localStorage.removeItem('camlabState'); location.reload();
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  renderLessons();renderHeader();updateSim();
  ['isoRange','ssRange','fRange'].forEach(id=>document.getElementById(id).addEventListener('input',updateSim));
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
});

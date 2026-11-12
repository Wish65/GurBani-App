const API="https://api.banidb.com/v2";
const BANIS=[
["Japji Sahib","ਜਪੁਜੀ ਸਾਹਿਬ",["japujee saahib","japji sahib","japujee"]],
["Jaap Sahib","ਜਾਪੁ ਸਾਹਿਬ",["jaap sahib","jaap"]],
["Tav-Prasad Savaiye","ਤ੍ਵਪ੍ਰਸਾਦਿ ਸਵੱਯੇ",["tavprasad savaiye","tav prasad savaiye","tavprasad savaiyye"]],
["Tav-Prasad Chaupai","ਤ੍ਵਪ੍ਰਸਾਦਿ ਚੌਪਈ",["tavprasad chaupai"]],
["Benti Chaupai Sahib","ਬੇਨਤੀ ਚੌਪਈ ਸਾਹਿਬ",["benti chaupai sahib","chaupai sahib"]],
["Anand Sahib","ਅਨੰਦੁ ਸਾਹਿਬ",["anand sahib","anand"]],
["Rehras Sahib","ਰਹਰਾਸਿ ਸਾਹਿਬ",["rehras sahib","rehraas sahib"]],
["Aarti","ਆਰਤੀ",["aarti","aartee"]],
["Kirtan Sohila","ਕੀਰਤਨ ਸੋਹਿਲਾ",["kirtan sohila","sohila"]],
["Ardas","ਅਰਦਾਸ",["ardas"]],
["Shabad Hazare","ਸ਼ਬਦ ਹਜ਼ਾਰੇ",["shabad hazare","shabad hazaare"]],
["Shabad Hazare Patshahi 10","ਸ਼ਬਦ ਹਜ਼ਾਰੇ ਪਾਤਿਸ਼ਾਹੀ ੧੦",["shabad hazare patshahi 10"]],
["Tav Parsad Deenan","ਤ੍ਵਪ੍ਰਸਾਦਿ ਦੀਨਨ",["tavprasad deenan","deenan"]],
["Laavan","ਲਾਵਾਂ",["laavan","laavaan"]],
["Barah Maha Manjh","ਬਾਰਹ ਮਾਹਾ ਮਾਝ",["barah maha manjh","baraah maahaa"]],
["Salok Mahalla 9","ਸਲੋਕ ਮਹਲਾ ੯",["salok mahalla 9","salok mahala 9"]],
["Sukhmani Sahib","ਸੁਖਮਨੀ ਸਾਹਿਬ",["sukhmani sahib","sukhmani"]],
["Dukh Bhanjani Sahib","ਦੁਖ ਭੰਜਨੀ ਸਾਹਿਬ",["dukh bhanjani sahib","dukh bhanjani"]],
["Raag Mala","ਰਾਗ ਮਾਲਾ",["raag mala","raagmaala"]],
["Asa Di Vaar","ਆਸਾ ਦੀ ਵਾਰ",["asa di vaar","asa ki vaar"]],
["Basant Ki Vaar","ਬਸੰਤ ਕੀ ਵਾਰ",["basant ki vaar","basant vaar"]]
];
const $=s=>document.querySelector(s);let size=20,translation=true,larivaar=false,current=null,cache=new Map(),catalogue=null;
function toast(s){let e=$("#toast");e.textContent=s;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2600)}
function page(p){document.querySelectorAll(".page").forEach(e=>e.classList.toggle("active",e.id===p));document.querySelectorAll(".nav-item").forEach(e=>e.classList.toggle("active",e.dataset.page===p));window.scrollTo(0,0)}
document.querySelectorAll("[data-page]").forEach(e=>e.onclick=()=>page(e.dataset.page));
async function api(path){if(cache.has(path))return cache.get(path);let r=await fetch(API+path);if(!r.ok)throw Error("BaniDB request failed ("+r.status+").");let j=await r.json();cache.set(path,j);return j}
function norm(s){return String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\u0a00-\u0a7f]/g,"")}
function catalogueEntries(obj){if(Array.isArray(obj))return obj.map((v,i)=>({id:v.id??v.baniID??i+1,...v}));if(obj&&typeof obj==="object"){return Object.entries(obj).map(([id,v])=>({id,...(v||{})}))}return []}
async function loadCatalogue(){if(catalogue)return catalogue;const raw=await api("/banis");catalogue=catalogueEntries(raw);return catalogue}
function matchBani(item,entries){let g=norm(item[1]),aliases=item[2].map(norm);let exact=entries.find(x=>norm(x.gurmukhiUni||x.gurmukhi||x.nameGurmukhi)===g);if(exact)return exact;return entries.find(x=>{let trans=x.transliterations||{};let names=[trans.english,trans.en,trans.romanized,x.name,x.nameEnglish].filter(Boolean).map(norm);return names.some(n=>aliases.some(a=>n===a||n.includes(a)||a.includes(n)))})}
function today(){let h=new Date().getHours();$("#greeting").textContent=h<12?"A GOOD MORNING PRACTICE":h<17?"A MOMENT OF STILLNESS":"A QUIET EVENING PRACTICE";$("#todayDate").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());let n=h>=4&&h<12?"Japji Sahib":h>=12&&h<17?"Sukhmani Sahib":h>=17&&h<21?"Rehras Sahib":"Kirtan Sohila";$("#featuredName").textContent=n;$("#openFeatured").onclick=()=>openBani(n)}
function renderLibrary(){$("#baniGrid").innerHTML=BANIS.map((b,i)=>`<button class="bani-card" data-i="${i}"><span class="num">${String(i+1).padStart(2,"0")}</span><strong>${b[0]}</strong><small>${b[1]}</small></button>`).join("");document.querySelectorAll("[data-i]").forEach(e=>e.onclick=()=>openBani(BANIS[+e.dataset.i][0]));$("#quickList").innerHTML=["Japji Sahib","Jaap Sahib","Anand Sahib"].map(n=>`<button class="quick-item" data-q="${n}"><strong>${n}</strong><small>Read Bani ↗</small></button>`).join("");document.querySelectorAll("[data-q]").forEach(e=>e.onclick=()=>openBani(e.dataset.q))}
function escape(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function findText(o,keys){for(let k of keys){let v=o?.[k];if(typeof v==="string"&&v.trim())return v;if(v&&typeof v==="object"){let nested=v.gurmukhiUni||v.gurmukhi||v.unicode||v.text;if(nested)return nested}}return ""}
function flattenVerses(root){let out=[],seen=new Set();function walk(x){if(!x||typeof x!=="object"||seen.has(x))return;seen.add(x);if(Array.isArray(x)){x.forEach(walk);return}let g=findText(x,["gurmukhiUni","gurmukhi","unicode","line"]);if(g)out.push(x);else Object.values(x).forEach(walk)}walk(root);return out}
async function openBani(name){let item=BANIS.find(x=>x[0]===name);if(!item)return;$("#readerTitle").textContent=name;$("#readerMeta").textContent="Loading from BaniDB…";$("#verses").innerHTML='<p class="muted">Fetching Gurbani…</p>';page("reader");try{let list=await loadCatalogue(),entry=matchBani(item,list);if(!entry)throw Error("This Bani could not be matched in BaniDB's official catalogue. No substitute text will be shown.");let data=await api("/banis/"+encodeURIComponent(entry.id));let rows=flattenVerses(data);if(!rows.length)throw Error("BaniDB returned a format this reader could not parse.");current={name,data,rows};$("#readerMeta").textContent=`${rows.length} verses • BaniDB`;renderVerses()}catch(e){$("#readerMeta").textContent="BaniDB";$("#verses").innerHTML=`<p class="muted">${escape(e.message)}</p><button class="outline-btn" id="retryBani">Try again</button>`;$("#retryBani").onclick=()=>openBani(name)}}
function renderVerses(){if(!current)return;$("#verses").style.fontSize=size+"px";$("#verses").innerHTML=current.rows.map((v,i)=>{let g=findText(v,["gurmukhiUni","gurmukhi","unicode","line"]);let trans=v.transliterations||{};let en=trans.english||trans.en||findText(v,["transliteration","romanized"]);let trs=v.translations||v.translation||{};let tr=typeof trs==="string"?trs:(trs.en||trs.punjabi||trs.english||"");if(larivaar)g=g.replace(/\s+/g,"");return `<div class="verse"><span class="verse-num">${i+1}</span>${escape(g||"")}${translation&&tr?`<span class="translation">${escape(tr)}</span>`:""}</div>`}).join("")}
$("#backReader").onclick=()=>page("nitnem");$("#sizeUp").onclick=()=>{size=Math.min(36,size+2);renderVerses()};$("#sizeDown").onclick=()=>{size=Math.max(14,size-2);renderVerses()};$("#translationBtn").onclick=()=>{translation=!translation;$("#translationBtn").classList.toggle("active",translation);renderVerses()};$("#larivaarBtn").onclick=()=>{larivaar=!larivaar;$("#larivaarBtn").classList.toggle("active",larivaar);renderVerses()};$("#openArdas").onclick=()=>openBani("Ardas");
async function randomShabad(){ $("#vichaar").innerHTML='<p class="muted">Finding a Shabad…</p>';try{let d=await api("/random/G");let rows=flattenVerses(d);let sh=d?.shabadInfo||d?.shabad||d;let shown=rows.slice(0,4);if(!shown.length)throw Error("BaniDB returned an unrecognised Shabad response.");$("#vichaar").innerHTML=shown.map(v=>`<p>${escape(findText(v,["gurmukhiUni","gurmukhi","unicode","line"]))}</p>`).join("")+'<small class="muted">From BaniDB</small>'}catch(e){$("#vichaar").innerHTML=`<p class="muted">${escape(e.message)}</p>`}}
$("#refreshShabad").onclick=randomShabad;
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("nitnem-theme",document.body.classList.contains("dark")?"dark":"light");$("#darkSwitch").checked=document.body.classList.contains("dark")};$("#darkSwitch").onchange=e=>{document.body.classList.toggle("dark",e.target.checked);localStorage.setItem("nitnem-theme",e.target.checked?"dark":"light")};
let t=localStorage.getItem("nitnem-theme");if(t==="dark"||(t===null&&matchMedia("(prefers-color-scheme: dark)").matches))document.body.classList.add("dark");$("#darkSwitch").checked=document.body.classList.contains("dark");
today();renderLibrary();$("#connection").textContent=navigator.onLine?"Online • BaniDB":"Offline — internet required";window.addEventListener("online",()=>$("#connection").textContent="Online • BaniDB");window.addEventListener("offline",()=>$("#connection").textContent="Offline — internet required");randomShabad();

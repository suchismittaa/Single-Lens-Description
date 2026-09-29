(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

// smooth-scroll links
$$('[data-t]').forEach(a=>a.addEventListener('click',()=>document.getElementById(a.dataset.t).scrollIntoView({behavior:'smooth'})));

// scroll progress + active chapter
const bar=$('#progress'),navs=$$('#chapters a'),secs=['c1','c2','c3','c4','c5','c6'].map(id=>document.getElementById(id));
function onScroll(){
  const h=document.documentElement;
  bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  let cur=-1;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.4)cur=i});
  navs.forEach((n,i)=>n.classList.toggle('on',i===cur));
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;e.target.classList.add('in');
  if(e.target.classList.contains('steps'))lightSteps(e.target);
  if(e.target.querySelector('#arch'))$$('#arch .nd').forEach((n,i)=>setTimeout(()=>n.classList.add('lit'),i*350));
  io.unobserve(e.target);
}),{threshold:.2});
$$('.rv').forEach(el=>io.observe(el));
function lightSteps(el){[...el.children].forEach((b,i)=>setTimeout(()=>b.classList.add('lit'),i*450))}

// walkthrough chips
const EX={
 price:'PRICE — "under ₹500" is a numeric constraint. Code can check it exactly: 399 ≤ 500. No model judgment needed.',
 skin:'SKIN TYPE — "oily skin" is a categorical requirement. Code matches it against the product profile.',
 cast:'WHITE CAST — the buyer cares, but the product data never mentions it. That absence is a signal to investigate, not a verdict.'
};
$$('#chips button').forEach(b=>b.addEventListener('click',()=>{
  $$('#chips button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  $('#expl').textContent=EX[b.dataset.k];
}));

// local calculation (illustrative, simulated responses)
const P=[
 ['best sunscreen for oily skin',2],['sunscreen under ₹500',null],['lightweight SPF 50 sunscreen',3],
 ['sunscreen with no white cast',null],['fragrance-free sunscreen',null]
];
$('#tbl').innerHTML=P.map(p=>`<tr data-p="${p[1]??''}"><td>“${p[0]}”</td><td>${p[1]?'Minimalist · #'+p[1]:'not mentioned'}</td></tr>`).join('');
function count(el,to,dec,suf){
  const t0=performance.now();
  (function f(t){const k=Math.min((t-t0)/1200,1);el.textContent=(to*k).toFixed(dec)+(suf||'');if(k<1)requestAnimationFrame(f)})(t0);
}
$('#run').addEventListener('click',()=>{
  const hits=P.filter(p=>p[1]);
  const rate=hits.length/P.length*100;
  const avg=hits.reduce((s,p)=>s+p[1],0)/hits.length;
  $$('#tbl tr').forEach((r,i)=>setTimeout(()=>{if(r.dataset.p)r.classList.add('hit')},i*200));
  count($('#n1'),P.length,0);count($('#n2'),hits.length,0);
  count($('#n3'),rate,0,'%');count($('#n4'),avg,1);
});

// system explorer
const S=[
 ['USER','Frames the brand, product and buyer scenarios to test.','Product / brand and category','A set of buyer scenarios','Every test starts from a human question.'],
 ['FRONTEND','Collects inputs and shows results with their evidence.','User choices','Requests and readable findings','Insights are only useful if a person can inspect them.'],
 ['PROMPT / BUYER INTENT','Turns a scenario into realistic buyer questions.','Buyer scenario','Multiple prompt variants','One question is not enough; intent must be sampled.'],
 ['AI OBSERVATION','The model reports what it saw: products, positions, competitors.','Buyer prompts','Raw model responses','The model is a witness. It observes, it does not judge.'],
 ['STRUCTURED DATA','Extracts observations into a strict schema and validates them.','Raw responses','Validated observations','Schemas are contracts. Unusable output is rejected, not guessed at.'],
 ['DETERMINISTIC ANALYSIS','Calculates metrics and requirement matches in plain code.','AI observation, product information, buyer requirements','Metrics, requirement matches, potential findings','To make the analytical layer reproducible and inspectable.'],
 ['FINDINGS','Packages patterns worth investigating, worded without claiming causation.','Metrics and matches','Potential visibility gaps','A correlation is a reason to investigate, not proof.'],
 ['EVIDENCE','Attaches the exact prompts and observations behind each finding.','Findings','Traceable evidence trail','Evidence should travel with the insight.']
];
$('#sys').innerHTML=S.map((s,i)=>`<button data-i="${i}">${String(i+1).padStart(2,'0')} · ${s[0]}</button>`).join('');
function show(i){
  const s=S[i];$$('#sys button').forEach((b,j)=>b.classList.toggle('on',i===j));$$('#arch .nd').forEach(n=>n.classList.toggle('sel',+n.dataset.i===i));
  $('#panel').innerHTML=`<h3 style="margin:0 0 10px;font-size:24px">${s[0]}</h3><h4>WHAT IT DOES</h4><p>${s[1]}</p><h4>WHAT GOES IN</h4><p>${s[2]}</p><h4>WHAT COMES OUT</h4><p>${s[3]}</p><h4>WHY IT EXISTS</h4><p>${s[4]}</p>`;
}
$$('#sys button').forEach(b=>b.addEventListener('click',()=>show(+b.dataset.i)));$$('#arch .nd').forEach(n=>n.addEventListener('click',()=>show(+n.dataset.i)));show(5);

// expandable cards
function cards(id,data){
  $(id).innerHTML=data.map((d,i)=>`<div class="card"><div class="h"><i>${String(i+1).padStart(2,'0')}</i>${d[0]}</div><div class="d">${d[1]}</div></div>`).join('');
  $$(id+' .card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('open')));
}
cards('#think',[
 ['OBSERVATION ≠ JUDGMENT','LLMs observe. Code calculates. Keeping the two apart makes every number defensible.'],
 ['STRUCTURE BEFORE ANALYSIS','Validate AI output against a schema before anything downstream touches it.'],
 ['EVIDENCE SHOULD TRAVEL WITH THE INSIGHT','Every finding links back to the prompts and observations that produced it.'],
 ["DON'T CLAIM CAUSATION",'A correlation is a reason to investigate, not proof.'],
 ['DESIGN FOR REPEATED TESTING','AI recommendation behavior changes, so the system needs repeated observations, not a single snapshot.']
]);
cards('#road',[
 ['Better prompt intelligence','Generate more realistic, category-aware buyer questions.'],
 ['Multi-model comparison','See how different AI assistants recommend differently.'],
 ['Historical visibility tracking','Watch visibility over time instead of a single point-in-time run.'],
 ['Competitor intelligence','Understand which competitors appear, and for which requirements.'],
 ['Product-level recommendations','Suggest product-information gaps worth investigating.'],
 ['Potential commerce platform integrations','Ground the analysis in real product catalogs.'],
 ['Kasparro-specific workflows','Explore how this fits a real commerce intelligence workflow, with the real constraints.']
]);

// cinematic lines
const L=$$('#lines p');let played=false;
new IntersectionObserver(es=>{
  if(!es[0].isIntersecting||played)return;played=true;
  L.forEach((p,i)=>setTimeout(()=>p.classList.add('show'),i*2200));
},{threshold:.35}).observe($('#cine'));

$('#again').addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
})();

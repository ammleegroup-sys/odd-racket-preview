'use strict';

// Purposefully small, dependency-free interactions. No tracking or remote requests.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const menuToggle = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu() { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu'); mobileNav.hidden = true; }
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !opening;
});
$$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// Each design study is an independent responsive site, not a reskinned hero.
const studies = {
  nosignal:{brand:'NO SIGNAL',category:'EXPERIMENTAL / CULTURE & CREATIVE',title:'Make a little good trouble.',description:'Oversized typography, original chrome artwork and a frequency switch. A digital stage for a brand with something to say.'},
  ember:{brand:'EMBER',category:'ATMOSPHERIC / FOOD & HOSPITALITY',title:'A little fire. A lasting impression.',description:'Dramatic food photography, rich editorial type and a menu you can explore. A restaurant experience with atmosphere before you arrive.'},
  hush:{brand:'HUSH',category:'REFINED / BEAUTY & WELLBEING',title:'Quiet can make quite a statement.',description:'Warm ivory, sculptural photography and expressive serif type. Switch the daily ritual and explore a softer, more considered world.'},
  aurel:{brand:'AUREL',category:'ARCHITECTURAL / PROPERTY & INTERIORS',title:'Give a great space room to breathe.',description:'Immersive architecture, generous white space and an editorial project gallery. Confident design that lets the work do the talking.'},
  meridian:{brand:'MERIDIAN',category:'CORPORATE / PROFESSIONAL SERVICES',title:'Confidence, without raising your voice.',description:'A precise navy and white identity, clear service pathways and thoughtful detail. Credible, composed and built for serious conversations.'}
};
const studyKeys = Object.keys(studies);
let currentStudy = 'nosignal';
const studyTabs = $$('.showcase-tab');
function setStudy(key, focus=false) {
  const study=studies[key];if(!study)return;
  const changed=currentStudy!==key;currentStudy=key;
  studyTabs.forEach(tab=>{const active=tab.dataset.study===key;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus();});
  $('#showcase-panel').setAttribute('aria-labelledby',`study-${key}`);
  $('#study-category').textContent=study.category;
  $('#study-address').textContent=`${study.brand} / FICTIONAL DESIGN STUDY`;
  $('#study-title').textContent=study.title;$('#study-description').textContent=study.description;
  $('#study-number').replaceChildren(document.createTextNode(String(studyKeys.indexOf(key)+1).padStart(2,'0')),Object.assign(document.createElement('span'),{textContent:'/ 05'}));
  $('#study-open').href=`${key}.html`;
  $('#study-frame').title=`${study.brand} — ${study.category.toLowerCase()} website design study`;
  if(changed)$('#study-frame').src=`${key}.html`;
  $('#study-brief').dataset.style=key;
}
studyTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>setStudy(tab.dataset.study));
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%studyTabs.length;if(event.key==='ArrowLeft')next=(index+studyTabs.length-1)%studyTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=studyTabs.length-1;if(next!==undefined){event.preventDefault();setStudy(studyTabs[next].dataset.study,true);}});
});
$('#study-previous').addEventListener('click',()=>setStudy(studyKeys[(studyKeys.indexOf(currentStudy)+studyKeys.length-1)%studyKeys.length]));
$('#study-next').addEventListener('click',()=>setStudy(studyKeys[(studyKeys.indexOf(currentStudy)+1)%studyKeys.length]));
$$('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  $('#showcase-panel').classList.toggle('is-phone',button.dataset.preview==='phone');
  $$('[data-preview]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
}));

// The same selection drives the estimate and the downloadable brief.
const builds = {
  onepage: {name: 'One good page', price: 695, scope: '1 scrolling page / up to 6 sections / up to 1,000 supplied words', client: 'Business details, logo/name, approved copy, up to 10 licensed photos, approved privacy text and domain/hosting access.'},
  small: {name: 'Small & mighty', price: 995, scope: 'Up to 5 pages / up to 2,500 supplied words / one enquiry form', client: 'Final page copy, logo, service facts, up to 20 licensed photos, approved privacy text and domain/hosting access.'},
  grow: {name: 'Room to grow', price: 1995, scope: 'Up to 8 pages / editable CMS / up to 3,000 drafted words / one hour training', client: 'Business questionnaire and accurate facts, logo, up to 30 licensed photos, content approval, approved legal text and account access.'},
  shop: {name: 'Open for business', price: 3495, scope: 'Shopify / 5 content pages / up to 20 products, 5 variants each / 3 collections / one UK delivery setup', client: 'Shopify account, approved page/product copy and images, complete product spreadsheet, stock/prices, delivery rules, approved tax/legal policies and payment-provider verification.'},
  custom: {name: 'Custom or existing website', price: null, scope: 'Written scope and quote required', client: 'Existing website/account details and a description of the work needed.'}
};
const services = {
  care: {name: 'Website care', price: 79, setup: 0, scope: 'One supported brochure site, hosting up to 1GB, daily backups (7 days), monthly maintenance, quarterly restore check, 30 minutes monthly content edits.'},
  seo: {name: 'Local visibility', price: 249, setup: 0, scope: 'One business/location, up to two hours per month including review, one priority improvement and reporting. Care separate.'},
  ads: {name: 'Google Search management', price: 349, setup: 299, scope: 'One Search campaign, up to five ad groups, one local area, up to £1,500 monthly media. Weekly reviews, monthly report, one standard enquiry goal. Google spend separate.'}
};
const selection = {build: 'small', services: new Set()};
const money = value => new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value);
function renderSelection() {
  const shop = selection.build === 'shop';
  if (shop) selection.services.delete('care');
  $('#estimate-build').value = selection.build;
  $('#package-select').value = selection.build;
  $$('[data-estimate-service]').forEach(input => {
    input.checked = selection.services.has(input.dataset.estimateService);
    input.disabled = shop && input.dataset.estimateService === 'care';
  });
  $$('[name="services"]').forEach(input => {
    input.checked = selection.services.has(input.value);
    input.disabled = shop && input.value === 'care';
  });
  $('#estimate-care-note').hidden = !shop;
  $('#brief-care-note').hidden = !shop;
  const monthly = [...selection.services].reduce((total,key) => total + services[key].price,0);
  const setup = [...selection.services].reduce((total,key) => total + services[key].setup,0);
  const price = builds[selection.build].price;
  $('#estimate-upfront').textContent = price === null ? 'Quote' + (setup ? ` + ${money(setup)}` : '') : money(price + setup);
  $('#estimate-monthly').textContent = money(monthly) + '/mo';
  $('#estimate-year').textContent = price === null ? `Build quote + ${money(setup + monthly * 12)}` : money(price + setup + monthly * 12);
}
$('#estimate-build').addEventListener('change', event => {selection.build=event.target.value;renderSelection();});
$('#package-select').addEventListener('change', event => {selection.build=event.target.value;renderSelection();});
$$('[data-estimate-service]').forEach(input => input.addEventListener('change', () => {
  if(input.checked) selection.services.add(input.dataset.estimateService); else selection.services.delete(input.dataset.estimateService);
  renderSelection();
}));
$$('[name="services"]').forEach(input => input.addEventListener('change', () => {
  if(input.checked) selection.services.add(input.value); else selection.services.delete(input.value);
  renderSelection();
}));
renderSelection();

// Native dialogs provide focus trapping, escape handling and return focus.
const briefDialog = $('#brief-dialog');
$$('[data-brief]').forEach(button => button.addEventListener('click', () => {
  closeMenu();
  if (button.dataset.package && builds[button.dataset.package]) selection.build = button.dataset.package;
  if (button.dataset.service && services[button.dataset.service]) selection.services.add(button.dataset.service);
  if (button.dataset.style && studies[button.dataset.style]) $('#style-select').value=button.dataset.style;
  renderSelection();
  $('#brief-form').hidden = false; $('#brief-result').hidden = true;
  briefDialog.showModal();
}));
$('#privacy-button').addEventListener('click', () => $('#privacy-dialog').showModal());
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});
let briefText = '';
let briefFilename = 'odd-racket-project-brief.txt';
$('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const value = name => String(data.get(name) || '').trim();
  if (!value('name') || !value('business') || !value('industry') || !value('goal')) {
    showToast('Please add your name, business and a little detail.'); return;
  }
  const build = builds[value('package')];
  const selectedServices = data.getAll('services').filter(key => services[key] && !(value('package') === 'shop' && key === 'care'));
  const monthly = selectedServices.reduce((total,key) => total + services[key].price,0);
  const setup = selectedServices.reduce((total,key) => total + services[key].setup,0);
  const serviceText = selectedServices.length ? selectedServices.map(key => `${services[key].name}: ${money(services[key].price)}/month${services[key].setup ? ` + ${money(services[key].setup)} one-off setup` : ''}\n${services[key].scope}`).join('\n\n') : 'None. No monthly service is required.';
  briefText = `ODD RACKET — PROJECT BRIEF\nProposed launch packages / For discussion, not an order\n\nName: ${value('name')}\nBusiness: ${value('business')}\nWhat we do: ${value('industry')}\n\nBUILD\n${build.name}: ${build.price === null ? 'Quotation required' : money(build.price) + ' one-off'}\n${build.scope}\n\nCLIENT SUPPLIES\n${build.client}\n\nOPTIONAL MONTHLY HELP\n${serviceText}\n\nOUR FEES\nBuild and any Ads setup: ${build.price === null ? 'Build quote + ' + money(setup) : money(build.price + setup)}\nMonthly services: ${money(monthly)}/month\n12-month illustration, only if retained: ${build.price === null ? 'Build quote + ' + money(setup + monthly * 12) : money(build.price + setup + monthly * 12)}\nNo 12-month commitment. Prices are total payable to us, including VAT where charged.\n\nDESIGN DIRECTION\n${studies[value('design')] ? studies[value('design')].brand + ' — ' + studies[value('design')].category : 'Let us find the right style together.'}\n\nWHAT SUCCESS LOOKS LIKE\n${value('goal')}\n\nYOUR WEBSITE. YOUR KEYS. YOUR CALL.\nAfter final build payment, a written assignment transfers the rights we hold in your custom work. Your accounts remain in your name. Third-party components retain their own disclosed licences and subscriptions. No compulsory ongoing package. Cancel monthly services before next renewal; they end at the paid period's end. Standard handover/export is included with no agency exit fee. Platform migration may need a separate scope.\n\nBEFORE WE START\nWritten scope, delivery dates, payment milestones, dependencies and final total are agreed before work begins. Domains, email, platforms/hosting outside Care, agreed tools, extra pages/profile setup and Google advertising spend are separate. Google is paid directly by you. Rankings, lead volumes and returns are not guaranteed.\n\nThis brief was generated locally. It has not been submitted and is not an order.\n`;
  briefFilename = `${value('business').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,70) || 'business'}-project-brief.txt`;
  $('#brief-output').textContent = briefText;
  $('#brief-form').hidden = true; $('#brief-result').hidden = false;
  $('#download-brief').focus();
});
$('#edit-brief').addEventListener('click', () => {
  $('#brief-form').hidden = false; $('#brief-result').hidden = true;
  $('[name="name"]').focus();
});
$('#download-brief').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([briefText], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = briefFilename;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  $('#brief-status').textContent = 'Download requested. Your brief has not been sent to anyone.';
});
$('#copy-brief').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(briefText); $('#brief-status').textContent = 'Copied. You can now paste your brief into a message.'; showToast('Project brief copied.'); }
  catch { $('#brief-status').textContent = 'Copy is unavailable here. Use Download brief, or select and copy the text above.'; }
});
let toastTimer;
function showToast(text) { const toast = $('#toast'); toast.textContent = text; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500); }

// Original WebGL sculpture: a smooth torus knot, rendered locally without libraries.
(() => {
  const canvas = $('#sculpture');
  const wrap = $('.sculpture-wrap');
  const motionButton = $('.motion-button');
  const gl = canvas.getContext('webgl', {alpha:true, antialias:true, powerPreference:'low-power', premultipliedAlpha:false});
  if (!gl) { canvasSculpture(canvas, wrap, motionButton); return; }
  const vertex = `attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aUv;
    uniform mat4 uModel; uniform mat4 uProjection; varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
    void main(){vec4 p=uModel*vec4(aPosition,1.0);vPosition=p.xyz;vNormal=mat3(uModel)*aNormal;vUv=aUv;gl_Position=uProjection*vec4(p.xyz+vec3(0.0,0.0,-8.3),1.0);}`;
  const fragment = `precision mediump float; varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
    void main(){vec3 n=normalize(vNormal);vec3 view=normalize(vec3(0.0,0.0,8.3)-vPosition);
    vec3 l1=normalize(vec3(-3.0,6.0,6.0)-vPosition);vec3 l2=normalize(vec3(5.0,-2.0,2.0)-vPosition);
    float d=max(dot(n,l1),0.0);float d2=max(dot(n,l2),0.0);float fres=pow(1.0-max(dot(n,view),0.0),2.6);
    vec3 purple=vec3(0.32,0.13,0.79);vec3 light=vec3(0.77,0.68,1.0);
    vec3 base=mix(purple,light,d*0.68);base*=0.66+0.40*d+0.17*d2;
    float band=smoothstep(0.86,0.99,sin(vUv.x*37.699+vUv.y*6.283));
    base=mix(base,vec3(0.78,0.95,0.31)*(0.55+0.5*d),band*0.86);
    vec3 half1=normalize(l1+view);float shine=pow(max(dot(n,half1),0.0),62.0);
    base+=vec3(0.92,0.91,1.0)*shine*0.95;base+=vec3(0.47,0.33,0.8)*fres*0.52;
    float shadow=pow(max(dot(n,normalize(vec3(0.0,-3.0,-5.0))),0.0),2.0);base*=1.0-0.18*shadow;
    gl_FragColor=vec4(base,1.0);}`;
  function shader(type, source) { const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error('Sculpture shader unavailable');return shader; }
  let program;
  try { program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Sculpture unavailable'); }
  catch { wrap.classList.add('no-webgl'); motionButton.hidden=true; return; }
  gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  const normalize = v => {const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
  const sub=(a,b)=>a.map((x,i)=>x-b[i]);
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const centre=t=>[(2+0.66*Math.cos(3*t))*Math.cos(2*t),(2+0.66*Math.cos(3*t))*Math.sin(2*t),0.95*Math.sin(3*t)];
  const positions=[],normals=[],uvs=[],indices=[]; const rings=240,sides=32;
  for(let i=0;i<=rings;i++) {const t=i/rings*Math.PI*2;const c=centre(t),a=centre(t-.002),b=centre(t+.002);const tangent=normalize(sub(b,a));const second=b.map((v,k)=>(v-2*c[k]+a[k]));const normal=normalize(sub(second,tangent.map(x=>x*dot(second,tangent))));const binormal=normalize(cross(tangent,normal));
    for(let j=0;j<=sides;j++){const angle=j/sides*Math.PI*2;const n=normal.map((x,k)=>x*Math.cos(angle)+binormal[k]*Math.sin(angle));const tube=.58;positions.push(...c.map((x,k)=>(x+n[k]*tube)*.86));normals.push(...n);uvs.push(i/rings,j/sides);if(i<rings&&j<sides){const v=i*(sides+1)+j;indices.push(v,v+sides+1,v+1,v+1,v+sides+1,v+sides+2);}}}
  function attribute(name,values,size){const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(values),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);}
  attribute('aPosition',positions,3);attribute('aNormal',normals,3);attribute('aUv',uvs,2);
  const indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
  const modelLoc=gl.getUniformLocation(program,'uModel'),projectionLoc=gl.getUniformLocation(program,'uProjection');
  let x=.64,y=-.57,z=.35,last=0,frame=0,drag=false,px=0,py=0,inView=true,userPaused=false;
  const multiply=(a,b)=>{const out=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out;};
  const rotX=a=>new Float32Array([1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1]);
  const rotY=a=>new Float32Array([Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),0,Math.cos(a),0,0,0,0,1]);
  const rotZ=a=>new Float32Array([Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1,0,0,0,0,1]);
  function draw(){const model=multiply(rotZ(z),multiply(rotY(y),rotX(x)));gl.uniformMatrix4fv(modelLoc,false,model);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);}
  function resize(){const ratio=Math.min(devicePixelRatio||1,innerWidth<760?1.35:1.75);canvas.width=Math.round(canvas.clientWidth*ratio);canvas.height=Math.round(canvas.clientHeight*ratio);gl.viewport(0,0,canvas.width,canvas.height);const f=1/Math.tan(.69/2),aspect=canvas.width/canvas.height,near=.1,far=50;gl.uniformMatrix4fv(projectionLoc,false,new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]));draw();}
  function animate(time){frame=0;const dt=last?Math.min((time-last)/1000,.04):0;last=time;if(!drag){y+=dt*.13;x+=dt*.025;}draw();if(inView&&!userPaused&&!reducedMotion.matches&&!document.hidden)frame=requestAnimationFrame(animate);}
  function start(){last=0;if(!frame&&inView&&!userPaused&&!reducedMotion.matches&&!document.hidden)frame=requestAnimationFrame(animate);else draw();}
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;}
  motionButton.addEventListener('click',()=>{userPaused=!userPaused;motionButton.setAttribute('aria-pressed',String(userPaused));document.body.classList.toggle('motion-paused',userPaused);motionButton.setAttribute('aria-label',userPaused?'Play page animations':'Pause page animations');motionButton.innerHTML=`<span aria-hidden="true">${userPaused?'▷':'Ⅱ'}</span>`;if(userPaused)stop();else start();});
  canvas.addEventListener('pointerdown',event=>{if(reducedMotion.matches)return;drag=true;px=event.clientX;py=event.clientY;canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;y+=(event.clientX-px)*.008;x+=(event.clientY-py)*.008;px=event.clientX;py=event.clientY;draw();});
  function release(){drag=false;}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)start();else stop();},{threshold:.05}).observe(wrap);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)stop();else start();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();wrap.classList.add('no-webgl');});
  resize();start();
})();

// A fully animated Canvas2D renderer also supports devices without WebGL.
function canvasSculpture(canvas, wrap, motionButton) {
  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) { wrap.classList.add('no-webgl'); motionButton.hidden=true; return; }
  const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const centre=t=>[(2+.66*Math.cos(3*t))*Math.cos(2*t),(2+.66*Math.cos(3*t))*Math.sin(2*t),.95*Math.sin(3*t)];
  const vertices=[],faces=[]; const rings=126,sides=22;
  for(let i=0;i<=rings;i++){
    const t=i/rings*Math.PI*2,c=centre(t),a=centre(t-.002),b=centre(t+.002),tangent=norm(sub(b,a));
    const second=b.map((v,k)=>v-2*c[k]+a[k]),normal=norm(sub(second,tangent.map(v=>v*dot(second,tangent)))),binormal=norm(cross(tangent,normal));
    for(let j=0;j<=sides;j++){
      const q=j/sides*Math.PI*2,n=normal.map((v,k)=>v*Math.cos(q)+binormal[k]*Math.sin(q));
      vertices.push({p:c.map((v,k)=>v+n[k]*.58),n});
      if(i<rings&&j<sides){const v=i*(sides+1)+j;faces.push({ids:[v,v+sides+1,v+sides+2,v+1],band:Math.sin(i/rings*Math.PI*12+j/sides*Math.PI*2)>.92});}
    }
  }
  let x=.62,y=-.6,z=.3,width=0,height=0,last=0,frame=0,paused=false,visible=true,drag=false,px=0,py=0;
  const light=norm([-3,5,8]),view=[0,0,1],half=norm(light.map((v,i)=>v+view[i]));
  function rotate(v){const a=[v[0],v[1]*Math.cos(x)-v[2]*Math.sin(x),v[1]*Math.sin(x)+v[2]*Math.cos(x)];const b=[a[0]*Math.cos(y)+a[2]*Math.sin(y),a[1],-a[0]*Math.sin(y)+a[2]*Math.cos(y)];return[b[0]*Math.cos(z)-b[1]*Math.sin(z),b[0]*Math.sin(z)+b[1]*Math.cos(z),b[2]];}
  function render(){
    ctx.clearRect(0,0,width,height);
    const scale=Math.min(width/6.9,height/6.9);
    const transformed=vertices.map(v=>{const p=rotate(v.p),n=rotate(v.n),perspective=8/(8-p[2]);return{p,n,s:[width*.5+p[0]*scale*perspective,height*.5-p[1]*scale*perspective]};});
    const sorted=faces.map(f=>({f,depth:f.ids.reduce((s,id)=>s+transformed[id].p[2],0)/4})).sort((a,b)=>a.depth-b.depth);
    for(const {f} of sorted){
      const points=f.ids.map(id=>transformed[id]);
      const n=norm([0,1,2].map(i=>points.reduce((s,p)=>s+p.n[i],0)/4));
      if(n[2]<-.1)continue;
      const d=Math.max(0,dot(n,light)),shine=Math.pow(Math.max(0,dot(n,half)),52),rim=Math.pow(1-Math.max(0,n[2]),2.7);
      const dark=f.band?[146,183,43]:[68,28,162],bright=f.band?[218,246,99]:[185,151,249];
      const rgb=dark.map((v,i)=>Math.min(255,Math.round(v+(bright[i]-v)*d+shine*100+rim*15)));
      ctx.beginPath();ctx.moveTo(...points[0].s);for(let i=1;i<4;i++)ctx.lineTo(...points[i].s);ctx.closePath();ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.6;ctx.fill();ctx.stroke();
    }
  }
  function resize(){const ratio=Math.min(devicePixelRatio||1,1.4);width=canvas.clientWidth;height=canvas.clientHeight;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);render();}
  function tick(time){frame=0;if(last&&time-last<33){frame=requestAnimationFrame(tick);return;}const dt=last?Math.min((time-last)/1000,.06):0;last=time;if(!drag){y+=dt*.13;x+=dt*.025;}render();if(visible&&!paused&&!reducedMotion.matches&&!document.hidden)frame=requestAnimationFrame(tick);}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function start(){last=0;if(!frame&&visible&&!paused&&!reducedMotion.matches&&!document.hidden)frame=requestAnimationFrame(tick);else render();}
  motionButton.addEventListener('click',()=>{paused=!paused;motionButton.setAttribute('aria-pressed',String(paused));document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-label',paused?'Play page animations':'Pause page animations');motionButton.innerHTML=`<span aria-hidden="true">${paused?'▷':'Ⅱ'}</span>`;if(paused)stop();else start();});
  canvas.addEventListener('pointerdown',e=>{if(reducedMotion.matches)return;drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;y+=(e.clientX-px)*.008;x+=(e.clientY-py)*.008;px=e.clientX;py=e.clientY;render();});
  canvas.addEventListener('pointerup',()=>{drag=false;});canvas.addEventListener('pointercancel',()=>{drag=false;});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{threshold:.05}).observe(wrap);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)stop();else start();});
  resize();start();
}

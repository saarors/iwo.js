(function(global){
const T={}, R={}, Q=[];

function iwo(s){
let els=s instanceof NodeList||Array.isArray(s)?s:s instanceof HTMLElement?[s]:document.querySelectorAll(s);

function anim(el,p,d=400,e='linear',cb){const S={},U={},E=p;for(let k in p){S[k]=parseFloat(getComputedStyle(el)[k])||0;U[k]=(p[k]+'').replace(/[\d.-]/g,'');E[k]=parseFloat(p[k]);}let t0=performance.now();(function step(t){let prog=(t-t0)/d;prog=prog>1?1:prog;if(e==='ease-in') prog=prog*prog;if(e==='ease-out') prog=prog*(2-prog);for(let k in p) el.style[k]=S[k]+(E[k]-S[k])*prog+U[k];if(prog<1) requestAnimationFrame(step); else if(cb) cb();})();}

function filter(sel){let a=Array.from(els);if(sel.startsWith(':')){switch(sel){case':first':return[a[0]];case':last':return[a[a.length-1]];case':even':return a.filter((_,i)=>i%2==0);case':odd':return a.filter((_,i)=>i%2==1);default:if(sel.startsWith(':contains(')){const t=sel.match(/:contains\((.*)\)/)[1];return a.filter(x=>x.textContent.includes(t));}if(sel.startsWith(':not(')){const t=sel.match(/:not\((.*)\)/)[1];return a.filter(x=>!x.matches(t));}if(sel.startsWith(':nth-child(')){const n=parseInt(sel.match(/:nth-child\((\d+)\)/)[1],10);return a.filter(x=>Array.from(x.parentNode.children)[n-1]===x);}return a;}}return a;}

return {
elements:els,
find:(s)=>iwo(s),
filter:function(s){this.elements=filter(s);return this;},
html:function(c){if(c===undefined)return els[0]?els[0].innerHTML:undefined;els.forEach(e=>e.innerHTML=c);return this;},
text:function(c){if(c===undefined)return els[0]?els[0].textContent:undefined;els.forEach(e=>e.textContent=c);return this;},
css:function(p,v){if(typeof p==='object')for(let k in p)els.forEach(e=>e.style[k]=p[k]);else els.forEach(e=>e.style[p]=v);return this;},
addClass:function(c){els.forEach(e=>e.classList.add(c));return this;},
removeClass:function(c){els.forEach(e=>e.classList.remove(c));return this;},
toggleClass:function(c){els.forEach(e=>e.classList.toggle(c));return this;},
hasClass:function(c){return els[0]&&els[0].classList.contains(c);},
replaceClass:function(o,n){els.forEach(e=>{e.classList.remove(o);e.classList.add(n);});return this;},
on:function(e,cb){els.forEach(el=>el.addEventListener(e,cb));return this;},
off:function(e,cb){els.forEach(el=>el.removeEventListener(e,cb));return this;},
one:function(e,cb){els.forEach(el=>{el.addEventListener(e,function f(ev){cb(ev);el.removeEventListener(e,f);});});return this;},
trigger:function(e){els.forEach(el=>el.dispatchEvent(new Event(e)));return this;},
hover:function(enter,l){els.forEach(el=>{el.addEventListener('mouseenter',enter);el.addEventListener('mouseleave',l);});return this;},
delegate:function(sel,e,cb){els.forEach(el=>el.addEventListener(e,ev=>{if(ev.target.matches(sel))cb(ev);}));return this;},
each:function(cb){els.forEach((el,i)=>cb.call(el,i,el));return this;},
append:function(c){els.forEach(el=>{if(typeof c==='string')el.insertAdjacentHTML('beforeend',c);else if(c instanceof HTMLElement)el.appendChild(c);});return this;},
prepend:function(c){els.forEach(el=>{if(typeof c==='string')el.insertAdjacentHTML('afterbegin',c);else if(c instanceof HTMLElement)el.insertBefore(c,el.firstChild);});return this;},
remove:function(){els.forEach(e=>e.remove());return this;},
after:function(c){els.forEach(el=>{if(typeof c==='string')el.insertAdjacentHTML('afterend',c);else if(c instanceof HTMLElement)el.parentNode.insertBefore(c,el.nextSibling);});return this;},
before:function(c){els.forEach(el=>{if(typeof c==='string')el.insertAdjacentHTML('beforebegin',c);else if(c instanceof HTMLElement)el.parentNode.insertBefore(c,el);});return this;},
wrap:function(c){els.forEach(el=>{let w=(typeof c==='string')?iwo(c).elements[0].cloneNode(true):c.cloneNode(true);el.parentNode.insertBefore(w,el);w.appendChild(el);});return this;},
unwrap:function(){els.forEach(el=>{let p=el.parentNode;if(p.parentNode){p.parentNode.insertBefore(el,p);if(p.childNodes.length==0)p.remove();}});return this;},
children:function(){return iwo(Array.from(els).flatMap(e=>Array.from(e.children)));},
parent:function(){return iwo(Array.from(els).map(e=>e.parentNode));},
closest:function(sel){return iwo(Array.from(els).map(e=>e.closest(sel)));},
siblings:function(){return iwo(Array.from(els).flatMap(e=>Array.from(e.parentNode.children).filter(c=>c!==e)));},
val:function(v){if(v===undefined)return els[0]?els[0].value:undefined;els.forEach(e=>e.value=v);return this;},
template:function(name,html){if(html!==undefined){T[name]=html;return this;}else return T[name];},
use:function(name,data){let h=T[name];if(!h)return null;let t=document.createElement('div');t.innerHTML=h.trim();const el=t.firstChild;if(data){for(let k in data){const re=new RegExp(`\\{${k}\\}`,'g');h=h.replace(re,data[k]);if(!R[k])R[k]=[];R[k].push(el);}el.innerHTML=h;}return el;},
bind:function(k,v){if(v===undefined)return Q[k];Q[k]=v;if(R[k])R[k].forEach(e=>e.innerHTML=v);return this;},
ajax:function(o){return new Promise((res,rej)=>{const x=new XMLHttpRequest();x.open(o.method||'GET',o.url,true);if(o.headers)for(let h in o.headers)x.setRequestHeader(h,o.headers[h]);x.onreadystatechange=function(){if(x.readyState===4){if(x.status>=200&&x.status<300){let r=x.responseText;if(o.dataType==='json')r=JSON.parse(r);res(r);}else rej(x);}};x.send(o.data||null);});},
get:function(u,s){return this.ajax({url:u,method:'GET',success:s});},
post:function(u,d,s){return this.ajax({url:u,method:'POST',data:d,success:s});},
fadeIn:function(d=400){els.forEach(e=>{e.style.opacity=0;e.style.display='';anim(e,{opacity:1},d);});return this;},
fadeOut:function(d=400){els.forEach(e=>{anim(e,{opacity:0},d,'linear',()=>e.style.display='none');});return this;},
slideUp:function(d=400){els.forEach(e=>{const h=e.offsetHeight;anim(e,{height:0,paddingTop:0,paddingBottom:0,marginTop:0,marginBottom:0},d,'linear',()=>e.style.display='none');});return this;},
slideDown:function(d=400){els.forEach(e=>{e.style.display='';const h=e.scrollHeight;e.style.height=0;anim(e,{height:h},d);});return this;},
animate:function(p,d=400,e='linear',cb){els.forEach(e1=>anim(e1,p,d,e,cb));return this;},
clone:function(deep=true){return iwo(els.map(e=>e.cloneNode(deep)));},
detach:function(){let r=els.slice();els.forEach(e=>e.parentNode.removeChild(e));return iwo(r);},
replaceWith:function(c){els.forEach(e=>{if(typeof c==='string'){let t=document.createElement('div');t.innerHTML=c;let n=t.firstChild;e.parentNode.replaceChild(n,e);}else e.parentNode.replaceChild(c,e);});return this;},
insertAfter:function(c){els.forEach(e=>{if(typeof c==='string'){let t=document.createElement('div');t.innerHTML=c;e.parentNode.insertBefore(t.firstChild,e.nextSibling);}else e.parentNode.insertBefore(c,e.nextSibling);});return this;},
contents:function(){return iwo(Array.from(els).flatMap(e=>Array.from(e.childNodes)));},
isNumeric:function(v){return!isNaN(parseFloat(v))&&isFinite(v);},
isPlainObject:function(v){return v&&v.constructor===Object;},
extend:function(t,...o){o.forEach(obj=>{for(let k in obj)t[k]=obj[k];});return t;}
};}

global['%']=iwo;global['iwo']=iwo;
})(window);

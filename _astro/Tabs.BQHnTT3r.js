import{p as R,_ as S,F as v,A as N}from"./hooks.module.Bw6G1nmB.js";/* empty css                          */import{s as d}from"./Tabs_module.10b4e6eb.DqIA4t4U.js";import{u as b}from"./jsxRuntime.module.Cif6hlES.js";import"./preact.module.Cj4zUIh6.js";let f=[],B=r=>{let e,i=[],t={lc:0,value:r,set(l){t.value=l,t.notify()},get(){return t.lc||t.listen(()=>{})(),t.value},notify(l){e=i;let o=!f.length;for(let s=0;s<e.length;s++)f.push(e[s],t.value,l);if(o){for(let s=0;s<f.length;s+=3)f[s](f[s+1],f[s+2]);f.length=0}},listen(l){return i===e&&(i=i.slice()),t.lc=i.push(l),()=>{i===e&&(i=i.slice());let o=i.indexOf(l);~o&&(i.splice(o,1),t.lc--,t.lc||t.off())}},subscribe(l){let o=t.listen(l);return l(t.value),o},off(){}};return t},L=(r={})=>{let e=B(r);return e.setKey=function(i,t){typeof t>"u"?i in e.value&&(e.value={...e.value},delete e.value[i],e.notify(i)):e.value[i]!==t&&(e.value={...e.value,[i]:t},e.notify(i))},e};function F(r,e,i){let t=new Set([...e,void 0]);return r.listen((l,o)=>{t.has(o)&&i(l,o)})}const w=B(0),I=L({});function P(){const r=w.get();return w.set(r+1),r}function j(r,e={}){let[,i]=R({});return S(()=>{let t,l,o,s=()=>{t||(t=1,l=setTimeout(()=>{t=void 0,i({})}))};return e.keys?o=F(r,e.keys,s):o=r.listen(s),()=>{o(),clearTimeout(l)}},[r,""+e.keys]),r.get()}function A(r,e){const i=j(I),t=R(r);if(!e)return t;const l=i[e]?.curr??r;function o(s){if(e)I.setKey(e,{curr:s});else throw new Error("[Tabs] Looks like a sharedStore key is no longer present on your tab view! If your store key is dynamic, consider using a static string value instead.")}return[l,o]}const x="tab.",T="panel.";function O(r){const[e]=r;return e.startsWith(x)}function Q(r){const[e]=r;return e.startsWith(T)}function p(r){return r.replace(new RegExp(`^${x}`),"")}function y(r){return r.replace(new RegExp(`^${T}`),"")}function k({sharedStore:r,...e}){const i=P(),t=Object.entries(e).filter(Q).filter(n=>!$(n)),l=Object.entries(e).filter(O).filter(([n])=>!$(t.find(([c])=>c===`${T}${p(n)}`))),o=v({}),s=v(null),g=v(null),m=v(null),K=t[0]?.[0]??"",[a,C]=A(y(K),r);function h(n,c){r&&(s.current=c),C(p(n))}function $(n){return!n||(typeof n[1]!="object"?n[1]:n[1].props.value.toString())===""}S(()=>{s.current&&(s.current.scrollIntoView({behavior:"smooth"}),s.current=null)},[a]),N(()=>{const n=o?.current[`tab.${a}`];if(m.current&&g.current&&n){const c=n.getBoundingClientRect(),u=g.current.getBoundingClientRect();m.current.style.width||(m.current.style.width="1px"),m.current.style.transform=`translateX(${c.left-u.left}px) scaleX(${c.width})`}},[a]);function E(n){if(n.key==="ArrowLeft"){const c=l.findIndex(([u])=>p(u)===a);if(c>0){const[u]=l[c-1];h(u,o.current[u]),o.current[u]?.focus()}}if(n.key==="ArrowRight"){const c=l.findIndex(([u])=>p(u)===a);if(c<l.length-1){const[u]=l[c+1];h(u,o.current[u]),o.current[u]?.focus()}}}return b("div",{className:d.container,children:[b("div",{className:d["tab-scroll-overflow"],children:b("div",{ref:g,className:`${d.tablist} TabGroup no-flex`,role:"tablist",onKeyDown:E,children:[l.map(([n,c])=>b("button",{ref:u=>o.current[n]=u,onClick:()=>h(n,o.current[n]),"aria-selected":a===p(n),tabIndex:a===p(n)?0:-1,role:"tab",type:"button",className:d.tab,id:`${i}-${n}`,children:c},n)),b("span",{ref:m,className:d.selectedIndicator,"aria-hidden":"true"})]})}),t.map(([n,c])=>b("div",{hidden:a!==y(n),role:"tabpanel","aria-labelledby":`${i}-${x}${y(n)}`,className:d.tabpanel,children:c},n))]})}export{k as default};
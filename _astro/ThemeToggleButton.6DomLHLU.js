import{h as d,p as m}from"./hooks.module.d9BZIbLd.js";/* empty css                            */import{o as t}from"./jsxRuntime.module.m0jUXxM3.js";import"./preact.module.TgsLLGv9.js";const g=["light","dark"],u=[t("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",children:t("path",{fillRule:"evenodd",d:"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z",clipRule:"evenodd"})},"light"),t("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",children:t("path",{d:"M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"})},"dark")],f=({labels:o,isInsideHeader:s})=>{const[a,r]=d();return m(()=>{r(document.documentElement.classList.contains("theme-dark")?"dark":"light")},[]),m(()=>{const e=document.documentElement;a==="light"?e.classList.remove("theme-dark"):a==="dark"&&e.classList.add("theme-dark")},[a]),t("div",{className:`theme-toggle ${s?"hide-toggle-on-smaller-screens":""}`,children:g.map((e,c)=>{const n=u[c],h=e===a,l=e==="light"?o.useLight:o.useDark;return t("label",{title:l,className:h?"checked":"",children:[n,t("input",{type:"radio",name:"theme-toggle",checked:h,value:e,"aria-label":l,onChange:()=>{const i=window.matchMedia("(prefers-color-scheme: dark)").matches;i&&e==="dark"||!i&&e==="light"?localStorage.removeItem("theme"):localStorage.setItem("theme",e),r(e)}})]},l)})})};export{f as default};

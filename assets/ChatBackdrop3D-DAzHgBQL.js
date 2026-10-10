import{a as e,n as t,t as n}from"./jsx-runtime-D3jfb0Ew.js";import{n as r}from"./theme-B4TeC2Zz.js";import{a as i,i as a,o,r as s,s as c,t as l,x as u}from"./react-three-fiber.esm-CZUEi_Q7.js";var d=e(t(),1),f=n(),p=150,m=74,h=.2,g=`
  uniform float uTime;
  uniform float uPulseTime;
  uniform vec2 uPulseOrigin;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vFade;
  varying float vCrest;
  void main() {
    vec3 p = position;
    float swell = sin(p.x * 0.55 + uTime * 0.55) * 0.16
                + cos(p.z * 0.75 - uTime * 0.40) * 0.14
                + sin((p.x + p.z) * 0.32 + uTime * 0.25) * 0.10;
    // A ring that travels outward from where the message came in and dies away.
    float t = uTime - uPulseTime;
    float ripple = 0.0;
    if (t > 0.0 && t < 6.0) {
      float d = distance(p.xz, uPulseOrigin);
      float front = t * 2.7;
      ripple = exp(-pow(d - front, 2.0) * 1.4) * exp(-t * 0.75) * 0.55;
    }
    p.y += swell + ripple;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (8.0 / -mv.z);
    vFade = smoothstep(19.0, 4.0, -mv.z);
    vCrest = clamp(ripple * 2.4, 0.0, 1.0);
  }
`,_=`
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vFade;
  varying float vCrest;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;
    float edge = 1.0 - smoothstep(0.12, 0.25, r);
    gl_FragColor = vec4(mix(uInk, uAccent, vCrest), uOpacity * vFade * edge * (0.75 + vCrest * 0.6));
  }
`,v={dark:{ink:`#ffffff`,accent:`#caff8b`,opacity:.34},light:{ink:`#18181b`,accent:`#65a30d`,opacity:.24}};function y({pulse:e,hue:t}){let{theme:n}=r(),{camera:l,gl:y}=a(),b=(0,d.useRef)(null),x=(0,d.useMemo)(()=>{let e=new Float32Array(33300),t=0;for(let n=0;n<m;n++)for(let r=0;r<p;r++)e[t++]=(r-p/2)*h,e[t++]=0,e[t++]=4-n*h;let n=new o;return n.setAttribute(`position`,new i(e,3)),n},[]);(0,d.useEffect)(()=>()=>x.dispose(),[x]);let S=(0,d.useMemo)(()=>({uTime:{value:0},uPulseTime:{value:-100},uPulseOrigin:{value:new u(0,1)},uSize:{value:2.2},uPixelRatio:{value:Math.min(window.devicePixelRatio||1,1.75)},uInk:{value:new c(v.dark.ink)},uAccent:{value:new c(v.dark.accent)},uOpacity:{value:v.dark.opacity}}),[]);return(0,d.useEffect)(()=>{l.lookAt(0,-.2,-3)},[l]),(0,d.useEffect)(()=>{let e=v[n];S.uInk.value.set(e.ink),S.uOpacity.value=e.opacity,t===void 0?S.uAccent.value.set(e.accent):S.uAccent.value.setHSL(t/360,n===`dark`?.95:.7,n===`dark`?.74:.38)},[n,t,S]),(0,d.useEffect)(()=>{S.uPixelRatio.value=Math.min(y.getPixelRatio(),1.75)},[y,S]),(0,d.useEffect)(()=>{e&&(S.uPulseTime.value=S.uTime.value,S.uPulseOrigin.value.set(e.side===`mine`?2.4:-2.4,1.1))},[e,S]),s((e,t)=>{S.uTime.value+=Math.min(t,.05)}),(0,f.jsx)(`points`,{geometry:x,frustumCulled:!1,children:(0,f.jsx)(`shaderMaterial`,{ref:b,vertexShader:g,fragmentShader:_,uniforms:S,transparent:!0,depthWrite:!1})})}function b({pulse:e,hue:t}){return(0,f.jsx)(`div`,{className:`chat-backdrop`,"aria-hidden":`true`,children:(0,f.jsx)(l,{dpr:[1,1.75],camera:{position:[0,2.4,5.6],fov:50},gl:{antialias:!1,alpha:!0,powerPreference:`low-power`},children:(0,f.jsx)(y,{pulse:e,hue:t})})})}export{b as default};
# traço quadro a quadro: python3 traco.py slug t0 t1 [qs]
import json, sys
from playwright.sync_api import sync_playwright
JS="""async ([slug,t0,t1]) => { window.__refSempre=1; const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); const rig=api.c.rigs[0]; const ang=A=>A?A.el.clone().sub(A.sh).angleTo(A.wrist.clone().sub(A.el))*180/Math.PI:0; const f=x=>+x.toFixed(3);
 const out=[]; out.push(JSON.stringify({ativo:rig._ativo,anc:rig._ancFixo,dur:api.tl.dur}));
 for (let k=Math.round(t0*30);k<=Math.round(t1*30);k++){ const M=k/30; window.__resp=window.__respDe?window.__respDe(api.tl,M):0; api.n.pose(api.c, api.tl.at(M), M); const a=rig.angles('Left'), b=rig.angles('Right'); const A=rig.arms||{}; const fy=h=>rig.B[h+'Foot']?f(rig.P(h+'Foot').y):0;
  out.push([f(M), 'cot', f(ang(A.Left)), f(ang(A.Right)), 'joe', f(a.knee), f(b.knee), 'quad', f(rig.P('Hips').y), f(rig.P('Hips').z), 'cab', f(rig.P('Head').y), 'pe', fy('Left'), fy('Right'), 'mao', A.Left?f(A.Left.wrist.y):0, A.Right?f(A.Right.wrist.y):0].join(' '));
  const g=rig._fant; if(g&&g.arms){ const a2=g.angles('Left'), b2=g.angles('Right'), G=g.arms; out.push(['   ref', 'cot', f(ang(G.Left)), f(ang(G.Right)), 'joe', f(a2.knee), f(b2.knee), 'quad', f(g.P('Hips').y), f(g.P('Hips').z), 'cab', f(g.P('Head').y), 'ombro', f(g.P('LeftArm').y), f(g.P('LeftArm').z), 'novo ombro', f(rig.P('LeftArm').y), f(rig.P('LeftArm').z),'punho z', G.Left?f(G.Left.wrist.z):0, A.Left?f(A.Left.wrist.z):0].join(' ')); } }
 return out; }"""
qs=sys.argv[4] if len(sys.argv)>4 else ''
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"+qs); pg.evaluate("window.__pronto")
    for l in pg.evaluate(JS,[sys.argv[1],float(sys.argv[2]),float(sys.argv[3])]): print(l)
    b.close()

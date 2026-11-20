# procura "pulos" de um quadro para o outro (cotovelo, joelho, quadril) em todos os exercícios, a 30 quadros por segundo
import json, sys, time
from playwright.sync_api import sync_playwright
JS="""async (slug) => { if (window.__a) window.__a.dispose(); else if (window.__api) window.__api.dispose(); window.__api=null;
 const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); window.__a=api; const rig=api.c.rigs[0]; const ang=A=>A?A.el.clone().sub(A.sh).angleTo(A.wrist.clone().sub(A.el))*180/Math.PI:0;
 let ant=null, pior=[0,0,0], onde=[0,0,0]; const N=Math.round(api.tl.dur*30);
 for (let k=0;k<=N;k++){ const M=api.tl.dur*k/N; window.__resp=window.__respDe(api.tl,M); api.n.pose(api.c, api.tl.at(M), M); const a=rig.angles('Left'), b=rig.angles('Right'); const v=[Math.max(ang(rig.arms&&rig.arms.Left), 0), ang(rig.arms&&rig.arms.Right), a.knee, b.knee, rig.P('Hips').y*100, rig.P('Hips').z*100, rig.P('Head').y*100];
   if (ant) { const de=Math.max(Math.abs(v[0]-ant[0]),Math.abs(v[1]-ant[1])), dj=Math.max(Math.abs(v[2]-ant[2]),Math.abs(v[3]-ant[3])), dq=Math.max(Math.abs(v[4]-ant[4]),Math.abs(v[5]-ant[5]),Math.abs(v[6]-ant[6])); if(de>pior[0]){pior[0]=de;onde[0]=M} if(dj>pior[1]){pior[1]=dj;onde[1]=M} if(dq>pior[2]){pior[2]=dq;onde[2]=M} } ant=v; }
 return [pior.map(x=>+x.toFixed(1)), onde.map(x=>+x.toFixed(2))]; }"""
so=sys.argv[1].split(',') if len(sys.argv)>1 else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"); pg.evaluate("window.__pronto")
    slugs=so or pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); R={}; t0=time.time()
    for s in slugs:
        try: R[s]=pg.evaluate(JS,s)
        except Exception as e: R[s]=[[999,999,999],str(e)[:120]]
    json.dump(R,open('salto.json','w')); b.close()
    ruim=sorted([(v[0],k,v[1]) for k,v in R.items() if v[0][0]>14 or v[0][1]>14 or v[0][2]>4], reverse=True)
    print('exercícios', len(R), 'com pulo', len(ruim), round(time.time()-t0),'s'); [print(' ',x) for x in ruim[:30]]

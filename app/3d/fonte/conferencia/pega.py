# distância da pegada (onde a mão fecha) até o aparelho mais próximo, ao longo do exercício. SAIDA=arquivo QS=parâmetros
import json, sys, time, os
from playwright.sync_api import sync_playwright
JS="""async (slug) => { if (window.__a) window.__a.dispose(); else if (window.__api) window.__api.dispose(); window.__api=null;
 const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); window.__a=api; const T=api.c.THREE, rig=api.c.rigs[0], sc=api.sc; const dorig=new Set(); for (const r of api.c.rigs) { r.root.traverse(o=>dorig.add(o)); if (r._fant) r._fant.root.traverse(o=>dorig.add(o)); }
 const ms=[]; sc.traverse(o=>{ if(!o.isMesh||dorig.has(o)||!o.geometry) return; let v=true; for(let q=o;q;q=q.parent) if(!q.visible) v=false; if(!v) return; if(!o.geometry.boundingBox) o.geometry.computeBoundingBox(); const bb=o.geometry.boundingBox, s=new T.Vector3(); bb.getSize(s); const ws=o.getWorldScale(new T.Vector3()); const d=[s.x*ws.x,s.y*ws.y,s.z*ws.z].sort((a,b)=>a-b); if (d[0]<.12 && d[1]>.6 && d[2]>.6) return; /* tapete, piso, plataforma */ if (d[2]>6) return; ms.push(o); });
 const dist=(P)=>{ let m=9; const l=new T.Vector3(), c=new T.Vector3(); for(const o of ms){ l.copy(P); o.worldToLocal(l); c.copy(l).clamp(o.geometry.boundingBox.min,o.geometry.boundingBox.max); o.localToWorld(c); const d=c.distanceTo(P); if(d<m) m=d; } return m; };
 const out={Left:[],Right:[]}; const N=12;
 for (let k=0;k<N;k++){ const M=api.tl.dur*(k+.5)/N; api.n.pose(api.c, api.tl.at(M), M); sc.updateMatrixWorld(true); for(const h of ['Left','Right']){ const A=rig.arms&&rig.arms[h], u=rig.lastSpec.hands&&rig.lastSpec.hands[h]; if(!A||!u){out[h].push(null);continue} out[h].push(+(dist(rig.toWorld(A.grip.clone()))*1000).toFixed(0)); } }
 return {d:out, n:ms.length, anc:rig._ancFixo||null, modo:rig._modo||null, lev:rig._levados||0}; }"""
so=sys.argv[1].split(',') if len(sys.argv)>1 else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"+os.environ.get("QS","")); pg.evaluate("window.__pronto")
    slugs=so or pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); R={}; t0=time.time()
    for s in slugs:
        try: R[s]=pg.evaluate(JS,s)
        except Exception as e: R[s]={'erro':str(e)[:200]}
        if so: print(s, json.dumps(R[s]))
    json.dump(R,open(os.environ.get('SAIDA','pega.json'),'w')); b.close(); print('ok',len(R),round(time.time()-t0),'s', [k for k,v in R.items() if 'erro' in v][:5])

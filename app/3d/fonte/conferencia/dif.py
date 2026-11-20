# compara o corpo novo com o esqueleto de referência, quadro a quadro (15 qps): diferença de ângulo (cotovelo, joelho) e pulos a mais
import json, sys, time, os
from playwright.sync_api import sync_playwright
JS="""async (slug) => { if (window.__a) window.__a.dispose(); else if (window.__api) window.__api.dispose(); window.__api=null; window.__refSempre=1;
 const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); window.__a=api; const rig=api.c.rigs[0], g=rig._fant; if(!g) return null; const ang=A=>A?A.el.clone().sub(A.sh).angleTo(A.wrist.clone().sub(A.el))*180/Math.PI:0;
 const med=r=>{const a=r.angles('Left'),b=r.angles('Right'),A=r.arms||{};return [ang(A.Left),ang(A.Right),a.knee,b.knee]};
 let an=null, ag=null; const dif=[0,0,0,0], onde=[0,0,0,0], pulo=[0,0,0,0], ondeP=[0,0,0,0]; const N=Math.round(api.tl.dur*30);
 for (let k=0;k<=N;k++){ const M=api.tl.dur*k/N; window.__resp=window.__respDe(api.tl,M); api.n.pose(api.c, api.tl.at(M), M); const v=med(rig), w=med(g);
   for(let i=0;i<4;i++){ const d=Math.abs(v[i]-w[i]); if(d>dif[i]){dif[i]=d;onde[i]=M} if(an){ const e=Math.abs(v[i]-an[i])-Math.abs(w[i]-ag[i]); if(e>pulo[i]){pulo[i]=e;ondeP[i]=M} } } an=v; ag=w; }
 const r1=x=>+x.toFixed(1); return {dif:dif.map(r1), onde:onde.map(r1), pulo:pulo.map(r1), ondeP:ondeP.map(x=>+x.toFixed(2)), ativo:rig._ativo, anc:rig._ancFixo}; }"""
so=sys.argv[1].split(',') if len(sys.argv)>1 else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"); pg.evaluate("window.__pronto")
    slugs=so or pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); R={}; t0=time.time()
    for s in slugs:
        try: R[s]=pg.evaluate(JS,s)
        except Exception as e: R[s]={'erro':str(e)[:160]}
    json.dump(R,open(os.environ.get('SAIDA','dif.json'),'w')); b.close()
    er=[k for k,v in R.items() if not v or 'erro' in v]; print('erros',er[:5], round(time.time()-t0),'s')
    A=sorted([(max(v['pulo']),k,v) for k,v in R.items() if v and 'pulo' in v and max(v['pulo'])>6], reverse=True)
    print('pulos a mais (>6 graus por quadro):',len(A)); [print('  ',k,v['pulo'],'t',v['ondeP'],'anc',v['anc']) for _,k,v in A[:40]]
    B=sorted([(max(v['dif']),k,v) for k,v in R.items() if v and 'dif' in v and max(v['dif'])>25], reverse=True)
    print('diferença de ângulo (>25 graus):',len(B)); [print('  ',k,v['dif'],'t',v['onde'],'anc',v['anc'], 'ativo',v['ativo']) for _,k,v in B[:60]]

# suavidade do aparelho levado: posição da pegada resolvida a 30 qps; procura vai-e-volta e pulos
import sys, json
from playwright.sync_api import sync_playwright
JS="""async (slug) => { const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); const rig=api.c.rigs[0]; const N=Math.round(api.tl.dur*30); const P=[];
 for (let k=0;k<=N;k++){ const M=api.tl.dur*k/N; window.__resp=window.__respDe?window.__respDe(api.tl,M):0; api.n.pose(api.c, api.tl.at(M), M); const A=rig.arms&&rig.arms.Left; P.push(A?rig.toWorld(A.grip.clone()):null); }
 let zig=0, mx=0, onde=0; for (let k=2;k<P.length;k++){ if(!P[k]||!P[k-1]||!P[k-2]) continue; const a=P[k].distanceTo(P[k-1]), b=P[k].distanceTo(P[k-2]); if (a>mx){mx=a;onde=k/30} if (a>.004 && a>1.6*b+.002) zig++; }
 api.dispose(); return {zig, max_mm:+(mx*1000).toFixed(1), onde:+onde.toFixed(2), modo:rig._modo}; }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"+__import__('os').environ.get('QS','')); pg.evaluate("window.__pronto")
    so=sys.argv[1].split(',') if len(sys.argv)>1 else pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); R={}
    for s in so:
        try: R[s]=pg.evaluate(JS,s)
        except Exception as e: R[s]={'erro':str(e)[:100]}
    b.close()
    for k,v in R.items():
        if 'erro' in v or v['zig']>0 or len(so)<12: print(k, json.dumps(v))
    print('total',len(R),'com vai-e-volta',sum(1 for v in R.values() if v.get('zig')))

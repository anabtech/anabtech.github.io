# compara a extensão máxima de cotovelo e joelho ao longo de cada exercício: corpo anterior x corpo novo
import json, os, sys
from playwright.sync_api import sync_playwright
JS="""async (slug) => { if (window.__a) window.__a.dispose(); else if (window.__api) window.__api.dispose(); window.__api=null;
 const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); window.__a=api; const rig=api.c.rigs[0]; let ce=999, cj=999, me=0;
 for (let k=0;k<40;k++){ const M=api.tl.dur*(k+.5)/40; api.n.pose(api.c, api.tl.at(M), M); for (const l of ['Left','Right']) { const a=rig.arms&&rig.arms[l]?rig.angles(l):null; if(a&&a.elbow!==undefined){ ce=Math.min(ce,a.elbow); me=Math.max(me,a.elbow);} const b=rig.angles(l); cj=Math.min(cj,b.knee); } }
 return [Math.round(ce), Math.round(me), Math.round(cj)]; }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"+os.environ.get("QS","")); pg.evaluate("window.__pronto")
    slugs=pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); R={}
    for s in slugs:
        try: R[s]=pg.evaluate(JS,s)
        except Exception as e: R[s]=None
    json.dump(R,open(os.environ.get('SAIDA','cot.json'),'w')); b.close()

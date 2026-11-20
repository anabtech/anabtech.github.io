# auditoria de contato nos 206: ajustes de almofada feitos, ponto mais baixo do corpo e encaixe das mãos
import json, time, sys
from playwright.sync_api import sync_playwright
JS="""async (slug) => { if (window.__a) window.__a.dispose(); else if (window.__api) window.__api.dispose(); window.__api=null;
 const api = await window.__studio(slug,{ss:1,shadow:256,w:64,h:64}); window.__a=api; return { ct: api.ct2 }; }"""
so=sys.argv[1].split(',') if len(sys.argv)>1 else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(); er=[]; pg.on("pageerror",lambda e:er.append(str(e))); import os; pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"+os.environ.get("QS","")); pg.evaluate("window.__pronto")
    slugs=so or pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); R={}; t0=time.time()
    for i,s in enumerate(slugs):
        n0=len(er)
        try: R[s]=pg.evaluate(JS,s)['ct']
        except Exception as e: R[s]={'erro':str(e)[:200]}
        if er[n0:]: R[s]={'erro':er[n0:][0][:200]}
        if so or i%25==0: print(i,s,json.dumps(R[s]),round(time.time()-t0),flush=True)
    json.dump(R,open(os.environ.get('SAIDA','aud.json'),'w')); b.close()

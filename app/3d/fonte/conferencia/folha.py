# folhas de conferência visual: python3 folha.py fracao prefixo [passo]  -> prefixo-NN.jpg (20 exercícios por folha, câmera do próprio vídeo)
import sys, base64, io, json, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
fr=float(sys.argv[1]); pre=sys.argv[2]; so=sys.argv[3].split(',') if len(sys.argv)>3 else None
JS="""async ([slug,fr]) => { if (window.__a) window.__a.dispose(); else if (window.__api) window.__api.dispose(); window.__api=null;
 const api = await window.__studio(slug,{ss:1,shadow:1024,w:432,h:432}); window.__a=api; const M=api.tl.dur*fr; const b=api.camF(M); window.__resp=window.__respDe?window.__respDe(api.tl,M):0;
 api.frame(M,{az:b.az, el:b.el??12, dist:b.dist, tx:b.tx??0, ty:b.ty, tz:b.tz??0},0,0); const cv=document.createElement('canvas'); cv.width=cv.height=432; const g=cv.getContext('2d'); g.fillStyle='#eef0ef'; g.fillRect(0,0,432,432); g.drawImage(api.gl.domElement,0,0,432,432); return cv.toDataURL('image/jpeg',.85); }"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(viewport={"width":600,"height":800}); pg.goto("http://localhost:8766/app/3d/estudio.html?ex=prancha&tema=claro"+os.environ.get("QS","")); pg.evaluate("window.__pronto")
    slugs=so or pg.evaluate("Object.keys(window.CONTEUDO).filter(s=>window.__EX[s])"); N=20
    for f in range(0,len(slugs),N):
        sh=Image.new('RGB',(432*5,(432+0)*4),'white'); d=ImageDraw.Draw(sh)
        for i,s in enumerate(slugs[f:f+N]):
            try: im=Image.open(io.BytesIO(base64.b64decode(pg.evaluate(JS,[s,fr]).split(',')[1])))
            except Exception as e: im=Image.new('RGB',(432,432),'red'); print('ERRO',s,str(e)[:100])
            x,y=432*(i%5),432*(i//5); sh.paste(im,(x,y)); d.rectangle([x,y,x+431,y+22],fill=(20,20,20)); d.text((x+6,y+5),s,fill=(255,255,255))
        sh.save(f"{pre}-{f//N:02d}.jpg",quality=82); print(f//N, slugs[f:f+N][0], flush=True)
    b.close()

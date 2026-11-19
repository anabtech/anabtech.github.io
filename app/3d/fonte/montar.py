# monta app/3d/viewer-pro.js = base + equipamentos v2
import subprocess, sys
import os; B=os.path.dirname(os.path.abspath(__file__))+'/'
s=open(B+'viewer-pro.base.js').read(); eq=open(B+'equip2.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep(';window.__EX=CE;', ';\n{'+eq+'\nwindow.__apura2=apura2;}\n;window.__EX=CE;')
rep("const arcs=(n.arcs||[]).map(()=>new o0(sc));", "const arcs=(n.arcs||[]).map(()=>new o0(sc));const ap2=window.__apura2(sc,c,gl);window.__ap2=ap2;")
rep("follow&&(cam.updateMatrixWorld(),follow(cam,T));", "follow&&(cam.updateMatrixWorld(),follow(cam,T));ap2&&ap2.antes(T);")
rep("o.isLight&&o.shadow&&o.shadow.map&&(o.shadow.map.dispose(),o.shadow.map=null)});", "o.isLight&&o.shadow&&o.shadow.map&&(o.shadow.map.dispose(),o.shadow.map=null)});ap2&&ap2.dispose();")
# fibras mais discretas no músculo em repouso e nítidas no músculo que trabalha
rep("float fib = mix(1.0, mix(0.87, 1.03, st * st), aa * cov * (1.0 - tend));", "float fa = mix(0.38, 1.0, clamp(vPaint, 0.0, 1.0)); float fib = mix(1.0, mix(1.0 - 0.13 * fa, 1.0 + 0.03 * fa, st * st), aa * cov * (1.0 - tend));")
open(B+'../viewer-pro.js','w').write(s)
print('ok', len(s))

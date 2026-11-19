# monta app/3d/viewer-pro.js = base + equipamentos v2
import subprocess, sys
import os; B=os.path.dirname(os.path.abspath(__file__))+'/'
s=open(B+'viewer-pro.base.js').read(); eq=open(B+'equip2.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
rep(';window.__EX=CE;', ';\n{'+eq+'\nwindow.__apura2=apura2;}\n;window.__EX=CE;')
s=s.replace('var WL=', 'window.__GR=window.__GR||{gr0:.075,gd0:.022,gk:1,c1:1.15,c2:1.3,c3:1.3,th:.5};var WL=',1); assert 'window.__GR=window.__GR' in s
rep("const arcs=(n.arcs||[]).map(()=>new o0(sc));", "const arcs=(n.arcs||[]).map(()=>new o0(sc));const ct2=window.__contato2(c,n,tl,sc);const ap2=window.__apura2(sc,c,gl);window.__ap2=ap2;")
rep("follow&&(cam.updateMatrixWorld(),follow(cam,T));", "follow&&(cam.updateMatrixWorld(),follow(cam,T));ap2&&ap2.antes(T);")
rep("o.isLight&&o.shadow&&o.shadow.map&&(o.shadow.map.dispose(),o.shadow.map=null)});", "o.isLight&&o.shadow&&o.shadow.map&&(o.shadow.map.dispose(),o.shadow.map=null)});ap2&&ap2.dispose();")
# corpo novo (molde humano) e posição de repouso própria para as fibras
rep('"models/Atleta.glb"', '(new URLSearchParams(location.search).get("corpo")==="0"?"models/Atleta.glb":"models/Atleta2.glb")')
rep("attribute vec4 _musi; attribute vec4 _musw; attribute float _cavity; attribute float _fibk; attribute float _musp; uniform float uAct[", "attribute vec3 _rest; attribute vec4 _musi; attribute vec4 _musw; attribute float _cavity; attribute float _fibk; attribute float _musp; uniform float uAct[")
rep("vProf = _musp; vRest = position; vFibK = _fibk; }", "vProf = _musp; vRest = _rest; vFibK = _fibk; }")
# pegada calibrada para a mão do corpo novo (valores em window.__GR, definidos em equip2.js)
rep("sub(f.clone().multiplyScalar(u.gripReach??.075)).sub(m.clone().multiplyScalar(u.gripDepth??.022))", "sub(f.clone().multiplyScalar(__GR.alc(this,u))).sub(m.clone().multiplyScalar(__GR.prof(this,u)))")
rep("this.rotW(r,Di(l,-i*t*(a===1?1.15:1.3)))", "this.rotW(r,Di(l,-i*t*(a===1?__GR.c1:a===2?__GR.c2:__GR.c3)))")
rep("Di(this.boneVec(a,p(1,0,0)),.5*t))", "Di(this.boneVec(a,p(1,0,0)),__GR.th*t))")
rep("this.curl(h,u.curl??1)", "this.curl(h,u.curl??1,{g:u.grip,f:f,m:m,r:u.gripR})")
# pés: o tornozelo sobe o necessário para a ponta do pé não entrar no chão, e os dedos mantêm a inclinação natural
rep("m=u.ankle.clone(),", "m=__GR.tornozelo(this,u),")
rep("let S=b.clone().applyAxisAngle(M,-(u.toePitch??(Qn?Math.min(0,u.pitch||0):0)));", "let S=__GR.dedos(this,u,b,M);")
rep("E.clone().add(S.multiplyScalar(this.restToeEnd.z-this.restToe.z))", "E.clone().add(S)")
# luz principal mais lateral e mais alta
rep("d.position.copy(f).addScaledVector(b,3).addScaledVector(g,2.6).addScaledVector(y,.9)", "d.position.copy(f).addScaledVector(b,3.6).addScaledVector(g,3.1).addScaledVector(y,1.1)")
# fibras mais discretas no músculo em repouso e nítidas no músculo que trabalha
rep("float fib = mix(1.0, mix(0.87, 1.03, st * st), aa * cov * (1.0 - tend));", "float fa = mix(0.12, 1.0, clamp(vPaint, 0.0, 1.0)); float fib = mix(1.0, mix(1.0 - 0.13 * fa, 1.0 + 0.03 * fa, st * st), aa * cov * (1.0 - tend));")
# sulcos entre os músculos mais marcados
rep("diffuseColor.rgb *= 1.0 - 0.38 * clamp(vCav, 0.0, 1.0) + 0.06 * clamp(-vCav, 0.0, 1.0); }", "diffuseColor.rgb *= 1.0 - 0.5 * clamp(vCav, 0.0, 1.0) + 0.09 * clamp(-vCav, 0.0, 1.0); }")
rep('const api={n,c,tl,camF,gl,cam,sc,key,W,H,V:p,','const api={n,c,tl,camF,gl,cam,sc,key,W,H,V:p,ct2,')
rep('const ee=tl.at(M);n.pose(c,ee,M);', 'const ee=tl.at(M);window.__resp=window.__respDe?window.__respDe(tl,M):0;n.pose(c,ee,M);')
open(B+'../viewer-pro.js','w').write(s)
print('ok', len(s))

# correspondência exata de vértices entre o corpo antigo (mesma topologia, vértices reordenados) e o novo
import numpy as np, json, collections, sys
from atleta import carregar
a=carregar(); To=a['T']; Po=a['Pw']; no=len(Po); d=np.load('mh1.npz'); Qn=d['Q']; c2=np.load('corpo2.npz'); Vt=c2['Vt']
# 1) três classes de vértice no antigo (original / aresta / face) por coloração dos triângulos
ed=collections.defaultdict(list)
for ti,t in enumerate(To):
    for i in range(3): ed[(min(t[i],t[(i+1)%3]),max(t[i],t[(i+1)%3]))].append(ti)
cor=-np.ones(no,int); cor[To[0]]=[0,1,2]; fila=[0]; visto=np.zeros(len(To),bool); visto[0]=True; conf=0
while fila:
    ti=fila.pop(); t=To[ti]
    for i in range(3):
        u,v,w=t[i],t[(i+1)%3],t[(i+2)%3]
        for t2 in ed[(min(u,v),max(u,v))]:
            if visto[t2]: continue
            w2=[x for x in To[t2] if x!=u and x!=v][0]; c=3-cor[u]-cor[v]
            if cor[w2]==-1: cor[w2]=c
            elif cor[w2]!=c: conf+=1
            visto[t2]=True; fila.append(t2)
cont=np.bincount(cor[cor>=0],minlength=3); print('cores', cont, 'conflitos', conf, 'sem cor', (cor<0).sum())
if conf: sys.exit('triangulação não é do tipo original-aresta-face')
# classes: aresta = a mais numerosa; original e face: decide pela valência no grafo de quads (face sempre 4)
ce=int(np.argmax(cont)); outras=[k for k in range(3) if k!=ce]
# quads do antigo: junta os dois triângulos que dividem a diagonal (as duas classes que não são "aresta")
diag=collections.defaultdict(list)
for ti,t in enumerate(To):
    k=[x for x in t if cor[x]!=ce]
    if len(k)==2: diag[(min(k),max(k))].append(ti)
    else: sys.exit('triângulo sem diagonal')
Qo=[]
for (p,q),ts in diag.items():
    if len(ts)!=2: sys.exit('diagonal com %d triângulos'%len(ts))
    t=list(To[ts[0]]); i=[j for j in range(3) if cor[t[j]]==ce][0]; e1=t[i]; nx=t[(i+1)%3]; pv=t[(i+2)%3]   # e1 -> nx -> pv
    e0=[x for x in To[ts[1]] if cor[x]==ce][0]; Qo.append([pv,e1,nx,e0])       # ordem cíclica coerente com o triângulo
Qo=np.array(Qo); print('quads antigos', len(Qo), 'novos', len(Qn))
# qual das outras duas cores é "face": no novo, o índice 2 de cada quad é o ponto de face; valência de face = 4 sempre
val=np.zeros(no,int); 
for q in Qo:
    for x in q: val[x]+=1
cf=[k for k in outras if (val[cor==k]==4).all()]; print('classe face candidata', cf, 'contagens', cont)
def meias(Q):
    """aresta dirigida (u,v) -> (índice do quad, posição)"""
    m={}
    for qi,q in enumerate(Q):
        for i in range(4): m[(q[i],q[(i+1)%4])]=(qi,i)
    return m
Mn=meias(Qn); Mo=meias(Qo)
def propaga(qn0,qo0,rot):
    mp=-np.ones(len(Vt),int); usado=np.zeros(no,bool); fq=-np.ones(len(Qn),int)
    def liga(qi,qj,r):
        for i in range(4):
            x=Qn[qi][i]; y=Qo[qj][(i+r)%4]
            if mp[x]==-1:
                if usado[y]: return False
                mp[x]=y; usado[y]=True
            elif mp[x]!=y: return False
        fq[qi]=qj; return True
    if not liga(qn0,qo0,rot): return None
    pil=[(qn0,qo0,rot)]
    while pil:
        qi,qj,r=pil.pop()
        for i in range(4):
            u,v=Qn[qi][i],Qn[qi][(i+1)%4]; viz=Mn.get((v,u))
            if viz is None or fq[viz[0]]!=-1: continue
            vo=Mo.get((mp[v],mp[u]))
            if vo is None: return None
            r2=(vo[1]-viz[1])%4
            if not liga(viz[0],vo[0],r2): return None
            pil.append((viz[0],vo[0],r2))
    return mp
# semente: quad do topo da cabeça no novo; candidatos próximos no antigo, nas 4 rotações
cn=Vt[Qn].mean(1); co=Po[Qo].mean(1); q0=int(np.argmax(cn[:,1])); dist=np.linalg.norm(co-cn[q0],axis=1); cands=np.argsort(dist)[:400]
achou=None
for qj in cands:
    for r in range(4):
        mp=propaga(q0,int(qj),r)
        if mp is not None and (mp>=0).all():
            err=np.linalg.norm(Po[mp]-Vt,axis=1); 
            if achou is None or np.median(err)<achou[1]: achou=(mp,np.median(err),np.percentile(err,95),int(qj),r)
if achou is None: sys.exit('sem correspondência coerente')
print('correspondência: erro mediano %.4f m, p95 %.4f m (quad %d rot %d)'%achou[1:]); np.save('corr.npy',achou[0])

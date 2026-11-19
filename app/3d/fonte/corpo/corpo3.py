# Etapa 3: leva a pintura dos músculos do corpo antigo para o novo, calcula as cavidades e grava os dados do GLB
import numpy as np, json
from scipy.spatial import cKDTree
import scipy.sparse as sp
from atleta import carregar
from corpo2 import filho_principal
a=carregar(); info=a['info']; nodes=info['nodes']; c=np.load('corpo2.npz'); cj=json.load(open('corpo2.json'))
Vm,Vt,Nm,T,JO,Wt=c['Vm'],c['Vt'],c['Nm'],c['T'],c['JO'],c['Wt']; joints=cj['joints']; JT={k:np.array(v) for k,v in cj['JT'].items()}
X={n['name'].replace('mixamorig:',''):np.array(n['wm']).reshape(4,4).T[:3,3] for n in nodes if n['name'].startswith('mixamorig')}
fp=filho_principal(joints)
def feicao(P, dom, J):
    """coordenadas de cada vértice no osso dominante: fração ao longo do osso e raio normalizado"""
    F=np.zeros((len(P),3)); ok=np.zeros(len(P),bool); esc={}
    for bi,b in enumerate(joints):
        m=dom==bi
        if not m.any() or b not in fp or fp[b] not in J: continue
        d=J[fp[b]]-J[b]; L=np.linalg.norm(d); d/=L; x=P[m]-J[b]; u=x@d; r=x-np.outer(u,d); rm=np.median(np.linalg.norm(r,axis=1))+1e-6
        F[m]=np.c_[u/L][:, :1]*d*1.0+r/rm*.25; ok[m]=True; esc[bi]=(L,rm)
    return F,ok
src=np.load('corr.npy')   # correspondência exata (mesma topologia)
f=a['f']; MUSI=f('_MUSI',4)[src]; MUSW=f('_MUSW',4)[src]; FIBK=f('_FIBK',1)[src]; MUSP=f('_MUSP',1)[src]; cavO=f('_CAVITY',1)
# suaviza um pouco as bordas da pintura (média com vizinhos que têm o mesmo músculo principal)
n=len(Vm); E=np.concatenate([T[:,[0,1]],T[:,[1,2]],T[:,[2,0]]]); E=np.concatenate([E,E[:,::-1]]); Adj=sp.csr_matrix((np.ones(len(E)),(E[:,0],E[:,1])),shape=(n,n)); Adj.data[:]=1; deg=np.asarray(Adj.sum(1)).ravel(); Lm=sp.diags(1/deg)@Adj
# ---- musculatura mais desenhada, sem deformar: (1) realce das formas que o corpo já tem; (2) relevo leve dentro de cada músculo pintado ----
import os
REALCE=float(os.environ.get('REALCE','0.55')); RELEVO=float(os.environ.get('RELEVO','0.003'))
bn=cj['bnome']; top=c['top']; nome_dom=np.array(bn)[top[np.arange(n),np.argmax(Wt,1)]]
fora=np.array([('Hand' in b) or ('Foot' in b) or ('Toe' in b) or b in('Head','Neck') for b in nome_dom]); masc=(~fora).astype(float)
for _ in range(6): masc=.5*masc+.5*(Lm@masc)            # transição suave para cabeça, mãos e pés
liso=Vm.copy()
for _ in range(14): liso=.5*liso+.5*(Lm@liso)
dv=(Vm-liso); dn=np.einsum('ij,ij->i',dv,Nm); dn=np.clip(dn*REALCE,-.004,.004)*masc
cov=MUSW.sum(1); prof=MUSP[:,0]; sm=np.clip(prof/.6,0,1); sm=sm*sm*(3-2*sm); rel=RELEVO*(sm-.35)*np.clip(cov,0,1)*masc
for _ in range(2): rel=.5*rel+.5*(Lm@rel)
desl=(dn+rel)[:,None]*Nm; Vm=Vm+desl
Q={k:np.array(v) for k,v in cj['Q'].items()}; dT=np.zeros_like(Vm)
for k in range(4):
    for bi in np.unique(top[:,k]):
        m=top[:,k]==bi; dT[m]+=Wt[m,k:k+1]*(desl[m]@Q[bn[bi]].T)
Vt=Vt+dT
from corpo1 import normais
Nm=normais(Vm,T); print('realce: desloc. máx (mm)', np.abs(dn+rel).max()*1000, 'médio', np.abs(dn+rel).mean()*1000)
# cavidade: curvatura média com sinal (positivo = sulco), suavizada
viz=Lm@Vm; cur=-np.einsum('ij,ij->i',Nm,Vm-viz); el=np.median(np.linalg.norm(Vm[E[:,0]]-Vm[E[:,1]],axis=1)); cav=cur/el
for _ in range(3): cav=.5*cav+.5*(Lm@cav)
# escala em dois níveis: sulcos finos (entre músculos) e forma mais larga
cav2=cav.copy()
for _ in range(14): cav2=.5*cav2+.5*(Lm@cav2)
pO=np.percentile(cavO,[2,50,98]); bruto=cav*1.0+cav2*1.6; pN=np.percentile(bruto,[2,50,98]); k=(pO[2]-pO[0])/(pN[2]-pN[0]); CAV=np.clip((bruto-pN[1])*k*1.15,-1,1)
print('cavidade antiga p2/p50/p98', pO.round(3), ' nova', np.percentile(CAV,[2,50,98]).round(3))
# olhos (posição no repouso) a partir das esferas do MakeHuman
d=np.load('mh1.npz'); G=json.load(open('grupos.json')); Jm={k:np.array(v) for k,v in cj['Jm'].items()}; chao=d['V1'][:,1].min(); conv=lambda p:(np.asarray(p)-[0,chao,0])*.1*1.04
olhos=[]
for l in 'lr':
    ce=Jm[('Left' if l=='l' else 'Right')+'Eye']; olhos.append({'c':(JT['Head']+(ce-Jm['Head'])).round(5).tolist(),'r':0.0125})
ant=[n for n in nodes if n['mesh']][0]['extras']; print('olhos antigos', ant['eyes'], 'novos', olhos, '| fib', len(ant['fib']))
np.savez('corpo3.npz', POSITION=Vm.astype(np.float32), NORMAL=Nm.astype(np.float32), REST=Vt.astype(np.float32), JOINTS=JO.astype(np.uint8), WEIGHTS=Wt.astype(np.float32), MUSI=MUSI.astype(np.uint8), MUSW=MUSW.astype(np.float32), FIBK=FIBK.astype(np.float32), MUSP=MUSP.astype(np.float32), CAVITY=CAV.astype(np.float32), T=T.astype(np.uint32), IBM=c['IBM'].astype(np.float32))
for k,v in dict(np.load('corpo3.npz')).items(): v.tofile(f'bin/{k}.bin') if __import__('os').makedirs('bin',exist_ok=True) is None else None
json.dump({'tl':cj['tl'],'joints':joints,'eyes':olhos,'fib':ant['fib'],'n':int(n),'ntri':int(len(T))}, open('bin/meta.json','w')); print('gravado')

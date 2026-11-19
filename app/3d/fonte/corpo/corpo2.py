# Etapa 2: liga o corpo MakeHuman ao esqueleto do visualizador.
# O esqueleto fica com as medidas do corpo novo (juntas nos centros articulares de verdade) e a malha é presa na pose em A original,
# de modo que a deformação parte da pose para a qual o corpo e os pesos foram feitos.
import numpy as np, json, scipy.sparse as sp
from scipy.spatial import cKDTree
from corpo1 import normais
from esq import juntas_mh, D
from atleta import carregar
ESC=1.04
TRONCO={'Hips','Spine','Spine1','Spine2','Neck','Head','LeftShoulder','RightShoulder'}
def filho_principal(nomes):
    f={'Hips':'Spine','Spine':'Spine1','Spine1':'Spine2','Spine2':'Neck','Neck':'Head','Head':'HeadTop_End'}
    for s in ['Left','Right']:
        f.update({s+'Shoulder':s+'Arm',s+'Arm':s+'ForeArm',s+'ForeArm':s+'Hand',s+'Hand':s+'HandMiddle1',s+'UpLeg':s+'Leg',s+'Leg':s+'Foot',s+'Foot':s+'ToeBase',s+'ToeBase':s+'Toe_End'})
        for d in ['Thumb','Index','Middle','Ring','Pinky']:
            for k in (1,2,3): f[f'{s}Hand{d}{k}']=f'{s}Hand{d}{k+1}'
    return f
def rot_min(a,b):
    a=a/np.linalg.norm(a); b=b/np.linalg.norm(b); v=np.cross(a,b); c=a@b; s=np.linalg.norm(v)
    if s<1e-9: return np.eye(3)
    K=np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]]); return np.eye(3)+K+K@K*((1-c)/s**2)
if __name__=='__main__':
    a=carregar(); info=a['info']; nodes=info['nodes']; d=np.load('mh1.npz')
    S=sp.csr_matrix((d['Sdata'],d['Sind'],d['Sptr']),shape=tuple(d['Sshape'])); usados=d['usados']; nfull=len(d['Vfull']); mapa=-np.ones(nfull,int); mapa[usados]=np.arange(len(usados))
    chao=d['V1'][:,1].min(); conv=lambda p:(np.asarray(p)-[0,chao,0])*.1*ESC
    Vm=conv(d['V1']); T=d['T']
    Jmh=juntas_mh(d['Vfull']); Jm={k:conv(v[0]) for k,v in Jmh.items()}; Tm={k:conv(v[1]) for k,v in Jmh.items()}; pai_mh={k:v[2] for k,v in Jmh.items()}
    # juntas do esqueleto atual (Xbot) no repouso, com o nome sem prefixo
    idx={n['name'].replace('mixamorig:',''):i for i,n in enumerate(nodes)}; WMx={k:np.array(nodes[i]['wm']).reshape(4,4).T for k,i in idx.items()}
    X={k:m[:3,3] for k,m in WMx.items()}; pai={k:(nodes[nodes[i]['parent']]['name'].replace('mixamorig:','') if nodes[i]['parent']>=0 else None) for k,i in idx.items()}
    ossos=[k for k in idx if k not in('Armature','Atleta_Body')]; fp=filho_principal(ossos)
    # pontas que o rig do MakeHuman não tem como osso
    G=json.load(open('grupos.json')); Vf=d['Vfull']
    cabeca=np.where(S@(np.eye(1,len(usados),0).T*0+1)>0)[0]  # (sem uso)
    Jm['HeadTop_End']=np.array([0,Vm[:,1].max(),Jm['Head'][2]+.02]); 
    for s,l in [('Left','l'),('Right','r')]:
        Jm[s+'Eye']=conv(Vf[G[f'joint-{l}-eye']].mean(0)); Jm[s+'Toe_End']=Tm[s+'ToeBase']
        for dd in ['Thumb','Index','Middle','Ring','Pinky']: Jm[f'{s}Hand{dd}4']=Tm[f'{s}Hand{dd}3']
    # centraliza o tronco em x
    for k in ['Hips','Spine','Spine1','Spine2','Neck','Head','HeadTop_End']: Jm[k]=Jm[k]*[0,1,1]
    # rotação mínima de cada osso: direção no MakeHuman -> direção no repouso do esqueleto
    Q={}
    def base(f,n):
        e1=f/np.linalg.norm(f); e3=n-(n@e1)*e1; e3/=np.linalg.norm(e3); return np.c_[e1,np.cross(e3,e1),e3]
    alinha=lambda fm,nm,fx,nx: base(fx,nx)@base(fm,nm).T
    for k in ossos:
        if k in TRONCO or k not in fp or fp[k] not in Jm: Q[k]=np.eye(3); continue
        Q[k]=rot_min(Jm[fp[k]]-Jm[k], X[fp[k]]-X[k])
    # braço, antebraço, mão e dedos: além da direção, alinha também o giro em torno do osso
    # (dobra do cotovelo no braço; palma da mão no antebraço, na mão e nos dedos), para a pegada e a flexão baterem com as do esqueleto
    for s_,sg in [('Left',1),('Right',-1)]:
        dA=Jm[s_+'ForeArm']-Jm[s_+'Arm']; dF=Jm[s_+'Hand']-Jm[s_+'ForeArm']; hm=np.cross(dA,dF); ang=np.degrees(np.arcsin(np.linalg.norm(hm)/np.linalg.norm(dA)/np.linalg.norm(dF)))
        DA=X[s_+'ForeArm']-X[s_+'Arm']; DF=X[s_+'Hand']-X[s_+'ForeArm']; hx=np.cross(DA,[0,0,1.])
        pm=-sg*np.cross(Jm[s_+'HandIndex1']-Jm[s_+'Hand'],Jm[s_+'HandPinky1']-Jm[s_+'Hand']); px=-sg*np.cross(X[s_+'HandIndex1']-X[s_+'Hand'],X[s_+'HandPinky1']-X[s_+'Hand'])
        Q[s_+'Arm']=alinha(dA,hm,DA,hx); Q[s_+'ForeArm']=alinha(dF,hm,DF,hx)
        Q[s_+'Hand']=alinha(Jm[s_+'HandMiddle1']-Jm[s_+'Hand'],pm,X[s_+'HandMiddle1']-X[s_+'Hand'],px)
        for dd in ['Thumb','Index','Middle','Ring','Pinky']:
            for kk in (1,2,3):
                b=f'{s_}Hand{dd}{kk}'; c_=f'{s_}Hand{dd}{kk+1}'; Q[b]=alinha(Jm[c_]-Jm[b],pm,X[c_]-X[b],px)
        tw=lambda Qa,Qb,eixo: np.degrees(np.arccos(np.clip((np.trace(Qa.T@Qb)-1)/2,-1,1)))
        print(s_,'cotovelo dobrado no MH: %.1f°'%ang, '| palma no repouso do Xbot', (px/np.linalg.norm(px)).round(2), '| giro antebraço x mão no repouso: %.0f°'%tw(Q[s_+'ForeArm'],Q[s_+'Hand'],None))
    # pés: ficam como foram modelados (sola plana no chão); o esqueleto é que assume a direção do pé do corpo novo
    for s_ in ['Left','Right']:
        for k in ['Foot','ToeBase','Toe_End']: Q[s_+k]=np.eye(3)
    for k in ossos:
        if k not in fp and pai[k] in Q and k not in TRONCO: Q[k]=Q[pai[k]]      # pontas seguem o osso anterior
    # juntas novas no repouso (pose em T do esqueleto, medidas do corpo novo)
    ordem=[]; 
    def visita(k):
        ordem.append(k)
        for c in ossos:
            if pai[c]==k: visita(c)
    visita('Hips'); JT={'Hips':Jm['Hips'].copy()}
    for k in ordem[1:]: JT[k]=JT[pai[k]]+Q[pai[k]]@(Jm[k]-Jm[pai[k]])
    print('ombros (m): antes', round(X['LeftArm'][0]*2,3), 'agora', round(JT['LeftArm'][0]*2,3), '| quadril', round(X['LeftUpLeg'][0]*2,3), round(JT['LeftUpLeg'][0]*2,3), '| mão x', round(X['LeftHand'][0],3), round(JT['LeftHand'][0],3), '| pé', X['LeftFoot'].round(3), JT['LeftFoot'].round(3), '| topo', round(X['HeadTop_End'][1],3), round(JT['HeadTop_End'][1],3))
    # pesos (rig mixamo do MPFB2), levados para a malha subdividida
    wj=json.load(open(D+'rigs/standard/weights.mixamo.json'))['weights']; bn=sorted(wj); W0=np.zeros((len(usados),len(bn)))
    for bi,b in enumerate(bn):
        for vi,w in wj[b]:
            if mapa[vi]>=0: W0[mapa[vi],bi]=w
    sem=np.where(W0.sum(1)<1e-6)[0]; print('vértices sem peso', len(sem)); W0/=np.maximum(W0.sum(1,keepdims=True),1e-9); W1=S@W0
    top=np.argsort(-W1,axis=1)[:,:4]; Wt=np.take_along_axis(W1,top,1); Wt/=Wt.sum(1,keepdims=True); bnome=[b.replace('mixamorig:','') for b in bn]
    # malha no repouso (T): cada osso gira Q em torno da sua junta
    Vt=np.zeros_like(Vm)
    for k in range(4):
        for bi in np.unique(top[:,k]):
            m=top[:,k]==bi; b=bnome[bi]; Vt[m]+=Wt[m,k:k+1]*(JT[b]+(Vm[m]-Jm[b])@Q[b].T)
    print('repouso T: bbox', Vt.min(0).round(3), Vt.max(0).round(3), ' pose A: bbox', Vm.min(0).round(3), Vm.max(0).round(3))
    # matrizes de ligação e translações locais novas
    joints=[nodes[j]['name'].replace('mixamorig:','') for j in info['skin']['joints']]; IBM=[]
    for b in joints:
        A=np.eye(4); A[:3,:3]=Q[b].T@WMx[b][:3,:3]; A[:3,3]=Jm[b]; IBM.append(np.linalg.inv(A))
    tl={}
    for b in ossos:
        p=pai[b]; Mp=WMx[p]; Jp=JT[p] if p in JT else Mp[:3,3]; tl[b]=(np.linalg.inv(Mp[:3,:3])@(JT[b]-Jp)).tolist()
    jidx={b:i for i,b in enumerate(joints)}; JO=np.vectorize(lambda bi: jidx[bnome[bi]])(top)
    Nm=normais(Vm,T)
    np.savez('corpo2.npz', Vm=Vm, Vt=Vt, Nm=Nm, T=T, JO=JO, Wt=Wt, IBM=np.array(IBM), top=top)
    json.dump({'tl':tl,'JT':{k:v.tolist() for k,v in JT.items()},'Jm':{k:v.tolist() for k,v in Jm.items()},'joints':joints,'bnome':bnome,'Q':{k:v.tolist() for k,v in Q.items()}}, open('corpo2.json','w'))
    print('ok', len(Vm), 'verts')

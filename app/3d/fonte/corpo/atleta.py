import numpy as np, json
A='/home/claude/mh/gt/atleta/'
def carregar():
    info=json.load(open(A+'info.json')); f=lambda n,k: np.fromfile(A+n+'.f32',dtype=np.float32).reshape(-1,k).astype(float)
    P=f('POSITION',3); JN=f('JOINTS_0',4).astype(int); W=f('WEIGHTS_0',4); W/=W.sum(1,keepdims=True)
    nodes=info['nodes']; jn=info['skin']['joints']; ibm=np.array(info['skin']['ibm']).reshape(-1,4,4).transpose(0,2,1)
    WM=np.array([np.array(nodes[j]['wm']).reshape(4,4).T for j in jn]); SK=WM@ibm     # matriz de skin de cada junta na pose de repouso
    Ph=np.c_[P,np.ones(len(P))]; Pw=np.zeros((len(P),3))
    for k in range(4): Pw+=W[:,k:k+1]*np.einsum('nij,nj->ni',SK[JN[:,k]],Ph)[:,:3]
    nomes=[nodes[j]['name'].replace('mixamorig:','') for j in jn]
    return dict(info=info,P=P,Pw=Pw,JN=JN,W=W,nomes=nomes,WM=WM,ibm=ibm,SK=SK,T=np.fromfile(A+'indices.u32',dtype=np.uint32).reshape(-1,3).astype(int),f=f)
if __name__=='__main__':
    a=carregar(); Pw=a['Pw']; print('bbox real', Pw.min(0).round(3), Pw.max(0).round(3))
    d=np.load('mh1.npz'); V1=d['V1']*.1
    top=np.argsort(-V1[:,1])[:3000]; x=Pw[top]; b=V1[top]; ca=x-x.mean(0); cb=b-b.mean(0); U,s,Vt=np.linalg.svd(cb.T@ca); Rm=(U@Vt).T; sc=s.sum()/(cb**2).sum(); res=np.linalg.norm(ca-(sc*cb@Rm.T),axis=1)
    print('cabeça por índice: escala',round(sc,4),'resíduo mediano (m)',round(np.median(res),5),'p90',round(np.percentile(res,90),5)); print(Rm.round(3))
    print('SK[0] (repouso):', a['SK'][0].round(4).tolist())

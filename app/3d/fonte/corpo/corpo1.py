# Etapa 1: corpo MakeHuman (base + alvos), subdividido, na pose de repouso do MakeHuman
import numpy as np, gzip, json, os, scipy.sparse as sp
D='/home/claude/mh/mpfb2/src/mpfb/data/'
def carregar_obj(p):
    V=[]; G={}; cur=None
    for l in open(p):
        if l.startswith('v '): V.append([float(x) for x in l.split()[1:4]])
        elif l.startswith('g '): cur=l.split()[1]; G.setdefault(cur,[])
        elif l.startswith('f '): G[cur].append([int(t.split('/')[0])-1 for t in l.split()[1:]])
    return np.array(V), G
def alvo(nome, n):
    d=np.zeros((n,3))
    with gzip.open(D+'targets/'+nome+'.target.gz','rt') as f:
        for l in f:
            if l.startswith('#') or not l.strip(): continue
            a=l.split(); d[int(a[0])]=[float(a[1]),float(a[2]),float(a[3])]
    return d
def receita(musc=1.0, peso=.32, prop=.65, extras=None):
    R={}
    for e in ['african','asian','caucasian']: R[f'macrodetails/{e}-male-young']=1/3
    fm={'maxmuscle':max(0,2*musc-1),'averagemuscle':1-abs(2*musc-1),'minmuscle':max(0,1-2*musc)}
    fw={'maxweight':max(0,2*peso-1),'averageweight':1-abs(2*peso-1),'minweight':max(0,1-2*peso)}
    for a,wa in fm.items():
        for b,wb in fw.items():
            if wa*wb>0:
                R[f'macrodetails/universal-male-young-{a}-{b}']=wa*wb
                pi=max(0,2*prop-1)
                if pi>0 and os.path.exists(D+f'targets/macrodetails/proportions/male-young-{a}-{b}-idealproportions.target.gz'): R[f'macrodetails/proportions/male-young-{a}-{b}-idealproportions']=pi*wa*wb
    R.update(extras or {})
    return R
EXTRAS={'stomach/stomach-tone-incr':1.0,'torso/torso-muscle-pectoral-incr':.6,'torso/torso-muscle-dorsi-incr':.7,'torso/torso-vshape-incr':.2,
        'arms/l-upperarm-muscle-incr':.6,'arms/r-upperarm-muscle-incr':.6,'arms/l-upperarm-shoulder-muscle-incr':.6,'arms/r-upperarm-shoulder-muscle-incr':.6,
        'arms/l-lowerarm-muscle-incr':.5,'arms/r-lowerarm-muscle-incr':.5,'legs/l-upperleg-muscle-incr':.7,'legs/r-upperleg-muscle-incr':.7,
        'legs/l-lowerleg-muscle-incr':.6,'legs/r-lowerleg-muscle-incr':.6,'pelvis/pelvis-tone-incr':.6,'pelvis/bulge-decr':.7}
def catmull(nv, F):
    """matriz S (n1 x n0) e faces novas (quads) de uma subdivisão Catmull-Clark"""
    F=[list(f) for f in F]; nf=len(F); ed={}; ef={}
    for fi,f in enumerate(F):
        for i in range(len(f)):
            a,b=f[i],f[(i+1)%len(f)]; k=(min(a,b),max(a,b)); ed.setdefault(k,len(ed)); ef.setdefault(k,[]).append(fi)
    ne=len(ed); n1=nv+ne+nf; rows=[];cols=[];vals=[]
    def ad(r,c,v): rows.append(r);cols.append(c);vals.append(v)
    for fi,f in enumerate(F):
        for v in f: ad(nv+ne+fi,v,1/len(f))
    Pf=sp.csr_matrix((vals,(rows,cols)),shape=(n1,nv)); rows=[];cols=[];vals=[]
    Pfl=Pf.tolil()
    borda=set(); vb={}
    for k,ei in ed.items():
        a,b=k
        if len(ef[k])==2:
            ad(nv+ei,a,.25); ad(nv+ei,b,.25)
        else:
            ad(nv+ei,a,.5); ad(nv+ei,b,.5); borda.add(k); vb.setdefault(a,[]).append(b); vb.setdefault(b,[]).append(a)
    Pe=sp.csr_matrix((vals,(rows,cols)),shape=(n1,nv))
    # parte dos pontos de face nas arestas internas
    r2=[];c2=[];v2=[]
    for k,ei in ed.items():
        if len(ef[k])==2:
            for fi in ef[k]: r2.append(nv+ei); c2.append(nv+ne+fi); v2.append(.25)
    Ef=sp.csr_matrix((v2,(r2,c2)),shape=(n1,n1))
    Pe=Pe+Ef@Pf
    # vértices
    vf={}; ve={}
    for fi,f in enumerate(F):
        for v in f: vf.setdefault(v,[]).append(fi)
    for k in ed:
        for v in k: ve.setdefault(v,[]).append(k)
    rows=[];cols=[];vals=[]; r3=[];c3=[];v3=[]
    for v in range(nv):
        if v not in vf: continue
        if v in vb and len(vb[v])==2:
            ad(v,v,.75); ad(v,vb[v][0],.125); ad(v,vb[v][1],.125)
        else:
            n=len(vf[v]); ad(v,v,(n-3)/n)
            for k in ve[v]:
                o=k[0] if k[1]==v else k[1]; ad(v,v,1/(n*len(ve[v]))); ad(v,o,1/(n*len(ve[v])))   # 2R/n, R = média dos pontos médios
            for fi in vf[v]: r3.append(v); c3.append(nv+ne+fi); v3.append(1/(n*n))
    Pv=sp.csr_matrix((vals,(rows,cols)),shape=(n1,nv))+sp.csr_matrix((v3,(r3,c3)),shape=(n1,n1))@Pf
    S=(Pf+Pe+Pv).tocsr()
    NF=[]
    for fi,f in enumerate(F):
        m=len(f)
        for i in range(m):
            a=f[i]; e1=ed[(min(a,f[(i+1)%m]),max(a,f[(i+1)%m]))]; e0=ed[(min(a,f[i-1]),max(a,f[i-1]))]
            NF.append([a, nv+e1, nv+ne+fi, nv+e0])
    return S, np.array(NF)
def normais(V,T):
    n=np.zeros_like(V); fn=np.cross(V[T[:,1]]-V[T[:,0]],V[T[:,2]]-V[T[:,0]])
    for i in range(3): np.add.at(n,T[:,i],fn)
    return n/np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-12)
if __name__=='__main__':
    V0,G=carregar_obj(D+'3dobjs/base.obj'); n=len(V0); R=receita(extras=EXTRAS)
    V=V0.copy()
    for k,w in R.items(): V+=w*alvo(k,n)
    Fb=G['body']; usados=sorted({v for f in Fb for v in f}); mapa=-np.ones(n,int); mapa[usados]=np.arange(len(usados))
    F=[[mapa[v] for v in f] for f in Fb]; print('corpo: verts',len(usados),'faces',len(Fb),'tipos',{len(f) for f in Fb})
    S,Q=catmull(len(usados),F); Vb=V[usados]; V1=S@Vb; assert abs(S.sum(axis=1)-1).max()<1e-9
    T=np.concatenate([Q[:,[0,1,2]],Q[:,[0,2,3]]]); print('subdividido: verts',len(V1),'tris',len(T), 'alt (dm)', V1[:,1].min(), V1[:,1].max())
    np.savez('mh1.npz', Vfull=V, V0full=V0, usados=np.array(usados), V1=V1, Q=Q, T=T, Sdata=S.data, Sind=S.indices, Sptr=S.indptr, Sshape=S.shape)
    json.dump({k:[int(i) for f in fs for i in f] for k,fs in G.items() if k.startswith('joint-') or k.startswith('helper-l-eye') or k.startswith('helper-r-eye')}, open('grupos.json','w'))
    print(json.dumps(R)[:600])

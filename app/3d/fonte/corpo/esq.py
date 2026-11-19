import numpy as np, json
D='/home/claude/mh/mpfb2/src/mpfb/data/'
def juntas_mh(Vfull):
    """posição (cabeça e ponta) de cada osso do rig mixamo do MPFB2, medida na malha (dm, y para cima)"""
    rig=json.load(open(D+'rigs/standard/rig.mixamo.json'))['bones']; G=json.load(open('grupos.json'))
    def pos(e):
        s=e['strategy']
        if s=='CUBE': return Vfull[G[e['cube_name']]].mean(0)
        if s=='MEAN': return Vfull[e['vertex_indices']].mean(0)
        if s=='VERTEX': return Vfull[e['vertex_index']]
        dp=e['default_position']; return np.array([dp[0],dp[2],-dp[1]])*10
    return {k.replace('mixamorig:',''):(pos(b['head']),pos(b['tail']),(b.get('parent') or '').replace('mixamorig:','')) for k,b in rig.items()}
if __name__=='__main__':
    from atleta import carregar
    a=carregar(); nodes=a['info']['nodes']
    X={n['name'].replace('mixamorig:',''):np.array(n['wm']).reshape(4,4).T[:3,3] for n in nodes if n['name'].startswith('mixamorig')}
    d=np.load('mh1.npz'); J=juntas_mh(d['Vfull']); 
    chao=d['V1'][:,1].min(); H={k:(v[0]-[0,chao,0])*.1 for k,v in J.items()}; Tl={k:(v[1]-[0,chao,0])*.1 for k,v in J.items()}
    print('altura MH (m)', (d['V1'][:,1].max()-chao)*.1, ' altura Atleta 1.747, topo do esqueleto Xbot', X['HeadTop_End'][1])
    seg=[('Hips','Spine'),('Spine','Spine1'),('Spine1','Spine2'),('Spine2','Neck'),('Neck','Head'),('LeftShoulder','LeftArm'),('LeftArm','LeftForeArm'),('LeftForeArm','LeftHand'),('LeftHand','LeftHandMiddle1'),('LeftUpLeg','LeftLeg'),('LeftLeg','LeftFoot'),('LeftFoot','LeftToeBase'),('LeftUpLeg','RightUpLeg'),('LeftArm','RightArm')]
    for p,c in seg:
        lm=np.linalg.norm(H[c]-H[p]); lx=np.linalg.norm(X[c]-X[p]); dm=(H[c]-H[p])/lm; dx=(X[c]-X[p])/lx
        print(f'{p:>13}->{c:<16} MH {lm:.3f}  Xbot {lx:.3f}  razão {lx/lm:.3f}  ângulo {np.degrees(np.arccos(np.clip(dm@dx,-1,1))):5.1f}°')
    for k in ['Hips','Head','LeftArm','LeftHand','LeftUpLeg','LeftFoot','LeftToeBase']: print(k,'MH',H[k].round(3),'Xbot',X[k].round(3))
    print(sorted(set(J)-set(X)), sorted(set(X)-set(J)))

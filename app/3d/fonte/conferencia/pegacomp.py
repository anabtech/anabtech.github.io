import json
a=json.load(open('pega-novo.json')); b=json.load(open('pega-velho.json')); r=[]; mod={}
for k,v in a.items():
    w=b.get(k)
    if 'erro' in v or not w or 'erro' in w: print('erro',k); continue
    for m in (v.get('modo') or {}).values(): mod[m]=mod.get(m,0)+1
    pior=0; q=0
    for h in ('Left','Right'):
        for x,y in zip(v['d'][h],w['d'][h]):
            if x is None or y is None: continue
            if y<=20 and x>y+12: q+=1; pior=max(pior,x-y)
    if q: r.append((pior,q,k,v.get('anc'),v.get('modo')))
r.sort(reverse=True); print('mãos por modo:',mod); print('exercícios com a mão longe do aparelho (mais de 12 mm além do 3D antigo):',len(r))
for x in r: print(' ',x[2],'pior',x[0],'mm em',x[1],'amostras', x[3], x[4])

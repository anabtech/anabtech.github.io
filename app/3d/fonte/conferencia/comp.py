import json
a=json.load(open('salto.json')); b=json.load(open('salto-velho.json'))
r=[]
for k in a:
    n=a[k][0]; v=b.get(k,[[0,0,0]])[0]
    d=[round(n[i]-v[i],1) for i in range(3)]
    if d[0]>4 or d[1]>4 or d[2]>1.5: r.append((max(d[0]/4,d[1]/4,d[2]/1.5),k,n,v,a[k][1]))
r.sort(reverse=True); print('pulam mais que o antigo:',len(r))
for x in r: print(' ',x[1],'novo',x[2],'velho',x[3],'t',x[4])


/* ====================================================================================
   Equipamentos v2 (AnabTech): modelos detalhados de barra, anilhas, halteres, banco,
   suporte e pilhas de peso; sombra de contato no piso; acabamento dos materiais.
   Este trecho roda dentro do módulo do visualizador e reaproveita os nomes dele
   (Ft, kt, Hn, p, hn = THREE). Mantém as mesmas medidas e interfaces dos originais.
   ==================================================================================== */
const T3 = hn, LIMA = 0xc8ff3d, V2 = { on: typeof location < 'u' && new URLSearchParams(location.search).get('v2') !== '0' };
const _tx2 = {};
function tx2(k, w, h, fn, o = {}) { if (_tx2[k]) return _tx2[k]; const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new T3.CanvasTexture(c); if (o.rep) t.wrapS = t.wrapT = T3.RepeatWrapping; if (o.cor) t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 8; return _tx2[k] = t; }
const rep2 = (t, u, v) => { const c = t.clone(); c.wrapS = c.wrapT = T3.RepeatWrapping; c.repeat.set(u, v); c.needsUpdate = true; return c; };
/* recartilhado (losangos) para barras e pegadas */
const txKnurl = () => tx2('knurl', 64, 64, (g, w, h) => { g.fillStyle = '#6a6a6a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffffff'; g.lineWidth = 3.2; for (let i = -64; i < 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke(); g.beginPath(); g.moveTo(i + 64, 0); g.lineTo(i, 64); g.stroke(); } }, { rep: 1 });
/* borracha granulada com flocos claros (piso) */
const txPiso = () => tx2('piso', 512, 512, (g, w, h) => { g.fillStyle = '#565c64'; g.fillRect(0, 0, w, h); let s = 7; const r = () => (s = s * 16807 % 2147483647) / 2147483647; for (let i = 0; i < 5200; i++) { const x = r() * w, y = r() * h, a = r(); g.fillStyle = a < .035 ? 'rgba(200,255,61,.6)' : a < .45 ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(x, y, .6 + r() * 1.5, 0, 7); g.fill(); } }, { rep: 1, cor: 1 });
const txGrao = () => tx2('grao', 256, 256, (g, w, h) => { const d = g.createImageData(w, h); let s = 23; const r = () => (s = s * 16807 % 2147483647) / 2147483647; for (let i = 0; i < w * h; i++) { const v = 110 + r() * 40; d.data[4 * i] = d.data[4 * i + 1] = d.data[4 * i + 2] = v; d.data[4 * i + 3] = 255; } g.putImageData(d, 0, 0); }, { rep: 1 });
/* texto em arco para a face das anilhas e número para o halter */
function txAnilha(kg) { return tx2('anilha' + kg, 1024, 1024, (g, w) => { const c = w / 2; g.clearRect(0, 0, w, w); const arco = (txt, raio, ang0, sent, fonte, cor) => { g.font = fonte; g.fillStyle = cor; g.textAlign = 'center'; g.textBaseline = 'middle'; const L = [...txt], larg = L.map(ch => g.measureText(ch).width + 10), tot = larg.reduce((a, b) => a + b, 0); let a = ang0 - sent * tot / raio / 2; L.forEach((ch, i) => { a += sent * larg[i] / raio / 2; g.save(); g.translate(c + raio * Math.cos(a), c + raio * Math.sin(a)); g.rotate(a + sent * Math.PI / 2); g.fillText(ch, 0, 0); g.restore(); a += sent * larg[i] / raio / 2; }); };
  arco('ANABTECH', 400, -Math.PI / 2, 1, '700 96px "Space Grotesk", Arial, sans-serif', 'rgba(236,240,243,.95)'); arco(kg + ' KG', 400, Math.PI / 2, -1, '700 104px "Space Grotesk", Arial, sans-serif', 'rgba(200,255,61,.98)');
  g.strokeStyle = 'rgba(236,240,243,.5)'; g.lineWidth = 5; for (const a0 of [-.62, .62]) { g.beginPath(); g.arc(c, c, 400, a0 - .28 + (a0 > 0 ? 0 : Math.PI) * 0, a0 + .28); g.stroke(); g.beginPath(); g.arc(c, c, 400, Math.PI + a0 - .28, Math.PI + a0 + .28); g.stroke(); } }, { cor: 1 }); }
function txNumero(n) { return tx2('num' + n, 256, 256, (g, w) => { const c = w / 2; g.clearRect(0, 0, w, w); g.strokeStyle = 'rgba(200,255,61,.95)'; g.lineWidth = 9; g.beginPath(); g.arc(c, c, 108, 0, 7); g.stroke(); g.fillStyle = 'rgba(236,240,243,.96)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 112px "Space Grotesk", Arial, sans-serif'; g.fillText(String(n), c, c - 12); g.font = '700 38px "Space Grotesk", Arial, sans-serif'; g.fillText('KG', c, c + 62); }, { cor: 1 }); }
/* furos de regulagem das colunas */
const txFuros = () => tx2('furos', 64, 64, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#0a0b0c'; g.beginPath(); g.arc(w / 2, h / 2, 9, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.0)'; }, { rep: 1, cor: 1 });
function txMarca() { return tx2('marca', 512, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#c8ff3d'; g.font = '700 84px "Space Grotesk", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('anabtech', w / 2, h / 2 + 4); }, { cor: 1 }); }
const m2 = {
  cromo: (r = .14) => new T3.MeshStandardMaterial({ color: 0xe3e7ea, metalness: 1, roughness: r, envMapIntensity: 6 }),
  aco: () => new T3.MeshStandardMaterial({ color: 0x4a5058, metalness: .9, roughness: .34, envMapIntensity: 5 }),
  pintura: () => new T3.MeshStandardMaterial({ color: 0x343a41, metalness: .6, roughness: .38, envMapIntensity: 5 }),
  borracha: (tr) => new T3.MeshStandardMaterial({ color: 0x191b1e, metalness: 0, roughness: .74, envMapIntensity: 2, transparent: !!tr, bumpMap: txGrao(), bumpScale: .12 }),
  lima: (tr) => new T3.MeshStandardMaterial({ color: LIMA, metalness: .05, roughness: .45, envMapIntensity: 2, transparent: !!tr }),
  decal: (map) => new T3.MeshStandardMaterial({ map, transparent: true, roughness: .55, metalness: 0, envMapIntensity: 2, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false })
};
const M2 = (g, mt) => new T3.Mesh(g, mt);
const torno = (pts, seg = 72) => { const g = new T3.LatheGeometry(pts.map(([r, y]) => new T3.Vector2(r, y)), seg); g.computeVertexNormals(); return g; };
/* cilindro com as bordas chanfradas (eixo Y) */
const cilCh = (r, h, ch = Math.min(.004, r * .25, h * .25), seg = 40) => torno([[0, -h / 2], [r - ch, -h / 2], [r, -h / 2 + ch], [r, h / 2 - ch], [r - ch, h / 2], [0, h / 2]], seg);
const parafuso = (mt, r = .008) => { const g = new T3.Group(), a = M2(new T3.CylinderGeometry(r, r, .006, 6), mt); g.add(a); const b = M2(new T3.CylinderGeometry(r * .55, r * .55, .009, 12), mt); g.add(b); return g; };

/* ---------- anilha olímpica de borracha (eixo ao longo de X, como a original) ---------- */
function anilha2(R, esp, mats, kg, comFaixa, lados = [1, -1], giro = 1) {
  const o = esp / 2, g = new T3.Group(), rb = mats.b, hub = mats.h;
  const corpo = M2(torno([[.074, -o * .62], [.082, -o * .8], [R * .40, -o * .8], [R * .44, -o * .46], [R * .80, -o * .46], [R * .835, -o], [R - .014, -o], [R - .004, -o * .84], [R, -o * .52], [R, o * .52], [R - .004, o * .84], [R - .014, o], [R * .835, o], [R * .80, o * .46], [R * .44, o * .46], [R * .40, o * .8], [.082, o * .8], [.074, o * .62]], 96), rb);
  g.add(corpo);
  g.add(M2(torno([[.0255, -o * .8], [.031, -o * .9], [.066, -o * .9], [.076, -o * .7], [.076, o * .7], [.066, o * .9], [.031, o * .9], [.0255, o * .8]], 64), hub));
  for (const s of lados) { const d = M2(new T3.RingGeometry(R * .45, R * .795, 96), mats.d(kg)); d.rotation.x = -s * Math.PI / 2; d.rotation.z = giro * s * Math.PI / 2; d.position.y = s * (o * .46 + .0006); d.renderOrder = 2; g.add(d);
    if (comFaixa) { const f = M2(new T3.TorusGeometry(R * .835, .0028, 8, 96), mats.l); f.rotation.x = Math.PI / 2; f.position.y = s * (o - .0005); g.add(f); } }
  g.rotation.z = Math.PI / 2; return g;
}
/* ---------- barra olímpica com anilhas ---------- */
const _Gt = Gt;
Gt = function (a = {}) {
  if (!V2.on) return _Gt(a);
  const { plate: n = .225, len: e = 2, pad: t = !1 } = a, g = new T3.Group(), cr = m2.cromo(.12), crF = m2.cromo(.3), kn = m2.cromo(.34);
  kn.bumpMap = rep2(txKnurl(), 14, 1); kn.bumpScale = .5;
  const rb = m2.borracha(true), li = m2.lima(true), hb = m2.cromo(.28); hb.transparent = true; const decs = {}, mats = { b: rb, l: li, h: hb, d: kg => decs[kg] || (decs[kg] = m2.decal(txAnilha(kg))) };
  const eixo = M2(new T3.CylinderGeometry(.014, .014, 1.31, 32), cr); eixo.rotation.z = Math.PI / 2; g.add(eixo);
  /* recartilhado em quatro trechos, com o centro e os anéis de marcação lisos */
  for (const [x, L] of [[-.47, .30], [-.165, .25], [.165, .25], [.47, .30]]) { const m = kn.clone(); m.bumpMap = rep2(txKnurl(), 14, Math.round(L / .0064)); const k = M2(new T3.CylinderGeometry(.01425, .01425, L, 32, 1, true), m); k.rotation.z = Math.PI / 2; k.position.x = x; g.add(k); }
  const c = (e - 1.31) / 2 - .04;
  for (const h of [-1, 1]) {
    const col = M2(cilCh(.036, .03, .004), crF); col.rotation.z = Math.PI / 2; col.position.x = h * (1.31 / 2 + .015); g.add(col);
    const lu = M2(new T3.CylinderGeometry(.025, .025, c, 36), crF); lu.rotation.z = Math.PI / 2; lu.position.x = h * (1.31 / 2 + .03 + c / 2); g.add(lu);
    for (let i = 0; i < 5; i++) { const rg = M2(new T3.TorusGeometry(.0252, .0009, 6, 36), cr); rg.rotation.y = Math.PI / 2; rg.position.x = h * (1.31 / 2 + .03 + c - .012 - i * .012); g.add(rg); }
    const tp = M2(cilCh(.0245, .012, .004), cr); tp.rotation.z = Math.PI / 2; tp.position.x = h * (1.31 / 2 + .03 + c + .004); g.add(tp);
    const kgG = n >= .21 ? 20 : n >= .17 ? 10 : 5, p1 = anilha2(n, .06, mats, kgG, true, [h], 1); p1.position.x = h * .74; g.add(p1);
    const p2 = anilha2(n * .82, .045, mats, kgG === 20 ? 10 : 5, false, [-h], 1); p2.position.x = h * .795; g.add(p2);
    /* presilha: anel de aperto com alavanca */
    const pr = M2(cilCh(.034, .022, .003), m2.aco()); pr.rotation.z = Math.PI / 2; pr.position.x = h * .832; g.add(pr);
    const al = M2(new T3.BoxGeometry(.014, .03, .012), li); al.position.set(h * .832, .042, 0); g.add(al);
  }
  if (t) { const es = M2(cilCh(.045, .42, .012), new T3.MeshStandardMaterial({ color: 0x1d2024, roughness: .9, bumpMap: txGrao(), bumpScale: .3, envMapIntensity: 2 })); es.rotation.z = Math.PI / 2; g.add(es); }
  g.userData.fade = h => { for (const m of [rb, li, hb, ...Object.values(decs)]) { m.opacity = h; if (m !== hb && !m.map) m.depthWrite = h > .99; hb.depthWrite = h > .99; } };
  return Hn(g);
};
/* ---------- halter sextavado ---------- */
const _be = be;
be = function (a = {}) {
  if (!V2.on) return _be(a);
  const { len: n = .34, plate: e = .085 } = a, g = new T3.Group(), cr = m2.cromo(.2), kn = m2.cromo(.36), rb = m2.borracha(true), li = m2.lima(true);
  kn.bumpMap = rep2(txKnurl(), 16, Math.max(6, Math.round((n - .16) / .0064))); kn.bumpScale = .5;
  const kg = e >= .1 ? 20 : e >= .08 ? 12 : e >= .065 ? 8 : 5, dec = m2.decal(txNumero(kg));
  const L = n - .14 - .004;
  const pg = M2(torno([[0, -L / 2], [.0158, -L / 2], [.0172, -L * .3], [.018, 0], [.0172, L * .3], [.0158, L / 2], [0, L / 2]], 36), kn); pg.rotation.z = Math.PI / 2; g.add(pg);
  const sh = new T3.Shape(), b = .007, r = e - b; for (let i = 0; i < 6; i++) { const an = Math.PI / 6 + i * Math.PI / 3, x = r * Math.cos(an), y = r * Math.sin(an); i ? sh.lineTo(x, y) : sh.moveTo(x, y); } sh.closePath();
  const gh = new T3.ExtrudeGeometry(sh, { depth: .07 - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 4, curveSegments: 1 }); gh.translate(0, 0, -(.07 - 2 * b) / 2); gh.type = 'BufferGeometry';
  for (const s of [-1, 1]) {
    const hd = M2(gh, rb); hd.rotation.y = Math.PI / 2; hd.position.x = s * (n / 2 - .035); g.add(hd);
    const fl = M2(cilCh(.031, .012, .003), cr); fl.rotation.z = Math.PI / 2; fl.position.x = s * (n / 2 - .07 - .006); g.add(fl);
    const an = M2(new T3.TorusGeometry(.032, .0022, 8, 40), li); an.rotation.y = Math.PI / 2; an.position.x = s * (n / 2 - .07 - .0005); g.add(an);
    const d = M2(new T3.CircleGeometry(e * .56, 40), dec); d.rotation.y = s * Math.PI / 2; d.position.x = s * (n / 2 + .0006); d.renderOrder = 2; g.add(d);
  }
  g.userData.fade = h => { for (const m of [rb, li, dec]) { m.opacity = h; if (!m.map) m.depthWrite = h > .99; } };
  return Hn(g);
};
/* ---------- banco reto ---------- */
const _Bt = Bt;
Bt = function (a = {}) {
  if (!V2.on) return _Bt(a);
  const { h: n = .43, len: e = 1.15, w: t = .3 } = a, g = new T3.Group(), pad = Ft.pad(), fr = Ft.frame(), li = m2.lima(), cr = m2.cromo(.22), bo = m2.borracha();
  const est = M2(new T3.BoxGeometry(t, .07, e), pad); est.position.y = n - .035; g.add(est);
  const base = M2(new T3.BoxGeometry(t - .03, .012, e - .03), m2.pintura()); base.position.y = n - .0795; g.add(base);
  const vivo = M2(new T3.BoxGeometry(t - .022, .004, e - .022), li); vivo.position.y = n - .0715; g.add(vivo);
  const esp = M2(new T3.BoxGeometry(.07, .05, e - .14), fr); esp.position.y = n - .107; g.add(esp);
  for (const z of [-e / 2 + .12, e / 2 - .12]) {
    const col = M2(new T3.BoxGeometry(.06, n - .14, .06), fr); col.position.set(0, (n - .14) / 2 + .04, z); g.add(col);
    const pe = M2(new T3.BoxGeometry(.44, .045, .07), fr); pe.position.set(0, .0225, z); g.add(pe);
    for (const s of [1, -1]) { const tp = M2(new T3.BoxGeometry(.028, .054, .08), bo); tp.position.set(s * .222, .027, z); g.add(tp);
      const pf = parafuso(cr, .0075); pf.position.set(s * .05, .0455, z); g.add(pf);
      const ref = M2(new T3.BoxGeometry(.012, .1, .05), fr); ref.position.set(s * .036, n - .16, z); ref.rotation.z = s * .5; g.add(ref); }
  }
  /* rodinhas de transporte de um lado e alça do outro */
  for (const s of [1, -1]) { const rd = M2(cilCh(.034, .026, .006), bo); rd.rotation.z = Math.PI / 2; rd.position.set(s * .2, .036, -e / 2 + .07); g.add(rd); const cb = M2(cilCh(.014, .03, .003), cr); cb.rotation.z = Math.PI / 2; cb.position.set(s * .2, .036, -e / 2 + .07); g.add(cb); }
  const al = M2(new T3.TorusGeometry(.06, .009, 10, 28, Math.PI), cr); al.rotation.x = Math.PI / 2; al.position.set(0, n - .107, e / 2 - .07); g.add(al);
  const mk = M2(new T3.PlaneGeometry(.2, .05), m2.decal(txMarca())); mk.rotation.y = Math.PI / 2; mk.position.set(.0356, n - .107, 0); g.add(mk); const mk2 = mk.clone(); mk2.rotation.y = -Math.PI / 2; mk2.position.x = -.0356; g.add(mk2);
  return Hn(g);
};
/* ---------- banco com suporte de barra ---------- */
const _Ix = Ix;
Ix = function (a = {}) {
  if (!V2.on) return _Ix(a);
  const { h: n = .43, len: e = 1.2, rackZ: t = -.62, hookY: i = 1.02 } = a, o = Bt({ h: n, len: e }), fr = Ft.frame(), li = m2.lima(), cr = m2.cromo(.22), bo = m2.borracha(), furo = new T3.MeshStandardMaterial({ color: 0x0c0d0f, roughness: .9, envMapIntensity: 1 });
  for (const s of [1, -1]) {
    const col = M2(new T3.BoxGeometry(.065, 1.3, .065), fr); col.position.set(s * .55, .65, t); o.add(col);
    for (let k = 0; k < 9; k++) { const f = M2(new T3.CylinderGeometry(.009, .009, .067, 14), furo); f.rotation.z = Math.PI / 2; f.position.set(s * .55, .52 + k * .085, t); o.add(f); }
    const tp = M2(new T3.BoxGeometry(.07, .02, .07), bo); tp.position.set(s * .55, 1.308, t); o.add(tp);
    /* gancho em J: base, encosto e trava da frente, com forro de proteção */
    const gb = M2(new T3.BoxGeometry(.06, .04, .1), fr); gb.position.set(s * .55, i, t + .05); o.add(gb);
    const fo = M2(new T3.BoxGeometry(.062, .006, .102), li); fo.position.set(s * .55, i + .0225, t + .05); o.add(fo);
    const tr = M2(new T3.BoxGeometry(.06, .06, .016), fr); tr.position.set(s * .55, i + .03, t + .106); o.add(tr);
    const pe = M2(new T3.BoxGeometry(.08, .045, .56), fr); pe.position.set(s * .55, .0225, t + .03); o.add(pe);
    for (const z of [-.265, .265]) { const b = M2(new T3.BoxGeometry(.088, .052, .03), bo); b.position.set(s * .55, .026, t + .03 + z); o.add(b); }
    const ref = M2(new T3.BoxGeometry(.012, .26, .05), fr); ref.position.set(s * .55, .15, t + .12); ref.rotation.x = -.62; o.add(ref);
  }
  const tv = M2(new T3.BoxGeometry(1.1, .05, .05), fr); tv.position.set(0, .3, t); o.add(tv);
  const tv2 = M2(new T3.BoxGeometry(1.1, .05, .05), fr); tv2.position.set(0, 1.22, t); o.add(tv2);
  const mk = M2(new T3.PlaneGeometry(.26, .065), m2.decal(txMarca())); mk.position.set(0, 1.22, t + .0256); o.add(mk);
  return Hn(o);
};
/* ---------- tapete de borracha ---------- */
const _V = V;
V = function (sc, e = 1.5, t = 1.1, i = 0, o = .05) {
  if (!V2.on) return _V(sc, e, t, i, o);
  const forma = (w, d, r) => { const s = new T3.Shape(), a = w / 2, b = d / 2; s.moveTo(-a + r, -b); s.lineTo(a - r, -b); s.quadraticCurveTo(a, -b, a, -b + r); s.lineTo(a, b - r); s.quadraticCurveTo(a, b, a - r, b); s.lineTo(-a + r, b); s.quadraticCurveTo(-a, b, -a, b - r); s.lineTo(-a, -b + r); s.quadraticCurveTo(-a, -b, -a + r, -b); return s; };
  const mp = rep2(txPiso(), e / .9, t / .9), geo = new T3.ExtrudeGeometry(forma(e, t, .07), { depth: .003, bevelEnabled: true, bevelThickness: .0015, bevelSize: .0015, bevelSegments: 2, curveSegments: 10 });
  const pos = geo.attributes.position, uv = geo.attributes.uv; for (let k = 0; k < pos.count; k++) uv.setXY(k, pos.getX(k) / e + .5, pos.getY(k) / t + .5);
  const m = M2(geo, new T3.MeshStandardMaterial({ map: mp, color: 0xffffff, roughness: .92, metalness: 0, envMapIntensity: 1.2, bumpMap: rep2(txGrao(), e / .25, t / .25), bumpScale: .25 }));
  m.rotation.x = -Math.PI / 2; m.position.set(i, -.0025, o); m.receiveShadow = true; sc.add(m);
  const fx = new T3.ExtrudeGeometry(forma(e + .012, t + .012, .076), { depth: .003, bevelEnabled: false, curveSegments: 10 }), f = M2(fx, m2.lima()); f.rotation.x = -Math.PI / 2; f.position.set(i, -.0026, o); f.receiveShadow = true; sc.add(f);
  m.userData.tapete = f.userData.tapete = true; return m;
};

/* ---------- pegada: os dedos fecham até encostar na barra (em vez de um ângulo fixo), sem atravessar ---------- */
Object.assign(window.__GR, { rec: .018, gd0: .035, c1: 1.05, c2: 1.2, c3: 1.0, th: .7, R: .0148, tf: [.011, .010, .009], ...(window.__GR_USER || {}) });
/* onde a barra fica na mão: na pegada fechada, logo antes da base dos dedos (medida na própria mão); com a mão aberta, o ponto de apoio pedido pelo exercício, na proporção da mão nova */
window.__GR.alc = (rig, u) => { const G = window.__GR, HL = rig._HL || (rig._HL = rig.P('LeftHand').distanceTo(rig.P('LeftHandMiddle1'))); if (!V2.on || rig._velho) return u.gripReach ?? .075; return (u.curl ?? 1) >= .95 ? HL - G.rec + ((u.gripReach ?? .075) - .075) * .3 : (u.gripReach ?? .075) * HL / .095; };
window.__GR.prof = (rig, u) => { const G = window.__GR; if (!V2.on || rig._velho) return u.gripDepth ?? .022; return G.gd0 + ((u.gripDepth ?? .022) - .022) + ((u.gripR || G.R) - G.R); };
/* pés: ponta do pé nunca abaixo do piso (o tornozelo sobe o que faltar) e dedos com a inclinação natural do repouso */
const SOLA = -.0055;
window.__GR.tornozelo = (rig, u) => { const m = u.ankle.clone(); if (!V2.on || rig._velho) return m; const b = u.fwd.clone().normalize(), up = p(0, 1, 0), M = b.clone().cross(up).normalize(), d = p(0, rig.restToe.y - rig.restAnkle.y, rig.restToe.z - rig.restAnkle.z);
  const T = b.clone().multiplyScalar(d.z).add(p(0, d.y, 0)).applyAxisAngle(M, -(u.pitch || 0)), hT = rig.restToe.y - SOLA, y = m.y + T.y; if (y < hT) m.y += hT - y; return m; };
window.__GR.dedos = (rig, u, b, M) => { const tp = u.toePitch ?? Math.min(0, u.pitch || 0), dz = rig.restToeEnd.z - rig.restToe.z, dy = V2.on && !rig._velho ? rig.restToeEnd.y - rig.restToe.y : 0; return b.clone().multiplyScalar(dz).add(p(0, dy, 0)).applyAxisAngle(M, -tp); };
/* braços e pernas nunca atravessam o piso: o punho ou o tornozelo sobem até o nível do chão e o cotovelo ou o joelho giram para cima o quanto for preciso */
const _tb = W.prototype.twoBone;
W.prototype.twoBone = function (e, t, i, o, a) {
  if (!V2.on || this._velho) return _tb.call(this, e, t, i, o, a);
  const perna = Math.abs(i - this.Lth) < 1e-6, y0 = this.root.position.y, rFim = perna ? .03 : .032, rMeio = perna ? .05 : .042;
  if (t.y + y0 < rFim) t.y = rFim - y0;
  let x = _tb.call(this, e, t, i, o, a); if (x.y + y0 >= rMeio) return x;
  const eixo = t.clone().sub(e).normalize(); let melhor = x, by = x.y;
  for (const sg of [1, -1]) for (let k = 1; k <= 12; k++) { const c = _tb.call(this, e, t, i, o, a.clone().applyAxisAngle(eixo, sg * k * .13)); if (c.y + y0 >= rMeio) return c; if (c.y > by) { by = c.y; melhor = c; } }
  return melhor;
};
/* tronco e cabeça nunca abaixo do piso: se alguma parte afunda, a pelve sobe o que falta; se a dobra do tronco é que está exagerada (cabeça muito abaixo), corrige a inclinação.
   Respiração: o peito e os ombros sobem de leve quando o exercício pede para inspirar (window.__resp vai de 0, pulmão vazio, a 1). */
const PROXY = [['Head', .095], ['HeadTop_End', .015], ['Neck', .06], ['Spine2', .115], ['Spine', .105], ['Hips', .105], ['LeftArm', .055], ['RightArm', .055], ['LeftUpLeg', .085], ['RightUpLeg', .085]];
const _pose = W.prototype.pose;
W.prototype.pose = function (e) {
  if (!V2.on || this._fx || this._velho) return _pose.call(this, e);
  /* trabalha sobre uma cópia: o exercício pode reaproveitar o mesmo objeto de pelve em todos os quadros */
  if (e.pelvis) e = { ...e, pelvis: { ...e.pelvis, pos: e.pelvis.pos ? e.pelvis.pos.clone() : e.pelvis.pos } };
  if (e.feet && e.feet.Left && e.feet.Right) e.feet = { Left: { ...e.feet.Left, ankle: e.feet.Left.ankle.clone() }, Right: { ...e.feet.Right, ankle: e.feet.Right.ankle.clone() } };
  this._desl = null; this._delta = null;
  if (this._sonda && e.pelvis && e.pelvis.pos) e.pelvis.pos.add(this._sonda);
  const y0 = this.root.position.y, pen = () => { let m = 0; for (const [b, r] of PROXY) { if (!this.B[b]) continue; const d = r - (this.P(b).y + y0); if (d > m) m = d; } const rosto = this.P('Head').add(this.boneVec('Head', p(0, .07, .1))), dr = .035 - (rosto.y + y0); return Math.max(m, dr); };   /* inclui o rosto */
  const posa = () => { _pose.call(this, e); const b = window.__resp || 0; if (b) { const lat = this.boneVec('Spine2', p(1, 0, 0)), fr = this.boneVec('Spine2', p(0, 0, 1)); this.rotW(this.B.Spine2, Di(lat, -.014 * b)); this.rotW(this.B.LeftShoulder, Di(fr, .016 * b)); this.rotW(this.B.RightShoulder, Di(fr, -.016 * b)); this.root.updateMatrixWorld(true); } };
  this._fx = 1;
  try {
    /* o esqueleto anterior (invisível) recebe primeiro a mesma pose: é a referência de quanto cada braço estende neste quadro */
    const g = this._fant, fixo = this._ancFixo, alvo = {}; this._refOk = 0;
    if (g && !this._semCorr && (fixo || window.__refSempre)) { _pose.call(g, e); this._refOk = 1; }
    this._anc = fixo || null; posa(); if (this._semCorr) return;
    /* pernas: quando o tornozelo teve de subir (ponta do pé apoiada no chão), a pelve acompanha, para o joelho não dobrar além do que o exercício pediu */
    if (e.pelvis && e.pelvis.pos && e.feet && this.legs) { const L = [], Lp = (this.Lth + this.Lsh) * .9995; for (const h of ['Left', 'Right']) { const lg = this.legs[h], u = e.feet[h]; if (!lg || !u || lg.ank.distanceTo(u.ankle) < .002) continue; const dir = lg.hp.clone().sub(lg.ank), d1 = dir.length(); const d0 = Math.min(Lp, lg.hp.distanceTo(u.ankle)), er = (d0 - Math.min(Lp, d1)) * Tn.smoothstep(d0 / Lp, .8, .95); if (Math.abs(er) > .001) L.push([dir.normalize(), er]); }   /* perna bem dobrada não precisa: o ângulo quase não muda */
      if (L.length) { const c = p(0, 0, 0); for (let k = 0; k < 4; k++) for (const [dir, er] of L) c.addScaledVector(dir, er - dir.dot(c)); if (c.length() > .1) c.setLength(.1); if (c.length() > .002) { e.pelvis.pos.add(c); posa(); } } }
    /* tronco e cabeça acima do piso: primeiro acerta a inclinação, se o tronco afundaria muito; depois a pelve sobe o que faltar */
    const piso = () => { let d = pen(); if (window.__semPiso || d < .012 || !e.pelvis || !e.pelvis.pos) return;
      const pit0 = e.pelvis.pitch || 0;
      if (d > .08) { const T = Math.max(.03, .08 - 1.5 * (d - .08)); let melhor = null;   /* quanto mais fundo, mais a inclinação resolve; a passagem é contínua (sem degrau de um quadro para o outro) */
        for (const sg of [-1, 1]) { let lo = 0, hi = -1; for (let k = 1; k <= 24; k++) { e.pelvis.pitch = pit0 + sg * k * .05; posa(); if (pen() < T) { hi = k * .05; lo = hi - .05; break; } }
          if (hi > 0) { for (let n = 0; n < 6; n++) { const m = (lo + hi) / 2; e.pelvis.pitch = pit0 + sg * m; posa(); if (pen() < T) hi = m; else lo = m; } if (!melhor || hi < melhor[1]) melhor = [sg, hi]; } }
        e.pelvis.pitch = melhor ? pit0 + melhor[0] * melhor[1] : pit0; posa(); d = pen(); }
      for (let k = 0; k < 3 && d > .004; k++) { e.pelvis.pos.y += d; posa(); d = pen(); } };
    piso();
    /* alcance: o braço novo deve repetir o da referência (mesma direção, mesma proporção de extensão).
       Mãos que partem do próprio corpo (halter, barra livre, cabo) já saem assim do punho. Aqui entram as mãos que vão a um ponto fixo (barra presa, apoio, chão)
       e as que o piso segurou: o corpo é que se ajusta. Mão no chão desliza no chão; corpo apoiado nos pés ou nos joelhos gira em torno do apoio (a linha do corpo não quebra);
       corpo pendurado se desloca inteiro, com as pernas; no resto, a pelve se afasta na direção do braço. */
    if (this._refOk && fixo && e.pelvis && e.pelvis.pos && this.arms && g.arms && g.legs && g.legs.Left && g.legs.Right) {
      const Ln = this.Lua + this.Lfa, Lo = g.Lua + g.Lfa, ss = Tn.smoothstep, GL = g.legs, meio = (a, b) => a.clone().add(b).multiplyScalar(.5);
      const plant = 1 - ss(Math.min(GL.Left.ank.y, GL.Right.ank.y) + y0, .14, .24), ajo = 1 - ss(Math.min(GL.Left.kn.y, GL.Right.kn.y) + y0, .10, .18);
      /* apoio de baixo, perna a perna (pela referência): perna estendida com o pé no chão (prancha: o corpo gira sobre esse pé) ou ajoelhada (joelho e pé no chão: o tronco gira no quadril).
         Os pesos são contínuos, para a troca de apoio (escalador, bird-dog) não dar tranco */
      const Lgo = g.Lth + g.Lsh, ap = {}; let sA = 0, sK = 0; for (const h of ['Left', 'Right']) { const L = GL[h], est = ss(L.hp.distanceTo(L.ank) / Lgo, .86, .95), pe = 1 - ss(L.ank.y + y0, .14, .24), jo = 1 - ss(L.kn.y + y0, .10, .18); ap[h] = { a: pe * est, k: jo * pe * (1 - est) }; sA = Math.max(sA, ap[h].a); sK = Math.max(sK, ap[h].k); } sK *= 1 - sA; const reta = sA;
      let acima = 0, na = 0; for (const h of ['Left', 'Right']) if (g.arms[h]) { acima += ss(g.arms[h].wrist.y - g.arms[h].sh.y, 0, .15); na++; } if (na) acima /= na;
      const livre = (1 - plant) * (1 - ajo) * Math.max(this._ativo ? 1 : 0, acima), lat = p(1, 0, 0).applyQuaternion(Di(p(0, 1, 0), e.pelvis.yaw || 0));
      let somaD = 0, somaT = 0;
      for (let vez = 0; vez < 3; vez++) { const E = p(0, 0, 0), S = p(0, 0, 0); let n = 0, chao = 0, desl = false;
        for (const h of ['Left', 'Right']) { const A = this.arms[h], G = g.arms[h]; if (!A || !G) continue; const ro = Math.min(.9995, G.wrist.distanceTo(G.sh) / Lo), w = this._ativo ? 1 : ss(ro, .84, .95); if (w <= 0) continue;
          const v = A.sh.clone().sub(A.wrist), dd = v.length(); v.normalize();
          if (fixo[h]) { const falta = ro * Ln - dd; if (falta < .004 || A.wrist.y + y0 > .04) continue; E.addScaledVector(v, falta * w); S.add(A.sh); n++; continue; }
          const fl = 1 - ss((this.lastSpec.hands[h]._g0 || A.grip).y + y0, .06, .14), R = ro * Ln, aref = G.sh.clone().sub(G.wrist).normalize(), cheio = A.wrist.clone().addScaledVector(aref, R).sub(A.sh);
          /* os ombros novos têm outra largura: o que sobra para os lados o corpo não resolve (uma mão pede um lado, a outra o oposto).
             Mão no chão desliza cada uma para o seu lugar; mão em barra fica, e o corpo se afasta no plano do movimento até o braço estender o que deve */
          const sag = cheio.clone().addScaledVector(lat, -lat.dot(cheio)), q = v.clone().addScaledVector(lat, -lat.dot(v)); if (q.lengthSq() > 1e-6) { q.normalize(); const r0 = A.sh.clone().add(sag).sub(A.wrist), bq = r0.dot(q); sag.addScaledVector(q, -bq + Math.sqrt(Math.max(0, bq * bq - r0.lengthSq() + R * R))); }
          /* mão no chão com o braço estendido para a frente (e não a prumo): quem acerta o alcance é a mão, deslizando; o corpo não precisa descer */
          const hf = Math.hypot(aref.x, aref.z), kp = ss(hf, .4, .8) * fl, alt = A.sh.y - A.wrist.y, mult = hf > 1e-4 ? Tn.lerp(R, Math.sqrt(Math.max(0, R * R - alt * alt)) / hf, kp) : R, cb = cheio.clone(); cb.y *= 1 - kp;
          E.add(v.clone().multiplyScalar(R - dd).lerp(sag.lerp(cb, fl), Math.max(fl, livre)).multiplyScalar(w)); S.add(A.sh); n++; chao += fl;
          const dz = p(A.wrist.x + aref.x * mult - A.sh.x, 0, A.wrist.z + aref.z * mult - A.sh.z).multiplyScalar(fl * (1 - livre) * w); if (dz.lengthSq() > 1e-8) { if (dz.length() > .12) dz.setLength(.12); this._desl = this._desl || { Left: p(0, 0, 0), Right: p(0, 0, 0) }; this._desl[h].sub(dz); if (dz.length() > .003) desl = true; } }
        if (!n) break; E.multiplyScalar(1 / n); S.multiplyScalar(1 / n); chao /= n;
        if (window.__dbg) window.__dbg.push({ vez, E: E.toArray().map(x => +x.toFixed(3)), chao, livre, plant, ajo, reta, somaD, pos: e.pelvis.pos.toArray().map(x => +x.toFixed(3)) });
        const d = E.clone().sub(p(E.x, 0, E.z).multiplyScalar(chao * (1 - livre))); if (d.length() < .003 && !desl) break;
        /* giro em torno do apoio de baixo */
        const dn = d.clone().normalize();
        if (sA > .02) { const wl = ap.Left.a + 1e-4, wr = ap.Right.a + 1e-4, piv = this.legs.Left.ank.clone().multiplyScalar(wl).addScaledVector(this.legs.Right.ank, wr).multiplyScalar(1 / (wl + wr)), tg = lat.clone().cross(S.clone().sub(piv));
          if (tg.lengthSq() > .01) { let fr = sA * Math.pow(dn.dot(tg.clone().normalize()), 2); fr = fr * fr * (3 - 2 * fr); const th = Tn.clamp(fr * d.dot(tg) / tg.lengthSq(), -.3 - somaT, .3 - somaT); somaT += th; e.pelvis.pos.sub(piv).applyAxisAngle(lat, th).add(piv); e.pelvis.pitch = (e.pelvis.pitch || 0) + th; d.addScaledVector(tg, -th); } }
        if (sK > .02) { const piv = e.pelvis.pos.clone(), tg = lat.clone().cross(S.clone().sub(piv));
          if (tg.lengthSq() > .01 && d.lengthSq() > 1e-8) { let fr = sK * Math.pow(d.clone().normalize().dot(tg.clone().normalize()), 2); fr = fr * fr * (3 - 2 * fr); const th = Tn.clamp(fr * d.dot(tg) / tg.lengthSq(), -.3 - somaT, .3 - somaT); somaT += th; e.pelvis.pitch = (e.pelvis.pitch || 0) + th; d.addScaledVector(tg, -th); } }
        const cabe = Math.max(0, .1 + .12 * livre - somaD); if (d.length() > cabe) d.setLength(cabe); somaD += d.length(); e.pelvis.pos.add(d); if (livre > 0 && e.feet) for (const h of ['Left', 'Right']) e.feet[h].ankle.addScaledVector(d, livre);
        posa(); }
    }
    piso();
  } finally { this._fx = 0; }
};
/* punho: quando a mão vem do próprio braço (halter, cabo: o aparelho acompanha a mão), o punho fica onde o exercício pediu e o ponto de pegada é recalculado para a mão nova;
   quando a mão vai até um ponto fixo (barra presa, chão), o punho é que se ajusta à mão nova */
window.__GR.punho = (rig, u, f, m, lado) => { const G = window.__GR; if (!V2.on || rig._velho) return (u._g0 || u.grip).clone().sub(f.clone().multiplyScalar(u.gripReach ?? .075)).sub(m.clone().multiplyScalar(u.gripDepth ?? .022));
  const R = G.alc(rig, u), D = G.prof(rig, u);
  /* o aparelho não acompanha a mão (barra guiada pelo próprio exercício, puxador de máquina): a mão vai exatamente até ele */
  /* a mão segue um aparelho que o exercício conduz (barra do supino, puxador): o braço repete a extensão de referência e o aparelho é levado junto, pela mesma diferença */
  if (rig._modo && rig._modo[lado] === 'leva' && rig._anc && rig._anc[lado]) { u._g0 = u._g0 || u.grip.clone(); const w = u._g0.clone().sub(f.clone().multiplyScalar(R)).sub(m.clone().multiplyScalar(D)), w0 = w.clone(), g = rig._fant, A = rig._refOk && g && g.arms && g.arms[lado];
    if (A) { const sh = rig.P(lado + 'Arm'), v = w.clone().sub(sh), d = v.length(), ro = Math.min(.9995, A.wrist.distanceTo(A.sh) / (g.Lua + g.Lfa)), peso = rig._ativo ? 1 : Tn.smoothstep(ro, .84, .95); if (d > 1e-4) w.copy(sh).addScaledVector(v, (d + (ro * (rig.Lua + rig.Lfa) - d) * peso) / d); }
    G.piso(rig, u, f, w); const dl = w.clone().sub(w0); u.grip = u._g0.clone().add(dl); (rig._delta = rig._delta || {})[lado] = { g: u._g0.clone(), d: dl }; return w; }
  if (rig._modo && rig._modo[lado] === 'exato' && rig._anc && rig._anc[lado]) return G.piso(rig, u, f, u.grip.clone().sub(f.clone().multiplyScalar(R)).sub(m.clone().multiplyScalar(D)));
  if (u.anc || (rig._anc && rig._anc[lado])) { u._g0 = u._g0 || u.grip.clone(); const w = u._g0.clone().sub(f.clone().multiplyScalar(u.gripReach ?? .075)).sub(m.clone().multiplyScalar(u.gripDepth ?? .022));
    /* mesma direção a partir do ombro novo, mesma proporção de extensão do braço de referência: o cotovelo abre e fecha igual, qualquer que seja o comprimento do braço */
    const g = rig._fant, A = rig._refOk && g && g.arms && g.arms[lado];
    if (A) { const sh = rig.P(lado + 'Arm'), v = w.clone().sub(sh), d = v.length(), ro = Math.min(.9995, A.wrist.distanceTo(A.sh) / (g.Lua + g.Lfa)), peso = rig._ativo ? 1 : Tn.smoothstep(ro, .84, .95); if (d > 1e-4) w.copy(sh).addScaledVector(v, (d + (ro * (rig.Lua + rig.Lfa) - d) * peso) / d); }
    if (rig._desvio) w.add(rig._desvio); G.piso(rig, u, f, w); u.grip = w.clone().add(f.clone().multiplyScalar(R)).add(m.clone().multiplyScalar(D)); return w; }
  /* mão apoiada no chão: pode deslizar no chão para o braço ficar na direção certa */
  if (rig._desl) { u._g0 = u._g0 || u.grip.clone(); const fl = 1 - Tn.smoothstep(u._g0.y + rig.root.position.y, .06, .14); u.grip = u._g0.clone().addScaledVector(rig._desl[lado], fl); }
  return G.piso(rig, u, f, u.grip.clone().sub(f.clone().multiplyScalar(R)).sub(m.clone().multiplyScalar(D))); };
/* mão apontando para baixo: o punho sobe o que for preciso para a ponta dos dedos não entrar no piso */
window.__semPiso = new URLSearchParams(location.search).get('sempiso') === '1';
window.__GR.piso = (rig, u, f, w) => { const lo = .014 - rig.root.position.y - Math.min(0, f.y) * ((u.curl ?? 1) > .6 ? .1 : .185); if (w.y < lo) w.y = lo; return w; };
const _curl = W.prototype.curl;
W.prototype.curl = function (lado, t, inf) {
  if (!V2.on || this._velho || !inf || t < .95) return _curl.call(this, lado, t);
  const G = window.__GR, sg = lado === 'Left' ? 1 : -1, g = inf.g, ax = inf.f.clone().cross(inf.m).normalize(), R = inf.r || G.R;
  /* distância, no plano perpendicular à barra, do eixo da barra ao segmento a-b */
  const dseg = (a, b) => { const pa = a.clone().sub(g), pb = b.clone().sub(g); pa.addScaledVector(ax, -pa.dot(ax)); pb.addScaledVector(ax, -pb.dot(ax)); const ab = pb.clone().sub(pa), l2 = ab.lengthSq(), u = l2 > 1e-10 ? Math.min(1, Math.max(0, -pa.dot(ab) / l2)) : 0; return pa.addScaledVector(ab, u).length(); };
  for (const d of ['Index', 'Middle', 'Ring', 'Pinky']) for (let k = 1; k <= 3; k++) {
    const nome = lado + 'Hand' + d + k, osso = this.B[nome], filho = this.B[lado + 'Hand' + d + (k + 1)]; if (!osso || !filho) continue;
    const eixo = this.boneVec(nome, p(0, 0, 1)), J = this.P(nome), C0 = this.P(lado + 'Hand' + d + (k + 1)).sub(J), alvo = R + G.tf[k - 1], max = (k === 1 ? 1.45 : k === 2 ? 1.7 : 1.35);
    const dist = th => dseg(J, J.clone().add(C0.clone().applyAxisAngle(eixo, -sg * th)));
    let th = 0;
    if (dist(0) > alvo) { let a = 0, b = -1; for (let x = .06; x <= max + 1e-6; x += .06) { if (dist(x) <= alvo) { b = x; break; } a = x; } if (b < 0) th = Math.min(max, [G.c1, G.c2, G.c3][k - 1]); else { for (let n = 0; n < 12; n++) { const m = (a + b) / 2; if (dist(m) > alvo) a = m; else b = m; } th = a; } }
    this.rotW(osso, Di(eixo, -sg * th));
  }
  for (let k = 1; k <= 2; k++) { const nome = lado + 'HandThumb' + k; this.B[nome] && this.rotW(this.B[nome], Di(this.boneVec(nome, p(1, 0, 0)), G.th * t)); }
};

/* ---------- contato do corpo com os estofados: cada almofada (assento, encosto, banco, apoio) é ajustada até encostar no corpo, sem atravessar ---------- */
function contato2(c, n, tl, sc) {
  if (!V2.on) return null;
  /* braços que trabalham (o cotovelo abre e fecha ao longo do exercício): o alcance é mantido igual ao de referência no movimento inteiro, e não só perto da extensão */
  for (const r of c.rigs) { r._ativo = false; r._ancFixo = null; }
  { const lim = c.rigs.map(() => [999, -999]), segue = c.rigs.map(() => ({ Left: 0, Right: 0 })), NP = 12, gp = r => { const o = {}; for (const h of ['Left', 'Right']) { const u = r.lastSpec && r.lastSpec.hands && r.lastSpec.hands[h]; if (u) o[h] = (u._g0 || u.grip).clone(); } return o; };
    for (let k = 0; k < NP; k++) { const M = tl.dur * (k + .5) / NP; for (const r of c.rigs) { r._semCorr = 1; r._sonda = null; } n.pose(c, tl.at(M), M); const G0 = c.rigs.map(gp);
      c.rigs.forEach((r, ri) => { const g = r._fant; if (!g || !r.lastSpec) return; _pose.call(g, r.lastSpec); if (!g.arms) return; for (const h of ['Left', 'Right']) { const A = g.arms[h]; if (!A) continue; const a = A.el.clone().sub(A.sh).angleTo(A.wrist.clone().sub(A.el)) * 180 / Math.PI; lim[ri][0] = Math.min(lim[ri][0], a); lim[ri][1] = Math.max(lim[ri][1], a); } });
      for (const r of c.rigs) r._sonda = p(0, .03, .02); n.pose(c, tl.at(M), M); c.rigs.forEach((r, ri) => { const G1 = gp(r); for (const h of ['Left', 'Right']) if (G0[ri][h] && G1[h] && G0[ri][h].distanceTo(G1[h]) > .012) segue[ri][h]++; }); }
    c.rigs.forEach((r, ri) => { r._semCorr = 0; r._sonda = null; r._ativo = lim[ri][1] - lim[ri][0] > 35; r._ancFixo = { Left: segue[ri].Left >= NP / 2, Right: segue[ri].Right >= NP / 2 }; }); }
  /* cada mão que parte do próprio corpo: o aparelho acompanha a mão resolvida (halter: sim) ou fica onde o exercício mandou (barra do supino, puxador: não)?
     Teste direto: desloca a mão 3 cm e vê se alguma peça junto dela foi junto. Se não foi e há peça na pegada, a mão é que vai até a peça. */
  for (const r of c.rigs) r._modo = null;
  { const np0 = n._pose0 || (n._pose0 = n.pose); n.pose = np0; }
  if (c.rigs.some(r => r._ancFixo && (r._ancFixo.Left || r._ancFixo.Right))) { const dorig = new Set(); for (const r of c.rigs) { r.root.traverse(o => dorig.add(o)); r._fant && r._fant.root.traverse(o => dorig.add(o)); }
    const ms = [], nos = []; sc.traverse(o => { if (dorig.has(o) || o === sc) return; for (let q = o; q; q = q.parent) if (!q.visible) return; nos.push(o); if (!o.isMesh || !o.geometry) return; o.geometry.boundingBox || o.geometry.computeBoundingBox(); const s = o.geometry.boundingBox.getSize(new T3.Vector3()), ws = o.getWorldScale(new T3.Vector3()), d = [s.x * ws.x, s.y * ws.y, s.z * ws.z].sort((a, b) => a - b); if ((d[0] < .12 && d[1] > .6) || d[2] > 6) return; ms.push(o); });
    const l = new T3.Vector3(), q = new T3.Vector3(), dO = (o, P) => { l.copy(P); o.worldToLocal(l); q.copy(l).clamp(o.geometry.boundingBox.min, o.geometry.boundingBox.max); o.localToWorld(q); return q.distanceTo(P); };
    const pos = () => ms.map(o => o.getWorldPosition(new T3.Vector3())), NQ = 6, ac = c.rigs.map(() => ({ Left: 0, Right: 0 })), pe = c.rigs.map(() => ({ Left: 0, Right: 0 })), LD = ['Left', 'Right'], am = [];
    if (ms.length) { for (let k = 0; k < NQ; k++) { const M = tl.dur * (k + .5) / NQ; for (const r of c.rigs) r._desvio = null; n.pose(c, tl.at(M), M); sc.updateMatrixWorld(true); const P0 = pos();
        const G0 = c.rigs.map(r => LD.map(h => r.arms && r.arms[h] ? r.toWorld(r.arms[h].grip.clone()) : null)), R0 = c.rigs.map(r => LD.map(h => { const u = r.lastSpec && r.lastSpec.hands && r.lastSpec.hands[h]; return u ? r.toWorld((u._g0 || u.grip).clone()) : null; }));
        am.push({ lp: nos.map(o => o.position.clone()), wp: nos.map(o => o.getWorldPosition(new T3.Vector3())), sy: nos.map(o => o.scale.y), g: R0 });
        c.rigs.forEach((r, ri) => LD.forEach((h, hi) => { if (R0[ri][hi] && ms.some(o => dO(o, R0[ri][hi]) < .03)) pe[ri][h]++; }));
        for (const r of c.rigs) r._desvio = p(0, .03, 0); n.pose(c, tl.at(M), M); sc.updateMatrixWorld(true); const P1 = pos();
        c.rigs.forEach((r, ri) => LD.forEach((h, hi) => { const g = G0[ri][hi]; if (!g) return; g.y += .03; if (ms.some((o, i) => Math.abs(P1[i].y - P0[i].y - .03) < .006 && Math.hypot(P1[i].x - P0[i].x, P1[i].z - P0[i].z) < .006 && dO(o, g) < .06)) ac[ri][h]++; })); }
      for (const r of c.rigs) r._desvio = null;
      /* peças que o exercício conduz e que andam junto com a pegada (distância constante): barra, puxador. E os cabos, para religar a ponta. */
      const mexe = nos.map((o, i) => am.some(a => a.lp[i].distanceTo(am[0].lp[i]) > .005)), topo = nos.map((o, i) => { if (!mexe[i]) return false; for (let x = o.parent; x && x !== sc; x = x.parent) { const j = nos.indexOf(x); if (j >= 0 && mexe[j]) return false; } return true; });
      { const M = tl.dur * .5; n.pose(c, tl.at(M), M); sc.updateMatrixWorld(true); }
      const levados = [], gAgora = c.rigs.map(r => LD.map(h => { const u = r.lastSpec && r.lastSpec.hands && r.lastSpec.hands[h]; return u ? r.toWorld((u._g0 || u.grip).clone()) : null; }));
      nos.forEach((o, i) => { if (!topo[i]) return; const meus = ms.filter(x => { for (let y = x; y; y = y.parent) if (y === o) return true; return false; }); if (!meus.length) return; let melhor = null;
        c.rigs.forEach((r, ri) => { if (!r._ancFixo) return; for (const hs of [[0, 1], [0], [1]]) { if (hs.some(hi => !r._ancFixo[LD[hi]] || ac[ri][LD[hi]] >= NQ / 2 || am.some(a => !a.g[ri][hi]))) continue;
            const off = am.map(a => { const g = new T3.Vector3(); hs.forEach(hi => g.add(a.g[ri][hi])); return a.wp[i].clone().sub(g.multiplyScalar(1 / hs.length)); }), dev = Math.max(...off.map(v => v.distanceTo(off[0])));
            if (window.__dbgLev) window.__dbgLev.push({ no: o.type + ':' + (o.geometry ? o.geometry.type : o.children.length + ' filhos'), hs: hs.join(''), dev: +dev.toFixed(4), perto: hs.map(hi => gAgora[ri][hi] ? +Math.min(...meus.map(x => dO(x, gAgora[ri][hi]))).toFixed(3) : null) });
            if (dev < .015 && hs.every(hi => gAgora[ri][hi] && meus.some(x => dO(x, gAgora[ri][hi]) < .06)) && (!melhor || dev < melhor.dev - 1e-4)) melhor = { o, ri, hs: hs.map(hi => LD[hi]), dev, meus }; } });
        melhor && levados.push(melhor); });
      const cabos = nos.filter((o, i) => o.isMesh && o.geometry && o.geometry.type === 'CylinderGeometry' && o.geometry.parameters.height === 1 && o.geometry.parameters.radiusTop <= .012 && Math.max(...am.map(a => a.sy[i])) - Math.min(...am.map(a => a.sy[i])) > .01);
      c.rigs.forEach((r, ri) => { r._modo = {}; for (const h of LD) r._modo[h] = ac[ri][h] >= NQ / 2 ? 'razao' : levados.some(L => L.ri === ri && L.hs.includes(h)) ? 'leva' : pe[ri][h] >= NQ / 2 ? 'exato' : 'razao'; r._levados = levados.filter(L => L.ri === ri).length; });
      if (levados.length) { const np0 = n._pose0, Y = p(0, 1, 0);
        n.pose = function (a, b, d) { for (const L of levados) if (L.o.userData._p2) { L.o.position.copy(L.o.userData._p2); L.o.userData._p2 = null; }
          const ret = np0.call(this, a, b, d); if (a !== c) return ret;
          const feitos = []; for (const L of levados) { const r = c.rigs[L.ri], dW = new T3.Vector3(); let k = 0; for (const h of L.hs) { const e = r._delta && r._delta[h]; if (!e) continue; dW.add(r.toWorld(e.g.clone().add(e.d)).sub(r.toWorld(e.g))); k++; } if (!k) continue; dW.multiplyScalar(1 / k); if (dW.lengthSq() < 1e-10) continue;
            L.o.parent.updateWorldMatrix(true, false); const wp = L.o.getWorldPosition(new T3.Vector3()).add(dW); L.o.userData._p2 = L.o.position.clone(); L.o.position.copy(L.o.parent.worldToLocal(wp)); L.o.updateMatrixWorld(true); feitos.push([L, dW]); }
          if (feitos.length) for (const cb of cabos) { if (cb.parent !== sc && cb.parent.matrixWorld.elements.some((x, i) => Math.abs(x - (i % 5 ? 0 : 1)) > 1e-6)) continue; cb.updateWorldMatrix(true, false); const E = [cb.localToWorld(p(0, -.5, 0)), cb.localToWorld(p(0, .5, 0))]; let mud = false;
            for (const e of E) for (const [L, dW] of feitos) { const t = e.clone().add(dW); if (L.meus.some(x => dO(x, t) < .035)) { e.add(dW); mud = true; break; } }
            if (mud) { const h = E[1].clone().sub(E[0]), len = h.length(); cb.position.copy(cb.parent.worldToLocal(E[0].clone().addScaledVector(h, .5))); cb.scale.y = len; cb.quaternion.setFromUnitVectors(Y, h.normalize()); cb.updateMatrixWorld(true); } }
          return ret; }; } } }
  if (n.noSeparate) return null;
  const rigs = new Set(); for (const r of c.rigs) r.root.traverse(o => rigs.add(o));
  const malhas = []; for (const r of c.rigs) r.root.traverse(o => { if (o.isSkinnedMesh && o.visible) malhas.push(o); });
  const pads = []; sc.traverse(o => { if (!o.isMesh || rigs.has(o) || !o.visible || !o.geometry || !o.material || !o.material.color) return; const t = o.geometry.type, q = o.geometry.parameters; if ((t === 'BoxGeometry' || t === 'RoundedBoxGeometry') && (o.material.bumpMap && o.material.userData.realSpec && o.material.userData.realSpec.leather || [1908515, 1780280].includes(o.material.color.getHex()))) { const h = [q.width / 2, q.height / 2, q.depth / 2], e = h.indexOf(Math.min(...h)); if (Math.min(...h) < .08 && h.filter(x => x > .07).length >= 2) pads.push({ o, h, e, pen: [0, 0], np: [0, 0], gap: [9, 9], ng: [0, 0] }); } });
  const res = { pads: [], minY: 9 }; if (!malhas.length) return res;
  const amostra = malhas.map(m => { const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight, bs = m.skeleton.bones, L = []; for (let i = 0; i < si.count; i += 4) { let w = 0; for (let k = 0; k < 4; k++) if (/Hand/.test(bs[si.getComponent(i, k)].name)) w += sw.getComponent(i, k); if (w < .3) L.push(i); } return L; });
  const v = new T3.Vector3(), l = new T3.Vector3(), NS = 12;
  for (let k = 0; k < NS; k++) { const M = tl.dur * (k + .5) / NS; n.pose(c, tl.at(M), M); sc.updateMatrixWorld(true); const inv = pads.map(pd => pd.o.matrixWorld.clone().invert()), esc = pads.map(pd => pd.o.getWorldScale(new T3.Vector3()));
    malhas.forEach((m, mi) => { for (const i of amostra[mi]) { m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld); if (v.y < res.minY) { res.minY = v.y; res.onde = m.skeleton.bones[m.geometry.attributes.skinIndex.getComponent(i, 0)].name.replace('mixamorig', '') + '@' + k; }
      for (let j = 0; j < pads.length; j++) { const pd = pads[j], e = pd.e, a1 = (e + 1) % 3, a2 = (e + 2) % 3; l.copy(v).applyMatrix4(inv[j]); const x = l.getComponent(e), u1 = Math.abs(l.getComponent(a1)), u2 = Math.abs(l.getComponent(a2)); if (u1 > pd.h[a1] - .012 || u2 > pd.h[a2] - .012) continue;
        const lado = x >= 0 ? 0 : 1, d = (Math.abs(x) - pd.h[e]) * esc[j].getComponent(e); if (d < 0) { if (-d > pd.pen[lado]) pd.pen[lado] = -d; pd.np[lado]++; } else if (d < .06) { if (d < pd.gap[lado]) pd.gap[lado] = d; pd.ng[lado]++; } } } }); }
  for (const pd of pads) { let mov = 0; const lado = pd.np[0] + pd.ng[0] >= pd.np[1] + pd.ng[1] ? 0 : 1, sg = lado ? -1 : 1;     /* lado em que o corpo está */
    if (pd.np[lado] >= 3 && pd.pen[lado] > .005) mov = -sg * Math.min(.06, pd.pen[lado] - .003); else if (!pd.np[lado] && pd.ng[lado] >= 10 && pd.gap[lado] > .004 && pd.gap[lado] < .05) mov = sg * (pd.gap[lado] + .003);
    if (mov) { const eixo = new T3.Vector3().setComponent(pd.e, 1).applyQuaternion(pd.o.quaternion), ep = pd.o.parent ? pd.o.parent.getWorldScale(new T3.Vector3()).x : 1; pd.o.position.addScaledVector(eixo, mov / ep); pd.o.updateMatrixWorld(true); res.pads.push({ m: +(mov * 1000).toFixed(1), pen: +(pd.pen[lado] * 1000).toFixed(1), gap: +(pd.gap[lado] * 1000).toFixed(1) }); } }
  res.minY = +res.minY.toFixed(4); res.n = pads.length; return res;
}
window.__contato2 = contato2;
/* esqueleto do corpo anterior, só para servir de referência de alcance (nunca aparece) */
let _gltfVelho = null;
window.__fantasma = async (c, sc) => { if (!V2.on || new URLSearchParams(location.search).get('corpo') === '0' || new URLSearchParams(location.search).get('ref') === '0') return;
  _gltfVelho = _gltfVelho || await new $u().setMeshoptDecoder(Rx).loadAsync('models/Atleta.glb');
  for (const r of c.rigs) { const antes = new Set(sc.children), g = new W(sc, _gltfVelho, {}); g._velho = 1; g.root.position.copy(r.root.position); g.root.rotation.copy(r.root.rotation); g.root.updateMatrixWorld(true); g.root.visible = false; for (const o of sc.children) if (!antes.has(o)) o.visible = false; r._fant = g; } };
/* volume de ar ao longo do exercício: enche na fase em que o movimento volta (s caindo) e esvazia no esforço (s subindo); suavizado para não dar tranco */
window.__respDe = (tl, M) => { const f = t => { const e = tl.at(Math.max(0, Math.min(tl.dur, t))); return 1 - Math.max(0, Math.min(1, e.s)); }; let a = 0, n = 0; for (let k = -4; k <= 4; k++) { a += f(M + k * .08); n++; } return a / n; };

/* ---------- acabamento depois que a cena do exercício está montada ---------- */
function apura2(sc, c, gl) {
  if (!V2.on) return null;
  const rigs = new Set(); for (const r of c.rigs) r.root.traverse(o => rigs.add(o));
  const ehCaixa = o => o.isMesh && o.geometry && (o.geometry.type === 'BoxGeometry' || o.geometry.type === 'RoundedBoxGeometry');
  const cor = o => o.material && o.material.color ? o.material.color.getHex() : -1, LARANJA = [15751692, 16734720], TINTA = [1513756, 793126];
  /* 1) pilhas de peso: o bloco com listras vira placas separadas, com guias cromadas e pino seletor */
  const pais = new Set(); sc.traverse(o => { if (ehCaixa(o) && !rigs.has(o) && o.geometry.parameters.height <= .008 && LARANJA.includes(cor(o)) && o.parent) pais.add(o.parent); });
  for (const pai of pais) {
    const lis = pai.children.filter(o => ehCaixa(o) && o.geometry.parameters.height <= .008 && LARANJA.includes(cor(o)) && Math.abs(o.rotation.x) + Math.abs(o.rotation.z) < 1e-3); if (lis.length < 3) continue;
    const grupos = {}; lis.forEach(o => { const k = o.position.x.toFixed(2) + '|' + o.position.z.toFixed(2); (grupos[k] = grupos[k] || []).push(o); });
    for (const L of Object.values(grupos)) { if (L.length < 3) continue; const x = L[0].position.x, z = L[0].position.z, w = L[0].geometry.parameters.width, d = L[0].geometry.parameters.depth;
      const bloco = pai.children.find(o => ehCaixa(o) && TINTA.includes(cor(o)) && Math.abs(o.position.x - x) < .02 && Math.abs(o.position.z - z) < .02 && o.geometry.parameters.height > .3); if (!bloco) continue;
      const H = bloco.geometry.parameters.height, y0 = bloco.position.y - H / 2, n = Math.max(6, Math.round(H / .047)), hp = H / n, G = new T3.Group(); G.position.set(x, y0, z); G.rotation.copy(bloco.rotation);
      const pl = new T3.MeshStandardMaterial({ color: 0x23262b, metalness: .7, roughness: .42, envMapIntensity: 4 }), cr = m2.cromo(.16), li = m2.lima(), gp = new i0(w - .006, hp - .006, d - .006, 2, .005);
      for (let k = 0; k < n; k++) { const p1 = M2(gp, pl); p1.position.y = hp * (k + .5); G.add(p1); }
      for (const s of [1, -1]) { const gu = M2(new T3.CylinderGeometry(.008, .008, H + .2, 16), cr); gu.position.set(s * w * .3, (H + .2) / 2, 0); G.add(gu); }
      const trv = M2(new i0(w * .78, .022, .03, 2, .005), m2.pintura()); trv.position.y = H + .2; G.add(trv);
      const topo = M2(new i0(w - .004, .03, d - .004, 2, .006), m2.pintura()); topo.position.y = H + .02; G.add(topo);
      const kSel = Math.round(n * .55), pino = M2(cilCh(.007, .06, .002, 16), cr); pino.rotation.x = Math.PI / 2; pino.position.set(0, hp * (kSel + .5), d / 2 + .02); G.add(pino);
      const bot = M2(new T3.SphereGeometry(.014, 16, 12), li); bot.position.set(0, hp * (kSel + .5), d / 2 + .052); G.add(bot);
      const et = M2(new T3.PlaneGeometry(w * .78, .028), m2.decal(txMarca())); et.position.set(0, H + .02, d / 2 - .001); G.add(et);
      G.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); pai.add(G); bloco.visible = false; L.forEach(o => { o.visible = false; }); }
  }
  /* 2) detalhes em laranja dos aparelhos passam para o verde da marca: laranja fica só para o músculo trabalhando */
  const vistos = new Set(); sc.traverse(o => { if (!o.isMesh || rigs.has(o) || !o.material || !o.material.color || vistos.has(o.material)) return; vistos.add(o.material); if (LARANJA.includes(cor(o)) && !(o.renderOrder >= 20)) { o.material.color.setHex(LIMA); o.material.roughness = .45; o.material.metalness = .05; } });
  /* 2b) estrutura dos aparelhos em aço pintado escuro; colunas altas ganham os furos de regulagem */
  const CLARO = [12765390, 11121854], ESC = [3027512, 5925752]; vistos.clear();
  sc.traverse(o => { if (!o.isMesh || rigs.has(o) || !o.material || !o.material.color) return; const m = o.material;
    if (CLARO.includes(cor(o)) && !vistos.has(m)) { vistos.add(m); m.color.setHex(0x3b4149); m.metalness = .65; m.roughness = .36; m.envMapIntensity = 5; m.userData.estrutura = 1; }
    else if (ESC.includes(cor(o)) && !vistos.has(m)) { vistos.add(m); m.color.setHex(0x3b4149); m.metalness = .65; m.roughness = .36; m.envMapIntensity = 5; m.userData.estrutura = 1; }
    if (m.userData.estrutura && ehCaixa(o)) { const q = o.geometry.parameters; if (q.height >= 1 && q.width <= .14 && q.depth <= .14) { const m3 = m.clone(); m3.userData = { estrutura: 1 }; m3.map = rep2(txFuros(), 1, Math.round(q.height / .09)); o.material = m3; } } });
  /* 2c) luz: uma principal mais lateral e alta (desenha o relevo dos músculos), contraluz para recortar o corpo e menos preenchimento vindo de trás */
  sc.traverse(o => { if (!o.isDirectionalLight) return; const k = o.intensity; if (Math.abs(k - 1.3) < .01) o.intensity = .9; else if (Math.abs(k - .9) < .01) o.intensity = .6; else if (Math.abs(k - 2.3) < .01) o.intensity = 2.7; else if (Math.abs(k - 1.6) < .01) o.intensity = 2.0; else if (Math.abs(k - 1.5) < .01) o.intensity = 1.25; });
  sc.traverse(o => { if (o.isHemisphereLight) o.intensity = .16; });
  /* 3) sombra de contato: escurece o piso logo abaixo do que está perto dele (pés, corpo deitado, base dos aparelhos) */
  const TAM = 6, ALT = .42, RES = 512, rtA = new T3.WebGLRenderTarget(RES, RES), rtB = new T3.WebGLRenderTarget(RES, RES); rtA.texture.generateMipmaps = rtB.texture.generateMipmaps = false;
  const grp = new T3.Group(); grp.position.y = .005; sc.add(grp);
  const cam = new T3.OrthographicCamera(-TAM / 2, TAM / 2, TAM / 2, -TAM / 2, 0, ALT); cam.rotation.x = Math.PI / 2; grp.add(cam);
  const pg = new T3.PlaneGeometry(TAM, TAM).rotateX(Math.PI / 2), plano = M2(pg, new T3.MeshBasicMaterial({ map: rtA.texture, transparent: true, depthWrite: false, toneMapped: false, opacity: 1 })); plano.scale.y = -1; plano.renderOrder = 1; grp.add(plano);
  const borra = M2(pg, null); borra.visible = false; grp.add(borra);
  const dm = new T3.MeshDepthMaterial(); dm.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );', 'gl_FragColor = vec4( vec3( 0.0 ), pow( 1.0 - fragCoordZ, 1.35 ) * 0.9 );'); };
  const sb = dir => new T3.ShaderMaterial({ uniforms: { t: { value: null }, k: { value: 1 / RES } }, depthTest: false, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D t; uniform float k; varying vec2 vUv; void main(){ vec4 s = vec4(0.0); vec2 d = ${dir} * k; s += texture2D(t, vUv - 4.0*d) * 0.051; s += texture2D(t, vUv - 3.0*d) * 0.0918; s += texture2D(t, vUv - 2.0*d) * 0.12245; s += texture2D(t, vUv - d) * 0.1531; s += texture2D(t, vUv) * 0.1633; s += texture2D(t, vUv + d) * 0.1531; s += texture2D(t, vUv + 2.0*d) * 0.12245; s += texture2D(t, vUv + 3.0*d) * 0.0918; s += texture2D(t, vUv + 4.0*d) * 0.051; gl_FragColor = s; }` });
  const bh = sb('vec2(1.0, 0.0)'), bv = sb('vec2(0.0, 1.0)');
  const passa = (larg) => { borra.visible = true; borra.material = bh; bh.uniforms.t.value = rtA.texture; bh.uniforms.k.value = larg / RES; gl.setRenderTarget(rtB); gl.render(borra, cam); borra.material = bv; bv.uniforms.t.value = rtB.texture; bv.uniforms.k.value = larg / RES; gl.setRenderTarget(rtA); gl.render(borra, cam); borra.visible = false; };
  const some = []; sc.traverse(o => { if (o === plano || o === borra) return; if (o.isMesh && (o.material && (o.material.isShadowMaterial || o.material.isMeshBasicMaterial || o.material.isLineBasicMaterial) || o.userData.tapete || (o.geometry && o.geometry.type === 'ExtrudeGeometry' && o.position.y < .02) || o.renderOrder >= 20) || o.isLine || o.isSprite || o.isPoints) some.push(o); });
  /* o plano que recebe a sombra da luz principal sobe para cima do tapete: a sombra passa a cair também sobre ele */
  sc.traverse(o => { if (o.isMesh && o.material && o.material.isShadowMaterial) { o.material.opacity = .25; o.position.y = .0045; } });
  return {
    antes(alvo) { grp.position.x = alvo.x; grp.position.z = alvo.z; const vis = some.map(o => o.visible); some.forEach(o => { o.visible = false; }); plano.visible = false;
      const fundo = sc.background, au = gl.shadowMap.autoUpdate, ca = gl.getClearAlpha(), cc = gl.getClearColor(new T3.Color()); sc.background = null; gl.shadowMap.autoUpdate = false; sc.overrideMaterial = dm; gl.setClearColor(0x000000, 0);
      gl.setRenderTarget(rtA); gl.clear(); gl.render(sc, cam); sc.overrideMaterial = null; passa(4.2); passa(1.6);
      gl.setRenderTarget(null); gl.setClearColor(cc, ca); gl.shadowMap.autoUpdate = au; sc.background = fundo; some.forEach((o, i) => { o.visible = vis[i]; }); plano.visible = true; },
    dispose() { rtA.dispose(); rtB.dispose(); dm.dispose(); bh.dispose(); bv.dispose(); },
    _d: { rtA, rtB, plano, cam, grp, some }
  };
}


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
  const mp = rep2(txPiso(), e / .9, t / .9), geo = new T3.ExtrudeGeometry(forma(e, t, .07), { depth: .01, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2, curveSegments: 10 });
  const pos = geo.attributes.position, uv = geo.attributes.uv; for (let k = 0; k < pos.count; k++) uv.setXY(k, pos.getX(k) / e + .5, pos.getY(k) / t + .5);
  const m = M2(geo, new T3.MeshStandardMaterial({ map: mp, color: 0xffffff, roughness: .92, metalness: 0, envMapIntensity: 1.2, bumpMap: rep2(txGrao(), e / .25, t / .25), bumpScale: .25 }));
  m.rotation.x = -Math.PI / 2; m.position.set(i, .003, o); m.receiveShadow = true; sc.add(m);
  const fx = new T3.ExtrudeGeometry(forma(e + .012, t + .012, .076), { depth: .004, bevelEnabled: false, curveSegments: 10 }), f = M2(fx, m2.lima()); f.rotation.x = -Math.PI / 2; f.position.set(i, .0006, o); f.receiveShadow = true; sc.add(f);
  m.userData.tapete = f.userData.tapete = true; return m;
};

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
  /* 3) sombra de contato: escurece o piso logo abaixo do que está perto dele (pés, corpo deitado, base dos aparelhos) */
  const TAM = 6, ALT = .42, RES = 512, rtA = new T3.WebGLRenderTarget(RES, RES), rtB = new T3.WebGLRenderTarget(RES, RES); rtA.texture.generateMipmaps = rtB.texture.generateMipmaps = false;
  const grp = new T3.Group(); grp.position.y = .0172; sc.add(grp);
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
  sc.traverse(o => { if (o.isMesh && o.material && o.material.isShadowMaterial) { o.material.opacity = .25; o.position.y = .0166; } });
  return {
    antes(alvo) { grp.position.x = alvo.x; grp.position.z = alvo.z; const vis = some.map(o => o.visible); some.forEach(o => { o.visible = false; }); plano.visible = false;
      const fundo = sc.background, au = gl.shadowMap.autoUpdate, ca = gl.getClearAlpha(), cc = gl.getClearColor(new T3.Color()); sc.background = null; gl.shadowMap.autoUpdate = false; sc.overrideMaterial = dm; gl.setClearColor(0x000000, 0);
      gl.setRenderTarget(rtA); gl.clear(); gl.render(sc, cam); sc.overrideMaterial = null; passa(4.2); passa(1.6);
      gl.setRenderTarget(null); gl.setClearColor(cc, ca); gl.shadowMap.autoUpdate = au; sc.background = fundo; some.forEach((o, i) => { o.visible = vis[i]; }); plano.visible = true; },
    dispose() { rtA.dispose(); rtB.dispose(); dm.dispose(); bh.dispose(); bv.dispose(); },
    _d: { rtA, rtB, plano, cam, grp, some }
  };
}

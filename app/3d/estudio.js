/* AnabTech · estúdio de vídeos de execução
   Desenha cada quadro (3D + instruções) num canvas 1080×1920. O 3D vem de viewer-pro.js (window.__studio).
   Estrutura do vídeo: abertura → posicionamento passo a passo → execução por fases → erros → pontos-chave. */
const W = 1080, H = 1920, PY = 1318, OFF = 205, DK = 1.2, FPS = 30;
const COR = { ink: '#0b0c0e', lime: '#c8ff3d', limeInk: '#4f6b00', paper: '#f2f3ef', w: '#fff', d1: 'rgba(255,255,255,.72)', d2: 'rgba(255,255,255,.46)', linha: 'rgba(255,255,255,.14)', erro: '#ff6b57' };
const SG = '"Space Grotesk", sans-serif', IN = 'Inter, sans-serif';
const UM = { cabeca: 1, olhos: 1, escapulas: 1 };
const ANC = { cabeca: ['Head', 'HeadTop_End'], olhos: ['Head', 'HeadTop_End'], pescoco: ['Neck'], escapulas: ['LeftShoulder', 'RightShoulder'], apoios: ['HeadTop_End', 'Spine2', 'Hips', 'LeftFoot', 'RightFoot'], peito: ['Spine2'], tronco: ['Spine1'], abdomen: ['Spine'], lombar: ['Spine'], quadril: ['Hips'], gluteos: ['Hips'],
  maos: ['LeftHand', 'RightHand'], punhos: ['LeftHand', 'RightHand'], cotovelos: ['LeftForeArm', 'RightForeArm'], ombros: ['LeftArm', 'RightArm'], joelhos: ['LeftLeg', 'RightLeg'], pes: ['LeftFoot', 'RightFoot'], tornozelos: ['LeftFoot', 'RightFoot'] };
const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }, eout = t => 1 - Math.pow(1 - clamp(t), 3);
const back = t => { t = clamp(t); const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

/* ---------- conteúdo didático por exercício ---------- */
const CONTEUDO = window.CONTEUDO || {};

/* ---------- utilitários de desenho ---------- */
function rr(g, x, y, w, h, r) { const R = Array.isArray(r) ? r : [r, r, r, r]; g.beginPath(); g.moveTo(x + R[0], y); g.lineTo(x + w - R[1], y); g.quadraticCurveTo(x + w, y, x + w, y + R[1]); g.lineTo(x + w, y + h - R[2]); g.quadraticCurveTo(x + w, y + h, x + w - R[2], y + h); g.lineTo(x + R[3], y + h); g.quadraticCurveTo(x, y + h, x, y + h - R[3]); g.lineTo(x, y + R[0]); g.quadraticCurveTo(x, y, x + R[0], y); g.closePath(); }
function simbolo(g, x, y, s, cor) { g.save(); g.translate(x, y); g.scale(s / 100, s / 100); g.strokeStyle = cor; g.fillStyle = cor; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 12; g.stroke(new Path2D('M24 82 L50 38 L76 82')); g.lineWidth = 9; g.stroke(new Path2D('M37 66 H63')); g.beginPath(); g.arc(50, 18, 8, 0, 7); g.fill(); g.restore(); }
/* texto com <b>negrito</b>, quebrado em linhas */
function linhasRicas(g, html, larg, fReg, fBold) {
  const runs = []; String(html).split(/(<b>|<\/b>)/).reduce((b, p) => { if (p === '<b>') return true; if (p === '</b>') return false; p.split(/(\s+)/).forEach(w => { if (w) runs.push({ t: w, b }); }); return b; }, false);
  /* quebra por palavra inteira: um ponto ou vírgula logo depois de um negrito fica colado na palavra, nunca sozinho na linha de baixo */
  const L = [[]]; let x = 0; const esp = f => { g.font = f; return g.measureText(' ').width; };
  for (let i = 0; i < runs.length;) { if (/^\s+$/.test(runs[i].t)) { if (x > 0) { const w = esp(runs[i].b ? fBold : fReg); L[L.length - 1].push({ ...runs[i], t: ' ', w }); x += w; } i++; continue; }
    const pal = []; let pw = 0; while (i < runs.length && !/^\s+$/.test(runs[i].t)) { g.font = runs[i].b ? fBold : fReg; const w = g.measureText(runs[i].t).width; pal.push({ ...runs[i], w }); pw += w; i++; }
    if (x + pw > larg && x > 0) { const ul = L[L.length - 1]; if (ul.length && ul[ul.length - 1].t === ' ') ul.pop(); L.push([]); x = 0; } L[L.length - 1].push(...pal); x += pw; }
  return L;
}
function textoRico(g, L, x, y, lh, fReg, fBold, cor, corB, max = 9) { L.slice(0, max).forEach((ln, i) => { let cx = x; ln.forEach(r => { g.font = r.b ? fBold : fReg; g.fillStyle = r.b ? corB : cor; g.fillText(r.t, cx, y + i * lh); cx += r.w; }); }); return Math.min(L.length, max) * lh; }
function linhas(g, txt, larg, fonte) { g.font = fonte; const L = []; let l = ''; for (const p of String(txt).split(/\s+/)) { const t = l ? l + ' ' + p : p; if (g.measureText(t).width <= larg || !l) l = t; else { L.push(l); l = p; } } if (l) L.push(l); return L; }

/* ---------- ajuste de texto: encolhe até caber no painel ---------- */
const XM = 64, LARG = W - 2 * XM;
function ajPasso(g, p) { let ft = 56, Lt; do { Lt = linhas(g, p.t, LARG - 116, `700 ${ft}px ${SG}`); ft -= 4; } while (Lt.length > 2 && ft > 36); ft += 4; Lt = Lt.slice(0, 2); let r = null;
  for (const k of [1, .93, .86, .8, .74]) { const fc = Math.round(41 * k), fp = Math.round(34 * k), fR = `500 ${fc}px ${IN}`, fB = `700 ${fc}px ${IN}`, fP = `500 ${fp}px ${IN}`, lc = Math.round(fc * 1.37), lp = Math.round(fp * 1.36), Lc = linhasRicas(g, p.c, LARG, fR, fB), Lp = p.pq ? linhas(g, p.pq, LARG - 150, fP) : [];
    const fim = PY + 150 + Lt.length * (ft + 6) + 40 + Lc.length * lc + (p.pq ? 18 + 14 + (Lp.length - 1) * lp : 0); r = { ft, Lt, fR, fB, fP, lc, lp, Lc, Lp, fim, k, ok: fim <= H - 92 }; if (r.ok) break; } return r; }
function ajFase(g, f, temTiles) { let fn = 60; g.font = `700 ${fn}px ${SG}`; while (g.measureText(f.n).width > LARG && fn > 40) { fn -= 2; g.font = `700 ${fn}px ${SG}`; } const lim = (temTiles ? H - 168 : H - 40) - 26, y0 = PY + 182; let r = null;
  for (const fs of [38, 36, 34, 32, 30, 28]) { const fR = `500 ${fs}px ${IN}`, fB = `700 ${fs}px ${IN}`, lh = Math.round(fs * 1.37), L = linhasRicas(g, f.t, LARG, fR, fB), fim = y0 + 12 + L.length * lh + 8; r = { fn, fR, fB, lh, L, fim, fs, ok: fim <= lim }; if (r.ok) break; } return r; }
function ajLista(g, L) { let r = null; for (const fs of [38, 36, 34, 32, 30]) { const fR = `500 ${fs}px ${IN}`, fB = `700 ${fs}px ${IN}`, lh = Math.round(fs * 1.32), gap = Math.round(fs * .9), Ls = L.map(t => linhasRicas(g, t, LARG - 80, fR, fB)), alt = Ls.reduce((s, x) => s + x.length * lh + gap, 0) - gap; r = { fR, fB, lh, gap, Ls, fs, ok: PY + 236 + alt - lh * .7 <= H - 56 }; if (r.ok) break; } return r; }
/* respiração: solta o ar no esforço (fase concêntrica) e inspira na volta. Vem do texto da fase quando ele já diz; senão, do nome da fase. */
const _respC = new WeakMap();
function respLista(K, P) { if (K.resp) return K.resp; const temFech = P.some(f => /^fechamento/i.test(f.n)); let ult = 0; return P.map(f => { const t = (f.t || '').replace(/<[^>]+>/g, ''), n = f.n.toLowerCase(); let m = 0;
    if (/descida|desenrolar|alongamento|dobradi[cç]a/.test(n)) m = -1; else if (/^abertura/.test(n)) m = temFech ? -1 : 1;
    else if (/^(subida|puxada|empurrada|extens[aã]o|flex[aã]o|eleva[cç][aã]o|enrolar|coice|abdu[cç][aã]o|adu[cç][aã]o|impulso|sa[ií]da|explos[aã]o|diagonal|fechamento)/.test(n)) m = 1;
    else if (/^(retorno|volta|voltar)/.test(n)) m = -ult;
    if (m) ult = m;
    if (/\b(inspire|inspirando|puxe o ar)/i.test(t) && !/\bexpire|solte o ar/i.test(t.split(/inspire|puxe o ar/i)[0])) return 'Inspire'; if (/\b(expire|expirando|solte o ar|soltando o ar)/i.test(t) && m >= 0) return 'Solte o ar';
    return m > 0 ? 'Solte o ar' : m < 0 ? 'Inspire' : ''; }); }
function respDe(K, P, ph) { let L = _respC.get(K); if (!L) { L = respLista(K, P); _respC.set(K, L); } return L[ph] || ''; }
/* conferência: tudo cabe? as âncoras existem? */
function conferir(K, n, bones) { const cv = document.createElement('canvas'), g = cv.getContext('2d'), P = []; (K.setup || []).forEach((p, i) => { const f = ajPasso(g, p); if (!f.ok) P.push(`passo ${i + 1} não cabe (${f.fim})`); if (f.k < .86) P.push(`passo ${i + 1} encolheu para ${f.k}`); (ANC[p.a] || [p.a]).forEach(b => { if (bones && !bones.includes(b)) P.push(`passo ${i + 1}: osso ${b}`); }); if (!ANC[p.a]) P.push(`passo ${i + 1}: âncora ${p.a}`); });
  n.phases.forEach((f, i) => { const r = ajFase(g, f, n.tiles.length > 0); if (!r.ok) P.push(`fase ${i + 1} não cabe`); else if (r.fs < 32) P.push(`fase ${i + 1} fonte ${r.fs}`); });
  for (const [nome, L] of [['erros', K.erros], ['chave', K.chave]]) { if (!L || !L.length) { P.push('sem ' + nome); continue; } const r = ajLista(g, L.slice(0, 4)); if (!r.ok) P.push(nome + ' não cabe'); else if (r.fs < 34) P.push(`${nome} fonte ${r.fs}`); }
  if (K.trilha && !ANC[K.trilha]) P.push('trilha ' + K.trilha); return P; }
/* ---------- roteiro: os trechos do vídeo ---------- */
function roteiro(api, K) {
  const S = []; let t = 0; const add = (tipo, d, x) => { S.push({ tipo, t0: t, t1: t + d, d, ...x }); t += d; };
  add('intro', 2.4);
  (K.setup || []).forEach((p, i) => add('setup', p.d || 3.4, { i }));
  const s0 = api.tl.segs[0], m0 = s0 && s0.s1 === undefined ? Math.max(0, s0.d - 0.7) : 0;
  add('exec', api.tl.dur - m0, { m0 });
  if ((K.erros || []).length) add('erros', 4.2);
  if ((K.chave || []).length) add('chave', 4.2);
  return { S, dur: t, frames: Math.round(t * FPS) };
}
function ancora(api, nome) { const B = (ANC[nome] || [nome]).map(b => api.bone(b)).filter(Boolean); if (!B.length) return null; const m = B[0].clone().multiplyScalar(0); B.forEach(b => m.add(b)); m.multiplyScalar(1 / B.length); return { m, B: UM[nome] ? [m] : B }; }
function camBase(api, M) { const c = api.camF(M); return { az: c.az, el: c.el ?? 12, dist: c.dist * DK, tx: c.tx ?? 0, ty: c.ty, tz: c.tz ?? 0 }; }
function camMix(a, b, t) { const o = {}; for (const k of ['az', 'el', 'dist', 'tx', 'ty', 'tz']) o[k] = lerp(a[k], b[k], t); return o; }
/* pose e mira sem desenhar: servem para medir onde cada pino cai na tela */
function posar(api, M) { api.n.pose(api.c, api.tl.at(M), M); api.sc.updateMatrixWorld(true); }
function mirar(api, c) { const cam = api.cam, T = api.V(c.tx ?? 0, c.ty, c.tz ?? 0), k = Math.PI / 180, el = (c.el ?? 12) * k, az = c.az * k, d = c.dist;
  cam.position.set(T.x + d * Math.sin(az) * Math.cos(el), T.y + d * Math.sin(el), T.z + d * Math.cos(az) * Math.cos(el)); cam.lookAt(T); cam.setViewOffset(W, H, 0, OFF, W, H); cam.updateMatrixWorld(); }
/* câmera de um passo do posicionamento: aproxima do ponto e garante que todos os pinos fiquem na área livre do quadro */
const SEG = [96, 984, 210, PY - 84];
function camPasso(api, K, i) { posar(api, .02); const b0 = camBase(api, 0), p = K.setup[i], A = ancora(api, p.a), z = p.zoom || .66, k = p.puxa ?? .78, T = A ? A.m : null;
  const c = { az: b0.az + (p.az || 0), el: p.el ?? b0.el, dist: b0.dist * z, tx: T ? lerp(b0.tx, T.x, k) : b0.tx, ty: T ? lerp(b0.ty, T.y, k) : b0.ty, tz: T ? lerp(b0.tz, T.z, k) : b0.tz };
  if (A) for (let n = 0; n < 16; n++) { mirar(api, c); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, tras = false; A.B.forEach(b => { const [x, y, zz] = api.proj(b); if (zz > 1) tras = true; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    if (!tras && x0 >= SEG[0] && x1 <= SEG[1] && y0 >= SEG[2] && y1 <= SEG[3]) break;
    if (tras || x1 - x0 > (SEG[1] - SEG[0]) * .96 || y1 - y0 > (SEG[3] - SEG[2]) * .96) c.dist *= 1.1;
    c.tx = lerp(c.tx, T.x, .6); c.ty = lerp(c.ty, T.y, .6); c.tz = lerp(c.tz, T.z, .6); c.aj = n + 1; }
  return c; }
/* câmera de cada trecho (estado final) */
function camDe(api, K, seg, tt) {
  const b0 = camBase(api, 0);
  if (seg.tipo === 'intro') return { ...b0, az: b0.az - 26 + 26 * eout(tt / seg.d), dist: b0.dist * (1.1 - .1 * eout(tt / seg.d)) };
  if (seg.tipo === 'setup') { const c = (api._cs || (api._cs = []))[seg.i] || (api._cs[seg.i] = camPasso(api, K, seg.i)); return { ...c, az: c.az + 1.2 * (tt / seg.d - .5) }; }
  if (seg.tipo === 'exec') return camBase(api, seg.m0 + tt);
  return { ...b0, az: b0.az - 8 + 10 * (tt / seg.d), dist: b0.dist * 1.04 };
}

/* ---------- um quadro ---------- */
function trilhaDe(api, K) { if (!K.trilha) return null; const sg = api.tl.segs.find(s => s.s1 !== undefined && s.s1 !== s.s0); if (!sg) return null; const P = []; for (let i = 0; i <= 28; i++) { const M = sg.t0 + sg.d * i / 28; api.n.pose(api.c, api.tl.at(M), M); api.sc.updateMatrixWorld(true); const A = ancora(api, K.trilha); if (A) P.push(A.m.clone()); } return P; }
function criarQuadro(api, K, cv, tema) {
  const g = cv.getContext('2d'), R = roteiro(api, K), n = api.n, nome = K.nome || n.title;
  const claro = tema !== 'escuro';
  const TRILHA = trilhaDe(api, K); api._cs = (K.setup || []).map((p, i) => camPasso(api, K, i));
  const TR = .95; /* transição de câmera entre trechos, em segundos */
  function desenhar(t) {
    t = clamp(t, 0, R.dur - 1e-4); const si = R.S.findIndex(s => t < s.t1), seg = R.S[si], tt = t - seg.t0, ant = R.S[si - 1];
    let cam = camDe(api, K, seg, tt); if (ant && tt < TR) cam = camMix(camDe(api, K, ant, ant.d), cam, eio(tt / TR));
    const M = seg.tipo === 'exec' ? seg.m0 + tt : 0.02, arcOp = seg.tipo === 'exec' ? clamp(tt / .5) * clamp((seg.d - tt) / .4) : 0;
    const F = api.frame(M, cam, OFF, arcOp);
    /* fundo */
    if (claro) { const gr = g.createRadialGradient(W / 2, 700, 60, W / 2, 760, 1250); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.5, '#f1f3f2'); gr.addColorStop(1, '#dfe3e1'); g.fillStyle = gr; }
    else { const gr = g.createRadialGradient(W / 2, 720, 60, W / 2, 760, 1200); gr.addColorStop(0, '#3a3e44'); gr.addColorStop(.55, '#1b1d21'); gr.addColorStop(1, '#0b0c0e'); g.fillStyle = gr; }
    g.fillRect(0, 0, W, H);
    /* grade técnica discreta */
    g.save(); g.strokeStyle = claro ? 'rgba(11,12,14,.045)' : 'rgba(255,255,255,.05)'; g.lineWidth = 2; for (let x = 60; x < W; x += 120) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, PY); g.stroke(); } for (let y = 80; y < PY; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore();
    g.drawImage(api.gl.domElement, 0, 0, W, H);
    { const v = g.createLinearGradient(0, 0, 0, 300); v.addColorStop(0, claro ? 'rgba(244,246,245,.97)' : 'rgba(11,12,14,.95)'); v.addColorStop(.62, claro ? 'rgba(244,246,245,.8)' : 'rgba(11,12,14,.7)'); v.addColorStop(1, claro ? 'rgba(244,246,245,0)' : 'rgba(11,12,14,0)'); g.fillStyle = v; g.fillRect(0, 0, W, 300); }
    const tinta = claro ? COR.ink : '#fff', tinta2 = claro ? 'rgba(11,12,14,.6)' : 'rgba(255,255,255,.62)';
    /* ----- topo: marca + capítulos ----- */
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.fillStyle = COR.lime; rr(g, 56, 64, 68, 68, 18); g.fill(); simbolo(g, 56 + 9, 64 + 9, 50, COR.ink);
    g.font = `700 40px ${SG}`; g.fillStyle = tinta; g.fillText('anab', 142, 112); const wa = g.measureText('anab').width; g.font = `500 40px ${SG}`; g.fillStyle = claro ? COR.limeInk : COR.lime; g.fillText('tech', 142 + wa, 112);
    const CAP = ['Posição', 'Execução', 'Atenção'], capDe = s => s.tipo === 'setup' ? 0 : s.tipo === 'exec' ? 1 : s.tipo === 'intro' ? -1 : 2, cap = capDe(seg);
    const aCap = seg.tipo === 'intro' ? clamp((tt - 1.5) / .6) : 1;
    if (aCap > 0) { g.save(); g.globalAlpha = aCap; const x0 = 56, x1 = W - 56, gap = 14, cw = (x1 - x0 - gap * 2) / 3;
      CAP.forEach((c, i) => { const x = x0 + i * (cw + gap), tr = R.S.filter(s => capDe(s) === i); let pr = 0; if (tr.length) { const a = tr[0].t0, b = tr[tr.length - 1].t1; pr = clamp((t - a) / (b - a)); }
        g.fillStyle = claro ? 'rgba(11,12,14,.12)' : 'rgba(255,255,255,.16)'; rr(g, x, 168, cw, 8, 4); g.fill(); if (pr > 0) { g.fillStyle = claro ? COR.ink : COR.lime; rr(g, x, 168, Math.max(8, cw * pr), 8, 4); g.fill(); }
        g.font = `${i === cap ? 700 : 500} 28px ${IN}`; g.fillStyle = i === cap ? tinta : tinta2; g.fillText(c, x, 214); });
      g.restore(); }
    /* ----- marcadores 3D do passo de posicionamento ----- */
    if (seg.tipo === 'setup') { const p = K.setup[seg.i], A = ancora(api, p.a), ap = back(clamp((tt - .35) / .45)), pulso = (tt * 0.9) % 1;
      if (A && ap > 0) A.B.forEach((b, bi) => { const [x, y] = api.proj(b); g.save(); g.globalAlpha = clamp(ap);
        if (A.B.length > 2) { const a2 = back(clamp((tt - .35 - bi * .16) / .4)); if (a2 <= 0) { g.restore(); return; } g.strokeStyle = COR.lime; g.lineWidth = 4; g.globalAlpha = (1 - pulso) * .8; g.beginPath(); g.arc(x, y, 22 + pulso * 30, 0, 7); g.stroke(); g.globalAlpha = 1; g.fillStyle = COR.ink; g.beginPath(); g.arc(x, y, 24 * a2, 0, 7); g.fill(); g.fillStyle = COR.lime; g.beginPath(); g.arc(x, y, 17 * a2, 0, 7); g.fill(); g.restore(); return; }
        g.strokeStyle = COR.lime; g.lineWidth = 5; g.globalAlpha = clamp(ap) * (1 - pulso) * .9; g.beginPath(); g.arc(x, y, 34 + pulso * 46, 0, 7); g.stroke(); g.globalAlpha = clamp(ap);
        g.shadowColor = 'rgba(11,12,14,.35)'; g.shadowBlur = 18; g.shadowOffsetY = 6; g.fillStyle = COR.ink; g.beginPath(); g.arc(x, y, 34 * ap, 0, 7); g.fill(); g.shadowColor = 'transparent';
        g.fillStyle = COR.lime; g.beginPath(); g.arc(x, y, 27 * ap, 0, 7); g.fill(); g.fillStyle = COR.ink; g.font = `700 34px ${SG}`; g.textAlign = 'center'; g.fillText(String(seg.i + 1), x, y + 12); g.textAlign = 'left'; g.restore(); }); }
    /* ----- execução: ângulos e músculos ----- */
    if (seg.tipo === 'exec') {
      let TLB = null;
      if (TRILHA && TRILHA.length > 2) { const a = clamp(tt / .8) * clamp((seg.d - tt) / .4), Pp = TRILHA.map(w => api.proj(w)); g.save(); g.globalAlpha = a; g.lineCap = 'round'; g.lineJoin = 'round';
        g.strokeStyle = 'rgba(11,12,14,.85)'; g.lineWidth = 9; g.beginPath(); Pp.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.strokeStyle = COR.lime; g.lineWidth = 5; g.stroke();
        const At = ancora(api, K.trilha); if (At) { const [x, y] = api.proj(At.m); g.fillStyle = COR.ink; g.beginPath(); g.arc(x, y, 15, 0, 7); g.fill(); g.fillStyle = COR.lime; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }
        if (K.trilhaNome) { const [x0, y0] = Pp[0]; g.font = `700 25px ${IN}`; const tw = g.measureText(K.trilhaNome).width + 34; g.fillStyle = COR.ink; const alto = y0 - 74 < 236, lx = clamp(alto ? x0 + 30 : x0 - tw / 2, 40, W - tw - 110), ly = alto ? Math.max(236, y0 - 23) : y0 - 74; /* não invade o cabeçalho */ TLB = { x: lx + tw / 2, y: ly + 23, bw: tw, bh: 46 }; rr(g, lx, ly, tw, 46, 23); g.fill(); g.fillStyle = COR.lime; g.fillText(K.trilhaNome, lx + 17, ly + 31); }
        g.restore(); }
      /* caixas dos ângulos: medidas antes de desenhar, para que uma não cubra a outra nem fique embaixo de um rótulo de músculo */
      const CH = F.chips.filter(c => c.op > .02).map(c => { const k = W / 864 * 1.25; g.font = `700 50px ${SG}`; const tv = c.v + '°', w1 = g.measureText(tv).width; g.font = `600 24px ${IN}`; const lb = String(c.l || '').toUpperCase() === c.l ? c.l.charAt(0) + c.l.slice(1).toLowerCase() : (c.l || ''), w2 = g.measureText(lb).width;
        return { c, tv, lb, bw: Math.max(w1, w2) + 44, bh: 104, x: clamp(c.x + c.dx * k, 130, W - 230), y: clamp(c.y + c.dy * k, 280, PY - 130), op: c.op }; });
      for (let a = 0; a < CH.length; a++) for (let b = -1; b < a; b++) { const A = CH[a], B = b < 0 ? TLB : CH[b]; if (!B) continue; const px = (A.bw + B.bw) / 2 + 14 - Math.abs(A.x - B.x), pyy = (A.bh + B.bh) / 2 + 14 - Math.abs(A.y - B.y); if (px <= 0 || pyy <= 0) continue;
        if (pyy <= px) A.y = clamp(A.y + (A.y >= B.y ? pyy : -pyy), 280, PY - 130); else A.x = clamp(A.x + (A.x >= B.x ? px : -px), 130, W - 230); }
      const LB = F.labels && F.labels.op > 0 ? F.labels.items.map(l => { const k = W / 864; g.font = `700 32px ${IN}`; const w1 = g.measureText(l.t).width; g.font = `500 25px ${IN}`; const w2 = g.measureText(l.s).width; return { x: clamp(l.x + l.dir * 150 * Math.max(.8, k * 1.5), 190, W - 190), y: clamp(l.y + l.dy * k * 1.3, 290, PY - 90), bw: Math.max(w1, w2) + 44, bh: 100 }; }) : [];
      CH.forEach(A => { if (LB.some(B => Math.abs(A.x - B.x) < (A.bw + B.bw) / 2 + 8 && Math.abs(A.y - B.y) < (A.bh + B.bh) / 2 + 8)) A.op *= 1 - clamp(F.labels.op); });
      CH.forEach(({ c, tv, lb, bw, bh, x, y, op }) => { if (op <= .02) return; g.save(); g.globalAlpha = op;
        g.strokeStyle = claro ? 'rgba(11,12,14,.5)' : 'rgba(255,255,255,.6)'; g.lineWidth = 3; g.setLineDash([2, 9]); g.lineCap = 'round'; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(x, y); g.stroke(); g.setLineDash([]);
        g.shadowColor = 'rgba(11,12,14,.22)'; g.shadowBlur = 22; g.shadowOffsetY = 8; g.fillStyle = '#fff'; rr(g, x - bw / 2, y - bh / 2, bw, bh, 22); g.fill(); g.shadowColor = 'transparent';
        g.textAlign = 'center'; g.fillStyle = COR.ink; g.font = `700 50px ${SG}`; g.fillText(tv, x, y + 8); g.fillStyle = 'rgba(11,12,14,.6)'; g.font = `600 24px ${IN}`; g.fillText(lb, x, y + 38); g.textAlign = 'left'; g.restore(); });
      if (F.labels) F.labels.items.forEach(l => { const k = W / 864, x = clamp(l.x + l.dir * 150 * Math.max(.8, k * 1.5), 190, W - 190), y = clamp(l.y + l.dy * k * 1.3, 290, PY - 90); g.save(); g.globalAlpha = F.labels.op;
        g.strokeStyle = COR.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(l.x, l.y); g.lineTo(x, y); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(l.x, l.y, 9, 0, 7); g.fill(); g.stroke();
        g.font = `700 32px ${IN}`; const w1 = g.measureText(l.t).width; g.font = `500 25px ${IN}`; const w2 = g.measureText(l.s).width, bw = Math.max(w1, w2) + 44, bh = 100;
        g.fillStyle = COR.ink; rr(g, x - bw / 2, y - bh / 2, bw, bh, 20); g.fill(); g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = `700 32px ${IN}`; g.fillText(l.t, x, y - 4); g.fillStyle = '#ffb48a'; g.font = `500 25px ${IN}`; g.fillText(l.s, x, y + 30); g.textAlign = 'left'; g.restore(); });
    }
    if (seg.tipo === 'exec') { const a = clamp(tt / .6) * clamp((seg.d - tt) / .4); g.save(); g.globalAlpha = a;
      /* medidor de amplitude: onde a repetição está entre o início e o fim do movimento */
      const gx = W - 74, g0 = 420, g1 = 1010, s = clamp(F.s); g.fillStyle = claro ? 'rgba(11,12,14,.1)' : 'rgba(255,255,255,.16)'; rr(g, gx - 5, g0, 10, g1 - g0, 5); g.fill();
      g.fillStyle = COR.ink; rr(g, gx - 5, g0, 10, Math.max(10, (g1 - g0) * s), 5); g.fill(); const my = g0 + (g1 - g0) * s; g.fillStyle = COR.lime; g.strokeStyle = COR.ink; g.lineWidth = 5; g.beginPath(); g.arc(gx, my, 17, 0, 7); g.fill(); g.stroke();
      g.font = `600 24px ${IN}`; g.textAlign = 'center'; g.fillStyle = tinta2; g.fillText(K.topo || 'Início', gx, g0 - 22); g.fillText(K.fundo || 'Fim', gx, g1 + 44); g.textAlign = 'left';
      /* legenda da cor dos músculos */
      const lt = 'Em laranja: músculo trabalhando'; g.font = `600 25px ${IN}`; const lw = g.measureText(lt).width + 74; g.fillStyle = claro ? 'rgba(255,255,255,.88)' : 'rgba(11,12,14,.7)'; rr(g, 56, PY - 86, lw, 52, 26); g.fill(); const lg = g.createLinearGradient(74, 0, 104, 0); lg.addColorStop(0, '#e9b9a6'); lg.addColorStop(1, '#ff5a00'); g.fillStyle = lg; rr(g, 74, PY - 68, 30, 16, 8); g.fill(); g.fillStyle = tinta; g.fillText(lt, 116, PY - 51);
      g.restore(); }
    /* ----- painel de instruções ----- */
    const sub = seg.tipo === 'intro' ? eout(clamp((tt - .25) / .7)) : 1, py = PY + (1 - sub) * 120;
    g.save(); g.globalAlpha = sub; g.shadowColor = 'rgba(11,12,14,.3)'; g.shadowBlur = 50; g.shadowOffsetY = -10; g.fillStyle = COR.ink; rr(g, 0, py, W, H - py + 60, [48, 48, 0, 0]); g.fill(); g.shadowColor = 'transparent';
    /* textura: grade no canto do painel */
    g.save(); rr(g, 0, py, W, H - py, [48, 48, 0, 0]); g.clip(); const gm = g.createLinearGradient(W * .45, py, W, H); gm.addColorStop(0, 'rgba(255,255,255,0)'); gm.addColorStop(1, 'rgba(255,255,255,.075)'); g.strokeStyle = gm; g.lineWidth = 2; for (let x = 40; x < W; x += 52) { g.beginPath(); g.moveTo(x, py); g.lineTo(x, H); g.stroke(); } for (let y = py + 20; y < H; y += 52) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore();
    const X = 64, LW = W - 2 * X; const ent = clamp(tt / .45), sai = seg.tipo === 'exec' ? 1 : clamp((seg.d - tt) / .25), op = seg.tipo === 'intro' ? 1 : Math.min(eout(ent), sai), dy = (1 - eout(ent)) * 26;
    if (seg.tipo === 'intro') {
      g.fillStyle = COR.lime; g.font = `600 32px ${IN}`; g.fillText('Como fazer', X, py + 92);
      let fs = 86; let Ln; do { Ln = linhas(g, nome, LW, `700 ${fs}px ${SG}`); fs -= 4; } while (Ln.length > 2 && fs > 52); fs += 4; g.fillStyle = '#fff'; g.font = `700 ${fs}px ${SG}`; Ln.slice(0, 2).forEach((l, i) => g.fillText(l, X - 3, py + 92 + (i + 1) * (fs + 6) + 6)); let y = py + 92 + Ln.slice(0, 2).length * (fs + 6) + 70;
      g.strokeStyle = COR.linha; g.lineWidth = 2; g.beginPath(); g.moveTo(X, y - 44); g.lineTo(W - X, y - 44); g.stroke();
      g.fillStyle = COR.d2; g.font = `500 28px ${IN}`; g.fillText('Músculo principal', X, y); g.fillStyle = '#fff'; g.font = `700 40px ${IN}`; g.fillText(n.primary, X, y + 50);
      if (n.secondary) { g.fillStyle = COR.d2; g.font = `500 28px ${IN}`; g.fillText('Auxiliares', X, y + 108); g.fillStyle = COR.d1; g.font = `500 34px ${IN}`; linhas(g, n.secondary.charAt(0).toUpperCase() + n.secondary.slice(1), LW, `500 34px ${IN}`).slice(0, 2).forEach((l, i) => g.fillText(l, X, y + 152 + i * 44)); }
    } else if (seg.tipo === 'setup') { const p = K.setup[seg.i], N = K.setup.length, f = ajPasso(g, p); g.globalAlpha = sub * op; g.translate(0, dy);
      g.fillStyle = COR.lime; g.beginPath(); g.arc(X + 46, py + 104, 46, 0, 7); g.fill(); g.fillStyle = COR.ink; g.font = `700 52px ${SG}`; g.textAlign = 'center'; g.fillText(String(seg.i + 1), X + 46, py + 122); g.textAlign = 'left';
      g.fillStyle = COR.d2; g.font = `600 28px ${IN}`; g.fillText(`Posicionamento · passo ${seg.i + 1} de ${N}`, X + 116, py + 84);
      g.fillStyle = '#fff'; g.font = `700 ${f.ft}px ${SG}`; f.Lt.forEach((l, i) => g.fillText(l, X + 114, py + 142 + i * (f.ft + 6)));
      let y = py + 150 + f.Lt.length * (f.ft + 6) + 40; y += textoRico(g, f.Lc, X, y, f.lc, f.fR, f.fB, COR.d1, '#fff', 9);
      if (p.pq) { y += 18; g.strokeStyle = COR.linha; g.lineWidth = 2; g.beginPath(); g.moveTo(X, y - 30); g.lineTo(W - X, y - 30); g.stroke(); g.fillStyle = COR.lime; g.font = `700 30px ${IN}`; g.fillText('Por quê', X, y + 14); f.Lp.forEach((l, i) => { g.fillStyle = 'rgba(255,255,255,.62)'; g.font = f.fP; g.fillText(l, X + 150, y + 14 + i * f.lp); }); }
      g.translate(0, -dy); g.globalAlpha = sub;
      /* progresso dos passos */
      const bw = 44, gp = 10, x0 = W - X - N * bw - (N - 1) * gp; for (let i = 0; i < N; i++) { g.fillStyle = i < seg.i ? 'rgba(200,255,61,.55)' : i === seg.i ? COR.lime : 'rgba(255,255,255,.18)'; rr(g, x0 + i * (bw + gp), H - 66, bw, 8, 4); g.fill(); }
    } else if (seg.tipo === 'exec') { const FT = faseTexto(api, M), pt = FT.ph, ph = pt, P = n.phases;
      /* abas das fases: a atual com nome, as outras só com o número */
      let x = X; P.forEach((f, i) => { const at = i === ph, tx = at ? `${i + 1} · ${f.n}` : String(i + 1); g.font = `${at ? 700 : 600} 28px ${IN}`; const w = at ? g.measureText(tx).width + 40 : 56; g.fillStyle = at ? COR.lime : 'rgba(255,255,255,.1)'; rr(g, x, py + 46, w, 56, 28); g.fill(); g.fillStyle = at ? COR.ink : COR.d1; g.textAlign = 'center'; g.fillText(tx, x + w / 2, py + 84); g.textAlign = 'left'; x += w + 10; });
      /* respiração, à direita das abas */
      const rsp = respDe(K, P, pt); if (rsp) { g.font = `600 28px ${IN}`; const wr = g.measureText(rsp).width + 78, bx = W - X - wr; if (bx > x + 6) { g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2; rr(g, bx, py + 47, wr, 54, 27); g.stroke(); const pu = .5 + .5 * Math.sin(t * 3.2); g.fillStyle = COR.lime; g.beginPath(); g.arc(bx + 30, py + 74, 8 + 5 * pu, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillText(rsp, bx + 56, py + 84); } }
      /* quando a fase muda, o texto entra de novo; pausas curtas (menos de 1 s) não trocam o texto, para dar tempo de ler */
      const ef = eout(clamp((M - FT.ini) / .35));
      const temT = F.tiles.length > 0, ff = ajFase(g, P[pt], temT);
      g.globalAlpha = sub * ef; g.translate(0, (1 - ef) * 20);
      g.fillStyle = '#fff'; g.font = `700 ${ff.fn}px ${SG}`; g.fillText(P[pt].n, X - 2, py + 182);
      textoRico(g, ff.L, X, py + 182 + ff.lh + 12, ff.lh, ff.fR, ff.fB, COR.d1, '#fff', 9);
      g.translate(0, -(1 - ef) * 20); g.globalAlpha = sub;
      /* ângulos em tempo real */
      const T = F.tiles.slice(0, 3), gp = 14, tw = T.length ? (LW - gp * (T.length - 1)) / T.length : 0, ty = H - 168; T.forEach((tl, i) => { const x = X + i * (tw + gp); g.fillStyle = 'rgba(255,255,255,.07)'; rr(g, x, ty, tw, 124, 22); g.fill(); g.fillStyle = '#fff'; g.font = `700 54px ${SG}`; const tv = String(tl.v); g.fillText(tv, x + 22, ty + 62); const wv = g.measureText(tv).width; g.fillStyle = COR.lime; g.font = `700 34px ${SG}`; g.fillText('°', x + 24 + wv, ty + 46);
        g.fillStyle = COR.d2; let f2 = 25; g.font = `500 ${f2}px ${IN}`; while (g.measureText(tl.l).width > tw - 40 && f2 > 17) { f2--; g.font = `500 ${f2}px ${IN}`; } g.fillText(tl.l, x + 22, ty + 100); });
    } else { const errs = seg.tipo === 'erros', L = (errs ? K.erros : K.chave).slice(0, 4), fl = ajLista(g, L); g.globalAlpha = sub * op; g.translate(0, dy);
      g.fillStyle = errs ? COR.erro : COR.lime; g.font = `600 30px ${IN}`; g.fillText(errs ? 'Erros comuns' : 'Para lembrar', X, py + 84);
      g.fillStyle = '#fff'; g.font = `700 58px ${SG}`; g.fillText(errs ? 'Evite' : 'Pontos-chave', X - 2, py + 152);
      let y = py + 236; L.forEach((it, i) => { const a = eout(clamp((tt - .25 - i * .28) / .4)); g.save(); g.globalAlpha = sub * op * a; g.translate((1 - a) * 30, 0);
        g.fillStyle = errs ? 'rgba(255,107,87,.16)' : COR.lime; g.beginPath(); g.arc(X + 26, y - 12, 26, 0, 7); g.fill(); g.strokeStyle = errs ? COR.erro : COR.ink; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
        if (errs) { g.moveTo(X + 16, y - 22); g.lineTo(X + 36, y - 2); g.moveTo(X + 36, y - 22); g.lineTo(X + 16, y - 2); } else { g.moveTo(X + 14, y - 12); g.lineTo(X + 23, y - 3); g.lineTo(X + 38, y - 21); } g.stroke();
        const hh = textoRico(g, fl.Ls[i], X + 76, y, fl.lh, fl.fR, fl.fB, '#fff', '#fff', 3); g.restore(); y += Math.max(hh, fl.lh) + fl.gap; });
      g.translate(0, -dy); g.globalAlpha = sub; }
    g.restore();
    return { seg: seg.tipo, t };
  }
  return { desenhar, R };
}
/* fase cujo texto está na tela: a do trecho atual, ou a do último trecho longo quando o atual é uma pausa curta */
/* (só pausas: um movimento rápido continua trocando o texto junto com o corpo) */
function faseTexto(api, M) { const S = api.tl.segs, a = api.tl.at(M); let j = S.indexOf(a.seg); if (j < 0) return { ph: a.ph, ini: M - 9 }; while (j > 0 && S[j].s1 == null && S[j].d < 1) j--; return { ph: S[j].ph, ini: S[j].t0 }; }
/* instante da capa: dentro da execução, com a fase estável (texto e ângulos inteiros na tela) */
function capaT(api, R) { const s = R.S.find(x => x.tipo === 'exec'); if (!s) return 1; const ph = tt => faseTexto(api, s.m0 + tt).ph, d = 1 / FPS;
  for (let tt = Math.min(2.5, s.d * .3); tt < s.d - 1; tt += d) { let ok = true; for (let k = -.6; k <= .3 && ok; k += d) if (tt + k < 0 || ph(tt + k) !== ph(tt)) ok = false; if (ok) return s.t0 + tt; }
  return s.t0 + Math.min(4, s.d * .35); }
window.Estudio = { criarQuadro, roteiro, conferir, respLista, capaT, W, H, FPS };

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const B = '/home/claude/mh/build/bin/', meta = JSON.parse(fs.readFileSync(B + 'meta.json'));
const doc = await io.read('/home/claude/anabtech.github.io/app/3d/models/Atleta.glb'), root = doc.getRoot(), buf = root.listBuffers()[0];
const mesh = root.listMeshes()[0], prim = mesh.listPrimitives()[0];
const le = (n, T) => { const b = fs.readFileSync(B + n + '.bin'); return new T(b.buffer, b.byteOffset, b.byteLength / T.BYTES_PER_ELEMENT); };
const ac = (arr, type, norm) => { const a = doc.createAccessor().setArray(arr).setType(type).setBuffer(buf); if (norm) a.setNormalized(true); return a; };
for (const s of prim.listSemantics()) { const a = prim.getAttribute(s); prim.setAttribute(s, null); a.dispose(); }
const u16n = f => { const o = new Uint16Array(f.length); for (let i = 0; i < f.length; i++) o[i] = Math.round(Math.min(1, Math.max(0, f[i])) * 65535); return o; };
const i16n = f => { const o = new Int16Array(f.length); for (let i = 0; i < f.length; i++) o[i] = Math.round(Math.min(1, Math.max(-1, f[i])) * 32767); return o; };
prim.setAttribute('POSITION', ac(le('POSITION', Float32Array), 'VEC3')).setAttribute('NORMAL', ac(le('NORMAL', Float32Array), 'VEC3'))
  .setAttribute('JOINTS_0', ac(le('JOINTS', Uint8Array), 'VEC4')).setAttribute('WEIGHTS_0', ac(le('WEIGHTS', Float32Array), 'VEC4'))
  .setAttribute('_REST', ac(le('REST', Float32Array), 'VEC3')).setAttribute('_MUSI', ac(le('MUSI', Uint8Array), 'VEC4')).setAttribute('_MUSW', ac(u16n(le('MUSW', Float32Array)), 'VEC4', true))
  .setAttribute('_FIBK', ac(le('FIBK', Float32Array), 'SCALAR')).setAttribute('_MUSP', ac(u16n(le('MUSP', Float32Array)), 'SCALAR', true)).setAttribute('_CAVITY', ac(i16n(le('CAVITY', Float32Array)), 'SCALAR', true));
const oi = prim.getIndices(); prim.setIndices(ac(le('T', Uint32Array), 'SCALAR')); oi.dispose();
const skin = root.listSkins()[0]; skin.getInverseBindMatrices().setArray((() => { const m = le('IBM', Float32Array), o = new Float32Array(m.length); for (let j = 0; j < m.length / 16; j++) for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) o[j * 16 + c * 4 + r] = m[j * 16 + r * 4 + c]; return o; })());
for (const n of root.listNodes()) { const k = n.getName().replace('mixamorig:', ''); if (meta.tl[k]) n.setTranslation(meta.tl[k]); if (n.getMesh()) { n.setExtras({ eyes: meta.eyes, fib: meta.fib }); n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]); } }
for (const a of root.listAnimations()) a.dispose();
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium', quantizePosition: 16, quantizeNormal: 12, quantizeGeneric: 16 }));
await io.write(process.argv[2], doc); console.log('gravado', fs.statSync(process.argv[2]).size);

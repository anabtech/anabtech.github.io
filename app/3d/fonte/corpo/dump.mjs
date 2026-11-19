import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(process.argv[2]); const root = doc.getRoot(); const out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
const mesh = root.listMeshes()[0], prim = mesh.listPrimitives()[0], info = { attrs: {}, extrasMesh: mesh.getExtras(), extrasPrim: prim.getExtras(), nodes: [], skin: null, anims: [] };
for (const sem of prim.listSemantics()) { const a = prim.getAttribute(sem); const n = a.getCount(), k = a.getElementSize(); const arr = new Float32Array(n * k); const el = []; for (let i = 0; i < n; i++) { a.getElement(i, el); for (let j = 0; j < k; j++) arr[i * k + j] = el[j]; } fs.writeFileSync(`${out}/${sem}.f32`, Buffer.from(arr.buffer)); info.attrs[sem] = { n, k, norm: a.getNormalized(), type: a.getComponentType() }; }
const idx = prim.getIndices(); fs.writeFileSync(`${out}/indices.u32`, Buffer.from(new Uint32Array(idx.getArray()).buffer)); info.tris = idx.getCount() / 3;
const nodes = root.listNodes(); nodes.forEach((n, i) => info.nodes.push({ i, name: n.getName(), t: n.getTranslation(), r: n.getRotation(), s: n.getScale(), parent: nodes.indexOf(n.getParentNode()), wm: n.getWorldMatrix(), extras: n.getExtras(), mesh: !!n.getMesh() }));
const skin = root.listSkins()[0]; info.skin = { joints: skin.listJoints().map(j => nodes.indexOf(j)), ibm: Array.from(skin.getInverseBindMatrices().getArray()) };
info.anims = root.listAnimations().map(a => ({ name: a.getName(), ch: a.listChannels().length, dur: Math.max(...a.listSamplers().map(s => { const t = s.getInput().getArray(); return t[t.length - 1]; })) }));
info.sceneExtras = root.listScenes()[0].getExtras(); info.rootExtras = root.getExtras();
fs.writeFileSync(`${out}/info.json`, JSON.stringify(info));
console.log(JSON.stringify({ attrs: info.attrs, tris: info.tris, anims: info.anims, extrasMesh: Object.keys(info.extrasMesh || {}), extrasPrim: Object.keys(info.extrasPrim || {}), nodeExtras: info.nodes.filter(n => Object.keys(n.extras || {}).length).map(n => [n.name, Object.keys(n.extras)]) }));

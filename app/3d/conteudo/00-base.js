/* AnabTech · conteúdo didático dos vídeos de execução
   Cada exercício tem: setup (passos de posicionamento), erros (erros comuns) e chave (o que lembrar).
   Passo: a = parte do corpo apontada · t = título · c = o que fazer · pq = por quê.
   Referências da estrutura: NSCA (posição inicial, fases, erros comuns, 5 pontos de apoio); frases curtas e específicas. */
window.CONTEUDO = window.CONTEUDO || {};
const P = {
  /* ---- base em pé ---- */
  pes_quadril: { a: 'pes', t: 'Pés na largura do quadril', c: 'Pés paralelos e o peso no <b>pé inteiro</b>: calcanhar, dedão e dedinho.', pq: 'Com a base estável, o esforço vai para o músculo e não para o equilíbrio.' },
  pes_ombros: { a: 'pes', t: 'Pés na largura dos ombros', c: 'Pontas um pouco para fora, entre <b>15 e 30°</b>. Peso no pé inteiro.', pq: 'Essa base deixa o quadril descer entre as pernas, com os joelhos na linha dos pés.' },
  joelhos_soltos: { a: 'joelhos', t: 'Joelhos destravados', c: 'Deixe os joelhos <b>levemente flexionados</b>, sem travar para trás.', pq: 'Joelho destravado absorve a carga e tira a pressão da lombar.' },
  abdomen: { a: 'abdomen', t: 'Abdômen travado', c: 'Puxe o ar pela barriga e <b>contraia o abdômen</b>, como se fosse levar um soco.', pq: 'A pressão dentro do abdômen sustenta a coluna debaixo da carga.' },
  abdomen_leve: { a: 'abdomen', t: 'Abdômen firme', c: 'Contraia o abdômen e mantenha as <b>costelas para baixo</b>, sem arquear a lombar.', pq: 'Tronco firme impede que o balanço do corpo roube o movimento.' },
  coluna_neutra: { a: 'lombar', t: 'Coluna neutra', c: 'Mantenha a curva natural da coluna, do pescoço ao quadril. <b>Sem arredondar</b>.', pq: 'Com a coluna neutra, a carga se distribui por igual nos discos.' },
  olhar: { a: 'olhos', t: 'Olhar à frente', c: 'Cabeça na linha da coluna, olhando para um <b>ponto fixo</b>.', pq: 'Cabeça neutra ajuda a manter a coluna inteira alinhada.' },
  ombros_baixos: { a: 'ombros', t: 'Ombros para baixo e para trás', c: 'Afaste os ombros das orelhas e <b>abra o peito</b>.', pq: 'Tira o trapézio superior do movimento e dá uma base firme para o braço.' },
  cotovelos_fixos: { a: 'cotovelos', t: 'Cotovelos ao lado do tronco', c: 'Cotovelos <b>parados</b> junto às costelas, do começo ao fim.', pq: 'Com o cotovelo fixo o músculo-alvo trabalha sozinho; se ele anda, o ombro ajuda.' },
  punhos_retos: { a: 'punhos', t: 'Punhos retos', c: 'Punho alinhado com o antebraço, sem dobrar para trás nem para a frente.', pq: 'Punho reto transmite a força sem sobrecarregar a articulação.' },
  /* ---- deitado no banco ---- */
  olhos_barra: { a: 'olhos', t: 'Olhos sob a barra', c: 'Deite com os olhos na linha da barra e a <b>cabeça apoiada</b> no banco.', pq: 'A barra sai do suporte sem bater nos ganchos e para sobre os ombros.', zoom: .6 },
  escapulas_banco: { a: 'escapulas', t: 'Escápulas juntas e para baixo', c: 'Aperte as escápulas uma contra a outra e puxe na direção do quadril. <b>Peito alto</b>.', pq: 'Escápulas retraídas reduzem a carga na articulação do ombro.', zoom: .62, el: 20 },
  pegada_15: { a: 'maos', t: 'Pegada até 1,5× a largura dos ombros', c: 'Mãos simétricas, <b>punhos retos</b> e a barra na base da palma.', pq: 'Pegadas mais abertas que isso aumentam a compressão no ombro.', zoom: .72 },
  pes_banco: { a: 'pes', t: 'Pés firmes no chão', c: 'Pés inteiros no chão, abaixo ou um pouco atrás dos joelhos. <b>Glúteos no banco</b>.', pq: 'A base firme deixa o tronco estável para empurrar.', zoom: .7 },
  apoios5: { a: 'apoios', t: 'Cinco pontos de apoio', c: '<b>Cabeça, costas altas, glúteos e os dois pés</b> em contato do começo ao fim.', pq: 'É o padrão de segurança para exercícios deitados no banco.', zoom: 1.02, puxa: .15 },
  halteres_peito: { a: 'maos', t: 'Halteres acima do peito', c: 'Braços estendidos, halteres na <b>linha dos ombros</b> e punhos retos.', pq: 'Sobre o ombro, o peso fica apoiado nos ossos e você começa estável.', zoom: .72 },
  /* ---- sentado ---- */
  costas_encosto: { a: 'tronco', t: 'Costas no encosto', c: 'Quadril no fundo do banco, <b>lombar e costas altas apoiadas</b>.', pq: 'O encosto segura o tronco e a força vai toda para o músculo-alvo.' },
  pes_apoiados: { a: 'pes', t: 'Pés apoiados', c: 'Pés inteiros no chão ou no apoio, afastados na largura do quadril.', pq: 'Pés firmes evitam que o corpo deslize ou balance durante a série.' },
  /* ---- dobradiça de quadril ---- */
  quadril_tras: { a: 'quadril', t: 'Quadril para trás', c: 'Empurre o quadril para trás como se fosse <b>fechar uma porta</b> com o glúteo.', pq: 'É o quadril que dobra, não a coluna: a carga vai para glúteos e posteriores.' },
  barra_canela: { a: 'pes', t: 'Barra sobre o meio do pé', c: 'Barra a um dedo da canela, <b>acima do cadarço</b>.', pq: 'Sobre o meio do pé, a barra sobe reta e perto do corpo.' },
  dorsal_firme: { a: 'escapulas', t: 'Costas armadas', c: 'Peito aberto e <b>axilas apertadas</b>, como se segurasse uma laranja debaixo de cada braço.', pq: 'O latíssimo contraído mantém a barra colada ao corpo e a coluna firme.' },
  /* ---- suspenso e solo ---- */
  maos_ombros_solo: { a: 'maos', t: 'Mãos embaixo dos ombros', c: 'Dedos abertos, apontando para a frente, e o <b>chão empurrado</b> para longe.', pq: 'Mão sob o ombro empilha as articulações e poupa os punhos.' },
  corpo_reto: { a: 'quadril', t: 'Corpo em linha reta', c: 'Cabeça, ombros, quadril e calcanhares <b>na mesma linha</b>. Glúteos contraídos.', pq: 'Sem a linha reta a lombar afunda e recebe a carga.' },
  lombar_chao: { a: 'lombar', t: 'Lombar no chão', c: 'Encoste a lombar no chão, <b>fechando o espaço</b> entre as costas e o colchonete.', pq: 'Assim o abdômen trabalha e os flexores do quadril não puxam a coluna.' },
  queixo_solto: { a: 'pescoco', t: 'Pescoço relaxado', c: 'Mantenha o espaço de <b>um punho</b> entre o queixo e o peito.', pq: 'Puxar a cabeça força o pescoço e não ajuda o abdômen.' },
  pegada_fixa: { a: 'maos', t: 'Pegada firme na barra', c: 'Segure com a mão inteira, <b>polegar em volta</b> da barra.', pq: 'A pegada fechada é mais segura e deixa a força chegar às costas.' },
  ombros_ativos: { a: 'ombros', t: 'Ombros ativos', c: 'Pendurado, puxe os <b>ombros para baixo</b>, longe das orelhas.', pq: 'Começar com as escápulas ativas protege o ombro e liga o dorsal.' }
};
const p = (id, mais) => { if (!P[id]) throw new Error('passo ' + id); return Object.assign({}, P[id], mais || {}); };
const s = (a, t, c, pq, mais) => Object.assign({ a, t, c, pq }, mais || {});
function E(slugs, setup, erros, chave, mais) { const o = Object.assign({ setup: setup.map(x => typeof x === 'string' ? p(x) : x), erros, chave }, mais || {}); String(slugs).split(' ').forEach(k => { window.CONTEUDO[k] = Object.assign({}, o, (mais && mais.por && mais.por[k]) || {}); }); }
const BARRA = { trilha: 'maos', trilhaNome: 'Caminho da barra' };

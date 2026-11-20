# Fontes do 3D dos vídeos de execução

- `viewer-pro.base.js`: motor 3D original (minificado) com a API do estúdio.
- `equip2.js`: equipamentos v2, pegada, contato com estofados e piso, luz.
- `montar.py`: junta os dois e grava `../viewer-pro.js`. Rodar depois de qualquer mudança em `equip2.js`.
- `corpo/`: como o corpo (`../models/Atleta2.glb`) é gerado a partir do MakeHuman/MPFB2 (dados CC0, https://github.com/makehumancommunity/mpfb2):
  `corpo1.py` (malha base + alvos de musculatura, subdividida), `corpo2.py` (esqueleto com as juntas do corpo novo e pesos),
  `corr.py` (correspondência de vértices com o corpo anterior, para levar a pintura dos músculos), `corpo3.py` (pintura, relevo, cavidades)
  e `escreve.mjs` (grava o GLB). `tudo.sh` roda a sequência. Os caminhos dentro dos scripts apontam para a pasta de trabalho onde foram criados.
- No estúdio: `?v2=0` mostra os equipamentos antigos e `?corpo=0` o corpo anterior.

## Como o corpo novo repete o movimento do anterior

Os exercícios foram coreografados para o corpo anterior (outras medidas de braço, mão, ombro e pé). Em cada quadro, o esqueleto anterior recebe a mesma pose,
invisível, e serve de referência (`?ref=0` desliga):

- mãos que partem do próprio corpo (halter, barra livre, cabo): o punho novo sai do ombro novo na mesma direção e com a mesma proporção de extensão do braço de referência (`__GR.punho`);
- mãos que vão a um ponto fixo (barra presa, apoio, chão): o corpo é que se ajusta. Mão no chão desliza; corpo apoiado nos pés ou nos joelhos gira em torno do apoio;
  corpo pendurado se desloca inteiro, com as pernas; no resto, a pelve se afasta na direção do braço (`W.prototype.pose`, bloco "alcance");
- pé na ponta: o tornozelo sobe e a pelve acompanha, para o joelho não dobrar a mais;
- tronco e cabeça nunca abaixo do piso (`piso()`), e ponta dos dedos também não (`__GR.piso`).

Tudo é resolvido dentro do quadro, sem depender do quadro anterior: é isso que evita tremor.

## Conferência (`conferencia/`)

Sobem a página local (`python3 -m http.server 8766` na raiz do site) e percorrem os 206 exercícios:
`salto.py` (pulos de um quadro para o outro, a 30 qps; `comp.py` compara com a mesma medida no 3D antigo, `?v2=0&corpo=0`),
`dif.py` (cotovelo e joelho contra a referência, quadro a quadro), `aud.py` (contato com estofados e piso), `cot.py` (extensão mínima e máxima),
`folha.py` (folhas de imagens para olhar) e `traco.py` (um exercício, quadro a quadro).

# Fontes do 3D dos vídeos de execução

- `viewer-pro.base.js`: motor 3D original (minificado) com a API do estúdio.
- `equip2.js`: equipamentos v2, pegada, contato com estofados e piso, luz.
- `montar.py`: junta os dois e grava `../viewer-pro.js`. Rodar depois de qualquer mudança em `equip2.js`.
- `corpo/`: como o corpo (`../models/Atleta2.glb`) é gerado a partir do MakeHuman/MPFB2 (dados CC0, https://github.com/makehumancommunity/mpfb2):
  `corpo1.py` (malha base + alvos de musculatura, subdividida), `corpo2.py` (esqueleto com as juntas do corpo novo e pesos),
  `corr.py` (correspondência de vértices com o corpo anterior, para levar a pintura dos músculos), `corpo3.py` (pintura, relevo, cavidades)
  e `escreve.mjs` (grava o GLB). `tudo.sh` roda a sequência. Os caminhos dentro dos scripts apontam para a pasta de trabalho onde foram criados.
- No estúdio: `?v2=0` mostra os equipamentos antigos e `?corpo=0` o corpo anterior.

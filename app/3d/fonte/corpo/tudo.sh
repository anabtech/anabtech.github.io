#!/bin/bash
# reconstrói o corpo do zero: base + alvos -> esqueleto -> pintura e relevo -> GLB
set -e; cd /home/claude/mh/build
python3 corpo1.py > c1.log; python3 corpo2.py > c2.log; python3 corr.py > cr.log; python3 corpo3.py > c3.log
grep ombros c2.log; tail -1 cr.log; head -1 c3.log
cd /home/claude/mh/gt && node escreve.mjs /home/claude/anabtech.github.io/app/3d/models/Atleta2.glb > e.log 2>&1; tail -1 e.log

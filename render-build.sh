#!/bin/bash

# Cria a pasta bin se não existir
mkdir -p bin

# Baixa e extrai o ffmpeg portátil
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar -xJ

# Move o binário do ffmpeg para a pasta bin
mv ffmpeg-*-amd64-static/ffmpeg bin/
mv ffmpeg-*-amd64-static/ffprobe bin/

# Dá permissão de execução
chmod +x bin/ffmpeg bin/ffprobe

pkill -f uvicorn

cd /var/www/dyfy/python/
nohup ./env/bin/uvicorn main:app --host 127.0.0.1 --port 8002 > output.log 2>&1 &


tail -f output.log

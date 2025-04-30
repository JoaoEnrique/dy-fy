import subprocess
from fastapi import FastAPI, Request, Query
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from yt_dlp import YoutubeDL
from urllib.parse import unquote
from pytube import YouTube
import io
# from yt_search_python import VideosSearch
import os
import uvicorn
import re

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cache = {}

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/download")
async def download(url: str, format: str = "video"):
    try:
        decoded_url = unquote(url)

        if format == "audio":
            yt_format = "bestaudio"
            extension = "mp3"
        else:
            yt_format = "best"
            extension = "mp4"

        # Comando yt-dlp para salvar no stdout
        command = [
            "yt-dlp",
            "--ffmpeg-location", "./bin",  # aponta para a pasta com o binário
            "-f", yt_format,
            "-o", "-",  # output para stdout
            decoded_url
        ]

        process = subprocess.Popen(command, stdout=subprocess.PIPE)

        return StreamingResponse(
            process.stdout,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename=video.{extension}"}
        )

    except Exception as e:
        return {"message": "Erro ao baixar o arquivo.", "error": str(e)}

# Roda localmente
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5001)

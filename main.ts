import path from 'path';
import fs from 'fs';
import ytdl, { downloadOptions, Filter } from '@distube/ytdl-core';
import ytSearch, { SearchResult } from 'yt-search';
import express, { Request, Response } from "express";
import cors from 'cors';
 
const app = express();
const port = 5000;

app.use(cors());

app.get("/", async (_req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

const cache: Map<string, any> = new Map();

app.get("/search", async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    res.status(400).send({ message: "Informe o termo da pesquisa." });
    return;
  }

  if (cache.has(query)) {
    console.log("Retornando resultado do cache.");
    res.json({ items: cache.get(query) });
    return;
  }

  try {
    const searchResults: SearchResult = await ytSearch(query);

    const videoData = searchResults.videos.slice(0, 5).map(video => ({
      url: video.url,
      id: {
        videoId: video.videoId
      },
      snippet: {
        thumbnails: {
          medium: {
            url: video.thumbnail
          }
        },
        title: video.title,
      }
    }));

    cache.set(query, videoData);
    setTimeout(() => cache.delete(query), 600000);

    res.json({ items: videoData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao realizar a pesquisa.", error: `${error}` });
  }
});

app.get("/download", async (req: Request, res: Response) => {
  const videoURL = req.query.url as string;
  const format = (req.query.format as string) || 'video';

  if (!videoURL) {
    res.status(400).send({ message: "URL do vídeo é obrigatória." });
    return;
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[\\/:*?"<>|]/g, '');
    const extension = format === 'audio' ? 'mp3' : 'mp4';
    const fileName = `${title}.${extension}`;
    const filePath = path.join(__dirname, fileName);

    const options: downloadOptions = format === 'audio' ? { filter: 'audioonly' as Filter, quality: 'highestaudio' } : {};
    const writeStream = fs.createWriteStream(filePath);
    const downloadStream = ytdl(videoURL, options);

    downloadStream.pipe(writeStream);

    writeStream.on("finish", () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
          res.status(500).send({ message: "Erro ao enviar o arquivo." });
        }

        fs.unlink(filePath, (err) => {
          if (err) console.error("Erro ao apagar o arquivo:", err);
          else console.log(`Arquivo ${fileName} apagado do servidor`);
        });

        fs.readdirSync('./').forEach(file => {
          if (file.endsWith('-script.js') || file.endsWith('.mp4') || file.endsWith('.mp3')) {
            const filePath = path.join('./', file);
            fs.unlink(filePath, err => {
              if (err) {
                console.error(`Erro ao apagar ${file}:`, err.message);
              } else {
                console.log(`Arquivo ${file} apagado`);
              }
            });
          }
        });
        
      });
    });

    writeStream.on("error", (err) => {
      console.error("Erro ao salvar:", err);
      res.status(500).send({ message: "Erro ao salvar o arquivo." });
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao baixar o arquivo." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

# Frontend em Dy Fy
Sistema para pesquisar e baixar vídeos do YouTube utilizando React e Node.

Hospedado na vercel: https://dy-fy.vercel.app

É possível pesquisar pela api do YouTube (Precisa de uma chave) ou pela API não oficial yt-search.

Para baixar os vídeos foi utilizado uma API não oficial do YouTube (@distube/ytdl-core)

![image](https://github.com/user-attachments/assets/c9eaa1d3-8d5b-460c-b1b1-9ee858bf8c4c)

## Tecnologias
- React JS
- Axios

## Instalação
Baixe o projeto
```cmd
git clone https://github.com/JoaoEnrique/dy-fy.git
```

Para rodar o projeto:
```cmd
cd dy-fy
npm install
npm start
```

# Ambiente
É possível pesquisar pela api do YouTube (Precisa de uma chave) ou pela API não oficial yt-search.

```bash
REACT_APP_YOUTUBE_API_KEY= # necessário apenas se REACT_APP_BACK_OR_YOUTUBE="youtube"
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_YOUTUBE_SEARCH_URL=https://www.googleapis.com/youtube/v3/search # necessário apenas se REACT_APP_BACK_OR_YOUTUBE="youtube"
REACT_APP_BACK_OR_YOUTUBE="back" #back pesquisa pela API não oficial. youtuber pesquisa pela API do YouTube
```
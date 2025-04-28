import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Arquivo de estilos
import { errorMessage } from './utils/messages';
import { BACK_OR_YOUTUBE, BACKEND_URL, YOUTUBE_API_KEY } from './utils/vars';
import { Video } from './utils/types';

function App() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);


  const handleSearch = async () => {
    const BASE_URL = BACK_OR_YOUTUBE === "back" ? `${BACKEND_URL}/search?query=${query}` : 'https://www.googleapis.com/youtube/v3/search';

    if (!query) return;
    setLoading(true);
    setError('');

    // Se detectar um link direto do YouTube
    if (query.includes('https://www.youtube.com/watch')) {
      const url = new URL(query);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        await handleDownload(videoId);
      } else {
        setError('URL inválida!');
      }
      setLoading(false);
      return;
    }

    let params = {};

    if(BACK_OR_YOUTUBE === "youtube"){
      params = {
        part: 'snippet',
        maxResults: 10,
        q: query,
        key: YOUTUBE_API_KEY,
      }
    }
    
    try {
      const response = await axios.get(BASE_URL, {params});

      setVideos(response.data.items || response.data);
    } catch (err) {
      const messageError = errorMessage(err);
      setError(messageError);
      console.error(err);
      console.error(messageError);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (videoId: string, format = 'video') => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
      const response = await axios.get(`${BACKEND_URL}/download?url=${encodeURIComponent(videoUrl)}&format=${format}`, {
        responseType: 'blob'
      });
  
      const blob = new Blob([response.data], { type: 'video/mp4' });
      // const blob = new Blob([response.data], { type: format === 'audio' ? 'audio/mpeg' : 'video/mp4' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // a.download = format === 'audio' ? 'audio.mp3' : 'video.mp4';
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
  
    } catch (err) {
      const messageError = errorMessage(err);
      setError(messageError);
      console.error(err);
      console.error(messageError);
    }
  };

  // Pegar query da URL na primeira vez que abrir
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('query');
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(); // já faz a busca automática
    }
  }, []);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.trim() !== '') {
        handleSearch();
        
        // Atualizar a URL
        const newUrl = `${window.location.pathname}?query=${encodeURIComponent(query)}`;
        window.history.pushState(null, '', newUrl);
      } else {
        // Se query for vazia, limpa a URL
        const newUrl = `${window.location.pathname}`;
        window.history.pushState(null, '', newUrl);
      }
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [query]);
  
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dy Fy</h1>
        <div className="search-bar">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Link para baixar ou pesquise"
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? 'Carregando...' : 'Pesquisar'}
            </button>

          </form>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="video-list">
        {videos.length > 0 ? (
          <ul>
            {videos.map((video: Video, index) => (
              <li key={index} className="video-item">
                <div className="video-thumbnail">
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title}/>
                </div>

                <div className="video-info">
                  <h2>{video.snippet.title}</h2>
                  {/* <p>{video.snippet.description}</p> */}

                  <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className="watch-link">
                    Assistir no YouTube
                  </a>
                  
                 
                </div>
                <div className='container-btn'>
                  <button onClick={() => handleDownload(video.id.videoId)} className="download-btn">
                      Baixar Vídeo
                    </button>

                    <button onClick={() => handleDownload(video.id.videoId, "audio")} className="download-btn">
                      Baixar Audio
                    </button>
                 </div>
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default App;

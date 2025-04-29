import { BackOrYoutube } from "./types";

export const BACKEND_SEARCH_URL = process.env.REACT_APP_BACKEND_SEARCH_URL || "http://localhost:5000";
export const BACKEND_DOWNLOAD_URL = process.env.REACT_APP_BACKEND_DOWNLOAD_URL || BACKEND_SEARCH_URL;
export const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || "http://localhost:5000";
export const YOUTUBE_SEARCH_URL = process.env.REACT_APP_YOUTUBE_SEARCH_URL || "https://www.googleapis.com/youtube/v3/search";
export const BACK_OR_YOUTUBE: BackOrYoutube = (process.env.REACT_APP_BACK_OR_YOUTUBE as BackOrYoutube) || "back";

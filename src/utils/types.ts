export type BackOrYoutube = "youtube" | "back";

export type Video = {
    id: {
      videoId: string
    },
    snippet: {
      thumbnails: {
        medium: {
          url: string
        }
      },
      title: string,
    }
}

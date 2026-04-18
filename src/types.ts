export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: number;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPlaying: boolean;
}

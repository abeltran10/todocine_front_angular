export interface UsuarioMovie {
  username: string;
  movieId: number;
  vista: boolean;
  favoritos: boolean;
  voto: number | null;
}
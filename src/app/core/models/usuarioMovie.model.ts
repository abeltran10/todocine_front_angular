export interface UsuarioMovie {
  usuarioId: number;
  movieId: number;
  vista: boolean;
  favoritos: boolean;
  voto: number | null;
}
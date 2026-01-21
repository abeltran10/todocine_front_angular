export interface UsuarioMovie {
  usuarioId: number;
  movieId: string;
  vista: boolean;
  favoritos: boolean;
  voto: number | null;
}
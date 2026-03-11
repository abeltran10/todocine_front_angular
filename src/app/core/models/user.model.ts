export interface User {
  id: number;
  username: string;
  password?: string | null;
  rol: string;
}
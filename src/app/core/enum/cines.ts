export type CinesKey = 1 | 2;

export interface Cine {
  id: number;
  name: string;
  url: string;
}

const CINES: Record<CinesKey, Cine> = {
   1: {id: 1, name: 'Cinesa', url: 'https://www.cinesa.es/'},
   2: {id: 2, name: 'Cines Sucre', url: 'https://www.sucrecines.com/'}
};

export const Cines = {
  getValues(): Cine[] {
    return Object.values(CINES);
  },

  getCine(key: CinesKey): Cine {
    return CINES[key];
  }
 
};
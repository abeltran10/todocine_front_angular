export type CinesKey = 1 | 2 | 3;

export interface Cine {
  id: number;
  name: string;
  url: string;
  region: string;
}

const CINES: Record<CinesKey, Cine> = {
   1: {id: 1, name: 'Cinesa', url: 'https://www.cinesa.es/', region: 'ES'},
   2: {id: 2, name: 'Cines Sucre', url: 'https://www.sucrecines.com/', region: 'ES'},
   3: {id: 3, name: 'AMC Theatres', url: 'https://www.amctheatres.com/', region: 'US'}
};

export const Cines = {
  getValues(): Cine[] {
    return Object.values(CINES);
  },

  getCine(key: CinesKey): Cine {
    return CINES[key];
  },

  getCinesByRegion(region: string) : Cine[] {
    return Object.values(CINES).filter(cine => cine.region === region);
  }
 
};
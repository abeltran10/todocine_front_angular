export type AwardKey = '1' | '2';

export interface Award {
  id: number;
  award: string;
  anyos: number[];
}

const AWARDS: Record<AwardKey, Award> = {
   '1': {id: 1, award: 'Goya', anyos: [2024, 2025]},
   '2': {id: 2, award: 'Globos de oro', anyos: [2026]}
};

export const Awards = {
  getValues(): Award[] {
    return Object.values(AWARDS);
  },

  getAwards(key: AwardKey): Award {
    return AWARDS[key];
  }
};
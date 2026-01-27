export type RegionKey = 'ES' | 'US';

export interface Region {
  id: number;
  code: string;
  name: string;
}

const REGIONS: Record<RegionKey, Region> = {
  'ES': { id: 0, code: 'ES', name: 'España' },
  'US': { id: 1, code: 'US', name: 'USA' }
};

export const Regions = {
  getValues(): Region[] {
    return Object.values(REGIONS);
  },

  getRegion(key: RegionKey): Region {
    return REGIONS[key];
  }
};

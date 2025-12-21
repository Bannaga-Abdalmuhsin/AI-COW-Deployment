import { ParsedCOWAsset, ParsedMovement } from "./dataParser";

export interface DataStore {
  cowAssets: ParsedCOWAsset[];
  movements: ParsedMovement[];
  lastUpdated: string;
  importSource: "sample" | "uploaded" | null;
}

const STORAGE_KEY = "cow_deployment_data";

export const DataStoreManager = {
  getStoreFromLocalStorage(): DataStore {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : { cowAssets: [], movements: [], lastUpdated: "", importSource: null };
    } catch {
      return { cowAssets: [], movements: [], lastUpdated: "", importSource: null };
    }
  },

  saveStoreToLocalStorage(store: DataStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  },

  importCOWAssets(
    assets: ParsedCOWAsset[],
    source: "sample" | "uploaded"
  ): void {
    const store = this.getStoreFromLocalStorage();
    store.cowAssets = assets;
    store.lastUpdated = new Date().toISOString();
    store.importSource = source;
    this.saveStoreToLocalStorage(store);
  },

  importMovements(movements: ParsedMovement[], source: "sample" | "uploaded"): void {
    const store = this.getStoreFromLocalStorage();
    store.movements = movements;
    store.lastUpdated = new Date().toISOString();
    store.importSource = source;
    this.saveStoreToLocalStorage(store);
  },

  getCOWAssets(): ParsedCOWAsset[] {
    const store = this.getStoreFromLocalStorage();
    return store.cowAssets;
  },

  getMovements(): ParsedMovement[] {
    const store = this.getStoreFromLocalStorage();
    return store.movements;
  },

  clearStore(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getLastUpdated(): string {
    const store = this.getStoreFromLocalStorage();
    return store.lastUpdated;
  },

  getImportSource(): "sample" | "uploaded" | null {
    const store = this.getStoreFromLocalStorage();
    return store.importSource;
  },
};

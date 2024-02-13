import { createStorage, StorageType } from '@src/shared/storages/base';
const storage = createStorage('theme-storage-key', 'light', {
  storageType: StorageType.Local,
  liveUpdate: true
});
const exampleThemeStorage = {
  ...storage,
  // TODO: extends your own methods
  toggle: async () => {
    await storage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  }
};
export default exampleThemeStorage;
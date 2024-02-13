import initReloadClient from '../initReloadClient';

export default function addHmrIntoScript(watchPath: string) {
  const reload = () => {
    chrome.runtime.reload();
  };

  initReloadClient({
    watchPath,
    onUpdate: reload,
    onForceReload: reload,
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('onUpdated', tabId, changeInfo, tab);
  });

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    console.log('onActivated', tab);
  });
}

import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loadeds');

chrome.tabs.onActivated.addListener(tab => {
  console.log(tab, 'tabOnUpdated');
  chrome.tabs.get(tab.tabId, tab => {
    const urlName = '' + tab.url;
    const initUrl = '' + tab.pendingUrl;
    console.log(urlName);
    if (urlName.includes('youtube') || initUrl.includes('youtube')) {
      const title = 'javascript - react - Stack Overflow and 6 more pages - Personal - Microsoft​ Edge';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      chrome.tabs.sendMessage(tab.id, { title: title }, function (response) {});
    }
  });
});

// async function getCurrentTab() {
//   const queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   const [tab] = await chrome.tabs.query(queryOptions);
//   const urlName = '' + tab.url;
//   const initUrl = '' + tab.pendingUrl;
//   console.log(tab, 'tabinini');

//   if (urlName.toLowerCase().includes('youtube') || initUrl.toLowerCase().includes('youtube')) {
//     const title = 'index.ts - nuva (Workspace) - Visual Studio Code';
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     chrome.tabs.sendMessage(tab.id, { title: title }, function (response) {});
//   }
// }

// chrome.tabs.onUpdated.addListener(getCurrentTab);

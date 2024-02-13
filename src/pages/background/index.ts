import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loadeds');

const KEYWORDS = ['youtube', 'anime', 'manga', 'aniwave'];

const DUMMY_FCK = [
  'nTrac Ubuntu Private Server',
  'Chat | Tracking System | Microsoft Teams',
  'GitHub — Firefox Developer Edition',
  'MySQL Workbench',
  '*new 4 - Notepad++ [Administrator]',
  'Tickets - Katalyst Software Services @ katalyst.raiseaticket.com and 1 more page - Work - Microsoft​ Edge',
  'Newest reactjs Questions - Stack Overflow',
  'Introduction - shadcn/ui',
];

chrome.tabs.onActivated.addListener(tab => {
  chrome.tabs.get(tab.tabId, tab => {
    const urlName = '' + tab.url;
    const initUrl = '' + tab.pendingUrl;

    KEYWORDS.forEach(keyword => {
      if (urlName.includes(keyword) || initUrl.includes(keyword)) {
        const title = DUMMY_FCK[Math.floor(Math.random() * DUMMY_FCK.length)];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        chrome.tabs.sendMessage(tab.id, { title: title }, function (response) {});
      }
    });
  });
});

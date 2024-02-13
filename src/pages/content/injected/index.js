/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * DO NOT USE import someModule from '...';
 *
 * @issue-url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
 *
 * Chrome extensions don't support modules in content scripts.
 * If you want to use other modules in content scripts, you need to import them via these files.
 *
 */
import('@pages/content/injected/toggleTheme');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log({ sender });
  /* custom title */
  if (request.title) {
    document.title = request.title;
  }
});
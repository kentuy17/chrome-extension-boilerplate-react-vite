try {
  chrome.devtools.panels.create('Dev Tools', 'icon-34.png', 'src/pages/panel/index.html');
  chrome.devtools.network.onNavigated.addListener((event) => {
    console.log(event, 'event s');
  })

  chrome.runtime.onMessage.addListener(function (request) {
    /* custom title */
    console.log(request);
    if (request.title) {
      document.title = request.title;
    }
  })
} catch (e) {
  console.error(e);
}
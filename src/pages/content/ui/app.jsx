import { useEffect } from 'react';
export default function App() {
  useEffect(() => {
    console.log('content view loaded jsx');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log(request, sender);
      /* custom title */
      if (request.title) {
        document.title = request.title;
      }
    });
  }, []);
  return <div className=""></div>;
}

function EncryptPage() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    gotTab
  );
}

function gotTab(tabs) {
  console.log('in got tab');
  let msg = 'it works';
  let decalation = document.getElementById('kinput').value;
  chrome.tabs.sendMessage(tabs[0].id, { action: 1, decalation });
}

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log(request);
});

document
  .getElementById('Switchy')
  .addEventListener('click', EncryptPage);

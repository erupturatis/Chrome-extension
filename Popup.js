// exports.Toggle = ChangeToggle;

console.log('ran extension');

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
  chrome.tabs.sendMessage(tabs[0].id, { action: 1 });
}

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log(request);
});
// function Toggle() {
//   Toggleing();
// }
document
  .getElementById('Switchy')
  .addEventListener('click', EncryptPage);

// exports.Toggle = ChangeToggle;

console.log('ran extension');
chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  gotTab
);
function gotTab(tabs) {
  console.log('in got tab');
  let msg = 'it works';
  chrome.tabs.sendMessage(tabs[0].id, msg);
}
// function Toggle() {
//   Toggleing();
// }
// document.getElementById('Switchy').addEventListener('click', Toggle);

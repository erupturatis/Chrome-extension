console.log('Here in content');

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
});

function changeDOM() {
  // THIS IS THE SUPID SOLUTION, BETTER IGNORE
  let originalHTML = document.body.innerHTML;
  let modifiedHTML = '';
  let shouldChange = true; // whether or not the current character should be changed
  let specialChar = false;
  let lastTag = '';
  let currentTag = '';
  let finishedTag = false;
  let blackListedTags = ['style', 'script'];
  let blackListedWebsites = ['youtube'];
  let link = window.location.href;
  for (element of blackListedWebsites) {
    if (link.includes(element)) {
      console.log('skipped page');
      return;
    }
  }

  for (element of originalHTML) {
    //it should change only the text outside the tags
    if (element === '<') {
      shouldChange = false;
    }
    if (element === '>' && shouldChange === false) {
      shouldChange = true;
      finishedTag = false;
    }

    if (element === '\\') {
      // we need to check \n and things like that
      specialChar = true;
    }

    if (
      shouldChange &&
      !specialChar &&
      isLetter(element) &&
      !blackListedTags.includes(lastTag)
    ) {
      // text character that should be encrypted
      modifiedHTML = modifiedHTML + encode(element);
    } else {
      modifiedHTML = modifiedHTML + element;
    }
    if (specialChar === true && isLetter(element)) {
      specialChar = false;
    }
    if (!shouldChange) {
      //storing the last tag to avoid changing the style
      if (element !== '<' && element !== '>') {
        if (element !== ' ' && !finishedTag) {
          if (element !== '/') {
            currentTag = currentTag + element;
          }
        } else {
          finishedTag = true;
        }
      }
    } else {
      if (currentTag !== '') {
        //console.log(currentTag);
        finishedTag = false;
        if (lastTag !== currentTag) {
          lastTag = currentTag;
        } else {
          lastTag = '';
        }
        currentTag = '';
      }
    }
  }
  document.body.innerHTML = modifiedHTML;
}

function isLetter(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

const replaceOnDocument = (
  replacer,
  { target = document.body } = {}
) => {
  [
    target,
    ...target.querySelectorAll(
      '*:not(script):not(noscript):not(style)'
    ),
  ].forEach(({ childNodes: [...nodes] }) =>
    nodes
      .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
      .forEach((textNode) => {
        textNode.textContent = replacer(textNode.textContent);
      })
  );
};

function encode(Text) {
  let newText = '';
  for (let char of Text) {
    let modifiedChar = char;
    let code = modifiedChar.charCodeAt(0);
    modifiedChar = String.fromCharCode(code);
    if (isLetter(char)) {
      newText = newText + modifiedChar;
    } else {
      newText = newText + char;
    }
  }
  return newText;
}

window.onload = function () {
  replaceOnDocument(encode);
};
window.onhashchange = function () {
  replaceOnDocument(encode);
};

function ReplaceText() {
  replaceOnDocument(encode);
}
let toggle = true;
function ChangeToggle() {
  toggle = !toggle;
  if (toggle) {
    ReplaceText();
  }
  console.log('working toggle');
}

if (toggle) {
  ReplaceText();
}

// exports.Toggle = ChangeToggle;

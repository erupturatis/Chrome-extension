let toggle = false;
let k = 1;

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.action === 1) {
    ReplaceText(request.decalation);
  } else {
    console.log(request);
  }
  //ChangeToggle();
  //chrome.runtime.sendMessage({ toggle });
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
    modifiedChar = String.fromCharCode(code + k);
    if (char >= 'A') {
      newText = newText + modifiedChar;
    } else {
      newText = newText + char;
    }
  }
  return newText;
}

function ReplaceText(decalation) {
  k = parseInt(decalation);
  console.log(k);
  console.log(typeof k);

  replaceOnDocument(encode);
}

if (toggle) {
  window.onload = function () {
    ReplaceText();
  };
}

// exports.Toggle = ChangeToggle;

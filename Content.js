let originalHTML = document.body.innerHTML;
let modifiedHTML = "";
let shouldChange = true;
let specialChar = false;

function isLetter(char) {
  return (
    (element >= "a" && element <= "z") || (element >= "A" && element <= "Z")
  );
}

for (element of originalHTML) {
  //it should change only the text outside the tags
  if (element === "<") {
    shouldChange = false;
  }
  if (element === ">" && shouldChange === false) {
    shouldChange = true;
  }

  if (element === "\\") {
    // we need to check \n and things like that
    specialChar = true;
  }

  if (shouldChange && !specialChar && isLetter(element)) {
    modifiedHTML = modifiedHTML + "s";
  } else {
    modifiedHTML = modifiedHTML + element;
  }
  if (specialChar === true && isLetter(element)) {
    specialChar = false;
  }
}

document.body.innerHTML = modifiedHTML;

// function encode()

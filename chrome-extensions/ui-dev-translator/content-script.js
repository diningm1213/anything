chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //   console.log(
  //     sender.tab
  //       ? "from a content script:" + sender.tab.url
  //       : "from the extension"
  //   );

  //   if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
  console.log(request.selector);
  const type = request.type;

  if (type === "select") {
    const selector = request.selector;
    const element = document.querySelectorAll(selector)[0];
    const innerText = element.innerText;

    sendResponse({ text: innerText });
  } else if (type === "translate") {
    const selector = request.selector;
    const translatedText = request.translatedText;
    const element = document.querySelectorAll(selector)[0];
    const dupNode = element.cloneNode(true);
    dupNode.innerText = translatedText;
    element.appendChild(dupNode);
  }
});

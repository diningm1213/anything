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
    const elements = document.querySelectorAll(selector);
    sendResponse({ texts: [...elements].map((element) => element.innerText) });
  } else if (type === "translate") {
    console.log({ request });
    const selector = request.selector;
    const translatedText = request.translatedText;
    const index = request.index;

    const elements = document.querySelectorAll(selector);
    const element = elements[index * 2];

    const dupNode = element.cloneNode(true);
    dupNode.innerText = translatedText;
    element.appendChild(dupNode);
  }
});

import key from "./key.json" assert { type: "json" };

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const button = document.getElementById("button");

button.addEventListener("click", async () => {
  const selector = document.getElementById("selector");

  let tab = await getCurrentTab();

  tab &&
    chrome.tabs.sendMessage(
      tab.id,
      { type: "select", selector: selector.value },
      async function (response) {
        const texts = response.texts;
        texts.forEach(async (text, index) => {
          let translatedText = localStorage.getItem(text);

          if (!translatedText) {
            const api_url =
              "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation";
            const payload = new URLSearchParams({
              source: "en",
              target: "ko",
              text,
            });

            const options = {
              method: "POST",
              body: payload,
              headers: {
                "X-NCP-APIGW-API-KEY-ID": key.client_id,
                "X-NCP-APIGW-API-KEY": key.client_secret,
              },
            };

            const res = await fetch(api_url, options);
            const { message } = await res.json();
            console.log(res, message);
            translatedText = message.result.translatedText;

            localStorage.setItem(text, translatedText);
          }

          tab &&
            chrome.tabs.sendMessage(
              tab.id,
              {
                type: "translate",
                selector: selector.value,
                index,
                translatedText,
              },
              function (response) {
                console.log(response);
              }
            );
        });
      }
    );
  // tab &&
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: translateSelector,
  //     args: [selector.value],
  //     // {'client_id': key.client_id, 'client_secret': key.client_secret}]
  //   });
});

function translateSelector(selector, key) {
  // document.querySelectorAll(selector).forEach(element => {
  //     const dupNode = element.cloneNode(true);
  //     element.appendChild(dupNode);
  // });
  // const query = '번역할 문장을 입력하세요.';

  const element = document.querySelectorAll(selector)[0];
  const dupNode = element.cloneNode(true);
  const innerText = dupNode.innerText;
}

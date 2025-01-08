const { Builder, By, Key, until } = require("selenium-webdriver");
require("dotenv").config();
const course = "react_gg";
const courseData = require(`./json/${course}.json`);
const fs = require("fs");
const axios = require("axios");
const path = require("path");

// 랜덤 딜레이 함수
function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min; // 랜덤 밀리초 계산
  return new Promise((resolve) => setTimeout(resolve, delay)); // Promise로 반환
}

// 폴더가 없으면 생성
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true }); // 재귀적으로 폴더 생성
}

const run = async () => {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(`https://ui.dev/login`);
    const idInput = await driver.findElement(By.css("#email-address"));
    await idInput.sendKeys(process.env.UIDEV_EMAIL);
    const passwordInput = await driver.findElement(By.css("#password"));
    await passwordInput.sendKeys(process.env.UIDEV_PASSWORD);
    const loginButton = await driver.findElement(
      By.css(
        "#__next > div.relative > div > div > form > div:nth-child(3) > button"
      )
    );
    await loginButton.click();
    // 로그인 완료 대기
    await randomDelay(10000, 20000); // 10~20초 랜덤 대기

    for (let i = 0; i < courseData.length; i++) {
      const { title, hrefList } = courseData[i];

      for (let j = 0; j < hrefList.length; j++) {
        const href = hrefList[j];

        await driver.get(href); // URL 이동
        await randomDelay(10000, 20000); // 10~20초 랜덤 대기

        // 페이지 HTML 가져오기
        const pageSource = await driver.getPageSource();
        const getNumber = (n) => String(n).padStart(2, "0");

        // 파일로 저장
        const filename = `./react_gg/${getNumber(i)}_${title}/${getNumber(
          j
        )}_${href.split("/").pop()}.html`;
        ensureDirectoryExistence(filename);
        fs.writeFileSync(filename, pageSource, "utf-8");
        console.log(`${filename} 저장 완료`);

        // CSS 파일 다운로드
        const cssUrls = await driver.executeScript(() => {
          const links = Array.from(
            document.querySelectorAll('link[rel="stylesheet"]')
          );
          return links.map((link) => link.href);
        });

        for (const cssUrl of cssUrls) {
          try {
            const response = await axios.get(cssUrl);
            const cssFilename = `./react_gg/${getNumber(
              i
            )}_${title}/${path.basename(cssUrl)}`;
            ensureDirectoryExistence(cssFilename);
            fs.writeFileSync(cssFilename, response.data, "utf-8");
            console.log(`CSS 파일 저장 완료: ${cssFilename}`);
          } catch (err) {
            console.error(`CSS 다운로드 실패: ${cssUrl}`, err.message);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

run();

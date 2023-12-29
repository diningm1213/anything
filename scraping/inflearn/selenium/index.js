const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

const LECTURE_COURSE = "functional-es6";
require("dotenv").config();

const run = async () => {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(`https://www.inflearn.com/course/${LECTURE_COURSE}`);

    // 로그인
    const signInButton = await driver.findElement(
      By.css(
        "#header > nav > div.container.desktop_container > div > div.navbar-menu > div.navbar-right > div.navbar-item.buttons > button.button.space-inset-4.signin"
      )
    );
    await signInButton.click();
    const emailInput = await driver.findElement(
      By.css("#root > div.modal > article > form > div > input")
    );
    await emailInput.sendKeys(process.env.INFLEARN_EMAIL);

    const passwordInput = await driver.findElement(
      By.css("#root > div.modal > article > form > div > div > input")
    );
    await passwordInput.sendKeys(process.env.INFLEARN_PASSWORD);

    const loginButton = await driver.findElement(
      By.css("#root > div.modal > article > form > button")
    );
    await loginButton.click();

    await driver.manage().setTimeouts({ implicit: 2000 });

    /**
     * 강의 예시 목록
     * 1-1  : #curriculum > div.cd-curriculum__content > div > div:nth-child(1) > div.cd-accordion__unit-cover > a:nth-child(1)
     * 2-1  : #curriculum > div.cd-curriculum__content > div > div:nth-child(2) > div.cd-accordion__unit-cover > a:nth-child(1)
     * 11-1 : #curriculum > div.cd-curriculum__content > div > div:nth-child(11) > div.cd-accordion__unit-cover > a:nth-child(1)
     */

    // one base index
    const section = 1;
    const unit = 2;

    await driver.manage().setTimeouts({ implicit: 5000 });

    const lecture = await driver.findElement(
      By.css(
        `#curriculum > div.cd-curriculum__content > div > div:nth-child(${section}) > div.cd-accordion__unit-cover > a:nth-child(${unit})`
      )
    );

    // 자바스크립트 명령어를 이용하여 클릭
    await driver.executeScript("arguments[0].click();", lecture);

    // 강의 스크립트 가져오기
    while (true) {
      const delay = Math.random() * 3000 + 3000;
      await driver.manage().setTimeouts({ implicit: delay });
      await getLectureScript(driver);
      await driver.manage().setTimeouts({ implicit: delay });

      const nextButton = await driver.findElement(
        By.css(
          "#root > main > div > footer > div > div > button.mantine-UnstyledButton-root.mantine-Button-root.mantine-c5w2vi"
        )
      );
      await nextButton.click();
      await driver.manage().setTimeouts({ implicit: delay });
    }
  } catch (e) {
    console.log(e);
  } finally {
    // driver.quit();
  }
};

const getLectureScript = async (driver) => {
  const scriptButton = await driver.findElement(
    By.css("#root > div.css-axirao > ul > li:nth-child(5) > button")
  );
  await scriptButton.click();

  try {
    const acceptButton = await driver.findElement(
      By.css(
        "#root > aside.react-draggable.css-z4ycl5 > div:nth-child(5) > div > div.mantine-Modal-inner.mantine-Modal-inner.mantine-zut3ou > section > footer > div > button"
      )
    );

    if (acceptButton) {
      await acceptButton.click();
    }
  } catch (error) {
    console.log(error);
  }

  const courseTitle = await driver.findElement(
    By.css("#root > main > div > header > div.css-1ok7bvp > p")
  );
  const courseTitleText = await courseTitle
    .getText()
    .then((text) => text.trim());

  // 스크립트를 가져오면서 위치 이동
  let index = 1;
  let scripts = "";
  while (true) {
    try {
      const timeEl = await driver.findElement(
        By.css(
          `#root > aside.react-draggable.css-z4ycl5 > div.List.css-zvuxhh > div > div > div > div > div:nth-child(${index}) > div > div > span`
        )
      );

      const scriptEl = await driver.findElement(
        By.css(
          `#root > aside.react-draggable.css-z4ycl5 > div.List.css-zvuxhh > div > div > div > div > div:nth-child(${index}) > div > p`
        )
      );

      if (!timeEl.isDisplayed || !scriptEl.isDisplayed) {
        saveScripts(LECTURE_COURSE, courseTitleText, scripts);
        break;
      }

      const time = await timeEl.getText().then((text) => text.trim());
      const script = await scriptEl.getText().then((text) => text.trim());
      driver.executeScript("arguments[0].scrollIntoView(true);", timeEl);
      await driver.manage().setTimeouts({ implicit: 200 });

      scripts += `${time} ${script}\n`;
      index++;
    } catch (error) {
      saveScripts(LECTURE_COURSE, courseTitleText, scripts);
      console.log(error);
      break;
    }
  }
};

const saveScripts = (course, title, scripts) => {
  const folderPath = path.join(__dirname, `lecture/${course}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, `${title.replace(/\//g, "")}.txt`);
  fs.writeFileSync(filePath, scripts);
  console.log(`saved ${filePath}`);
};

run();

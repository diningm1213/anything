const { Builder, By, Key, until } = require("selenium-webdriver");
require("dotenv").config();

const run = async () => {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://www.inflearn.com/course/functional-es6");

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

    const scriptButton = await driver.findElement(
      By.css("#root > div.css-axirao > ul > li:nth-child(5) > button")
    );
    await scriptButton.click();

    const acceptButton = await driver.findElement(
      By.css(
        "#root > aside.react-draggable.css-z4ycl5 > div:nth-child(5) > div > div.mantine-Modal-inner.mantine-Modal-inner.mantine-zut3ou > section > footer > div > button"
      )
    );

    if (acceptButton) {
      await acceptButton.click();
    }

    // 스크립트를 가져오면서 위치 이동
    let index = 1;
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
          break;
        }

        const time = await timeEl.getText().then((text) => text.trim());
        const script = await scriptEl.getText().then((text) => text.trim());
        driver.executeScript("arguments[0].scrollIntoView(true);", scriptEl);

        console.log(time, script);
        index++;
      } catch (error) {
        console.log(error);
        break;
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    // driver.quit();
  }
};

run();

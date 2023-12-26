const { Builder, By, Key, until } = require("selenium-webdriver");
require("dotenv").config();

const run = async () => {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // 특정 URL 생성
    await driver.get("https://www.inflearn.com/course/functional-es6");

    let userAgent = await driver.executeScript("return navigator.userAgent;");
    console.log("[UserAgent]", userAgent);
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
  } catch (e) {
    console.log(e);
  } finally {
    // driver.quit();
  }
};

run();

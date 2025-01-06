const { Builder, By, Key, until } = require("selenium-webdriver");
const { lotto } = require("../../../lotto");
require("dotenv").config();

const run = async () => {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(
      `https://dhlottery.co.kr/gameInfo.do?method=buyLotto&wiselog=C_A_1_3`
    );

    const signinButton = await driver.findElement(
      By.css(
        "body > div:nth-child(1) > header > div.header_con > div.top_menu > form > div > ul > li.log > a"
      )
    );

    await signinButton.click();
    const idInput = await driver.findElement(By.css("#userId"));
    await idInput.sendKeys(process.env.LOTTO_ID);
    const passwordInput = await driver.findElement(
      By.css(
        "#article > div:nth-child(2) > div > form > div > div.inner > fieldset > div.form > input[type=password]:nth-child(2)"
      )
    );
    await passwordInput.sendKeys(process.env.LOTTO_PASSWORD);

    const loginButton = await driver.findElement(
      By.css(
        "#article > div:nth-child(2) > div > form > div > div.inner > fieldset > div.form > a"
      )
    );
    await loginButton.click();

    await driver.manage().setTimeouts({ implicit: 2000 });

    const purchaseButton = await driver.findElement(
      By.css(
        "#article > div:nth-child(2) > div > div.box_summury_game > div.btns > a.btn_common.lrg.blu"
      )
    );
    await purchaseButton.click();

    await driver.manage().setTimeouts({ implicit: 2000 });

    const windows = await driver.getAllWindowHandles();
    await driver.switchTo().window(windows[1]);

    const lottoList = lotto(5);

    lottoList.forEach(async (lotto) => {
      lotto.forEach(async (num) => {
        const numLabel = await driver.findElement(
          By.css(`#checkNumGroup > label:nth-child(${num * 2 + 1})`)
        );
        console.log(numLabel);
        await driver.manage().setTimeouts({ implicit: 2000 });
      });
    });
  } catch (error) {}
};

run();

console.log(lotto(5));

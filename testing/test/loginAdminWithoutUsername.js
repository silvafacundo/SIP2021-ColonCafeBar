const {Builder, By, Key, until} = require("selenium-webdriver");
const assert = require('assert');
const url = "https://backend-silvafacundo.cloud.okteto.net/admin";


async function loginAdminWithoutUsername() {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get(url);
    await driver.findElement(By.name("password"))
        .sendKeys("12345");
    await driver.findElement(By.css("form > button")).click();
        try {
            let text = new RegExp('Error: username is required!');
            await driver.wait(
                 until.elementTextMatches(
                     driver.findElement(By.css('p.error'))
                     ,text));
            let element = await driver.findElement(By.css('p.error')).getAttribute('textContent');
            console.log(element);
            driver.close();
        } catch (error) {
            console.log('Something was wrong!')
        }
}

loginAdminWithoutUsername();
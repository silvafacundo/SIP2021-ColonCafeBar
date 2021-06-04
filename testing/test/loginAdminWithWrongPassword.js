const {Builder, By, Key, until} = require("selenium-webdriver");
const assert = require('assert');
const url = "https://backend-silvafacundo.cloud.okteto.net/admin";

async function loginAdminWithWrongPassword() {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get(url);
    await driver.findElement(By.name("username"))
        .sendKeys("admin");
    await driver.findElement(By.name("password"))
        .sendKeys("123456");
    await driver.findElement(By.css("form > button")).click();
        try {
            await driver.wait(
                 until.elementTextMatches(
                     driver.findElement(By.css('p.error'))
                     ,new RegExp('Error: Invalid user or password')));
            let element = await driver.findElement(By.css('p.error')).getAttribute('textContent');
            console.log(element);
            driver.close();
        } catch (error) {
            console.log('Something was wrong!')
        }
}

loginAdminWithWrongPassword();
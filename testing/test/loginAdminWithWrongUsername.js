const {Builder, By, Key, until} = require("selenium-webdriver");
const url = "https://backend-silvafacundo.cloud.okteto.net/admin";

async function loginAdminWithWrongUsername() {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get(url);
    await driver.findElement(By.name("username"))
        .sendKeys("administrador");
    await driver.findElement(By.name("password"))
        .sendKeys("12345");
    await driver.findElement(By.css("form > button")).click();
        try {
            let text = new RegExp('Error: Invalid user or password');
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

loginAdminWithWrongUsername();
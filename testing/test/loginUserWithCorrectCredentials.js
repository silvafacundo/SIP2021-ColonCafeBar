const {Builder, By, Key, until} = require("selenium-webdriver");
const url = "https://backend-silvafacundo.cloud.okteto.net/login";

async function loginUserWithCorrectCredentials() {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get(url);
    await driver.findElement(By.name("email"))
        .sendKeys("prueba@gmail.com");
    await driver.findElement(By.name("password"))
        .sendKeys("Probando123");
    await driver.findElement(By.css("form > button")).click();
        try {
            await driver.wait(
                until.elementLocated(
                    By.css('input.input')),10000);
            let script = 'a = window.localStorage.getItem("client-auth-token")';
            await driver.executeScript(script);
            script = '(a!=null)?alert("login ok"):alert("Something was wrong")';
            await driver.executeScript(script);
        } catch (error) {
            console.log('Something was wrong!');
        }
}

loginUserWithCorrectCredentials();
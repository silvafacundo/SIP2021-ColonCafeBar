const {Builder, By, Key, until} = require("selenium-webdriver");
const assert = require('assert');
const url = "https://backend-silvafacundo.cloud.okteto.net/admin";


async function loginAdminWithCorrectCredentials() {
    let driver = await new Builder().forBrowser("chrome").build();
    let username = "admin";
    await driver.get(url);
    await driver.findElement(By.name("username"))
        .sendKeys(username);
    await driver.findElement(By.name("password"))
        .sendKeys("12345");
    await driver.findElement(By.css("form > button")).click();
    try {
       await driver.wait(
            until.elementLocated(
                By.css('nav')),10000);
        let response= await driver.findElement(By.css('.navbar .navbar-end a')).getAttribute('textContent');
        assert.match(username, new RegExp(response),'error');  
        await driver.close();        
    } catch (error) {
        console.log('Something was wrong!');
    }
}

loginAdminWithCorrectCredentials();
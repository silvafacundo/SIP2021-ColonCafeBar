const {Builder, By, Key, until} = require("selenium-webdriver");
const assert = require('assert');
const url = "https://backend-silvafacundo.cloud.okteto.net";


async function addProductToCart(){
    let driver = await new Builder().forBrowser("chrome").build();
    let quantity = 5;
    await driver.get(url);
    try {
        await driver.wait(
            until.elementLocated(
                By.xpath("/html/body/div[1]/div/div/div[2]/div[1]"))
                ,10000);
        await driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div[1]")).click();    
        await driver.wait(
            until.elementLocated(
                By.xpath("/html/body/div[1]/div/div/div[3]"))
                ,10000);
        for (let index = 1; index < quantity; index++) {
            await driver.findElement(By.xpath("/html/body/div[1]/div/div/div[3]/div[2]/div/div[2]/div/p[2]"))
            .click();
        }      
        await driver.findElement(By.xpath("/html/body/div[1]/div/div/div[3]/div[2]/div/footer/button[2]"))
            .click();
        let response = await driver.findElement(By.xpath("/html/body/div[1]/div/header/div/button/span/section/span[2]"))
            .getAttribute('textContent');
        
        (quantity===Number(response))?console.log('Test ok'):console.log('Something was wrong!');
        driver.close();

    } catch (error) {
        console.log('Something was wrong!');
    }
}

addProductToCart();


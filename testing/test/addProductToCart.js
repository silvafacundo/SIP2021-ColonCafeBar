const {Builder, By, Key, until} = require("selenium-webdriver");
const url = "https://backend-silvafacundo.cloud.okteto.net";


async function addProductToCart(){
	let driver = await new Builder().forBrowser("chrome").build();
	let quantity = 5;
	await driver.get(url);
	try {
		await driver.wait(
			until.elementLocated(
				By.xpath("/html/body/div[1]/div/div/div[2]/div[2]/div[1]/div[2]/div/div/div[1]"))
				,10000);
		await driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div[2]/div[1]/div[2]/div/div/div[1]")).click();
		await driver.wait(
			until.elementLocated(
		 		By.xpath("/html/body/div[1]/div/div/div[2]/div[3]"))
		 		,10000);
		for (let index = 1; index < quantity; index++) {
			await driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div[3]/div[2]/div/div[2]/div/p[2]"))
			.click();
		}
		await driver.wait(
			until.elementLocated(
		 		By.xpath("/html/body/div[1]/div/div/div[2]/div[3]/div[2]/div/footer/button[2]"))
		 		,10000);
		await driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div[3]/div[2]/div/footer/button[2]"))
			.click();
		await driver.wait(
			until.elementLocated(
					By.xpath("/html/body/div[4]"))
					,10000);
		let response = await driver.findElement(By.xpath("/html/body/div[4]")).getAttribute('textContent');
		console.log(response);
		driver.close();
	} catch (error) {
		console.log('Something was wrong!');
	}
}

addProductToCart();


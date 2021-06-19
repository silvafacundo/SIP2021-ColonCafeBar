const assert = require('chai').assert;
const config = require('../../../backend/knexfile');
const knex = require('knex')(config);

const Server = require('../../../backend/src/Server');
const server = new Server();

let product = null;

describe('Product-Test', () => {
	before(async () => {
		// initialize data base and connections
		await server.initializeDatabase();
		await server.initializeSequelize();
		await server.initializeControllers();
	})

	it('Creates a product', async () => {
	
		const anyCategory = await server.db('categories').first();

		const createdProduct = await server.utils.products.createProduct({
			idCategory: anyCategory.id,
			name: 'AlgunProducto',
			description: 'Este es una descripcion',
			price: 100,
			variants: {}
		});

		assert.exists(createdProduct);
		product = createdProduct;

	});

	it('Updates a product price', async () => {
		await server.utils.products.updateProduct({ productId: product.id, price: 200 });
		const updatedProduct = await server.utils.products.getProduct(product.id);
		assert.equal(Number(updatedProduct.price), 200);

		product = updatedProduct;
	});

	it('Deletes the product', async () => {
		// para evitar generar basura, lo borramos de la db
		await server.db('productPrices').where({ productId: product.id }).del();
		await server.db('products').where({ id: product.id }).del();
	});

});

function timeoutAsync(time) {
	return new Promise((res, rej) => {
		setTimeout(()=> {
			return res();
		}, time);
	})
}
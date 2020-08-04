'use strict'

// getting all items
const allDishes = document.querySelectorAll('[data-dish]');
// getting main container
const app = document.querySelector('[data-menu]');
// getting categories selector
const categories = document.querySelector('[data-category-filter]');
// getting prices selector
const prices = document.querySelector('[data-price-filter]');






// get first node as a template
const dishTemplate = allDishes[0];

/* 
	--- CLASSES ---
*/

// class for creating dishes from menu
class Dish {
	constructor(id, categoryId, title, img, price) {
		this.id = id;
		this.categoryId = categoryId;
		this.title = title;
		this.img = img;
		this.price = price;
	}

	get itemNode() {
		let itemTemplate = dishTemplate.cloneNode(true);

		itemTemplate.dataset.dish = this.categoryId;
		itemTemplate.querySelector('[data-title]').innerHTML = this.title;
		itemTemplate.querySelector('[data-img]').setAttribute('src', this.img);
		itemTemplate.querySelector('[data-price]').dataset.price = this.price;
		itemTemplate.querySelector('[data-price]').innerHTML = this.price;

		return itemTemplate;
	}
};

/* 
	--- END OF CLASSES ---
*/

// recording all items to array as default data
const dataDishes = dishesToArray();
// first default rendering
renderDishes();



// listening value changing for categories and price selectors
categories.addEventListener('change', () => {

	// for appliing several filters
	if (parseInt(prices.value) != 0) {

		renderDishes(sortedDishesByCat(categories.value, sortedDishesByPrice(prices.value)));
	} else {
		renderDishes(sortedDishesByCat(categories.value));
	}

});

prices.addEventListener('change', () => {

	if (parseInt(categories.value) != 0) {

		renderDishes(sortedDishesByPrice(prices.value, sortedDishesByCat(categories.value)));
	} else {
		renderDishes(sortedDishesByPrice(prices.value));
	}

});




/*
	--- FUNCTIONS ---
*/

// converting nodes to array of data
function dishesToArray(nodes = allDishes) {
	const dataDishes = [];

	nodes.forEach((dishItem, index) => {
		let dishId = index;
		let dishCatId = dishItem.dataset.dish;
		let dishTitle = dishItem.querySelector('[data-title]').innerHTML;
		let dishImg = dishItem.querySelector('[data-img]').getAttribute('src');
		let dishPrice = dishItem.querySelector('[data-price]').dataset.price;

		let dish = new Dish(dishId, dishCatId, dishTitle, dishImg, dishPrice);
		dataDishes.push(dish);
	});
	return dataDishes;
}

// render array of dishes
function renderDishes(filteredArray = dataDishes) {
	// clear the app
	app.innerHTML = '';

	if (filteredArray.length == 0) app.innerHTML = '<h3> Sorry, no items found ... 😔 </h3>'

	filteredArray.forEach(item => {
		// adding items
		app.appendChild(item.itemNode)

	});

	addingDishes();
}

// sort dishes by category id
function sortedDishesByCat(categoryId, dishes = dataDishes) {
	if (!categoryId) return;
	if (categoryId == 0) return dishes;

	const sortedArray = dishes.filter(item => item.categoryId == parseInt(categoryId));
	return sortedArray;
}

// sort dishes by price
function sortedDishesByPrice(price, dishes = dataDishes) {
	if (!price) return;
	if (price == 0) return dishes;

	const sortedArray = dishes.filter(item => item.price < parseInt(price));

	return sortedArray;
}

function addingDishes() {
	const renderedDishes = app.querySelectorAll('[data-dish]');
	// adding listener to all rendered items
	renderedDishes.forEach(item => {
		item.addEventListener('click', (event) => {

			// check the button
			if (event.target.hasAttribute('data-add')) {
				const price = parseInt(event.target.parentNode.querySelector('[data-price]').dataset.price);
				const quantity = parseInt(event.target.previousElementSibling.childNodes[1].value);

				if (quantity > 0) {
					console.log(quantity);
					console.log(price * quantity);
					// getting tottal quantity and price
					const totalQuantity = document.querySelector('[data-total-quantity]');
					const totalPrice = document.querySelector('[data-total-price]');
					let quantityAttr = parseInt(totalQuantity.dataset.totalQuantity);
					if (quantityAttr == 0) {
						quantityAttr = quantity;
						totalQuantity.innerHTML = quantityAttr;

					} else {
						quantityAttr = quantityAttr + quantity;
						totalQuantity.innerHTML = quantityAttr;
					}
				}
			}
		})
	});
}

/*
	--- END OF FUNCTIONS ---
*/
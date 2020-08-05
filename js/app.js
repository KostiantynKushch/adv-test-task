'use strict'

// getting all items
const allDishes = document.querySelectorAll('[data-dish]');
// getting main container
const app = document.querySelector('[data-menu]');
// getting categories selector
const categories = document.querySelector('[data-category-filter]');
// getting prices selector
const prices = document.querySelector('[data-price-filter]');
// getting tottal quantity and price
const totalQuantity = document.querySelector('[data-total-quantity]');
const totalPrice = document.querySelector('[data-total-price]');

// cart
let cart = {
	quantity: 0,
	total: 0
}

//checkout 
const checkout = document.querySelector('[data-checkout]');
const checkoutForm = document.querySelector('[data-checkout-form]');
const proceed = document.querySelector('[data-proceed]');
const back = document.querySelector('[data-back]');

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


// checkout

// display checkout
proceed.addEventListener('click', () => {
	if (checkout.classList.contains('hidden') && cart.quantity > 0) {
		checkout.classList.remove('hidden');
	}
});

// hide checkout on back btn
back.addEventListener('click', () => {
	checkout.classList.add('hidden');
});

// form submitting
checkoutForm.addEventListener('submit', () => {
	event.preventDefault();
	const name = checkoutForm.querySelector('[name="name"]').value;
	const email = checkoutForm.querySelector('[name="email"]').value;


	if (name == '' && email == '') {
		alert('All fields should be filled!')
	} else if (name == '') {
		alert('Name field should be filled!')
	} else if (email == '') {
		alert('Email field should be filled!')
	} else {
		alert('Thank you for your order!');
		checkout.classList.add('hidden');
		cart.quantity = 0;
		cart.total = 0;
		updateFrontAfterAddingProd();
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

					if (totalQuantity.dataset.totalQuantity == 0) {
						// adding data to cart
						cart.quantity = quantity;
						cart.total = price * quantity;
						// update
						updateFrontAfterAddingProd(event.target);
					} else {
						// adding data to cart
						cart.quantity += quantity;
						cart.total += price * quantity;
						// update
						updateFrontAfterAddingProd(event.target);

					}
				}
			}
		})
	});
}

function updateFrontAfterAddingProd(target, quantity = totalQuantity, price = totalPrice) {
	if (!target) {
		// update totals
		quantity.dataset.totalQuantity = cart.quantity;
		quantity.innerHTML = 'XXX';

		price.dataset.totalPrice = cart.total;
		price.innerHTML = 'XXX';
	} else {
		// update totals
		quantity.dataset.totalQuantity = cart.quantity;
		quantity.innerHTML = cart.quantity;

		price.dataset.totalPrice = cart.total;
		price.innerHTML = cart.total;

		// update product quantity
		target.previousElementSibling.childNodes[1].value = 0;
	}


}

/*
	--- END OF FUNCTIONS ---
*/
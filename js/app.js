'use strict'

const allDishes = document.querySelectorAll('[data-dish]');

console.log(allDishes);
console.log(allDishes[0]);
console.log('Dish Category: ' + allDishes[0].dataset.dish);
console.log(allDishes[0].querySelector('[data-title]').innerHTML);
console.log(allDishes[0].querySelector('[data-price]').dataset.price);
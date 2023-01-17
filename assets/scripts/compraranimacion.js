const button = document.getElementById('button');
const cart = document.getElementById('cart');
const text = document.getElementById('text');

button.onclick = function() {
  if (!document.getElementsByClassName('cartAnimation').length) {
    cart.classList.add('cartAnimation');
    text.classList.add('textAnimation');
    button.classList.add('buttonAnimation');
  } else {
    cart.classList.remove('cartAnimation');
    text.classList.remove('textAnimation');
    button.classList.remove('buttonAnimation');
  }
}
const addToCartButtons = document.querySelectorAll('.addToCart');
const comprarButton = document.querySelector('.comprarButton');

const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');

let shoppingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

loadShoppingCartItems();

addToCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', addToCartClicked);
});

comprarButton.addEventListener('click', comprarButtonClicked);

function addToCartClicked(event) {
  const button = event.target;
  const item = button.closest('.item');

  const itemTitle = item.querySelector('.item-title').textContent;
  const itemPrice = item.querySelector('.item-price').textContent;
  const itemImage = item.querySelector('.item-image').src;

  addItemToShoppingCart(itemTitle, itemPrice, itemImage);
}

function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
  const existingItem = shoppingCartItems.find((item) => item.title === itemTitle);
  if (existingItem) {
    existingItem.quantity++;
    saveShoppingCartItems();
    updateShoppingCartTotal();
    return;
  }

  const newItem = {
    title: itemTitle,
    price: itemPrice,
    image: itemImage,
    quantity: 1
  };

  shoppingCartItems.push(newItem);
  saveShoppingCartItems();
  updateShoppingCartTotal();
  loadShoppingCartItems();
}

function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  const item = buttonClicked.closest('.shoppingCartItem');
  const itemTitle = item.querySelector('.shoppingCartItemTitle').textContent;

  shoppingCartItems = shoppingCartItems.filter((item) => item.title !== itemTitle);
  saveShoppingCartItems();
  loadShoppingCartItems();
  updateShoppingCartTotal();
}

function quantityChanged(event) {
  const input = event.target;
  const item = input.closest('.shoppingCartItem');
  const itemTitle = item.querySelector('.shoppingCartItemTitle').textContent;

  const quantity = parseInt(input.value);
  const existingItem = shoppingCartItems.find((item) => item.title === itemTitle);
  if (existingItem) {
    existingItem.quantity = quantity;
    saveShoppingCartItems();
    updateShoppingCartTotal();
  }
}

function loadShoppingCartItems() {
  shoppingCartItemsContainer.innerHTML = '';

  shoppingCartItems.forEach((item) => {
    const shoppingCartRow = document.createElement('div');
    shoppingCartRow.classList.add('shoppingCartItem', 'row');

    const shoppingCartContent = `
      <div class="col-6">
          <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
              <img src=${item.image} class="shopping-cart-image">
              <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${item.title}</h6>
          </div>
      </div>
      <div class="col-2">
          <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
              <p class="item-price mb-0 shoppingCartItemPrice">${item.price}</p>
          </div>
      </div>
      <div class="col-4">
          <div class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
              <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                  value="${item.quantity}">
              <button class="btn btn-danger buttonDelete" type="button">X</button>
          </div>
      </div>
    `;

    shoppingCartRow.innerHTML = shoppingCartContent;
    shoppingCartItemsContainer.appendChild(shoppingCartRow);

    const deleteButton = shoppingCartRow.querySelector('.buttonDelete');
    deleteButton.addEventListener('click', removeShoppingCartItem);

    const quantityInput = shoppingCartRow.querySelector('.shoppingCartItemQuantity');
    quantityInput.addEventListener('change', quantityChanged);
  });
}

function updateShoppingCartTotal() {
  let total = 0;

  shoppingCartItems.forEach((item) => {
    const price = parseFloat(item.price.replace('$', ''));
    total += price * item.quantity;
  });

  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
  shoppingCartTotal.innerHTML = `${total.toFixed(2)}$`;
}

function comprarButtonClicked() {
  shoppingCartItems = [];
  saveShoppingCartItems();
  loadShoppingCartItems();
  updateShoppingCartTotal();
}

function saveShoppingCartItems() {
  localStorage.setItem('cartItems', JSON.stringify(shoppingCartItems));
}

window.addEventListener('load', () => {
  loadShoppingCartItems();
  updateShoppingCartTotal();
});

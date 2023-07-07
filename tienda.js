const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
addToShoppingCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', addToCartClicked);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector(
  '.shoppingCartItemsContainer'
);

fetch('articulos.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(articulo => {
      const item = document.createElement('div');
      item.classList.add('col-12', 'col-md-6');
      item.innerHTML = `
        <div class="item shadow mb-4">
          <h3 class="item-title">${articulo.nombre}</h3>
          <img class="item-image" src="${articulo.imagen}">
          <div class="item-details">
            <h4 class="item-price">${articulo.precio}</h4>
            <button class="item-button btn btn-primary addToCart">AÑADIR AL CARRITO</button>
          </div>
        </div>
      `;
      const addToCartButton = item.querySelector('.addToCart');
      addToCartButton.addEventListener('click', addToCartClicked);
      shoppingCartItemsContainer.appendChild(item);
    });
  })
  .catch(error => {
    console.error('Error al cargar los artículos:', error);
  });

function addToCartClicked(event) {
  const button = event.target;
  const item = button.closest('.item');

  const itemTitle = item.querySelector('.item-title').textContent;
  const itemPrice = item.querySelector('.item-price').textContent;
  const itemImage = item.querySelector('.item-image').src;

  addItemToShoppingCart(itemTitle, itemPrice, itemImage);
}

function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
    const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle');
  
    // Verificar si el artículo ya está en el carrito
    const existingItem = Array.from(elementsTitle).find((element) => element.innerText === itemTitle);
    if (existingItem) {
      const elementQuantity = existingItem.parentElement.parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
      elementQuantity.value++;
      $('.toast').toast('show');
      updateShoppingCartTotal();
      return;
    }
  
    // Agregar el nuevo artículo al carrito
    const shoppingCartRow = document.createElement('div');
    const shoppingCartContent = `
      <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
      </div>`;
    shoppingCartRow.innerHTML = shoppingCartContent;
    shoppingCartItemsContainer.append(shoppingCartRow);
  
    shoppingCartRow
      .querySelector('.buttonDelete')
      .addEventListener('click', removeShoppingCartItem);
  
    shoppingCartRow
      .querySelector('.shoppingCartItemQuantity')
      .addEventListener('change', quantityChanged);
  
    updateShoppingCartTotal();
  }
  

function updateShoppingCartTotal() {
  let total = 0;
  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

  shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      '.shoppingCartItemPrice'
    );
    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace('$', '')
    );
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      '.shoppingCartItemQuantity'
    );
    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.value
    );
    total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
  });
  shoppingCartTotal.innerHTML = `${total.toFixed(2)}$`;
}

function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  buttonClicked.closest('.shoppingCartItem').remove();
  updateShoppingCartTotal();
}

function quantityChanged(event) {
  const input = event.target;
  input.value <= 0 ? (input.value = 1) : null;
  updateShoppingCartTotal();
}

function comprarButtonClicked() {
  shoppingCartItemsContainer.innerHTML = '';
  updateShoppingCartTotal();
}

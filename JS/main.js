const addToCartButton = document.querySelectorAll(".add-to-cart");

const cartEmpty = document.querySelector(".cart-empty");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total-price");
const cartBuy = document.querySelector(".cart-buy");
const confrimBuy = document.querySelector(".confrim-btn");

const orderModel = document.getElementById("orderModel");
const orderDetailsList = document.getElementById("orderDetailsList");
const orderTotal = document.getElementById("orderTotal");
const startNewOrder = document.getElementById("startNewOrder");

const cart = [];

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    cart.push(...parsedCart);
  }
}

loadCartFromLocalStorage();
updateCart();

// Handle "Add to Cart" button clicks
addToCartButton.forEach((button) => {
  button.addEventListener("click", () => {

    const productContainer = button.closest(".product-container");
    const quantityControls =
      productContainer.querySelector(".quantity-control");
    const pictureElement = productContainer.querySelector("picture img");

    button.style.display = "none";
    quantityControls.style.display = "flex";
    pictureElement.style.border = "3px solid #c73a0f";

    cartEmpty.style.display = "none";
    cartItems.style.display = "grid";

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name,
        price,
        quantity: 1,
        thumbnail: button.dataset.thumbnail,
      });
    }

    updateCart();
    saveCartToLocalStorage();
  });
});

// Update Cart UI
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items display
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div>
        <div class="product-cart-name">${item.name}</div>
        <span class="product-cart-quantity">${item.quantity}x</span>
        <span class="product-base-price">@ $${item.price.toFixed(2)}</span>
        <span class="product-cart-price">$${(
          item.quantity * item.price
        ).toFixed(2)}</span>
      </div>
      <button class="remove-item" data-index="${index}">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10" class="remove-icon">
          <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
        </svg>
      </button>
    `;
    cartItems.appendChild(listItem);
  });
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartEmpty.style.display = "grid";
    cartItems.style.display = "none";
    cartBuy.style.display = "none";

    document
      .querySelectorAll(".product-container")
      .forEach((productContainer) => {
        const addToCartButton = productContainer.querySelector(".add-to-cart");
        const quantityControls =
          productContainer.querySelector(".quantity-control");
        const pictureElement = productContainer.querySelector("picture img");

        // Reset styles
        addToCartButton.style.display = "flex";
        quantityControls.style.display = "none";
        pictureElement.style.border = "none";

        // Reset quantity to default
        const quantitySpan = quantityControls?.querySelector(".quantity");
        if (quantitySpan) quantitySpan.textContent = "1";
      });
  } else {
    cartEmpty.style.display = "none";
    cartItems.style.display = "block"; // Ensure this is set properly
    cartBuy.style.display = "block";
  }

  // Attach remove button handlers
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      const item = cart[index];

      if (item) {
        const productContainer = document.querySelector(
          `.product-container[data-name="${item.name}"]`
        );

        if (productContainer) {
          const addToCartButton =
            productContainer.querySelector(".add-to-cart");
          const quantityControls =
            productContainer.querySelector(".quantity-control");
          const pictureElement = productContainer.querySelector("picture img");

          addToCartButton.style.display = "flex";
          quantityControls.style.display = "none";
          pictureElement.style.border = "none";

          const quantitySpan = quantityControls.querySelector(".quantity");
          if (quantitySpan) quantitySpan.textContent = "1"; // Reset to default value
        }

        cart.splice(index, 1);
        updateCart();
        saveCartToLocalStorage();
      }
    });
  });
  saveCartToLocalStorage();
}

// Handle Quantity Controls
const quantityControls = document.querySelectorAll(".quantity-control");
quantityControls.forEach((control) => {



  const incrementBtn = control.querySelector(".increment-btn");
  const decrementBtn = control.querySelector(".decrement-btn");
  const quantitySpan = control.querySelector(".quantity");

  const productContainer = control.closest(".product-container");
  const name = productContainer.querySelector(".add-to-cart").dataset.name;
  const price = parseFloat(
    productContainer.querySelector(".add-to-cart").dataset.price
  );

  incrementBtn.addEventListener("click", () => {
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    quantitySpan.textContent = existingItem ? existingItem.quantity : 1;
    updateCart();
    saveCartToLocalStorage();
  });

  decrementBtn.addEventListener("click", () => {
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity--;

      if (existingItem.quantity === 0) {
        cart.splice(cart.indexOf(existingItem), 1);

        control.style.display = "none";
        const addToCartButton = productContainer.querySelector(".add-to-cart");
        const pictureElement = productContainer.querySelector("picture img");
        addToCartButton.style.display = "flex";
        pictureElement.style.border = "none";
      } else {
        quantitySpan.textContent = existingItem.quantity;
      }
    }
    updateCart();
    saveCartToLocalStorage();
  });
});

const modalOverlay = document.querySelector('.modal-overlay');

confrimBuy.addEventListener("click", () => {
  confrimBuy.classList.add("clicked");

  void confrimBuy.offsetWidth;
  setTimeout(() => {
    confrimBuy.classList.remove("clicked");
  }, 300);

  orderDetailsList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class = "model-cart-item">
      <img src="${item.thumbnail}" class="cart-thumbnail" alt="${item.name}">
      <div class = "item-info">
      <p class="model-cart-name">${item.name}</p>
      <span class="model-cart-quantity">${item.quantity}x</span>
      <span class="model-base-price">@ $${item.price.toFixed(2)}</span>
      </div>
      <div class="product-cart-price-model">$${(
        item.quantity * item.price
      ).toFixed(2)}
      </div>
      </div>

      `;
    orderDetailsList.appendChild(listItem);
  });
  orderTotal.textContent = `$${total.toFixed(2)}`;

  orderModel.classList.add("show");
});

startNewOrder.addEventListener("click", () => {
  cart.length = 0;
  updateCart();
  localStorage.removeItem("cart");

  orderModel.classList.remove("show");
});

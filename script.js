const modal = document.getElementById("order-modal");
const pizzaSizeFields = document.querySelectorAll(".pizza-size-type");
const grandTotalPrice = calculateTotalPrice();

document.querySelector("#total-price").innerText =
  "RM " + grandTotalPrice.toFixed(2);
const pizzaSizeFieldKeys = Object.keys(pizzaSizeFields);
const pizzaPrices = {
  small: 15,
  medium: 22,
  large: 30,
};

const pepperoniSizePrices = {
  small: 3,
  medium: 5,
  large: 6,
};
const extraPrices = {
  cheese: 6,
};

let chosenSize;

function choosePizzaSize(size) {
  if (!document.querySelector(`#${size}`).checked) {
    pizzaSizeFieldKeys.map((pizzaSizeFieldKey) => {
      pizzaSizeFields[pizzaSizeFieldKey].disabled = false;
    });
  } else {
    pizzaSizeFieldKeys.map((pizzaSizeFieldKey) => {
      if (pizzaSizeFields[pizzaSizeFieldKey].id == size) {
        return;
      }
      pizzaSizeFields[pizzaSizeFieldKey].disabled = true;
    });
  }
  chosenSize = size;
}

function addToOrder() {
  const quantity = Number(document.querySelector("#pizza-quantity").value);
  const hasCheese = document.querySelector("#cheese").checked;
  const hasPepperoni = document.querySelector("#pepperoni").checked;

  if (!quantity) {
    alert("Quantity must not be empty or 0");
    return;
  }

  const pizzaPrice = pizzaPrices[chosenSize];
  const extraPrice =
    (hasCheese ? extraPrices.cheese : 0) +
    (hasPepperoni ? pepperoniSizePrices[chosenSize] : 0);

  let totalPrice = 0;
  totalPrice += (pizzaPrice + extraPrice) * quantity;

  const order = {
    size: chosenSize,
    quantity,
    hasPepperoni,
    hasCheese,
    totalPrice,
  };

  storeOrder(order);

  const newGrandTotalPrice = calculateTotalPrice();

  document.querySelector("#total-price").innerText =
    "RM " + newGrandTotalPrice.toFixed(2);
  closeModal("order");
}

function openOrderModal() {
  modal.style.display = "block";
}

function openOrderListModal() {
  document.querySelector("#order-list-modal").style.display = "block";

  const orderListField = document.querySelector("#order-list-field");

  orderListField.innerHTML = "";

  const orderList = getAllOrders();

  orderList.forEach((order) => {
    const orderItemDiv = document.createElement("div");
    orderItemDiv.className = "order-item";

    const idDiv = document.createElement("div");
    idDiv.textContent = `Order ID: ${order.id}`;
    orderItemDiv.appendChild(idDiv);

    const quantityDiv = document.createElement("div");
    quantityDiv.textContent = `Quantity: ${order.quantity}`;
    orderItemDiv.appendChild(quantityDiv);

    const priceDiv = document.createElement("div");
    priceDiv.textContent = `Price: RM ${order.totalPrice}`;
    orderItemDiv.appendChild(priceDiv);

    orderListField.appendChild(orderItemDiv);
  });
}

function closeModal(type) {
  if (type === "order-list") {
    document.querySelector("#order-list-modal").style.display = "none";
  } else if (type === "order") {
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.disabled = false;
    });
    const quantityInput = modal.querySelector("#pizza-quantity");
    quantityInput.value = 1;

    modal.style.display = "none";
  } else {
    document.querySelector("#submit-order-modal").style.display = "none";
  }
}

function storeOrder(order) {
  if (!localStorage.length) {
    localStorage.setItem(1, JSON.stringify(order));
  } else {
    localStorage.setItem(localStorage.length + 1, JSON.stringify(order));
  }
}

function getAllOrders() {
  if (!localStorage.length) {
    return [];
  }
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    let item = {};
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    item = JSON.parse(value);
    items.push({ id: key, ...item });
  }
  return items;
}

function calculateTotalPrice() {
  const orders = getAllOrders();

  if (!orders.length) {
    return 0;
  }
  let grandTotalPrice = 0;

  orders.forEach((order) => {
    grandTotalPrice += order.totalPrice;
  });
  return grandTotalPrice;
}

function submitOrder() {
  localStorage.clear();
  const grandTotalPrice = calculateTotalPrice();

  document.querySelector("#total-price").innerText =
    "RM " + grandTotalPrice.toFixed(2);

  document.querySelector("#submit-order-modal").style.display = "block";
}

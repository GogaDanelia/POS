const paymentTypeIdCard = 3;
const paymentTypeIdCash = 2;

let warehouseId = localStorage.getItem("warehouseId");
//პროდუქტების მთავარი კონტეინერი
let ProductsList = document.querySelector(".products-container");
// პროდუქტების კალათის მთავარი კონეტინერი
let ProductsListInBasket = document.querySelector(".right-basket-container");
// const testData = [];
// პროდუქტების წამოღება და თითოეული პროდუქტის ობიექტის მასივში მოთავსება
const productsListData = [];
function getProducts() {
  fetch(
    `http://5.152.108.245:8083/api/v1/warehouseitem/getwarehouseitemlist?WarehouseId=${warehouseId}`
  )
    .then((response) => response.json())
    .then((productsData) => {
      productsData.forEach((product) => {
        productsListData.push(product);
        // testData.push(product)
      });
      //პროდუქტების გამოჩენა ეკრანზე
      displayProducts();
    }); //ფეჩის დასასრული
}
getProducts();

// პროდუქტის გამოჩენა ეკრენზე
//და თითოეულ პროდუქტზე click ინვეთზე ვიძახებთ addToBasket ფუნქციას
function displayProducts() {
  productsListData.forEach((product) => {
    let productContainer = document.createElement("div");
    productContainer.classList.add("product");
    productContainer.innerHTML = `
      <div class="product-price">${product.templateSellingPrice}</div>
      <div class="product-img-container">
        <img src="../photos/shu.jpg" alt="product" class="product-img">
      </div>
      <div class="product-name">${product.name}</div>
    `;
    productContainer.addEventListener("click", () => addToBasket(product));
    ProductsList.appendChild(productContainer);
  });
}

// კალათაში დამატების ფუნქცია-
//ცარიელ მასივში ვამატებთ click -ზე პროდუქტის ობიექტს მთელი ინფორმაციით
const BasketContainer = [];
// კალათში დამატება პროდუქტის ვირტუალური კლავიატურით
function addToBasket(product) {
  const productCode = product.innerCode;

  // check if the same product code already exists in the basket
  let existingProduct = null;
  for (const basketProductDiv of document.querySelectorAll(".basket-product")) {
    if (
      basketProductDiv.querySelector(".basket-product-code").textContent ===
      productCode
    ) {
      existingProduct = basketProductDiv;
      break;
    }
  }

  if (existingProduct) {
    // update the quantity and price of the existing product
    const quantityInput = existingProduct.querySelector(
      ".basket-product-quantity input"
    );
    const priceDiv = existingProduct.querySelector(".basket-product-price");
    const fullPriceDiv = existingProduct.querySelector(
      ".basket-product-full-price"
    );

    const currentQuantity = parseInt(quantityInput.value);
    const newQuantity = currentQuantity + 1;
    const newPrice =
      newQuantity * parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
    const newFullPrice = newPrice.toFixed(2).replace(".", ",");
    quantityInput.value = newQuantity;
    fullPriceDiv.textContent = `₾ ${newFullPrice}`;
    updateOrderPrice();

    // add event listener to quantity input for updating the total price
    quantityInput.addEventListener("input", () => {
      const currentQuantity = parseInt(quantityInput.value);
      const newPrice =
        currentQuantity *
        parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
      const newFullPrice = newPrice.toFixed(2).replace(".", ",");
      fullPriceDiv.textContent = `₾ ${newFullPrice}`;
      updateOrderPrice();
    });
  } else {
    // create the main div container
    const basketProductDiv = document.createElement("div");
    basketProductDiv.classList.add("basket-product");

    // create the product code div and add text content
    const productCodeDiv = document.createElement("div");
    productCodeDiv.classList.add("basket-product-code");
    productCodeDiv.textContent = product.innerCode;
    basketProductDiv.appendChild(productCodeDiv);

    // create the product name div and add text content
    const productNameDiv = document.createElement("div");
    productNameDiv.classList.add("basket-product-name");
    productNameDiv.textContent = product.name;
    basketProductDiv.appendChild(productNameDiv);

    // quantity modify button
    const productQuantityDiv = document.createElement("div");
    productQuantityDiv.classList.add("basket-product-quantity");

    // create quantity input
    const quantityInput = document.createElement("input");
    quantityInput.classList.add("quantity");
    quantityInput.type = "text";
    quantityInput.value = "1";
    quantityInput.pattern = "d*";
    quantityInput.inputmode = "numeric";

    // create quantity display
    const productQuantityDisplay = document.createElement("div");
    productQuantityDisplay.textContent = quantityInput.value;

    let virtualKeyboardContainer = null;

    quantityInput.addEventListener("focus", () => {
      // check if virtual keyboard container already exists
      if (!virtualKeyboardContainer) {
        // create virtual keyboard container
        virtualKeyboardContainer = document.createElement("div");
        virtualKeyboardContainer.classList.add("virtual-keyboard-container");

        // create virtual keyboard
        const virtualKeyboard = document.createElement("div");
        virtualKeyboard.classList.add("virtual-keyboard");
        virtualKeyboard.style.display = "flex";
        virtualKeyboard.style.flexWrap = "wrap";
        virtualKeyboard.style.justifyContent = "center";
        virtualKeyboard.style.alignItems = "center";
        virtualKeyboard.style.gap = "8px";

        // create buttons for 1-9
        for (let i = 1; i <= 9; i++) {
          const button = document.createElement("button");
          button.textContent = i;
          button.style.width = "90px";
          button.style.height = "70px";
          button.style.fontSize = "48px";
          button.addEventListener("click", () => {
            if (quantityInput.value === "0") {
              quantityInput.value = i.toString();
            } else {
              quantityInput.value += i;
            }
            quantityInput.dispatchEvent(new Event("input"));
          });
          virtualKeyboard.appendChild(button);
        }

        // create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
          quantityInput.value = quantityInput.value.slice(0, -1);
          if (quantityInput.value === "") {
            quantityInput.value = "0";
          }
          quantityInput.dispatchEvent(new Event("input"));
        });
        virtualKeyboard.appendChild(deleteButton);

        // create 0 button
        const zeroButton = document.createElement("button");
        zeroButton.textContent = "0";
        zeroButton.classList.add("zero-button");
        zeroButton.style.width = "90px";
        zeroButton.style.height = "70px";
        zeroButton.style.fontSize = "48px";
        zeroButton.addEventListener("click", () => {
          if (quantityInput.value === "0") {
            quantityInput.value = "0";
          } else {
            quantityInput.value += "0";
          }
          quantityInput.dispatchEvent(new Event("input"));
        });
        virtualKeyboard.appendChild(zeroButton);

        // create hide button
        const hideButton = document.createElement("button");
        hideButton.textContent = "Close";
        hideButton.classList.add("hide-button");
        hideButton.addEventListener("click", () => {
          const currentQuantity = parseInt(quantityInput.value);

          if (currentQuantity === 0) {
            // Remove the product container from the DOM
            const productContainer = productQuantityDiv.parentNode;
            productContainer.parentNode.removeChild(productContainer);
          } else {
            // Hide the virtual keyboard
            virtualKeyboardContainer.style.display = "none";
          }
        });
        virtualKeyboard.appendChild(hideButton);

        // add virtual keyboard to container
        virtualKeyboardContainer.appendChild(virtualKeyboard);

        // add virtual keyboard container after quantity input
        quantityInput.parentNode.appendChild(virtualKeyboardContainer);
      } else {
        // Hide any other open virtual keyboard containers
        const openContainers = document.querySelectorAll(
          ".virtual-keyboard-container"
        );
        for (const container of openContainers) {
          container.style.display = "none";
        }

        // Show the current virtual keyboard container
        virtualKeyboardContainer.style.display = "block";
      }
    });
    //რაოდენობის შეცვლა
    quantityInput.addEventListener("input", () => {
      let currentQuantity = parseInt(quantityInput.value);

      // Check if the current quantity is less than or equal to 0 or is NaN
      if (currentQuantity <= 0 || isNaN(currentQuantity)) {
        // Set the quantity to a default non-zero value
        currentQuantity = 0;
        quantityInput.value = "0";
      }

      const newPrice =
        currentQuantity *
        parseFloat(productPriceDiv.textContent.slice(2).replace(",", "."));
      const newFullPrice = newPrice.toFixed(2).replace(".", ",");
      const fullPriceDiv = basketProductDiv.querySelector(
        ".basket-product-full-price"
      );
      fullPriceDiv.textContent = `₾ ${newFullPrice}`;

      updateOrderPrice();
    });

    productQuantityDiv.appendChild(quantityInput);
    // quantity modify button
    productQuantityDiv.appendChild(quantityInput);
    basketProductDiv.appendChild(productQuantityDiv);

    // create the product price div and add text content
    const productPriceDiv = document.createElement("div");
    productPriceDiv.classList.add("basket-product-price");
    productPriceDiv.textContent = `₾ ${product.templateSellingPrice}`;
    basketProductDiv.appendChild(productPriceDiv);

    // create the product full price div and add text content
    const productFullPriceDiv = document.createElement("div");
    productFullPriceDiv.classList.add("basket-product-full-price");
    productFullPriceDiv.textContent = `₾ ${product.templateSellingPrice}`;
    basketProductDiv.appendChild(productFullPriceDiv);

    // create the delete icon img element and set attributes
    const deleteIconImg = document.createElement("img");
    deleteIconImg.classList.add("delete-icon");
    deleteIconImg.setAttribute("src", "../photos/delete-icon.svg");
    deleteIconImg.setAttribute("alt", "delete");
    basketProductDiv.appendChild(deleteIconImg);

    // delete
    let confirmationDialog = document.getElementById("confirmation-dialog");
    let confirmButton = document.getElementById("confirm-btn");
    let cancelButton = document.getElementById("cancel-btn");

    deleteIconImg.addEventListener("click", () => {
      confirmationDialog.style.display = "block";
      deleteProduct = deleteIconImg.parentNode;
    });

    confirmButton.addEventListener("click", function () {
      deleteProduct.remove();
      confirmationDialog.style.display = "none";
      updateOrderPrice();
    });

    cancelButton.addEventListener("click", function () {
      confirmationDialog.style.display = "none";
    });

    // append to basket
    basketContainer.appendChild(basketProductDiv);
    BasketContainer.push(product);
  }

  updateOrderPrice();

}
let currentDate = new Date().toISOString();

let productList = document.querySelector(".products-container");
let basketContainer = document.querySelector(".right-basket-container");
let totalAmount = document.querySelector(".total-amount");

//   });
// });
// კატეგორიაების წამოღება და შემდეგ საწყობით და კატეგორიის id ით გაფილტვრა
fetch("http://5.152.108.245:8083/api/v1/itemfeature/getitemcategories")
  .then((res) => res.json())
  .then((data) => {
    const categoriesDivs = document.querySelectorAll(".list-item");
    for (let i = 0; i < data.length; i++) {
      categoriesDivs[i].innerHTML = data[i].name;
      categoriesDivs[i].addEventListener("click", () => {
        // active categori
        categoriesDivs.forEach((div) => div.classList.remove("active"));
        categoriesDivs[i].classList.add("active");

        productList.innerHTML = "";
        const categoryId = data[i].id;
        fetch(
          `http://5.152.108.245:8083/api/v1/warehouseitem/getwarehouseitemlist?WarehouseId=${warehouseId}&ItemCategoryId=${categoryId}`
        )
          .then((res) => res.json())
          .then((data) => {

            data.forEach((product) => {
              let data = {
                productName: product.name,
                productBarCode: product.innerCode,
                productPrice: product.templateSellingPrice,
              };

              const productDiv = document.createElement("div");
              productDiv.className = "product";
              const priceDiv = document.createElement("div");
              priceDiv.className = "product-price";
              priceDiv.textContent = `₾ ${data.productPrice}`;
              productDiv.appendChild(priceDiv);
              const imgContainerDiv = document.createElement("div");
              imgContainerDiv.className = "product-img-container";
              productDiv.appendChild(imgContainerDiv);
              const imgElement = document.createElement("img");
              imgElement.className = "product-img";
              imgElement.alt = "product";
              imgElement.src = "";
              imgContainerDiv.appendChild(imgElement);
              const nameDiv = document.createElement("div");
              nameDiv.className = "product-name";
              nameDiv.textContent = data.productName;
              productDiv.appendChild(nameDiv);
              // add the product div to the page
              productList.appendChild(productDiv);

              productDiv.addEventListener("click", (e) => {
                const productCode = data.productBarCode;

                // check if the same product code already exists in the basket
                let existingProduct = null;
                for (const basketProductDiv of document.querySelectorAll(
                  ".basket-product"
                )) {
                  if (
                    basketProductDiv.querySelector(".basket-product-code")
                      .textContent === productCode
                  ) {
                    existingProduct = basketProductDiv;
                    break;
                  }
                }

                if (existingProduct) {
                  // update the quantity and price of the existing product
                  const quantityInput = existingProduct.querySelector(
                    ".basket-product-quantity input"
                  );
                  const priceDiv = existingProduct.querySelector(
                    ".basket-product-price"
                  );
                  const fullPriceDiv = existingProduct.querySelector(
                    ".basket-product-full-price"
                  );

                  const currentQuantity = parseInt(quantityInput.value);
                  const newQuantity = currentQuantity + 1;
                  const newPrice =
                    newQuantity *
                    parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
                  const newFullPrice = newPrice.toFixed(2).replace(".", ",");
                  quantityInput.value = newQuantity;
                  fullPriceDiv.textContent = `₾ ${newFullPrice}`;
                  updateOrderPrice();

                  // add event listener to quantity input for updating the total price
                  quantityInput.addEventListener("input", () => {
                    const currentQuantity = parseInt(quantityInput.value);
                    const newPrice =
                      currentQuantity *
                      parseFloat(
                        priceDiv.textContent.slice(2).replace(",", ".")
                      );
                    const newFullPrice = newPrice.toFixed(2).replace(".", ",");
                    fullPriceDiv.textContent = `₾ ${newFullPrice}`;
                    updateOrderPrice();
                  });
                } else {
                  // create the main div container
                  const basketProductDiv = document.createElement("div");
                  basketProductDiv.classList.add("basket-product");

                  // create the product code div and add text content
                  const productCodeDiv = document.createElement("div");
                  productCodeDiv.classList.add("basket-product-code");
                  productCodeDiv.textContent = data.productBarCode;
                  basketProductDiv.appendChild(productCodeDiv);

                  // create the product name div and add text content
                  const productNameDiv = document.createElement("div");
                  productNameDiv.classList.add("basket-product-name");
                  productNameDiv.textContent = data.productName;
                  basketProductDiv.appendChild(productNameDiv);

                  // quantity modify button
                  const productQuantityDiv = document.createElement("div");
                  productQuantityDiv.classList.add("basket-product-quantity");

                  // create quantity input
                  const quantityInput = document.createElement("input");
                  quantityInput.classList.add("quantity");
                  quantityInput.type = "text";
                  quantityInput.value = "1";
                  quantityInput.pattern = "d*";
                  quantityInput.inputmode = "numeric";

                  // create quantity display
                  const productQuantityDisplay = document.createElement("div");
                  productQuantityDisplay.textContent = quantityInput.value;

                  let virtualKeyboardContainer = null;

                  quantityInput.addEventListener("focus", () => {
                    // check if virtual keyboard container already exists
                    if (!virtualKeyboardContainer) {
                      // create virtual keyboard container
                      virtualKeyboardContainer = document.createElement("div");
                      virtualKeyboardContainer.classList.add(
                        "virtual-keyboard-container"
                      );

                      // create virtual keyboard
                      const virtualKeyboard = document.createElement("div");
                      virtualKeyboard.classList.add("virtual-keyboard");
                      virtualKeyboard.style.display = "flex";
                      virtualKeyboard.style.flexWrap = "wrap";
                      virtualKeyboard.style.justifyContent = "center";
                      virtualKeyboard.style.alignItems = "center";
                      virtualKeyboard.style.gap = "8px";

                      // create buttons for 1-9
                      for (let i = 1; i <= 9; i++) {
                        const button = document.createElement("button");
                        button.textContent = i;
                        button.style.width = "90px";
                        button.style.height = "70px";
                        button.style.fontSize = "48px";
                        button.addEventListener("click", () => {
                          if (quantityInput.value === "0") {
                            quantityInput.value = i.toString();
                          } else {
                            quantityInput.value += i;
                          }
                          quantityInput.dispatchEvent(new Event("input"));
                        });
                        virtualKeyboard.appendChild(button);
                      }

                      // create delete button
                      const deleteButton = document.createElement("button");
                      deleteButton.textContent = "Delete";
                      deleteButton.classList.add("delete-button");
                      deleteButton.addEventListener("click", () => {
                        quantityInput.value = quantityInput.value.slice(0, -1);
                        if (quantityInput.value === "") {
                          quantityInput.value = "0";
                        }
                        quantityInput.dispatchEvent(new Event("input"));
                      });
                      virtualKeyboard.appendChild(deleteButton);

                      // create 0 button
                      const zeroButton = document.createElement("button");
                      zeroButton.textContent = "0";
                      zeroButton.classList.add("zero-button");
                      zeroButton.style.width = "90px";
                      zeroButton.style.height = "70px";
                      zeroButton.style.fontSize = "48px";
                      zeroButton.addEventListener("click", () => {
                        if (quantityInput.value === "0") {
                          quantityInput.value = "0";
                        } else {
                          quantityInput.value += "0";
                        }
                        quantityInput.dispatchEvent(new Event("input"));
                      });
                      virtualKeyboard.appendChild(zeroButton);

                      // create hide button
                      const hideButton = document.createElement("button");
                      hideButton.textContent = "Close";
                      hideButton.classList.add("hide-button");
                      hideButton.addEventListener("click", () => {
                        const currentQuantity = parseInt(quantityInput.value);

                        if (currentQuantity === 0) {
                          // Remove the product container from the DOM
                          const productContainer =
                            productQuantityDiv.parentNode;
                          productContainer.parentNode.removeChild(
                            productContainer
                          );
                        } else {
                          // Hide the virtual keyboard
                          virtualKeyboardContainer.style.display = "none";
                        }
                      });
                      virtualKeyboard.appendChild(hideButton);

                      // add virtual keyboard to container
                      virtualKeyboardContainer.appendChild(virtualKeyboard);

                      // add virtual keyboard container after quantity input
                      quantityInput.parentNode.appendChild(
                        virtualKeyboardContainer
                      );
                    } else {
                      // Hide any other open virtual keyboard containers
                      const openContainers = document.querySelectorAll(
                        ".virtual-keyboard-container"
                      );
                      for (const container of openContainers) {
                        container.style.display = "none";
                      }

                      // Show the current virtual keyboard container
                      virtualKeyboardContainer.style.display = "block";
                    }
                  });

                  quantityInput.addEventListener("input", () => {
                    let currentQuantity = parseInt(quantityInput.value);

                    // Check if the current quantity is less than or equal to 0 or is NaN
                    if (currentQuantity <= 0 || isNaN(currentQuantity)) {
                      // Set the quantity to a default non-zero value
                      currentQuantity = 0;
                      quantityInput.value = "0";
                    }

                    const newPrice =
                      currentQuantity *
                      parseFloat(
                        productPriceDiv.textContent.slice(2).replace(",", ".")
                      );
                    const newFullPrice = newPrice.toFixed(2).replace(".", ",");
                    const fullPriceDiv = basketProductDiv.querySelector(
                      ".basket-product-full-price"
                    );
                    fullPriceDiv.textContent = `₾ ${newFullPrice}`;

                    updateOrderPrice();
                  });

                  productQuantityDiv.appendChild(quantityInput);

                  // quantity modify button

                  productQuantityDiv.appendChild(quantityInput);
                  basketProductDiv.appendChild(productQuantityDiv);

                  // create the product price div and add text content
                  const productPriceDiv = document.createElement("div");
                  productPriceDiv.classList.add("basket-product-price");
                  productPriceDiv.textContent = `₾ ${data.productPrice}`;
                  basketProductDiv.appendChild(productPriceDiv);

                  // create the product full price div and add text content
                  const productFullPriceDiv = document.createElement("div");
                  productFullPriceDiv.classList.add(
                    "basket-product-full-price"
                  );
                  productFullPriceDiv.textContent = `₾ ${data.productPrice}`;
                  basketProductDiv.appendChild(productFullPriceDiv);

                  // create the delete icon img element and set attributes
                  const deleteIconImg = document.createElement("img");
                  deleteIconImg.classList.add("delete-icon");
                  deleteIconImg.setAttribute(
                    "src",
                    "../photos/delete-icon.svg"
                  );
                  deleteIconImg.setAttribute("alt", "delete");
                  basketProductDiv.appendChild(deleteIconImg);

                  // delete
                  let confirmationDialog = document.getElementById(
                    "confirmation-dialog"
                  );
                  let confirmButton = document.getElementById("confirm-btn");
                  let cancelButton = document.getElementById("cancel-btn");

                  deleteIconImg.addEventListener("click", () => {
                    confirmationDialog.style.display = "block";
                    deleteProduct = deleteIconImg.parentNode;
                  });

                  confirmButton.addEventListener("click", function () {
                    deleteProduct.remove();
                    confirmationDialog.style.display = "none";
                    updateOrderPrice();
                  });

                  cancelButton.addEventListener("click", function () {
                    confirmationDialog.style.display = "none";
                  });

                  // append to basket
                  basketContainer.appendChild(basketProductDiv);
                }
                updateOrderPrice();
              });
            });
          })
          .catch((error) => console.error(error));
      });
    }
  })
  .catch((error) => console.error(error));
// save button
// გასუფთავება კალათის
let ClearBasket = document.getElementById("empty-button");
ClearBasket.addEventListener("click", () => {
  let BasketContainer = document.querySelector(".right-basket-container");
  if (BasketContainer.innerHTML === "") {
    return;
  } else {
    basketContainer.innerHTML = "";
    updateOrderPrice();
    localStorage.removeItem("orderDetails");
    location.reload();
  }
});

// full price with %
//  let totalPriceWithTax = '';
const orderFullPrice = document.querySelector(".price .total-price");

// ფასის დააფდეითება
var fullCost = 0;
function updateOrderPrice() {
  // const taxAmountValue = document.querySelector(".tax-amount-value");
  const allBasketProducts = document.querySelectorAll(".basket-product");
  let totalPrice = 0;

  allBasketProducts.forEach((product) => {
    const fullPriceStr = product.querySelector(
      ".basket-product-full-price"
    ).textContent;
    const fullPriceNum = parseFloat(fullPriceStr.slice(2).replace(",", "."));
    totalPrice += fullPriceNum;
  });

  // const taxAmount = totalPrice * 0.18;
  fullCost = totalPrice.toFixed(2);
  orderFullPrice.textContent = fullCost;

  // orderFullPrice.textContent = totalPriceWithTax.toFixed(2).replace('.', ',');
  // taxAmountValue.textContent = taxAmount.toFixed(2).replace(".", ",");
 
}
//   cash or visa box
function pay() {
  let BasketContainer = document.querySelector(".right-basket-container");
  if (BasketContainer.innerHTML === "") {
    alert("empty");
    return;
  }
  let bigBox = document.getElementById("big-box");
  if (bigBox.style.display === "none" || bigBox.style.display === "") {
    bigBox.style.display = "block"; // show the box if it's hidden
  } else {
    bigBox.style.display = "none"; // hide the box if it's already displayed
  }
}
// Get the input and buttons elements

// ძებნის ინფუთ ველი
let searchIpnut = document.querySelector(".search-input");
// let searchIpnutValue = searchIpnut.value;
// ძებნის ღილაკი / აიქონი
let searchBtn = document.getElementById("search-icon");
// ძებნის ფუნქცია
function search(e) {
  e.preventDefault();
  if (searchIpnut.value == "") {
    return;
  }
  const barcode = searchIpnut.value;
  // შტრიხ კოდითპროდუქტის სკანერით ჩაგდება
  fetch(
    `http://5.152.108.245:8083/api/v1/warehouseitem/getwarehouseitemlistbywarehouseandbarcode?WarehouseId=${warehouseId}&Barcode=${barcode}`
  )
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        let data = {
          productName: product.name,
          productBarCode: product.innerCode,
          productPrice: product.templateSellingPrice,
        };

        // check if the same product code already exists in the basket
        let existingProduct = null;
        for (const basketProductDiv of document.querySelectorAll(
          ".basket-product"
        )) {
          if (
            basketProductDiv.querySelector(".basket-product-code")
              .textContent === data.productBarCode
          ) {
            existingProduct = basketProductDiv;
            break;
          }
        }

        if (existingProduct) {
          // update the quantity and price of the existing product
          const quantityInput = existingProduct.querySelector(
            ".basket-product-quantity input"
          );
          const priceDiv = existingProduct.querySelector(
            ".basket-product-price"
          );
          const fullPriceDiv = existingProduct.querySelector(
            ".basket-product-full-price"
          );

          const currentQuantity = parseInt(quantityInput.value);
          const newQuantity = currentQuantity + 1;
          const newPrice =
            newQuantity *
            parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
          const newFullPrice = newPrice.toFixed(2).replace(".", ",");
          quantityInput.value = newQuantity;
          fullPriceDiv.textContent = `₾ ${newFullPrice}`;
          updateOrderPrice();

          // add event listener to quantity input for updating the total price
          quantityInput.addEventListener("input", () => {
            const currentQuantity = parseInt(quantityInput.value);
            const newPrice =
              currentQuantity *
              parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
            const newFullPrice = newPrice.toFixed(2).replace(".", ",");
            fullPriceDiv.textContent = `₾ ${newFullPrice}`;
            updateOrderPrice();
          });
        } else {
          // create the main div container
          const basketProductDiv = document.createElement("div");
          basketProductDiv.classList.add("basket-product");

          // create the product code div and add text content
          const productCodeDiv = document.createElement("div");
          productCodeDiv.classList.add("basket-product-code");
          productCodeDiv.textContent = data.productBarCode;
          basketProductDiv.appendChild(productCodeDiv);

          // create the product name div and add text content
          const productNameDiv = document.createElement("div");
          productNameDiv.classList.add("basket-product-name");
          productNameDiv.textContent = data.productName;
          basketProductDiv.appendChild(productNameDiv);

          // quantity modify button
          const productQuantityDiv = document.createElement("div");
          productQuantityDiv.classList.add("basket-product-quantity");

          // create quantity input
          const quantityInput = document.createElement("input");
          quantityInput.classList.add("quantity");
          quantityInput.type = "text";
          quantityInput.value = "1";
          quantityInput.pattern = "d*";
          quantityInput.inputmode = "numeric";

          // create quantity display
          const productQuantityDisplay = document.createElement("div");
          productQuantityDisplay.textContent = quantityInput.value;

          let virtualKeyboardContainer = null;

          quantityInput.addEventListener("focus", () => {
            // check if virtual keyboard container already exists
            if (!virtualKeyboardContainer) {
              // create virtual keyboard container
              virtualKeyboardContainer = document.createElement("div");
              virtualKeyboardContainer.classList.add(
                "virtual-keyboard-container"
              );

              // create virtual keyboard
              const virtualKeyboard = document.createElement("div");
              virtualKeyboard.classList.add("virtual-keyboard");
              virtualKeyboard.style.display = "flex";
              virtualKeyboard.style.flexWrap = "wrap";
              virtualKeyboard.style.justifyContent = "center";
              virtualKeyboard.style.alignItems = "center";
              virtualKeyboard.style.gap = "8px";

              // create buttons for 1-9
              for (let i = 1; i <= 9; i++) {
                const button = document.createElement("button");
                button.textContent = i;
                button.style.width = "90px";
                button.style.height = "70px";
                button.style.fontSize = "48px";
                button.addEventListener("click", () => {
                  if (quantityInput.value === "0") {
                    quantityInput.value = i.toString();
                  } else {
                    quantityInput.value += i;
                  }
                  quantityInput.dispatchEvent(new Event("input"));
                });
                virtualKeyboard.appendChild(button);
              }

              // create delete button
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.classList.add("delete-button");
              deleteButton.addEventListener("click", () => {
                quantityInput.value = quantityInput.value.slice(0, -1);
                if (quantityInput.value === "") {
                  quantityInput.value = "0";
                }
                quantityInput.dispatchEvent(new Event("input"));
              });
              virtualKeyboard.appendChild(deleteButton);

              // create 0 button
              const zeroButton = document.createElement("button");
              zeroButton.textContent = "0";
              zeroButton.classList.add("zero-button");
              zeroButton.style.width = "90px";
              zeroButton.style.height = "70px";
              zeroButton.style.fontSize = "48px";
              zeroButton.addEventListener("click", () => {
                if (quantityInput.value === "0") {
                  quantityInput.value = "0";
                } else {
                  quantityInput.value += "0";
                }
                quantityInput.dispatchEvent(new Event("input"));
              });
              virtualKeyboard.appendChild(zeroButton);

              // create hide button
              const hideButton = document.createElement("button");
              hideButton.textContent = "Close";
              hideButton.classList.add("hide-button");
              hideButton.addEventListener("click", () => {
                const currentQuantity = parseInt(quantityInput.value);

                if (currentQuantity === 0) {
                  // Remove the product container from the DOM
                  const productContainer = productQuantityDiv.parentNode;
                  productContainer.parentNode.removeChild(productContainer);
                } else {
                  // Hide the virtual keyboard
                  virtualKeyboardContainer.style.display = "none";
                }
              });
              virtualKeyboard.appendChild(hideButton);

              // add virtual keyboard to container
              virtualKeyboardContainer.appendChild(virtualKeyboard);

              // add virtual keyboard container after quantity input
              quantityInput.parentNode.appendChild(virtualKeyboardContainer);
            } else {
              // Hide any other open virtual keyboard containers
              const openContainers = document.querySelectorAll(
                ".virtual-keyboard-container"
              );
              for (const container of openContainers) {
                container.style.display = "none";
              }

              // Show the current virtual keyboard container
              virtualKeyboardContainer.style.display = "block";
            }
          });

          quantityInput.addEventListener("input", () => {
            let currentQuantity = parseInt(quantityInput.value);

            // Check if the current quantity is less than or equal to 0 or is NaN
            if (currentQuantity <= 0 || isNaN(currentQuantity)) {
              // Set the quantity to a default non-zero value
              currentQuantity = 0;
              quantityInput.value = "0";
            }

            const newPrice =
              currentQuantity *
              parseFloat(
                productPriceDiv.textContent.slice(2).replace(",", ".")
              );
            const newFullPrice = newPrice.toFixed(2).replace(".", ",");
            const fullPriceDiv = basketProductDiv.querySelector(
              ".basket-product-full-price"
            );
            fullPriceDiv.textContent = `₾ ${newFullPrice}`;

            updateOrderPrice();
          });

          productQuantityDiv.appendChild(quantityInput);

          // quantity modify button

          productQuantityDiv.appendChild(quantityInput);
          basketProductDiv.appendChild(productQuantityDiv);

          // create the product price div and add text content
          const productPriceDiv = document.createElement("div");
          productPriceDiv.classList.add("basket-product-price");
          productPriceDiv.textContent = `₾ ${data.productPrice}`;
          basketProductDiv.appendChild(productPriceDiv);

          // create the product full price div and add text content
          const productFullPriceDiv = document.createElement("div");
          productFullPriceDiv.classList.add("basket-product-full-price");
          productFullPriceDiv.textContent = `₾ ${data.productPrice}`;
          basketProductDiv.appendChild(productFullPriceDiv);

          // create the delete icon img element and set attributes
          const deleteIconImg = document.createElement("img");
          deleteIconImg.classList.add("delete-icon");
          deleteIconImg.setAttribute("src", "../photos/delete-icon.svg");
          deleteIconImg.setAttribute("alt", "delete");
          basketProductDiv.appendChild(deleteIconImg);

          // delete
          let confirmationDialog = document.getElementById(
            "confirmation-dialog"
          );
          let confirmButton = document.getElementById("confirm-btn");
          let cancelButton = document.getElementById("cancel-btn");

          deleteIconImg.addEventListener("click", () => {
            confirmationDialog.style.display = "block";
            deleteProduct = deleteIconImg.parentNode;
          });

          confirmButton.addEventListener("click", function () {
            deleteProduct.remove();
            confirmationDialog.style.display = "none";
            updateOrderPrice();
          });

          cancelButton.addEventListener("click", function () {
            confirmationDialog.style.display = "none";
          });

          // append to basket
          basketContainer.appendChild(basketProductDiv);
        }
        updateOrderPrice();
      });
      // Handle the response data here
    })
    .catch((error) => {
      console.error(error);
    });
  // focus input element
  searchIpnut.focus();
  searchIpnut.value = "";
}

// სკანერით ძებნის ფუნქციის გამოძახება
searchBtn.addEventListener("click", search);
history.pushState({}, "");

// უკვე შენახული ორდერის ლოქალ სთორიჯიდან წამოღება ()
const savedOrderDetails = localStorage.getItem("orderDetails");
let recivedItem = savedOrderDetails ? true : false;
// შენახული ორდერის კალათში გამოჩენა
if (recivedItem) {
  const orderDetails = JSON.parse(savedOrderDetails);
  orderDetails.orderItems.forEach((item) => {
    const productCode = item.innerCode;

    // check if the same product code already exists in the basket
    let existingProduct = null;
    for (const basketProductDiv of document.querySelectorAll(
      ".basket-product"
    )) {
      if (
        basketProductDiv.querySelector(".basket-product-code").textContent ===
        productCode
      ) {
        existingProduct = basketProductDiv;
        break;
      }
    }

    if (existingProduct) {
      // update the quantity and price of the existing product
      const quantityInput = existingProduct.querySelector(
        ".basket-product-quantity input"
      );
      const priceDiv = existingProduct.querySelector(".basket-product-price");
      const fullPriceDiv = existingProduct.querySelector(
        ".basket-product-full-price"
      );

      const currentQuantity = parseInt(quantityInput.value);
      const newQuantity = currentQuantity + 1;
      const newPrice =
        newQuantity *
        parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
      const newFullPrice = newPrice.toFixed(2).replace(".", ",");
      quantityInput.value = newQuantity;
      fullPriceDiv.textContent = `₾ ${newFullPrice}`;
      updateOrderPrice();

      // add event listener to quantity input for updating the total price
      quantityInput.addEventListener("input", () => {
        const currentQuantity = parseInt(quantityInput.value);
        const newPrice =
          currentQuantity *
          parseFloat(priceDiv.textContent.slice(2).replace(",", "."));
        const newFullPrice = newPrice.toFixed(2).replace(".", ",");
        fullPriceDiv.textContent = `₾ ${newFullPrice}`;
        updateOrderPrice();
      });
    } else {
      // create the main div container
      const basketProductDiv = document.createElement("div");
      basketProductDiv.classList.add("basket-product");

      // create the product code div and add text content
      const productCodeDiv = document.createElement("div");
      productCodeDiv.classList.add("basket-product-code");
      productCodeDiv.textContent = item.innerCode;
      basketProductDiv.appendChild(productCodeDiv);

      // create the product name div and add text content
      const productNameDiv = document.createElement("div");
      productNameDiv.classList.add("basket-product-name");
      productNameDiv.textContent = item.name;
      basketProductDiv.appendChild(productNameDiv);

      // quantity modify button
      const productQuantityDiv = document.createElement("div");
      productQuantityDiv.classList.add("basket-product-quantity");

      // create quantity input
      const quantityInput = document.createElement("input");
      quantityInput.classList.add("quantity");
      quantityInput.type = "text";
      quantityInput.value = item.quantity;
      quantityInput.pattern = "d*";
      quantityInput.inputmode = "numeric";

      // create quantity display
      const productQuantityDisplay = document.createElement("div");
      productQuantityDisplay.textContent = quantityInput.value;

      let virtualKeyboardContainer = null;
      //
      quantityInput.addEventListener("focus", () => {
        // check if virtual keyboard container already exists
        if (!virtualKeyboardContainer) {
          // create virtual keyboard container
          virtualKeyboardContainer = document.createElement("div");
          virtualKeyboardContainer.classList.add("virtual-keyboard-container");

          // create virtual keyboard
          const virtualKeyboard = document.createElement("div");
          virtualKeyboard.classList.add("virtual-keyboard");
          virtualKeyboard.style.display = "flex";
          virtualKeyboard.style.flexWrap = "wrap";
          virtualKeyboard.style.justifyContent = "center";
          virtualKeyboard.style.alignItems = "center";
          virtualKeyboard.style.gap = "8px";

          // create buttons for 1-9
          for (let i = 1; i <= 9; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.style.width = "90px";
            button.style.height = "70px";
            button.style.fontSize = "48px";
            button.addEventListener("click", () => {
              if (quantityInput.value === "0") {
                quantityInput.value = i.toString();
              } else {
                quantityInput.value += i;
              }
              quantityInput.dispatchEvent(new Event("input"));
            });
            virtualKeyboard.appendChild(button);
          }

          // create delete button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("delete-button");
          deleteButton.addEventListener("click", () => {
            quantityInput.value = quantityInput.value.slice(0, -1);
            if (quantityInput.value === "") {
              quantityInput.value = "0";
            }
            quantityInput.dispatchEvent(new Event("input"));
          });
          virtualKeyboard.appendChild(deleteButton);

          // create 0 button
          const zeroButton = document.createElement("button");
          zeroButton.textContent = "0";
          zeroButton.classList.add("zero-button");
          zeroButton.style.width = "90px";
          zeroButton.style.height = "70px";
          zeroButton.style.fontSize = "48px";
          zeroButton.addEventListener("click", () => {
            if (quantityInput.value === "0") {
              quantityInput.value = "0";
            } else {
              quantityInput.value += "0";
            }
            quantityInput.dispatchEvent(new Event("input"));
          });
          virtualKeyboard.appendChild(zeroButton);

          // create hide button
          const hideButton = document.createElement("button");
          hideButton.textContent = "Close";
          hideButton.classList.add("hide-button");
          hideButton.addEventListener("click", () => {
            const currentQuantity = parseInt(quantityInput.value);

            if (currentQuantity === 0) {
              // Remove the product container from the DOM
              const productContainer = productQuantityDiv.parentNode;
              productContainer.parentNode.removeChild(productContainer);
            } else {
              // Hide the virtual keyboard
              virtualKeyboardContainer.style.display = "none";
            }
          });
          virtualKeyboard.appendChild(hideButton);

          // add virtual keyboard to container
          virtualKeyboardContainer.appendChild(virtualKeyboard);

          // add virtual keyboard container after quantity input
          quantityInput.parentNode.appendChild(virtualKeyboardContainer);
        } else {
          // Hide any other open virtual keyboard containers
          const openContainers = document.querySelectorAll(
            ".virtual-keyboard-container"
          );
          for (const container of openContainers) {
            container.style.display = "none";
          }

          // Show the current virtual keyboard container
          virtualKeyboardContainer.style.display = "block";
        }
      });

      quantityInput.addEventListener("input", () => {
        let currentQuantity = parseInt(quantityInput.value);

        // Check if the current quantity is less than or equal to 0 or is NaN
        if (currentQuantity <= 0 || isNaN(currentQuantity)) {
          // Set the quantity to a default non-zero value
          currentQuantity = 0;
          quantityInput.value = "0";
        }

        const newPrice =
          currentQuantity *
          parseFloat(productPriceDiv.textContent.slice(2).replace(",", "."));
        const newFullPrice = newPrice.toFixed(2).replace(".", ",");
        const fullPriceDiv = basketProductDiv.querySelector(
          ".basket-product-full-price"
        );
        fullPriceDiv.textContent = `₾ ${newFullPrice}`;

        updateOrderPrice();
      });

      productQuantityDiv.appendChild(quantityInput);

      // quantity modify button

      productQuantityDiv.appendChild(quantityInput);
      basketProductDiv.appendChild(productQuantityDiv);

      // create the product price div and add text content
      const productPriceDiv = document.createElement("div");
      productPriceDiv.classList.add("basket-product-price");
      productPriceDiv.textContent = `₾ ${item.unitPrice}`;
      basketProductDiv.appendChild(productPriceDiv);

      // create the product full price div and add text content
      const productFullPriceDiv = document.createElement("div");
      productFullPriceDiv.classList.add("basket-product-full-price");
      productFullPriceDiv.textContent = `₾ ${item.totalPrice}`;
      basketProductDiv.appendChild(productFullPriceDiv);

      // create the delete icon img element and set attributes
      const deleteIconImg = document.createElement("img");
      deleteIconImg.classList.add("delete-icon");
      deleteIconImg.setAttribute("src", "../photos/delete-icon.svg");
      deleteIconImg.setAttribute("alt", "delete");
      basketProductDiv.appendChild(deleteIconImg);

      // delete
      let confirmationDialog = document.getElementById("confirmation-dialog");
      let confirmButton = document.getElementById("confirm-btn");
      let cancelButton = document.getElementById("cancel-btn");

      deleteIconImg.addEventListener("click", () => {
        confirmationDialog.style.display = "block";
        deleteProduct = deleteIconImg.parentNode;
      });

      confirmButton.addEventListener("click", function () {
        deleteProduct.remove();
        confirmationDialog.style.display = "none";
        updateOrderPrice();
      });

      cancelButton.addEventListener("click", function () {
        confirmationDialog.style.display = "none";
      });

      // append to basket
      basketContainer.appendChild(basketProductDiv);
    }
    updateOrderPrice();
  });
}

// ორდერის შენახვა ან რედაქტირება გაერთიანებული შენახვის ღილაკზე დაჭერისას
const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {

  if (recivedItem) {
    let basketContainer = document.querySelector(".right-basket-container");

    if (basketContainer.innerHTML === "") {
      alert("Basket is empty");
      return;
    }

    const allBasketProducts = document.querySelectorAll(".basket-product");
    const productsData = [];
    allBasketProducts.forEach((product) => {
      const productData = {
        code: product.querySelector(".basket-product-code")?.textContent || "",
        name: product.querySelector(".basket-product-name")?.textContent || "",
        quantity: product.querySelector(".quantity")?.value || "",
        unitPrice:
          product.querySelector(".basket-product-price")?.textContent || "",
        fullPrice:
          product.querySelector(".basket-product-full-price")?.textContent ||
          "",
      };
      productsData.push(productData);
    });

    // Check if any existing product is removed from the basket
    //  if (allBasketProducts.length !== orderDetails.orderItems.length) {
    //   orderDetails.needsApproval = true; // Set needsApproval to true to make the order editable
    // }

    const orderDetails = JSON.parse(savedOrderDetails);
    const requestData = {
      id: orderDetails.id,
      shiftDocumentId: orderDetails.shiftDocumentId,
      price: parseFloat(orderFullPrice.innerHTML.replace(",", ".")),
      userId: orderDetails.userId,
      orderItemCommands: [],
    };

    // Add existing products to requestData

    orderDetails.orderItems.forEach((product, index) => {
      const productData = productsData[index];
      //
      if (productData) {
        const itemId = getProductId(productData).itemId; // Call the getProductId function to get the itemId
        const barcode = getProductId(productData).barcode; // Call the getProductId function to get the barcode

        requestData.orderItemCommands.push({
          id: product.id,
          innerCode: productData.code,
          name: productData.name,
          itemId: itemId, // Add the itemId property
          barcode: barcode, // Add the barcode property
          quantity: parseInt(productData.quantity),
          unitPrice: parseFloat(
            productData.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
          totalPrice: parseFloat(
            productData.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
        });
      }
    });

    // ფუნქცია აბრუნებს ობიექტად აითემ აიდის და შტრიხ კოდს
    function getProductId(product) {
      const item = productsListData.filter(
        (data) => product.code === data.innerCode
      );
      // return item[0].itemId;
      return {
        itemId: item[0].itemId,
        barcode: item[0].barcode,
      };
    }
    //თუ ახალი დამატებულია პროდუქტი არაქვს id
    const newProducts = productsData.slice(orderDetails.orderItems.length);
    newProducts.forEach((product) => {
      const itemId = getProductId(product).itemId;
      const barcode = getProductId(product).barcode;

      requestData.orderItemCommands.push({
        innerCode: product.code,
        name: product.name,
        itemId: itemId,
        barcode: barcode,

        quantity: parseInt(product.quantity),
        unitPrice: parseFloat(
          product.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
        totalPrice: parseFloat(
          product.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
      });
    });


    // Uncomment the following code to send the PUT request

    fetch("http://5.152.108.245:8088/api/v1/order/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json-patch+json",
        accept: "text/plain",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle the successful response from the server here
          const basketContainer = document.querySelector(
            ".right-basket-container"
          );
          const savedText = document.createElement("div");
          savedText.classList.add("saved-text");
          savedText.innerHTML = "რედაქტირებულია";
          basketContainer.innerHTML = "";
          updateOrderPrice();

          basketContainer.appendChild(savedText);
          setTimeout(() => {
            basketContainer.innerHTML = "";
          }, 1000);
        } else {
          throw new Error("Request failed with status " + response.status);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });

    recivedItem = false;
    localStorage.removeItem("orderDetails");
    updateOrderPrice();
  } else {
    let BasketContainer = document.querySelector(".right-basket-container");

    if (BasketContainer.innerHTML === "") {
      alert("basket is empty");
      return;
    }

    const allBasketProducts = document.querySelectorAll(".basket-product");
    const productsData = [];
    allBasketProducts.forEach((product) => {
      const productData = {
        code: product.querySelector(".basket-product-code").textContent,
        name: product.querySelector(".basket-product-name").textContent,
        quantity: product.querySelector(".quantity").value,
        unitPrice: product.querySelector(".basket-product-price").textContent,
        fullPrice: product.querySelector(".basket-product-full-price")
          .textContent,
      };
      productsData.push(productData);
    });

  
    // ფუნქცია აბრუნებს ობიექტად აითემ აიდის და შტრიხ კოდს
    function getProductId(product) {
      const item = productsListData.filter(
        (data) => product.code === data.innerCode
      );
      // return item[0].itemId;
      return {
        itemId: item[0].itemId,
        barcode: item[0].barcode,
      };
    }
    const requestData = {
      shiftDocumentId: localStorage.getItem("shiftDocumentId"),
      price: parseFloat(orderFullPrice.innerHTML.replace(",", ".")),
      userId: 10,
      orderItemCommands: productsData.map((product) => ({
        innerCode: product.code,
        name: product.name,
        itemId: getProductId(product).itemId,
        barcode: getProductId(product).barcode,
        quantity: parseInt(product.quantity),
        unitPrice: parseFloat(
          product.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
        totalPrice: parseFloat(
          product.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
      })),
    };
    fetch("http://5.152.108.245:8088/api/v1/order/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
        accept: "text/plain",
      },
      body: JSON.stringify(requestData),
    })
      .then((responseText) => {
        // Handle the response from the server here
        if (responseText.status === 200) {
          // add success message
          const basketContainer = document.querySelector(
            ".right-basket-container"
          );
          const savedText = document.createElement("div");
          savedText.classList.add("saved-text");
          savedText.innerHTML = "შეკვეთა შენახულია";
          basketContainer.innerHTML = "";
          updateOrderPrice();
          basketContainer.appendChild(savedText);
          setTimeout(() => {
            basketContainer.innerHTML = "";
          }, 1000);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });

    localStorage.removeItem("orderDetails");
  }
  //end of else block
});

// Get references to the container and button
const numericContainer = document.getElementById("numeric-container");
const showNumericButton = document.getElementById("show-numeric");

// Initially hide the container
numericContainer.style.display = "none";
const input = document.querySelector(".input-numeric");
const buttons = document.querySelectorAll(".key");

// Add event listener to each button
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the clicked button's value
    const value = button.dataset.key;

    // Handle backspace and clear buttons
    if (value === "del") {
      input.value = input.value.slice(0, -1);
    } else if (value === "clear") {
      input.value = "";
    } else {
      input.value += value;
    }
  });
});

//ბარათით გადახდა, ჯერ ვინახავთ და შემდეგ ვიხდით////////////////////////
const payWithCard = document.getElementById("payWithCard");
const newBoxes = document.getElementById("new-boxes");

payWithCard.addEventListener("click", () => {
  // numericContainer.style.display = "block";
  // newBoxes.classList.toggle("show");
  newBoxes.style.display = 'block'
  // NOTE
  // ბარათის დაჭერაზე მოხდება ორი ბარათის ICON ამოსვლა ერთი თიბისი მეორე საქართველო
  // თითოეულზე დაჭერისას მოხდება შენახვა ან რედაქტირება და შემდეგ ამოვა  ციფრების
  // კონტეინერი და მანდ მოლარე შეიყვანს თანხას რომელიც
  // გაეგზავნება ტერმინალს გადასახდელად იქიდან რომ დაბრუნდება პასუხი გადახდილი
  // შემდეგ ბექს გავუგზავნით გადახდის რექვესთს paymentType 3 და აპლიკაციაშიც მოხდება გადახდა.

  // შევქმენით დინამიურად თიბისის და საქართველოს ბანკის გადახდის ღილაკები რომლებზეც ხდება
  // შენახვაა ან რედაქტირება


  const TBC = document.querySelector(".TBC");
  TBC.addEventListener("click", () => {
  // newBoxes.classList.toggle("show");

    newBoxes.style.display = "none";
 
    // თუ უკვე შენახული შეკვეთა გადმოვიტანეთ გადასახდელად ან
    // შენახული შეკვეთა გადმოვიტანეთ და დავაჭირეთ
    // თუ ლოკალ სთორიჯში არის უკვე შენახული ორდერის იფორმაცია if(recivedItem)
    if (recivedItem) {
      let basketContainer = document.querySelector(".right-basket-container");

      if (basketContainer.innerHTML === "") {
        alert("Basket is empty");
        return;
      }

      const allBasketProducts = document.querySelectorAll(".basket-product");
      const productsData = [];
      allBasketProducts.forEach((product) => {
        const productData = {
          code:
            product.querySelector(".basket-product-code")?.textContent || "",
          name:
            product.querySelector(".basket-product-name")?.textContent || "",
          quantity: product.querySelector(".quantity")?.value || "",
          unitPrice:
            product.querySelector(".basket-product-price")?.textContent || "",
          fullPrice:
            product.querySelector(".basket-product-full-price")?.textContent ||
            "",
        };
        productsData.push(productData);
      });
      const orderDetails = JSON.parse(savedOrderDetails);
      const requestData = {
        id: orderDetails.id,
        shiftDocumentId: orderDetails.shiftDocumentId,
        price: parseFloat(orderFullPrice.innerHTML.replace(",", ".")),
        userId: orderDetails.userId,
        orderItemCommands: [],
      };

      // Add existing products to requestData

      orderDetails.orderItems.forEach((product, index) => {
        const productData = productsData[index];
        //
        if (productData) {
          const itemId = getProductId(productData).itemId;
          const barcode = getProductId(productData).barcode;

          requestData.orderItemCommands.push({
            id: product.id,
            innerCode: productData.code,
            name: productData.name,
            itemId: itemId,
            barcode: barcode,
            quantity: parseInt(productData.quantity),
            unitPrice: parseFloat(
              productData.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
            ),
            totalPrice: parseFloat(
              productData.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
            ),
          });
        }
      });
      // ფუნქცია აბრუნებს ობიექტად აითემ აიდის და შტრიხ კოდს
      function getProductId(product) {
        const item = productsListData.filter(
          (data) => product.code === data.innerCode
        );
        // return item[0].itemId;
        return {
          itemId: item[0].itemId,
          barcode: item[0].barcode,
        };
      }
      //თუ ახალი დამატებულია პროდუქტი არაქვს id
      const newProducts = productsData.slice(orderDetails.orderItems.length);
      newProducts.forEach((product) => {
        const itemId = getProductId(product).itemId;
        const barcode = getProductId(product).barcode;
        requestData.orderItemCommands.push({
          innerCode: product.code,
          name: product.name,
          itemId: itemId,
          barcode: barcode,
          quantity: parseInt(product.quantity),
          unitPrice: parseFloat(
            product.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
          totalPrice: parseFloat(
            product.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
        });
      });

      // ხდება ედით მეთოდი ქეშით გადახდაზე დაჭერისას
      fetch("http://5.152.108.245:8088/api/v1/order/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json-patch+json",
          accept: "text/plain",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (response.ok) {
            cashPayBtn();

            // რედაქტირებული ორდერის წაშლა Cancel ღილაკზე
            const cancelBtn = document.querySelector(".cancel");
            cancelBtn.addEventListener("click", () => {
              fetch("http://5.152.108.245:8088/api/v1/order/delete", {
                method: "DELETE",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  id: orderDetails.id,
                }),
              })
                .then((response) => {
                  if (response.ok) {
                    // location.reload()
                    numericContainer.style.display = "none";
                    input.value = "";
                  } else {
                    console.error("DELETE request failed");
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      let agreeBtn = document.querySelector(".agree");
      agreeBtn.addEventListener("click", () => {
        let BasketContainer = document.querySelector(".right-basket-container");
        if (BasketContainer.innerHTML === "") {
          alert("empty");
          return;
        }

        let numberInputValue = Number(input.value);

        fullCost = orderFullPrice.textContent;

        fullCost = Number(fullCost) - numberInputValue;
        fullCost = Math.round(fullCost * 100) / 100;
        fullCost = fullCost.toFixed(2);


        if (numberInputValue < orderFullPrice.textContent) {


          fetch("http://5.152.108.245:8088/api/v1/order/pay", {
            method: "PATCH",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json-patch+json",
            },
            body: JSON.stringify({
              orderId: orderDetails.id,
              createChequeDocumentCommand: {
                paymentTypeId: paymentTypeIdCard,
                price: numberInputValue,
                orderId: orderDetails.id,
                createChequeDate: currentDate,
              },
            }),
          })
            .then((response) => {
              if (response.status === 200) {
                input.value = fullCost;
                numericContainer.style.display = "none";
                orderFullPrice.textContent = fullCost;
                return;
              }
            })
            .catch((err) => console.log(err));
        }

        /////
        if (numberInputValue > orderFullPrice.textContent) {

          fetch("http://5.152.108.245:8088/api/v1/order/pay", {
            method: "PATCH",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json-patch+json",
            },
            body: JSON.stringify({
              orderId: orderDetails.id,
              createChequeDocumentCommand: {
                paymentTypeId: paymentTypeIdCard,
                price: Number(orderFullPrice.textContent),
                orderId: orderDetails.id,
                createChequeDate: currentDate,
              },
            }),
          })
            .then((response) => {
              if (response.status === 200) {
                var change = numberInputValue - orderFullPrice.textContent;
                var roundedChange = change.toFixed(2);

                const basketContainer = document.querySelector(
                  ".right-basket-container"
                );
                const savedText = document.createElement("div");
                savedText.classList.add("saved-text");
                savedText.innerHTML = `გადახდა დასრულდა </br> ხურდა ₾${roundedChange}`;
                basketContainer.innerHTML = "";
                updateOrderPrice();
                let okBtn = document.createElement("div");
                okBtn.classList.add("okBtn");
                okBtn.textContent = "OK";
                savedText.appendChild(okBtn);
                basketContainer.appendChild(savedText);
                okBtn.addEventListener("click", () => {
                  basketContainer.innerHTML = "";
                  location.reload();
                });

                input.value = "";
                numericContainer.style.display = "none";
                return;
              }
            })
            .catch((err) => console.log(err));
        }

        if (numberInputValue == orderFullPrice.textContent) {
   

          fetch("http://5.152.108.245:8088/api/v1/order/pay", {
            method: "PATCH",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json-patch+json",
            },
            body: JSON.stringify({
              orderId: orderDetails.id,
              createChequeDocumentCommand: {
                paymentTypeId: paymentTypeIdCard,
                price: Number(numberInputValue),
                orderId: orderDetails.id,
                createChequeDate: currentDate,
              },
            }),
          })
            .then((payResponse) => {
              if (payResponse.status === 200) {

                const basketContainer = document.querySelector(
                  ".right-basket-container"
                );
                const savedText = document.createElement("div");
                savedText.classList.add("saved-text");
                savedText.innerHTML = "გადახდა დასრულდა ";
                basketContainer.innerHTML = "";


                updateOrderPrice();
                let okBtn = document.createElement("div");
                okBtn.classList.add("okBtn");
                okBtn.textContent = "OK";
                savedText.appendChild(okBtn);
                basketContainer.appendChild(savedText);
                okBtn.addEventListener("click", () => {
                  localStorage.removeItem("orderId");
              

               
                  basketContainer.innerHTML = "";
                  location.reload();
             
                });

                input.value = "";
                numericContainer.style.display = "none";
              } else {
                console.log("err");
                return;
              }
            })
            .catch((error) => console.error(error));
        }
      });

    } 
    ////////////////////////////////////
    /////////////////////////////////////
    //////////////////////////////////////
    //შენახვა და მერე ბარათით გადახდა
    else {

     

      let BasketContainer = document.querySelector(".right-basket-container");

      if (BasketContainer.innerHTML === "") {
        alert("basket is empty");
        return;
      }

      const allBasketProducts = document.querySelectorAll(".basket-product");
      const productsData = [];
      allBasketProducts.forEach((product) => {
        const productData = {
          code: product.querySelector(".basket-product-code").textContent,
          name: product.querySelector(".basket-product-name").textContent,
          quantity: product.querySelector(".quantity").value,
          unitPrice: product.querySelector(".basket-product-price").textContent,
          fullPrice: product.querySelector(".basket-product-full-price")
            .textContent,
        };
        productsData.push(productData);
      });

  
      // Get itemId function
      // ფუნქცია აბრუნებს ობიექტად აითემ აიდის და შტრიხ კოდს
      function getProductId(product) {
        const item = productsListData.filter(
          (data) => product.code === data.innerCode
        );
        // return item[0].itemId;
        return {
          itemId: item[0].itemId,
          barcode: item[0].barcode,
        };
      }
      //ვიძახებთ ფუნქციას და რესულტში ვინახავთ ობიექტს რაც დაბრუნდა
      // აითემ აიდი და ბარკოდი ობიექტის სახით
      // const result = getProductId(product);
      const requestData = {
        shiftDocumentId: localStorage.getItem("shiftDocumentId"),
        price: parseFloat(orderFullPrice.innerHTML.replace(",", ".")),
        userId: 10,
        orderItemCommands: productsData.map((product) => ({
          innerCode: product.code,
          name: product.name,
          itemId: getProductId(product).itemId,
          barcode: getProductId(product).barcode,
          quantity: parseInt(product.quantity),
          unitPrice: parseFloat(
            product.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
          totalPrice: parseFloat(
            product.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
        })),
      };

    
       if (localStorage.getItem("orderId")) {
          cashPayBtn();
          newBoxes.style.display = 'none';
         const removeClickListener = payCardFunction(JSON.parse(localStorage.getItem("orderId")),paymentTypeIdCard)
         return;
    }
      fetch("http://5.152.108.245:8088/api/v1/order/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
          accept: "text/plain",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((orderId) => {
          // Handle the response from the server here
          localStorage.setItem("orderId", orderId);
          if (orderId) {
            //PAYMENT TYPE ID 2 = CASH
            // add success message
            cashPayBtn();

            // შენახული ორდერის წაშლა Cancel ღილაკზე
            const cancelBtn = document.querySelector(".cancel");
            cancelBtn.addEventListener("click", () => {
              fetch("http://5.152.108.245:8088/api/v1/order/delete", {
                method: "DELETE",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  id: orderId,
                }),
              })
                .then((response) => {
                  if (response.ok) {
                    // location.reload()
                    numericContainer.style.display = "none";
                    input.value = "";
                  } else if (response.status === 409) {
                    numericContainer.style.display = "none";
                  } else {
                    console.error("DELETE request failed");
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            });

            const removeClickListener = payCardFunction(orderId,paymentTypeIdCard)

          }

          //2 then ends here
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error("Error:", error);
        });
    }

    // TBC გადახდა აქამდე
  });

  // თიბისის ბარათით გადახდა
  // openPos();

  ///////////////////////////////////////////////////////////////////
  // მთლიანი ბარათით გადახდა სრულდება აქ
});

// გადახდა ქეშით, ჯერ ვინახავთ შემდეგ ვიხდით/////////////////////////////////////
const cashPay = document.getElementById("cashPay");
cashPay.addEventListener("click", () => {

  // თუ ლოკალ სთორიჯში არის უკვე შენახული ორდერის იფორმაცია if(recivedItem)
  if (recivedItem) {
    let basketContainer = document.querySelector(".right-basket-container");

    if (basketContainer.innerHTML === "") {
      alert("Basket is empty");
      return;
    }

    const allBasketProducts = document.querySelectorAll(".basket-product");
    const productsData = [];
    allBasketProducts.forEach((product) => {
      const productData = {
        code: product.querySelector(".basket-product-code")?.textContent || "",
        name: product.querySelector(".basket-product-name")?.textContent || "",
        quantity: product.querySelector(".quantity")?.value || "",
        unitPrice:
          product.querySelector(".basket-product-price")?.textContent || "",
        fullPrice:
          product.querySelector(".basket-product-full-price")?.textContent ||
          "",
      };
      productsData.push(productData);
    });
    const orderDetails = JSON.parse(savedOrderDetails);
    const requestData = {
      id: orderDetails.id,
      shiftDocumentId: orderDetails.shiftDocumentId,
      price: parseFloat(orderFullPrice.innerHTML.replace(",", ".")),
      userId: orderDetails.userId,
      orderItemCommands: [],
    };

    // Add existing products to requestData

    orderDetails.orderItems.forEach((product, index) => {
      const productData = productsData[index];
      //
      if (productData) {
        const itemId = getProductId(productData).itemId;
        const barcode = getProductId(productData).barcode;

        requestData.orderItemCommands.push({
          id: product.id,
          innerCode: productData.code,
          name: productData.name,
          itemId: itemId,
          barcode: barcode,
          quantity: parseInt(productData.quantity),
          unitPrice: parseFloat(
            productData.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
          totalPrice: parseFloat(
            productData.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
          ),
        });
      }
    });
    // ფუნქცია აბრუნებს ობიექტად აითემ აიდის და შტრიხ კოდს
    function getProductId(product) {
      const item = productsListData.filter(
        (data) => product.code === data.innerCode
      );
      // return item[0].itemId;
      return {
        itemId: item[0].itemId,
        barcode: item[0].barcode,
      };
    }
    //თუ ახალი დამატებულია პროდუქტი არაქვს id
    const newProducts = productsData.slice(orderDetails.orderItems.length);
    newProducts.forEach((product) => {
      const itemId = getProductId(product).itemId;
      const barcode = getProductId(product).barcode;
      requestData.orderItemCommands.push({
        innerCode: product.code,
        name: product.name,
        itemId: itemId,
        barcode: barcode,
        quantity: parseInt(product.quantity),
        unitPrice: parseFloat(
          product.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
        totalPrice: parseFloat(
          product.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
      });
    });

    // ხდება ედით მეთოდი ქეშით გადახდაზე დაჭერისას
    fetch("http://5.152.108.245:8088/api/v1/order/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json-patch+json",
        accept: "text/plain",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          cashPayBtn();

          // რედაქტირებული ორდერის წაშლა Cancel ღილაკზე
          const cancelBtn = document.querySelector(".cancel");
          cancelBtn.addEventListener("click", () => {
            fetch("http://5.152.108.245:8088/api/v1/order/delete", {
              method: "DELETE",
              headers: {
                accept: "*/*",
                "Content-Type": "application/json-patch+json",
              },
              body: JSON.stringify({
                id: orderDetails.id,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  // location.reload()
                  numericContainer.style.display = "none";
                  input.value = "";
                } else {
                  console.error("DELETE request failed");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });

          ////////////////////////////////////// გადახდა
          let agreeBtn = document.querySelector(".agree");
          agreeBtn.addEventListener("click", () => {
            let BasketContainer = document.querySelector(
              ".right-basket-container"
            );
            if (BasketContainer.innerHTML === "") {
              alert("empty");
              return;
            }

            let numberInputValue = Number(input.value);
            // let sxvaoba = numberInputValue - Number(fullCost);
            // sxvaoba =  Math.round(sxvaoba * 100) / 100;
            // console.log(sxvaoba,'სხვაობა გადახდილი თანხის და გადასახდელი თანხის')

            fullCost = orderFullPrice.textContent;
            // მეორედ შემოსვლისას 0 - numberiNPut value და ვიღებთ არასწორს შედეგს
            fullCost = Number(fullCost) - numberInputValue;
            fullCost = Math.round(fullCost * 100) / 100; // round to two decimal places
            // orderFullPrice.textContent = fullCost
            fullCost = fullCost.toFixed(2);

          

            if (numberInputValue < orderFullPrice.textContent) {
        
              // ფასში ვატანთ numberInputValue ანუ შეყვანილ თანხას
              fetch("http://5.152.108.245:8088/api/v1/order/pay", {
                method: "PATCH",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  orderId: orderDetails.id,
                  createChequeDocumentCommand: {
                    paymentTypeId: 2,
                    price: numberInputValue,
                    orderId: orderDetails.id,
                    createChequeDate: currentDate,
                  },
                }),
              })
                .then((response) => {
                  if (response.status === 200) {
                    input.value = fullCost;
                    numericContainer.style.display = "none";
                    orderFullPrice.textContent = fullCost;
                    return;
                  }
                })
                .catch((err) => console.log(err));
            }

            /////
            if (numberInputValue > orderFullPrice.textContent) {
              fetch("http://5.152.108.245:8088/api/v1/order/pay", {
                method: "PATCH",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  orderId: orderDetails.id,
                  createChequeDocumentCommand: {
                    paymentTypeId: 2,
                    price: Number(orderFullPrice.textContent),
                    orderId: orderDetails.id,
                    createChequeDate: currentDate,
                  },
                }),
              })
                .then((response) => {
                  if (response.status === 200) {
                    var change = numberInputValue - orderFullPrice.textContent;
                    var roundedChange = change.toFixed(2);
                    // input.value = fullCost

                    // orderFullPrice.textContent = input.value
                    // add success message
                    const basketContainer = document.querySelector(
                      ".right-basket-container"
                    );
                    const savedText = document.createElement("div");
                    savedText.classList.add("saved-text");
                    savedText.innerHTML = `გადახდა დასრულდა </br> ხურდა ₾${roundedChange}`;
                    basketContainer.innerHTML = "";
                    updateOrderPrice();
                    let okBtn = document.createElement("div");
                    okBtn.classList.add("okBtn");
                    okBtn.textContent = "OK";
                    savedText.appendChild(okBtn);
                    basketContainer.appendChild(savedText);
                    okBtn.addEventListener("click", () => {
                      basketContainer.innerHTML = "";
                      location.reload();
                    });
                    // Clear input and set total price to 0
                    input.value = "";
                    // orderFullPrice.textContent = '';
                    numericContainer.style.display = "none";
                    return;
                  }
                })
                .catch((err) => console.log(err));
            }

            // ან orderFullPrice.textContent === 0 {}
            if (numberInputValue == orderFullPrice.textContent) {
              // var change = orderFullPrice.textContent
   

              fetch("http://5.152.108.245:8088/api/v1/order/pay", {
                method: "PATCH",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  orderId: orderDetails.id,
                  createChequeDocumentCommand: {
                    paymentTypeId: 2,
                    price: Number(numberInputValue),
                    orderId: orderDetails.id,
                    createChequeDate: currentDate,
                  },
                }),
              })
                // .then(response => response.json())
                .then((payResponse) => {
                  if (payResponse.status === 200) {

                    // add success message
                    const basketContainer = document.querySelector(
                      ".right-basket-container"
                    );
                    const savedText = document.createElement("div");
                    savedText.classList.add("saved-text");
                    savedText.innerHTML = "გადახდა დასრულდა ";
                    basketContainer.innerHTML = "";
                

                    updateOrderPrice();
                    let okBtn = document.createElement("div");
                    okBtn.classList.add("okBtn");
                    okBtn.textContent = "OK";
                    savedText.appendChild(okBtn);
                    basketContainer.appendChild(savedText);
                    okBtn.addEventListener("click", () => {
                      localStorage.removeItem("orderId");
                  

                      // orderFullPrice.textContent = fullCost;
                      //რეფრეშის გარეშე გადახდა ხდება წინა ორდერზეც და უკვე გადახდილ ორდერზე ბრუნდება 409
                      location.reload();
                      // updateOrderPrice();
                    });
                    // Clear input and set total price to 0
                    input.value = "";
                    // orderFullPrice.textContent = '';
                    numericContainer.style.display = "none";
                  } else {
                    console.log("err");
                    return;
                  }
                })
                .catch((error) => console.error(error));
            }
          });
        } else {
          throw new Error("Request failed with status " + response.status);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });

    recivedItem = false;
    localStorage.removeItem("orderDetails");
    updateOrderPrice();
  } else {
    //////////////////////////////////////////
    //////////////////////////////////////
    /////////////////////////////////
    //შენახვა და მერე გადახდა

    // save order/////////////////////////////////////////////////////////
    let BasketContainer = document.querySelector(".right-basket-container");

    if (BasketContainer.innerHTML === "") {
      alert("basket is empty");
      return;
    }

    const allBasketProducts = document.querySelectorAll(".basket-product");
    const productsData = [];
    allBasketProducts.forEach((product) => {
      const productData = {
        code: product.querySelector(".basket-product-code").textContent,
        name: product.querySelector(".basket-product-name").textContent,
        quantity: product.querySelector(".quantity").value,
        unitPrice: product.querySelector(".basket-product-price").textContent,
        fullPrice: product.querySelector(".basket-product-full-price")
          .textContent,
      };
      productsData.push(productData);
    });

 
    // Get itemId function
    // ფუნქცია აბრუნებს ობიექტად აითემ აიდის და შტრიხ კოდს
    function getProductId(product) {
      const item = productsListData.filter(
        (data) => product.code === data.innerCode
      );
      // return item[0].itemId;
      return {
        itemId: item[0].itemId,
        barcode: item[0].barcode,
      };
    }
    //ვიძახებთ ფუნქციას და რესულტში ვინახავთ ობიექტს რაც დაბრუნდა
    // აითემ აიდი და ბარკოდი ობიექტის სახით
    // const result = getProductId(product);
    const requestData = {
      shiftDocumentId: localStorage.getItem("shiftDocumentId"),
      price: parseFloat(orderFullPrice.innerHTML.replace(",", ".")),
      userId: 10,
      orderItemCommands: productsData.map((product) => ({
        innerCode: product.code,
        name: product.name,
        itemId: getProductId(product).itemId,
        barcode: getProductId(product).barcode,
        quantity: parseInt(product.quantity),
        unitPrice: parseFloat(
          product.unitPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
        totalPrice: parseFloat(
          product.fullPrice.replace(/[^\d,.]/g, "").replace(",", ".")
        ),
      })),
    };

    //SAVE ORDER ON CLICK CASH
    if (localStorage.getItem("orderId")) {
      cashPayBtn();
       newBoxes.style.display = 'none';
       let agreeBtn = document.querySelector(".agree");
       agreeBtn.addEventListener("click", () => {
         let BasketContainer = document.querySelector(
           ".right-basket-container"
         );
         if (BasketContainer.innerHTML === "") {
           alert("empty");
           return;
         }

         let numberInputValue = Number(input.value);
         // let sxvaoba = numberInputValue - Number(fullCost);
         // sxvaoba =  Math.round(sxvaoba * 100) / 100;
         // console.log(sxvaoba,'სხვაობა გადახდილი თანხის და გადასახდელი თანხის')

         fullCost = orderFullPrice.textContent;
         // მეორედ შემოსვლისას 0 - numberiNPut value და ვიღებთ არასწორს შედეგს
         fullCost = Number(fullCost) - numberInputValue;
         fullCost = Math.round(fullCost * 100) / 100; // round to two decimal places
         fullCost = fullCost.toFixed(2);
         // orderFullPrice.textContent = fullCost

   

         if (numberInputValue < orderFullPrice.textContent) {
      
           // ფასში ვატანთ numberInputValue ანუ შეყვანილ თანხას
           fetch("http://5.152.108.245:8088/api/v1/order/pay", {
             method: "PATCH",
             headers: {
               accept: "*/*",
               "Content-Type": "application/json-patch+json",
             },
             body: JSON.stringify({
               orderId: JSON.parse(localStorage.getItem("orderId")),
               createChequeDocumentCommand: {
                 paymentTypeId: 2,
                 price: numberInputValue,
                 orderId: JSON.parse(localStorage.getItem("orderId")),
                 createChequeDate: currentDate,
               },
             }),
           })
             .then((response) => {
               if (response.status === 200) {
                 input.value = fullCost;
                 numericContainer.style.display = "none";
                 orderFullPrice.textContent = fullCost;
                 return;
               }
             })
             .catch((err) => console.log(err));
         }

         /////
         if (numberInputValue > orderFullPrice.textContent) {
           fetch("http://5.152.108.245:8088/api/v1/order/pay", {
             method: "PATCH",
             headers: {
               accept: "*/*",
               "Content-Type": "application/json-patch+json",
             },
             body: JSON.stringify({
               orderId: JSON.parse(localStorage.getItem("orderId")),
               createChequeDocumentCommand: {
                 paymentTypeId: 2,
                 price: Number(orderFullPrice.textContent),
                 orderId: JSON.parse(localStorage.getItem("orderId")),
                 createChequeDate: currentDate,
               },
             }),
           })
             .then((response) => {
               if (response.status === 200) {
                 var change = numberInputValue - orderFullPrice.textContent;
                 var roundedChange = change.toFixed(2);

                 // input.value = fullCost

                 // orderFullPrice.textContent = input.value
                 // add success message
                 const basketContainer = document.querySelector(
                   ".right-basket-container"
                 );
                 const savedText = document.createElement("div");
                 savedText.classList.add("saved-text");
                 savedText.innerHTML = `გადახდა დასრულდა </br> ხურდა ₾${roundedChange}`;
                 basketContainer.innerHTML = "";
                 updateOrderPrice();
                 let okBtn = document.createElement("div");
                 okBtn.classList.add("okBtn");
                 okBtn.textContent = "OK";
                 savedText.appendChild(okBtn);
                 basketContainer.appendChild(savedText);
                 okBtn.addEventListener("click", () => {
                   basketContainer.innerHTML = "";
                   localStorage.removeItem("orderId");
                   location.reload();
                 });
                 // Clear input and set total price to 0
                 input.value = "";
                 // orderFullPrice.textContent = '';
                 numericContainer.style.display = "none";
                 return;
               }
             })
             .catch((err) => console.log(err));
         }

         // ან orderFullPrice.textContent === 0 {}
         if (numberInputValue == orderFullPrice.textContent) {
           // var change = orderFullPrice.textContent
        
    

           fetch("http://5.152.108.245:8088/api/v1/order/pay", {
             method: "PATCH",
             headers: {
               accept: "*/*",
               "Content-Type": "application/json-patch+json",
             },
             body: JSON.stringify({
               orderId: JSON.parse(localStorage.getItem("orderId")),
               createChequeDocumentCommand: {
                 paymentTypeId: 2,
                 price: Number(numberInputValue),
                 orderId: JSON.parse(localStorage.getItem("orderId")),
                 createChequeDate: currentDate,
               },
             }),
           })
             // .then(response => response.json())
             .then((payResponse) => {
               if (payResponse.status === 200) {

                 // add success message
                 const basketContainer = document.querySelector(
                   ".right-basket-container"
                 );
                 const savedText = document.createElement("div");
                 savedText.classList.add("saved-text");
                 savedText.innerHTML = "გადახდა დასრულდა ";
                 basketContainer.innerHTML = "";

                 // fullCost = 0;

                 updateOrderPrice();
                 let okBtn = document.createElement("div");
                 okBtn.classList.add("okBtn");
                 okBtn.textContent = "OK";
                 savedText.appendChild(okBtn);
                 basketContainer.appendChild(savedText);
                 okBtn.addEventListener("click", () => {
                   localStorage.removeItem("orderId");

              

                   // orderFullPrice.textContent = fullCost;
                   //რეფრეშის გარეშე გადახდა ხდება წინა ორდერზეც და უკვე გადახდილ ორდერზე ბრუნდება 409
                   location.reload();
                   // updateOrderPrice();
                   basketContainer.innerHTML = "";
                 });
                 // Clear input and set total price to 0
                 input.value = "";
                 // orderFullPrice.textContent = '';
                 numericContainer.style.display = "none";
               } else {
                 console.log("err");
                 return;
               }
             })
             .catch((error) => console.error(error));
         }
       });
      return;
    }
    fetch("http://5.152.108.245:8088/api/v1/order/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
        accept: "text/plain",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((orderId) => {
        // Handle the response from the server here
        localStorage.setItem("orderId", orderId);
        if (orderId) {
          //PAYMENT TYPE ID 2 = CASH
          // add success message
          cashPayBtn();

          // შენახული ორდერის წაშლა Cancel ღილაკზე
          const cancelBtn = document.querySelector(".cancel");
          cancelBtn.addEventListener("click", () => {
            fetch("http://5.152.108.245:8088/api/v1/order/delete", {
              method: "DELETE",
              headers: {
                accept: "*/*",
                "Content-Type": "application/json-patch+json",
              },
              body: JSON.stringify({
                id: orderId,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  // location.reload()
                  numericContainer.style.display = "none";
                  input.value = "";
                } else if (response.status === 409) {
                  numericContainer.style.display = "none";
                } else {
                  console.error("DELETE request failed");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
          let agreeBtn = document.querySelector(".agree");
          agreeBtn.addEventListener("click", () => {
            let BasketContainer = document.querySelector(
              ".right-basket-container"
            );
            if (BasketContainer.innerHTML === "") {
              alert("empty");
              return;
            }

            let numberInputValue = Number(input.value);
            // let sxvaoba = numberInputValue - Number(fullCost);
            // sxvaoba =  Math.round(sxvaoba * 100) / 100;
            // console.log(sxvaoba,'სხვაობა გადახდილი თანხის და გადასახდელი თანხის')

            fullCost = orderFullPrice.textContent;
            // მეორედ შემოსვლისას 0 - numberiNPut value და ვიღებთ არასწორს შედეგს
            fullCost = Number(fullCost) - numberInputValue;
            fullCost = Math.round(fullCost * 100) / 100; // round to two decimal places
            fullCost = fullCost.toFixed(2);
            // orderFullPrice.textContent = fullCost

        

            if (numberInputValue < orderFullPrice.textContent) {
         
              // ფასში ვატანთ numberInputValue ანუ შეყვანილ თანხას
              fetch("http://5.152.108.245:8088/api/v1/order/pay", {
                method: "PATCH",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  orderId: orderId,
                  createChequeDocumentCommand: {
                    paymentTypeId: 2,
                    price: numberInputValue,
                    orderId: orderId,
                    createChequeDate: currentDate,
                  },
                }),
              })
                .then((response) => {
                  if (response.status === 200) {
                    input.value = fullCost;
                    numericContainer.style.display = "none";
                    orderFullPrice.textContent = fullCost;
                    return;
                  }
                })
                .catch((err) => console.log(err));
            }

            /////
            if (numberInputValue > orderFullPrice.textContent) {
              fetch("http://5.152.108.245:8088/api/v1/order/pay", {
                method: "PATCH",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  orderId: orderId,
                  createChequeDocumentCommand: {
                    paymentTypeId: 2,
                    price: Number(orderFullPrice.textContent),
                    orderId: orderId,
                    createChequeDate: currentDate,
                  },
                }),
              })
                .then((response) => {
                  if (response.status === 200) {
                    var change = numberInputValue - orderFullPrice.textContent;
                    var roundedChange = change.toFixed(2);

                    // input.value = fullCost

                    // orderFullPrice.textContent = input.value
                    // add success message
                    const basketContainer = document.querySelector(
                      ".right-basket-container"
                    );
                    const savedText = document.createElement("div");
                    savedText.classList.add("saved-text");
                    savedText.innerHTML = `გადახდა დასრულდა </br> ხურდა ₾${roundedChange}`;
                    basketContainer.innerHTML = "";
                    updateOrderPrice();
                    let okBtn = document.createElement("div");
                    okBtn.classList.add("okBtn");
                    okBtn.textContent = "OK";
                    savedText.appendChild(okBtn);
                    basketContainer.appendChild(savedText);
                    okBtn.addEventListener("click", () => {
                      basketContainer.innerHTML = "";
                      localStorage.removeItem("orderId");
                      location.reload();
                    });
                    // Clear input and set total price to 0
                    input.value = "";
                    // orderFullPrice.textContent = '';
                    numericContainer.style.display = "none";
                    return;
                  }
                })
                .catch((err) => console.log(err));
            }

            // ან orderFullPrice.textContent === 0 {}
            if (numberInputValue == orderFullPrice.textContent) {
              // var change = orderFullPrice.textContent

              fetch("http://5.152.108.245:8088/api/v1/order/pay", {
                method: "PATCH",
                headers: {
                  accept: "*/*",
                  "Content-Type": "application/json-patch+json",
                },
                body: JSON.stringify({
                  orderId: orderId,
                  createChequeDocumentCommand: {
                    paymentTypeId: 2,
                    price: Number(numberInputValue),
                    orderId: orderId,
                    createChequeDate: currentDate,
                  },
                }),
              })
                // .then(response => response.json())
                .then((payResponse) => {
                  if (payResponse.status === 200) {

                    // add success message
                    const basketContainer = document.querySelector(
                      ".right-basket-container"
                    );
                    const savedText = document.createElement("div");
                    savedText.classList.add("saved-text");
                    savedText.innerHTML = "გადახდა დასრულდა ";
                    basketContainer.innerHTML = "";

                    updateOrderPrice();
                    let okBtn = document.createElement("div");
                    okBtn.classList.add("okBtn");
                    okBtn.textContent = "OK";
                    savedText.appendChild(okBtn);
                    basketContainer.appendChild(savedText);
                    okBtn.addEventListener("click", () => {
                      localStorage.removeItem("orderId");


                      // orderFullPrice.textContent = fullCost;
                      //რეფრეშის გარეშე გადახდა ხდება წინა ორდერზეც და უკვე გადახდილ ორდერზე ბრუნდება 409
                      location.reload();
                      // updateOrderPrice();
                    });
                    // Clear input and set total price to 0
                    input.value = "";
                    // orderFullPrice.textContent = '';
                    numericContainer.style.display = "none";
                  } else {
                    console.log("err");
                    return;
                  }
                })
                .catch((error) => console.error(error));
            }
          });
        }

        //2 then ends here
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });
  } //else
  // localStorage.removeItem('orderDetails');
});

//////////////////////pay

// Add a click event listener to the button
function cashPayBtn() {
  // Toggle the visibility of the container
  // if (numericContainer.style.display === "none") {
    numericContainer.style.display = "block";
    //ავტომატურად ემატება გადასახდელი თანხა ინფუთში
    const inputNumericT = document.querySelector(".input-numeric");
    inputNumericT.value = fullCost;
  // } else {
  //   numericContainer.style.display = "none";
  // }

  // delete function numbers
  const inputNumeric = document.querySelector(".input-numeric");
  const deleteButton = document.querySelector(".key-del");

  // Add click event listener for delete button
  deleteButton.addEventListener("click", () => {
    const currentValue = inputNumeric.value;
    const newValue = currentValue.replace(/\d|\./g, "");
    inputNumeric.value = newValue;
  });

  // Add keydown event listener for input field
  inputNumeric.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
      const currentValue = inputNumeric.value;
      const newValue = currentValue.slice(0, -1);
      inputNumeric.value = newValue;
    }
  });
  let bigBox = document.getElementById("big-box");
  bigBox.style.display = "none"; // hide the box if it's already displayed
}

/// TERMINAL
// Open POS პოსის დაკავშირება აპლიკაცსიასთან. პირველი რექვესთი
// შეყვანილი თანხის კონვერტაცია ტერმინალისთვის 5.00 = 500
function convertNumber(number) {
  // რიცხვის კონვერტაცია სტრინგში . ათწილადის შემოწმებისთვის
  const numberStr = number.toString();

  // თუ რიცხვში არის წერტილი, წაშალა და კონვერტირება
  if (numberStr.includes('.')) {
    const integerPart = numberStr.split('.')[0];
    const decimalPart = numberStr.split('.')[1];

    // შემოწმება თუ დაბოლოება აირს 00
    if (decimalPart === '00') {
      // თუ რიცხვი ცარიელი არარირს, 100-ზე გამრავლებული დაბრუნდება
      if (integerPart !== '') {
        return parseInt(integerPart) * 100;
      }
      // თუ 0 არის, დაბრუნდება 0
      return 0;
    }

    // თუ წერტილში არის ერთი ციფრი, დაამატებს '0'-ს და დააკონვერტირებს
    if (decimalPart.length === 1) {
      return parseInt(numberStr.replace('.', '') + '0');
    }
  }

  // თუ რიცხვში წერტილი არ არის, დააბრუნებს საწყის რიცხვს 100-ზე გამრავლებულს
  return number * 100;
}

function payWithTBC(payAmount) {
  openPos();

  function openPos() {
    // console.log(parseInt(orderFullPrice.innerHTML).toFixed().replace('.', '') * 100,)
    fetch("http://localhost:6678/v104/openpos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        licenseToken: "SYLLOGIA",
        // alias: "POS1",
        // username: "2 ნაბიჯი",
        // password: "ნატახტარი",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ტერმინალი გაიხსნა");
        //ტოკენის ლოქალ სთორიჯში შენახვა
        localStorage.setItem(
          "accessToken",
          JSON.stringify(data["accessToken"])
        );
        const accessToken = data["accessToken"];
        //ტოკენის ლოქალ სთორიჯიდან ამოღება
        unlockDevice(accessToken);
      })
      .catch((error) => {
        console.error("Failed to open POS", error);
      });
  }
  //2 რექვესთი
  // UNLOCKDEVICE- იგზავნება ყოველი გადახდის წინ რომ POS იყოს მზადყოფნაში მიიღოს ბარათი.
  // გადაეცემა პარამეტრები. დაკომენტარებული პარამეტრები არ არის სავალდებულო
  function unlockDevice(accesToken) {
    fetch("http://localhost:6678/v104/executeposcmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accesToken}`,
      },
      body: JSON.stringify({
        header: {
          command: "UNLOCKDEVICE",
        },
        params: {
          posOperation: "AUTHORIZE",
          // amount:parseInt(orderFullPrice.innerHTML).toFixed().replace('.', '') * 100,
          amount: convertNumber(payAmount),
          // amount: payAmount,

          // "cashBackAmount": 0,
          currencyCode: "981",
          idleText: "Insert card",
          language: "KA",
          ecrVersion: "Cashier-Bank-v12.4.5",
          // "operatorId": "Operator",
          // "operatorName": "Name",
          // "cardTechs": ["Mifare1K", "Mifare4K"],
          // "enabledTranSourceMedias": ["EmvChip", "EmvContactless", "MagnetSwipe"],
          // "silentCardRead": false
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ტერმინალი განიბლოკა");
        // const requestInterval = setInterval(() => {
        //   sendRequest(requestInterval);
        // }, 5000);
        let intervalCount = 0;

        const requestInterval = setInterval(() => {
          if (intervalCount < 24) {
            sendRequest(requestInterval);
            intervalCount++;
          } else {
            clearInterval(requestInterval);
          }
        }, 3000);

        // 5 წამის შემდეგ იგზავნება რექვესთი სადაც ველოდებით
        // ONPRINT სახელით პასუხს და ვამოწმებთ თუ allowAuthorize
        // True არის
        // setTimeout(() => {
        //   sendRequest();
        // }, 5000);
      })
      .catch((error) => {
        // Handle error in executing the unlock device command
        console.error("Failed to execute unlock device command", error);
      });
  }
  // დასაშვებია თუ არა ბარათის დადების შემდეგ ავტორიზაციის გაშვება
  function sendRequest(requestInterval) {
    fetch("http://localhost:6678/v104/getevent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "ფუნქცია sendrequest გაიგზავნა რომ დაიჭიროს ONCARD ივენთი"
        );
        if (data.eventName === "ONCARD") {
          window.clearInterval(requestInterval);
          console.log("allowAuthorize ", data.properties.allowAuthorize);
          console.log("ONCARD for DocumentNr");

          // თუ allowAuthorize იქნება FALSE მაგ შემთხვევაში
          // remove card ---> lock device
          if (data.properties.allowAuthorize === true) {
            authorize();
          } else {
            console.log("REMOVE CARD -----> LOCK DEVICE");
            removeCard();
          }
        } else if (data.eventName !== "ONCARD") {
          return;
        } else {
          sendRequest();
        }
      })
      .catch((error) => {
        // Handle error in getting events
        console.error("Failed to get events", error);
      });
  }

  // დოკუმენტის ნომრის დაგენერირება
  function documentNr() {
    let length = () => {
      return Math.ceil(Math.random() * 30 + 6);
    };
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Alphanumeric characters to choose from
    let documentNumber = "";

    for (let i = 0; i < length(); i++) {
      let randomIndex = Math.floor(Math.random() * chars.length);
      documentNumber += chars.charAt(randomIndex);
    }
    console.log(documentNumber);
    return documentNumber;
  }
  //REMOVE CARD REQUEST
  function removeCard() {
    fetch("http://localhost:6678/v104/executeposcmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`, // Replace with your actual access token
      },
      body: JSON.stringify({
        header: {
          command: "REMOVECARD",
        },
        params: {
          text: "Card not SERVICED",
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "REMOVE CARD ის დათა");
        lockDevice();
      })
      .catch((error) => {
        // Handle error in executing the authorize command
        console.error("Failed to execute authorize command", error);
      });
  }

  // ამ ფუნქციას ვიძახებთ მაშინ როცა გავიგებთ დაშვებულია თუ არა ავტორიზაცია
  // რაც დამოკიდებული ბარათის დადების შემდეგ დაბრუნებული პასუხიდან
  function authorize() {
    fetch("http://localhost:6678/v104/executeposcmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`, // Replace with your actual access token
      },
      body: JSON.stringify({
        header: {
          command: "AUTHORIZE",
        },
        params: {
          amount: convertNumber(payAmount),
          // amount: payAmount,

          // "cashBackAmount": 0,
          currencyCode: "981",
          documentNr: documentNr(),
          // "panL4Digit": "8261"
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.resultCode === "OK") {
          console.log("ავტორიზეება დადასტურებულია");
          transactionStatus();
        } else {
          console.error("ავტორიზება უარყოფილია", data.resultMessage);
        }
      })
      .catch((error) => {
        // Handle error in executing the authorize command
        console.error("Failed to execute authorize command", error);
      });
  }

  // გეტ ივენთს რექვესთი რომ დავიჭიროთ დოკუმენტის ნომერი და ოპერაციის ID
  // რაც გვჭირდება CloseDoc ში გასატანებლად რომ დავხუროთ დოკუმენტი
  function transactionStatus() {
    fetch("http://localhost:6678/v104/getevent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.eventName === "ONPRINT") {
          console.log("printis data");
          const receiptText = data.properties.receiptText;
          localStorage.setItem("receiptText", JSON.stringify(receiptText));
        }
        if (data.eventName === "ONTRNSTATUS") {
          console.log(data.properties.amountAuthorized,'amountAuthorized');
          if(data.properties.amountAuthorized === 0){
            console.log('წარუმატებელი ტრანზაქცია')
            const documentNr = data.properties.documentNr;
            const operationId = data.properties.operationId;
            closeDoc(documentNr, operationId);
            return false
          }else{
            console.log('წარმატებული ტრანზაქცია')
            const documentNr = data.properties.documentNr;
            const operationId = data.properties.operationId;
            closeDoc(documentNr, operationId);
            return true;
          }
          // აქ ვიჭერთ documentNr და operationId ის
          // და ვიძახებთ closeDoc ფუნქციას რომელიც
          // იქნება closeDoc რექვესთი
          // გაარჩიე  closeDoc თავი დოკუმენტაციიდან
        } else {
          transactionStatus();
        }
      })
      .catch((error) => {
        // Handle error in getting events
        console.error("Failed to get events", error);
      });
  }

  function closeDoc(documentNr, operationId) {
    fetch("http://localhost:6678/v104/executeposcmd", {
      method: "POST",
      headers: {
        "Content-type": "aplication/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
      body: JSON.stringify({
        header: {
          command: "CLOSEDOC",
        },
        params: {
          documentNr: documentNr,
          // "operationId":operationId
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.resultCode === "OK") {
          Print();
        }
        console.log("close Doc");
      });
  }
  // ქვითრის ბეჭდვა
  function Print() {
    fetch("http://localhost:6678/v104/executeposcmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
      body: JSON.stringify({
        header: {
          command: "PRINT",
        },
        params: {
          receiptText: JSON.parse(localStorage.getItem("receiptText")),
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.resultCode === "OK") {
          lockDevice();
        }
      })
      .catch((error) => {
        // Handle error in executing the LOCKDEVICE command
        console.error("Failed to lock POS device", error);
      });
  }
  // LOCK DEVICE
  // არჩევითი რექვესთი რომლის გაგზავნაც შემიძლია ყოველი ოპერაციის დასრულების შემდეგ
  // ან შემდეგი მომხმარებლისთვის ისევ თავიდან ეგრევე შეგვიძლია გავგზავნოთ UNLOCK DEVICE
  function lockDevice() {
    fetch("http://localhost:6678/v104/executeposcmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
      body: JSON.stringify({
        header: {
          command: "LOCKDEVICE",
        },
        params: {
          idleText: "Insert card", // Replace with the desired idle text message
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response or perform any necessary actions
        console.log("POS device locked");
      })
      .catch((error) => {
        // Handle error in executing the LOCKDEVICE command
        console.error("Failed to lock POS device", error);
      });
      // localStorage.removeItem("receiptText")
      // localStorage.removeItem("accessToken")
  }
  
  // return transactionStatus();

}
function closeDay() {
  fetch("http://localhost:6678/v104/executeposcmd", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${JSON.parse(
        localStorage.getItem("accessToken")
      )}`,
    },
    body: JSON.stringify({
      header: {
        command: "CLOSEDAY",
      },
      params: {
        // operatorId: "<Cashier's Identifier>",
        // operatorName: "<Cashier's Name>",
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "Close day data");
    })
    .catch((err) => {
      console.log("Error during close day:", err);
    });
}


// Function to log a message on refresh
function logRefreshEvent() {
  localStorage.removeItem("orderId")
}

// Add event listener for beforeunload event
window.addEventListener("beforeunload", logRefreshEvent);

// Add event listener for unload event (optional, may not work in all browsers)
window.addEventListener("unload", logRefreshEvent);




function payCardFunction(orderIdArg, paymentTypeIdArg) {
  let agreeBtn = document.querySelector(".agree");
  const clickHandler = () => {
    console.log("ამ ფუნქციაში შემოდის ორჯერ")
    
    let BasketContainer = document.querySelector(".right-basket-container");
    if (BasketContainer.innerHTML === "") {
      alert("empty");
      return;
    }

    let numberInputValue = Number(input.value);
    fullCost = orderFullPrice.textContent;
    fullCost = Number(fullCost) - numberInputValue;
    fullCost = Math.round(fullCost * 100) / 100;
    fullCost = fullCost.toFixed(2);

    // Check if the numberInputValue is less than or equal to orderFullPrice.textContent
       if (numberInputValue <= 0) {
      alert("Invalid payment amount");
      return;
    }

    // Check if the payment amount exceeds the order total
    if (numberInputValue > orderFullPrice.textContent) {
      alert("Payment amount cannot exceed the order total");
      return;
    }
    if (numberInputValue <= orderFullPrice.textContent) {
      payWithTBC(numberInputValue);

      fetch("http://5.152.108.245:8088/api/v1/order/pay", {
        method: "PATCH",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({
          orderId: orderIdArg,
          createChequeDocumentCommand: {
            paymentTypeId: paymentTypeIdArg,
            price: numberInputValue,
            orderId: orderIdArg,
            createChequeDate: currentDate,
          },
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            input.value = fullCost;
            numericContainer.style.display = "none";
            orderFullPrice.textContent = fullCost;
            removeClickListener();
            return;
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // Add the click event listener to the "Agree" button
  agreeBtn.addEventListener("click", clickHandler, { once: true });

  // Function to remove the click event listener from the "Agree" button
  const removeClickListener = () => {
    agreeBtn.removeEventListener("click", clickHandler);
  };

  // Return the function to remove the click event listener
  return removeClickListener;
}

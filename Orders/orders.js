localStorage.removeItem("orderDetails");
let ShiftDocumentId = localStorage.getItem("shiftDocumentId");
const tableBody = document.querySelector(".table-body");
let pageNumber = 1;
let totalPages = 1;

function fetchOrdersData(page) {
  const url = `http://5.152.108.245:8088/api/v1/order/getpagedlist?ShiftDocumentId=${ShiftDocumentId}&PageNumber=${page}`;

  fetch(url)
    .then((res) => res.json())
    .then((ordersData) => {
      console.log(ordersData, "orders data");
      tableBody.innerHTML = ""; // Clear previous rows

      ordersData.list.forEach((order, index) => {
        const row = document.createElement("div");
        const cell0 = document.createElement("div");
        const cell1 = document.createElement("div");
        const cell2 = document.createElement("div");
        const cell3 = document.createElement("div");
        const cell4 = document.createElement("div");
        const cell5 = document.createElement("div");

        const editButton = document.createElement("img");
        const deleteButton = document.createElement("img");
        const viewButton = document.createElement("img");
        // const payButton = document.createElement("img");

        row.classList.add("table-row");
        // cell0.classList.add("table-cell");
        cell1.classList.add("table-cell");
        cell2.classList.add("table-cell");
        cell3.classList.add("table-cell");
        cell4.classList.add("table-cell");
        cell5.classList.add("table-cell", "gap");
        // cell6.classList.add("table-cell");

        editButton.src = "../photos/continue.svg";
        editButton.title = "რედაქტირება";
        editButton.classList.add("btn-edit", "btnIcon");
        editButton.id = "edit";
        // editButton.style.width = "60px";
        // editButton.style.height = "60px";

        deleteButton.src = "../photos/delete-icon.svg";
        deleteButton.title = "წაშლა";
        deleteButton.classList.add("btn-remove", "btnIcon");
        deleteButton.id = "delete-order";
        // deleteButton.style.width = "70px";
        // deleteButton.style.height = "70px";

        viewButton.src = "../photos/eye.svg";
        viewButton.title = "დათვალიერება";
        viewButton.classList.add("btn-view", "btnIcon");
        viewButton.id = "view-order";

        // payButton.src = "../photos/pay.svg";
        // payButton.title = "გადახდა";
        // payButton.classList.add("btn-pay", "btnIcon");
        // payButton.id = "pay-order";

        if (order.orderStatusName === "გადახდილი") {
          editButton.style.backgroundColor = "grey";
          deleteButton.style.backgroundColor = "grey";
          // payButton.style.backgroundColor = "grey";
          // payButton.style.display = "none";
          // deleteButton.style.display = "none";
          // editButton.style.display = "none";
          editButton.style.pointerEvents = "none";
          deleteButton.style.pointerEvents = "none";
          // payButton.style.pointerEvents = "none";
        }
        /////////////////////////////////ნაწილობრივ გადახდილის შემთხვევაში არ უნდა მოხდეს არც რედაქტირება და არც წაშლა
        if (order.orderStatusName === "ნაწილობრივად გადახდილი") {
        editButton.style.backgroundColor = "grey";
        deleteButton.style.backgroundColor = "grey";

        // deleteButton.style.display = "none";
        // editButton.style.display = "none";
        editButton.style.pointerEvents = "none";
        deleteButton.style.pointerEvents = "none";

        }

        cell0.textContent = index + 1;
        cell1.textContent = order.documentNumber;
        cell2.textContent = order.paymentTypeName;
        cell3.textContent = "₾ " + order.price;
        cell4.textContent = order.orderStatusName;
        cell5.appendChild(editButton);
        cell5.appendChild(viewButton);
        cell5.appendChild(deleteButton);
        // cell5.appendChild(payButton);

        // cell6.textContent = order.id;

        tableBody.appendChild(row);
        row.appendChild(cell0);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        // row.appendChild(cell6);

        viewButton.addEventListener("click", () => {
          const box = document.getElementById("box");
          const closeButton = document.getElementById("closeButton");

          box.classList.remove("hidden");

          const orderId = order.id;
          console.log(orderId, "დათვალიერების დაჭერაზე ");
          fetch(`http://5.152.108.245:8088/api/v1/order/getdetail/${orderId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "კონკრეტული ორდერის ინფორმაცია");

              const tableBody = document.getElementById("tableBody");
              tableBody.innerHTML = ""; // Clear the table body before populating with new data


              const orderNumber = document.getElementById("orderNumber");
              orderNumber.textContent = `შეკვეთის ინფორმაცია N : ${data.documentNumber}`;
              orderNumber.style.color = "#3e3389";

              const totalBalanceElement =
                document.getElementById("totalBalance");
              totalBalanceElement.classList.add("text-primary");
              totalBalanceElement.textContent = `სულ გადასახდელი თანხა: ₾${data.price}`;

              const remainingPayment =
                document.getElementById("remainingPayment");
              remainingPayment.classList.add("text-danger");
              remainingPayment.textContent = ` გადასახდელი თანხა: ₾${data.remainingPayment}`;

              const paymentsMade = document.getElementById("paymentsMade");
              paymentsMade.classList.add("text-success");
              paymentsMade.textContent = ` გადახდილი თანხა: ₾${data.paymentsMade}`;

              

              data.orderItems.forEach((item, index) => {
                const row = document.createElement("tr");

                const cell0 = document.createElement("td");
                cell0.textContent = index + 1;
                row.appendChild(cell0);

                const cell1 = document.createElement("td");
                cell1.textContent = item.barcode;
                row.appendChild(cell1);

                const cell2 = document.createElement("td");
                cell2.textContent = item.innerCode;
                row.appendChild(cell2);

                const cell3 = document.createElement("td");
                cell3.textContent = item.name;
                row.appendChild(cell3);

                const cell4 = document.createElement("td");
                cell4.textContent = "₾" + item.unitPrice;
                row.appendChild(cell4);

                const cell5 = document.createElement("td");
                cell5.textContent = item.quantity;
                row.appendChild(cell5);

                const cell6 = document.createElement("td");
                cell6.textContent = "₾" + item.totalPrice;
                row.appendChild(cell6);

                tableBody.appendChild(row);
              });
            });

          function closeBox() {
            box.classList.add("hidden");
          }
          // Event listener for the close button
          closeButton.addEventListener("click", closeBox);
        });

        // რედაქტირების ღილაკი
        editButton.addEventListener("click", () => {
          const orderId = order.id;
          console.log(orderId);

          fetch(`http://5.152.108.245:8088/api/v1/order/getdetail/${orderId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "კონკრეტული ორდერის ინფორმაცია");
              console.log(JSON.stringify(data));
              localStorage.setItem("orderDetails", JSON.stringify(data));
              location.href = "../MainPage/index.html";
            });
        });

        deleteButton.addEventListener("click", (event) => {
          if (event.target.id === "delete-order") {
            const dialogContainer = document.querySelector(".dialog-container");
            dialogContainer.style.display = "block";

            const confirmButton = document.querySelector(".confirm");
            const cancelButton = document.querySelector(".cancel");

            // Function to handle delete request
            const handleDelete = () => {
              const orderId = order.id;
              console.log(orderId, "order id");

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
                  console.log(response);
                  if (response.ok) {
                    console.log("DELETE request successful");
                    dialogContainer.style.display = "none";
                    fetchOrdersData(pageNumber); // Refresh the orders list after successful deletion
                  } else {
                    console.error("DELETE request failed");
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });

              // Remove event listener on confirm button click
              confirmButton.removeEventListener("click", handleDelete);
            };

            // Show dialog on delete button click
            confirmButton.addEventListener("click", handleDelete);

            // Hide dialog on cancel button click
            cancelButton.addEventListener("click", () => {
              dialogContainer.style.display = "none";
              confirmButton.removeEventListener("click", handleDelete);
            });
          }
        });
      });

      // Update total pages
      totalPages = ordersData.totalPages;

      // Generate pagination
      const pagination = document.querySelector(".pagination");
      pagination.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.textContent = i;
        li.appendChild(pageLink);
        pagination.appendChild(li);

        if (i === pageNumber) {
          li.classList.add("active");
        }

        pageLink.addEventListener("click", () => {
          pageNumber = i;
          fetchOrdersData(pageNumber);
        });
      }

      // Disable Next Page button if there are no more pages
      const nextPageButton = document.querySelector("#next-page-button");
      if (pageNumber >= totalPages) {
        nextPageButton.disabled = true;
      } else {
        nextPageButton.disabled = false;
      }

      // Disable Previous Page button if on the first page
      const previousPageButton = document.querySelector(
        "#previous-page-button"
      );
      if (pageNumber === 1) {
        previousPageButton.disabled = true;
      } else {
        previousPageButton.disabled = false;
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
}

fetchOrdersData(pageNumber);

const previousPageButton = document.querySelector("#previous-page-button");
const nextPageButton = document.querySelector("#next-page-button");

previousPageButton.addEventListener("click", () => {
  if (pageNumber > 1) {
    pageNumber--;
    fetchOrdersData(pageNumber);
  }
});

nextPageButton.addEventListener("click", () => {
  pageNumber++;
  fetchOrdersData(pageNumber);
});


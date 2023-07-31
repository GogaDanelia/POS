const detailedShift = JSON.parse(localStorage.getItem("detailedShift"));
let isdetailedShift = detailedShift ? true : false;
console.log(detailedShift);
console.log(isdetailedShift);


const shiftTitle = document.getElementById('shift-title');
shiftTitle.classList.add('centered-text');
const shiftId = localStorage.getItem("shiftId")
shiftTitle.textContent = `ცვლა ID : ${shiftId}`


if (isdetailedShift) {
  const totalBalanceElement = document.getElementById("totalBalance");
  const startingBalanceElement = document.getElementById("startingBalance");

  totalBalanceElement.textContent = `ცვლის ჯამური თანხა: ₾${detailedShift.totalBalance}`;
  startingBalanceElement.textContent = `ცვლის საწყისი ბალანსი: ₾${detailedShift.startingBalance}`
  const tableBody = document.getElementById("tableBody");

  detailedShift.orderItems.forEach((item,index) => {
    const row = document.createElement("tr");
    const cell0 = document.createElement("td");
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");
    const cell5 = document.createElement("td");
    const cell6 = document.createElement("td");

    cell0.textContent = index + 1;
    cell1.textContent = item.barcode;
    cell2.textContent = item.innerCode;
    cell3.textContent = item.name;
    cell4.textContent = "₾" + item.unitCost;
    cell5.textContent = item.quantity;
    cell6.textContent = "₾" +  item.totaltCost;

    row.appendChild(cell0);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);
    row.appendChild(cell6);

    tableBody.appendChild(row);
  });
}

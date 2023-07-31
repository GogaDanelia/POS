const posId = localStorage.getItem("posId");
// Variable to keep track of the active shifts
const activeShifts = [];

// Fetching the shifts data
fetch(`http://5.152.108.245:8088/api/v1/shiftdocument/getlist?PosId=${posId}`)
  .then((response) => response.json())
  .then((shiftsData) => {
    shiftsData.forEach((shift) => {
      if (shift.shiftDocumentStatusName === "აქტიური") {
        activeShifts.push(shift);
      }
    });
    displayClosedShifts();
  });

// Function to close the shift
function closeShift(id) {
  console.log("Clicked on delete icon for ID:", id);
  let dialogContainer = document.querySelector(".dialog-container");

  dialogContainer.style.display = "block";
  // Confirmation
  document.querySelector(".confirm").addEventListener("click", () => {
    console.log("closeShift");
    fetch("http://5.152.108.245:8088/api/v1/shiftdocument/close", {
      method: "PATCH",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          alert("ცვლა წარმატებით დაიხურა");
          dialogContainer.style.display = "none";
          location.reload();
        } else if (response.status === 409) {
          alert("ფიქსირდება გადაუხდელი შეკვეთა");
          location.reload();
        } else {
          throw new Error("Unexpected status code: " + response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    dialogContainer.style.display = "none";
  });

  // Cancelation
  document.querySelector(".cancel").addEventListener("click", () => {
    dialogContainer.style.display = "none";
    location.reload();
  });
}

// Function to handle continue shift
function continueShift(id) {
  console.log("Clicked on continue icon for ID:", id);

  const dialogContainer = document.querySelector(".dialog-container-continue");
  dialogContainer.style.display = "block";

  const confirmButton = document.querySelector(".confirm-continue");
  const cancelButton = document.querySelector(".cancel-continue");

  confirmButton.addEventListener("click", () => {
    console.log(id, typeof JSON.stringify(Number(id)), "id");
    localStorage.setItem("shiftDocumentId", JSON.stringify(Number(id)));
    location.href = "../../MainPage/index.html";
    dialogContainer.style.display = "none";
  });

  cancelButton.addEventListener("click", () => {
    dialogContainer.style.display = "none";
    location.reload();
  });
}

function displayClosedShifts() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing table rows before appending new ones

  activeShifts.forEach((activeShift, index) => {
    console.log(activeShift);
    const rowTemplate = `
        <tr class="shift-data-row">
          <td><div class="row-padding">${index + 1}</div></td>
          <td><div class="row-padding">${activeShift.documentNumber + 1}</div></td>
          <td><div class="row-padding">${new Date(activeShift.shiftDate).toLocaleString()}</div></td>
          <td><div class="row-padding">${"₾" + activeShift.totalBalance}</div></td>
          <td><div class="row-padding">${
            activeShift.shiftDocumentStatusName
          }</div></td>
          <td><div class="row-padding">${activeShift.userId}</div></td>
          <td>
            <div class="row-padding">
              <img src="../../photos/continue.svg" alt="check" class="icon" id="continueShift" title="ცვლის გაგრძელება" data-id="${
                activeShift.id
              }"/>
              <img src="../../photos/reload.svg" alt="delete" class="icon bg-warning deleteShift" title="ცვლის დახურვა" data-id="${
                activeShift.id
              }" />
            </div>
          </td>
        </tr>
      `;
    tableBody.innerHTML += rowTemplate;
  });

  const closeShiftIcons = document.querySelectorAll(".deleteShift");
  const continueShiftIcons = document.querySelectorAll("#continueShift");

  closeShiftIcons.forEach((closeShiftIcon) => {
    closeShiftIcon.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      closeShift(id);
    });
  });

  continueShiftIcons.forEach((continueShiftIcon) => {
    continueShiftIcon.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      continueShift(id);
    });
  });
}

localStorage.removeItem('detailedShift')
const posId = localStorage.getItem("posId");

//ცვლების სია
const closedShifts = [];
//
fetch(`http://5.152.108.245:8088/api/v1/shiftdocument/getlist?PosId=${posId}`)
  .then((response) => response.json())
  .then((shiftsData) => {
    console.log(shiftsData)
      shiftsData.forEach((shift) => {
        if (shift.shiftDocumentStatusName === "ჩამოწერილი") {
          closedShifts.push(shift);
        }
      });
      displayClosedShifts();
  });

// ცვლის დათვალიერება
function viewShift(id) {
  let dialogContainer = document.querySelector(".dialog-container-view");

  dialogContainer.style.display = "block";

  // Confirmation
  function confirmButtonClickHandler() {
    fetch(`http://5.152.108.245:8088/api/v1/shiftdocument/getdetail?ShiftId=${id}`)
      .then(response => response.json())
      .then(detailShiftData => {
        console.log(detailShiftData, 'detail shift data');
        localStorage.setItem('detailedShift', JSON.stringify(detailShiftData))
        location.href = "detailed-shift.html"
      })
      .catch(error => {
        console.log(error);
        // Handle any error that occurred during the fetch request
      })
      .finally(() => {
        dialogContainer.style.display = "none";
      });
  }

  document.querySelector(".confirm").addEventListener("click", confirmButtonClickHandler);

  // Cancellation
  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".confirm").removeEventListener("click", confirmButtonClickHandler); // Remove the confirmation button event listener
    dialogContainer.style.display = "none";
  });
}

  //დახურული ცვლების ასახვა ეკრანზე
  function displayClosedShifts() {
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing table rows before appending new ones
  
    closedShifts.forEach((closedShift, index) => {
      // Extract date and time from closeDate
      const closeDateTime = new Date(closedShift.closeDate);
      const closeDate = closeDateTime.toLocaleDateString();
      const closeTime = closeDateTime.toLocaleTimeString();
  
      const rowTemplate = `
        <tr class="shift-data-row">
          <td><div class="row-padding">${index + 1}</div></td>
          <td><div class="row-padding">${closeDate} ${closeTime}</div></td>
          <td><div class="row-padding">${closeDate} ${closeTime}</div></td>
          <td><div class="row-padding">${"₾" + closedShift.totalBalance}</div></td>
          <td><div class="row-padding">${closedShift.shiftDocumentStatusName}</div></td>
          <td><div class="row-padding">${closedShift.userId}</div></td>
          <td>
            <div class="row-padding">
              <img src="../../photos/eye.svg" alt="look" class="icon bg-primary" title="ცვლის დათვალიერება" data-id="${closedShift.id}" id="viewShift"/>
            </div>
          </td>
        </tr>
      `;
      tableBody.innerHTML += rowTemplate;
    });
    const viewShifts = document.querySelectorAll("#viewShift");
  
    viewShifts.forEach((shift) => {
      shift.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        //დათვალიერების ფუნქცია
        viewShift(id)
      });
    });
      // ცვლის აიდის ამოღება აიქონებზე ქლიქით
      const deleteIcons = document.querySelectorAll('[data-id]');
      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", (e) => {
          // console.log(e.target.dataset)
          const id = e.target.dataset.id;
          localStorage.setItem('shiftId',id)
          console.log("Clicked on delete icon for ID:", id);
        });
      });
}
  
  

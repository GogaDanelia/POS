document.addEventListener("DOMContentLoaded", function () {
  // Current time
  var currentTime = moment().format("YYYY-MM-DD HH:mm");

  // Current time in input
  var inputstl = document.querySelector(".inputstl");
  inputstl.value = currentTime;
  inputstl.readOnly = true;
  inputstl.style.cursor = "none";
  inputstl.style.backgroundColor = "white";

  var newcvlaElement = document.querySelector(".list-item.newcvla");
  var cvlaboxElement = document.querySelector(".cvlabox");
  var closeBtnElement = document.querySelector(".disagre");


  var isCvlaboxVisible = false; // Track the visibility of cvlabox

  newcvlaElement.addEventListener("click", function (event) {
    // Prevent the default link behavior (e.g., following the href)
    event.preventDefault();

    // Toggle the "cvlabox" element
    if (!isCvlaboxVisible) {
      cvlaboxElement.style.display = "block";
      isCvlaboxVisible = true;
    } else {
      cvlaboxElement.style.display = "none";
      isCvlaboxVisible = false;
    }
  });

  closeBtnElement.addEventListener("click", function (event) {
    // Prevent the default button behavior
    event.preventDefault();

    // Hide the "cvlabox" element
    cvlaboxElement.style.display = "none";
    isCvlaboxVisible = false;
  });
});

// front for back
const pos = document.getElementById("pos");
const agreeform = document.getElementById("agree-form");
let posId = localStorage.getItem("posId");
// Add an event listener to the login form submit event
agreeform.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the balance value from the form input
  const startingBalance = document.getElementById("startingBalance").value;

  console.log("startingBalance:", startingBalance);

  // Validate the data
  if (!startingBalance) {
    alert("Please provide the startingBalance");
    return;
  }

  console.log("Data validation passed");

  // Create the request payload
  const requestBody = {
    userId: 1,
    posId: posId,
    shiftDate: moment().format("YYYY-MM-DD HH:mm"),
    startingBalance: startingBalance,
  };

  fetch("http://5.152.108.245:8088/api/v1/shiftdocument/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa("user1:123456"),
      accept: "*/*",
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("Backend error: " + res.status);
      }
    })
    .then((response) => {
      console.log(response);
      if (response) {
        console.log(typeof response, "response if create shift");
        localStorage.setItem("shiftDocumentId", JSON.stringify(response));
        window.location.href = "../MainPage/index.html";
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
});

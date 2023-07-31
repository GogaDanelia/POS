localStorage.clear();
const pos = document.getElementById("pos");
const loginForm = document.getElementById("login-form");

// Add an event listener to the login form submit event
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the username and password values from the form inputs
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const posId = pos.value;
  localStorage.setItem("posId", posId);

  // Perform login request
  const loginData = {
    userName: username,
    password: password,
    posId: posId,
  };

  fetch("http://5.152.108.245:8088/api/login/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json-patch+json",
      accept: "*/*",
    },
    body: JSON.stringify(loginData),
  })
    .then((loginResponse) => {
      if (loginResponse.status === 200) {
        // Redirect to the main page
        location.href = "dashboard.html";
      } else if (loginResponse.status === 403) {
        alert("Incorrect password or username");
      } else if (loginResponse.status === 409) {
      // დაფიქსირდა აქტიური ცვლა და ჩნდება დიალოგი
      // გაგრძელება ან უარყოფა
        let dialogContainer = document.querySelector(".dialog-container");
        console.log(dialogContainer)
          dialogContainer.style.display = "block";
          //დადასტურება
          document.querySelector(".confirm").addEventListener("click", () => {
            dialogContainer.style.display = "none";
            location.href = "dashboard.html";
          });
          // უარყოფა
          document.querySelector(".cancel").addEventListener("click", () => {
            dialogContainer.style.display = "none";
          });
      
        // location.href = 'dashboard.html';
      } else {
        console.log("Unknown error");
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the login request
      console.error("Error:", error);
    });
});

// Fetch data and populate the pos dropdown
fetch("http://5.152.108.245:8088/api/v1/pos/getlist")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      console.log(item, "get posids");
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      option.dataset.warehouseId = item.warehouseId;
      pos.appendChild(option);
    });
  });

// Add event listener for the pos dropdown change event
pos.addEventListener("change", function () {
  const selectedPos = pos.options[pos.selectedIndex];
  const warehouseId = selectedPos.dataset.warehouseId;
  localStorage.setItem("warehouseId", warehouseId);
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const showPasswordCheckbox = document.getElementById("showPassword");

  if (showPasswordCheckbox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

const logoutBtn = document.createElement("button");
logoutBtn.className = "button button2";
logoutBtn.textContent = "Log out";
logoutBtn.addEventListener("click", () => {
  location.href = "login.html";
});

document.body.appendChild(logoutBtn);
history.pushState({}, "");

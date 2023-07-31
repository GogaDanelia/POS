let count = 1;
let saveBtn = document.getElementById('save-btn');
let mainContainer = document.querySelector('.middle-div-main-grid');

// test


let fileInput = document.getElementById('file-upload');


function handleButtonClick(event) {


    // Validate input fields
    let codeInput = document.getElementById('code');
    let productNameInput = document.getElementById('product-name');

    let descriptionInput = document.getElementById('description');
    let fileInput = document.getElementById('file-upload');

    if (!codeInput.value || !productNameInput.value ||
      !descriptionInput.value || !fileInput.files[0]) {
      alert('Please fill out all fields and upload a photo');
      return;
    }



    const formData = {
      code:"",
      productName: "",
      description: "",
      photo:""
    };
    formData.code =  codeInput.value;
    formData.productName = productNameInput.value;
    formData.description = descriptionInput.value;




    let orderContainer = document.createElement('div');
    orderContainer.classList.add('middle-grid-container-order');

     // create a div element with the class "number" and set its text content to "1"
    let number = document.createElement('div');
    number.classList.add('number');
    number.textContent = count++;

   // create a div element with the class "code" and set its text content to "15348"
    let code = document.createElement('div');
    code.classList.add('code');
    code.textContent =  formData.code;

   // create a div element with the class "description" and set its text content to "ღორის კანჭი, მჟავის ასორტი, ლუდი კრომბახერი, პური, საებელი, სოუსი"
   let description = document.createElement('div');
   description.classList.add('description');
   description.textContent = formData.description;

 // create a div element with the class "product-name" and set its text content to "კანჭის მენიუ"
    let productName = document.createElement('div');
    productName.classList.add('product-name');
    productName.textContent =  formData.productName;





    // create a div element with the class "img-and-icons"
    let imgAndIcons = document.createElement('div');
    imgAndIcons.classList.add('order-image-container');
    // create a div element with the class "delete"
    let deleteContainer = document.createElement('div');
    deleteContainer.classList.add('delete');

    // create an img element with the src "../photos/edit-icon.svg" and the class "edit-icon"
    let editIcon = document.createElement('img');
    editIcon.src = '../../photos/edit-icon.svg';
    editIcon.classList.add('edit-icon');

    // create an img element with the src "../photos/delete-icon.svg" and the class "delete-icon"
    let deleteIcon = document.createElement('img');
    deleteIcon.src = '../../photos/delete-icon.svg';
    deleteIcon.classList.add('delete-icon');


    var confirmationDialog = document.getElementById("confirmation-dialog");
    var confirmButton = document.getElementById("confirm-btn");
    var cancelButton = document.getElementById("cancel-btn");

    deleteIcon.addEventListener('click',(e) => {
      deleteContainerToDelete = e.target.closest(".middle-grid-container-order");
        confirmationDialog.style.display = "block";
    })
// Attach click event listeners to the confirm and cancel buttons in the dialog
confirmButton.addEventListener("click", function() {
    // If the user confirms, delete the element and hide the dialog
    deleteContainerToDelete.remove();
    confirmationDialog.style.display = "none";
  });
  cancelButton.addEventListener("click", function() {
    // If the user cancels, hide the dialog without deleting the element
    confirmationDialog.style.display = "none";
  });
    // append the edit and delete icons to the delete container
    deleteContainer.appendChild(editIcon);
    deleteContainer.appendChild(deleteIcon);


   


// ////////////////////////////photo//////////////////////
    // Get the selected file
    let file = fileInput.files[0];
  
    // Create a FileReader object
    let reader = new FileReader();
  
    // Set the function to run when the file is loaded
    reader.onload = function(event) {
      // Create a new image element
    let img = document.createElement('img');
    img.classList.add('product-img');

      // Set the source of the image element to the data URL of the loaded file
    img.src = event.target.result;
  

  //  ვამატებთ formData - ში img - ს
      formData.photo = img;


    // append photo in order CONTAINER
    imgAndIcons.appendChild(formData.photo);



      // clear file input
      fileInput.value = '';
    };
  
    // Read the selected file as a data URL
    reader.readAsDataURL(file);


    // ///////////////////////////photo////////////////////////////


       // Append EVERYTHING IN ORDER CONTAINER
       orderContainer.appendChild(number);
       orderContainer.appendChild(code);
       orderContainer.appendChild(productName);
       orderContainer.appendChild(description);
       orderContainer.appendChild(imgAndIcons);
       orderContainer.appendChild(deleteContainer);

       
   
     
 
       
//   append main contaienr
    mainContainer.appendChild(orderContainer)


      //clear inputs
      document.getElementById('code').value = '';
      document.getElementById('product-name').value = '';
      document.getElementById("description").value = '';

      console.log(formData)

  }
  
  saveBtn.addEventListener('click', handleButtonClick);


 
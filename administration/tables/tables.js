const tables = [];


let saveBtn = document.getElementById('save-btn');
let mainContainer = document.querySelector('.middle-div-main-grid');

// test


let fileInput = document.getElementById('file-upload');


function handleButtonClick(event) {


      // Validate input fields
      let codeInput = document.getElementById('code');
      let descriptionInput = document.getElementById('description');
      let fileInput = document.getElementById('file-upload');

    

      if (!codeInput.value || !descriptionInput.value || !fileInput.files[0]) {
        alert('Please fill out all fields and upload a photo');
        return;
      }



      ////////////////////////////////////
      

      
        if (tables.includes(codeInput.value)) {
          alert("The table number already exists");
          return;
        } else {
          tables.push(codeInput.value);
        }
  

   


    // const codeInputValue = document.getElementById('codeInput').value;
    // const descriptionInputValue = document.getElementById('descriptionInput').value;
    // const photoInput = document.getElementById('photoInput').files[0]; // Assuming the user uploads a photo file

   
    const formData = {
      code: "",
      description: '',
      photo: ""
    };
    formData.code =  codeInput.value;
    formData.description = descriptionInput.value;





      // 



    let orderContainer = document.createElement('div');
    orderContainer.classList.add('middle-grid-container-order');
    

   // create a div element with the class "code" and set its text content to "15348"
    let code = document.createElement('div');
    code.classList.add('code');
    code.textContent = formData.code;

   // create a div element with the class "description" and set its text content to "ღორის კანჭი, მჟავის ასორტი, ლუდი კრომბახერი, პური, საებელი, სოუსი"
   let description = document.createElement('div');
   description.classList.add('description');
   description.textContent = formData.description;



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
  
    //აქ უნდა ჩაავააფენდოთ form Data - ში img ელემენტი
    formData.photo = img;

    
    // append photo in order CONTAINER
    imgAndIcons.appendChild(formData.photo);

      // clear file input
      fileInput.value = '';
    };
  
    // Read the selected file as a data URL
    reader.readAsDataURL(file);


    /////////////////////////////photo////////////////////////////


       // Append EVERYTHING IN ORDER CONTAINER
       orderContainer.appendChild(code);
       orderContainer.appendChild(description);
       orderContainer.appendChild(imgAndIcons);
       orderContainer.appendChild(deleteContainer);

       
   
     
 
       
    //append main contaienr
    mainContainer.appendChild(orderContainer)





      //clear inputs
      document.getElementById('code').value = '';
      document.getElementById("description").value = '';





     






  }
  // აქედან იგზავნება
  saveBtn.addEventListener('click', handleButtonClick);


//  აქ უნდა გავაკეთოთ formData - დან forEach - ის საშუალებით
//  თითოეულ ფროფერთის მინიჭება შესაბამის ველზე




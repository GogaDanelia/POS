// FORM
const form = document.getElementById('form');
// INPUTS
const personId = document.getElementById('personId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const genderTypeId = document.getElementById('genderTypeId');
const birthDate = document.getElementById('birthDate');
const country = document.getElementById('country');
const city = document.getElementById('city');
const address = document.getElementById('address');
const mobile = document.getElementById('mobile');
const email = document.getElementById("email");


form.addEventListener("submit", (event)=> {
    event.preventDefault();


    if(!personId.value || !firstName.value  || !lastName.value  || !genderTypeId.value 
         || !birthDate.value || !country.value  || !city.value  || !address.value  
        ){
            alert('Please fill out all required fields.');
            return;
        }else if(mobile.value && mobile.value.length < 9 || mobile.value && mobile.value.length > 20 ){
            alert("The mobile number should be between 9 and 20 digits long." );
            return;
        }else if(email.value && email.value.length < 9 ){
            alert("The email should be min 9 letters long." );
            return;
        }

    fetch('http://5.152.108.245:8081/api/v1/person/create', {
        method: 'POST',
        headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify({
            "firstName": firstName.value,
            "lastName": lastName.value,
            "birthDate": birthDate.value,
            "mobile": mobile.value,
            "email": email.value,
            "genderTypeId": genderTypeId.value,
            "country": country.value,
            "address": address.value,
            "city": city.value,
            "personId": personId.value
        })
    })
    .then(response => {
        console.log(response)
        if(response.ok){
            location.reload();
        } else {
            throw new Error('Server response was not ok');
        }
    })
    .catch(error => console.log(error));

})

// GET REQUEST
const peronsList = document.querySelector(".users-main-container")
// PERSONS LIST

fetch('http://5.152.108.245:8081/api/v1/person/getpersonlist')
    .then(res => res.json())
    .then(data => {
        data.forEach(person => {

            // Create the outer container div
            const personContainer = document.createElement('div');
            personContainer.classList.add('person-container');

            // Create the person ID element
            const personIdEl = document.createElement('div');
            personIdEl.id = 'personIdEl';
            personIdEl.textContent = person.personId;

            // Create the first name element
            const firstNameEl = document.createElement('div');
            firstNameEl.id = 'firstNameEl';
            firstNameEl.textContent = person.firstName;

            // Create the last name element
            const lastNameEl = document.createElement('div');
            lastNameEl.id = 'lastNameEl';
            lastNameEl.textContent = person.lastName;

            // Create the mobile element
            const mobileEl = document.createElement('div');
            mobileEl.id = 'mobileEl';
            mobileEl.textContent = person.mobile;

            // Create the delete container div
            const deleteContainer = document.createElement('div');
            deleteContainer.classList.add('delete');

            // Create the edit icon img element
            const editIcon = document.createElement('img');
            editIcon.src = '../../photos/edit-icon.svg';
            editIcon.alt = 'edit';
            editIcon.classList.add('edit-icon');

            // Create the delete icon img element
            const deleteIcon = document.createElement('img');
            deleteIcon.src = '../../photos/delete-icon.svg';
            deleteIcon.alt = 'delete';
            deleteIcon.classList.add('delete-icon');

            // Add the edit and delete icons to the delete container div
            deleteContainer.appendChild(editIcon);
            deleteContainer.appendChild(deleteIcon);

            // Add all the elements to the person container div
            personContainer.appendChild(personIdEl);
            personContainer.appendChild(firstNameEl);
            personContainer.appendChild(lastNameEl);
            personContainer.appendChild(mobileEl);
            personContainer.appendChild(deleteContainer);

            // Add the person container div to the document body
            peronsList.appendChild(personContainer);
                // console.log(person.personId)
        })
    })  

document.getElementById("validationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    let isValid = true;

    // Email Validation
    let email = document.getElementById("email").value;
    let emailError = document.getElementById("emailError");
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email.match(emailPattern)) {
        emailError.textContent = "Invalid email format";
        isValid = false;
    } else {
        emailError.textContent = "";
    }

    // Phone Number Validation (Only numbers, 10-15 digits)
    let phone = document.getElementById("phone").value;
    let phoneError = document.getElementById("phoneError");
    let phonePattern = /^[0-9]{10,15}$/;

    if (!phone.match(phonePattern)) {
        phoneError.textContent = "Enter a valid phone number (10-15 digits)";
        isValid = false;
    } else {
        phoneError.textContent = "";
    }

    // Address Validation (Not empty)
    let address = document.getElementById("address").value;
    let addressError = document.getElementById("addressError");

    if (address.trim() === "") {
        addressError.textContent = "Address cannot be empty";
        isValid = false;
    } else {
        addressError.textContent = "";
    }

    // If all fields are valid, submit the form
    if (isValid) {
        alert("Form submitted successfully!");
        document.getElementById("validationForm").reset(); // Reset form
    }
});

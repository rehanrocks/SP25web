document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('checkoutForm');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Autofill button functionality
    const autofillBtn = document.getElementById('autofillBtn');
    autofillBtn.addEventListener('click', function () {
        // Fill in the example credit card details
        document.getElementById('cardNumber').value = '4111 1111 1111 1111';
        document.getElementById('cardholderName').value = document.getElementById('fullName').value || 'John Doe';
        document.getElementById('expiryDate').value = '12/2025';
        document.getElementById('cvv').value = '123';

        // Remove any validation errors
        document.getElementById('cardNumber').classList.remove('is-invalid');
        document.getElementById('cardholderName').classList.remove('is-invalid');
        document.getElementById('expiryDate').classList.remove('is-invalid');
        document.getElementById('cvv').classList.remove('is-invalid');

        // Update the progress step
        updateSteps(2);
    });

    // Function to update steps
    function updateSteps(currentStep) {
        const steps = document.querySelectorAll('.step');
        const progress = document.querySelector('.step-progress');

        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
                step.innerHTML = '<i class="bi bi-check-lg"></i>';
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
                step.innerHTML = `<span>${index + 1}</span>`;
            } else {
                step.classList.remove('active', 'completed');
                step.innerHTML = `<span>${index + 1}</span>`;
            }
        });

        // Update progress bar width
        const progressWidth = (currentStep / (steps.length - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
    }

    // Function to validate expiry date
    function isValidExpiryDate(value) {
        // Check format MM/YYYY
        if (!/^\d{2}\/\d{4}$/.test(value)) {
            return false;
        }

        const [month, year] = value.split('/');
        const monthNum = parseInt(month);

        // Check if month is valid (1-12)
        if (monthNum < 1 || monthNum > 12) {
            return false;
        }

        const expiryDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const today = new Date();

        // Set today to the beginning of the month for comparison
        today.setDate(1);
        today.setHours(0, 0, 0, 0);

        return expiryDate >= today;
    }

    // Format expiry date as user types
    const expiryDateInput = document.getElementById('expiryDate');
    expiryDateInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 6);
        }
        e.target.value = value;
    });

    // Format credit card number as user types (add spaces every 4 digits)
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        e.target.value = formattedValue;
    });

    // Track field focus to update progress steps
    const personalInfoFields = ['fullName', 'email', 'phone'];
    const addressFields = ['address', 'city', 'state', 'zip'];
    const paymentFields = ['cardNumber', 'cardholderName', 'expiryDate', 'cvv'];

    // When user starts filling payment fields, update step
    paymentFields.forEach(field => {
        document.getElementById(field).addEventListener('focus', function () {
            updateSteps(2);
        });
    });

    // When user starts filling address fields, update step
    addressFields.forEach(field => {
        document.getElementById(field).addEventListener('focus', function () {
            if (document.querySelector('.step.active').nextElementSibling &&
                document.querySelector('.step.active').nextElementSibling.classList.contains('active')) {
                return; // Don't go backwards if already on a later step
            }
            updateSteps(1);
        });
    });

    // When user starts filling personal info fields, update step
    personalInfoFields.forEach(field => {
        document.getElementById(field).addEventListener('focus', function () {
            if (!document.querySelector('.step:first-child').classList.contains('active')) {
                return; // Don't go backwards if already on a later step
            }
            updateSteps(0);
        });
    });

    // Custom validation on submit
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Add was-validated class to show Bootstrap validation styles
        form.classList.add('was-validated');

        let isValid = true;

        // Full Name validation
        const fullName = document.getElementById('fullName');
        const fullNameError = document.getElementById('fullNameError');
        const namePattern = /^[A-Za-z ]+$/;

        if (!namePattern.test(fullName.value)) {
            fullName.setCustomValidity('Invalid name');
            fullNameError.textContent = 'Please enter a valid name (only alphabets allowed).';
            isValid = false;
        } else {
            fullName.setCustomValidity('');
        }

        // Email validation
        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email.value)) {
            email.setCustomValidity('Invalid email');
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            email.setCustomValidity('');
        }

        // Phone validation
        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phonePattern = /^[0-9]{10,15}$/;

        if (!phonePattern.test(phone.value)) {
            phone.setCustomValidity('Invalid phone');
            phoneError.textContent = 'Please enter a valid phone number (10-15 digits).';
            isValid = false;
        } else {
            phone.setCustomValidity('');
        }

        // Address validation
        const address = document.getElementById('address');
        const addressError = document.getElementById('addressError');

        if (address.value.trim() === '') {
            address.setCustomValidity('Address required');
            addressError.textContent = 'Please enter your address.';
            isValid = false;
        } else {
            address.setCustomValidity('');
        }

        // Credit Card validation
        const cardNumber = document.getElementById('cardNumber');
        const cardNumberError = document.getElementById('cardNumberError');
        const cardValue = cardNumber.value.replace(/\s/g, '');
        const cardPattern = /^[0-9]{16}$/;

        if (!cardPattern.test(cardValue)) {
            cardNumber.setCustomValidity('Invalid card');
            cardNumberError.textContent = 'Please enter a valid 16-digit credit card number.';
            isValid = false;
        } else {
            cardNumber.setCustomValidity('');
        }

        // Expiry Date validation
        const expiryDate = document.getElementById('expiryDate');
        const expiryDateError = document.getElementById('expiryDateError');

        if (!isValidExpiryDate(expiryDate.value)) {
            expiryDate.setCustomValidity('Invalid date');
            expiryDateError.textContent = 'Please enter a valid future expiry date (MM/YYYY).';
            isValid = false;
        } else {
            expiryDate.setCustomValidity('');
        }

        // CVV validation
        const cvv = document.getElementById('cvv');
        const cvvError = document.getElementById('cvvError');
        const cvvPattern = /^[0-9]{3}$/;

        if (!cvvPattern.test(cvv.value)) {
            cvv.setCustomValidity('Invalid CVV');
            cvvError.textContent = 'Please enter a valid 3-digit CVV.';
            isValid = false;
        } else {
            cvv.setCustomValidity('');
        }

        // Validate other required fields
        const city = document.getElementById('city');
        const state = document.getElementById('state');
        const zip = document.getElementById('zip');

        if (city.value.trim() === '') {
            city.setCustomValidity('City required');
            isValid = false;
        } else {
            city.setCustomValidity('');
        }

        if (state.value === '') {
            state.setCustomValidity('State required');
            isValid = false;
        } else {
            state.setCustomValidity('');
        }

        if (zip.value.trim() === '') {
            zip.setCustomValidity('Zip required');
            isValid = false;
        } else {
            zip.setCustomValidity('');
        }

        // If all validations pass
        if (isValid && form.checkValidity()) {
            // Update to completed step
            updateSteps(3);

            // Show success modal
            setTimeout(() => {
                successModal.show();
            }, 500);

            // Reset form
            form.reset();
            form.classList.remove('was-validated');

            // Reset steps
            setTimeout(() => {
                updateSteps(0);
            }, 1000);
        }
    });

    // Real-time validation for better user experience
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            // Validate this specific field
            if (input.id === 'fullName') {
                const namePattern = /^[A-Za-z ]+$/;
                if (!namePattern.test(input.value) && input.value !== '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            }

            if (input.id === 'email') {
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(input.value) && input.value !== '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            }

            if (input.id === 'phone') {
                const phonePattern = /^[0-9]{10,15}$/;
                if (!phonePattern.test(input.value) && input.value !== '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            }

            if (input.id === 'cardNumber') {
                const cardValue = input.value.replace(/\s/g, '');
                const cardPattern = /^[0-9]{16}$/;
                if (!cardPattern.test(cardValue) && cardValue !== '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            }

            if (input.id === 'expiryDate') {
                if (!isValidExpiryDate(input.value) && input.value !== '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            }

            if (input.id === 'cvv') {
                const cvvPattern = /^[0-9]{3}$/;
                if (!cvvPattern.test(input.value) && input.value !== '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            }
        });
    });

    // Initialize steps
    updateSteps(0);
});
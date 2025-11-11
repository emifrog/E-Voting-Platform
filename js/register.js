// Register Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordMatchHint = document.getElementById('passwordMatchHint');
    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');
    const submitLoader = document.getElementById('submitLoader');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const successAlert = document.getElementById('successAlert');
    const successMessage = document.getElementById('successMessage');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Password Strength Checker
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            passwordStrength.style.display = 'none';
            return;
        }

        passwordStrength.style.display = 'block';
        
        let strength = 0;
        let feedback = '';
        
        // Length check
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 10;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
        
        // Set strength level and color
        strengthFill.style.width = strength + '%';
        
        if (strength < 40) {
            strengthFill.style.background = '#ef4444';
            feedback = 'Faible';
            strengthFill.classList.remove('medium', 'strong');
            strengthFill.classList.add('weak');
        } else if (strength < 70) {
            strengthFill.style.background = '#f59e0b';
            feedback = 'Moyen';
            strengthFill.classList.remove('weak', 'strong');
            strengthFill.classList.add('medium');
        } else {
            strengthFill.style.background = '#10b981';
            feedback = 'Fort';
            strengthFill.classList.remove('weak', 'medium');
            strengthFill.classList.add('strong');
        }
        
        strengthText.textContent = `Force du mot de passe : ${feedback}`;
    });

    // Password Match Checker
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value.length === 0) {
            passwordMatchHint.style.display = 'none';
            return;
        }

        if (this.value !== passwordInput.value) {
            passwordMatchHint.style.display = 'block';
            this.classList.add('error');
        } else {
            passwordMatchHint.style.display = 'none';
            this.classList.remove('error');
        }
    });

    // Form Validation
    function validateForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Reset alerts
        hideAlert(errorAlert);
        hideAlert(successAlert);

        // Validate first name
        if (firstName.length < 2) {
            showError('Le prénom doit contenir au moins 2 caractères');
            return false;
        }

        // Validate last name
        if (lastName.length < 2) {
            showError('Le nom doit contenir au moins 2 caractères');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Veuillez entrer une adresse email valide');
            return false;
        }

        // Validate password strength
        if (password.length < 8) {
            showError('Le mot de passe doit contenir au moins 8 caractères');
            return false;
        }

        if (!/[a-z]/.test(password)) {
            showError('Le mot de passe doit contenir au moins une minuscule');
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            showError('Le mot de passe doit contenir au moins une majuscule');
            return false;
        }

        if (!/[0-9]/.test(password)) {
            showError('Le mot de passe doit contenir au moins un chiffre');
            return false;
        }

        // Validate password match
        if (password !== confirmPassword) {
            showError('Les mots de passe ne correspondent pas');
            return false;
        }

        // Validate terms acceptance
        if (!acceptTerms) {
            showError('Vous devez accepter les conditions générales d\'utilisation');
            return false;
        }

        return true;
    }

    // Form Submit Handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitText.textContent = 'Création en cours...';
        submitIcon.style.display = 'none';
        submitLoader.style.display = 'inline-block';

        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            organization: document.getElementById('organization').value.trim(),
            password: passwordInput.value,
            accountType: document.querySelector('input[name="accountType"]:checked').value,
            newsletter: document.getElementById('newsletter').checked,
            acceptTerms: document.getElementById('acceptTerms').checked
        };

        try {
            // Simulate API call (replace with actual API endpoint)
            await simulateRegistration(formData);

            // Show success message
            showSuccess('Compte créé avec succès ! Redirection vers la page de connexion...');
            
            // Reset form
            form.reset();
            passwordStrength.style.display = 'none';

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            showError(error.message || 'Une erreur est survenue lors de la création du compte');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitText.textContent = 'Créer mon compte gratuit';
            submitIcon.style.display = 'inline-block';
            submitLoader.style.display = 'none';
        }
    });

    // Simulate Registration API Call
    async function simulateRegistration(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                const success = true; // Change to Math.random() > 0.3 for random results
                
                if (success) {
                    console.log('Registration data:', data);
                    resolve({ success: true, message: 'Account created successfully' });
                } else {
                    reject(new Error('Cet email est déjà utilisé'));
                }
            }, 1500);
        });
    }

    // Show Error Alert
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.style.display = 'flex';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideAlert(errorAlert);
        }, 5000);
    }

    // Show Success Alert
    function showSuccess(message) {
        successMessage.textContent = message;
        successAlert.style.display = 'flex';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Hide Alert
    function hideAlert(alert) {
        alert.style.display = 'none';
    }

    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    });

    // Clear error class on focus
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
});

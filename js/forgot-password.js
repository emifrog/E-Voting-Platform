// Forgot Password Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have a reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    
    // Elements - Step 1 (Request)
    const requestStep = document.getElementById('requestStep');
    const requestForm = document.getElementById('requestForm');
    const emailInput = document.getElementById('email');
    const requestButton = document.getElementById('requestButton');
    const requestText = document.getElementById('requestText');
    const requestIcon = document.getElementById('requestIcon');
    const requestLoader = document.getElementById('requestLoader');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    // Elements - Step 2 (Confirmation)
    const confirmStep = document.getElementById('confirmStep');
    const sentEmail = document.getElementById('sentEmail');
    const resendButton = document.getElementById('resendButton');
    
    // Elements - Step 3 (Reset)
    const resetStep = document.getElementById('resetStep');
    const resetForm = document.getElementById('resetForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmNewPassword = document.getElementById('toggleConfirmNewPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordMatchHint = document.getElementById('passwordMatchHint');
    const resetButton = document.getElementById('resetButton');
    const resetText = document.getElementById('resetText');
    const resetIcon = document.getElementById('resetIcon');
    const resetLoader = document.getElementById('resetLoader');
    const successAlert = document.getElementById('successAlert');
    const successMessage = document.getElementById('successMessage');
    const resetErrorAlert = document.getElementById('resetErrorAlert');
    const resetErrorMessage = document.getElementById('resetErrorMessage');
    
    // If token exists, show reset form
    if (resetToken) {
        showResetStep();
    }
    
    // ==========================================
    // STEP 1: REQUEST RESET LINK
    // ==========================================
    
    // Request Form Submit
    requestForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!validateEmail(email)) {
            showError('Veuillez entrer une adresse email valide');
            return;
        }
        
        // Show loading state
        requestButton.disabled = true;
        requestText.textContent = 'Envoi en cours...';
        requestIcon.style.display = 'none';
        requestLoader.style.display = 'inline-block';
        hideAlert(errorAlert);
        
        try {
            // Simulate API call
            await sendResetEmail(email);
            
            // Show confirmation step
            sentEmail.textContent = email;
            requestStep.style.display = 'none';
            confirmStep.style.display = 'block';
            
        } catch (error) {
            showError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            // Reset button state
            requestButton.disabled = false;
            requestText.textContent = 'Envoyer le lien de réinitialisation';
            requestIcon.style.display = 'inline-block';
            requestLoader.style.display = 'none';
        }
    });
    
    // ==========================================
    // STEP 2: CONFIRMATION
    // ==========================================
    
    // Resend Email
    resendButton.addEventListener('click', async function() {
        const email = sentEmail.textContent;
        
        this.disabled = true;
        this.textContent = 'Envoi...';
        
        try {
            await sendResetEmail(email);
            this.textContent = '✓ Email renvoyé !';
            
            setTimeout(() => {
                this.textContent = 'renvoyez l\'email';
                this.disabled = false;
            }, 3000);
            
        } catch (error) {
            this.textContent = 'Erreur';
            setTimeout(() => {
                this.textContent = 'renvoyez l\'email';
                this.disabled = false;
            }, 3000);
        }
    });
    
    // ==========================================
    // STEP 3: RESET PASSWORD
    // ==========================================
    
    // Toggle Password Visibility
    if (toggleNewPassword) {
        toggleNewPassword.addEventListener('click', function() {
            const type = newPasswordInput.type === 'password' ? 'text' : 'password';
            newPasswordInput.type = type;
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    if (toggleConfirmNewPassword) {
        toggleConfirmNewPassword.addEventListener('click', function() {
            const type = confirmNewPasswordInput.type === 'password' ? 'text' : 'password';
            confirmNewPasswordInput.type = type;
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Password Strength Checker
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
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
            } else if (strength < 70) {
                strengthFill.style.background = '#f59e0b';
                feedback = 'Moyen';
            } else {
                strengthFill.style.background = '#10b981';
                feedback = 'Fort';
            }
            
            strengthText.textContent = `Force du mot de passe : ${feedback}`;
        });
    }
    
    // Password Match Checker
    if (confirmNewPasswordInput) {
        confirmNewPasswordInput.addEventListener('input', function() {
            if (this.value.length === 0) {
                passwordMatchHint.style.display = 'none';
                return;
            }
            
            if (this.value !== newPasswordInput.value) {
                passwordMatchHint.style.display = 'block';
                this.classList.add('error');
            } else {
                passwordMatchHint.style.display = 'none';
                this.classList.remove('error');
            }
        });
    }
    
    // Reset Form Submit
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmNewPasswordInput.value;
            
            // Validate password
            if (!validatePassword(newPassword)) {
                return;
            }
            
            // Check password match
            if (newPassword !== confirmPassword) {
                showResetError('Les mots de passe ne correspondent pas');
                return;
            }
            
            // Show loading state
            resetButton.disabled = true;
            resetText.textContent = 'Réinitialisation...';
            resetIcon.style.display = 'none';
            resetLoader.style.display = 'inline-block';
            hideAlert(resetErrorAlert);
            hideAlert(successAlert);
            
            try {
                // Simulate API call
                await resetPassword(resetToken, newPassword);
                
                // Show success message
                showSuccess('Mot de passe réinitialisé avec succès ! Redirection...');
                
                // Reset form
                resetForm.reset();
                passwordStrength.style.display = 'none';
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } catch (error) {
                showResetError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
            } finally {
                // Reset button state
                resetButton.disabled = false;
                resetText.textContent = 'Réinitialiser le mot de passe';
                resetIcon.style.display = 'inline-block';
                resetLoader.style.display = 'none';
            }
        });
    }
    
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    
    // Show Reset Step
    function showResetStep() {
        requestStep.style.display = 'none';
        confirmStep.style.display = 'none';
        resetStep.style.display = 'block';
    }
    
    // Validate Email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validate Password
    function validatePassword(password) {
        if (password.length < 8) {
            showResetError('Le mot de passe doit contenir au moins 8 caractères');
            return false;
        }
        
        if (!/[a-z]/.test(password)) {
            showResetError('Le mot de passe doit contenir au moins une minuscule');
            return false;
        }
        
        if (!/[A-Z]/.test(password)) {
            showResetError('Le mot de passe doit contenir au moins une majuscule');
            return false;
        }
        
        if (!/[0-9]/.test(password)) {
            showResetError('Le mot de passe doit contenir au moins un chiffre');
            return false;
        }
        
        return true;
    }
    
    // Simulate Send Reset Email API Call
    async function sendResetEmail(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success
                console.log('Reset email sent to:', email);
                resolve({ success: true });
            }, 1500);
        });
    }
    
    // Simulate Reset Password API Call
    async function resetPassword(token, newPassword) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success
                console.log('Password reset with token:', token);
                resolve({ success: true });
            }, 1500);
        });
    }
    
    // Show Error Alert (Step 1)
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.style.display = 'flex';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            hideAlert(errorAlert);
        }, 5000);
    }
    
    // Show Error Alert (Step 3)
    function showResetError(message) {
        resetErrorMessage.textContent = message;
        resetErrorAlert.style.display = 'flex';
        resetErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            hideAlert(resetErrorAlert);
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
});

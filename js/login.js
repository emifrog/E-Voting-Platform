/* ==========================================
   LOGIN PAGE JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const loginForm = document.getElementById('loginForm');
    const emailGroup = document.getElementById('emailGroup');
    const passwordGroup = document.getElementById('passwordGroup');
    const twoFactorGroup = document.getElementById('twoFactorGroup');
    const formOptions = document.getElementById('formOptions');
    const registerLink = document.getElementById('registerLink');
    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');
    const submitLoader = document.getElementById('submitLoader');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const loginTitle = document.getElementById('loginTitle');
    const loginSubtitle = document.getElementById('loginSubtitle');
    const togglePassword = document.getElementById('togglePassword');
    const backToLogin = document.getElementById('backToLogin');
    
    // State
    let requires2FA = false;
    let loginData = {};
    
    // API Configuration
    const API_URL = window.location.origin + '/api' || 'http://localhost:3000/api';
    
    // ==========================================
    // TOGGLE PASSWORD VISIBILITY
    // ==========================================
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // ==========================================
    // BACK TO LOGIN
    // ==========================================
    
    if (backToLogin) {
        backToLogin.addEventListener('click', function() {
            requires2FA = false;
            showEmailPasswordForm();
        });
    }
    
    // ==========================================
    // FORM SUBMISSION
    // ==========================================
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideError();
            
            if (!requires2FA) {
                // First step: Email + Password
                await handleEmailPasswordLogin();
            } else {
                // Second step: 2FA Code
                await handle2FAVerification();
            }
        });
    }
    
    // ==========================================
    // HANDLE EMAIL/PASSWORD LOGIN
    // ==========================================
    
    async function handleEmailPasswordLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Store for 2FA step
        loginData = { email, password };
        
        setLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion');
            }
            
            if (data.requires_2fa) {
                // Show 2FA form
                requires2FA = true;
                show2FAForm();
            } else {
                // Login successful
                handleLoginSuccess(data);
            }
            
        } catch (error) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    }
    
    // ==========================================
    // HANDLE 2FA VERIFICATION
    // ==========================================
    
    async function handle2FAVerification() {
        const twoFactorCode = document.getElementById('twoFactorCode').value;
        
        if (!twoFactorCode || twoFactorCode.length !== 6) {
            showError('Veuillez entrer un code à 6 chiffres');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password,
                    two_factor_code: twoFactorCode
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Code 2FA invalide');
            }
            
            // Login successful
            handleLoginSuccess(data);
            
        } catch (error) {
            showError(error.message);
            
            // Clear 2FA code on error
            document.getElementById('twoFactorCode').value = '';
            document.getElementById('twoFactorCode').focus();
        } finally {
            setLoading(false);
        }
    }
    
    // ==========================================
    // HANDLE LOGIN SUCCESS
    // ==========================================
    
    function handleLoginSuccess(data) {
        // Store token
        localStorage.setItem('token', data.token);
        
        // Store user info
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Remember me
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        // Show success message
        showSuccess('Connexion réussie ! Redirection...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // ==========================================
    // UI STATE MANAGEMENT
    // ==========================================
    
    function show2FAForm() {
        // Hide email/password fields
        emailGroup.style.display = 'none';
        passwordGroup.style.display = 'none';
        formOptions.style.display = 'none';
        registerLink.style.display = 'none';
        
        // Show 2FA field
        twoFactorGroup.style.display = 'block';
        
        // Update title
        loginTitle.textContent = 'Authentification 2FA';
        loginSubtitle.textContent = "Entrez le code de votre application d'authentification";
        
        // Update button text
        submitText.textContent = 'Vérifier le code';
        
        // Focus 2FA input
        document.getElementById('twoFactorCode').focus();
    }
    
    function showEmailPasswordForm() {
        // Show email/password fields
        emailGroup.style.display = 'block';
        passwordGroup.style.display = 'block';
        formOptions.style.display = 'flex';
        registerLink.style.display = 'block';
        
        // Hide 2FA field
        twoFactorGroup.style.display = 'none';
        
        // Reset title
        loginTitle.textContent = 'Connexion';
        loginSubtitle.textContent = 'Accédez à votre espace de vote sécurisé';
        
        // Reset button text
        submitText.textContent = 'Se connecter';
        
        // Clear 2FA code
        document.getElementById('twoFactorCode').value = '';
    }
    
    function setLoading(loading) {
        submitButton.disabled = loading;
        
        if (loading) {
            submitText.style.display = 'none';
            submitIcon.style.display = 'none';
            submitLoader.style.display = 'inline-block';
        } else {
            submitText.style.display = 'inline-block';
            submitIcon.style.display = 'inline-block';
            submitLoader.style.display = 'none';
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.style.display = 'flex';
        
        // Auto hide after 5 seconds
        setTimeout(hideError, 5000);
    }
    
    function hideError() {
        errorAlert.style.display = 'none';
    }
    
    function showSuccess(message) {
        // Create success alert if not exists
        let successAlert = document.getElementById('successAlert');
        
        if (!successAlert) {
            successAlert = document.createElement('div');
            successAlert.id = 'successAlert';
            successAlert.className = 'alert alert-success';
            successAlert.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span id="successMessage"></span>
            `;
            errorAlert.parentNode.insertBefore(successAlert, errorAlert);
        }
        
        document.getElementById('successMessage').textContent = message;
        successAlert.style.display = 'flex';
    }
    
    // ==========================================
    // AUTO-FILL FROM STORAGE
    // ==========================================
    
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            document.getElementById('email').value = savedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
    
    // ==========================================
    // SAVE EMAIL ON REMEMBER ME CHECK
    // ==========================================
    
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                const email = document.getElementById('email').value;
                if (email) {
                    localStorage.setItem('savedEmail', email);
                }
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('rememberMe');
            }
        });
    }
    
    // ==========================================
    // 2FA CODE AUTO-FORMAT
    // ==========================================
    
    const twoFactorInput = document.getElementById('twoFactorCode');
    if (twoFactorInput) {
        twoFactorInput.addEventListener('input', function(e) {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
            
            // Auto-submit when 6 digits entered
            if (this.value.length === 6) {
                setTimeout(() => {
                    loginForm.dispatchEvent(new Event('submit', { cancelable: true }));
                }, 300);
            }
        });
    }
    
    // ==========================================
    // CHECK IF ALREADY LOGGED IN
    // ==========================================
    
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token validity
        fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                // Token is valid, redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Token invalid, remove it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        })
        .catch(() => {
            // Error verifying token, remove it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });
    }
    
});

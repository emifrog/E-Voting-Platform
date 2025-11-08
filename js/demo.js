document.addEventListener('DOMContentLoaded', function() {
    const demoForm = document.getElementById('demoForm');
    
    if (demoForm) {
        // Validation en temps réel
        const inputs = demoForm.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Valider tous les champs
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showNotification('Veuillez corriger les erreurs', 'error');
                return;
            }
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            try {
                // Simulation d'envoi (remplacer par votre API)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success
                showNotification('✅ Demande envoyée ! Nous vous contactons sous 2h.', 'success');
                e.target.reset();
                
                // Google Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-XXXXXXXXX/XXXXXX',
                        'value': 499.0,
                        'currency': 'EUR'
                    });
                }
            } catch (error) {
                showNotification('❌ Erreur. Réessayez ou contactez-nous directement.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        removeError(field);
        
        if (field.hasAttribute('required') && !value) {
            showError(field, 'Ce champ est obligatoire');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Email invalide');
                return false;
            }
        }
        
        return true;
    }
    
    function showError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }
    
    function removeError(field) {
        field.classList.remove('error');
        const error = field.parentElement.querySelector('.field-error');
        if (error) error.remove();
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
});
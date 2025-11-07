// demo-form.js
document.getElementById('demoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours...';
  
  try {
    // Envoi vers votre backend
    const response = await fetch('/api/demo-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      // Success
      alert('✅ Demande reçue ! Nous vous contactons sous 2h.');
      e.target.reset();
      
      // Track conversion (Google Analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-XXXXXXXXX/XXXXXX',
          'value': 499.0,
          'currency': 'EUR'
        });
      }
    } else {
      throw new Error('Erreur serveur');
    }
  } catch (error) {
    alert('❌ Erreur. Contactez-nous directement : contact@e-voting.fr');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Demander une démo gratuite';
  }
});
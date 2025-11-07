// calculator.js
document.addEventListener('DOMContentLoaded', () => {
  const votersInput = document.getElementById('voters');
  const electionsInput = document.getElementById('elections');
  
  function updateCalculator() {
    const voters = parseInt(votersInput.value) || 100;
    const elections = parseInt(electionsInput.value) || 2;
    
    // E-Voting: 2€ par votant
    const evotingCost = voters * 2 * elections;
    
    // Voteer: 4€ par votant (moyenne)
    const voteerCost = voters * 4 * elections;
    
    // Savings
    const savings = voteerCost - evotingCost;
    const savingsPercent = Math.round((savings / voteerCost) * 100);
    
    // Update DOM
    document.getElementById('evoting-price').textContent = 
      evotingCost.toLocaleString('fr-FR') + ' €';
    
    document.getElementById('voteer-price').textContent = 
      voteerCost.toLocaleString('fr-FR') + ' €';
    
    document.getElementById('savings').textContent = 
      savings.toLocaleString('fr-FR') + ' €';
    
    document.querySelector('.savings-percent').textContent = 
      savingsPercent + '%';
  }
  
  votersInput.addEventListener('input', updateCalculator);
  electionsInput.addEventListener('input', updateCalculator);
  
  // Initial calculation
  updateCalculator();
});
// Calculator for E-Voting Platform
document.addEventListener('DOMContentLoaded', function() {
    const votersInput = document.getElementById('voters');
    const electionsInput = document.getElementById('elections');
    const evotingPrice = document.getElementById('evoting-price');
    const voteerPrice = document.getElementById('voteer-price');
    const savings = document.getElementById('savings');

    if (!votersInput || !electionsInput) return;

    function calculatePrices() {
        const voters = parseInt(votersInput.value) || 100;
        const elections = parseInt(electionsInput.value) || 2;

        // E-Voting pricing: 2€ per voter
        const evotingTotal = voters * 2 * elections;

        // Voteer pricing: estimated 4€ per voter
        const voteerTotal = voters * 4 * elections;

        // Calculate savings
        const savingsAmount = voteerTotal - evotingTotal;
        const savingsPercent = Math.round((savingsAmount / voteerTotal) * 100);

        // Update display
        evotingPrice.textContent = evotingTotal + ' €';
        voteerPrice.textContent = voteerTotal + ' €';
        savings.textContent = savingsAmount + ' €';

        // Update savings percent
        const savingsPercentElement = document.querySelector('.savings-percent');
        if (savingsPercentElement) {
            savingsPercentElement.textContent = savingsPercent + '%';
        }
    }

    // Add event listeners
    votersInput.addEventListener('input', calculatePrices);
    electionsInput.addEventListener('input', calculatePrices);

    // Initial calculation
    calculatePrices();

    // Format numbers with spaces for better readability
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    // Modifier les lignes d'affichage :
    evotingPrice.textContent = formatPrice(evotingTotal) + ' €';
    voteerPrice.textContent = formatPrice(voteerTotal) + ' €';
    savings.textContent = formatPrice(savingsAmount) + ' €';
});

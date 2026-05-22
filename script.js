// Get all DOM elements
const interestCheckboxes = document.querySelectorAll('.interest-checkbox');
const recommendBtn = document.getElementById('recommendBtn');
const resultsSection = document.getElementById('resultsSection');
const interestsSection = document.querySelector('.interests-section');
const gamesGrid = document.getElementById('gamesGrid');
const emptyState = document.getElementById('emptyState');

// Add event listener to recommend button
recommendBtn.addEventListener('click', getRecommendations);

// Add event listeners to interest checkboxes for immediate feedback
interestCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Visual feedback is handled by CSS :has() selector
    });
});

// Main recommendation function
function getRecommendations() {
    // Get selected interests
    const selectedInterests = Array.from(interestCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // Validate selection
    if (selectedInterests.length === 0) {
        emptyState.style.display = 'block';
        resultsSection.style.display = 'none';
        return;
    }

    // Hide empty state and interests section
    emptyState.style.display = 'none';
    interestsSection.style.display = 'none';

    // Calculate game scores based on interest matches
    const scoredGames = gamesDatabase.map(game => {
        // Count how many of the selected interests match this game's genres
        const matchCount = selectedInterests.filter(interest =>
            game.genres.includes(interest)
        ).length;

        return {
            ...game,
            score: matchCount,
            matchPercentage: Math.round((matchCount / selectedInterests.length) * 100)
        };
    });

    // Sort by score (highest first) and filter out games with no matches
    const recommendedGames = scoredGames
        .filter(game => game.score > 0)
        .sort((a, b) => b.score - a.score);

    // Display games
    displayGames(recommendedGames, selectedInterests);
    resultsSection.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Display games in grid
function displayGames(games, selectedInterests) {
    gamesGrid.innerHTML = ''; // Clear previous results

    games.forEach((game, index) => {
        const gameCard = createGameCard(game, index);
        gamesGrid.appendChild(gameCard);
    });
}

// Create individual game card
function createGameCard(game, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.1}s`;

    // Create genres HTML
    const genresHTML = game.genres
        .map(genre => `<span class="genre-tag">${genre}</span>`)
        .join('');

    card.innerHTML = `
        <div class="game-title">${game.title}</div>
        <div class="game-rating">${game.rating}</div>
        <div class="game-description">${game.description}</div>
        <div class="game-genres">${genresHTML}</div>
    `;

    return card;
}

// Reset recommendations and go back to interests
function resetRecommendations() {
    // Show interests section and hide results
    interestsSection.style.display = 'block';
    resultsSection.style.display = 'none';
    emptyState.style.display = 'none';

    // Clear checkboxes
    interestCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Scroll back to top
    setTimeout(() => {
        document.querySelector('.interests-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Optional: Add enter key support for button
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && event.target === document.body) {
        getRecommendations();
    }
});

// Optional: Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Press R to get recommendations
    if (event.key.toLowerCase() === 'r') {
        getRecommendations();
    }
    // Press Escape to reset
    if (event.key === 'Escape' && resultsSection.style.display !== 'none') {
        resetRecommendations();
    }
});

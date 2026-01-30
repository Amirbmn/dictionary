
let dictionaryData = [];
let searchTimeout;
let focusedSuggestionIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        themeToggle.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark');
        themeToggle.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    body.classList.toggle('dark');
    
    if (body.classList.contains('dark')) {
        themeToggle.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        focusedSuggestionIndex = -1;
        searchTimeout = setTimeout(() => {
            handleSearch(this.value, false);
        }, 300);
    });

    searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        // Close suggestions immediately when Enter is pressed
        closeSuggestions();
        
        if (focusedSuggestionIndex >= 0) {
            const suggestions = document.querySelectorAll('.suggestion-item');
            const selectedWord = dictionaryData.find(word => 
                word.word === suggestions[focusedSuggestionIndex].textContent
            );
            if (selectedWord) {
                selectWord(selectedWord);
            }
        } else {
            handleSearch(this.value, true);
        }
    }
});


    searchInput.addEventListener('keydown', function(e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (focusedSuggestionIndex < suggestions.length - 1) {
                focusedSuggestionIndex++;
                updateSuggestionFocus(suggestions);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (focusedSuggestionIndex > 0) {
                focusedSuggestionIndex--;
                updateSuggestionFocus(suggestions);
            }
        }
    });

  document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.search-container');
    const suggestions = document.getElementById('suggestions');
    
    // Close suggestions if clicking outside the search container
    if (!searchContainer.contains(e.target)) {
        closeSuggestions();
    }
});
}

function updateSuggestionFocus(suggestions) {
    suggestions.forEach((item, index) => {
        item.classList.toggle('focused', index === focusedSuggestionIndex);
        if (index === focusedSuggestionIndex) {
            item.scrollIntoView({ block: 'nearest' });
        }
    });
}

async function handleSearch(query, showResults) {
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    if (!query.trim()) {
        closeSuggestions();
        document.getElementById('resultsSection').innerHTML = '';
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        try {
            // Fetch from your server
            const response = await fetch(`http://localhost:3000/words?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            // Store in global variable for suggestions
            dictionaryData = data;
            
            // Only show suggestions if NOT showing results (typing mode)
            if (!showResults && data.length > 0) {
                showSuggestions(data.slice(0, 5), query);
            } else {
                // When showing results, close suggestions
                closeSuggestions();
            }
            
            if (showResults) {
                showLoading();
                setTimeout(() => {
                    if (data.length > 0) {
                        displayResults(data);
                    } else {
                        showNoResults(query);
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Error fetching data', 'error');
        }
    }, 300);


    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    if (!query.trim()) {
        closeSuggestions();
        document.getElementById('resultsSection').innerHTML = '';
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        try {
            // Fetch from your server
            const response = await fetch(`http://localhost:3000/words?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            // Store in global variable for suggestions
            dictionaryData = data;
            
            // Show suggestions
            if (data.length > 0) {
                showSuggestions(data.slice(0, 5), query);
            } else {
                closeSuggestions();
            }
            
            if (showResults) {
                showLoading();
                setTimeout(() => {
                    if (data.length > 0) {
                        displayResults(data);
                    } else {
                        showNoResults(query);
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Error fetching data', 'error');
        }
    }, 300);
}

function showSuggestions(words, query) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    words.forEach(word => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = word.word;
        item.addEventListener('click', () => selectWord(word));
        suggestions.appendChild(item);
    });

    suggestions.classList.add('active');
    focusedSuggestionIndex = -1;
}

function selectWord(word) {
    document.getElementById('searchInput').value = word.word;
    closeSuggestions(); // Close suggestions when a word is selected
    showLoading();
    
    // Fetch the word details again to ensure we have fresh data
    setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:3000/words?q=${encodeURIComponent(word.word)}`);
            const data = await response.json();
            
            // Find the exact word match
            const exactMatch = data.find(w => w.word.toLowerCase() === word.word.toLowerCase());
            if (exactMatch) {
                displayResults([exactMatch]);
            } else if (data.length > 0) {
                displayResults([data[0]]);
            } else {
                showNoResults(word.word);
            }
        } catch (error) {
            console.error('Error fetching word details:', error);
            showToast('Error loading word details', 'error');
        }
    }, 300);

    document.getElementById('searchInput').value = word.word;
    closeSuggestions();
    showLoading();
    
    // Fetch the word details again to ensure we have fresh data
    setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:3000/words?q=${encodeURIComponent(word.word)}`);
            const data = await response.json();
            
            // Find the exact word match
            const exactMatch = data.find(w => w.word.toLowerCase() === word.word.toLowerCase());
            if (exactMatch) {
                displayResults([exactMatch]);
            } else if (data.length > 0) {
                displayResults([data[0]]);
            } else {
                showNoResults(word.word);
            }
        } catch (error) {
            console.error('Error fetching word details:', error);
            showToast('Error loading word details', 'error');
        }
    }, 300);
}

function closeSuggestions() {
    document.getElementById('suggestions').classList.remove('active');
    focusedSuggestionIndex = -1;
}

function showLoading() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

function showNoResults(query) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = `
        <div class="word-card">
            <div class="word-header">
                <div>
                    <h2 class="word-title">No Results Found</h2>
                    <div class="word-persianMeaning">نتیجه‌ای یافت نشد</div>
                </div>
            </div>
            <div class="definitions">
                <div class="definition-item">No words found for "${query}". Try a different search term.</div>
            </div>
        </div>
    `;
}

function displayResults(words) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = '';

    words.forEach((word, index) => {
        const wordCard = createWordCard(word, index);
        wordCard.style.animationDelay = `${index * 0.1}s`;
        resultsSection.appendChild(wordCard);
    });
}

function createWordCard(word, index) {
    const card = document.createElement('div');
    card.className = 'word-card';
    
    card.innerHTML = `
        <div class="word-header">
            <div>
                <h2 class="word-title">${word.word || ''}</h2>
                ${word.persianMeaning ? `<div class="word-persianMeaning">${word.persianMeaning}</div>` : ''}
                ${word.pronunciation ? `<div class="word-pronunciation">/${word.pronunciation}/</div>` : ''}
            </div>
        </div>
        
        ${word.partOfSpeech ? `<span class="part-of-speech">${word.partOfSpeech}</span>` : '<span class="part-of-speech">word</span>'}
        
        ${word.definitions && word.definitions.length > 0 && word.definitions[0] ? `
            <div class="definitions">
                <h4>Definition</h4>
                <div class="definition-item">${word.definitions[0]}</div>
            </div>
        ` : ''}
        
        ${word.examples && word.examples.length > 0 && word.examples[0] ? `
            <div class="examples">
                <h4>Example</h4>
                <div class="example-item">${word.examples[0]}</div>
            </div>
        ` : ''}
    `;
    
    return card;
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span style="margin-left: 8px;">${message}</span>
    `;

    if (type === 'error') {
        toast.style.background = 'var(--secondary-gradient)';
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuggestions();
    }
});
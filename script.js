// Periodensystem Lerntool JavaScript

class PeriodicTableTool {
    constructor() {
        this.isQuizMode = false;
        this.currentQuestion = null;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.streakCount = 0;
        this.elements = [];
        this.selectedElement = null;
        
        this.init();
    }

    init() {
        this.collectElements();
        this.bindEvents();
        this.showInfoMode();
    }

    collectElements() {
        // Sammle alle Elemente mit ihren Daten
        const elementNodes = document.querySelectorAll('.element');
        this.elements = Array.from(elementNodes).map(el => ({
            element: el,
            number: el.dataset.number,
            symbol: el.dataset.symbol,
            name: el.dataset.name,
            mass: el.dataset.mass,
            category: el.dataset.category
        }));
    }

    bindEvents() {
        // Button Event Listeners
        document.getElementById('quiz-btn').addEventListener('click', () => this.toggleQuizMode());
        document.getElementById('info-btn').addEventListener('click', () => this.showInfoMode());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetTool());

        // Element Click Event Listeners
        this.elements.forEach(({element}) => {
            element.addEventListener('click', (e) => this.handleElementClick(e));
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleElementClick(e) {
        const element = e.currentTarget;
        
        if (this.isQuizMode) {
            this.handleQuizAnswer(element);
        } else {
            this.showElementInfo(element);
        }
    }

    showElementInfo(element) {
        // Vorherige Auswahl entfernen
        document.querySelectorAll('.element.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Neues Element auswählen
        element.classList.add('selected');
        this.selectedElement = element;

        // Informationen anzeigen
        const data = this.getElementData(element);
        this.displayElementInfo(data);
    }

    getElementData(element) {
        return {
            name: element.dataset.name,
            symbol: element.dataset.symbol,
            number: element.dataset.number,
            mass: element.dataset.mass,
            category: element.dataset.category
        };
    }

    displayElementInfo(data) {
        document.getElementById('element-name').textContent = data.name;
        document.getElementById('element-symbol').textContent = data.symbol;
        document.getElementById('element-number').textContent = data.number;
        document.getElementById('element-mass').textContent = data.mass + ' u';
        document.getElementById('element-category').textContent = data.category;
    }

    toggleQuizMode() {
        if (this.isQuizMode) {
            this.showInfoMode();
        } else {
            this.startQuizMode();
        }
    }

    startQuizMode() {
        this.isQuizMode = true;
        this.clearSelections();
        
        // UI Updates
        document.getElementById('quiz-btn').textContent = 'Quiz beenden';
        document.getElementById('quiz-btn').classList.remove('primary');
        document.getElementById('quiz-btn').classList.add('secondary');
        document.getElementById('quiz-panel').classList.add('active');
        document.getElementById('info-panel').style.display = 'none';
        
        // Erste Frage generieren
        this.generateQuestion();
    }

    showInfoMode() {
        this.isQuizMode = false;
        this.clearSelections();
        
        // UI Updates
        document.getElementById('quiz-btn').textContent = 'Quiz starten';
        document.getElementById('quiz-btn').classList.remove('secondary');
        document.getElementById('quiz-btn').classList.add('primary');
        document.getElementById('quiz-panel').classList.remove('active');
        document.getElementById('info-panel').style.display = 'block';
        
        // Standard-Info zurücksetzen
        this.resetElementInfo();
    }

    generateQuestion() {
        // Zufälliges Element auswählen
        const randomIndex = Math.floor(Math.random() * this.elements.length);
        this.currentQuestion = this.elements[randomIndex];
        
        // Frage anzeigen
        document.getElementById('quiz-target').textContent = this.currentQuestion.symbol;
        
        // Alle visuellen Effekte zurücksetzen
        this.clearVisualEffects();
    }

    handleQuizAnswer(clickedElement) {
        const isCorrect = clickedElement === this.currentQuestion.element;
        
        if (isCorrect) {
            this.handleCorrectAnswer(clickedElement);
        } else {
            this.handleIncorrectAnswer(clickedElement);
        }
        
        // Nach kurzer Verzögerung neue Frage generieren
        setTimeout(() => {
            this.generateQuestion();
        }, 1500);
    }

    handleCorrectAnswer(element) {
        this.correctCount++;
        this.streakCount++;
        
        // Visueller Effekt
        element.classList.add('correct');
        
        // Statistiken aktualisieren
        this.updateQuizStats();
        
        // Erfolgs-Sound simulieren (visuell)
        this.showSuccessEffect();
    }

    handleIncorrectAnswer(element) {
        this.wrongCount++;
        this.streakCount = 0;
        
        // Visueller Effekt für falsches Element
        element.classList.add('incorrect');
        
        // Richtiges Element hervorheben
        this.currentQuestion.element.classList.add('correct');
        
        // Statistiken aktualisieren
        this.updateQuizStats();
        
        // Fehler-Effect
        this.showErrorEffect();
    }

    updateQuizStats() {
        document.getElementById('correct-count').textContent = this.correctCount;
        document.getElementById('wrong-count').textContent = this.wrongCount;
        document.getElementById('streak-count').textContent = this.streakCount;
    }

    showSuccessEffect() {
        // Kurzes Aufblitzen des Hintergrunds
        document.body.style.animation = 'successFlash 0.3s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }

    showErrorEffect() {
        // Kurzes Schütteln des Containers
        const container = document.querySelector('.container');
        container.style.animation = 'errorShake 0.5s ease';
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }

    clearVisualEffects() {
        document.querySelectorAll('.element').forEach(el => {
            el.classList.remove('correct', 'incorrect', 'selected');
        });
    }

    clearSelections() {
        document.querySelectorAll('.element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
    }

    resetTool() {
        // Quiz-Daten zurücksetzen
        this.correctCount = 0;
        this.wrongCount = 0;
        this.streakCount = 0;
        this.currentQuestion = null;
        
        // UI zurücksetzen
        this.showInfoMode();
        this.updateQuizStats();
        this.resetElementInfo();
        this.clearVisualEffects();
        
        // Bestätigung anzeigen
        this.showResetConfirmation();
    }

    resetElementInfo() {
        document.getElementById('element-name').textContent = 'Element auswählen';
        document.getElementById('element-symbol').textContent = '-';
        document.getElementById('element-number').textContent = '-';
        document.getElementById('element-mass').textContent = '-';
        document.getElementById('element-category').textContent = '-';
    }

    showResetConfirmation() {
        const resetBtn = document.getElementById('reset-btn');
        const originalText = resetBtn.textContent;
        resetBtn.textContent = '✓ Zurückgesetzt';
        resetBtn.style.background = 'linear-gradient(45deg, #00b894, #00cec9)';
        
        setTimeout(() => {
            resetBtn.textContent = originalText;
            resetBtn.style.background = '';
        }, 1500);
    }

    handleKeyPress(e) {
        // Escape-Taste zum Beenden des Quiz-Modus
        if (e.key === 'Escape' && this.isQuizMode) {
            this.showInfoMode();
        }
        
        // Enter-Taste zum Starten/Beenden des Quiz
        if (e.key === 'Enter') {
            this.toggleQuizMode();
        }
        
        // R-Taste zum Zurücksetzen
        if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
            e.preventDefault();
            this.resetTool();
        }
    }

    // Hilfsfunktionen für erweiterte Features
    getRandomElements(count = 4) {
        // Für Multiple-Choice Fragen (Erweiterung)
        const shuffled = [...this.elements].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getElementsByCategory(category) {
        return this.elements.filter(el => el.category === category);
    }

    calculateAccuracy() {
        const total = this.correctCount + this.wrongCount;
        return total > 0 ? Math.round((this.correctCount / total) * 100) : 0;
    }

    // Lokale Speicherung der Fortschritte (für Erweiterung)
    saveProgress() {
        const progress = {
            correctCount: this.correctCount,
            wrongCount: this.wrongCount,
            bestStreak: Math.max(this.streakCount, this.getBestStreak()),
            accuracy: this.calculateAccuracy(),
            timestamp: new Date().toISOString()
        };
        
        // Hinweis: localStorage wird in Artifacts nicht unterstützt
        // In einer echten Implementierung würde hier gespeichert werden
        console.log('Fortschritt würde gespeichert werden:', progress);
    }

    getBestStreak() {
        // Placeholder für gespeicherten besten Streak
        return 0;
    }
}

// CSS-Animationen dynamisch hinzufügen
const additionalStyles = `
@keyframes successFlash {
    0%, 100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    50% { background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); }
}

@keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}
`;

// Styles zum Dokument hinzufügen
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Tool initialisieren wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    const periodicTable = new PeriodicTableTool();
    
    // Globale Referenz für Debugging (optional)
    window.periodicTable = periodicTable;
    
    console.log('Periodensystem Lerntool geladen!');
    console.log('Tastaturkürzel:');
    console.log('- Enter: Quiz starten/beenden');
    console.log('- Escape: Quiz beenden');
    console.log('- Ctrl+R: Zurücksetzen');
});

// Service Worker für Offline-Funktionalität (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service Worker würde hier registriert werden
        console.log('Service Worker Unterstützung verfügbar');
    });
}

// Zusätzliche Utility-Funktionen
const Utils = {
    // Debounce-Funktion für Performance-Optimierung
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Zufällige Auswahl aus Array
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Array mischen
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Farbe basierend auf Elementkategorie
    getCategoryColor(category) {
        const colors = {
            'Alkalimetall': '#ff7675',
            'Erdalkalimetall': '#fdcb6e',
            'Übergangsmetall': '#74b9ff',
            'Nachübergangsmetall': '#a29bfe',
            'Halbmetall': '#fd79a8',
            'Nichtmetall': '#00b894',
            'Halogen': '#e17055',
            'Edelgas': '#636e72'
        };
        return colors[category] || '#ddd';
    }
};

// Export für Module (falls verwendet)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PeriodicTableTool, Utils };
          }

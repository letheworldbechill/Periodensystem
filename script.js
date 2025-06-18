class PeriodicTableTool {
  constructor() {
    this.isQuizMode = false;
    this.currentQuestion = null;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.streakCount = 0;
    this.elements = [];
    this.selectedElement = null;

    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.collectElements();
    this.bindEvents();
    this.showInfoMode();
  }

  collectElements() {
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
    document.getElementById('quiz-btn').addEventListener('click', () => this.toggleQuizMode());
    document.getElementById('info-btn').addEventListener('click', () => this.showInfoMode());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetTool());

    this.elements.forEach(({ element }) => {
      element.addEventListener('click', (e) => this.handleElementClick(e));
    });

    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  handleElementClick(e) {
    const element = e.currentTarget;
    this.isQuizMode ? this.handleQuizAnswer(element) : this.showElementInfo(element);
  }

  showElementInfo(element) {
    this.clearSelections();
    element.classList.add('selected');
    this.selectedElement = element;
    this.displayElementInfo(this.getElementData(element));
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
    this.isQuizMode ? this.showInfoMode() : this.startQuizMode();
  }

  startQuizMode() {
    this.isQuizMode = true;
    this.clearSelections();
    document.getElementById('quiz-btn').textContent = 'Quiz beenden';
    document.getElementById('quiz-btn').classList.replace('primary', 'secondary');
    document.getElementById('quiz-panel').classList.add('active');
    document.getElementById('info-panel').style.display = 'none';
    this.generateQuestion();
  }

  showInfoMode() {
    this.isQuizMode = false;
    this.clearSelections();
    document.getElementById('quiz-btn').textContent = 'Quiz starten';
    document.getElementById('quiz-btn').classList.replace('secondary', 'primary');
    document.getElementById('quiz-panel').classList.remove('active');
    document.getElementById('info-panel').style.display = 'block';
    this.resetElementInfo();
  }

  generateQuestion() {
    this.clearVisualEffects();
    const random = Math.floor(Math.random() * this.elements.length);
    this.currentQuestion = this.elements[random];
    document.getElementById('quiz-target').textContent = this.currentQuestion.symbol;
  }

  handleQuizAnswer(clickedElement) {
    if (clickedElement === this.currentQuestion.element) {
      this.correctCount++;
      this.streakCount++;
      clickedElement.classList.add('correct');
      this.showSuccessEffect();
    } else {
      this.wrongCount++;
      this.streakCount = 0;
      clickedElement.classList.add('incorrect');
      this.currentQuestion.element.classList.add('correct');
      this.showErrorEffect();
    }

    this.updateQuizStats();
    setTimeout(() => this.generateQuestion(), 1500);
  }

  updateQuizStats() {
    document.getElementById('correct-count').textContent = this.correctCount;
    document.getElementById('wrong-count').textContent = this.wrongCount;
    document.getElementById('streak-count').textContent = this.streakCount;
  }

  showSuccessEffect() {
    document.body.style.animation = 'successFlash 0.3s ease';
    setTimeout(() => document.body.style.animation = '', 300);
  }

  showErrorEffect() {
    const container = document.querySelector('.container');
    container.style.animation = 'errorShake 0.5s ease';
    setTimeout(() => container.style.animation = '', 500);
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
    this.correctCount = 0;
    this.wrongCount = 0;
    this.streakCount = 0;
    this.currentQuestion = null;

    this.showInfoMode();
    this.updateQuizStats();
    this.resetElementInfo();
    this.clearVisualEffects();
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
    if (e.key === 'Escape' && this.isQuizMode) this.showInfoMode();
    if (e.key === 'Enter') this.toggleQuizMode();
    if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
      e.preventDefault();
      this.resetTool();
    }
  }
}

// Zusätzliche Animationen für Erfolg und Fehler
const style = document.createElement('style');
style.textContent = `
@keyframes successFlash {
  0%, 100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  50% { background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); }
}
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}`;
document.head.appendChild(style);

// Initialisierung
document.addEventListener('DOMContentLoaded', () => new PeriodicTableTool());

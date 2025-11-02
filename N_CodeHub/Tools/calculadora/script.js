// FUNÇÃO: Adiciona caracteres no display
function appendToDisplay(value) {
    const display = document.getElementById('result');
    
    // Se o display está com resultado (pulso), limpa para nova operação
    if (display.classList.contains('result-display')) {
        display.value = '';
        display.classList.remove('result-display');
        resetFontSize(); // Volta fonte ao normal
    }
    
    // Verifica se atingiu o limite do display
    if (display.value.length >= 15) {
        reduceFontSize(); // Diminui a fonte
    }
    
    display.value += value;
}

// FUNÇÃO: Limpa todo o display
function clearDisplay() {
    const display = document.getElementById('result');
    display.value = '';
    display.classList.remove('result-display', 'error-display');
    resetFontSize(); // Volta fonte ao normal
}

// FUNÇÃO: Apaga o último caractere  
function deleteLast() {
    const display = document.getElementById('result');
    
    // Se tiver efeito de resultado, limpa completamente
    if (display.classList.contains('result-display')) {
        clearDisplay();
    } else {
        display.value = display.value.slice(0, -1);
        
        // Se voltou a ter menos caracteres, aumenta a fonte
        if (display.value.length < 15) {
            resetFontSize();
        }
    }
}

// FUNÇÃO: Diminui a fonte para caber mais números
function reduceFontSize() {
    const display = document.getElementById('result');
    display.style.fontSize = '1.5rem'; // Fonte menor
}

// FUNÇÃO: Volta a fonte ao tamanho normal
function resetFontSize() {
    const display = document.getElementById('result');
    display.style.fontSize = ''; // Remove estilo inline (volta ao CSS)
}

// FUNÇÃO: Calcula o resultado com efeito visual
function calculate() {
    const display = document.getElementById('result');
    
    try {
        // Substitui × por * para o cálculo funcionar
        const expression = display.value.replace(/×/g, '*');
        const result = eval(expression);
        
        // Mostra o resultado com efeito visual
        display.value = result;
        
        // Remove classes anteriores e adiciona efeito de resultado
        display.classList.remove('result-display', 'error-display');
        display.classList.add('result-display');
        
        // Ajusta fonte baseado no tamanho do resultado
        if (result.toString().length >= 10) {
            reduceFontSize();
        } else {
            resetFontSize();
        }
        
    } catch (error) {
        display.value = 'Erro';
        display.classList.remove('result-display', 'error-display');
        display.classList.add('error-display');
        resetFontSize(); // Volta fonte ao normal em caso de erro
    }
}

// FUNÇÃO: Processa teclas do teclado físico
function handleKeyboardInput(event) {
    const key = event.key;
    
    // Números (0-9)
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
        highlightButton(key);
    }
    // Operadores básicos
    else if (key === '+') {
        appendToDisplay('+');
        highlightButton('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
        highlightButton('-');
    }
    else if (key === '*') {
        appendToDisplay('*');
        highlightButton('*');
    }
    else if (key === '/') {
        event.preventDefault();
        appendToDisplay('/');
        highlightButton('/');
    }
    // Ponto decimal
    else if (key === '.' || key === ',') {
        appendToDisplay('.');
        highlightButton('.');
    }
    // Enter ou = para calcular
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
        highlightButton('=');
    }
    // Backspace para apagar
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
        highlightButton('Backspace');
    }
    // Escape ou 'c' para limpar
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
        highlightButton('Escape');
    }
    // Tecla Delete para limpar
    else if (key === 'Delete') {
        clearDisplay();
    }
}

// FUNÇÃO: Efeito visual nos botões do teclado
function highlightButton(key) {
    const keyToButton = {
        '0': 'button[onclick*="0"]',
        '1': 'button[onclick*="1"]',
        '2': 'button[onclick*="2"]',
        '3': 'button[onclick*="3"]',
        '4': 'button[onclick*="4"]',
        '5': 'button[onclick*="5"]',
        '6': 'button[onclick*="6"]',
        '7': 'button[onclick*="7"]',
        '8': 'button[onclick*="8"]',
        '9': 'button[onclick*="9"]',
        '+': 'button[onclick*="+"]',
        '-': 'button[onclick*="-"]',
        '*': 'button[onclick*="*"]',
        '/': 'button[onclick*="/"]',
        '.': 'button[onclick*="."]',
        'Enter': 'button[onclick*="calculate()"]',
        '=': 'button[onclick*="calculate()"]',
        'Escape': 'button[onclick*="clearDisplay()"]',
        'c': 'button[onclick*="clearDisplay()"]',
        'C': 'button[onclick*="clearDisplay()"]',
        'Backspace': 'button[onclick*="deleteLast()"]'
    };
    
    const buttonSelector = keyToButton[key];
    if (buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            button.classList.add('key-pressed');
            setTimeout(() => button.classList.remove('key-pressed'), 150);
        }
    }
}

// FUNÇÃO: Configura os ouvintes de teclado
function setupKeyboardListeners() {
    document.addEventListener('keydown', handleKeyboardInput);
    
    const display = document.getElementById('result');
    display.focus();
    
    display.addEventListener('blur', function() {
        setTimeout(() => display.focus(), 10);
    });
}

// Executa quando a página termina de carregar
document.addEventListener('DOMContentLoaded', setupKeyboardListeners);
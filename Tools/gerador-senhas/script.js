// ===== ELEMENTOS DO DOM =====
const passwordResult = document.getElementById('password-result');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');
const strengthBtn = document.getElementById('strength-btn');
const passwordLength = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const strengthText = document.getElementById('strength-text');
const strengthFill = document.getElementById('strength-fill');

// ===== CONFIGURAÇÕES DE CARACTERES =====
const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// ===== FUNÇÃO: ATUALIZA VALOR DO SLIDER =====
passwordLength.addEventListener('input', function() {
    lengthValue.textContent = this.value;
    generatePassword(); // Gera nova senha automaticamente
});

// ===== FUNÇÃO: GERA SENHA ALEATÓRIA =====
function generatePassword() {
    let availableChars = '';
    let password = '';
    
    // Concatena caracteres disponíveis baseado nas opções selecionadas
    if (uppercaseCheck.checked) availableChars += characters.uppercase;
    if (lowercaseCheck.checked) availableChars += characters.lowercase;
    if (numbersCheck.checked) availableChars += characters.numbers;
    if (symbolsCheck.checked) availableChars += characters.symbols;
    
    // Verifica se pelo menos uma opção está selecionada
    if (availableChars.length === 0) {
        passwordResult.value = 'Selecione pelo menos uma opção';
        updateStrengthMeter('weak');
        return;
    }
    
    // Gera senha aleatória
    const length = parseInt(passwordLength.value);
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }
    
    passwordResult.value = password;
    updateStrengthMeter(checkPasswordStrength(password));
}

// ===== FUNÇÃO: VERIFICA FORÇA DA SENHA =====
function checkPasswordStrength(password) {
    let score = 0;
    
    // Critérios de pontuação
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1; // Tem maiúsculas
    if (/[a-z]/.test(password)) score += 1; // Tem minúsculas  
    if (/[0-9]/.test(password)) score += 1; // Tem números
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Tem símbolos
    
    // Classifica baseado na pontuação
    if (score >= 5) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
}

// ===== FUNÇÃO: ATUALIZA INDICADOR DE FORÇA =====
function updateStrengthMeter(strength) {
    // Remove classes anteriores
    strengthFill.classList.remove('weak', 'medium', 'strong');
    
    // Adiciona classe nova e atualiza texto
    strengthFill.classList.add(strength);
    
    // Atualiza texto descritivo
    const strengthLabels = {
        weak: 'Fraca',
        medium: 'Média', 
        strong: 'Forte'
    };
    strengthText.textContent = strengthLabels[strength];
}

// ===== FUNÇÃO: COPIA SENHA PARA ÁREA DE TRANSFERÊNCIA =====
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(passwordResult.value);
        
        // Feedback visual
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';
        copyBtn.style.background = 'linear-gradient(45deg, #27ae60, #229954)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        }, 2000);
        
    } catch (err) {
        // Fallback para navegadores mais antigos
        passwordResult.select();
        document.execCommand('copy');
        
        // Feedback visual alternativo
        copyBtn.textContent = '📋✓';
        setTimeout(() => copyBtn.textContent = '📋', 2000);
    }
}

// ===== FUNÇÃO: MOSTRA ANÁLISE DETALHADA DA FORÇA =====
function showStrengthAnalysis() {
    const password = passwordResult.value;
    if (!password || password === 'Selecione pelo menos uma opção') {
        alert('Gere uma senha primeiro!');
        return;
    }
    
    const strength = checkPasswordStrength(password);
    let analysis = `Análise da senha: "${password}"\n\n`;
    
    analysis += `• Comprimento: ${password.length} caracteres\n`;
    analysis += `• Letras maiúsculas: ${/[A-Z]/.test(password) ? '✅' : '❌'}\n`;
    analysis += `• Letras minúsculas: ${/[a-z]/.test(password) ? '✅' : '❌'}\n`;
    analysis += `• Números: ${/[0-9]/.test(password) ? '✅' : '❌'}\n`;
    analysis += `• Símbolos: ${/[^A-Za-z0-9]/.test(password) ? '✅' : '❌'}\n\n`;
    analysis += `Força: ${strength === 'strong' ? '🔒 Forte' : strength === 'medium' ? '🔐 Média' : '🔓 Fraca'}`;
    
    alert(analysis);
}

// ===== EVENT LISTENERS =====
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);
strengthBtn.addEventListener('click', showStrengthAnalysis);

// Gera senha quando opções mudam
[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword);
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Gera primeira senha automaticamente
    generatePassword();
    
    // Foca no resultado para fácil seleção
    passwordResult.focus();
});
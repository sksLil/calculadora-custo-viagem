// Arquivo: script.js

// --- 1. Seleção de Elementos ---
const form = document.getElementById('cost-form');
const distanceInput = document.getElementById('distance');
const consumptionInput = document.getElementById('consumption');
const priceInput = document.getElementById('price');
const roundtripCheckbox = document.getElementById('roundtrip');
const tankCapacityInput = document.getElementById('tank-capacity'); // NOVO INPUT

const resultArea = document.getElementById('result-area');
const totalCostSpan = document.getElementById('total-cost-value');
const tanksNeededSpan = document.getElementById('tanks-needed-value'); // NOVO SPAN DE RESULTADO
const tripTypeSpan = document.getElementById('trip-type');
const errorElement = document.getElementById('error-message');

// --- 2. Funções de Feedback e Formatação ---

/**
 * Formata um número como moeda BRL (R$ X.XXX,XX).
 */
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Exibe a área de resultado com os valores calculados.
 * @param {number} cost - O custo total em R$.
 * @param {number} tanks - O número de tanques necessários.
 * @param {boolean} isRoundTrip - Indica se foi calculada a ida e volta.
 */
function displayResult(cost, tanks, isRoundTrip) {
    totalCostSpan.textContent = formatCurrency(cost);
    
    // Formata o número de tanques com 1 casa decimal e vírgula
    tanksNeededSpan.textContent = tanks.toFixed(1).replace('.', ','); 
    
    tripTypeSpan.textContent = isRoundTrip ? 'ida e volta' : 'ida';
    
    resultArea.classList.remove('hidden');
    errorElement.classList.add('hidden');
}

/**
 * Exibe a mensagem de erro e oculta o resultado.
 */
function displayError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    resultArea.classList.add('hidden');
}

// --- 3. Lógica Principal de Cálculo ---

/**
 * Realiza o cálculo do custo e tanques necessários.
 */
function calculateCost(event) {
    event.preventDefault(); 
    
    // Oculta feedback anterior
    resultArea.classList.add('hidden');
    errorElement.classList.add('hidden');

    // 1. Coleta e Converte os Valores
    let distance = parseFloat(distanceInput.value);
    const consumption = parseFloat(consumptionInput.value);
    const price = parseFloat(priceInput.value);
    const tankCapacity = parseFloat(tankCapacityInput.value); // NOVO VALOR
    const isRoundTrip = roundtripCheckbox.checked;

    // 2. Validação dos Dados (Incluindo o novo campo)
    if (isNaN(distance) || isNaN(consumption) || isNaN(price) || isNaN(tankCapacity) ||
        distance <= 0 || consumption <= 0 || price <= 0 || tankCapacity <= 0) {
        displayError("Por favor, preencha todos os campos com valores numéricos válidos e positivos.");
        return;
    }
    
    // 3. Ajusta a distância para ida e volta
    if (isRoundTrip) {
        distance *= 2;
    }

    // 4. Fórmulas de Cálculo
    
    // Passo A: Litros necessários = Distância (Km) / Consumo (Km/L)
    const litersNeeded = distance / consumption;
    
    // Passo B: Custo Total = Litros * Preço por Litro
    const totalCost = litersNeeded * price;
    
    // Passo C: Tanques Necessários = Litros Necessários / Capacidade do Tanque
    const totalTanks = litersNeeded / tankCapacity;

    // 5. Exibe o Resultado
    displayResult(totalCost, totalTanks, isRoundTrip);
}

// --- 4. Event Listeners (Início da Aplicação) ---

// Listener principal para o formulário
form.addEventListener('submit', calculateCost);

// Listener para o checkbox de Volta
roundtripCheckbox.addEventListener('change', (e) => {
    // Se o resultado estiver visível, recalcula para atualizar o custo e os tanques
    if (!resultArea.classList.contains('hidden')) {
        calculateCost(new Event('submit')); 
    } else {
        // Apenas atualiza o texto se não estiver calculado
        tripTypeSpan.textContent = e.target.checked ? 'ida e volta' : 'ida';
    }
});

// Efeito de foco visual nos inputs (Incluindo o novo campo)
[distanceInput, consumptionInput, priceInput, tankCapacityInput].forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('shadow-lg', 'border-indigo-500');
    });
    input.addEventListener('blur', () => {
        input.classList.remove('shadow-lg', 'border-indigo-500');
    });
});
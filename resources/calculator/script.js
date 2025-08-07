class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.getElementById('currentOperand');
        this.previousOperandElement = document.getElementById('previousOperand');
        
        this.setupEventListeners();
        this.setupKeyboardListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('number')) {
                    this.appendNumber(button.dataset.number);
                } else if (button.classList.contains('operator')) {
                    this.chooseOperation(button.dataset.action);
                } else if (button.classList.contains('function')) {
                    this.handleFunction(button.dataset.action);
                } else if (button.classList.contains('equals')) {
                    this.compute();
                }
            });
        });
    }
    
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Prevenir comportamiento por defecto para ciertas teclas
            if (['+', '-', '*', '/', '=', 'Enter', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }
            
            // Números y punto decimal
            if (e.key >= '0' && e.key <= '9') {
                this.appendNumber(e.key);
            } else if (e.key === '.') {
                this.appendNumber('.');
            }
            
            // Operadores
            else if (e.key === '+') {
                this.chooseOperation('add');
            } else if (e.key === '-') {
                this.chooseOperation('subtract');
            } else if (e.key === '*') {
                this.chooseOperation('multiply');
            } else if (e.key === '/') {
                this.chooseOperation('divide');
            }
            
            // Funciones especiales
            else if (e.key === 'Enter' || e.key === '=') {
                this.compute();
            } else if (e.key === 'Escape' || e.key === 'Delete') {
                this.handleFunction('clear');
            } else if (e.key === 'Backspace') {
                this.backspace();
            } else if (e.key === '%') {
                this.handleFunction('percent');
            }
        });
    }
    
    appendNumber(number) {
        // Validar longitud máxima para evitar overflow
        if (this.currentOperand.length >= 12 && !this.shouldResetScreen) {
            return;
        }
        
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        // Validar punto decimal único
        if (number === '.' && this.currentOperand.includes('.')) {
            return;
        }
        
        // Manejar el caso de 0 inicial
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        // Si no hay número actual, no hacer nada
        if (this.currentOperand === '') return;
        
        // Si ya hay una operación pendiente, calcular primero
        if (this.previousOperand !== '' && !this.shouldResetScreen) {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }
    
    handleFunction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'toggle':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
        }
        this.updateDisplay();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    toggleSign() {
        if (this.currentOperand === '' || this.currentOperand === '0') {
            return;
        }
        
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }
    
    percent() {
        if (this.currentOperand === '' || this.currentOperand === '0') {
            return;
        }
        
        // Lógica mejorada para porcentaje
        if (this.previousOperand !== '' && this.operation) {
            // Si hay una operación pendiente, aplicar porcentaje contextualmente
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            
            if (this.operation === 'add' || this.operation === 'subtract') {
                // Para suma/resta: X + Y% = X + (X * Y/100)
                this.currentOperand = ((prev * current) / 100).toString();
            } else {
                // Para multiplicación/división: X * Y% = X * (Y/100)
                this.currentOperand = (current / 100).toString();
            }
        } else {
            // Sin operación pendiente, simplemente dividir por 100
            this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        }
        
        this.shouldResetScreen = true;
    }
    
    backspace() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
            return;
        }
        
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        } else {
            this.currentOperand = '0';
        }
        
        this.updateDisplay();
    }
    
    compute() {
        if (this.operation === undefined || this.previousOperand === '') {
            return;
        }
        
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError('Error: Division by zero');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Formatear resultado para evitar problemas de precisión
        this.currentOperand = this.formatNumber(computation).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    formatNumber(number) {
        // Manejar números muy grandes o muy pequeños
        if (Math.abs(number) > 1e12 || (Math.abs(number) < 1e-6 && number !== 0)) {
            return parseFloat(number.toExponential(6));
        }
        
        // Evitar problemas de precisión de punto flotante
        const rounded = Math.round((number + Number.EPSILON) * 1000000000) / 1000000000;
        
        // Limitar decimales si el número es muy largo
        if (rounded.toString().length > 12) {
            return parseFloat(rounded.toPrecision(8));
        }
        
        return rounded;
    }
    
    showError(message) {
        this.currentOperand = message;
        this.shouldResetScreen = true;
        this.updateDisplay();
        
        // Limpiar error después de 2 segundos
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
        }, 2000);
    }
    
    updateDisplay() {
        // Formatear número para mostrar
        let displayValue = this.currentOperand;
        
        // Si es un número válido, formatear para mejor visualización
        if (!isNaN(displayValue) && displayValue !== '' && !displayValue.includes('Error')) {
            const number = parseFloat(displayValue);
            if (Math.abs(number) >= 1000000) {
                displayValue = number.toExponential(3);
            } else if (displayValue.length > 12) {
                displayValue = parseFloat(displayValue).toPrecision(8);
            }
        }
        
        this.currentOperandElement.textContent = displayValue;
        
        if (this.operation != null && this.previousOperand !== '') {
            const operationSymbols = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷'
            };
            
            let prevDisplay = this.previousOperand;
            // Formatear número anterior si es muy largo
            if (!isNaN(prevDisplay) && prevDisplay.length > 8) {
                const num = parseFloat(prevDisplay);
                prevDisplay = num >= 1000000 ? num.toExponential(3) : num.toPrecision(6);
            }
            
            this.previousOperandElement.textContent = 
                `${prevDisplay} ${operationSymbols[this.operation]}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

class WeatherManager {
    constructor() {
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherText = document.getElementById('weatherText');
        
        // ✅ CORREGIDO: Coordenadas correctas para New York
        this.apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=weather_code,temperature_2m,rain,showers,snowfall,cloud_cover,is_day,apparent_temperature&timezone=America%2FNew_York';
        
        this.weatherCodes = {
            0: { icon: '☀️', text: 'Clear sky', class: 'clear-day' },
            1: { icon: '🌤️', text: 'Mainly clear', class: 'clear-day' },
            2: { icon: '⛅', text: 'Partly cloudy', class: 'cloudy' },
            3: { icon: '☁️', text: 'Cloudy', class: 'cloudy' },
            45: { icon: '🌫️', text: 'Mist', class: 'cloudy' },
            48: { icon: '🌫️', text: 'Fog', class: 'cloudy' },
            51: { icon: '🌧️', text: 'Light drizzle', class: 'rainy' },
            53: { icon: '🌧️', text: 'Moderate drizzle', class: 'rainy' },
            55: { icon: '🌧️', text: 'Heavy drizzle', class: 'rainy' },
            56: { icon: '🌨️', text: 'Freezing drizzle', class: 'rainy' },
            57: { icon: '🌨️', text: 'Llovizna helada intensa', class: 'rainy' },
            61: { icon: '🌧️', text: 'Lluvia ligera', class: 'rainy' },
            63: { icon: '🌧️', text: 'Moderate rain', class: 'rainy' },
            65: { icon: '🌧️', text: 'Heavy rain', class: 'rainy' },
            66: { icon: '🌨️', text: 'Freezing rain', class: 'rainy' },
            67: { icon: '🌨️', text: 'Heavy freezing rain', class: 'rainy' },
            71: { icon: '🌨️', text: 'Light snowfall', class: 'snowy' },
            73: { icon: '🌨️', text: 'Moderate snowfall', class: 'snowy' },
            75: { icon: '🌨️', text: 'Heavy snowfall', class: 'snowy' },
            77: { icon: '🌨️', text: 'Hail', class: 'snowy' },
            80: { icon: '🌧️', text: 'Light showers', class: 'rainy' },
            81: { icon: '🌧️', text: 'Moderate showers', class: 'rainy' },
            82: { icon: '🌧️', text: 'Heavy showers', class: 'rainy' },
            85: { icon: '🌨️', text: 'Light snow showers', class: 'snowy' },
            86: { icon: '🌨️', text: 'Heavy snow showers', class: 'snowy' },
            95: { icon: '⛈️', text: 'Thunderstorm', class: 'rainy' },
            96: { icon: '⛈️', text: 'Thunderstorm with hail', class: 'rainy' },
            99: { icon: '⛈️', text: 'Heavy thunderstorm', class: 'rainy' }
        };
        
        this.fetchWeather();
        // Actualizar clima cada 10 minutos
        setInterval(() => this.fetchWeather(), 10 * 60 * 1000);
    }
    
    async fetchWeather() {
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                const response = await fetch(this.apiUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.current) {
                    this.updateWeather(data.current);
                    return; // Éxito, salir del bucle
                } else {
                    throw new Error('Climate data not available');
                }
            } catch (error) {
                attempts++;
                console.warn(`Attempt ${attempts} failed to get weather`, error);
                
                if (attempts === maxAttempts) {
                    this.setDefaultWeather();
                } else {
                    // Esperar antes del siguiente intento (backoff exponencial)
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)));
                }
            }
        }
    }
    
    updateWeather(current) {
        const weatherCode = current.weather_code;
        const isDay = current.is_day === 1;
        const temperature = Math.round(current.temperature_2m);
        
        let weatherInfo = this.weatherCodes[weatherCode] || 
                         { icon: '❓', text: 'Clima desconocido', class: 'clear-day' };
        
        // Crear copia para no modificar el original
        weatherInfo = { ...weatherInfo };
        
        // Ajustar para noche
        if (!isDay) {
            weatherInfo.class = 'night';
            // Cambiar iconos diurnos por nocturnos
            if (weatherInfo.icon === '☀️') {
                weatherInfo.icon = '🌙';
                weatherInfo.text = 'Noche despejada';
            } else if (weatherInfo.icon === '🌤️') {
                weatherInfo.icon = '🌙';
                weatherInfo.text = 'Noche parcialmente nublada';
            }
        }
        
        // Actualizar UI
        this.weatherIcon.textContent = weatherInfo.icon;
        this.weatherText.textContent = `${weatherInfo.text} - ${temperature}°C`;
        
        // Actualizar fondo con transición suave
        this.updateBackground(weatherInfo.class);
    }
    
    setDefaultWeather() {
        this.weatherIcon.textContent = '🌤️';
        this.weatherText.textContent = 'Clima no disponible';
        this.updateBackground('clear-day');
    }
    
    updateBackground(weatherClass) {
        const body = document.body;
        
        // Remover clases de clima anteriores
        const weatherClasses = ['clear-day', 'cloudy', 'rainy', 'snowy', 'night'];
        weatherClasses.forEach(cls => body.classList.remove(cls));
        
        // Agregar nueva clase
        body.classList.add(weatherClass);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    const weatherManager = new WeatherManager();
    
    // Agregar feedback visual para botones
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});
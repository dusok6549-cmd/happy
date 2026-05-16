class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['number'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const number = this.getAttribute('number');
        if (!number) return;

        const color = this.getColor(number);
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                }
                .ball {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: white;
                    background: radial-gradient(circle at 15px 15px, ${color}, #000);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5), inset 0 -3px 8px rgba(0,0,0,0.8);
                    text-shadow: 0 0 5px rgba(255,255,255,0.5);
                    animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                }
                @keyframes pop-in {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }

    getColor(number) {
        const num = parseInt(number);
        if (num <= 10) return '#fbc02d'; // Yellow
        if (num <= 20) return '#1976d2'; // Blue
        if (num <= 30) return '#d32f2f'; // Red
        if (num <= 40) return '#757575'; // Grey
        return '#388e3c'; // Green
    }
}

customElements.define('lotto-ball', LottoBall);

// Lotto Generation Helper
function generateSet(baseNumbers = []) {
    const numbers = new Set(baseNumbers);
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// Random Generation
document.getElementById('generator-btn').addEventListener('click', () => {
    const container = document.getElementById('lotto-numbers-container');
    const recommendContainer = document.getElementById('recommend-container');
    container.innerHTML = '';
    recommendContainer.classList.add('hidden');
    
    const numbers = generateSet();
    numbers.forEach((num, i) => {
        setTimeout(() => {
            const ball = document.createElement('lotto-ball');
            ball.setAttribute('number', num);
            container.appendChild(ball);
        }, i * 150);
    });
});

// Recommend Generation (Based on 1223th winner: 16, 18, 20, 32, 33, 39)
const lastWinner = [16, 18, 20, 32, 33, 39];

document.getElementById('recommend-btn').addEventListener('click', () => {
    const container = document.getElementById('lotto-numbers-container');
    const recommendContainer = document.getElementById('recommend-container');
    const recommendList = document.getElementById('recommend-list');
    
    container.innerHTML = '';
    recommendList.innerHTML = '';
    recommendContainer.classList.remove('hidden');

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'recommend-row';
        
        const count = Math.floor(Math.random() * 2) + 2;
        const shuffled = [...lastWinner].sort(() => 0.5 - Math.random());
        const base = shuffled.slice(0, count);
        
        const set = generateSet(base);
        set.forEach((num, j) => {
            setTimeout(() => {
                const ball = document.createElement('lotto-ball');
                ball.setAttribute('number', num);
                row.appendChild(ball);
            }, (i * 100) + (j * 50));
        });
        recommendList.appendChild(row);
    }
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = 'Dark Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? 'Dark Mode' : 'Light Mode';
});

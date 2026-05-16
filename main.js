class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const number = this.getAttribute('number');
        const color = this.getColor(number);

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.8rem;
            font-weight: bold;
            color: white;
            background: radial-gradient(circle at 20px 20px, ${color}, #000);
            box-shadow: 0 5px 15px rgba(0,0,0,0.5), inset 0 -5px 15px rgba(0,0,0,0.8), inset 0 5px 15px rgba(255,255,255,0.1);
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
        `;
        wrapper.textContent = number;

        shadow.appendChild(wrapper);
    }

    getColor(number) {
        const colors = [
            '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab',
            '#1e88e5', '#039be5', '#00acc1', '#00897b', '#43a047',
            '#7cb342', '#c0ca33', '#fdd835', '#ffb300', '#fb8c00',
            '#f4511e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

customElements.define('lotto-ball', LottoBall);

document.getElementById('generator-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();

    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    Array.from(numbers).forEach((number, index) => {
        setTimeout(() => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            lottoNumbersContainer.appendChild(lottoBall);
        }, index * 200); // Stagger the animation
    });
});

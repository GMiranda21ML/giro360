class RouteMap {
    constructor() {
        this.destination = 'Centauro'; // Destino padrão
        this.initializeElements();
        this.initializeEventListeners();
        this.drawMap();
    }

    initializeElements() {
        this.mapContent = document.getElementById('mapContent');
        this.returnBtn = document.getElementById('returnBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.destinationElement = document.querySelector('.destination');
        
        // Verificar se há um destino na URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('destination')) {
            this.destination = urlParams.get('destination');
            this.destinationElement.textContent = this.destination;
        }
    }

    initializeEventListeners() {
        // Botão de ajuda
        if (this.helpBtn) {
            this.helpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHelp();
            });
        }
        
        // Botão de retorno
        if (this.returnBtn) {
            this.returnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoading();
                setTimeout(() => {
                    window.location.href = 'voice_assistant.html';
                }, 300);
            });
        }

        // Feedback tátil para botões
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.vibrate([50]);
            }
        });
    }

    drawMap() {
        // Mostrar indicador de carregamento
        this.showLoading();
        
        // Simular tempo de carregamento
        setTimeout(() => {
            // Criar o mapa simples com SVG
            const mapSvg = `
                <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                    <!-- Fundo do mapa -->
                    <rect x="0" y="0" width="300" height="300" fill="#EEEEEE" />
                    
                    <!-- Áreas do shopping (simplificadas) -->
                    <rect x="50" y="50" width="50" height="50" fill="#CCCCCC" />
                    <rect x="150" y="100" width="70" height="70" fill="#CCCCCC" />
                    
                    <!-- Rota -->
                    <path d="M 50 200 L 150 200 L 150 100 L 250 100" stroke="#000000" stroke-width="4" fill="none" />
                    
                    <!-- Ponto de destino (Centauro) -->
                    <g transform="translate(250, 100)">
                        <rect x="-15" y="-15" width="30" height="30" fill="#E91E63" />
                        <image href="img/centauro.png" x="-10" y="-10" height="20" width="20" />
                    </g>
                    
                    <!-- Ponto de partida (Você está aqui) -->
                    <circle cx="50" cy="200" r="8" fill="#2196F3" />
                    <text x="50" y="220" text-anchor="middle" fill="#000000" font-size="12">Você</text>
                </svg>
            `;
            
            this.mapContent.innerHTML = mapSvg;
            
            // Esconder indicador de carregamento
            this.hideLoading();
        }, 1000);
    }

    showHelp() {
        alert('Guia de Navegação\n\nEsta tela mostra a rota até o seu destino.\n\nA linha preta indica o caminho que você deve seguir.\n\nO ponto azul mostra sua localização atual.\n\nO ponto vermelho indica o destino selecionado.\n\nPara voltar ao assistente de voz, clique em "Retornar".');
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('show');
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('show');
        }
    }

    vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
}

// Inicializar o mapa quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const routeMap = new RouteMap();
});
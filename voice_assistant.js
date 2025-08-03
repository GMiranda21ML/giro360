class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.initializeSpeechRecognition();
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.micButton = document.getElementById('micButton');
        this.voiceTitle = document.getElementById('voiceTitle');
        this.voiceInstruction = document.getElementById('voiceInstruction');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.helpButton = document.getElementById('helpButton');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }

    initializeEventListeners() {
        if (this.micButton) {
            this.micButton.addEventListener('click', () => {
                this.toggleListening(!this.isListening);
            });
        }

        if (this.helpButton) {
            this.helpButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHelp();
            });
        }

        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.vibrate([50]);
            }
        });
    }

    initializeSpeechRecognition() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'pt-BR';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Erro no reconhecimento de voz:', event.error);
                this.toggleListening(false);
            };

            this.recognition.onend = () => {
                if (this.isListening) {
                    this.toggleListening(false);
                }
            };
        } else {
            alert('Seu navegador não suporta reconhecimento de voz. Por favor, use um navegador mais recente.');
        }
    }

    toggleListening(start) {
        this.isListening = start;
        
        if (start) {
            this.recognition.start();
            this.micButton.classList.add('listening');
            this.voiceInstruction.textContent = 'Ouvindo... Fale o nome da loja ou local';
            this.vibrate([100, 50, 100]);
        } else {
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (e) {
                }
            }
            this.micButton.classList.remove('listening');
            this.voiceInstruction.textContent = 'Toque no microfone e fale o nome da loja ou local';
        }
    }

    processVoiceCommand(command) {
        command = command.toLowerCase().trim();
        
        // Exemplo de processamento de comandos
        if (command.includes('ajuda') || command.includes('help')) {
            this.showHelp();
        } else if (command.includes('voltar') || command.includes('retornar')) {
            window.location.href = 'index.html';
        } else if (command.includes('outras') || command.includes('funcionalidades')) {
            alert('Funcionalidade em desenvolvimento');
        } else {
            // Navegar para a página de rota com o destino mencionado
            this.navigateToRoute(command);
        }
    }

    showHelp() {
        alert('Assistente de Voz Guia360\n\nComandos disponíveis:\n- "Ajuda": Mostra esta mensagem\n- "Voltar" ou "Retornar": Volta para a página inicial\n- "Outras funcionalidades": Mostra outras opções\n\nVocê também pode perguntar sobre locais no shopping ou solicitar direções.');
    }
    
    navigateToRoute(command) {
        // Extrair possível destino do comando
        let destination = 'Centauro'; // Destino padrão
        
        // Lista de lojas conhecidas
        const knownStores = [
            'Centauro', 'Renner', 'Riachuelo', 'C&A', 'Americanas', 
            'Saraiva', 'Casas Bahia', 'Polishop', 'Boticário', 'Vivara',
            'McDonalds', 'Burger King', 'Cinema', 'Praça de alimentação'
        ];
        
        // Verificar se alguma loja conhecida foi mencionada
        for (const store of knownStores) {
            if (command.includes(store.toLowerCase())) {
                destination = store;
                break;
            }
        }
        
        // Verificar palavras-chave comuns para navegação
        const navigationKeywords = ['ir para', 'como chegar', 'me leve', 'onde fica', 'localizar'];
        let isNavigationRequest = false;
        
        for (const keyword of navigationKeywords) {
            if (command.includes(keyword)) {
                isNavigationRequest = true;
                break;
            }
        }
        
        // Se não for um pedido de navegação explícito, confirmar com o usuário
        if (!isNavigationRequest) {
            const confirmNavigation = confirm(`Deseja traçar uma rota para ${destination}?`);
            if (!confirmNavigation) {
                return;
            }
        }
        
        // Mostrar indicador de carregamento
        this.showLoading();
        
        // Navegar para a página de rota com o destino
        setTimeout(() => {
            window.location.href = `route.html?destination=${encodeURIComponent(destination)}`;
        }, 500);
    }

    showLoading() {
        this.loadingIndicator.classList.add('show');
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('show');
    }

    vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
}

// Inicializar o assistente de voz quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const voiceAssistant = new VoiceAssistant();
});
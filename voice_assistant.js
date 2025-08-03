class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeSpeechRecognition();
    }

    initializeElements() {
        this.micButton = document.getElementById('micButton');
        this.otherFeaturesBtn = document.getElementById('otherFeaturesBtn');
        this.returnBtn = document.getElementById('returnBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }

    initializeEventListeners() {
        // Botão de microfone
        this.micButton.addEventListener('click', () => {
            this.toggleSpeechRecognition();
        });

        // Outros botões
        this.otherFeaturesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoading();
            // Aqui você pode adicionar a navegação para a página de outras funcionalidades
            setTimeout(() => {
                this.hideLoading();
                alert('Funcionalidade em desenvolvimento');
            }, 500);
        });

        this.helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });

        // Feedback tátil para botões
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

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateMicButtonState();
                console.log('Reconhecimento de voz iniciado');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateMicButtonState();
                console.log('Reconhecimento de voz finalizado');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Você disse: ' + transcript);
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Erro no reconhecimento de voz: ' + event.error);
                this.isListening = false;
                this.updateMicButtonState();
            };
        } else {
            console.error('Reconhecimento de voz não suportado neste navegador');
            this.micButton.disabled = true;
            this.micButton.title = 'Reconhecimento de voz não suportado';
        }
    }

    toggleSpeechRecognition() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
        // Feedback tátil
        this.vibrate([100]);
    }

    startListening() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Erro ao iniciar reconhecimento: ' + error);
            }
        }
    }

    stopListening() {
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Erro ao parar reconhecimento: ' + error);
            }
        }
    }

    updateMicButtonState() {
        if (this.isListening) {
            this.micButton.classList.add('listening');
            this.micButton.style.backgroundColor = '#ef4444';
        } else {
            this.micButton.classList.remove('listening');
            this.micButton.style.backgroundColor = '#EEEEEE';
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
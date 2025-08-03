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
            // Aqui você pode implementar a lógica para processar outros comandos
            alert(`Comando recebido: ${command}\nEm desenvolvimento.`);
        }
    }

    showHelp() {
        alert('Assistente de Voz Guia360\n\nComandos disponíveis:\n- "Ajuda": Mostra esta mensagem\n- "Voltar" ou "Retornar": Volta para a página inicial\n- "Outras funcionalidades": Mostra outras opções\n\nVocê também pode perguntar sobre locais no shopping ou solicitar direções.');
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
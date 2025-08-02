
class Guia360 {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.currentLocation = null;
        this.routeSteps = [];
        this.isNavigating = false;
        
        this.initializeElements();
        this.initializeVoiceRecognition();
        this.initializeEventListeners();
        this.simulateLocationDetection();
        
        // Verificar se tudo foi inicializado corretamente
        console.log('Guia360 inicializado:', {
            helpModal: this.helpModal,
            closeHelpModal: this.closeHelpModal,
            helpBtn: this.helpBtn
        });
    }

    initializeElements() {
        
        this.voiceBtn = document.getElementById('voiceBtn');
        this.voiceIndicator = document.getElementById('voiceIndicator');
        this.voiceText = document.getElementById('voiceText');
        this.voiceFeedback = document.getElementById('voiceFeedback');
        this.feedbackText = document.getElementById('feedbackText');

        
        this.helpBtn = document.querySelector('.help-btn');
        this.helpModal = document.getElementById('helpModal');
        this.closeHelpModal = document.getElementById('closeHelpModal');
        this.helpStatus = document.getElementById('helpStatus');
        this.helpOptions = document.querySelectorAll('.help-option');
        
        // Debug: verificar se os elementos foram encontrados
        console.log('Elementos encontrados:', {
            helpBtn: this.helpBtn,
            helpModal: this.helpModal,
            closeHelpModal: this.closeHelpModal
        });

        
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.querySelector('.search-btn');
        this.actionBtns = document.querySelectorAll('.action-btn');
        this.routeSection = document.getElementById('routeSection');
        this.routeSteps = document.getElementById('routeSteps');
        this.startRouteBtn = document.getElementById('startRoute');
        this.cancelRouteBtn = document.getElementById('cancelRoute');

        
        this.currentLocationText = document.getElementById('currentLocation');
        this.locationDescription = document.getElementById('locationDescription');

        
        this.avoidCrowds = document.getElementById('avoidCrowds');
        this.accessibleRoute = document.getElementById('accessibleRoute');
    }

    initializeVoiceRecognition() {
        
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'pt-BR';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI();
                this.showVoiceFeedback('Ouvindo... Fale agora');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showVoiceFeedback('Erro no reconhecimento de voz');
                this.stopListening();
            };

            this.recognition.onend = () => {
                this.stopListening();
            };
        } else {
            this.voiceBtn.style.display = 'none';
            this.voiceText.textContent = 'Reconhecimento de voz não disponível';
        }
    }

    initializeEventListeners() {
        
        this.voiceBtn.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        
        this.helpBtn.addEventListener('click', () => {
            console.log('Botão ajuda clicado');
            this.openHelpModal();
        });
        
        if (this.closeHelpModal) {
            this.closeHelpModal.addEventListener('click', () => {
                console.log('Botão fechar clicado');
                this.closeHelpModal();
            });
            
            // Adicionar evento alternativo para garantir funcionamento
            this.closeHelpModal.addEventListener('mousedown', (e) => {
                e.preventDefault();
                console.log('Botão fechar pressionado');
                this.closeHelpModal();
            });
        } else {
            console.error('Elemento closeHelpModal não encontrado!');
        }
        
        if (this.helpModal) {
            this.helpModal.addEventListener('click', (e) => {
                if (e.target === this.helpModal) {
                    console.log('Modal clicado fora do conteúdo');
                    this.closeHelpModal();
                }
            });
        }

        
        this.helpOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const helpType = e.currentTarget.dataset.help;
                this.requestHelp(helpType);
            });
        });

        
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        
        this.actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        
        this.startRouteBtn.addEventListener('click', () => this.startNavigation());
        this.cancelRouteBtn.addEventListener('click', () => this.cancelNavigation());

        
        this.avoidCrowds.addEventListener('change', () => this.updateRoutePreferences());
        this.accessibleRoute.addEventListener('change', () => this.updateRoutePreferences());

        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeHelpModal();
                this.stopListening();
            }
        });
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isListening = false;
        this.updateVoiceUI();
    }

    updateVoiceUI() {
        if (this.isListening) {
            this.voiceIndicator.classList.add('listening');
            this.voiceText.textContent = 'Ouvindo...';
            this.voiceBtn.style.background = '#ef4444';
        } else {
            this.voiceIndicator.classList.remove('listening');
            this.voiceText.textContent = 'Toque para falar';
            this.voiceBtn.style.background = '';
        }
    }

    processVoiceCommand(transcript) {
        console.log('Comando de voz:', transcript);
        
        
        if (transcript.includes('banheiro') || transcript.includes('toalete')) {
            this.handleQuickAction('bathroom');
            this.showVoiceFeedback('Procurando banheiro mais próximo...');
        } else if (transcript.includes('estacionamento') || transcript.includes('carro')) {
            this.handleQuickAction('parking');
            this.showVoiceFeedback('Procurando estacionamento...');
        } else if (transcript.includes('saída') || transcript.includes('sair')) {
            this.handleQuickAction('exit');
            this.showVoiceFeedback('Calculando rota para saída...');
        } else if (transcript.includes('comida') || transcript.includes('restaurante') || transcript.includes('lanche')) {
            this.handleQuickAction('food');
            this.showVoiceFeedback('Procurando opções de alimentação...');
        } else if (transcript.includes('ajuda') || transcript.includes('socorro')) {
            this.openHelpModal();
            this.showVoiceFeedback('Abrindo menu de ajuda...');
        } else if (transcript.includes('onde estou') || transcript.includes('localização')) {
            this.showVoiceFeedback('Sua localização atual: ' + this.currentLocation);
        } else {
            
            this.searchInput.value = transcript;
            this.performSearch();
            this.showVoiceFeedback('Procurando por: ' + transcript);
        }
    }

    showVoiceFeedback(message) {
        this.feedbackText.textContent = message;
        this.voiceFeedback.classList.add('active');
        
        setTimeout(() => {
            this.voiceFeedback.classList.remove('active');
        }, 3000);
    }

    openHelpModal() {
        this.helpModal.classList.add('active');
        this.helpStatus.textContent = 'Escolha o tipo de ajuda necessária';
    }

    closeHelpModal() {
        console.log('Fechando modal de ajuda');
        if (this.helpModal) {
            this.helpModal.classList.remove('active');
        }
    }

    requestHelp(helpType) {
        const helpMessages = {
            navigation: 'Solicitando ajuda com navegação...',
            emergency: 'Solicitando ajuda de emergência...',
            general: 'Solicitando informações gerais...'
        };

        this.helpStatus.textContent = helpMessages[helpType] || 'Solicitação enviada...';
        
        
        setTimeout(() => {
            this.helpStatus.textContent = 'Funcionário notificado. Chegará em breve.';
        }, 2000);

        setTimeout(() => {
            this.closeHelpModal();
        }, 4000);
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showVoiceFeedback('Procurando por: ' + query);
        this.generateRoute(query);
    }

    handleQuickAction(action) {
        const actionMessages = {
            bathroom: 'Banheiro mais próximo',
            parking: 'Estacionamento',
            exit: 'Saída principal',
            food: 'Área de alimentação'
        };

        this.showVoiceFeedback('Procurando ' + actionMessages[action]);
        this.generateRoute(actionMessages[action]);
    }

    generateRoute(destination) {
        
        const steps = [
            'Siga em frente por 15 metros',
            'Vire à direita na cafeteria',
            'Continue por 20 metros',
            'Vire à esquerda na loja de eletrônicos',
            'Seu destino está à direita'
        ];

        this.routeSteps.innerHTML = '';
        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'route-step';
            stepElement.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step}</div>
            `;
            this.routeSteps.appendChild(stepElement);
        });

        this.routeSection.style.display = 'block';
        this.routeSection.scrollIntoView({ behavior: 'smooth' });
    }

    startNavigation() {
        this.isNavigating = true;
        this.showVoiceFeedback('Navegação iniciada. Siga as instruções.');
        
        
        let currentStep = 0;
        const steps = this.routeSteps.querySelectorAll('.route-step');
        
        const navigationInterval = setInterval(() => {
            if (currentStep < steps.length) {
                steps[currentStep].style.background = '#dbeafe';
                steps[currentStep].style.border = '2px solid #2563eb';
                this.showVoiceFeedback(steps[currentStep].querySelector('.step-text').textContent);
                currentStep++;
            } else {
                clearInterval(navigationInterval);
                this.showVoiceFeedback('Você chegou ao seu destino!');
                this.isNavigating = false;
            }
        }, 5000);
    }

    cancelNavigation() {
        this.isNavigating = false;
        this.routeSection.style.display = 'none';
        this.showVoiceFeedback('Navegação cancelada');
    }

    updateRoutePreferences() {
        const avoidCrowds = this.avoidCrowds.checked;
        const accessibleRoute = this.accessibleRoute.checked;
        
        console.log('Preferências de rota atualizadas:', {
            avoidCrowds,
            accessibleRoute
        });
    }

    simulateLocationDetection() {
        
        const locations = [
            'Entrada Principal - Shopping Guararapes',
            'Corredor Central - Térreo',
            'Área de Alimentação - Térreo',
            'Praça de Eventos - Térreo',
            'Estacionamento - Shopping Guararapes'
        ];

        const descriptions = [
            'Você está na entrada principal do shopping',
            'Corredor com lojas à esquerda e direita',
            'Área com restaurantes e lanchonetes',
            'Espaço aberto para eventos e apresentações',
            'Estacionamento com acesso direto ao shopping'
        ];

        let locationIndex = 0;
        
        
        setInterval(() => {
            this.currentLocation = locations[locationIndex];
            this.currentLocationText.textContent = this.currentLocation;
            this.locationDescription.textContent = descriptions[locationIndex];
            
            locationIndex = (locationIndex + 1) % locations.length;
        }, 10000);

        
        this.currentLocation = locations[0];
        this.currentLocationText.textContent = this.currentLocation;
        this.locationDescription.textContent = descriptions[0];
    }

    
    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    }

    
    vibrate(pattern = [100]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new Guia360();
    
    
    document.addEventListener('focusin', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
            app.vibrate([50]);
        }
    });

    
    setTimeout(() => {
        app.speak('Guia360 carregado. Toque no botão de microfone para usar comandos de voz.');
    }, 1000);
});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 
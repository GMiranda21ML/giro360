
class Guia360 {
    constructor() {
        this.userPreference = null;
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.visualImpairmentBtn = document.getElementById('visualImpairmentBtn');
        this.noImpairmentBtn = document.getElementById('noImpairmentBtn');
        this.voiceAssistantBtn = document.getElementById('voiceAssistantBtn');
        this.logoImage = document.getElementById('logoImage');
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }

    initializeEventListeners() {
        // Botões de acessibilidade
        this.visualImpairmentBtn.addEventListener('click', () => {
            this.selectUserPreference('visual-impairment');
        });

        this.noImpairmentBtn.addEventListener('click', () => {
            this.selectUserPreference('no-impairment');
        });
        
        this.voiceAssistantBtn.addEventListener('click', () => {
            this.navigateToVoiceAssistant();
        });

        // Feedback tátil para botões
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.vibrate([50]);
            }
        });
    }

    selectUserPreference(preference) {
        this.userPreference = preference;
        
        // Feedback visual
        if (preference === 'visual-impairment') {
            this.visualImpairmentBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.visualImpairmentBtn.style.transform = '';
            }, 150);
        } else {
            this.noImpairmentBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.noImpairmentBtn.style.transform = '';
            }, 150);
        }

        // Feedback tátil
        this.vibrate([100, 50, 100]);
        
        // Navegar para a página apropriada após um breve delay
        setTimeout(() => {
            this.navigateToVoiceAssistant();
        }, 300);

        // Feedback de voz
        this.speak(this.getPreferenceMessage(preference));
    }

    navigateToVoiceAssistant() {
        // Mostrar indicador de carregamento
        this.showLoading();
        
        // Navegar para a página do assistente de voz após um breve delay
        setTimeout(() => {
            window.location.href = 'voice_assistant.html';
        }, 300);
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

    getPreferenceMessage(preference) {
        const messages = {
            'visual-impairment': 'Modo acessível ativado. Interface otimizada para pessoas com deficiência visual.',
            'no-impairment': 'Modo padrão ativado. Aproveite todas as funcionalidades do Guia360.'
        };
        return messages[preference] || 'Preferência selecionada.';
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            try {
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;
                
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Erro ao utilizar síntese de voz:', error);
            }
        } else {
            console.warn('Síntese de voz não suportada neste navegador');
        }
    }

    vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
}

// Inicializar o aplicativo quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new Guia360();
});
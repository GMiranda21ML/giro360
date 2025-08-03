
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
        this.helpBtn = document.getElementById('helpBtn');
    }

    initializeEventListeners() {
        this.visualImpairmentBtn.addEventListener('click', () => {
            this.selectUserPreference('visual-impairment');
        });

        this.noImpairmentBtn.addEventListener('click', () => {
            this.selectUserPreference('no-impairment');
        });
        
        this.voiceAssistantBtn.addEventListener('click', () => {
            this.navigateToVoiceAssistant();
        });

        if (this.helpBtn) {
            this.helpBtn.addEventListener('click', (e) => {
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

    selectUserPreference(preference) {
        this.userPreference = preference;
        
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

        this.vibrate([100, 50, 100]);
        
        setTimeout(() => {
            this.navigateToVoiceAssistant();
        }, 300);

        this.speak(this.getPreferenceMessage(preference));
    }

    navigateToVoiceAssistant() {
        this.showLoading();
        
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
    
    showHelp() {
        alert('Guia360 - Shopping Guararapes\n\nEste aplicativo ajuda você a se locomover pelo Shopping Guararapes.\n\nSelecione uma das opções na tela inicial para começar:\n- "Possuo deficiência visual": Ativa o modo acessível\n- "Não possuo deficiência visual": Ativa o modo padrão\n\nApós selecionar, você será direcionado ao assistente de voz para solicitar direções.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new Guia360();
});
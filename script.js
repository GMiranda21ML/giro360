
class Guia360 {
    constructor() {
        this.userPreference = null;
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.visualImpairmentBtn = document.getElementById('visualImpairmentBtn');
        this.noImpairmentBtn = document.getElementById('noImpairmentBtn');
        this.logoImage = document.getElementById('logoImage');
    }

    initializeEventListeners() {
        // Botões de acessibilidade
        this.visualImpairmentBtn.addEventListener('click', () => {
            this.selectUserPreference('visual-impairment');
        });

        this.noImpairmentBtn.addEventListener('click', () => {
            this.selectUserPreference('no-impairment');
        });

        // Feedback tátil para botões
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'BUTTON') {
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

        // Feedback de voz
        this.speak(this.getPreferenceMessage(preference));

        // Simular transição para a próxima tela
        setTimeout(() => {
            this.showMainInterface();
        }, 2000);
    }

    getPreferenceMessage(preference) {
        const messages = {
            'visual-impairment': 'Modo acessível ativado. Interface otimizada para pessoas com deficiência visual.',
            'no-impairment': 'Modo padrão ativado. Aproveite todas as funcionalidades do Guia360.'
        };
        return messages[preference] || 'Preferência selecionada.';
    }

    showMainInterface() {
        // Aqui você pode implementar a transição para a interface principal
        console.log('Transicionando para interface principal com preferência:', this.userPreference);
        
        // Por enquanto, apenas mostra uma mensagem
        this.speak('Carregando interface principal do Guia360...');
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            try {
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.9;
                utterance.volume = 0.8;
                utterance.pitch = 1.0;
                
                utterance.onerror = (event) => {
                    console.error('Erro na síntese de voz:', event.error);
                };
                
                utterance.onend = () => {
                    console.log('Síntese de voz concluída');
                };
                
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Erro ao tentar falar:', error);
            }
        } else {
            console.warn('Síntese de voz não suportada neste navegador');
        }
    }

    vibrate(pattern = [100]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new Guia360();
    
    // Mensagem de boas-vindas após um pequeno delay
    setTimeout(() => {
        app.speak('Bem-vindo ao Guia360. Selecione sua preferência de acessibilidade.');
    }, 1000);
}); 
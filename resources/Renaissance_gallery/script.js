// Galería de Artistas Renacentistas - Script Mejorado
class InfiniteGallery {
    constructor() {
        this.gallery = null;
        this.portraits = null;
        this.backButton = null;
        this.galleryContainer = null;
        
        // Estados de control
        this.state = {
            isScrolling: false,
            isPaused: false,
            isAnimating: true,
            startX: 0,
            scrollLeft: 0,
            animationSpeed: 50, // segundos para completar un ciclo
            currentTranslate: 0
        };
        
        // Configuración
        this.config = {
            scrollSensitivity: 2,
            particleLimit: 8,
            particleInterval: 4000,
            keyboardScrollAmount: 300,
            hoverEffectDuration: 300,
            clickEffectDuration: 100
        };
        
        // Contenedores de elementos
        this.particles = new Set();
        this.observers = [];
        this.eventListeners = [];
        
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        try {
            // Obtener elementos del DOM
            this.gallery = document.querySelector('.gallery');
            this.galleryContainer = document.querySelector('.gallery-container');
            this.portraits = document.querySelectorAll('.portrait');
            this.backButton = document.querySelector('.back-button');
            
            // Verificar elementos críticos
            if (!this.gallery) {
                throw new Error('Element .gallery not found');
            }
            
            if (this.portraits.length === 0) {
                console.warn('No portraits found in the gallery');
                return;
            }
            
            // Configurar la galería
            this.setupInfiniteScroll();
            this.setupEventListeners();
            this.setupKeyboardControls();
            this.setupPerformanceOptimizations();
            this.startParticleSystem();
            
            // Inicializar animación
            this.startAnimation();
            
            console.log('Gallery of Renaissance Artists initialized successfully');
            this.logControls();
            
        } catch (error) {
            console.error('Error initializing gallery:', error);
        }
    }
    
    setupInfiniteScroll() {
        // El HTML ya tiene los elementos duplicados, configurar CSS para animación infinita
        const totalWidth = this.portraits.length * 300; // 300px + 20px gap aproximado
        const halfWidth = totalWidth / 2;
        
        // Configurar animación CSS
        this.addAnimationStyles(halfWidth);
        
        // Aplicar animación inicial
        this.gallery.style.animation = `infiniteScroll ${this.state.animationSpeed}s linear infinite`;
    }
    
    addAnimationStyles(width) {
        // Crear o actualizar estilos de animación
        let styleSheet = document.getElementById('gallery-animation-styles');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'gallery-animation-styles';
            document.head.appendChild(styleSheet);
        }
        
        styleSheet.textContent = `
            @keyframes infiniteScroll {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-${width}px);
                }
            }
            
            @keyframes fall {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-20px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            .gallery {
                display: flex;
                gap: 20px;
                will-change: transform;
            }
            
            .portrait {
                transition: all ${this.config.hoverEffectDuration}ms ease;
                flex-shrink: 0;
            }
            
            .portrait img {
                transition: transform ${this.config.hoverEffectDuration}ms ease;
            }
            
            .artist-name {
                transition: all ${this.config.hoverEffectDuration}ms ease;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .gallery {
                    animation: none !important;
                }
                
                .portrait, .portrait img, .artist-name {
                    transition: none !important;
                }
            }
        `;
    }
    
    setupEventListeners() {
        const isTouchDevice = 'ontouchstart' in window;
        
        if (isTouchDevice) {
            this.setupTouchEvents();
        } else {
            this.setupMouseEvents();
        }
        
        // Eventos comunes
        this.setupPortraitEvents();
        this.setupBackButtonEvents();
        
        // Eventos de redimensionamiento
        this.addEventListeners(window, 'resize', this.throttle(() => {
            this.setupInfiniteScroll();
        }, 250));
    }
    
    setupMouseEvents() {
        // Mouse down
        this.addEventListeners(this.gallery, 'mousedown', (e) => {
            this.startManualScroll(e.pageX);
            this.gallery.style.cursor = 'grabbing';
        });
        
        // Mouse leave
        this.addEventListeners(this.gallery, 'mouseleave', () => {
            this.stopManualScroll();
            this.gallery.style.cursor = 'grab';
        });
        
        // Mouse up
        this.addEventListeners(this.gallery, 'mouseup', () => {
            this.stopManualScroll();
            this.gallery.style.cursor = 'grab';
        });
        
        // Mouse move
        this.addEventListeners(this.gallery, 'mousemove', (e) => {
            this.handleManualScroll(e.pageX);
        });
        
        // Prevenir drag de imágenes
        this.addEventListeners(this.gallery, 'dragstart', (e) => {
            e.preventDefault();
        });
    }
    
    setupTouchEvents() {
        // Touch start
        this.addEventListeners(this.gallery, 'touchstart', (e) => {
            this.startManualScroll(e.touches[0].pageX);
        }, { passive: false });
        
        // Touch end
        this.addEventListeners(this.gallery, 'touchend', () => {
            this.stopManualScroll();
        });
        
        // Touch move
        this.addEventListeners(this.gallery, 'touchmove', (e) => {
            this.handleManualScroll(e.touches[0].pageX);
        }, { passive: false });
    }
    
    startManualScroll(pageX) {
        this.state.isScrolling = true;
        this.state.startX = pageX - this.gallery.offsetLeft;
        this.state.scrollLeft = this.gallery.scrollLeft;
        
        // Pausar animación durante scroll manual
        this.pauseAnimation();
    }
    
    stopManualScroll() {
        if (!this.state.isScrolling) return;
        
        this.state.isScrolling = false;
        
        // Reanudar animación si no está pausada manualmente
        if (!this.state.isPaused) {
            this.resumeAnimation();
        }
    }
    
    handleManualScroll(pageX) {
        if (!this.state.isScrolling) return;
        
        const x = pageX - this.gallery.offsetLeft;
        const walk = (x - this.state.startX) * this.config.scrollSensitivity;
        this.gallery.scrollLeft = this.state.scrollLeft - walk;
    }
    
    setupPortraitEvents() {
        this.portraits.forEach(portrait => {
            // Mouse enter
            this.addEventListeners(portrait, 'mouseenter', () => {
                this.applyHoverEffect(portrait, true);
            });
            
            // Mouse leave
            this.addEventListeners(portrait, 'mouseleave', () => {
                this.applyHoverEffect(portrait, false);
            });
            
            // Click
            this.addEventListeners(portrait, 'click', () => {
                this.applyClickEffect(portrait);
            });
        });
    }
    
    applyHoverEffect(portrait, isHover) {
        const image = portrait.querySelector('img');
        const artistName = portrait.querySelector('.artist-name');
        
        if (isHover) {
            //portrait.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.6)';
            portrait.style.transform = 'translateY(-10px)';
            
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            
            if (artistName) {
                artistName.style.transform = 'scale(1.05)';
                //artistName.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.8)';
            }
        } else {
            portrait.style.boxShadow = '';
            portrait.style.transform = '';
            
            if (image) {
                image.style.transform = '';
            }
            
            if (artistName) {
                artistName.style.transform = '';
                artistName.style.textShadow = '';
            }
        }
    }
    
    applyClickEffect(portrait) {
        const originalTransition = portrait.style.transition;
        
        portrait.style.transition = `all ${this.config.clickEffectDuration}ms ease`;
        portrait.style.filter = 'brightness(1.3) saturate(1.2)';
        portrait.style.transform = 'scale(0.98) translateY(-8px)';
        
        setTimeout(() => {
            portrait.style.filter = '';
            portrait.style.transform = '';
            portrait.style.transition = originalTransition;
        }, this.config.clickEffectDuration);
    }
    
    setupBackButtonEvents() {
        if (!this.backButton) return;
        
        this.addEventListeners(this.backButton, 'click', (e) => {
            //e.preventDefault();
            
            // Efecto visual
            this.backButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.backButton.style.transform = '';
            }, 150);
            
            // Aquí se puede agregar lógica de navegación
            //console.log('Navigating back...');
            //window.history.back(); // Ejemplo de navegación
        });
    }
    
    setupKeyboardControls() {
        this.addEventListeners(document, 'keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.toggleAnimation();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.scrollGallery(-this.config.keyboardScrollAmount);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.scrollGallery(this.config.keyboardScrollAmount);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToStart();
                    break;
                case 'End':
                    e.preventDefault();
                    this.scrollToEnd();
                    break;
            }
        });
    }
    
    scrollGallery(amount) {
        this.pauseAnimation();
        this.gallery.scrollLeft += amount;
        
        // Reanudar animación después de un breve delay
        setTimeout(() => {
            if (!this.state.isPaused) {
                this.resumeAnimation();
            }
        }, 500);
    }
    
    scrollToStart() {
        this.gallery.scrollLeft = 0;
    }
    
    scrollToEnd() {
        this.gallery.scrollLeft = this.gallery.scrollWidth;
    }
    
    startAnimation() {
        this.state.isAnimating = true;
        this.gallery.style.animationPlayState = 'running';
    }
    
    pauseAnimation() {
        this.gallery.style.animationPlayState = 'paused';
    }
    
    resumeAnimation() {
        if (this.state.isAnimating && !this.state.isPaused) {
            this.gallery.style.animationPlayState = 'running';
        }
    }
    
    toggleAnimation() {
        this.state.isPaused = !this.state.isPaused;
        
        if (this.state.isPaused) {
            this.pauseAnimation();
            console.log('Animation paused');
        } else {
            this.resumeAnimation();
            console.log('Animation resumed');
        }
    }
    
    startParticleSystem() {
        // Verificar preferencias de movimiento reducido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        setInterval(() => {
            this.createGoldenParticle();
        }, this.config.particleInterval);
    }
    
    createGoldenParticle() {
        if (this.particles.size >= this.config.particleLimit) return;
        
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #d4af37, #ffd700);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 10}px;
            animation: fall 3s linear forwards;
            box-shadow: 0 0 6px rgba(212, 175, 55, 0.8);
        `;
        
        document.body.appendChild(particle);
        this.particles.add(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
            this.particles.delete(particle);
        }, 3000);
    }
    
    setupPerformanceOptimizations() {
        // Optimización para dispositivos móviles
        if (window.innerWidth <= 768) {
            this.gallery.style.willChange = 'transform';
        }
        
        // Intersection Observer para pausar cuando no esté visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.state.isPaused) {
                        this.resumeAnimation();
                    }
                } else {
                    this.pauseAnimation();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(this.gallery);
        this.observers.push(observer);
    }
    
    // Utilidad para throttle
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Utilidad para gestionar event listeners
    addEventListeners(element, event, handler, options = {}) {
        if (!element) return;
        
        element.addEventListener(event, handler, options);
        this.eventListeners.push({ element, event, handler, options });
    }
    
    logControls() {
        console.log('=== Gallery Controls ===');
        console.log('• Space: Pause/Resume animation');
        console.log('• ← →: Manual scroll with keyboard');
        console.log('• Home/End: Go to start/end');
        console.log('• Click and drag: Manual scroll with mouse');
        console.log('• Touch: Manual scroll on touch devices');
        console.log('• Hover: Visual effects on portraits');
    }
    
    // Método de limpieza para evitar memory leaks
    destroy() {
        // Limpiar event listeners
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        
        // Limpiar observers
        this.observers.forEach(observer => observer.disconnect());
        
        // Limpiar partículas
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.remove();
            }
        });
        
        // Limpiar estilos dinámicos
        const styleSheet = document.getElementById('gallery-animation-styles');
        if (styleSheet) {
            styleSheet.remove();
        }
        
        console.log('Gallery destroyed and resources freed');
    }
}

// Inicializar la galería cuando el script se carga
const gallery = new InfiniteGallery();
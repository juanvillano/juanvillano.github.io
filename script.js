// Funcionalidad y interacciones para la página web
document.addEventListener('DOMContentLoaded', function() {
    
    // Obtener elementos
    const cards = document.querySelectorAll('.card');
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    
    // Animación de entrada para el título y subtítulo
    function animateHeader() {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-30px)';
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            title.style.transition = 'all 0.8s ease';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            subtitle.style.transition = 'all 0.8s ease';
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 600);
    }
    
    // Animación de entrada para las tarjetas
    function animateCards() {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.8)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 900 + (index * 200));
        });
    }
    
    // Efectos de hover mejorados para las tarjetas
    function setupCardHoverEffects() {
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Efecto de brillo en el borde
                this.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                this.style.boxShadow = `
                    0 20px 40px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.3),
                    0 0 30px rgba(255, 255, 255, 0.1)
                `;
                
                // Efecto de partículas flotantes
                createFloatingParticles(this);
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                this.style.boxShadow = 'none';
            });
            
            // Efecto de click
            card.addEventListener('click', function(e) {
                // Efecto de ripple
                createRippleEffect(e, this);
                
                // Simular carga antes de navegar (cuando se implementen los enlaces reales)
                setTimeout(() => {
                    console.log('Navegando a:', this.getAttribute('href'));
                }, 300);
            });
        });
    }
    
    // Crear efecto de partículas flotantes
    function createFloatingParticles(card) {
        const particles = 5;
        for (let i = 0; i < particles; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: floatParticle 2s ease-out forwards;
                `;
                
                const rect = card.getBoundingClientRect();
                particle.style.left = Math.random() * rect.width + 'px';
                particle.style.top = rect.height + 'px';
                
                card.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    // Crear efecto de ripple al hacer click
    function createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Efecto de parallax sutil para el fondo
    function setupParallaxEffect() {
        window.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                const speed = 0.02 + (index * 0.01);
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                
                card.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Efecto de escritura para el título
    function typewriterEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Animación de las estrellas de fondo
    function animateStars() {
        const stars = document.querySelectorAll('body::after');
        setInterval(() => {
            const randomStar = Math.floor(Math.random() * 50);
            // Simular twinkle aleatorio
        }, 2000);
    }
    
    // Efecto de scroll suave para el footer
    function setupSmoothScroll() {
        const footer = document.querySelector('.footer');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        observer.observe(footer);
    }
    
    // Inicializar todas las funcionalidades
    function init() {
        // Configurar estilos iniciales
        const footer = document.querySelector('.footer');
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(20px)';
        footer.style.transition = 'all 0.8s ease';
        
        // Ejecutar animaciones
        animateHeader();
        animateCards();
        
        // Configurar efectos
        setupCardHoverEffects();
        setupParallaxEffect();
        setupSmoothScroll();
        
        // Efecto de escritura opcional (descomentar si se desea)
        // setTimeout(() => typewriterEffect(title, 'WEEK 1'), 1000);
    }
    
    // Agregar estilos CSS dinámicos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(0);
                opacity: 0;
            }
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .card {
            transition: all 0.3s ease, transform 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar cuando el DOM esté listo
    init();
    
    // Efecto de carga de página
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Optimización de rendimiento - throttling para eventos de mouse
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Aplicar throttling al efecto parallax
    const throttledParallax = throttle(setupParallaxEffect, 16); // ~60fps
    window.addEventListener('mousemove', throttledParallax);
}); 
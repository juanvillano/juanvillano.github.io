// Eagle Website Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initScrollIndicator();
    initTooltips();
    initTypeItems();
    initNavigation();
    initSmoothScrolling();
    initParallaxEffects();
    initCardAnimations();
});

// Scroll Indicator Functionality
function initScrollIndicator() {
    const scrollDots = document.querySelectorAll('.scroll-dots .dot');
    const scrollNumber = document.querySelector('.scroll-number');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
        
        // Update scroll number
        if (scrollNumber) {
            const sectionNumber = Math.floor(scrollPercentage / 33) + 1;
            scrollNumber.textContent = String(sectionNumber).padStart(2, '0');
        }
        
        // Update active dot
        const activeDotIndex = Math.floor(scrollPercentage / 33);
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    });
}

// Tooltip Functionality
function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    const content_image = document.querySelector('.anatomy-image');
    const imageRect = content_image.getBoundingClientRect();
    
    console.log(imageRect.width);

    
    tooltips.forEach(tooltip => {
        const tooltipContent = tooltip.querySelector('.tooltip-content');
        
        // Position tooltip content based on available space
        tooltip.addEventListener('mouseenter', function() {
            const rect = tooltip.getBoundingClientRect();
            const contentRect = tooltipContent.getBoundingClientRect();
            
            // Check if tooltip would go off screen
            if (rect.left + contentRect.width > imageRect.width) { //window.innerWidth
                tooltipContent.style.left = '100%';
                tooltipContent.style.right = '0';
            } else {
                tooltipContent.style.left = '0';
                tooltipContent.style.right = 'auto';
            }
            
            if (rect.top + contentRect.height > imageRect.height) { //window.innerHeight
                tooltipContent.style.top = 'auto';
                tooltipContent.style.bottom = '0';
                tooltipContent.style.marginBottom = '0';
            } else {
                tooltipContent.style.top = '100%';
                tooltipContent.style.bottom = 'auto';
                tooltipContent.style.marginTop = '10px';
            }
        });
        
        // Add click functionality for mobile
        tooltip.addEventListener('click', function(e) {
            e.preventDefault();
            tooltipContent.style.opacity = tooltipContent.style.opacity === '1' ? '0' : '1';
            tooltipContent.style.visibility = tooltipContent.style.visibility === 'visible' ? 'hidden' : 'visible';
        });
    });
}

// Type Items Functionality
function initTypeItems() {
    const typeItems = document.querySelectorAll('.type-item');
    
    typeItems.forEach(item => {
        item.addEventListener('click', function() {
            const eagleType = this.dataset.type;
            showEagleInfo(eagleType);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Show Eagle Information Modal
function showEagleInfo(eagleType) {
    const eagleData = {
        calva: {
            name: 'Bald Eagle',
            scientific: 'Haliaeetus leucocephalus',
            habitat: 'North America',
            description: 'The national symbol of the United States. It is characterized by its white head and white tail. It can live up to 30 years in the wild.',
            facts: [
                'Wingspan: 1.8-2.3 meters',
                'Weight: 3-6 kg',
                'Flight speed: 160 km/h',
                'Population: ~70,000 individuals'
            ]
        },
        real: {
            name: 'Golden Eagle',
            scientific: 'Aquila chrysaetos',
            habitat: 'Eurasia and North America',
            description: "One of the world's most powerful birds of prey. Found in mountains and open areas.",
            facts: [
                'Wingspan: 1.8-2.3 meters',
                'Weight: 3-7 kg',
                'Dive speed: 320 km/h',
                'Population: ~170,000 individuals'
            ]
        },
        harpia: {
            name: 'Harpy Eagle',
            scientific: 'Harpia harpyja',
            habitat: 'Central and South America',
            description: 'The most powerful of the Amazonian eagles. It feeds primarily on monkeys and sloths.',
            facts: [
                'Wingspan: 1.8–2.2 meters',
                'Weight: 4–9 kg',
                'Claws: Up to 13 cm long',
                'Population: ~50,000 individuals'
            ]
        },
        marina: {
            name: 'Sea Eagle',
            scientific: 'Haliaeetus albicilla',
            habitat: 'Europe and Asia',
            description: 'Specialized in fishing, it is found near coasts and large bodies of water.',
            facts: [
                'Wingspan: 1.8-2.4 meters',
                'Weight: 3-7 kg',
                'Flight speed: 140 km/h',
                'Population: ~20,000 individuals'
            ]
        }
    };
    
    const eagle = eagleData[eagleType];
    if (!eagle) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'eagle-modal';
    modal.innerHTML = `
        <div class="modal-content glass">
            <div class="modal-header">
                <h2>${eagle.name}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="eagle-info">
                    <p class="scientific-name">${eagle.scientific}</p>
                    <p class="habitat"><strong>Hábitat:</strong> ${eagle.habitat}</p>
                    <p class="description">${eagle.description}</p>
                    <div class="facts">
                        <h3>Datos Interesantes:</h3>
                        <ul>
                            ${eagle.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .eagle-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .modal-header h2 {
            color: #333;
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #333;
        }
        
        .scientific-name {
            font-style: italic;
            color: #666;
            margin-bottom: 1rem;
        }
        
        .habitat {
            margin-bottom: 1rem;
        }
        
        .description {
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .facts h3 {
            margin-bottom: 0.5rem;
            color: #333;
        }
        
        .facts ul {
            list-style: none;
            padding: 0;
        }
        
        .facts li {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .facts li:last-child {
            border-bottom: none;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Navigation Functionality
function initNavigation() {
    const searchIcon = document.querySelector('.nav-left .nav-icon');
    const menuIcon = document.querySelector('.nav-right .nav-icon');
    
    // Search functionality
    searchIcon.addEventListener('click', function() {
        showSearchModal();
    });
    
    // Menu functionality
    menuIcon.addEventListener('click', function() {
        showMenuModal();
    });
}

// Search Modal
function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-content glass">
            <div class="search-header">
                <h3>Buscar Águilas</h3>
                <button class="search-close">&times;</button>
            </div>
            <div class="search-body">
                <input type="text" placeholder="Buscar por nombre, hábitat, características..." class="search-input">
                <div class="search-results">
                    <div class="search-suggestion" data-search="calva">Águila Calva</div>
                    <div class="search-suggestion" data-search="real">Águila Real</div>
                    <div class="search-suggestion" data-search="harpia">Águila Harpía</div>
                    <div class="search-suggestion" data-search="marina">Águila Marina</div>
                </div>
            </div>
        </div>
    `;
    
    // Add search modal styles
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            z-index: 10000;
            padding-top: 100px;
            animation: fadeIn 0.3s ease;
        }
        
        .search-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            width: 90%;
            max-width: 600px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .search-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .search-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .search-input {
            width: 100%;
            padding: 1rem;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            font-size: 1rem;
            margin-bottom: 1rem;
            background: rgba(255, 255, 255, 0.8);
        }
        
        .search-suggestion {
            padding: 0.75rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .search-suggestion:hover {
            background: rgba(0, 0, 0, 0.05);
        }
        
        .search-suggestion:last-child {
            border-bottom: none;
        }
    `;
    
    document.head.appendChild(searchStyles);
    document.body.appendChild(modal);
    
    // Search functionality
    const searchInput = modal.querySelector('.search-input');
    const suggestions = modal.querySelectorAll('.search-suggestion');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        suggestions.forEach(suggestion => {
            const text = suggestion.textContent.toLowerCase();
            suggestion.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
    
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const searchType = this.dataset.search;
            modal.remove();
            showEagleInfo(searchType);
        });
    });
    
    // Close functionality
    const closeBtn = modal.querySelector('.search-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Focus on input
    setTimeout(() => searchInput.focus(), 100);
}

// Menu Modal
function showMenuModal() {
    const modal = document.createElement('div');
    modal.className = 'menu-modal';
    modal.innerHTML = `
        <div class="menu-content glass">
            <div class="menu-header">
                <h3>Menú</h3>
                <button class="menu-close">&times;</button>
            </div>
            <div class="menu-body">
                <a href="#cards" class="menu-item">Tipos de Águilas</a>
                <a href="#anatomy" class="menu-item">Anatomía</a>
                <a href="#gallery" class="menu-item">Galería</a>
                <a href="#flight" class="menu-item">El Vuelo</a>
                <a href="#types" class="menu-item">Especies</a>
                <a href="../../index.html" class="back-button">Go back to home</a>
            </div>
        </div>
    `;
    
    // Add menu modal styles
    const menuStyles = document.createElement('style');
    menuStyles.textContent = `
        .menu-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .menu-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            width: 90%;
            max-width: 400px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .menu-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .menu-item {
            display: block;
            padding: 1rem;
            text-decoration: none;
            color: #333;
            border-radius: 10px;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.5);
        }
        
        .menu-item:hover {
            background: rgba(0, 0, 0, 0.05);
            transform: translateX(10px);
        }
    `;
    
    document.head.appendChild(menuStyles);
    document.body.appendChild(modal);
    
    // Menu item functionality
    const menuItems = modal.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.querySelector(`.${targetId}-section`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            modal.remove();
        });
    });
    
    // Close functionality
    const closeBtn = modal.querySelector('.menu-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.mountain-silhouette, .hero-content');
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('mountain-silhouette') ? 0.5 : 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Card Animations
function initCardAnimations() {
    const cards = document.querySelectorAll('.card, .type-item, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}); 
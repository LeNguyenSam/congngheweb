document.addEventListener('DOMContentLoaded', function() {
    // Carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const carouselInner = document.getElementById('carousel-inner');
        const indicatorsContainer = document.getElementById('carousel-indicators');
        const prevBtn = carousel.querySelector('.carousel-control.prev');
        const nextBtn = carousel.querySelector('.carousel-control.next');
        let currentIndex = 0;
        let interval;

        function showSlide(index) {
            const items = carousel.querySelectorAll('.carousel-item');
            const indicators = carousel.querySelectorAll('.carousel-indicators span');
            items.forEach(item => item.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            items[index].classList.add('active');
            indicators[index].classList.add('active');
            currentIndex = index;
        }

        function nextSlide() {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= carousel.querySelectorAll('.carousel-item').length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = carousel.querySelectorAll('.carousel-item').length - 1;
            }
            showSlide(prevIndex);
        }

        function startAutoSlide() {
            interval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(interval);
        }

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);

        startAutoSlide();
    }

    // Search functionality
    const searchInput = document.querySelector('.nav-right input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // Dark mode functionality
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLeft = document.querySelector('.nav-left');
    if (mobileMenuToggle && navLeft) {
        mobileMenuToggle.addEventListener('click', function() {
            navLeft.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        document.addEventListener('click', (e) => {
            if (!navLeft.contains(e.target) && !mobileMenuToggle.contains(e.target) && navLeft.classList.contains('active')) {
                navLeft.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }

    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Initialize novels data from server
    initializeNovels();

    // User authentication state management
    const authButtons = document.querySelector('.auth-buttons');
    const userProfile = document.querySelector('.user-profile');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if user is logged in
    function checkAuthState() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) userProfile.style.display = 'block';
            // Update avatar if user has one
            const avatarImg = userProfile ? userProfile.querySelector('.user-avatar img') : null;
            if (avatarImg && user.avatar) {
                avatarImg.src = user.avatar;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('user');
            checkAuthState();
            window.location.href = '/';
        });
    }

    // Check auth state on page load
    checkAuthState();
});

function initializeNovels() {
    fetch('/novels')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const novels = data.novels;

                // Populate carousel with latest novels
                const carouselInner = document.getElementById('carousel-inner');
                const indicatorsContainer = document.getElementById('carousel-indicators');
                if (carouselInner && indicatorsContainer) {
                    carouselInner.innerHTML = '';
                    indicatorsContainer.innerHTML = '';
                    novels.slice(0, 3).forEach((novel, index) => {
                        const item = document.createElement('div');
                        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                        item.innerHTML = `
                            <a href="novel-detail.html?id=${novel.novel_id}">
                                <img src="${novel.cover_image || '/image/default.jpg'}" alt="${novel.title}">
                                <div class="carousel-caption">
                                    <h3>${novel.title}</h3>
                                </div>
                            </a>
                        `;
                        carouselInner.appendChild(item);

                        const indicator = document.createElement('span');
                        indicator.className = index === 0 ? 'active' : '';
                        indicator.addEventListener('click', () => {
                            showSlide(index);
                            stopAutoSlide();
                            startAutoSlide();
                        });
                        indicatorsContainer.appendChild(indicator);
                    });
                }

                // Display recommended novels
                const recommendedGrid = document.querySelector('.recommended-novels .novels-grid');
                if (recommendedGrid) {
                    recommendedGrid.innerHTML = '';
                    novels.slice(0, 4).forEach(novel => {
                        const novelElement = createNovelElement(novel);
                        recommendedGrid.appendChild(novelElement);
                    });
                }

                // Display hot novels
                const hotGrid = document.querySelector('.hot-novels .novels-grid');
                if (hotGrid) {
                    hotGrid.innerHTML = '';
                    novels.slice(4, 8).forEach(novel => {
                        const novelElement = createNovelElement(novel);
                        hotGrid.appendChild(novelElement);
                    });
                }
            } else {
                console.error('Error fetching novels:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching novels:', error);
        });
}

function createNovelElement(novel) {
    const div = document.createElement('div');
    div.className = 'novel-item';
    div.innerHTML = `
        <a href="novel-detail.html?id=${novel.novel_id}">
            <img src="${novel.cover_image || '/image/default.jpg'}" alt="${novel.title}">
            <div class="novel-info">
                <div class="title">${novel.title}</div>
                <div class="stats">
                    <span><i class="fas fa-eye"></i> ${novel.views || 0}</span>
                    <span><i class="fas fa-heart"></i> ${novel.rating ? novel.rating.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        </a>
    `;
    return div;
}

function showSlide(index) {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.carousel-indicators span');
        items.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        items[index].classList.add('active');
        indicators[index].classList.add('active');
    }
}

function stopAutoSlide() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        clearInterval(carousel.interval);
    }
}

function startAutoSlide() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.interval = setInterval(() => {
            let currentIndex = Array.from(carousel.querySelectorAll('.carousel-item')).findIndex(item => item.classList.contains('active'));
            let nextIndex = currentIndex + 1;
            if (nextIndex >= carousel.querySelectorAll('.carousel-item').length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
        }, 5000);
    }
}
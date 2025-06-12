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

    // Initialize novels data
    initializeNovels();
});

function initializeNovels() {
    const carouselNovels = [
        {
            id: 'tokyo-ghoul',
            title: 'Tokyo Ghoul',
            cover: '/image/tokyo-ghoul.jpg',
            link: 'novel-detail.html?id=tokyo-ghoul'
        },
        {
            id: 'jujutsu-kaisen',
            title: 'Jujutsu Kaisen',
            cover: '/image/jujutsu-kaisen.jpg',
            link: 'novel-detail.html?id=jujutsu-kaisen'
        },
        {
            id: 'thang-4',
            title: 'Tháng 4 Là Lời Nói Dối Của Em',
            cover: '/image/thang-4.jpg',
            link: 'novel-detail.html?id=thang-4'
        }
    ];

    const recommendedNovels = [
        {
            id: 1,
            title: 'Ta tu có thể giả tiên',
            cover: '/image/novel1.jpg',
            author: 'Tác Giả 1',
            rating: 4.5,
            views: 10000
        },
        {
            id: 2,
            title: 'Ta tại trong núi thành tiên',
            cover: '/image/novel2.jpg',
            author: 'Tác Giả 2',
            rating: 4.8,
            views: 15000
        },
        {
            id: 3,
            title: 'Mù lòa tróc đao mãn',
            cover: '/image/novel3.jpg',
            author: 'Tác giả 3',
            rating: 4.2,
            views: 8000
        },
        {
            id: 4,
            title: 'Không tiền tu cái gì tiên',
            cover: '4',
            cover: '/image/novel4.jpg',
            author: 'Tác giả 4',
            rating: 4.7,
            views: 12000
        }
    ];

    const hotNovels = [
        {
            id: 5,
            title: 'Kaoru Hana',
            cover: '/image/Kaoru_Hana_wa_Rin_to_Saku-14e2f9e.jpg',
            author: 'Tác Giả 5',
            rating: 4.9,
            views: 20000
        },
        {
            id: 6,
            title: 'Ta tu có thể giả tiên',
            cover: '/image/novel1.jpg',
            author: 'Tác Giả 6',
            rating: 4.6,
            views: 18000
        },
        {
            id: 7,
            title: 'Ta tại trong núi tu tiên',
            cover: '/image/novel2.jpg',
            author: 'Tác Giả 7',
            rating: 4.4,
            views: 16000
        },
        {
            id: 8,
            title: 'Mù lòa tróc đao nhân',
            cover: '/image/novel3.jpg',
            author: 'Tác Giả 8',
            rating: 4.3,
            views: 14000
        }
    ];

    // Populate carousel
    const carouselInner = document.getElementById('carousel-inner');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (carouselInner && indicatorsContainer) {
        carouselNovels.forEach((novel, index) => {
            const item = document.createElement('div');
            item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            item.innerHTML = `
                <a href="${novel.link}">
                    <img src="${novel.cover}" alt="${novel.title}">
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
        recommendedNovels.forEach(novel => {
            const novelElement = createNovelElement(novel);
            recommendedGrid.appendChild(novelElement);
        });
    }

    // Display hot novels
    const hotGrid = document.querySelector('.hot-novels .novels-grid');
    if (hotGrid) {
        hotNovels.forEach(novel => {
            const novelElement = createNovelElement(novel);
            hotGrid.appendChild(novelElement);
        });
    }
}

function createNovelElement(novel) {
    const div = document.createElement('div');
    div.className = 'novel-item';
    div.innerHTML = `
        <a href="novel-detail.html?id=${novel.id}">
            <img src="${novel.cover}" alt="${novel.title}">
            <div class="novel-info">
                <div class="title">${novel.title}</div>
                <div class="stats">
                    <span><i class="fas fa-eye"></i> ${novel.views}</span>
                    <span><i class="fas fa-heart"></i> ${novel.rating}</span>
                </div>
            </div>
        </a>
    `;
    return div;
}
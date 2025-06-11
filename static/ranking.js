document.addEventListener('DOMContentLoaded', function() {
    // Sample data for rankings
    const rankingData = {
        views: [
            {
                title: 'Truyện 1',
                cover: './image/novel1.jpg',
                author: 'Tác Giả 1',
                views: 1000000,
                rating: 4.5,
                follows: 50000
            },
            {
                title: 'Truyện 2',
                cover: './image/novel2.jpg',
                author: 'Tác Giả 2',
                views: 800000,
                rating: 4.8,
                follows: 45000
            },
            {
                title: 'Truyện 3',
                cover: './image/novel3.jpg',
                author: 'Tác Giả 3',
                views: 600000,
                rating: 4.2,
                follows: 30000
            },
            {
                title: 'Truyện 4',
                cover: './image/novel4.jpg',
                author: 'Tác Giả 4',
                views: 500000,
                rating: 4.7,
                follows: 25000
            }
        ],
        rating: [
            {
                title: 'Truyện 2',
                cover: './image/novel2.jpg',
                author: 'Tác Giả 2',
                views: 800000,
                rating: 4.8,
                follows: 45000
            },
            {
                title: 'Truyện 4',
                cover: './image/novel4.jpg',
                author: 'Tác Giả 4',
                views: 500000,
                rating: 4.7,
                follows: 25000
            },
            {
                title: 'Truyện 1',
                cover: './image/novel1.jpg',
                author: 'Tác Giả 1',
                views: 1000000,
                rating: 4.5,
                follows: 50000
            },
            {
                title: 'Truyện 3',
                cover: './image/novel3.jpg',
                author: 'Tác Giả 3',
                views: 600000,
                rating: 4.2,
                follows: 30000
            }
        ],
        follows: [
            {
                title: 'Truyện 1',
                cover: './image/novel1.jpg',
                author: 'Tác Giả 1',
                views: 1000000,
                rating: 4.5,
                follows: 50000
            },
            {
                title: 'Truyện 2',
                cover: './image/novel2.jpg',
                author: 'Tác Giả 2',
                views: 800000,
                rating: 4.8,
                follows: 45000
            },
            {
                title: 'Truyện 3',
                cover: './image/novel3.jpg',
                author: 'Tác Giả 3',
                views: 600000,
                rating: 4.2,
                follows: 30000
            },
            {
                title: 'Truyện 4',
                cover: './image/novel4.jpg',
                author: 'Tác Giả 4',
                views: 500000,
                rating: 4.7,
                follows: 25000
            }
        ]
    };

    // Elements
    const rankingList = document.querySelector('.ranking-list');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const timeFilter = document.getElementById('timeFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    // Current active tab
    let activeTab = 'views';

    // Function to format numbers
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Function to display rankings
    function displayRankings(type) {
        rankingList.innerHTML = '';
        const novels = rankingData[type];

        novels.forEach((novel, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.className = 'ranking-item';
            rankingItem.innerHTML = `
                <div class="rank-number">#${index + 1}</div>
                <img src="${novel.cover}" alt="${novel.title}">
                <div class="ranking-info">
                    <h3>${novel.title}</h3>
                    <p>Tác giả: ${novel.author}</p>
                    <div class="ranking-stats">
                        <div class="stat">
                            <i class="fas fa-eye"></i>
                            <span>${formatNumber(novel.views)} lượt xem</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>${novel.rating} / 5</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-heart"></i>
                            <span>${formatNumber(novel.follows)} theo dõi</span>
                        </div>
                    </div>
                </div>
            `;
            rankingList.appendChild(rankingItem);
        });
    }

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update active tab
            activeTab = button.dataset.tab;
            // Display rankings for selected tab
            displayRankings(activeTab);
        });
    });

    // Filter changes
    timeFilter.addEventListener('change', () => {
        displayRankings(activeTab);
    });

    categoryFilter.addEventListener('change', () => {
        displayRankings(activeTab);
    });

    // Initial display
    displayRankings('views');

    // Search functionality
    const searchInput = document.querySelector('.nav-right input');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}); 
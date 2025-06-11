document.addEventListener('DOMContentLoaded', function() {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    // Update search input with query
    const searchInput = document.querySelector('.nav-right input');
    if (searchInput && searchQuery) {
        searchInput.value = searchQuery;
    }

    // Sample data for search results
    const searchResults = [
        {
            title: 'Truyện 1',
            cover: './image/novel1.jpg',
            author: 'Tác Giả 1',
            category: 'Hành động',
            status: 'Đang tiến hành',
            rating: 4.5,
            views: 1000000,
            follows: 50000
        },
        {
            title: 'Truyện 2',
            cover: './image/novel2.jpg',
            author: 'Tác Giả 2',
            category: 'Tình cảm',
            status: 'Hoàn thành',
            rating: 4.8,
            views: 800000,
            follows: 45000
        },
        {
            title: 'Truyện 3',
            cover: './image/novel3.jpg',
            author: 'Tác Giả 3',
            category: 'Fantasy',
            status: 'Đang tiến hành',
            rating: 4.2,
            views: 600000,
            follows: 30000
        },
        {
            title: 'Truyện 4',
            cover: './image/novel4.jpg',
            author: 'Tác Giả 4',
            category: 'Hài hước',
            status: 'Hoàn thành',
            rating: 4.7,
            views: 500000,
            follows: 25000
        }
    ];

    // Elements
    const resultsContainer = document.querySelector('.search-results');
    const sortFilter = document.getElementById('sortFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbers = document.querySelector('.page-numbers');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 8;
    let totalPages = Math.ceil(searchResults.length / itemsPerPage);

    // Function to format numbers
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Function to display search results
    function displayResults(results, page) {
        resultsContainer.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageResults = results.slice(start, end);

        pageResults.forEach(novel => {
            const novelItem = document.createElement('div');
            novelItem.className = 'novel-item';
            novelItem.innerHTML = `
                <img src="${novel.cover}" alt="${novel.title}">
                <div class="novel-info">
                    <h3>${novel.title}</h3>
                    <p>Tác giả: ${novel.author}</p>
                    <p>Thể loại: ${novel.category}</p>
                    <p>Trạng thái: ${novel.status}</p>
                    <div class="novel-stats">
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>${novel.rating}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-eye"></i>
                            <span>${formatNumber(novel.views)}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-heart"></i>
                            <span>${formatNumber(novel.follows)}</span>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(novelItem);
        });

        updatePagination(results.length);
    }

    // Function to update pagination
    function updatePagination(totalItems) {
        totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageSpan = document.createElement('span');
            pageSpan.textContent = i;
            if (i === currentPage) {
                pageSpan.classList.add('active');
            }
            pageSpan.addEventListener('click', () => {
                currentPage = i;
                displayResults(filterResults(), currentPage);
            });
            pageNumbers.appendChild(pageSpan);
        }

        // Update buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Function to filter results
    function filterResults() {
        let filtered = [...searchResults];
        const category = categoryFilter.value;
        const status = statusFilter.value;
        const sort = sortFilter.value;

        // Apply category filter
        if (category !== 'all') {
            filtered = filtered.filter(novel => novel.category.toLowerCase() === category);
        }

        // Apply status filter
        if (status !== 'all') {
            filtered = filtered.filter(novel => novel.status === status);
        }

        // Apply sorting
        switch (sort) {
            case 'latest':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'views':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Relevance sorting (default)
                if (searchQuery) {
                    filtered.sort((a, b) => {
                        const aMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
                        const bMatch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
                        return bMatch - aMatch;
                    });
                }
        }

        return filtered;
    }

    // Event listeners for filters
    sortFilter.addEventListener('change', () => {
        currentPage = 1;
        displayResults(filterResults(), currentPage);
    });

    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        displayResults(filterResults(), currentPage);
    });

    statusFilter.addEventListener('change', () => {
        currentPage = 1;
        displayResults(filterResults(), currentPage);
    });

    // Event listeners for pagination
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayResults(filterResults(), currentPage);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayResults(filterResults(), currentPage);
        }
    });

    // Initial display
    displayResults(filterResults(), currentPage);

    // Search functionality
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}); 
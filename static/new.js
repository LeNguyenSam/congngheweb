document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const novelsPerPage = 12;
    let currentNovels = [];

    // Khởi tạo dữ liệu
    initializeNovels();

    // Xử lý sự kiện tìm kiếm
    const searchInput = document.querySelector('.nav-right input');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });

    // Xử lý sự kiện sắp xếp và lọc
    document.getElementById('sort-by').addEventListener('change', function() {
        sortAndFilterNovels();
    });

    document.getElementById('category').addEventListener('change', function() {
        sortAndFilterNovels();
    });

    // Xử lý phân trang
    document.querySelector('.prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            displayNovels();
        }
    });

    document.querySelector('.next-page').addEventListener('click', function() {
        const totalPages = Math.ceil(currentNovels.length / novelsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            displayNovels();
        }
    });

    // Xử lý click vào số trang
    document.querySelector('.page-numbers').addEventListener('click', function(e) {
        if (e.target.tagName === 'SPAN' && !e.target.classList.contains('current')) {
            currentPage = parseInt(e.target.textContent);
            updatePagination();
            displayNovels();
        }
    });
});

function initializeNovels() {
    // Giả lập dữ liệu truyện
    currentNovels = [
        {
            id: 1,
            title: 'Truyện Mới 1',
            cover: 'https://via.placeholder.com/200x300',
            author: 'Tác giả 1',
            category: 'tinh-cam',
            rating: 4.5,
            views: 10000,
            lastUpdated: '2024-03-20'
        },
        {
            id: 2,
            title: 'Truyện Mới 2',
            cover: 'https://via.placeholder.com/200x300',
            author: 'Tác giả 2',
            category: 'kinh-di',
            rating: 4.2,
            views: 8000,
            lastUpdated: '2024-03-19'
        },
        // Thêm các truyện khác
    ];

    displayNovels();
    updatePagination();
}

function sortAndFilterNovels() {
    const sortBy = document.getElementById('sort-by').value;
    const category = document.getElementById('category').value;

    // Lọc theo thể loại
    let filteredNovels = category === 'all' 
        ? currentNovels 
        : currentNovels.filter(novel => novel.category === category);

    // Sắp xếp
    filteredNovels.sort((a, b) => {
        switch (sortBy) {
            case 'latest':
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            case 'views':
                return b.views - a.views;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    currentNovels = filteredNovels;
    currentPage = 1;
    displayNovels();
    updatePagination();
}

function displayNovels() {
    const novelsGrid = document.querySelector('.novels-grid');
    const start = (currentPage - 1) * novelsPerPage;
    const end = start + novelsPerPage;
    const novelsToShow = currentNovels.slice(start, end);

    novelsGrid.innerHTML = novelsToShow.map(novel => `
        <div class="novel-item">
            <a href="novel-detail.html?id=${novel.id}">
                <img src="${novel.cover}" alt="${novel.title}">
                <div class="novel-info">
                    <h3>${novel.title}</h3>
                    <p class="author">${novel.author}</p>
                    <div class="stats">
                        <span><i class="fas fa-star"></i> ${novel.rating}</span>
                        <span><i class="fas fa-eye"></i> ${novel.views}</span>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(currentNovels.length / novelsPerPage);
    const pageNumbers = document.querySelector('.page-numbers');
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');

    // Cập nhật trạng thái nút prev/next
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    // Tạo số trang
    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagesHTML += `<span class="${i === currentPage ? 'current' : ''}">${i}</span>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagesHTML += '<span>...</span>';
        }
    }

    pageNumbers.innerHTML = pagesHTML;
} 
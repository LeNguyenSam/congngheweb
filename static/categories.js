document.addEventListener('DOMContentLoaded', function() {
    // Lấy tham số type từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    // Nếu có type, hiển thị danh sách truyện theo thể loại
    if (type) {
        showNovelsByCategory(type);
    }

    // Xử lý tìm kiếm
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

function showNovelsByCategory(category) {
    // Thay đổi tiêu đề trang
    const title = document.querySelector('.categories-container h1');
    title.textContent = getCategoryTitle(category);

    // Ẩn grid thể loại
    const categoriesGrid = document.querySelector('.categories-grid');
    categoriesGrid.style.display = 'none';

    // Tạo container cho danh sách truyện
    const novelsContainer = document.createElement('div');
    novelsContainer.className = 'novels-container';
    document.querySelector('.categories-container').appendChild(novelsContainer);

    // Thêm bộ lọc
    const filters = document.createElement('div');
    filters.className = 'novel-filters';
    filters.innerHTML = `
        <div class="filter-group">
            <label>Sắp xếp theo:</label>
            <select id="sort-by">
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="rating">Đánh giá</option>
            </select>
        </div>
        <div class="filter-group">
            <label>Trạng thái:</label>
            <select id="status">
                <option value="all">Tất cả</option>
                <option value="ongoing">Đang tiến hành</option>
                <option value="completed">Hoàn thành</option>
            </select>
        </div>
    `;
    novelsContainer.appendChild(filters);

    // Thêm grid truyện
    const novelsGrid = document.createElement('div');
    novelsGrid.className = 'novels-grid';
    novelsContainer.appendChild(novelsGrid);

    // Giả lập dữ liệu truyện
    const novels = getNovelsByCategory(category);
    displayNovels(novels);

    // Xử lý sự kiện lọc
    document.getElementById('sort-by').addEventListener('change', function() {
        const sortedNovels = sortNovels(novels, this.value);
        displayNovels(sortedNovels);
    });

    document.getElementById('status').addEventListener('change', function() {
        const filteredNovels = filterNovelsByStatus(novels, this.value);
        displayNovels(filteredNovels);
    });
}

function getCategoryTitle(category) {
    const titles = {
        'tinh-cam': 'TRUYỆN TÌNH CẢM',
        'kinh-di': 'TRUYỆN KINH DỊ',
        'hai-huoc': 'TRUYỆN HÀI HƯỚC',
        'vo-hiep': 'TRUYỆN VÕ HIỆP'
    };
    return titles[category] || 'THỂ LOẠI TRUYỆN';
}

function getNovelsByCategory(category) {
    // Giả lập dữ liệu truyện
    return [
        {
            id: 1,
            title: 'Truyện 1',
            cover: 'https://via.placeholder.com/200x300',
            author: 'Tác giả 1',
            status: 'ongoing',
            rating: 4.5,
            views: 10000
        },
        // Thêm các truyện khác
    ];
}

function displayNovels(novels) {
    const novelsGrid = document.querySelector('.novels-grid');
    novelsGrid.innerHTML = novels.map(novel => `
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

function sortNovels(novels, sortBy) {
    return [...novels].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return b.id - a.id;
            case 'popular':
                return b.views - a.views;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
}

function filterNovelsByStatus(novels, status) {
    if (status === 'all') return novels;
    return novels.filter(novel => novel.status === status);
} 
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load avatar
    if (user.avatar) {
        document.querySelector('.user-avatar img').src = user.avatar;
    }

    // Dữ liệu mẫu cho truyện
    const sampleNovels = [
        {
            id: 1,
            title: 'Tokyo Ghoul',
            cover: './image/anh-anime-cuc-dep.jpg',
            status: 'ongoing',
            views: 15000,
            likes: 1200,
            chapters: 24,
            lastUpdate: '2024-03-15'
        },
        {
            id: 2,
            title: 'Jujutsu Kaisen',
            cover: './image/jujutsu-kaisen-rotated.jpg',
            status: 'completed',
            views: 25000,
            likes: 2100,
            chapters: 36,
            lastUpdate: '2024-03-10'
        },
        {
            id: 3,
            title: 'Tháng 4 Là Lời Nói Dối Của Em',
            cover: './image/hinh-nen-anime-3.jpg',
            status: 'draft',
            views: 0,
            likes: 0,
            chapters: 0,
            lastUpdate: '2024-03-20'
        }
    ];

    // Hiển thị truyện
    function displayNovels(novels) {
        const grid = document.querySelector('.novels-grid');
        grid.innerHTML = '';

        novels.forEach(novel => {
            const novelElement = createNovelElement(novel);
            grid.appendChild(novelElement);
        });
    }

    // Tạo element cho truyện
    function createNovelElement(novel) {
        const div = document.createElement('div');
        div.className = 'novel-item';
        
        const statusClass = `status-${novel.status}`;
        const statusText = {
            ongoing: 'Đang tiến hành',
            completed: 'Hoàn thành',
            draft: 'Bản nháp'
        }[novel.status];

        div.innerHTML = `
            <div class="novel-cover">
                <img src="${novel.cover}" alt="${novel.title}">
                <span class="novel-status ${statusClass}">${statusText}</span>
            </div>
            <div class="novel-info">
                <h3>${novel.title}</h3>
                <div class="novel-stats">
                    <span><i class="fas fa-eye"></i> ${novel.views}</span>
                    <span><i class="fas fa-heart"></i> ${novel.likes}</span>
                    <span><i class="fas fa-book"></i> ${novel.chapters}</span>
                </div>
                <div class="novel-actions">
                    <button class="edit" onclick="editNovel(${novel.id})">
                        <i class="fas fa-edit"></i> Chỉnh sửa
                    </button>
                    <button onclick="deleteNovel(${novel.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        return div;
    }

    // Xử lý tìm kiếm
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredNovels = sampleNovels.filter(novel => 
            novel.title.toLowerCase().includes(searchTerm)
        );
        displayNovels(filteredNovels);
    });

    // Xử lý lọc theo trạng thái
    const statusFilter = document.getElementById('status-filter');
    statusFilter.addEventListener('change', function() {
        const status = this.value;
        const filteredNovels = status === 'all' 
            ? sampleNovels 
            : sampleNovels.filter(novel => novel.status === status);
        displayNovels(filteredNovels);
    });

    // Xử lý sắp xếp
    const sortFilter = document.getElementById('sort-filter');
    sortFilter.addEventListener('change', function() {
        const sortBy = this.value;
        const sortedNovels = [...sampleNovels].sort((a, b) => {
            switch(sortBy) {
                case 'latest':
                    return new Date(b.lastUpdate) - new Date(a.lastUpdate);
                case 'oldest':
                    return new Date(a.lastUpdate) - new Date(b.lastUpdate);
                case 'views':
                    return b.views - a.views;
                case 'likes':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });
        displayNovels(sortedNovels);
    });

    // Xử lý phân trang
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.querySelectorAll('.page-number');
    let currentPage = 1;

    function updatePagination() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === pageNumbers.length;
        
        pageNumbers.forEach((page, index) => {
            page.classList.toggle('active', index + 1 === currentPage);
        });
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            // TODO: Load dữ liệu cho trang mới
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < pageNumbers.length) {
            currentPage++;
            updatePagination();
            // TODO: Load dữ liệu cho trang mới
        }
    });

    pageNumbers.forEach((page, index) => {
        page.addEventListener('click', () => {
            currentPage = index + 1;
            updatePagination();
            // TODO: Load dữ liệu cho trang mới
        });
    });

    // Xử lý chế độ tối
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Hiển thị truyện ban đầu
    displayNovels(sampleNovels);
    updatePagination();
});

// Các hàm xử lý truyện
function editNovel(id) {
    // TODO: Chuyển hướng đến trang chỉnh sửa truyện
    console.log('Edit novel:', id);
}

function deleteNovel(id) {
    if (confirm('Bạn có chắc chắn muốn xóa truyện này?')) {
        // TODO: Xóa truyện
        console.log('Delete novel:', id);
    }
} 
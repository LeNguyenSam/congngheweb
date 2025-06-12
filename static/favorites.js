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

    // Dữ liệu mẫu cho truyện yêu thích
    const sampleFavorites = [
        {
            id: 1,
            title: 'Tokyo Ghoul',
            cover: './image/anh-anime-cuc-dep.jpg',
            author: 'Sui Ishida',
            genre: 'Hành động, Kinh dị',
            description: 'Câu chuyện về Kaneki Ken, một sinh viên đại học bị biến thành ghoul sau khi được cấy ghép nội tạng từ một ghoul. Anh phải học cách sống với bản chất mới của mình trong thế giới nguy hiểm của Tokyo.',
            views: 15000,
            likes: 1200,
            chapters: 24,
            lastUpdate: '2024-03-15',
            addedDate: '2024-02-01'
        },
        {
            id: 2,
            title: 'Jujutsu Kaisen',
            cover: './image/jujutsu-kaisen-rotated.jpg',
            author: 'Gege Akutami',
            genre: 'Hành động, Siêu nhiên',
            description: 'Câu chuyện về Yuji Itadori, một học sinh trung học có sức mạnh thể chất phi thường. Sau khi gặp Megumi Fushiguro, anh bị cuốn vào thế giới của các pháp sư và lời nguyền.',
            views: 25000,
            likes: 2100,
            chapters: 36,
            lastUpdate: '2024-03-10',
            addedDate: '2024-01-15'
        },
        {
            id: 3,
            title: 'Tháng 4 Là Lời Nói Dối Của Em',
            cover: './image/hinh-nen-anime-3.jpg',
            author: 'Naoshi Arakawa',
            genre: 'Tình cảm, Âm nhạc',
            description: 'Câu chuyện về Kousei Arima, một thần đồng piano đã từ bỏ âm nhạc sau cái chết của mẹ. Cuộc gặp gỡ với Kaori Miyazono, một nghệ sĩ violin đầy nhiệt huyết, đã thay đổi cuộc đời anh.',
            views: 18000,
            likes: 1500,
            chapters: 22,
            lastUpdate: '2024-03-20',
            addedDate: '2024-02-15'
        }
    ];

    // Hiển thị truyện yêu thích
    function displayFavorites(favorites) {
        const grid = document.querySelector('.favorites-grid');
        grid.innerHTML = '';

        favorites.forEach(novel => {
            const novelElement = createNovelElement(novel);
            grid.appendChild(novelElement);
        });
    }

    // Tạo element cho truyện
    function createNovelElement(novel) {
        const div = document.createElement('div');
        div.className = 'novel-item';
        
        div.innerHTML = `
            <div class="novel-cover">
                <img src="${novel.cover}" alt="${novel.title}">
            </div>
            <div class="novel-info">
                <div>
                    <h3>${novel.title}</h3>
                    <div class="novel-meta">
                        <span><i class="fas fa-user"></i> ${novel.author}</span>
                        <span><i class="fas fa-tag"></i> ${novel.genre}</span>
                        <span><i class="fas fa-eye"></i> ${novel.views}</span>
                        <span><i class="fas fa-heart"></i> ${novel.likes}</span>
                    </div>
                    <p class="novel-description">${novel.description}</p>
                </div>
                <div class="novel-actions">
                    <button onclick="readNovel(${novel.id})">
                        <i class="fas fa-book-open"></i> Đọc truyện
                    </button>
                    <button class="remove" onclick="removeFavorite(${novel.id})">
                        <i class="fas fa-heart-broken"></i> Bỏ yêu thích
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
        const filteredNovels = sampleFavorites.filter(novel => 
            novel.title.toLowerCase().includes(searchTerm) ||
            novel.author.toLowerCase().includes(searchTerm) ||
            novel.genre.toLowerCase().includes(searchTerm)
        );
        displayFavorites(filteredNovels);
    });

    // Xử lý sắp xếp
    const sortFilter = document.getElementById('sort-filter');
    sortFilter.addEventListener('change', function() {
        const sortBy = this.value;
        const sortedNovels = [...sampleFavorites].sort((a, b) => {
            switch(sortBy) {
                case 'latest':
                    return new Date(b.lastUpdate) - new Date(a.lastUpdate);
                case 'added':
                    return new Date(b.addedDate) - new Date(a.addedDate);
                case 'name':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        displayFavorites(sortedNovels);
    });

    // Xử lý chế độ xem
    const viewFilter = document.getElementById('view-filter');
    viewFilter.addEventListener('change', function() {
        const grid = document.querySelector('.favorites-grid');
        grid.classList.toggle('list-view', this.value === 'list');
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

    // Hiển thị truyện yêu thích ban đầu
    displayFavorites(sampleFavorites);
    updatePagination();
});

// Các hàm xử lý truyện
function readNovel(id) {
    // TODO: Chuyển hướng đến trang đọc truyện
    console.log('Read novel:', id);
}

function removeFavorite(id) {
    if (confirm('Bạn có chắc chắn muốn bỏ yêu thích truyện này?')) {
        // TODO: Xóa truyện khỏi danh sách yêu thích
        console.log('Remove favorite:', id);
    }
} 
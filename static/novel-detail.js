document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const followBtn = document.querySelector('.follow-btn');
    const shareBtn = document.querySelector('.share-btn');
    const sortChapters = document.getElementById('sortChapters');
    const chapterSearch = document.querySelector('.chapter-filters input');
    const chaptersGrid = document.querySelector('.chapters-grid');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const pageInfo = document.querySelector('.page-info');
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    const relatedNovelsGrid = document.querySelector('.related-novels .novels-grid');
    const searchInput = document.querySelector('.nav-right input');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const urlParams = new URLSearchParams(window.location.search);
    const novelId = urlParams.get('id');

    // Sample data
    const novelData = {
        title: "Không Tiền Tu Cái Gì Tiên",
        author: "Hùng Lang Cẩu",
        cover: "./image/novel4.jpg",
        views: 150000,
        rating: 4.5,
        follows: 5000,
        tags: ["Tiên Hiệp", "Kiếm Hiệp", "Huyền Huyễn"],
        status: "Đang Ra",
        description: "Trương Vũ hừ lạnh một tiếng, tắt đi quảng cáo phía trên.",
        creation: {
            author: "Nguyễn Văn A",
            publishDate: "01/01/2024",
            updateDate: "15/03/2024",
            totalChapters: 150
        },
        chapters: [
            { id: 1, title: "Chương 1: Khởi Đầu", date: "01/01/2024" },
            { id: 2, title: "Chương 2: Hành Trình", date: "02/01/2024" },
            { id: 3, title: "Chương 3: Thử Thách", date: "03/01/2024" }
        ],
        comments: [
            { user: "User1", content: "Truyện hay quá!", date: "10/03/2024" },
            { user: "User2", content: "Cốt truyện hấp dẫn!", date: "11/03/2024" }
        ],
        relatedNovels: [
            { title: "Truyện Liên Quan 1", author: "Tác Giả 1", cover: "./image/novel2.jpg", rating: 4.2 },
            { title: "Truyện Liên Quan 2", author: "Tác Giả 2", cover: "./image/novel3.jpg", rating: 4.0 },
            { title: "Truyện Liên Quan 3", author: "Tác Giả 3", cover: "./image/novel4.jpg", rating: 4.5 },
            { title: "Truyện Liên Quan 4", author: "Tác Giả 4", cover: "./image/novel5.jpg", rating: 4.3 }
        ]
    };

    // Pagination
    let currentPage = 1;
    const itemsPerPage = 12;
    const totalPages = Math.ceil(novelData.chapters.length / itemsPerPage);

    // Display chapters
    function displayChapters(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageChapters = novelData.chapters.slice(start, end);

        chaptersGrid.innerHTML = pageChapters.map(chapter => `
            <a href="read.html?novel=${encodeURIComponent(novelData.title)}&chapter=${chapter.id}" class="chapter-item">
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-date">${chapter.date}</span>
            </a>
        `).join('');

        // Update pagination
        pageInfo.textContent = `Trang ${page}/${totalPages}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === totalPages;
    }

    // Initialize chapters
    displayChapters(currentPage);

    // Pagination controls
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayChapters(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayChapters(currentPage);
        }
    });

    // Sort chapters
    sortChapters.addEventListener('change', function() {
        const order = this.value;
        novelData.chapters.sort((a, b) => {
            if (order === 'asc') {
                return a.id - b.id;
            } else {
                return b.id - a.id;
            }
        });
        currentPage = 1;
        displayChapters(currentPage);
    });

    // Search chapters
    chapterSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredChapters = novelData.chapters.filter(chapter => 
            chapter.title.toLowerCase().includes(query) ||
            chapter.date.toLowerCase().includes(query)
        );
        chaptersGrid.innerHTML = filteredChapters.map(chapter => `
            <a href="read.html?novel=${encodeURIComponent(novelData.title)}&chapter=${chapter.id}" class="chapter-item">
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-date">${chapter.date}</span>
            </a>
        `).join('');
    });

    // Follow button
    followBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.replace('far', 'fas');
            this.innerHTML = '<i class="fas fa-heart"></i> Đã theo dõi';
        } else {
            icon.classList.replace('fas', 'far');
            this.innerHTML = '<i class="far fa-heart"></i> Theo dõi';
        }
    });

    // Share button
    shareBtn.addEventListener('click', function() {
        // Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: 'Tên Truyện',
                text: 'Đọc truyện hay tại Trang Đọc Truyện',
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('Link đã được sao chép!');
        }
    });

    // Comments
    function displayComments() {
        commentsList.innerHTML = novelData.comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-user">${comment.user}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <p class="comment-content">${comment.content}</p>
            </div>
        `).join('');
    }

    displayComments();

    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const textarea = this.querySelector('textarea');
        const content = textarea.value.trim();
        
        if (content) {
            const newComment = {
                user: 'Current User',
                content: content,
                date: 'Vừa xong'
            };
            novelData.comments.unshift(newComment);
            displayComments();
            textarea.value = '';
        }
    });

    // Related novels
    function displayRelatedNovels() {
        relatedNovelsGrid.innerHTML = novelData.relatedNovels.map(novel => `
            <div class="novel-item">
                <img src="${novel.cover}" alt="${novel.title}">
                <div class="novel-info">
                    <h3>${novel.title}</h3>
                    <p class="author">${novel.author}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${novel.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayRelatedNovels();

    // Search functionality
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Dark mode handling
    function initDarkMode() {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const icon = darkModeToggle.querySelector('i');
        
        // Check for saved dark mode preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        // Apply dark mode if it was previously enabled
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.toggle('dark-mode');
            
            // Update icon
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
            
            // Save preference
            localStorage.setItem('darkMode', isDark);
        });
    }

    // Initialize dark mode
    initDarkMode();

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        document.querySelector('.nav-left').classList.toggle('active');
    });

    // Update novel info
    document.querySelector('.novel-title').textContent = novelData.title;
    document.querySelector('.novel-cover img').src = novelData.cover;
    document.querySelector('.novel-cover img').alt = novelData.title;
    document.querySelector('.author').textContent = novelData.author;
    document.querySelector('.views').textContent = formatNumber(novelData.views);
    document.querySelector('.rating').textContent = novelData.rating;
    document.querySelector('.follows').textContent = formatNumber(novelData.follows);
    document.querySelector('.status').textContent = novelData.status;
    document.querySelector('.description p').textContent = novelData.description;

    // Update creation info
    document.querySelector('.creation-item:nth-child(1) .creation-detail p').textContent = novelData.creation.author;
    document.querySelector('.creation-item:nth-child(2) .creation-detail p').textContent = novelData.creation.publishDate;
    document.querySelector('.creation-item:nth-child(3) .creation-detail p').textContent = novelData.creation.updateDate;
    document.querySelector('.creation-item:nth-child(4) .creation-detail p').textContent = `${novelData.creation.totalChapters} chương`;

    // Update tags
    const tagsContainer = document.querySelector('.tags');
    tagsContainer.innerHTML = novelData.tags.map(tag => `<span>${tag}</span>`).join('');

    // Display chapters
    const chaptersList = document.querySelector('.chapters-list');
    chaptersList.innerHTML = novelData.chapters.map(chapter => `
        <div class="chapter-item">
            <a href="read.html?novel=${encodeURIComponent(novelData.title)}&chapter=${chapter.id}">
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-date">${chapter.date}</span>
            </a>
        </div>
    `).join('');

    // Display comments
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = novelData.comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-user">${comment.user}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <p class="comment-content">${comment.content}</p>
        </div>
    `).join('');

    // Display related novels
    const relatedNovelsGrid = document.querySelector('.novels-grid');
    relatedNovelsGrid.innerHTML = novelData.relatedNovels.map(novel => `
        <div class="novel-item">
            <img src="${novel.cover}" alt="${novel.title}">
            <div class="novel-info">
                <h3>${novel.title}</h3>
                <p class="author">${novel.author}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${novel.rating}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Format number function
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}); 
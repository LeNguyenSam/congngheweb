document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chapterSelect = document.getElementById('chapterSelect');
    const prevChapterBtn = document.querySelector('.prev-chapter');
    const nextChapterBtn = document.querySelector('.next-chapter');
    const chapterContent = document.querySelector('.chapter-content');
    const fontSizeBtns = document.querySelectorAll('.font-size-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    const searchInput = document.querySelector('.nav-right input');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

    // Sample chapter data
    const chapters = [
        {
            id: 1,
            title: 'Chương 1: Khởi đầu mới',
            content: `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            `
        },
        {
            id: 2,
            title: 'Chương 2: Gặp gỡ',
            content: `
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                
                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            `
        },
        {
            id: 3,
            title: 'Chương 3: Tu luyện',
            content: `
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
                
                <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
            `
        }
    ];

    // Sample comments data
    const comments = [
        {
            id: 1,
            user: 'User1',
            content: 'Truyện hay quá, mong tác giả ra chương mới sớm!',
            time: '2 giờ trước'
        },
        {
            id: 2,
            user: 'User2',
            content: 'Cốt truyện thú vị, nhân vật được xây dựng tốt.',
            time: '5 giờ trước'
        }
    ];

    // Current chapter index
    let currentChapterIndex = 0;

    // Load chapter content
    function loadChapter(index) {
        const chapter = chapters[index];
        chapterContent.innerHTML = chapter.content;
        chapterSelect.value = chapter.id;
        
        // Update navigation buttons
        prevChapterBtn.disabled = index === 0;
        nextChapterBtn.disabled = index === chapters.length - 1;
    }

    // Initialize chapter
    loadChapter(currentChapterIndex);

    // Chapter navigation
    chapterSelect.addEventListener('change', function() {
        currentChapterIndex = parseInt(this.value) - 1;
        loadChapter(currentChapterIndex);
    });

    prevChapterBtn.addEventListener('click', function() {
        if (currentChapterIndex > 0) {
            currentChapterIndex--;
            loadChapter(currentChapterIndex);
        }
    });

    nextChapterBtn.addEventListener('click', function() {
        if (currentChapterIndex < chapters.length - 1) {
            currentChapterIndex++;
            loadChapter(currentChapterIndex);
        }
    });

    // Font size controls
    let currentFontSize = 16;
    const minFontSize = 12;
    const maxFontSize = 24;

    fontSizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            if (action === 'increase' && currentFontSize < maxFontSize) {
                currentFontSize += 2;
            } else if (action === 'decrease' && currentFontSize > minFontSize) {
                currentFontSize -= 2;
            }
            chapterContent.style.fontSize = `${currentFontSize}px`;
        });
    });

    // Theme controls
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.body.className = theme === 'dark' ? 'dark-mode' : '';
            if (theme === 'sepia') {
                document.body.style.backgroundColor = '#f4ecd8';
                chapterContent.style.color = '#5b4636';
            } else {
                document.body.style.backgroundColor = '';
                chapterContent.style.color = '';
            }
        });
    });

    // Comments
    function displayComments() {
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-user">${comment.user}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
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
                id: comments.length + 1,
                user: 'Current User',
                content: content,
                time: 'Vừa xong'
            };
            comments.unshift(newComment);
            displayComments();
            textarea.value = '';
        }
    });

    // Search functionality
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        document.querySelector('.nav-left').classList.toggle('active');
    });
}); 
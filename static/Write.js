let autoSaveInterval;
        const AUTO_SAVE_DELAY = 30000; // 30 seconds

        function initializeEditor() {
            loadDraft();
            setupAutoSave();
            setupWordCount();
        }

        function setupAutoSave() {
            autoSaveInterval = setInterval(saveDraft, AUTO_SAVE_DELAY);
        }

        function setupWordCount() {
            const textarea = document.getElementById('chapterContent');
            textarea.addEventListener('input', updateWordCount);
        }

        function updateWordCount() {
            const content = document.getElementById('chapterContent').value;
            const wordCount = content.trim().split(/\s+/).length;
            document.getElementById('wordCount').textContent = wordCount;
        }

        function loadDraft() {
            const draft = localStorage.getItem('draft');
            if (draft) {
                const { title, content } = JSON.parse(draft);
                document.getElementById('chapterTitle').value = title || '';
                document.getElementById('chapterContent').value = content || '';
                updateWordCount();
            }
        }

        function togglePreview() {
            const previewSection = document.getElementById('previewSection');
            const content = document.getElementById('chapterContent').value;
            document.getElementById('previewContent').innerHTML = content;
            previewSection.style.display = previewSection.style.display === 'none' ? 'block' : 'none';
        }

        function submitChapter() {
            const title = document.querySelector('input[type="text"]').value.trim();
            const content = document.getElementById('chapterContent').value.trim();

            if (!title || !content) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            // Lưu dữ liệu chương vào localStorage
            const storyId = localStorage.getItem('newStory') 
                ? JSON.parse(localStorage.getItem('newStory')).id 
                : Date.now(); // Sử dụng timestamp làm ID tạm thời nếu không có storyId
            const chapterData = {
                storyId,
                title,
                content,
                timestamp: new Date().toISOString()
            };
            const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
            chapters.push(chapterData);
            localStorage.setItem('chapters', JSON.stringify(chapters));

            // Xóa nháp sau khi đăng
            localStorage.removeItem('draft');

            // Chuyển hướng đến index.html
            window.location.href = 'index.html';
        }

        function saveDraft() {
            const title = document.querySelector('input[type="text"]').value;
            const content = document.getElementById('chapterContent').value;
            localStorage.setItem('draft', JSON.stringify({title, content}));
            alert('Đã lưu nháp!');
        }

        window.addEventListener('load', initializeEditor);
        window.addEventListener('beforeunload', (e) => {
            saveDraft();
            e.preventDefault();
            e.returnValue = '';
        });
let autoSaveInterval;
const AUTO_SAVE_DELAY = 30000; // 30 seconds

function initializeEditor() {
    loadDraft();
    setupAutoSave();
    setupWordCount();
    setupButtonEvents();
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
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
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
    document.getElementById('previewContent').innerHTML = content.replace(/\s*\n\s*/g, '<br>');
    previewSection.style.display = previewSection.style.display === 'none' ? 'block' : 'none';
}

function submitChapter() {
    const novel_id = localStorage.getItem('novel_id');
    const title = document.getElementById('chapterTitle').value.trim();
    const content = document.getElementById('chapterContent').value.trim();

    if (!title || !content) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    if (!novel_id) {
        alert('Không tìm thấy ID truyện. Vui lòng tạo truyện trước!');
        return;
    }

    fetch('/submit-chapter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ novel_id, title, content })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            localStorage.removeItem('draft');
            localStorage.removeItem('novel_id');
            window.location.href = 'index.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error submitting chapter:', error);
        alert('Lỗi khi gửi chương!');
    });
}

function saveDraft() {
    const title = document.getElementById('chapterTitle').value;
    const content = document.getElementById('chapterContent').value;
    localStorage.setItem('draft', JSON.stringify({ title, content }));
    const autosaveIndicator = document.getElementById('autosaveIndicator');
    autosaveIndicator.style.display = 'block';
    setTimeout(() => {
        autosaveIndicator.style.display = 'none';
    }, 2000);
}

function setupButtonEvents() {
    document.querySelector('.submit').addEventListener('click', submitChapter);
    document.querySelector('.save').addEventListener('click', saveDraft);
    document.querySelector('.preview').addEventListener('click', togglePreview);
}

window.addEventListener('load', initializeEditor);
window.addEventListener('beforeunload', (e) => {
    saveDraft();
    e.preventDefault();
    e.returnValue = '';
});
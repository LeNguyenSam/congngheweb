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
    document.getElementById('previewContent').innerHTML = content.replace(/\n/g, '<br>');
    previewSection.style.display = previewSection.style.display === 'none' ? 'block' : 'none';
}

function submitChapter() {
    const title = document.getElementById('chapterTitle').value.trim();
    const content = document.getElementById('chapterContent').value.trim();

    if (!title || !content) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const storyId = localStorage.getItem('newStory') 
        ? JSON.parse(localStorage.getItem('newStory')).id 
        : Date.now();
    const chapterData = {
        storyId,
        title,
        content,
        timestamp: new Date().toISOString()
    };
    const chapters = JSON.parse(localStorage.getItem('chapters') || '[]');
    chapters.push(chapterData);
    localStorage.setItem('chapters', JSON.stringify(chapters));

    localStorage.removeItem('draft');
    window.location.href = 'index.html';
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
}

window.addEventListener('load', initializeEditor);
window.addEventListener('beforeunload', (e) => {
    saveDraft();
    e.preventDefault();
    e.returnValue = '';
});
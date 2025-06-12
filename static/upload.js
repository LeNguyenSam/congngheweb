const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

function previewImage(event) {
    const file = event.target.files[0];
    if (!validateImage(file)) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
}

function validateImage(file) {
    if (!file) return false;
    
    if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF');
        return false;
    }
    
    if (file.size > MAX_FILE_SIZE) {
        alert('Kích thước file không được vượt quá 5MB');
        return false;
    }
    
    return true;
}

document.getElementById('addStoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = this.querySelector('input[type="text"]').value.trim();
    const description = this.querySelector('textarea').value.trim();
    const tags = Array.from(this.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value);
    const image = document.getElementById('imageInput').files[0];

    // Validate form
    if (title.length < 5) {
        alert('Tiêu đề phải có ít nhất 5 ký tự');
        return;
    }
    
    if (description.length < 20) {
        alert('Mô tả phải có ít nhất 20 ký tự');
        return;
    }
    
    if (tags.length === 0) {
        alert('Vui lòng chọn ít nhất một thể loại');
        return;
    }
    
    if (!image || !validateImage(image)) {
        alert('Vui lòng chọn ảnh bìa hợp lệ');
        return;
    }

    // Prepare form data for server
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));
    formData.append('image', image);

    // Send data to server with debug logging
    console.log('Sending form data:', { title, description, tags, image: image.name });
    fetch('/upload-story', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            localStorage.setItem('novel_id', data.novel_id);
            window.location.href = 'Write.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error submitting story:', error);
        alert('Lỗi khi gửi dữ liệu truyện!');
    });
});

document.querySelector('.cancel').addEventListener('click', function() {
    if (confirm('Bạn có chắc muốn hủy không?')) {
        window.location.href = 'index.html';
    }
});
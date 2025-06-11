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

            // Lưu dữ liệu vào localStorage và chuyển hướng
            const storyData = {
                title: title,
                description: description,
                tags: tags,
                image: image.name // Lưu tên file, vì nội dung file không thể lưu trực tiếp
            };
            localStorage.setItem('newStory', JSON.stringify(storyData));
            window.location.href = 'Write.html';
        });

        document.querySelector('.cancel').addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn hủy không?')) {
                window.location.href = 'index.html';
            }
        });
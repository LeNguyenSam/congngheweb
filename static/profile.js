document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Load thông tin người dùng
    loadUserInfo();

    // Xử lý chuyển tab
    const menuLinks = document.querySelectorAll('.profile-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Cập nhật active state cho menu
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Ẩn tất cả các section
            document.querySelectorAll('.profile-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Hiển thị section được chọn
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Xử lý upload avatar
    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarUploadBtn = document.getElementById('avatar-upload-btn');

    // Hiển thị avatar hiện tại
    if (user.avatar) {
        avatarPreview.src = user.avatar;
        // Cập nhật avatar trong navigation
        document.querySelector('.user-avatar img').src = user.avatar;
    }

    avatarUploadBtn.addEventListener('click', function() {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                showNotification('Vui lòng chọn file ảnh hợp lệ', 'error');
                return;
            }

            // Kiểm tra kích thước file (giới hạn 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Kích thước ảnh không được vượt quá 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                
                // Cập nhật preview
                avatarPreview.src = imageUrl;
                
                // Cập nhật avatar trong navigation
                document.querySelector('.user-avatar img').src = imageUrl;
                
                // Lưu vào localStorage
                user.avatar = imageUrl;
                localStorage.setItem('user', JSON.stringify(user));
                
                showNotification('Cập nhật avatar thành công!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // Xử lý form thông tin cá nhân
    const personalInfoForm = document.getElementById('personal-info-form');
    personalInfoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const bio = document.getElementById('bio').value;
        
        // Cập nhật thông tin
        user.username = username;
        user.email = email;
        user.bio = bio;
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        showNotification('Cập nhật thông tin thành công!', 'success');
    });

    // Xử lý form đổi mật khẩu
    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Kiểm tra mật khẩu hiện tại
        if (currentPassword !== user.password) {
            showNotification('Mật khẩu hiện tại không đúng!', 'error');
            return;
        }
        
        // Kiểm tra mật khẩu mới
        if (newPassword !== confirmPassword) {
            showNotification('Mật khẩu mới không khớp!', 'error');
            return;
        }
        
        // Cập nhật mật khẩu
        user.password = newPassword;
        localStorage.setItem('user', JSON.stringify(user));
        
        showNotification('Đổi mật khẩu thành công!', 'success');
        passwordForm.reset();
    });

    // Xử lý cài đặt thông báo
    const notificationSettings = document.querySelectorAll('.notification-item input[type="checkbox"]');
    notificationSettings.forEach(setting => {
        setting.addEventListener('change', function() {
            const settingName = this.id;
            user.notifications = user.notifications || {};
            user.notifications[settingName] = this.checked;
            localStorage.setItem('user', JSON.stringify(user));
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

    // Xử lý ngôn ngữ
    const languageSelect = document.getElementById('language');
    languageSelect.addEventListener('change', function() {
        const language = this.value;
        localStorage.setItem('language', language);
        showNotification('Vui lòng tải lại trang để áp dụng thay đổi ngôn ngữ', 'info');
    });

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});

// Hàm load thông tin người dùng
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').value = user.username || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('bio').value = user.bio || '';
        
        // Load cài đặt thông báo
        if (user.notifications) {
            Object.keys(user.notifications).forEach(key => {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    checkbox.checked = user.notifications[key];
                }
            });
        }
        
        // Load ngôn ngữ
        const language = localStorage.getItem('language') || 'vi';
        document.getElementById('language').value = language;
    }
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 
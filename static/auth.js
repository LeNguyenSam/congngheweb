document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${target}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            const icon = button.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Form validation and submission
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const remember = this.querySelector('input[type="checkbox"]').checked;

        if (!username || !password) {
            showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        fetch('/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSuccess('Đăng nhập thành công!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError(data.message || 'Đăng nhập thất bại!');
            }
        })
        .catch(error => {
            showError('Có lỗi xảy ra, vui lòng thử lại!');
            console.error('Fetch error:', error);
        });
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        const agreeTerms = this.querySelector('input[type="checkbox"]').checked;

        if (!username || !email || !password || !confirmPassword) {
            showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            showError('Mật khẩu không khớp');
            return;
        }

        if (!agreeTerms) {
            showError('Vui lòng đồng ý với điều khoản sử dụng');
            return;
        }

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSuccess('Đăng ký thành công!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError(data.message || 'Đăng ký thất bại!');
            }
        })
        .catch(error => {
            showError('Có lỗi xảy ra, vui lòng thử lại!');
            console.error('Fetch error:', error);
        });
    });

    // Forgot password handler
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value?.trim() || '';
        if (!email) {
            showError('Vui lòng nhập email của bạn');
            return;
        }
        fetch('/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSuccess('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn');
            } else {
                showError(data.message || 'Gửi yêu cầu thất bại!');
            }
        })
        .catch(error => {
            showError('Có lỗi xảy ra, vui lòng thử lại!');
            console.error('Fetch error:', error);
        });
    });

    // Social login handlers
    const googleBtn = document.querySelector('.social-btn.google');
    const facebookBtn = document.querySelector('.social-btn.facebook');

    googleBtn.addEventListener('click', () => {
        console.log('Google login clicked');
        showSuccess('Đang chuyển hướng đến Google...');
    });

    facebookBtn.addEventListener('click', () => {
        console.log('Facebook login clicked');
        showSuccess('Đang chuyển hướng đến Facebook...');
    });

    // Utility functions for showing messages
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #51cf66;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    }

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        const darkModeIcon = darkModeToggle.querySelector('i');
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            if (isDarkMode) {
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            } else {
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
            }
        });
    }
});
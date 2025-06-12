document.addEventListener('DOMContentLoaded', function() {
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

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Check for username in URL parameters to auto-fill after registration
    const urlParams = new URLSearchParams(window.location.search);
    const registeredUsername = urlParams.get('username');
    if (registeredUsername) {
        const usernameInput = document.getElementById('login-username');
        if (usernameInput) {
            usernameInput.value = registeredUsername;
        }
        // Switch to login tab
        const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
        if (loginTab) {
            loginTab.click();
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const remember = this.querySelector('input[type="checkbox"]').checked;

            if (!username || !password) {
                showError('Vui lòng điền đầy đủ thông tin');
                return;
            }

            console.log('Sending login request for username:', username);
            fetch('/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            })
            .then(response => {
                console.log('Login response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Login response data:', data);
                if (data.success) {
                    showSuccess(data.message || 'Đăng nhập thành công!');
                    setTimeout(() => {
                        console.log('Redirecting to /index');
                        window.location.href = '/index';
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
    }

    if (registerForm) {
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

            console.log('Sending register request for username:', username);
            fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            })
            .then(response => {
                console.log('Register response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Register response data:', data);
                if (data.success) {
                    showSuccess(data.message || 'Đăng ký thành công!');
                    setTimeout(() => {
                        console.log('Redirecting to login with username');
                        window.location.href = data.redirect || `/?username=${encodeURIComponent(username)}`;
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
    }

    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value?.trim() || '';
            if (!email) {
                showError('Vui lòng nhập email của bạn');
                return;
            }
            console.log('Sending forgot-password request for email:', email);
            fetch('/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include'
            })
            .then(response => {
                console.log('Forgot-password response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Forgot-password response data:', data);
                if (data.success) {
                    showSuccess(data.message || 'Yêu cầu đặt lại mật khẩu đã được gửi!');
                } else {
                    showError(data.message || 'Gửi yêu cầu thất bại!');
                }
            })
            .catch(error => {
                showError('Có lỗi xảy ra, vui lòng thử lại!');
                console.error('Fetch error:', error);
            });
        });
    }

    const googleBtn = document.querySelector('.social-btn.google');
    const facebookBtn = document.querySelector('.social-btn.facebook');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            console.log('Google login clicked');
            showSuccess('Đang chuyển hướng đến Google...');
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            console.log('Facebook login clicked');
            showSuccess('Đang chuyển hướng đến Facebook...');
        });
    }

    function showError(message) {
        console.log('Showing error:', message);
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
        console.log('Showing success:', message);
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
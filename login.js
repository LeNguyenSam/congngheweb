const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'novel_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
    console.log('Connected to MySQL database');
});

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
    console.log('Serving auth.html');
    response.sendFile(path.join(__dirname, 'auth.html'));
});

app.get('/index', function(request, response) {
    console.log('Accessing /index, loggedin:', request.session.loggedin);
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, 'static/index.html'));
    } else {
        response.redirect('/');
    }
});

app.get('/upload', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, 'upload.html'));
    } else {
        response.redirect('/');
    }
});

app.get('/write', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, 'Write.html'));
    } else {
        response.redirect('/');
    }
});

app.post('/auth', async function(request, response) {
    const { username, password } = request.body;
    console.log('Login attempt for username:', username);
    if (!username || !password) {
        console.log('Missing username or password');
        return response.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        connection.query('SELECT * FROM USER WHERE username = ?', [username], function(error, results) {
            if (error) {
                console.error('Database query error:', error);
                return response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
            }
            if (results.length === 0) {
                console.log('Username not found:', username);
                return response.json({ success: false, message: 'Tên người dùng không tồn tại!' });
            }

            const user = results[0];
            console.log('Found user:', user.username);
            if (password === user.password) {
                console.log('Password match, setting session for:', username);
                request.session.loggedin = true;
                request.session.username = username;
                response.json({ success: true, message: 'Đăng nhập thành công!' });
            } else {
                console.log('Password mismatch for:', username);
                response.json({ success: false, message: 'Mật khẩu không đúng!' });
            }
        });
    } catch (error) {
        console.error('Authentication error:', error);
        response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
    }
});

app.post('/register', async function(request, response) {
    const { username, email, password } = request.body;
    if (!username || !email || !password) {
        return response.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        connection.query('SELECT * FROM USER WHERE username = ? OR email = ?', [username, email], function(error, results) {
            if (error) {
                console.error('Database query error:', error);
                return response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
            }
            if (results.length > 0) {
                const existingField = results[0].username === username ? 'Tên người dùng' : 'Email';
                return response.json({ success: false, message: `${existingField} đã được sử dụng!` });
            }

            connection.query('INSERT INTO USER (username, email, password) VALUES (?, ?, ?)', [username, email, password], function(error, results) {
                if (error) {
                    console.error('Database insert error:', error);
                    return response.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu dữ liệu: ' + error.message });
                }
                response.json({ success: true, message: 'Đăng ký thành công!', redirect: `/?username=${encodeURIComponent(username)}` });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
    }
});

app.post('/forgot-password', function(request, response) {
    const { email } = request.body;
    if (!email) {
        return response.status(400).json({ success: false, message: 'Vui lòng nhập email!' });
    }
    connection.query('SELECT * FROM USER WHERE email = ?', [email], function(error, results) {
        if (error) {
            console.error('Database query error:', error);
            return response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
        }
        if (results.length > 0) {
            response.json({ success: true, message: 'Yêu cầu đặt lại mật khẩu đã được gửi!' });
        } else {
            response.json({ success: false, message: 'Email không tồn tại!' });
        }
    });
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(3000, () => {
    
});
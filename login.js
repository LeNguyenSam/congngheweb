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

// Kiểm tra kết nối cơ sở dữ liệu
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
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'auth.html'));
});

// http://localhost:3000/upload
app.get('/upload', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, 'upload.html'));
    } else {
        response.redirect('/');
    }
});

// http://localhost:3000/write
app.get('/write', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(path.join(__dirname, 'Write.html'));
    } else {
        response.redirect('/');
    }
});

// http://localhost:3000/auth (Đăng nhập)
app.post('/auth', function(request, response) {
    const { username, password } = request.body;
    if (!username || !password) {
        return response.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    connection.query('SELECT * FROM USER WHERE username = ? AND password = ?', [username, password], function(error, results) {
        if (error) {
            console.error('Database query error:', error);
            return response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
        }
        if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = username;
            response.json({ success: true, message: 'Đăng nhập thành công!' });
        } else {
            response.json({ success: false, message: 'Tên người dùng hoặc mật khẩu không đúng!' });
        }
    });
});

// http://localhost:3000/register (Đăng ký)
app.post('/register', function(request, response) {
    const { username, email, password } = request.body;
    if (!username || !email || !password) {
        return response.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    connection.query('SELECT * FROM USER WHERE username = ? OR email = ?', [username, email], function(error, results) {
        if (error) {
            console.error('Database query error:', error);
            return response.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
        }
        if (results.length > 0) {
            const existingField = results[0].username === username ? 'Tên người dùng' : 'Email';
            return response.status(400).json({ success: false, message: `${existingField} đã được sử dụng!` });
        }

        // Thực hiện chèn dữ liệu
        connection.query('INSERT INTO USER (username, email, password) VALUES (?, ?, ?)', [username, email, password], function(error, results) {
            if (error) {
                console.error('Database insert error:', error);
                return response.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu dữ liệu: ' + error.message });
            }
            response.json({ success: true, message: 'Đăng ký thành công!' });
        });
    });
});

// http://localhost:3000/forgot-password (Quên mật khẩu)
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

// http://localhost:3000/home
app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
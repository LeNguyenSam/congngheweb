const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

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

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'static/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory:', uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, PNG, or GIF files are allowed'));
        }
    }
});

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
            console.log('Found user:', user.username, 'with user_id:', user.user_id);
            if (password === user.password) {
                console.log('Password match, setting session for:', username);
                request.session.loggedin = true;
                request.session.username = username;
                request.session.user_id = user.user_id;
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

app.post('/upload-story', upload.single('image'), function(request, response) {
    console.log('Received upload request:', request.body);
    console.log('File:', request.file);
    if (!request.session.loggedin) {
        return response.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
    }

    const { title, description, tags } = request.body;
    const image = request.file ? `/uploads/${request.file.filename}` : null;

    if (!title || title.length < 5) {
        return response.status(400).json({ success: false, message: 'Tiêu đề phải có ít nhất 5 ký tự!' });
    }
    if (!description || description.length < 20) {
        return response.status(400).json({ success: false, message: 'Mô tả phải có ít nhất 20 ký tự!' });
    }
    if (!tags || !Array.isArray(JSON.parse(tags)) || JSON.parse(tags).length === 0) {
        return response.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất một thể loại!' });
    }
    if (!image) {
        return response.status(400).json({ success: false, message: 'Vui lòng chọn ảnh bìa hợp lệ!' });
    }

    const user_id = request.session.user_id;
    const status = 'ongoing';

    connection.query(
        'INSERT INTO NOVEL (title, description, cover_image, status, user_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, image, status, user_id],
        function(error, results) {
            if (error) {
                console.error('Error inserting novel:', error);
                return response.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu truyện: ' + error.message });
            }

            const novel_id = results.insertId;
            const tagArray = JSON.parse(tags);
            const categoryQueries = tagArray.map(tag => {
                return new Promise((resolve, reject) => {
                    connection.query(
                        'SELECT category_id FROM CATEGORY WHERE name = ?',
                        [tag],
                        function(error, results) {
                            if (error) return reject(error);
                            if (results.length === 0) {
                                connection.query(
                                    'INSERT INTO CATEGORY (name) VALUES (?)',
                                    [tag],
                                    function(error, result) {
                                        if (error) return reject(error);
                                        resolve({ novel_id, category_id: result.insertId });
                                    }
                                );
                            } else {
                                resolve({ novel_id, category_id: results[0].category_id });
                            }
                        }
                    );
                });
            });

            Promise.all(categoryQueries)
                .then(categories => {
                    const insertCategoryQueries = categories.map(({ novel_id, category_id }) => {
                        return new Promise((resolve, reject) => {
                            connection.query(
                                'INSERT INTO NOVEL_CATEGORY (novel_id, category_id) VALUES (?, ?)',
                                [novel_id, category_id],
                                function(error) {
                                    if (error) return reject(error);
                                    resolve();
                                }
                            );
                        });
                    });
                    return Promise.all(insertCategoryQueries);
                })
                .then(() => {
                    response.json({ success: true, message: 'Lưu truyện thành công!', novel_id });
                })
                .catch(error => {
                    console.error('Error inserting categories:', error);
                    connection.query('DELETE FROM NOVEL WHERE novel_id = ?', [novel_id], function(delErr) {
                        if (delErr) console.error('Error rolling back novel:', delErr);
                    });
                    response.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu thể loại: ' + error.message });
                });
        }
    );
});

app.post('/submit-chapter', function(request, response) {
    if (!request.session.loggedin) {
        return response.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục!' });
    }

    const { novel_id, title, content } = request.body;

    if (!title || !content || !novel_id) {
        return response.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    connection.query(
        'SELECT * FROM NOVEL WHERE novel_id = ? AND user_id = ?',
        [novel_id, request.session.user_id],
        function(error, results) {
            if (error) {
                console.error('Error checking novel ownership:', error);
                return response.status(500).json({ success: false, message: 'Lỗi máy chủ!' });
            }
            if (results.length === 0) {
                return response.status(403).json({ success: false, message: 'Bạn không có quyền thêm chương cho truyện này!' });
            }

            connection.query(
                'SELECT MAX(chapter_number) as max_chapter FROM CHAPTER WHERE novel_id = ?',
                [novel_id],
                function(error, results) {
                    if (error) {
                        console.error('Error fetching chapter number:', error);
                        return response.status(500).json({ success: false, message: 'Lỗi máy chủ!' });
                    }

                    const chapter_number = (results[0].max_chapter || 0) + 1;
                    connection.query(
                        'INSERT INTO CHAPTER (novel_id, title, content, chapter_number) VALUES (?, ?, ?, ?)',
                        [novel_id, title, content, chapter_number],
                        function(error) {
                            if (error) {
                                console.error('Error inserting chapter:', error);
                                return response.status(500).json({ success: false, message: 'Lỗi máy chủ khi lưu chương: ' + error.message });
                            }
                            response.json({ success: true, message: 'Lưu chương thành công!' });
                        }
                    );
                }
            );
        }
    );
});

app.get('/novels', function(request, response) {
    connection.query(
        `SELECT n.novel_id, n.title, n.cover_image, n.description, u.username as author, 
                AVG(r.rating_value) as rating, COUNT(r.rating_id) as views
         FROM NOVEL n
         LEFT JOIN USER u ON n.user_id = u.user_id
         LEFT JOIN RATING r ON n.novel_id = r.novel_id
         GROUP BY n.novel_id
         ORDER BY n.created_at DESC
         LIMIT 8`,
        function(error, results) {
            if (error) {
                console.error('Error fetching novels:', error);
                return response.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách truyện!' });
            }
            response.json({ success: true, novels: results });
        }
    );
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
    console.log('Server running on port 3000');
});
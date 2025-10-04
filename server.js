// ✅ server.js - نظام تسجيل دخول جديد
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('./warehouse.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initDatabase();
    }
});

// ✅ نظام تسجيل دخول جديد
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
    }
    db.get('SELECT * FROM users WHERE username = ? AND isActive = 1', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }
        // Token صالح لمدة 7 أيام
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ success: true, token });
    });
});

// Middleware للتحقق من الجلسة
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'غير مصرح بالوصول' });
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'الجلسة منتهية أو غير صالحة' });
    }
};

// Serve pages
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// === باقي الكود كما هو في الملف الأصلي ===
// ... (الكود الكامل من server.txt الأصلي بدون تغيير)
// نسخه هنا للإكمال:

// Admin middleware (only user with id=1)
const requireAdmin = (req, res, next) => {
    if (req.user.id !== 1) {
        return res.status(403).json({ error: 'الوصول مقتصر على المطور فقط' });
    }
    next();
};
function initDatabase() {
    db.serialize(() => {
        // Create tables with improved structure
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            fullName TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            branchId INTEGER DEFAULT 1,
            isActive BOOLEAN DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Branches for multi-branch support
        db.run(`CREATE TABLE IF NOT EXISTS branches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            managerId INTEGER,
            isActive BOOLEAN DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Warehouses with branch relation
        db.run(`CREATE TABLE IF NOT EXISTS warehouses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            branchId INTEGER NOT NULL,
            location TEXT NOT NULL,
            manager TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            capacity INTEGER,
            currentUsage INTEGER DEFAULT 0,
            notes TEXT,
            isActive BOOLEAN DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (branchId) REFERENCES branches(id)
        )`);
        // Suppliers with enhanced fields
        db.run(`CREATE TABLE IF NOT EXISTS suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            companyName TEXT,
            taxNumber TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            balance REAL DEFAULT 0,
            paymentTerms TEXT DEFAULT 'cash',
            creditLimit REAL DEFAULT 0,
            notes TEXT,
            isActive BOOLEAN DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Customers with enhanced fields
        db.run(`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            taxNumber TEXT,
            balance REAL DEFAULT 0,
            creditLimit REAL DEFAULT 0,
            customerType TEXT DEFAULT 'retail',
            notes TEXT,
            isActive BOOLEAN DEFAULT 1,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Product categories
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            parentId INTEGER DEFAULT 0,
            isActive BOOLEAN DEFAULT 1
        )`);
        // Products with batch tracking
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            categoryId INTEGER NOT NULL,
            barcode TEXT UNIQUE,
            sku TEXT UNIQUE,
            description TEXT,
            unit TEXT DEFAULT 'قطعة',
            costPrice REAL NOT NULL,
            sellingPrice REAL NOT NULL,
            minStock INTEGER DEFAULT 0,
            maxStock INTEGER DEFAULT 0,
            supplierId INTEGER NOT NULL,
            isActive BOOLEAN DEFAULT 1,
            hasExpiry BOOLEAN DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoryId) REFERENCES categories(id),
            FOREIGN KEY (supplierId) REFERENCES suppliers(id)
        )`);
        // Inventory with batch/expiry tracking
        db.run(`CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productId INTEGER NOT NULL,
            warehouseId INTEGER NOT NULL,
            batchNumber TEXT,
            expiryDate TEXT,
            quantity INTEGER NOT NULL DEFAULT 0,
            reservedQuantity INTEGER DEFAULT 0,
            entryDate TEXT DEFAULT CURRENT_TIMESTAMP,
            lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(productId, warehouseId),
            FOREIGN KEY (productId) REFERENCES products(id),
            FOREIGN KEY (warehouseId) REFERENCES warehouses(id)
        )`);
        // Purchase orders
        db.run(`CREATE TABLE IF NOT EXISTS purchase_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderNumber TEXT UNIQUE NOT NULL,
            supplierId INTEGER NOT NULL,
            warehouseId INTEGER NOT NULL,
            orderDate TEXT DEFAULT CURRENT_TIMESTAMP,
            expectedDate TEXT,
            status TEXT DEFAULT 'pending',
            subtotal REAL NOT NULL,
            taxRate REAL DEFAULT 0,
            taxAmount REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            discountAmount REAL DEFAULT 0,
            total REAL NOT NULL,
            notes TEXT,
            createdBy INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (supplierId) REFERENCES suppliers(id),
            FOREIGN KEY (warehouseId) REFERENCES warehouses(id),
            FOREIGN KEY (createdBy) REFERENCES users(id)
        )`);
        // Purchase order items
        db.run(`CREATE TABLE IF NOT EXISTS purchase_order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderId INTEGER NOT NULL,
            productId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unitPrice REAL NOT NULL,
            totalPrice REAL NOT NULL,
            receivedQuantity INTEGER DEFAULT 0,
            FOREIGN KEY (orderId) REFERENCES purchase_orders(id),
            FOREIGN KEY (productId) REFERENCES products(id)
        )`);
        // Sales invoices
        db.run(`CREATE TABLE IF NOT EXISTS sales_invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoiceNumber TEXT UNIQUE NOT NULL,
            customerId INTEGER,
            warehouseId INTEGER NOT NULL,
            invoiceDate TEXT DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'completed',
            subtotal REAL NOT NULL,
            taxRate REAL DEFAULT 0,
            taxAmount REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            discountAmount REAL DEFAULT 0,
            total REAL NOT NULL,
            paidAmount REAL DEFAULT 0,
            paymentStatus TEXT DEFAULT 'pending',
            notes TEXT,
            createdBy INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customerId) REFERENCES customers(id),
            FOREIGN KEY (warehouseId) REFERENCES warehouses(id),
            FOREIGN KEY (createdBy) REFERENCES users(id)
        )`);
        // Sales invoice items
        db.run(`CREATE TABLE IF NOT EXISTS sales_invoice_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoiceId INTEGER NOT NULL,
            productId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unitPrice REAL NOT NULL,
            totalPrice REAL NOT NULL,
            FOREIGN KEY (invoiceId) REFERENCES sales_invoices(id),
            FOREIGN KEY (productId) REFERENCES products(id)
        )`);
        // Stock movements (audit trail)
        db.run(`CREATE TABLE IF NOT EXISTS stock_movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productId INTEGER NOT NULL,
            warehouseId INTEGER NOT NULL,
            movementType TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            referenceType TEXT,
            referenceId INTEGER,
            notes TEXT,
            createdBy INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (productId) REFERENCES products(id),
            FOREIGN KEY (warehouseId) REFERENCES warehouses(id),
            FOREIGN KEY (createdBy) REFERENCES users(id)
        )`);
        // Returns
        db.run(`CREATE TABLE IF NOT EXISTS returns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            returnNumber TEXT UNIQUE NOT NULL,
            referenceType TEXT NOT NULL,
            referenceId INTEGER NOT NULL,
            customerId INTEGER,
            warehouseId INTEGER NOT NULL,
            returnDate TEXT DEFAULT CURRENT_TIMESTAMP,
            reason TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            totalAmount REAL DEFAULT 0,
            notes TEXT,
            createdBy INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customerId) REFERENCES customers(id),
            FOREIGN KEY (warehouseId) REFERENCES warehouses(id)
        )`);
        // Alerts system
        db.run(`CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            severity TEXT NOT NULL,
            relatedId INTEGER,
            relatedType TEXT,
            isRead BOOLEAN DEFAULT 0,
            createdFor INTEGER,
            createdBy INTEGER,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // System settings
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            companyName TEXT DEFAULT 'شركتي',
            currency TEXT DEFAULT 'EGP',
            language TEXT DEFAULT 'ar',
            timezone TEXT DEFAULT 'Africa/Cairo',
            taxRate REAL DEFAULT 14,
            lowStockAlert BOOLEAN DEFAULT 1,
            expiryAlertDays INTEGER DEFAULT 30,
            autoBackup BOOLEAN DEFAULT 0,
            backupPath TEXT,
            fatooraEnabled BOOLEAN DEFAULT 0,
            fatooraApiKey TEXT,
            fatooraBaseUrl TEXT DEFAULT 'https://api.fatoora.com/v1',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        // Insert default data
        const defaultPassword = bcrypt.hashSync('admin123', 10);
        db.run(`INSERT OR IGNORE INTO users (id, username, password, fullName, role) 
                VALUES (1, 'admin', ?, 'مدير النظام', 'admin')`, [defaultPassword]);
        db.run(`INSERT OR IGNORE INTO branches (id, name, location) 
                VALUES (1, 'الفرع الرئيسي', 'المقر الرئيسي')`);
        db.run(`INSERT OR IGNORE INTO warehouses (id, name, branchId, location, manager) 
                VALUES (1, 'المخزن الرئيسي', 1, 'المخزن الرئيسي', 'مدير النظام')`);
        db.run(`INSERT OR IGNORE INTO suppliers (id, name, phone) 
                VALUES (1, 'مورد افتراضي', '01000000000')`);
        db.run(`INSERT OR IGNORE INTO customers (id, name, phone, customerType) 
                VALUES (1, 'عميل نقدي', '00000000000', 'cash')`);
        // Insert default categories
        const categories = [
            'أرز وحبوب', 'سكر وملح', 'زيوت ودهون', 'شاي وقهوة', 
            'معكرونة وأرز', 'صلصات وتوابل', 'منظفات', 'ورق', 
            'مشروبات', 'بطاريات', 'إضاءة', 'سجائر', 'حلوى'
        ];
        categories.forEach(category => {
            db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [category]);
        });
        db.run(`INSERT OR IGNORE INTO settings (id) VALUES (1)`);
        console.log('Database initialized successfully');
    });
}
// Utility functions
function generateOrderNumber(prefix) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}
// Fatoora API integration
async function sendToFatoora(invoiceData, settings) {
    if (!settings.fatooraEnabled || !settings.fatooraApiKey || !settings.fatooraBaseUrl) {
        return null;
    }
    const fatooraData = {
        invoice_number: invoiceData.invoiceNumber,
        invoice_date: invoiceData.invoiceDate,
        customer_name: invoiceData.customerName || 'عميل نقدي',
        customer_phone: invoiceData.customerPhone || '',
        items: invoiceData.items.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
            total: item.totalPrice
        })),
        total: invoiceData.total,
        subtotal: invoiceData.subtotal,
        discount: invoiceData.discountAmount || 0,
        tax: invoiceData.taxAmount || 0
    };
    const options = {
        hostname: new URL(settings.fatooraBaseUrl).hostname,
        port: 443,
        path: '/invoices',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.fatooraApiKey}`
        }
    };
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    resolve(null);
                }
            });
        });
        req.on('error', (error) => {
            console.error('Fatoora API error:', error);
            resolve(null);
        });
        req.write(JSON.stringify(fatooraData));
        req.end();
    });
}
// === API Routes ===
// Support Center Routes (Admin only)
app.get('/api/support/users', requireAuth, requireAdmin, (req, res) => {
    db.all('SELECT id, username, fullName, role, isActive FROM users ORDER BY id', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.put('/api/support/users/:id/status', requireAuth, requireAdmin, (req, res) => {
    const { isActive } = req.body;
    const userId = parseInt(req.params.id);
    if (userId === 1) {
        return res.status(400).json({ error: 'لا يمكن تعطيل الحساب الرئيسي' });
    }
    db.run('UPDATE users SET isActive = ? WHERE id = ? AND id != 1', [isActive ? 1 : 0, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'تم تحديث حالة المستخدم بنجاح' });
    });
});
app.post('/api/support/alerts', requireAuth, requireAdmin, (req, res) => {
    const { userId, priority, title, message } = req.body;
    if (!userId || !title || !message) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }
    const severityMap = {
        low: 'info',
        medium: 'warning',
        high: 'danger'
    };
    const query = `INSERT INTO alerts (type, title, message, severity, createdFor, createdBy) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, ['custom', title, message, severityMap[priority] || 'info', userId, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID, message: 'تم إرسال التنبيه بنجاح' });
    });
});
// Dashboard Statistics (user-specific)
app.get('/api/dashboard/stats', requireAuth, (req, res) => {
    const stats = {};
    const userId = req.user.id;
    db.serialize(() => {
        // Total inventory value (shared)
        db.get(`SELECT SUM(i.quantity * p.sellingPrice) as totalValue 
                FROM inventory i 
                JOIN products p ON i.productId = p.id 
                JOIN warehouses w ON i.warehouseId = w.id 
                WHERE w.isActive = 1`, (err, result) => {
            stats.totalInventoryValue = result.totalValue || 0;
        });
        // Warehouses count (shared)
        db.get('SELECT COUNT(*) as count FROM warehouses WHERE isActive = 1', (err, result) => {
            stats.totalWarehouses = result.count || 0;
        });
        // Customers count (shared)
        db.get('SELECT COUNT(*) as count FROM customers WHERE isActive = 1', (err, result) => {
            stats.totalCustomers = result.count || 0;
        });
        // User-specific daily sales
        db.get(`SELECT SUM(total) as total FROM sales_invoices 
                WHERE date(invoiceDate) = date('now') AND status = 'completed' AND createdBy = ?`, [userId], (err, result) => {
            stats.dailySales = result.total || 0;
        });
        // User-specific daily purchases
        db.get(`SELECT SUM(total) as total FROM purchase_orders 
                WHERE date(orderDate) = date('now') AND status = 'completed' AND createdBy = ?`, [userId], (err, result) => {
            stats.dailyPurchases = result.total || 0;
        });
        // Low stock items (shared)
        db.get(`SELECT COUNT(DISTINCT i.productId) as count 
                FROM inventory i 
                JOIN products p ON i.productId = p.id 
                WHERE i.quantity <= p.minStock AND i.quantity > 0`, (err, result) => {
            stats.lowStockItems = result.count || 0;
            res.json(stats);
        });
    });
});
// === Full Inventory Endpoint ===
app.get('/api/inventory', requireAuth, (req, res) => {
    const query = `
        SELECT i.id, i.productId, i.warehouseId, i.quantity,
               p.name as productName, p.barcode, p.sellingPrice, p.minStock, p.costPrice,
               c.name as categoryName,
               s.name as supplierName,
               w.name as warehouseName,
               s.id as supplierId
        FROM inventory i
        JOIN products p ON i.productId = p.id
        LEFT JOIN categories c ON p.categoryId = c.id
        LEFT JOIN suppliers s ON p.supplierId = s.id
        JOIN warehouses w ON i.warehouseId = w.id
        WHERE i.quantity > 0 AND p.isActive = 1 AND w.isActive = 1
    `;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
// Add/Update Inventory Item
app.post('/api/inventory', requireAuth, (req, res) => {
    const { name, categoryId, barcode, sku, unit, costPrice, sellingPrice, minStock, maxStock, supplierId, warehouseId, quantity } = req.body;
    if (!name || !categoryId || !supplierId || !warehouseId || quantity == null) {
        return res.status(400).json({ error: 'الحقول الإلزامية مطلوبة' });
    }
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        const finalBarcode = barcode || `PRD${Date.now().toString().slice(-9)}`;
        const finalSku = sku || `SKU${Date.now().toString().slice(-9)}`;
        db.get('SELECT id FROM products WHERE barcode = ?', [finalBarcode], (err, product) => {
            if (product) {
                const productId = product.id;
                db.run(`UPDATE products SET 
                    name = ?, categoryId = ?, sku = ?, unit = ?, costPrice = ?, 
                    sellingPrice = ?, minStock = ?, maxStock = ?, supplierId = ?
                    WHERE id = ?`,
                    [name, categoryId, finalSku, unit, costPrice, sellingPrice, minStock, maxStock, supplierId, productId],
                    (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err.message });
                        }
                        db.get('SELECT id FROM inventory WHERE productId = ? AND warehouseId = ?', [productId, warehouseId], (err, inv) => {
                            if (inv) {
                                db.run(`UPDATE inventory SET quantity = quantity + ? WHERE id = ?`, [quantity, inv.id], (err) => {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        return res.status(500).json({ error: err.message });
                                    }
                                    db.run('COMMIT');
                                    res.json({ success: true, id: inv.id, message: 'تم تحديث الكمية بنجاح' });
                                });
                            } else {
                                db.run(`INSERT INTO inventory (productId, warehouseId, quantity) VALUES (?, ?, ?)`,
                                    [productId, warehouseId, quantity],
                                    function(err) {
                                        if (err) {
                                            db.run('ROLLBACK');
                                            return res.status(500).json({ error: err.message });
                                        }
                                        db.run('COMMIT');
                                        res.json({ success: true, id: this.lastID, message: 'تم إضافة المنتج والكمية بنجاح' });
                                    }
                                );
                            }
                        });
                    }
                );
            } else {
                db.run(`INSERT INTO products (name, categoryId, barcode, sku, unit, costPrice, sellingPrice, minStock, maxStock, supplierId) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [name, categoryId, finalBarcode, finalSku, unit, costPrice, sellingPrice, minStock, maxStock, supplierId],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err.message });
                        }
                        const productId = this.lastID;
                        db.run(`INSERT INTO inventory (productId, warehouseId, quantity) VALUES (?, ?, ?)`,
                            [productId, warehouseId, quantity],
                            function(err) {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: err.message });
                                }
                                db.run('COMMIT');
                                res.json({ success: true, id: this.lastID, message: 'تم إضافة المنتج والكمية بنجاح' });
                            }
                        );
                    }
                );
            }
        });
    });
});
// Warehouses (shared)
app.get('/api/warehouses', requireAuth, (req, res) => {
    const query = `SELECT * FROM warehouses WHERE isActive = 1`;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/warehouses', requireAuth, requireAdmin, (req, res) => {
    const { name, branchId, location, manager, phone, email, capacity, notes } = req.body;
    if (!name || !branchId || !location || !manager) {
        return res.status(400).json({ error: 'الحقول الإلزامية مطلوبة' });
    }
    const query = `INSERT INTO warehouses (name, branchId, location, manager, phone, email, capacity, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, branchId, location, manager, phone, email, capacity, notes], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID, message: 'تم إضافة المخزن بنجاح' });
    });
});
// GET sale by ID (لطباعة الفاتورة)
app.get('/api/sales/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT si.*, c.name as customerName, w.name as warehouseName
        FROM sales_invoices si
        LEFT JOIN customers c ON si.customerId = c.id
        JOIN warehouses w ON si.warehouseId = w.id
        WHERE si.id = ? AND si.createdBy = ?
    `;
    db.get(query, [id, req.user.id], (err, invoice) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!invoice) return res.status(404).json({ error: 'الفاتورة غير موجودة' });

        // جلب العناصر
        db.all(`
            SELECT sii.*, p.name as productName
            FROM sales_invoice_items sii
            JOIN products p ON sii.productId = p.id
            WHERE sii.invoiceId = ?
        `, [id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...invoice, items });
        });
    });
});

// DELETE customer
app.delete('/api/customers/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    if (id == 1) {
        return res.status(400).json({ error: 'لا يمكن حذف العميل الافتراضي' });
    }
    db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'العميل غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف العميل بنجاح' });
    });
});

// PUT customer
app.put('/api/customers/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address, taxNumber, balance, creditLimit, customerType, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'اسم العميل مطلوب' });
    const query = `
        UPDATE customers SET 
        name = ?, phone = ?, email = ?, address = ?, taxNumber = ?, 
        balance = ?, creditLimit = ?, customerType = ?, notes = ?
        WHERE id = ?
    `;
    db.run(query, [name, phone, email, address, taxNumber, balance, creditLimit, customerType, notes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'العميل غير موجود' });
        res.json({ success: true, message: 'تم تحديث العميل بنجاح' });
    });
});

// DELETE supplier
app.delete('/api/suppliers/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    if (id == 1) {
        return res.status(400).json({ error: 'لا يمكن حذف المورد الافتراضي' });
    }
    db.run('DELETE FROM suppliers WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'المورد غير موجود' });
        }
        res.json({ success: true, message: 'تم حذف المورد بنجاح' });
    });
});

// PUT supplier
app.put('/api/suppliers/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address, taxNumber, balance, paymentTerms, creditLimit, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'اسم المورد مطلوب' });
    const query = `
        UPDATE suppliers SET 
        name = ?, phone = ?, email = ?, address = ?, taxNumber = ?, 
        balance = ?, paymentTerms = ?, creditLimit = ?, notes = ?
        WHERE id = ?
    `;
    db.run(query, [name, phone, email, address, taxNumber, balance, paymentTerms, creditLimit, notes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'المورد غير موجود' });
        res.json({ success: true, message: 'تم تحديث المورد بنجاح' });
    });
});

// DELETE warehouse
app.delete('/api/warehouses/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    if (id == 1) {
        return res.status(400).json({ error: 'لا يمكن حذف المخزن الافتراضي' });
    }
    db.run('DELETE FROM warehouses WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: 'المخزن غير موجود' });
        }
        // حذف الكمية من الجرد أيضًا (اختياري)
        db.run('DELETE FROM inventory WHERE warehouseId = ?', [id]);
        res.json({ success: true, message: 'تم حذف المخزن بنجاح' });
    });
});

// PUT warehouse
app.put('/api/warehouses/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { name, branchId, location, manager, phone, email, capacity, notes } = req.body;
    if (!name || !branchId || !location || !manager) {
        return res.status(400).json({ error: 'الحقول الإلزامية مطلوبة' });
    }
    const query = `
        UPDATE warehouses SET 
        name = ?, branchId = ?, location = ?, manager = ?, 
        phone = ?, email = ?, capacity = ?, notes = ?
        WHERE id = ?
    `;
    db.run(query, [name, branchId, location, manager, phone, email, capacity, notes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'المخزن غير موجود' });
        res.json({ success: true, message: 'تم تحديث المخزن بنجاح' });
    });
});

// Customers (shared)
app.get('/api/customers', requireAuth, (req, res) => {
    const query = `SELECT * FROM customers WHERE isActive = 1`;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/customers', requireAuth, (req, res) => {
    const { name, phone, email, address, taxNumber, balance, creditLimit, customerType, notes } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'اسم العميل مطلوب' });
    }
    const query = `INSERT INTO customers (name, phone, email, address, taxNumber, balance, creditLimit, customerType, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, phone, email, address, taxNumber, balance, creditLimit, customerType, notes], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID, message: 'تم إضافة العميل بنجاح' });
    });
});
// Suppliers (shared)
app.get('/api/suppliers', requireAuth, (req, res) => {
    const query = `SELECT * FROM suppliers WHERE isActive = 1`;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
// Purchases (user-specific)
app.get('/api/purchases', requireAuth, (req, res) => {
    const query = `
        SELECT po.*, s.name as supplierName, w.name as warehouseName
        FROM purchase_orders po
        JOIN suppliers s ON po.supplierId = s.id
        JOIN warehouses w ON po.warehouseId = w.id
        WHERE po.createdBy = ?
        ORDER BY po.createdAt DESC
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/purchases', requireAuth, (req, res) => {
    const { supplierId, warehouseId, items, discount, notes } = req.body;
    if (!supplierId || !warehouseId || !items || items.length === 0) {
        return res.status(400).json({ error: 'الحقول الإلزامية مطلوبة' });
    }
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        const orderNumber = generateOrderNumber('PO');
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.quantity * item.price;
        });
        const discountAmount = (subtotal * (discount || 0)) / 100;
        const total = subtotal - discountAmount;
        const query = `INSERT INTO purchase_orders (orderNumber, supplierId, warehouseId, subtotal, discount, discountAmount, total, notes, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [orderNumber, supplierId, warehouseId, subtotal, discount || 0, discountAmount, total, notes, req.user.id], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }
            const orderId = this.lastID;
            const itemQueries = items.map(item => {
                return new Promise((resolve, reject) => {
                    const itemQuery = `INSERT INTO purchase_order_items (orderId, productId, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?, ?)`;
                    db.run(itemQuery, [orderId, item.productId, item.quantity, item.price, item.quantity * item.price], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            // Update inventory
                            db.run(`INSERT INTO inventory (productId, warehouseId, quantity) VALUES (?, ?, ?) 
                                    ON CONFLICT(productId, warehouseId) DO UPDATE SET quantity = quantity + excluded.quantity`,
                                    [item.productId, warehouseId, item.quantity], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                });
            });
            Promise.all(itemQueries)
                .then(() => {
                    db.run('COMMIT');
                    res.json({ success: true, id: orderId, message: 'تم حفظ فاتورة الشراء بنجاح' });
                })
                .catch(err => {
                    db.run('ROLLBACK');
                    res.status(500).json({ error: err.message });
                });
        });
    });
});
// Sales (user-specific)
app.get('/api/sales', requireAuth, (req, res) => {
    const { startDate, endDate, status, customer } = req.query;
    let query = `
        SELECT si.*, c.name as customerName, w.name as warehouseName, u.fullName as createdByName
        FROM sales_invoices si
        LEFT JOIN customers c ON si.customerId = c.id
        JOIN warehouses w ON si.warehouseId = w.id
        JOIN users u ON si.createdBy = u.id
        WHERE si.createdBy = ?
    `;
    const params = [req.user.id];
    if (startDate && endDate) {
        query += ' AND date(si.invoiceDate) BETWEEN date(?) AND date(?)';
        params.push(startDate, endDate);
    }
    if (status && status !== 'all') {
        query += ' AND si.status = ?';
        params.push(status);
    }
    if (customer && customer !== 'all') {
        query += ' AND si.customerId = ?';
        params.push(customer);
    }
    query += ' ORDER BY si.invoiceDate DESC';
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/sales', requireAuth, async (req, res) => {
    const { customerId, warehouseId, items, discount, notes } = req.body;
    if (!warehouseId || !items || items.length === 0) {
        return res.status(400).json({ error: 'الحقول الإلزامية مطلوبة' });
    }
    // Get customer details for Fatoora
    let customerDetails = null;
    if (customerId) {
        const customer = await new Promise((resolve, reject) => {
            db.get('SELECT name, phone FROM customers WHERE id = ?', [customerId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        if (customer) {
            customerDetails = customer;
        }
    }
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        const invoiceNumber = generateOrderNumber('INV');
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.quantity * item.price;
        });
        const discountAmount = (subtotal * (discount || 0)) / 100;
        const total = subtotal - discountAmount;
        const query = `INSERT INTO sales_invoices (invoiceNumber, customerId, warehouseId, subtotal, discount, discountAmount, total, notes, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [invoiceNumber, customerId || 1, warehouseId, subtotal, discount || 0, discountAmount, total, notes, req.user.id], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }
            const invoiceId = this.lastID;
            const itemQueries = items.map(item => {
                return new Promise((resolve, reject) => {
                    const itemQuery = `INSERT INTO sales_invoice_items (invoiceId, productId, quantity, unitPrice, totalPrice) VALUES (?, ?, ?, ?, ?)`;
                    db.run(itemQuery, [invoiceId, item.productId, item.quantity, item.price, item.quantity * item.price], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            // Update inventory (decrease)
                            db.run(`UPDATE inventory SET quantity = quantity - ? WHERE productId = ? AND warehouseId = ?`,
                                    [item.quantity, item.productId, warehouseId], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                });
            });
            Promise.all(itemQueries)
                .then(async () => {
                    db.run('COMMIT');
                    // Get settings for Fatoora integration
                    const settings = await new Promise((resolve, reject) => {
                        db.get('SELECT fatooraEnabled, fatooraApiKey, fatooraBaseUrl FROM settings WHERE id = 1', (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    });
                    // Get product details for Fatoora
                    const productDetails = await Promise.all(items.map(item => {
                        return new Promise((resolve, reject) => {
                            db.get('SELECT name FROM products WHERE id = ?', [item.productId], (err, row) => {
                                if (err) reject(err);
                                else resolve({ ...item, productName: row.name || 'منتج غير معروف' });
                            });
                        });
                    }));
                    const invoiceData = {
                        invoiceNumber,
                        invoiceDate: new Date().toISOString(),
                        customerId,
                        customerName: customerDetails.name || 'عميل نقدي',
                        customerPhone: customerDetails.phone || '',
                        warehouseId,
                        items: productDetails,
                        subtotal,
                        discountAmount,
                        total,
                        createdBy: req.user.id
                    };
                    // Send to Fatoora if enabled
                    if (settings && settings.fatooraEnabled) {
                        await sendToFatoora(invoiceData, settings);
                    }
                    res.json({ success: true, id: invoiceId, message: 'تم حفظ فاتورة البيع بنجاح' });
                })
                .catch(err => {
                    db.run('ROLLBACK');
                    res.status(500).json({ error: err.message });
                });
        });
    });
});
// Returns (user-specific)
app.get('/api/returns', requireAuth, (req, res) => {
    const query = `
        SELECT r.*, c.name as customerName, w.name as warehouseName
        FROM returns r
        LEFT JOIN customers c ON r.customerId = c.id
        JOIN warehouses w ON r.warehouseId = w.id
        WHERE r.createdBy = ?
        ORDER BY r.createdAt DESC
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
// Alerts (user-specific)
app.get('/api/alerts', requireAuth, (req, res) => {
    const query = `
        SELECT a.*, u.fullName as createdForName
        FROM alerts a
        LEFT JOIN users u ON a.createdFor = u.id
        WHERE (a.createdFor IS NULL OR a.createdFor = ?)
        ORDER BY a.createdAt DESC
    `;
    db.all(query, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.put('/api/alerts/:id/read', requireAuth, (req, res) => {
    db.run('UPDATE alerts SET isRead = 1 WHERE id = ? AND (createdFor = ? OR createdFor IS NULL)', [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'تم تحديث التنبيه' });
    });
});
// Settings
app.get('/api/settings', requireAuth, (req, res) => {
    db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || {});
    });
});
app.post('/api/settings', requireAuth, requireAdmin, (req, res) => {
    const { 
        language, 
        currency, 
        timezone, 
        lowStockAlert,
        fatooraEnabled,
        fatooraApiKey,
        fatooraBaseUrl
    } = req.body;
    const query = `
        UPDATE settings SET 
        language = ?, 
        currency = ?, 
        timezone = ?, 
        lowStockAlert = ?,
        fatooraEnabled = ?,
        fatooraApiKey = ?,
        fatooraBaseUrl = ?
        WHERE id = 1
    `;
    db.run(query, [
        language, 
        currency, 
        timezone, 
        lowStockAlert ? 1 : 0,
        fatooraEnabled ? 1 : 0,
        fatooraApiKey || null,
        fatooraBaseUrl || 'https://api.fatoora.com/v1'
    ], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});
// Test Fatoora connection
app.post('/api/fatoora/test', requireAuth, requireAdmin, (req, res) => {
    const { apiKey, baseUrl } = req.body;
    if (!apiKey || !baseUrl) {
        return res.status(400).json({ error: 'مفتاح API ورابط API مطلوبان' });
    }
    const options = {
        hostname: new URL(baseUrl).hostname,
        port: 443,
        path: '/account',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };
    const reqFatoora = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            if (response.statusCode === 200) {
                res.json({ success: true, message: 'تم الاتصال بنجاح بمنصة فاتورة' });
            } else {
                res.status(400).json({ error: 'فشل في الاتصال بمنصة فاتورة' });
            }
        });
    });
    reqFatoora.on('error', (error) => {
        res.status(500).json({ error: 'خطأ في الاتصال بمنصة فاتورة' });
    });
    reqFatoora.end();
});
// Backup endpoint
app.get('/api/backup', requireAuth, requireAdmin, async (req, res) => {
    const backupData = {};
    const tables = ['users', 'branches', 'warehouses', 'suppliers', 'customers', 
                   'products', 'inventory', 'purchase_orders', 'sales_invoices'];
    try {
        for (const table of tables) {
            const rows = await new Promise((resolve, reject) => {
                db.all(`SELECT * FROM ${table}`, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            backupData[table] = rows;
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        res.setHeader('Content-Disposition', `attachment; filename=backup-${timestamp}.json`);
        res.json(backupData);
    } catch (err) {
        console.error('Backup error:', err);
        res.status(500).json({ error: 'فشل في إنشاء النسخة الاحتياطية' });
    }
});
// Restore endpoint
app.post('/api/restore', requireAuth, requireAdmin, (req, res) => {
    const backupData = req.body;
    if (!backupData) {
        return res.status(400).json({ error: 'بيانات النسخة الاحتياطية مطلوبة' });
    }
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        try {
            // Clear existing data (except admin user)
            db.run('DELETE FROM users WHERE id != 1');
            db.run('DELETE FROM branches WHERE id != 1');
            db.run('DELETE FROM warehouses WHERE id != 1');
            db.run('DELETE FROM suppliers WHERE id != 1');
            db.run('DELETE FROM customers WHERE id != 1');
            db.run('DELETE FROM products');
            db.run('DELETE FROM inventory');
            db.run('DELETE FROM purchase_orders');
            db.run('DELETE FROM sales_invoices');
            // Restore data
            const restorePromises = [];
            // Restore branches
            if (backupData.branches) {
                backupData.branches.forEach(branch => {
                    if (branch.id !== 1) {
                        restorePromises.push(new Promise((resolve, reject) => {
                            db.run(`INSERT INTO branches (id, name, location, phone, email, managerId, isActive, createdAt) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                [branch.id, branch.name, branch.location, branch.phone, branch.email, branch.managerId, branch.isActive, branch.createdAt],
                                (err) => err ? reject(err) : resolve()
                            );
                        }));
                    }
                });
            }
            // Restore warehouses
            if (backupData.warehouses) {
                backupData.warehouses.forEach(warehouse => {
                    if (warehouse.id !== 1) {
                        restorePromises.push(new Promise((resolve, reject) => {
                            db.run(`INSERT INTO warehouses (id, name, branchId, location, manager, phone, email, capacity, currentUsage, notes, isActive, createdAt) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                [warehouse.id, warehouse.name, warehouse.branchId, warehouse.location, warehouse.manager, warehouse.phone, warehouse.email, warehouse.capacity, warehouse.currentUsage, warehouse.notes, warehouse.isActive, warehouse.createdAt],
                                (err) => err ? reject(err) : resolve()
                            );
                        }));
                    }
                });
            }
            // Restore suppliers
            if (backupData.suppliers) {
                backupData.suppliers.forEach(supplier => {
                    if (supplier.id !== 1) {
                        restorePromises.push(new Promise((resolve, reject) => {
                            db.run(`INSERT INTO suppliers (id, name, companyName, taxNumber, phone, email, address, balance, paymentTerms, creditLimit, notes, isActive, createdAt) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                [supplier.id, supplier.name, supplier.companyName, supplier.taxNumber, supplier.phone, supplier.email, supplier.address, supplier.balance, supplier.paymentTerms, supplier.creditLimit, supplier.notes, supplier.isActive, supplier.createdAt],
                                (err) => err ? reject(err) : resolve()
                            );
                        }));
                    }
                });
            }
            // Restore customers
            if (backupData.customers) {
                backupData.customers.forEach(customer => {
                    if (customer.id !== 1) {
                        restorePromises.push(new Promise((resolve, reject) => {
                            db.run(`INSERT INTO customers (id, name, phone, email, address, taxNumber, balance, creditLimit, customerType, notes, isActive, createdAt) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                [customer.id, customer.name, customer.phone, customer.email, customer.address, customer.taxNumber, customer.balance, customer.creditLimit, customer.customerType, customer.notes, customer.isActive, customer.createdAt],
                                (err) => err ? reject(err) : resolve()
                            );
                        }));
                    }
                });
            }
            // Restore products
            if (backupData.products) {
                backupData.products.forEach(product => {
                    restorePromises.push(new Promise((resolve, reject) => {
                        db.run(`INSERT INTO products (id, name, categoryId, barcode, sku, description, unit, costPrice, sellingPrice, minStock, maxStock, supplierId, isActive, hasExpiry, createdAt) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [product.id, product.name, product.categoryId, product.barcode, product.sku, product.description, product.unit, product.costPrice, product.sellingPrice, product.minStock, product.maxStock, product.supplierId, product.isActive, product.hasExpiry, product.createdAt],
                            (err) => err ? reject(err) : resolve()
                        );
                    }));
                });
            }
            // Restore inventory
            if (backupData.inventory) {
                backupData.inventory.forEach(item => {
                    restorePromises.push(new Promise((resolve, reject) => {
                        db.run(`INSERT INTO inventory (id, productId, warehouseId, batchNumber, expiryDate, quantity, reservedQuantity, entryDate, lastUpdated) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [item.id, item.productId, item.warehouseId, item.batchNumber, item.expiryDate, item.quantity, item.reservedQuantity, item.entryDate, item.lastUpdated],
                            (err) => err ? reject(err) : resolve()
                        );
                    }));
                });
            }
            Promise.all(restorePromises)
                .then(() => {
                    db.run('COMMIT');
                    res.json({ success: true, message: 'تم استعادة النسخة الاحتياطية بنجاح' });
                })
                .catch(err => {
                    db.run('ROLLBACK');
                    res.status(500).json({ error: 'فشل في استعادة النسخة الاحتياطية: ' + err.message });
                });
        } catch (err) {
            db.run('ROLLBACK');
            res.status(500).json({ error: 'فشل في استعادة النسخة الاحتياطية: ' + err.message });
        }
    });
});
// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
});
app.use('*', (req, res) => {
    res.status(404).json({ error: 'الرابط غير موجود' });
});
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 نظام إدارة المخازن المتكامل جاهز للاستخدام`);
    console.log(`🔐 اسم المستخدم: admin | كلمة المرور: admin123`);
});
process.on('SIGINT', () => {
    console.log('🛑 إيقاف الخادم...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ تم إغلاق قاعدة البيانات');
        }
        process.exit(0);
    });
});
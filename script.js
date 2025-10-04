// ✅ script.js - نظام تسجيل دخول جديد وآمن
const API_BASE = '/api';

function isValidToken(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (e) {
        return false;
    }
}

// التحقق من الجلسة عند تحميل index.html
(function() {
    const token = localStorage.getItem('authToken');
    if (!token || !isValidToken(token)) {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
        return;
    }
})();

// دالة موحدة للطلبات المصادق عليها
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${url}`, config);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'خطأ غير معروف' }));
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return;
        }
        throw new Error(error.error || 'خطأ في الشبكة');
    }
    return response.json();
}

// زر تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
});

// ⚠️ بقية الكود كما هو في الملف الأصلي (من سطر 40 فما بعد)
// ... (الكود الكامل من script.txt الأصلي بدون تغيير)
// نسخه هنا للإكمال:

// DOM Elements
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-item');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const logoutBtn = document.getElementById('logoutBtn');

// Product Modal
const addProductBtn = document.getElementById('addProductBtn');
const addProductBtn2 = document.getElementById('addProductBtn2');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const addProductModal = document.getElementById('addProductModal');
const saveProduct = document.getElementById('saveProduct');
const productWarehouse = document.getElementById('productWarehouse');
const productSupplier = document.getElementById('productSupplier');

// Warehouse Modal
const addWarehouseBtn = document.getElementById('addWarehouseBtn');
const addWarehouseBtn2 = document.getElementById('addWarehouseBtn2');
const closeWarehouseModal = document.getElementById('closeWarehouseModal');
const cancelWarehouseModal = document.getElementById('cancelWarehouseModal');
const addWarehouseModal = document.getElementById('addWarehouseModal');
const saveWarehouse = document.getElementById('saveWarehouse');

// Purchase Modal
const addPurchaseBtn = document.getElementById('addPurchaseBtn');
const newPurchaseBtn = document.getElementById('newPurchaseBtn');
const closePurchaseModal = document.getElementById('closePurchaseModal');
const cancelPurchaseModal = document.getElementById('cancelPurchaseModal');
const addPurchaseModal = document.getElementById('addPurchaseModal');
const savePurchase = document.getElementById('savePurchase');
const purchaseSupplier = document.getElementById('purchaseSupplier');
const purchaseWarehouse = document.getElementById('purchaseWarehouse');
const purchaseItemsContainer = document.getElementById('purchaseItemsContainer');
const addPurchaseItemBtn = document.getElementById('addPurchaseItemBtn');
const purchaseTotal = document.getElementById('purchaseTotal');
const purchaseDiscount = document.getElementById('purchaseDiscount');

// Sale Modal
const newSaleBtn = document.getElementById('newSaleBtn');
const newSaleBtn2 = document.getElementById('newSaleBtn2');
const closeSaleModal = document.getElementById('closeSaleModal');
const cancelSaleModal = document.getElementById('cancelSaleModal');
const addSaleModal = document.getElementById('addSaleModal');
const saveSale = document.getElementById('saveSale');
const saleCustomer = document.getElementById('saleCustomer');
const saleWarehouse = document.getElementById('saleWarehouse');
const saleItemsContainer = document.getElementById('saleItemsContainer');
const addSaleItemBtn = document.getElementById('addSaleItemBtn');
const saleTotal = document.getElementById('saleTotal');
const saleDiscount = document.getElementById('saleDiscount');
const customerTypeRadios = document.querySelectorAll('input[name="customerType"]');
const existingCustomerSection = document.getElementById('existingCustomerSection');
const newCustomerSection = document.getElementById('newCustomerSection');
const newCustomerName = document.getElementById('newCustomerName');
const newCustomerPhone = document.getElementById('newCustomerPhone');
const newCustomerAddress = document.getElementById('newCustomerAddress');

// Customer Modal
const addCustomerBtn = document.getElementById('addCustomerBtn');
const closeCustomerModal = document.getElementById('closeCustomerModal');
const cancelCustomerModal = document.getElementById('cancelCustomerModal');
const addCustomerModal = document.getElementById('addCustomerModal');
const saveCustomer = document.getElementById('saveCustomer');

// Supplier Modal
const addSupplierBtn = document.getElementById('addSupplierBtn');
const closeSupplierModal = document.getElementById('closeSupplierModal');
const cancelSupplierModal = document.getElementById('cancelSupplierModal');
const addSupplierModal = document.getElementById('addSupplierModal');
const saveSupplier = document.getElementById('saveSupplier');

// Inventory Modal
const inventoryBtn = document.getElementById('inventoryBtn');
const closeInventoryModal = document.getElementById('closeInventoryModal');
const cancelInventoryModal = document.getElementById('cancelInventoryModal');
const inventoryModal = document.getElementById('inventoryModal');
const saveInventory = document.getElementById('saveInventory');
const inventoryWarehouse = document.getElementById('inventoryWarehouse');
const inventoryItemsContainer = document.getElementById('inventoryItemsContainer');

// Cart
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Tables
const searchInput = document.getElementById('searchInput');
const warehouseFilter = document.getElementById('warehouseFilter');
const categoryFilter = document.getElementById('categoryFilter');
const productsTableBody = document.getElementById('productsTableBody');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const warehousesTableBody = document.getElementById('warehousesTableBody');
const purchasesTableBody = document.getElementById('purchasesTableBody');
const invoicesTableBody = document.getElementById('invoicesTableBody');
const returnsTableBody = document.getElementById('returnsTableBody');
const customersTableBody = document.getElementById('customersTableBody');
const suppliersTableBody = document.getElementById('suppliersTableBody');

// Alerts
const alertsContainer = document.getElementById('alertsContainer');
const alertsList = document.getElementById('alertsList');
const refreshBtn = document.getElementById('refreshBtn');
const alertCount = document.getElementById('alertCount');
const markAllRead = document.getElementById('markAllRead');

// Stats
const totalInventoryValue = document.getElementById('totalInventoryValue');
const totalWarehouses = document.getElementById('totalWarehouses');
const totalCustomers = document.getElementById('totalCustomers');
const dailyPurchases = document.getElementById('dailyPurchases');
const dailySales = document.getElementById('dailySales');
const lowStockItems = document.getElementById('lowStockItems');
const dailyPurchasesStat = document.getElementById('dailyPurchasesStat');
const dailySalesStat = document.getElementById('dailySalesStat');
const purchaseInvoiceCount = document.getElementById('purchaseInvoiceCount');
const salesInvoiceCount = document.getElementById('salesInvoiceCount');
const totalPurchases = document.getElementById('totalPurchases');
const dailyProfit = document.getElementById('dailyProfit');

// Charts
const salesPurchasesChart = document.getElementById('salesPurchasesChart');
const warehousesChart = document.getElementById('warehousesChart');
const reportsChart1 = document.getElementById('reportsChart1');
const reportsChart2 = document.getElementById('reportsChart2');

// Settings
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const restoreFile = document.getElementById('restoreFile');
const languageSelect = document.getElementById('languageSelect');
const currencySelect = document.getElementById('currencySelect');
const timezoneSelect = document.getElementById('timezoneSelect');
const lowStockAlert = document.getElementById('lowStockAlert');
const salesAlert = document.getElementById('salesAlert');
const purchasesAlert = document.getElementById('purchasesAlert');

// Fatoora Settings
const fatooraEnabled = document.getElementById('fatooraEnabled');
const fatooraApiKey = document.getElementById('fatooraApiKey');
const fatooraBaseUrl = document.getElementById('fatooraBaseUrl');
const testFatooraConnection = document.getElementById('testFatooraConnection');
const fatooraTestResult = document.getElementById('fatooraTestResult');

// Transfer
const sourceWarehouse = document.getElementById('sourceWarehouse');
const destinationWarehouse = document.getElementById('destinationWarehouse');
const transferProduct = document.getElementById('transferProduct');
const transferQuantity = document.getElementById('transferQuantity');
const transferReason = document.getElementById('transferReason');
const transferBtn = document.getElementById('transferBtn');

// Print
const printReport = document.getElementById('printReport');
const printInvoiceDate = document.getElementById('printInvoiceDate');
const printInvoiceNumber = document.getElementById('printInvoiceNumber');
const printWarehouseName = document.getElementById('printWarehouseName');
const printCustomerName = document.getElementById('printCustomerName');
const printInvoiceItems = document.getElementById('printInvoiceItems');
const printInvoiceTotal = document.getElementById('printInvoiceTotal');

// Global data caches
let warehousesData = [];
let categoriesData = [];
let suppliersData = [];
let customersData = [];
let inventoryData = [];
let purchasesData = [];
let salesData = [];
let returnsData = [];
let alertsData = [];
let cart = [];
let currentSearch = '';
let currentWarehouse = 'all';
let currentCategory = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
        // Verify token validity
        try {
            const payload = JSON.parse(atob(savedToken.split('.')[1]));
            if (payload.exp * 1000 > Date.now()) {
                loadAllData();
            } else {
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            }
        } catch (e) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
    // Mobile menu
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    // Product Modal
    if (addProductBtn) addProductBtn.addEventListener('click', () => openAddProductModal());
    if (addProductBtn2) addProductBtn2.addEventListener('click', () => openAddProductModal());
    if (closeModal) closeModal.addEventListener('click', closeAddProductModal);
    if (cancelModal) cancelModal.addEventListener('click', closeAddProductModal);
    if (saveProduct) saveProduct.addEventListener('click', saveNewProduct);
    // Warehouse Modal
    if (addWarehouseBtn) addWarehouseBtn.addEventListener('click', () => openAddWarehouseModal());
    if (addWarehouseBtn2) addWarehouseBtn2.addEventListener('click', () => openAddWarehouseModal());
    if (closeWarehouseModal) closeWarehouseModal.addEventListener('click', closeAddWarehouseModal);
    if (cancelWarehouseModal) cancelWarehouseModal.addEventListener('click', closeAddWarehouseModal);
    if (saveWarehouse) saveWarehouse.addEventListener('click', saveNewWarehouse);
    // Purchase Modal
    if (addPurchaseBtn) addPurchaseBtn.addEventListener('click', () => openAddPurchaseModal());
    if (newPurchaseBtn) newPurchaseBtn.addEventListener('click', () => openAddPurchaseModal());
    if (closePurchaseModal) closePurchaseModal.addEventListener('click', closeAddPurchaseModal);
    if (cancelPurchaseModal) cancelPurchaseModal.addEventListener('click', closeAddPurchaseModal);
    if (savePurchase) savePurchase.addEventListener('click', saveNewPurchase);
    if (addPurchaseItemBtn) addPurchaseItemBtn.addEventListener('click', addPurchaseItem);
    if (purchaseDiscount) purchaseDiscount.addEventListener('input', calculatePurchaseTotal);
    // Sale Modal
    if (newSaleBtn) newSaleBtn.addEventListener('click', () => openAddSaleModal());
    if (newSaleBtn2) newSaleBtn2.addEventListener('click', () => openAddSaleModal());
    if (closeSaleModal) closeSaleModal.addEventListener('click', closeAddSaleModal);
    if (cancelSaleModal) cancelSaleModal.addEventListener('click', closeAddSaleModal);
    if (saveSale) saveSale.addEventListener('click', saveNewSale);
    if (addSaleItemBtn) addSaleItemBtn.addEventListener('click', addSaleItem);
    if (saleDiscount) saleDiscount.addEventListener('input', calculateSaleTotal);
    // Customer type toggle
    customerTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'existing') {
                existingCustomerSection.style.display = 'block';
                newCustomerSection.style.display = 'none';
            } else {
                existingCustomerSection.style.display = 'none';
                newCustomerSection.style.display = 'block';
            }
        });
    });
    // Customer Modal
    if (addCustomerBtn) addCustomerBtn.addEventListener('click', () => openAddCustomerModal());
    if (closeCustomerModal) closeCustomerModal.addEventListener('click', closeAddCustomerModal);
    if (cancelCustomerModal) cancelCustomerModal.addEventListener('click', closeAddCustomerModal);
    if (saveCustomer) saveCustomer.addEventListener('click', saveNewCustomer);
    // Supplier Modal
    if (addSupplierBtn) addSupplierBtn.addEventListener('click', () => openAddSupplierModal());
    if (closeSupplierModal) closeSupplierModal.addEventListener('click', closeAddSupplierModal);
    if (cancelSupplierModal) cancelSupplierModal.addEventListener('click', closeAddSupplierModal);
    if (saveSupplier) saveSupplier.addEventListener('click', saveNewSupplier);
    // Inventory Modal
    if (inventoryBtn) inventoryBtn.addEventListener('click', () => openInventoryModal());
    if (closeInventoryModal) closeInventoryModal.addEventListener('click', closeInventoryModalFunc);
    if (cancelInventoryModal) cancelInventoryModal.addEventListener('click', closeInventoryModalFunc);
    if (saveInventory) saveInventory.addEventListener('click', saveInventoryData);
    // Cart
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    // Search and filter
    if (searchInput) searchInput.addEventListener('input', function() {
        currentSearch = this.value;
        loadProducts();
    });
    if (warehouseFilter) warehouseFilter.addEventListener('change', function() {
        currentWarehouse = this.value;
        loadProducts();
    });
    if (categoryFilter) categoryFilter.addEventListener('change', function() {
        currentCategory = this.value;
        loadProducts();
    });
    // Refresh button
    if (refreshBtn) refreshBtn.addEventListener('click', loadAllData);
    // Backup and restore
    if (backupBtn) backupBtn.addEventListener('click', backupData);
    if (restoreBtn) restoreBtn.addEventListener('click', () => restoreFile.click());
    if (restoreFile) restoreFile.addEventListener('change', handleFileSelect);
    // Settings
    if (languageSelect) languageSelect.addEventListener('change', saveSettings);
    if (currencySelect) currencySelect.addEventListener('change', saveSettings);
    if (timezoneSelect) timezoneSelect.addEventListener('change', saveSettings);
    if (lowStockAlert) lowStockAlert.addEventListener('change', saveSettings);
    if (salesAlert) salesAlert.addEventListener('change', saveSettings);
    if (purchasesAlert) purchasesAlert.addEventListener('change', saveSettings);
    // Fatoora Settings
    if (testFatooraConnection) testFatooraConnection.addEventListener('click', testFatooraConnectionHandler);
    // Transfer
    if (transferBtn) transferBtn.addEventListener('click', transferBetweenWarehouses);
    // Print
    if (printReport) printReport.addEventListener('click', () => window.print());
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

function showPage(pageId) {
    navItems.forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

async function loadAllData() {
    try {
        const settings = await apiFetch('/settings');
        await Promise.all([
            loadWarehouses(),
            loadCategories(),
            loadSuppliers(),
            loadCustomers(),
            loadProducts(),
            loadAlerts(),
            loadPurchases(),
            loadSales(),
            loadReturns(),
            loadDashboardStats()
        ]);
        initCharts();
        loadSettings(settings);
    } catch (error) {
        console.error('Error loading ', error);
        showToast('خطأ في تحميل البيانات: ' + error.message, 'error');
    }
}

async function loadDashboardStats() {
    try {
        const stats = await apiFetch('/dashboard/stats');
        totalInventoryValue.textContent = `${(stats.totalInventoryValue || 0).toLocaleString()} ج.م`;
        totalWarehouses.textContent = stats.totalWarehouses || 0;
        totalCustomers.textContent = stats.totalCustomers || 0;
        dailyPurchases.textContent = `${(stats.dailyPurchases || 0).toLocaleString()} ج.م`;
        dailySales.textContent = `${(stats.dailySales || 0).toLocaleString()} ج.م`;
        lowStockItems.textContent = stats.lowStockItems || 0;
        dailyPurchasesStat.textContent = `${(stats.dailyPurchases || 0).toLocaleString()} ج.م`;
        dailySalesStat.textContent = `${(stats.dailySales || 0).toLocaleString()} ج.م`;
        purchaseInvoiceCount.textContent = '0';
        salesInvoiceCount.textContent = '0';
        totalPurchases.textContent = '0 ج.م';
        dailyProfit.textContent = '0 ج.م';
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadWarehouses() {
    try {
        const data = await apiFetch('/warehouses');
        warehousesData = data;
        renderWarehouses();
        updateWarehouseSelects();
    } catch (error) {
        console.error('Error loading warehouses:', error);
        warehousesData = [];
        renderWarehouses();
    }
}

function renderWarehouses() {
    if (!warehousesTableBody) return;
    warehousesTableBody.innerHTML = '';
    if (warehousesData.length === 0) {
        warehousesTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    <div class="empty-state">
                        <i class="fas fa-warehouse"></i>
                        <h3>لا توجد مخازن</h3>
                        <p>ابدأ بإضافة مخزن جديد</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    warehousesData.forEach(warehouse => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${warehouse.name}</td>
            <td>${warehouse.location}</td>
            <td>0</td>
            <td>0 ج.م</td>
            <td><span class="status-badge ${warehouse.isActive ? 'status-good' : 'status-out'}">${warehouse.isActive ? 'نشط' : 'غير نشط'}</span></td>
            <td>
                <div class="action-btn edit" onclick="editWarehouse(${warehouse.id})">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn inventory" onclick="startInventory(${warehouse.id})">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="action-btn delete" onclick="deleteWarehouse(${warehouse.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        warehousesTableBody.appendChild(row);
    });
}

async function loadCategories() {
    categoriesData = [
        'أرز وحبوب', 'سكر وملح', 'زيوت ودهون', 'شاي وقهوة', 
        'معكرونة وأرز', 'صلصات وتوابل', 'منظفات', 'ورق', 
        'مشروبات', 'بطاريات', 'إضاءة', 'سجائر', 'حلوى'
    ];
    renderCategories();
}

function renderCategories() {
    if (!categoryFilter) return;
    categoryFilter.innerHTML = '<option value="all">جميع الفئات</option>';
    categoriesData.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

async function loadSuppliers() {
    try {
        const data = await apiFetch('/suppliers');
        suppliersData = data;
        renderSuppliers();
    } catch (error) {
        console.error('Error loading suppliers:', error);
        suppliersData = [];
        renderSuppliers();
    }
}

function renderSuppliers() {
    if (!suppliersTableBody) return;
    suppliersTableBody.innerHTML = '';
    if (suppliersData.length === 0) {
        suppliersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div class="empty-state">
                        <i class="fas fa-truck"></i>
                        <h3>لا توجد موردين</h3>
                        <p>ابدأ بإضافة مورد جديد</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    suppliersData.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.address}</td>
            <td>0 ج.م</td>
            <td>${(supplier.balance || 0).toLocaleString()} ج.م</td>
            <td><span class="status-badge ${supplier.isActive ? 'status-good' : 'status-out'}">${supplier.isActive ? 'نشط' : 'غير نشط'}</span></td>
            <td>
                <div class="action-btn edit" onclick="editSupplier(${supplier.id})">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn cart" onclick="createPurchaseFromSupplier(${supplier.id})">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <div class="action-btn delete" onclick="deleteSupplier(${supplier.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        suppliersTableBody.appendChild(row);
    });
}

async function loadCustomers() {
    try {
        const data = await apiFetch('/customers');
        customersData = data;
        renderCustomers();
        updateCustomerSelect();
    } catch (error) {
        console.error('Error loading customers:', error);
        customersData = [];
        renderCustomers();
    }
}

function renderCustomers() {
    if (!customersTableBody) return;
    customersTableBody.innerHTML = '';
    if (customersData.length === 0) {
        customersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>لا توجد عملاء</h3>
                        <p>ابدأ بإضافة عميل جديد</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    customersData.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>0 ج.م</td>
            <td>${(customer.balance || 0).toLocaleString()} ج.م</td>
            <td><span class="status-badge ${customer.isActive ? 'status-good' : 'status-out'}">${customer.isActive ? 'نشط' : 'غير نشط'}</span></td>
            <td>
                <div class="action-btn edit" onclick="editCustomer(${customer.id})">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn cart" onclick="createSaleFromCustomer(${customer.id})">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="action-btn delete" onclick="deleteCustomer(${customer.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        customersTableBody.appendChild(row);
    });
}

function updateCustomerSelect() {
    if (!saleCustomer) return;
    saleCustomer.innerHTML = '<option value="">اختر عميل</option>';
    customersData.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} (${customer.phone || 'بدون هاتف'})`;
        saleCustomer.appendChild(option);
    });
}

async function loadProducts() {
    try {
        const data = await apiFetch('/inventory');
        inventoryData = data;
        renderProducts();
        updateTransferProductSelect();
    } catch (error) {
        console.error('Error loading products:', error);
        inventoryData = [];
        renderProducts();
    }
}

function renderProducts() {
    let filteredProducts = inventoryData;
    if (currentSearch) {
        filteredProducts = filteredProducts.filter(item => 
            item.productName && item.productName.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }
    if (currentWarehouse !== 'all') {
        filteredProducts = filteredProducts.filter(item => item.warehouseId == currentWarehouse);
    }
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(item => item.categoryName === currentCategory);
    }
    if (productsTableBody) {
        productsTableBody.innerHTML = '';
        if (filteredProducts.length === 0) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>لا توجد منتجات</h3>
                            <p>ابدأ بإضافة منتجات جديدة</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            filteredProducts.slice(0, 10).forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="product-name">
                            <div class="product-icon">
                                <i class="fas fa-box"></i>
                            </div>
                            <div>
                                <div>${item.productName || 'غير معروف'}</div>
                                <div style="font-size: 0.75rem; color: var(--gray-500);">${item.barcode || 'لا يوجد باركود'}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="warehouse-badge">${item.warehouseName || 'غير معروف'}</span></td>
                    <td>${item.quantity || 0}</td>
                    <td>${(item.sellingPrice || 0).toLocaleString()} ج.م</td>
                    <td><span class="status-badge ${getStatusClass(item.quantity, item.minStock)}">${getStatusText(item.quantity, item.minStock)}</span></td>
                    <td>
                        ${item.quantity > 0 ? `
                        <div class="action-btn cart" onclick="addToCart(${item.id}, ${item.productId})">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        ` : ''}
                        <div class="action-btn edit" onclick="editProduct(${item.id}, ${item.productId})">
                            <i class="fas fa-edit"></i>
                        </div>
                    </td>
                `;
                productsTableBody.appendChild(row);
            });
        }
    }
    if (inventoryTableBody) {
        inventoryTableBody.innerHTML = '';
        if (filteredProducts.length === 0) {
            inventoryTableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem;">
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>لا توجد منتجات</h3>
                            <p>ابدأ بإضافة منتجات جديدة</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            filteredProducts.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.barcode || ''}</td>
                    <td>${item.productName || 'غير معروف'}</td>
                    <td><span class="warehouse-badge">${item.warehouseName || 'غير معروف'}</span></td>
                    <td>${item.categoryName || ''}</td>
                    <td>${item.quantity || 0}</td>
                    <td>${(item.sellingPrice || 0).toLocaleString()} ج.م</td>
                    <td>${item.supplierName || 'غير معروف'}</td>
                    <td><span class="status-badge ${getStatusClass(item.quantity, item.minStock)}">${getStatusText(item.quantity, item.minStock)}</span></td>
                    <td>
                        ${item.quantity > 0 ? `
                        <div class="action-btn cart" onclick="addToCart(${item.id}, ${item.productId})">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        ` : ''}
                        <div class="action-btn edit" onclick="editProduct(${item.id}, ${item.productId})">
                            <i class="fas fa-edit"></i>
                        </div>
                    </td>
                `;
                inventoryTableBody.appendChild(row);
            });
        }
    }
}

async function loadPurchases() {
    try {
        const data = await apiFetch('/purchases');
        purchasesData = data;
        renderPurchases();
    } catch (error) {
        console.error('Error loading purchases:', error);
        purchasesData = [];
        renderPurchases();
    }
}

function renderPurchases() {
    if (!purchasesTableBody) return;
    purchasesTableBody.innerHTML = '';
    if (purchasesData.length === 0) {
        purchasesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div class="empty-state">
                        <i class="fas fa-shopping-basket"></i>
                        <h3>لا توجد فواتير شراء</h3>
                        <p>ابدأ بإنشاء فاتورة شراء جديدة</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    const sortedPurchases = [...purchasesData].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    sortedPurchases.forEach(purchase => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purchase.orderNumber}</td>
            <td>${new Date(purchase.orderDate).toLocaleDateString('ar-EG')}</td>
            <td>${purchase.supplierName || 'غير معروف'}</td>
            <td><span class="warehouse-badge">${purchase.warehouseName || 'غير معروف'}</span></td>
            <td>${(purchase.total || 0).toLocaleString()} ج.م</td>
            <td><span class="status-badge status-good">مكتملة</span></td>
            <td>
                <div class="action-btn edit" onclick="viewPurchase(${purchase.id})">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn cart" onclick="printPurchase(${purchase.id})">
                    <i class="fas fa-print"></i>
                </div>
                <div class="action-btn delete" onclick="deletePurchase(${purchase.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        purchasesTableBody.appendChild(row);
    });
}

async function loadSales() {
    try {
        const data = await apiFetch('/sales');
        salesData = data;
        renderSales();
    } catch (error) {
        console.error('Error loading sales:', error);
        salesData = [];
        renderSales();
    }
}

function renderSales() {
    if (!invoicesTableBody) return;
    invoicesTableBody.innerHTML = '';
    if (salesData.length === 0) {
        invoicesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div class="empty-state">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>لا توجد فواتير بيع</h3>
                        <p>ابدأ بإنشاء فاتورة بيع جديدة</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    const sortedSales = [...salesData].sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
    sortedSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.invoiceNumber}</td>
            <td>${new Date(sale.invoiceDate).toLocaleDateString('ar-EG')}</td>
            <td>${sale.customerName || 'عميل نقدي'}</td>
            <td><span class="warehouse-badge">${sale.warehouseName || 'غير معروف'}</span></td>
            <td>${(sale.total || 0).toLocaleString()} ج.م</td>
            <td><span class="status-badge status-good">مكتملة</span></td>
            <td>
                <div class="action-btn edit" onclick="viewSale(${sale.id})">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn cart" onclick="printSale(${sale.id})">
                    <i class="fas fa-print"></i>
                </div>
                <div class="action-btn return" onclick="createReturnFromSale(${sale.id})">
                    <i class="fas fa-undo"></i>
                </div>
                <div class="action-btn delete" onclick="deleteSale(${sale.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        invoicesTableBody.appendChild(row);
    });
}

async function loadReturns() {
    try {
        const data = await apiFetch('/returns');
        returnsData = data;
        renderReturns();
    } catch (error) {
        console.error('Error loading returns:', error);
        returnsData = [];
        renderReturns();
    }
}

function renderReturns() {
    if (!returnsTableBody) return;
    returnsTableBody.innerHTML = '';
    if (returnsData.length === 0) {
        returnsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <div class="empty-state">
                        <i class="fas fa-undo"></i>
                        <h3>لا توجد مرتجعات</h3>
                        <p>لا توجد مرتجعات مسجلة</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    const sortedReturns = [...returnsData].sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
    sortedReturns.forEach(returnItem => {
        let type = 'مرتجع بيع';
        let reference = 'غير معروف';
        if (returnItem.referenceType === 'transfer') {
            type = 'نقل مخزن';
            reference = returnItem.referenceId;
        } else if (returnItem.referenceType === 'sale') {
            type = 'مرتجع بيع';
            reference = `فاتورة #${returnItem.referenceId}`;
        } else if (returnItem.referenceType === 'purchase') {
            type = 'مرتجع شراء';
            reference = `فاتورة #${returnItem.referenceId}`;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${returnItem.returnNumber}</td>
            <td>${new Date(returnItem.returnDate).toLocaleDateString('ar-EG')}</td>
            <td>${type}</td>
            <td>${reference}</td>
            <td>${(returnItem.totalAmount || 0).toLocaleString()} ج.م</td>
            <td>${returnItem.reason || 'غير محدد'}</td>
            <td>
                <div class="action-btn cart" onclick="printReturn(${returnItem.id})">
                    <i class="fas fa-print"></i>
                </div>
                <div class="action-btn delete" onclick="deleteReturn(${returnItem.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        returnsTableBody.appendChild(row);
    });
}

async function loadAlerts() {
    try {
        const data = await apiFetch('/alerts');
        alertsData = data;
        renderAlerts();
    } catch (error) {
        console.error('Error loading alerts:', error);
        alertsData = [];
        renderAlerts();
    }
}

function renderAlerts() {
    if (alertsContainer) {
        alertsContainer.innerHTML = '';
        if (alertsData.length > 0) {
            alertsData.slice(0, 3).forEach(alert => {
                const alertEl = document.createElement('div');
                alertEl.className = `alert-item alert-${alert.severity} p-3 mb-3 rounded-lg`;
                alertEl.style.backgroundColor = alert.severity === 'danger' ? '#fee2e2' : '#ffedd5';
                alertEl.style.border = alert.severity === 'danger' ? '1px solid #fecaca' : '1px solid #fed7aa';
                alertEl.innerHTML = `
                    <p class="${alert.severity === 'danger' ? 'text-red-800' : 'text-orange-800'}">${alert.message}</p>
                    <div class="${alert.severity === 'danger' ? 'text-red-600' : 'text-orange-600'} text-xs mt-1">${formatDate(alert.createdAt)}</div>
                `;
                alertsContainer.appendChild(alertEl);
            });
        } else {
            alertsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>لا توجد تنبيهات</h3>
                    <p>جميع المنتجات ضمن الحدود الآمنة</p>
                </div>
            `;
        }
    }
    if (alertsList) {
        alertsList.innerHTML = '';
        if (alertsData.length > 0) {
            alertsData.forEach(alert => {
                const alertEl = document.createElement('div');
                alertEl.className = `alert-item alert-${alert.severity} p-4 border rounded-lg mb-4`;
                alertEl.style.backgroundColor = alert.severity === 'danger' ? '#fee2e2' : '#ffedd5';
                alertEl.style.border = alert.severity === 'danger' ? '1px solid #fecaca' : '1px solid #fed7aa';
                alertEl.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <p class="text-sm font-medium ${alert.severity === 'danger' ? 'text-red-800' : 'text-orange-800'}">${alert.message}</p>
                            <p class="${alert.severity === 'danger' ? 'text-red-600' : 'text-orange-600'} text-xs mt-1">${formatDate(alert.createdAt)}</p>
                        </div>
                        <button class="text-${alert.severity === 'danger' ? 'red' : 'orange'}-600 hover:text-${alert.severity === 'danger' ? 'red' : 'orange'}-800 p-1" onclick="dismissAlert(${alert.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                alertsList.appendChild(alertEl);
            });
        } else {
            alertsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>لا توجد تنبيهات</h3>
                    <p>جميع المنتجات ضمن الحدود الآمنة</p>
                </div>
            `;
        }
    }
    if (alertCount) {
        alertCount.textContent = alertsData.length;
    }
}

function updateWarehouseSelects() {
    const selects = [
        warehouseFilter,
        productWarehouse,
        purchaseWarehouse,
        saleWarehouse,
        inventoryWarehouse,
        sourceWarehouse,
        destinationWarehouse
    ];
    selects.forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">اختر مخزن</option>';
            warehousesData.forEach(warehouse => {
                const option = document.createElement('option');
                option.value = warehouse.id;
                option.textContent = warehouse.name;
                select.appendChild(option);
            });
        }
    });
}

function updateTransferProductSelect() {
    if (!transferProduct) return;
    transferProduct.innerHTML = '<option value="">اختر منتج</option>';
    inventoryData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.productName} (${item.quantity} وحدة)`;
        transferProduct.appendChild(option);
    });
}

function loadSuppliersSelect(selectElement) {
    if (!selectElement) return;
    selectElement.innerHTML = '<option value="">اختر مورد</option>';
    suppliersData.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.id;
        option.textContent = supplier.name;
        selectElement.appendChild(option);
    });
}

function loadProductsSelect(selectElement) {
    if (!selectElement) return;
    selectElement.innerHTML = '<option value="">اختر منتج</option>';
    inventoryData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.productName} - ${item.warehouseName || 'غير معروف'} (${item.quantity} وحدة)`;
        selectElement.appendChild(option);
    });
}

function getStatusClass(quantity, minStock) {
    if (quantity === 0) return 'status-out';
    if (quantity <= minStock) return 'status-low';
    return 'status-good';
}

function getStatusText(quantity, minStock) {
    if (quantity === 0) return 'نفذ';
    if (quantity <= minStock) return 'منخفض';
    return 'كافي';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function initCharts() {
    // Sales and Purchases Chart
    if (salesPurchasesChart) {
        const ctx1 = salesPurchasesChart.getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
                datasets: [
                    {
                        label: 'المبيعات',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'المشتريات',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value >= 1000000 ? (value / 1000000) + 'M' : value >= 1000 ? (value / 1000) + 'K' : value;
                            }
                        }
                    }
                }
            }
        });
    }
    // Warehouses Chart
    if (warehousesChart) {
        const ctx2 = warehousesChart.getContext('2d');
        new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: warehousesData.map(w => w.name),
                datasets: [{
                    data: warehousesData.map(w => 
                        inventoryData
                            .filter(p => p.warehouseId === w.id)
                            .reduce((sum, p) => sum + (p.quantity * (p.sellingPrice || 0)), 0)
                    ),
                    backgroundColor: [
                        '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    // Reports Charts (empty initially)
    if (reportsChart1) {
        const ctx3 = reportsChart1.getContext('2d');
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'المبيعات',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    if (reportsChart2) {
        const ctx4 = reportsChart2.getContext('2d');
        new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'المشتريات',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: '#f59e0b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Product Functions
function openAddProductModal(inventoryId = null, productId = null) {
    document.getElementById('editProductId').value = inventoryId || '';
    document.getElementById('editProductRealId').value = productId || '';
    loadSuppliersSelect(productSupplier);
    updateWarehouseSelects();
    if (inventoryId && productId) {
        const item = inventoryData.find(p => p.id == inventoryId && p.productId == productId);
        if (item) {
            document.getElementById('productName').value = item.productName || '';
            document.getElementById('productCategory').value = item.categoryName || 'أرز وحبوب';
            document.getElementById('productWarehouse').value = item.warehouseId || '';
            document.getElementById('productBarcode').value = item.barcode || '';
            document.getElementById('productSupplier').value = item.supplierId || '';
            document.getElementById('productQuantity').value = item.quantity || 0;
            document.getElementById('productPrice').value = item.sellingPrice || 0;
            document.getElementById('productPurchasePrice').value = item.costPrice || 0;
            document.getElementById('productMinStock').value = item.minStock || 0;
            document.querySelector('.modal-header h3').textContent = 'تعديل منتج';
            document.getElementById('productWarehouse').disabled = true;
        }
    } else {
        document.getElementById('productName').value = '';
        document.getElementById('productCategory').value = 'أرز وحبوب';
        document.getElementById('productWarehouse').value = '';
        document.getElementById('productBarcode').value = '';
        document.getElementById('productSupplier').value = '';
        document.getElementById('productQuantity').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productPurchasePrice').value = '';
        document.getElementById('productMinStock').value = '';
        document.querySelector('.modal-header h3').textContent = 'إضافة منتج جديد';
        document.getElementById('productWarehouse').disabled = false;
    }
    addProductModal.classList.add('active');
}

function closeAddProductModal() {
    addProductModal.classList.remove('active');
}

async function saveNewProduct() {
    const inventoryId = document.getElementById('editProductId').value;
    const productId = document.getElementById('editProductRealId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const warehouseId = document.getElementById('productWarehouse').value;
    const barcode = document.getElementById('productBarcode').value.trim();
    const supplierId = document.getElementById('productSupplier').value;
    const quantity = parseInt(document.getElementById('productQuantity').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('productPurchasePrice').value) || 0;
    const minStock = parseInt(document.getElementById('productMinStock').value) || 0;
    if (!name || !warehouseId || !supplierId) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    try {
        if (!inventoryId) {
            const existingProduct = inventoryData.find(item => 
                item.productName === name && item.warehouseId == warehouseId
            );
            if (existingProduct) {
                const update = confirm(`المنتج "${name}" موجود بالفعل في المخزن. هل تريد إضافة الكمية إلى المنتج الموجود؟`);
                if (update) {
                    await updateExistingProductQuantity(existingProduct.id, quantity);
                    await loadProducts();
                    closeAddProductModal();
                    showToast('تم تحديث كمية المنتج بنجاح!', 'success');
                    return;
                } else {
                    return;
                }
            }
        }
        const payload = {
            name,
            categoryId: 1,
            barcode: barcode || `PRD${Date.now()}`,
            sku: `SKU${Date.now()}`,
            unit: 'قطعة',
            costPrice: purchasePrice,
            sellingPrice: price,
            minStock,
            maxStock: 1000,
            supplierId: parseInt(supplierId),
            warehouseId: parseInt(warehouseId),
            quantity: quantity
        };
        const result = await apiFetch('/inventory', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        await loadProducts();
        await loadAlerts();
        await loadDashboardStats();
        closeAddProductModal();
        showToast(result.message || 'تم الحفظ بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving product:', error);
        if (error.message.includes('UNIQUE constraint')) {
            showToast('❌ الخطأ: المنتج موجود مسبقاً في هذا المخزن. اختر مخزناً مختلفاً.', 'error');
        } else {
            showToast('خطأ في الحفظ: ' + error.message, 'error');
        }
    }
}

// Warehouse Functions
function openAddWarehouseModal(warehouseId = null) {
    document.getElementById('editWarehouseId').value = warehouseId || '';
    if (warehouseId) {
        const warehouse = warehousesData.find(w => w.id == warehouseId);
        if (warehouse) {
            document.getElementById('warehouseName').value = warehouse.name;
            document.getElementById('warehouseLocation').value = warehouse.location;
            document.getElementById('warehouseManager').value = warehouse.manager;
            document.getElementById('warehousePhone').value = warehouse.phone;
            document.getElementById('warehouseEmail').value = warehouse.email;
            document.getElementById('warehouseNotes').value = warehouse.notes;
            document.querySelector('.modal-header h3').textContent = 'تعديل مخزن';
        }
    } else {
        document.getElementById('warehouseName').value = '';
        document.getElementById('warehouseLocation').value = '';
        document.getElementById('warehouseManager').value = '';
        document.getElementById('warehousePhone').value = '';
        document.getElementById('warehouseEmail').value = '';
        document.getElementById('warehouseNotes').value = '';
        document.querySelector('.modal-header h3').textContent = 'إضافة مخزن جديد';
    }
    addWarehouseModal.classList.add('active');
}

function closeAddWarehouseModal() {
    addWarehouseModal.classList.remove('active');
}

async function saveNewWarehouse() {
    const editId = document.getElementById('editWarehouseId').value;
    const name = document.getElementById('warehouseName').value.trim();
    const location = document.getElementById('warehouseLocation').value.trim();
    const manager = document.getElementById('warehouseManager').value.trim();
    const phone = document.getElementById('warehousePhone').value.trim();
    const email = document.getElementById('warehouseEmail').value.trim();
    const notes = document.getElementById('warehouseNotes').value.trim();
    if (!name || !location || !manager) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    try {
        const payload = {
            name,
            branchId: 1,
            location,
            manager,
            phone,
            email,
            notes
        };
        if (editId) {
            await apiFetch(`/warehouses/${editId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await apiFetch('/warehouses', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        await loadWarehouses();
        closeAddWarehouseModal();
        showToast('تم الحفظ بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving warehouse:', error);
        showToast('خطأ في الحفظ: ' + error.message, 'error');
    }
}

// Purchase Functions
function openAddPurchaseModal() {
    if (warehousesData.length === 0 || suppliersData.length === 0) {
        showToast('يرجى إضافة مخزن ومورد قبل إنشاء فاتورة شراء!', 'error');
        return;
    }
    loadSuppliersSelect(purchaseSupplier);
    updateWarehouseSelects();
    purchaseItemsContainer.innerHTML = '';
    document.getElementById('purchaseNotes').value = '';
    document.getElementById('purchaseDiscount').value = '0';
    purchaseTotal.value = '0 ج.م';
    addPurchaseModal.classList.add('active');
    addPurchaseItem();
}

function closeAddPurchaseModal() {
    addPurchaseModal.classList.remove('active');
}

function addPurchaseItem() {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'form-row purchase-item';
    itemDiv.innerHTML = `
        <div class="form-group">
            <label>المنتج</label>
            <select class="form-control purchase-product" required>
                <option value="">اختر منتج</option>
            </select>
        </div>
        <div class="form-group">
            <label>الكمية</label>
            <input type="number" class="form-control purchase-quantity" min="1" value="1" required>
        </div>
        <div class="form-group">
            <label>سعر الشراء</label>
            <input type="number" class="form-control purchase-price" min="0" step="0.01" value="0" required>
        </div>
        <div class="form-group">
            <label>الإجمالي</label>
            <input type="text" class="form-control purchase-item-total" readonly>
        </div>
        <div class="form-group" style="align-self: flex-end;">
            <button type="button" class="btn btn-danger remove-purchase-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    purchaseItemsContainer.appendChild(itemDiv);
    const productSelect = itemDiv.querySelector('.purchase-product');
    loadProductsSelect(productSelect);
    const quantityInput = itemDiv.querySelector('.purchase-quantity');
    const priceInput = itemDiv.querySelector('.purchase-price');
    const totalInput = itemDiv.querySelector('.purchase-item-total');
    const removeBtn = itemDiv.querySelector('.remove-purchase-item');
    quantityInput.addEventListener('input', () => calculateItemTotal(quantityInput, priceInput, totalInput));
    priceInput.addEventListener('input', () => calculateItemTotal(quantityInput, priceInput, totalInput));
    removeBtn.addEventListener('click', () => itemDiv.remove());
    calculatePurchaseTotal();
}

function calculateItemTotal(quantityInput, priceInput, totalInput) {
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    totalInput.value = total.toLocaleString() + ' ج.م';
    calculatePurchaseTotal();
}

function calculatePurchaseTotal() {
    let subtotal = 0;
    document.querySelectorAll('.purchase-item-total').forEach(input => {
        const value = parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
        subtotal += value;
    });
    const discount = parseFloat(purchaseDiscount.value) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    purchaseTotal.value = total.toLocaleString() + ' ج.م';
}

async function saveNewPurchase() {
    const supplierId = purchaseSupplier.value;
    const warehouseId = purchaseWarehouse.value;
    const discount = parseFloat(purchaseDiscount.value) || 0;
    const notes = document.getElementById('purchaseNotes').value.trim();
    if (!supplierId || !warehouseId) {
        showToast('يرجى اختيار مورد ومخزن!', 'error');
        return;
    }
    const items = [];
    let hasValidItems = false;
    document.querySelectorAll('.purchase-item').forEach(itemDiv => {
        const productId = itemDiv.querySelector('.purchase-product').value;
        const quantity = parseInt(itemDiv.querySelector('.purchase-quantity').value) || 0;
        const price = parseFloat(itemDiv.querySelector('.purchase-price').value) || 0;
        if (productId && quantity > 0 && price > 0) {
            hasValidItems = true;
            items.push({
                productId: parseInt(productId),
                quantity,
                price,
                total: quantity * price
            });
        }
    });
    if (!hasValidItems) {
        showToast('يرجى إضافة منتجات صالحة للفاتورة!', 'error');
        return;
    }
    try {
        const payload = {
            supplierId: parseInt(supplierId),
            warehouseId: parseInt(warehouseId),
            items,
            discount,
            notes
        };
        const result = await apiFetch('/purchases', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        await loadPurchases();
        await loadProducts();
        await loadDashboardStats();
        closeAddPurchaseModal();
        showToast(result.message || 'تم حفظ فاتورة الشراء بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving purchase:', error);
        showToast('خطأ في الحفظ: ' + error.message, 'error');
    }
}

// Sale Functions
function openAddSaleModal() {
    if (warehousesData.length === 0 || customersData.length === 0) {
        showToast('يرجى إضافة مخزن وعميل قبل إنشاء فاتورة بيع!', 'error');
        return;
    }
    updateCustomerSelect();
    updateWarehouseSelects();
    saleItemsContainer.innerHTML = '';
    document.getElementById('saleNotes').value = '';
    document.getElementById('saleDiscount').value = '0';
    saleTotal.value = '0 ج.م';
    addSaleModal.classList.add('active');
    addSaleItem();
}

function closeAddSaleModal() {
    addSaleModal.classList.remove('active');
}

function addSaleItem() {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'form-row sale-item';
    itemDiv.innerHTML = `
        <div class="form-group">
            <label>المنتج</label>
            <select class="form-control sale-product" required>
                <option value="">اختر منتج</option>
            </select>
        </div>
        <div class="form-group">
            <label>الكمية</label>
            <input type="number" class="form-control sale-quantity" min="1" value="1" required>
        </div>
        <div class="form-group">
            <label>السعر</label>
            <input type="number" class="form-control sale-price" min="0" step="0.01" value="0" required>
        </div>
        <div class="form-group">
            <label>الإجمالي</label>
            <input type="text" class="form-control sale-item-total" readonly>
        </div>
        <div class="form-group" style="align-self: flex-end;">
            <button type="button" class="btn btn-danger remove-sale-item">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    saleItemsContainer.appendChild(itemDiv);
    const productSelect = itemDiv.querySelector('.sale-product');
    loadProductsSelect(productSelect);
    const quantityInput = itemDiv.querySelector('.sale-quantity');
    const priceInput = itemDiv.querySelector('.sale-price');
    const totalInput = itemDiv.querySelector('.sale-item-total');
    const removeBtn = itemDiv.querySelector('.remove-sale-item');
    quantityInput.addEventListener('input', () => calculateSaleItemTotal(quantityInput, priceInput, totalInput));
    priceInput.addEventListener('input', () => calculateSaleItemTotal(quantityInput, priceInput, totalInput));
    removeBtn.addEventListener('click', () => itemDiv.remove());
    calculateSaleTotal();
}

function calculateSaleItemTotal(quantityInput, priceInput, totalInput) {
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const total = quantity * price;
    totalInput.value = total.toLocaleString() + ' ج.م';
    calculateSaleTotal();
}

function calculateSaleTotal() {
    let subtotal = 0;
    document.querySelectorAll('.sale-item-total').forEach(input => {
        const value = parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
        subtotal += value;
    });
    const discount = parseFloat(saleDiscount.value) || 0;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;
    saleTotal.value = total.toLocaleString() + ' ج.م';
}

async function saveNewSale() {
    const customerType = document.querySelector('input[name="customerType"]:checked').value;
    let customerId = null;
    if (customerType === 'existing') {
        customerId = saleCustomer.value;
        if (!customerId) {
            showToast('يرجى اختيار عميل من القائمة!', 'error');
            return;
        }
    } else {
        // Create new customer
        const name = newCustomerName.value.trim();
        const phone = newCustomerPhone.value.trim();
        const address = newCustomerAddress.value.trim();
        if (!name) {
            showToast('يرجى إدخال اسم العميل!', 'error');
            return;
        }
        try {
            const customerResult = await apiFetch('/customers', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    phone,
                    address,
                    customerType: 'retail'
                })
            });
            customerId = customerResult.id;
            await loadCustomers();
        } catch (error) {
            console.error('Error creating customer:', error);
            showToast('خطأ في إنشاء العميل: ' + error.message, 'error');
            return;
        }
    }
    const warehouseId = saleWarehouse.value;
    const discount = parseFloat(saleDiscount.value) || 0;
    const notes = document.getElementById('saleNotes').value.trim();
    if (!warehouseId) {
        showToast('يرجى اختيار مخزن!', 'error');
        return;
    }
    const items = [];
    let hasValidItems = false;
    document.querySelectorAll('.sale-item').forEach(itemDiv => {
        const productId = itemDiv.querySelector('.sale-product').value;
        const quantity = parseInt(itemDiv.querySelector('.sale-quantity').value) || 0;
        const price = parseFloat(itemDiv.querySelector('.sale-price').value) || 0;
        if (productId && quantity > 0 && price > 0) {
            hasValidItems = true;
            items.push({
                productId: parseInt(productId),
                quantity,
                price,
                total: quantity * price
            });
        }
    });
    if (!hasValidItems) {
        showToast('يرجى إضافة منتجات صالحة للفاتورة!', 'error');
        return;
    }
    try {
        const payload = {
            customerId: customerId ? parseInt(customerId) : null,
            warehouseId: parseInt(warehouseId),
            items,
            discount,
            notes
        };
        const result = await apiFetch('/sales', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        await loadSales();
        await loadProducts();
        await loadDashboardStats();
        closeAddSaleModal();
        // Print invoice immediately
        const sale = salesData.find(s => s.id == result.id);
        if (sale) {
            printSaleInvoice(sale);
        }
        showToast(result.message || 'تم حفظ فاتورة البيع بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving sale:', error);
        showToast('خطأ في الحفظ: ' + error.message, 'error');
    }
}

// Customer Functions
function openAddCustomerModal(customerId = null) {
    document.getElementById('editCustomerId').value = customerId || '';
    if (customerId) {
        const customer = customersData.find(c => c.id == customerId);
        if (customer) {
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerPhone').value = customer.phone;
            document.getElementById('customerEmail').value = customer.email;
            document.getElementById('customerAddress').value = customer.address;
            document.getElementById('customerBalance').value = customer.balance;
            document.getElementById('customerCreditLimit').value = customer.creditLimit;
            document.getElementById('customerNotes').value = customer.notes;
            document.querySelector('.modal-header h3').textContent = 'تعديل عميل';
        }
    } else {
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerBalance').value = '0';
        document.getElementById('customerCreditLimit').value = '0';
        document.getElementById('customerNotes').value = '';
        document.querySelector('.modal-header h3').textContent = 'إضافة عميل جديد';
    }
    addCustomerModal.classList.add('active');
}

function closeAddCustomerModal() {
    addCustomerModal.classList.remove('active');
}

async function saveNewCustomer() {
    const editId = document.getElementById('editCustomerId').value;
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const balance = parseFloat(document.getElementById('customerBalance').value) || 0;
    const creditLimit = parseFloat(document.getElementById('customerCreditLimit').value) || 0;
    const notes = document.getElementById('customerNotes').value.trim();
    if (!name) {
        showToast('يرجى إدخال اسم العميل!', 'error');
        return;
    }
    try {
        const payload = {
            name,
            phone,
            email,
            address,
            balance,
            creditLimit,
            customerType: 'retail',
            notes
        };
        if (editId) {
            await apiFetch(`/customers/${editId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await apiFetch('/customers', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        await loadCustomers();
        closeAddCustomerModal();
        showToast('تم الحفظ بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving customer:', error);
        showToast('خطأ في الحفظ: ' + error.message, 'error');
    }
}

// Supplier Functions
function openAddSupplierModal(supplierId = null) {
    document.getElementById('editSupplierId').value = supplierId || '';
    if (supplierId) {
        const supplier = suppliersData.find(s => s.id == supplierId);
        if (supplier) {
            document.getElementById('supplierName').value = supplier.name;
            document.getElementById('supplierPhone').value = supplier.phone;
            document.getElementById('supplierEmail').value = supplier.email;
            document.getElementById('supplierAddress').value = supplier.address;
            document.getElementById('supplierBalance').value = supplier.balance;
            document.getElementById('supplierPaymentTerms').value = supplier.paymentTerms;
            document.getElementById('supplierNotes').value = supplier.notes;
            document.querySelector('.modal-header h3').textContent = 'تعديل مورد';
        }
    } else {
        document.getElementById('supplierName').value = '';
        document.getElementById('supplierPhone').value = '';
        document.getElementById('supplierEmail').value = '';
        document.getElementById('supplierAddress').value = '';
        document.getElementById('supplierBalance').value = '0';
        document.getElementById('supplierPaymentTerms').value = 'cash';
        document.getElementById('supplierNotes').value = '';
        document.querySelector('.modal-header h3').textContent = 'إضافة مورد جديد';
    }
    addSupplierModal.classList.add('active');
}

function closeAddSupplierModal() {
    addSupplierModal.classList.remove('active');
}

async function saveNewSupplier() {
    const editId = document.getElementById('editSupplierId').value;
    const name = document.getElementById('supplierName').value.trim();
    const phone = document.getElementById('supplierPhone').value.trim();
    const email = document.getElementById('supplierEmail').value.trim();
    const address = document.getElementById('supplierAddress').value.trim();
    const balance = parseFloat(document.getElementById('supplierBalance').value) || 0;
    const paymentTerms = document.getElementById('supplierPaymentTerms').value;
    const notes = document.getElementById('supplierNotes').value.trim();
    if (!name) {
        showToast('يرجى إدخال اسم المورد!', 'error');
        return;
    }
    try {
        const payload = {
            name,
            phone,
            email,
            address,
            balance,
            paymentTerms,
            notes
        };
        if (editId) {
            await apiFetch(`/suppliers/${editId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await apiFetch('/suppliers', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        await loadSuppliers();
        closeAddSupplierModal();
        showToast('تم الحفظ بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving supplier:', error);
        showToast('خطأ في الحفظ: ' + error.message, 'error');
    }
}

// Inventory Functions
function openInventoryModal() {
    if (warehousesData.length === 0) {
        showToast('لا توجد مخازن للجرد!', 'error');
        return;
    }
    updateWarehouseSelects();
    inventoryItemsContainer.innerHTML = '';
    document.getElementById('inventoryNotes').value = '';
    inventoryModal.classList.add('active');
}

function closeInventoryModalFunc() {
    inventoryModal.classList.remove('active');
}

async function saveInventoryData() {
    showToast('تعديل الجرد غير مدعوم في الواجهة الحالية. يرجى استخدام قاعدة البيانات مباشرة.', 'error');
    closeInventoryModalFunc();
}

// Cart Functions
function toggleCart() {
    cartSidebar.classList.toggle('active');
}

function addToCart(inventoryId, productId) {
    const item = inventoryData.find(p => p.id == inventoryId);
    if (item && item.quantity > 0) {
        const existingItem = cart.find(cartItem => cartItem.id === inventoryId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        if (currentQuantity >= item.quantity) {
            showToast('❗ الكمية غير متوفرة في المخزون!', 'error');
            return;
        }
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: inventoryId,
                productId: productId,
                name: item.productName,
                price: item.sellingPrice || 0,
                quantity: 1,
                warehouseId: item.warehouseId,
                maxAvailable: item.quantity
            });
        }
        updateCart();
    } else {
        showToast('هذا المنتج غير متوفر حالياً!', 'error');
    }
}

function updateCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalCount;
    if (cart.length === 0) {
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>عربة التسوق فارغة</p>
                </div>
            `;
        }
        if (cartTotal) cartTotal.textContent = '0 ج.م';
    } else {
        if (cartItems) {
            cartItems.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const inventoryItem = inventoryData.find(p => p.id == item.id);
                const available = inventoryItem ? inventoryItem.quantity : 0;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString()} ج.م × ${item.quantity}</div>
                        <div class="cart-item-available" style="font-size: 0.75rem; color: #666;">
                            المتوفر: ${available} وحدة
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            if (cartTotal) cartTotal.textContent = `${total.toLocaleString()} ج.م`;
            if (cartItems) {
                document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        updateCartItemQuantity(id, -1);
                    });
                });
                document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        updateCartItemQuantity(id, 1);
                    });
                });
            }
        }
    }
}

function updateCartItemQuantity(inventoryId, change) {
    const item = cart.find(item => item.id === inventoryId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > item.maxAvailable) {
            showToast(`❗ لا يمكن طلب أكثر من ${item.maxAvailable} وحدة!`, 'error');
            return;
        }
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== inventoryId);
        } else {
            item.quantity = newQuantity;
        }
        updateCart();
    }
}

async function checkout() {
    if (cart.length === 0) {
        showToast('عربة التسوق فارغة!', 'error');
        return;
    }
    for (const item of cart) {
        const inventoryItem = inventoryData.find(p => p.id == item.id);
        if (!inventoryItem || inventoryItem.quantity < item.quantity) {
            showToast(`❗ الكمية غير متوفرة: ${item.name}
المتوفر: ${inventoryItem ? inventoryItem.quantity : 0} وحدة`, 'error');
            return;
        }
    }
    try {
        const items = cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
        }));
        const payload = {
            customerId: 1,
            warehouseId: cart[0].warehouseId,
            items,
            discount: 0,
            notes: ''
        };
        const result = await apiFetch('/sales', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        await loadSales();
        await loadProducts();
        await loadDashboardStats();
        cart = [];
        updateCart();
        // Print invoice
        const sale = salesData.find(s => s.id == result.id);
        if (sale) {
            printSaleInvoice(sale);
        }
        showToast(result.message || 'تم البيع بنجاح!', 'success');
    } catch (error) {
        console.error('Error checking out:', error);
        showToast('خطأ في البيع: ' + error.message, 'error');
    }
}

// Transfer Functions
async function transferBetweenWarehouses() {
    const sourceId = sourceWarehouse.value;
    const destinationId = destinationWarehouse.value;
    const inventoryId = transferProduct.value;
    const quantity = parseInt(transferQuantity.value) || 0;
    const reason = transferReason.value.trim();
    if (!sourceId || !destinationId || !inventoryId || quantity <= 0) {
        showToast('يرجى ملء جميع الحقول المطلوبة بشكل صحيح!', 'error');
        return;
    }
    if (sourceId === destinationId) {
        showToast('لا يمكن النقل من مخزن إلى نفسه!', 'error');
        return;
    }
    const sourceItem = inventoryData.find(p => p.id == inventoryId && p.warehouseId == sourceId);
    if (!sourceItem || sourceItem.quantity < quantity) {
        showToast('الكمية غير متوفرة في المخزن المصدر!', 'error');
        return;
    }
    showToast('نقل المنتجات بين المخازن غير مدعوم في الواجهة الحالية. يرجى استخدام قاعدة البيانات مباشرة.', 'error');
}

// Settings Functions
function loadSettings(settings) {
    if (languageSelect) languageSelect.value = settings.language || 'ar';
    if (currencySelect) currencySelect.value = settings.currency || 'EGP';
    if (timezoneSelect) timezoneSelect.value = settings.timezone || 'Africa/Cairo';
    if (lowStockAlert) lowStockAlert.checked = settings.lowStockAlert ? true : false;
    if (fatooraEnabled) fatooraEnabled.checked = settings.fatooraEnabled ? true : false;
    if (fatooraApiKey) fatooraApiKey.value = settings.fatooraApiKey || '';
    if (fatooraBaseUrl) fatooraBaseUrl.value = settings.fatooraBaseUrl || 'https://api.fatoora.com/v1';
}

async function saveSettings() {
    const settings = {
        language: languageSelect.value,
        currency: currencySelect.value,
        timezone: timezoneSelect.value,
        lowStockAlert: lowStockAlert.checked,
        fatooraEnabled: fatooraEnabled.checked,
        fatooraApiKey: fatooraApiKey.value,
        fatooraBaseUrl: fatooraBaseUrl.value
    };
    try {
        await apiFetch('/settings', {
            method: 'POST',
            body: JSON.stringify(settings)
        });
        showToast('تم حفظ الإعدادات بنجاح!', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('خطأ في حفظ الإعدادات: ' + error.message, 'error');
    }
}

async function testFatooraConnectionHandler() {
    const apiKey = fatooraApiKey.value.trim();
    const baseUrl = fatooraBaseUrl.value.trim();
    if (!apiKey || !baseUrl) {
        showToast('يرجى إدخال مفتاح API ورابط API!', 'error');
        return;
    }
    try {
        fatooraTestResult.style.display = 'block';
        fatooraTestResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري اختبار الاتصال...';
        fatooraTestResult.className = 'alert-info';
        const result = await apiFetch('/fatoora/test', {
            method: 'POST',
            body: JSON.stringify({ apiKey, baseUrl })
        });
        fatooraTestResult.innerHTML = '<i class="fas fa-check-circle"></i> ' + result.message;
        fatooraTestResult.className = 'alert-success';
        showToast('تم الاتصال بنجاح بمنصة فاتورة!', 'success');
    } catch (error) {
        console.error('Error testing Fatoora connection:', error);
        fatooraTestResult.innerHTML = '<i class="fas fa-times-circle"></i> ' + (error.message || 'فشل في الاتصال بمنصة فاتورة');
        fatooraTestResult.className = 'alert-danger';
        showToast('فشل في الاتصال بمنصة فاتورة', 'error');
    }
}

// Backup and Restore
function backupData() {
    window.open(`${API_BASE}/backup`, '_blank');
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const backupData = JSON.parse(e.target.result);
            await apiFetch('/restore', {
                method: 'POST',
                body: JSON.stringify(backupData)
            });
            showToast('تم استعادة النسخة الاحتياطية بنجاح!', 'success');
            await loadAllData();
        } catch (error) {
            console.error('Error restoring backup:', error);
            showToast('خطأ في استعادة النسخة الاحتياطية: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Print Functions
function printSaleInvoice(invoice) {
    if (!invoice) {
        showToast('لا توجد فاتورة لطباعتها!', 'error');
        return;
    }
    const warehouse = warehousesData.find(w => w.id === invoice.warehouseId);
    const customer = customersData.find(c => c.id === invoice.customerId);
    printInvoiceDate.textContent = new Date(invoice.invoiceDate).toLocaleDateString('ar-EG');
    printInvoiceNumber.textContent = invoice.invoiceNumber;
    printWarehouseName.textContent = warehouse ? warehouse.name : 'غير معروف';
    printCustomerName.textContent = customer ? customer.name : 'عميل نقدي';
    printInvoiceItems.innerHTML = '';
    // Get invoice items from API
    apiFetch(`/sales/${invoice.id}`)
        .then(fullInvoice => {
            // For now, use the items from the full invoice
            const items = fullInvoice.items || [];
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="border: 1px solid #000; padding: 8px;">${item.productName || 'منتج غير معروف'}</td>
                    <td style="border: 1px solid #000; padding: 8px;">${item.quantity}</td>
                    <td style="border: 1px solid #000; padding: 8px;">${(item.unitPrice || 0).toLocaleString()} ج.م</td>
                    <td style="border: 1px solid #000; padding: 8px;">${(item.totalPrice || 0).toLocaleString()} ج.م</td>
                `;
                printInvoiceItems.appendChild(row);
            });
            printInvoiceTotal.textContent = (invoice.total || 0).toLocaleString() + ' ج.م';
            window.print();
        })
        .catch(error => {
            console.error('Error loading invoice details:', error);
            // Fallback to basic invoice
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #000; padding: 8px;">منتج تجريبي</td>
                <td style="border: 1px solid #000; padding: 8px;">1</td>
                <td style="border: 1px solid #000; padding: 8px;">${(invoice.total || 0).toLocaleString()} ج.م</td>
                <td style="border: 1px solid #000; padding: 8px;">${(invoice.total || 0).toLocaleString()} ج.م</td>
            `;
            printInvoiceItems.appendChild(row);
            printInvoiceTotal.textContent = (invoice.total || 0).toLocaleString() + ' ج.م';
            window.print();
        });
}

// Placeholder functions for unimplemented features
function editProduct(inventoryId, productId) {
    if (!inventoryId || !productId) {
        showToast('خطأ في تحميل المنتج', 'error');
        return;
    }
    openAddProductModal(inventoryId, productId);
}

function deleteProduct(inventoryId, productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        showToast('حذف المنتجات غير مدعوم في الواجهة الحالية.', 'error');
    }
}

function editWarehouse(warehouseId) {
    openAddWarehouseModal(warehouseId);
}

function deleteWarehouse(warehouseId) {
    if (warehousesData.length <= 1) {
        showToast('لا يمكن حذف المخزن الوحيد!', 'error');
        return;
    }
    if (confirm('هل أنت متأكد من حذف هذا المخزن؟')) {
        apiFetch(`/warehouses/${warehouseId}`, { method: 'DELETE' })
            .then(() => {
                loadWarehouses();
                showToast('تم حذف المخزن بنجاح!', 'success');
            })
            .catch(error => {
                console.error('Error deleting warehouse:', error);
                showToast('خطأ في الحذف: ' + error.message, 'error');
            });
    }
}

function startInventory(warehouseId) {
    inventoryWarehouse.value = warehouseId;
    showToast('جرد المخزن غير مدعوم في الواجهة الحالية.', 'error');
    inventoryModal.classList.add('active');
}

function editCustomer(customerId) {
    openAddCustomerModal(customerId);
}

function deleteCustomer(customerId) {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        apiFetch(`/customers/${customerId}`, { method: 'DELETE' })
            .then(() => {
                loadCustomers();
                showToast('تم حذف العميل بنجاح!', 'success');
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
                showToast('خطأ في الحذف: ' + error.message, 'error');
            });
    }
}

function editSupplier(supplierId) {
    openAddSupplierModal(supplierId);
}

function deleteSupplier(supplierId) {
    if (confirm('هل أنت متأكد من حذف هذا المورد؟')) {
        apiFetch(`/suppliers/${supplierId}`, { method: 'DELETE' })
            .then(() => {
                loadSuppliers();
                showToast('تم حذف المورد بنجاح!', 'success');
            })
            .catch(error => {
                console.error('Error deleting supplier:', error);
                showToast('خطأ في الحذف: ' + error.message, 'error');
            });
    }
}

function viewPurchase(purchaseId) {
    const purchase = purchasesData.find(p => p.id == purchaseId);
    if (purchase) {
        alert(`فاتورة شراء #${purchase.orderNumber}
المورد: ${purchase.supplierName || 'غير معروف'}
الإجمالي: ${(purchase.total || 0).toLocaleString()} ج.م`);
    }
}

function printPurchase(purchaseId) {
    showToast('طباعة فاتورة الشراء - سيتم تنفيذها لاحقاً', 'info');
}

function deletePurchase(purchaseId) {
    if (confirm('هل أنت متأكد من حذف فاتورة الشراء؟')) {
        showToast('حذف فواتير الشراء غير مدعوم في الواجهة الحالية.', 'error');
    }
}

function viewSale(saleId) {
    const sale = salesData.find(s => s.id == saleId);
    if (sale) {
        alert(`فاتورة بيع #${sale.invoiceNumber}
العميل: ${sale.customerName || 'عميل نقدي'}
الإجمالي: ${(sale.total || 0).toLocaleString()} ج.م`);
    }
}

function printSale(saleId) {
    const sale = salesData.find(s => s.id == saleId);
    if (sale) {
        printSaleInvoice(sale);
    }
}

function deleteSale(saleId) {
    if (confirm('هل أنت متأكد من حذف فاتورة البيع؟')) {
        showToast('حذف فواتير البيع غير مدعوم في الواجهة الحالية.', 'error');
    }
}

function createReturnFromSale(saleId) {
    showToast('إنشاء مرتجع من فاتورة بيع - سيتم تنفيذها لاحقاً', 'info');
}

function printReturn(returnId) {
    showToast('طباعة المرتجع - سيتم تنفيذها لاحقاً', 'info');
}

function deleteReturn(returnId) {
    if (confirm('هل أنت متأكد من حذف هذا المرتجع؟')) {
        showToast('حذف المرتجعات غير مدعوم في الواجهة الحالية.', 'error');
    }
}

function dismissAlert(alertId) {
    apiFetch(`/alerts/${alertId}/read`, { method: 'PUT' })
        .then(() => {
            alertsData = alertsData.filter(alert => alert.id !== alertId);
            renderAlerts();
        })
        .catch(error => {
            console.error('Error dismissing alert:', error);
            showToast('خطأ في تحديث التنبيه: ' + error.message, 'error');
        });
}

function openTransferModal(inventoryId, productId) {
    transferProduct.value = inventoryId;
    transferQuantity.value = '1';
    transferReason.value = '';
    showPage('warehouses');
}

function createPurchaseFromSupplier(supplierId) {
    purchaseSupplier.value = supplierId;
    openAddPurchaseModal();
}

function createSaleFromCustomer(customerId) {
    saleCustomer.value = customerId;
    openAddSaleModal();
}

// ✅ دالة مساعدة: updateProductQuantity
async function updateProductQuantity(inventoryId, newQuantity) {
    try {
        const productIndex = inventoryData.findIndex(p => p.id == inventoryId);
        if (productIndex !== -1) {
            inventoryData[productIndex].quantity = newQuantity;
            if (newQuantity <= 0) {
                inventoryData[productIndex].quantity = 0;
            }
            renderProducts();
        }
    } catch (error) {
        console.error('Error updating product quantity:', error);
    }
}

async function updateExistingProductQuantity(inventoryId, additionalQuantity) {
    try {
        const existingItem = inventoryData.find(item => item.id == inventoryId);
        if (existingItem) {
            const payload = {
                name: existingItem.productName,
                categoryId: 1,
                barcode: existingItem.barcode,
                unit: 'قطعة',
                costPrice: existingItem.costPrice,
                sellingPrice: existingItem.sellingPrice,
                minStock: existingItem.minStock,
                supplierId: existingItem.supplierId,
                warehouseId: existingItem.warehouseId,
                quantity: additionalQuantity
            };
            await apiFetch('/inventory', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
    } catch (error) {
        throw error;
    }
}
// في script.js - إضافة دوال المحاسبة
async function loadFinancialReports() {
    try {
        const reports = await apiFetch('/accounting/reports');
        updateFinancialDashboard(reports);
    } catch (error) {
        console.error('Error loading financial reports:', error);
    }
}

function updateFinancialDashboard(data) {
    // تحديث إحصائيات المحاسبة
    document.getElementById('cashBalance').textContent = `${data.cashBalance.toLocaleString()} ج.م`;
    document.getElementById('totalRevenue').textContent = `${data.totalRevenue.toLocaleString()} ج.م`;
    document.getElementById('totalExpenses').textContent = `${data.totalExpenses.toLocaleString()} ج.م`;
    document.getElementById('netProfit').textContent = `${data.netProfit.toLocaleString()} ج.م`;
}

// دوال جديدة للتعامل مع الحركات المالية
async function recordCashIn(amount, description, category) {
    const payload = {
        type: 'income',
        amount,
        description,
        category,
        date: new Date().toISOString()
    };
    
    return await apiFetch('/accounting/transactions', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

async function recordCashOut(amount, description, category) {
    const payload = {
        type: 'expense',
        amount,
        description,
        category,
        date: new Date().toISOString()
    };
    
    return await apiFetch('/accounting/transactions', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

// Global Functions for Inline Event Handlers
window.editProduct = editProduct;
window.addToCart = addToCart;
window.editWarehouse = editWarehouse;
window.deleteWarehouse = deleteWarehouse;
window.startInventory = startInventory;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.editSupplier = editSupplier;
window.deleteSupplier = deleteSupplier;
window.viewPurchase = viewPurchase;
window.printPurchase = printPurchase;
window.deletePurchase = deletePurchase;
window.viewSale = viewSale;
window.printSale = printSale;
window.deleteSale = deleteSale;
window.createReturnFromSale = createReturnFromSale;
window.printReturn = printReturn;
window.deleteReturn = deleteReturn;
window.dismissAlert = dismissAlert;
window.openTransferModal = openTransferModal;
window.createPurchaseFromSupplier = createPurchaseFromSupplier;
window.createSaleFromCustomer = createSaleFromCustomer;
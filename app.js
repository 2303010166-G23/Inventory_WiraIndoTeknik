document.addEventListener('DOMContentLoaded', function() {
    const API_URL = window.location.protocol === 'file:' ? null : new URL('api.php', window.location.href).toString();
    const AUTH = { username: 'admin', password: '123456' };

    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'info', timeout = 3200, actionLabel = null, actionCallback = null) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <div class="toast-controls"></div>
        `;

        const controls = toast.querySelector('.toast-controls');
        if (actionLabel && typeof actionCallback === 'function') {
            const actionButton = document.createElement('button');
            actionButton.type = 'button';
            actionButton.className = 'toast-action';
            actionButton.textContent = actionLabel;
            actionButton.addEventListener('click', () => {
                actionCallback();
                hideToast(toast);
            });
            controls.appendChild(actionButton);
        }

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'toast-close';
        closeButton.setAttribute('aria-label', 'Tutup');
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => hideToast(toast));
        controls.appendChild(closeButton);

        toastContainer.appendChild(toast);
        if (timeout > 0) {
            setTimeout(() => hideToast(toast), timeout);
        }
    }

    function hideToast(toast) {
        if (!toast || toast.classList.contains('toast-hide')) return;
        toast.classList.add('toast-hide');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }

    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    function showConfirmDialog(message) {
        return new Promise(resolve => {
            confirmMessage.textContent = message;
            confirmOverlay.classList.add('visible');

            function cleanup(result) {
                confirmOverlay.classList.remove('visible');
                confirmYes.removeEventListener('click', onYes);
                confirmNo.removeEventListener('click', onNo);
                resolve(result);
            }

            function onYes() { cleanup(true); }
            function onNo() { cleanup(false); }

            confirmYes.addEventListener('click', onYes);
            confirmNo.addEventListener('click', onNo);
        });
    }

    const adminMenu = document.getElementById('adminMenu');
    const adminProfileBtn = document.getElementById('adminProfileBtn');
    const adminChangePwdBtn = document.getElementById('adminChangePwdBtn');
    const adminSettingsBtn = document.getElementById('adminSettingsBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    function closeAdminMenu() { adminMenu.classList.remove('visible'); }

    document.querySelectorAll('.page-header .user-badge').forEach(badge => {
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', function(e) {
            e.stopPropagation();
            const rect = badge.getBoundingClientRect();
            adminMenu.style.top = (rect.bottom + 8) + 'px';
            const menuWidth = adminMenu.offsetWidth || 220;
            adminMenu.style.left = (rect.right - menuWidth) + 'px';
            adminMenu.classList.toggle('visible');
        });
    });

    document.addEventListener('click', function() { closeAdminMenu(); });

    adminProfileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeAdminMenu();
        openProfileModal();
    });

    adminChangePwdBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeAdminMenu();
        openPwdModal();
    });

    adminSettingsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeAdminMenu();
        openSettingsModal();
    });

    adminLogoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeAdminMenu();
        showConfirmDialog('Yakin ingin keluar?').then(ok => { if (ok) showLogin(); });
    });

    const profileModal = document.getElementById('profileModal');
    const profileSave = document.getElementById('profileSave');
    const profileCancel = document.getElementById('profileCancel');

    function openProfileModal() {
        profileModal.classList.add('visible');
        document.getElementById('profileName').value = 'Admin';
        document.getElementById('profileEmail').value = 'admin@example.com';
    }

    function closeProfileModal() { profileModal.classList.remove('visible'); }
    profileCancel.addEventListener('click', closeProfileModal);
    profileSave.addEventListener('click', function() {
        alert('Profil disimpan (simulasi).');
        closeProfileModal();
    });

    const pwdModal = document.getElementById('pwdModal');
    const pwdSave = document.getElementById('pwdSave');
    const pwdCancel = document.getElementById('pwdCancel');

    function openPwdModal() { pwdModal.classList.add('visible'); }
    function closePwdModal() { pwdModal.classList.remove('visible'); }
    pwdCancel.addEventListener('click', closePwdModal);
    pwdSave.addEventListener('click', function() {
        const oldPwd = document.getElementById('oldPwd').value;
        const newPwd = document.getElementById('newPwd').value;
        const conf = document.getElementById('confirmNewPwd').value;
        if (!newPwd || newPwd !== conf) {
            alert('Password baru tidak cocok atau kosong.');
            return;
        }
        alert('Password berhasil diubah (simulasi).');
        closePwdModal();
    });

    const settingsModal = document.getElementById('settingsModal');
    const settingsSave = document.getElementById('settingsSave');
    const settingsCancel = document.getElementById('settingsCancel');

    let settings = {
        company: 'PT Wira IndoTeknik',
        theme: 'teal',
        persist: false
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem('app_settings');
            if (raw) {
                const s = JSON.parse(raw);
                settings = Object.assign(settings, s);
            }
        } catch (e) {
            // ignore parse errors
        }
        applySettingsToUI();
    }

    function saveSettingsToStorage() {
        if (settings.persist) {
            localStorage.setItem('app_settings', JSON.stringify(settings));
        } else {
            localStorage.removeItem('app_settings');
        }
    }

    function applySettingsToUI() {
        document.getElementById('settingCompany').value = settings.company;
        document.getElementById('settingTheme').value = settings.theme;
        document.getElementById('settingPersist').checked = !!settings.persist;
        const root = document.documentElement;
        const colors = {
            teal: '#0b6b6b',
            blue: '#0b5f9b',
            green: '#0b8b4f',
            purple: '#5b2b8a'
        };
        root.style.setProperty('--accent', colors[settings.theme] || colors.teal);
    }

    function openSettingsModal() {
        settingsModal.classList.add('visible');
        document.getElementById('settingCompany').value = settings.company;
        document.getElementById('settingTheme').value = settings.theme;
        document.getElementById('settingPersist').checked = !!settings.persist;
    }

    function closeSettingsModal() { settingsModal.classList.remove('visible'); }

    settingsCancel.addEventListener('click', closeSettingsModal);
    settingsSave.addEventListener('click', function() {
        settings.company = document.getElementById('settingCompany').value || settings.company;
        settings.theme = document.getElementById('settingTheme').value || settings.theme;
        settings.persist = !!document.getElementById('settingPersist').checked;
        saveSettingsToStorage();
        applySettingsToUI();
        alert('Pengaturan disimpan.');
        closeSettingsModal();
    });

    let data = {
        barangMasuk: [],
        barangKeluar: [],
        supplier: [],
        nextId: { masuk: 1, keluar: 1, supplier: 1 }
    };
    let backendAvailable = true;

    function getApiUrl(action, extraParams = '') {
        if (!API_URL) return null;
        let url = `${API_URL}?action=${encodeURIComponent(action)}`;
        if (extraParams) url += `&${extraParams}`;
        return url;
    }

    async function checkJsonResponse(response) {
        const text = await response.text();
        if (!response.ok) {
            let json = null;
            try { json = JSON.parse(text); } catch (e) { }
            const message = (json && json.error) ? json.error : `Server error: ${response.status}`;
            throw new Error(message);
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Respons API tidak valid. Pastikan backend PHP berjalan.');
        }
    }

    async function callApi(action, method = 'GET', body = null, extraParams = '') {
        const url = getApiUrl(action, extraParams);
        if (!url) {
            throw new Error('Aplikasi dibuka langsung dari file. Jalankan aplikasi lewat server lokal (misalnya http://localhost) agar backend API dapat diakses.');
        }
        const options = { method, headers: {} };
        if (body !== null) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        return checkJsonResponse(response);
    }

    async function loadData() {
        try {
            data = await callApi('data');
            backendAvailable = true;
        } catch (error) {
            console.error('Backend API unavailable:', error.message);
            data = {
                barangMasuk: [],
                barangKeluar: [],
                supplier: [],
                nextId: { masuk: 1, keluar: 1, supplier: 1 }
            };
            backendAvailable = false;
            const message = API_URL
                ? 'Backend MySQL tidak tersedia. Jalankan aplikasi lewat server lokal dan pastikan database inventaris_tb aktif.'
                : 'Aplikasi dibuka langsung dari file. Jalankan lewat server lokal agar MySQL dapat diakses.';
            showToast(message, 'error', 8000);
        }
        renderAll();
    }

    async function saveEntity(action, item) {
        if (!backendAvailable) {
            showToast('Backend tidak tersedia, data tidak disimpan.', 'error');
            return false;
        }
        try {
            data = await callApi(action, 'POST', item);
            return true;
        } catch (error) {
            showToast('Gagal menyimpan data: ' + error.message, 'error');
            return false;
        }
    }

    async function deleteEntity(entity, id) {
        if (!backendAvailable) {
            showToast('Backend tidak tersedia, data tidak dihapus.', 'error');
            return;
        }
        try {
            data = await callApi('delete', 'POST', null, `entity=${encodeURIComponent(entity)}&id=${encodeURIComponent(id)}`);
        } catch (error) {
            showToast('Gagal menghapus data: ' + error.message, 'error');
            throw error;
        }
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function getToday() {
        return new Date().toISOString().split('T')[0];
    }

    const pageSections = {
        dashboard: document.getElementById('page-dashboard'),
        'barang-masuk': document.getElementById('page-barang-masuk'),
        'barang-keluar': document.getElementById('page-barang-keluar'),
        supplier: document.getElementById('page-supplier'),
        laporan: document.getElementById('page-laporan'),
        login: document.getElementById('page-login')
    };

    const navLinks = document.querySelectorAll('.sidebar-menu a');
    const logoutBtn = document.getElementById('logoutBtn');
    let currentPage = 'dashboard';
    let isLoggedIn = false;

    function showPage(pageId) {
        Object.values(pageSections).forEach(el => el.classList.remove('active'));
        if (pageSections[pageId]) {
            pageSections[pageId].classList.add('active');
        }
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
        currentPage = pageId;
    }

    function showLogin() {
        isLoggedIn = false;
        document.getElementById('sidebar').style.display = 'none';
        document.querySelectorAll('.input-panel-body').forEach(el => el.classList.add('collapsed'));
        ['toggleBarangMasukForm','toggleBarangKeluarForm','toggleSupplierForm'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.innerHTML = '<i class="fas fa-plus"></i> Tambah';
        });
        const userEl = document.getElementById('loginUsername');
        const passEl = document.getElementById('loginPassword');
        if (userEl) { userEl.value = ''; }
        if (passEl) { passEl.value = ''; }
        showPage('login');
        if (userEl) userEl.focus();
    }

    function showApp() {
        isLoggedIn = true;
        document.getElementById('sidebar').style.display = 'flex';
        showPage('dashboard');
        loadData();
    }

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (!username || !password) {
            showToast('Mohon isi username dan password!', 'warning');
            return;
        }
        if (username === AUTH.username && password === AUTH.password) {
            showApp();
        } else {
            showToast('Username atau password salah.', 'error');
            // Clear password field for security
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').focus();
        }
    });

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showConfirmDialog('Yakin ingin keluar?').then(ok => {
            if (ok) showLogin();
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (isLoggedIn && page) {
                showPage(page);
                if (page === 'laporan') renderLaporan();
                if (page === 'dashboard') renderDashboard();
            }
        });
    });

    function renderBarangMasuk() {
        const tbody = document.getElementById('barangMasukBody');
        tbody.innerHTML = data.barangMasuk.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.kode}</td>
                <td>${item.supplier}</td>
                <td>${item.satuan}</td>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.jumlah}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="hapusBarangMasuk(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function renderBarangKeluar() {
        const tbody = document.getElementById('barangKeluarBody');
        tbody.innerHTML = data.barangKeluar.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.kode}</td>
                <td>${item.satuan}</td>
                <td>${formatDate(item.tanggal)}</td>
                <td>${item.jumlah}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="hapusBarangKeluar(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function renderSupplier() {
        const tbody = document.getElementById('supplierBody');
        tbody.innerHTML = data.supplier.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.alamat}</td>
                <td>${item.telepon}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="hapusSupplier(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function renderDashboard() {
        const totalStok = data.barangMasuk.reduce((sum, b) => sum + b.jumlah, 0) -
                          data.barangKeluar.reduce((sum, b) => sum + b.jumlah, 0);
        document.getElementById('statStok').textContent = totalStok;
        document.getElementById('statMasuk').textContent = data.barangMasuk.length;
        document.getElementById('statKeluar').textContent = data.barangKeluar.length;
        document.getElementById('statSupplier').textContent = data.supplier.length;

        const map = new Map();
        data.barangMasuk.forEach(b => {
            if (!map.has(b.kode)) map.set(b.kode, { ...b, jumlah: 0 });
            map.get(b.kode).jumlah += b.jumlah;
        });
        data.barangKeluar.forEach(b => {
            if (!map.has(b.kode)) map.set(b.kode, { ...b, jumlah: 0, supplier: '-' });
            map.get(b.kode).jumlah -= b.jumlah;
        });
        const rows = Array.from(map.values());
        const tbody = document.getElementById('ringkasanStokBody');
        tbody.innerHTML = rows.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.kode}</td>
                <td>${item.satuan || 'Unit'}</td>
                <td>${item.jumlah}</td>
            </tr>
        `).join('');
    }

    function renderLaporan() {
        const map = new Map();
        data.barangMasuk.forEach(b => {
            if (!map.has(b.kode)) map.set(b.kode, { ...b, jumlah: 0 });
            map.get(b.kode).jumlah += b.jumlah;
        });
        data.barangKeluar.forEach(b => {
            if (!map.has(b.kode)) map.set(b.kode, { ...b, jumlah: 0 });
            map.get(b.kode).jumlah -= b.jumlah;
        });
        const rows = Array.from(map.values());
        const tbody1 = document.getElementById('laporanStokBody');
        tbody1.innerHTML = rows.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.kode}</td>
                <td>${item.satuan || 'Unit'}</td>
                <td>${item.jumlah}</td>
            </tr>
        `).join('');

        const riwayat = [];
        data.barangMasuk.forEach(b => riwayat.push({ ...b, ket: 'Masuk' }));
        data.barangKeluar.forEach(b => riwayat.push({ ...b, ket: 'Keluar' }));
        riwayat.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));

        const tbody2 = document.getElementById('laporanRiwayatBody');
        tbody2.innerHTML = riwayat.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${item.nama}</td>
                <td>${item.kode}</td>
                <td>${item.satuan || 'Unit'}</td>
                <td>${item.jumlah}</td>
                <td><span class="${item.ket === 'Masuk' ? 'badge-masuk' : 'badge-keluar'}">${item.ket}</span></td>
                <td>${formatDate(item.tanggal)}</td>
            </tr>
        `).join('');
    }

    function renderAll() {
        renderBarangMasuk();
        renderBarangKeluar();
        renderSupplier();
        renderDashboard();
        renderLaporan();
    }

    async function undoDelete(savedData) {
        if (!savedData) return;
        const { entity, item } = savedData;
        if (!entity || !item) return;

        const actionMap = {
            barangMasuk: 'barangMasuk',
            barangKeluar: 'barangKeluar',
            supplier: 'supplier'
        };
        const action = actionMap[entity];
        if (!action) return;

        try {
            await saveEntity(action, item);
            showToast('Undo berhasil. Data dikembalikan.', 'success');
            renderAll();
        } catch (error) {
            showToast('Undo gagal: ' + error.message, 'error');
        }
    }

    async function confirmAndDelete(entity, id, item) {
        const ok = await showConfirmDialog('Apakah Anda yakin ingin menghapus data ini?');
        if (!ok) return;

        try {
            await deleteEntity(entity, id);
            renderAll();
            showToast('Data berhasil dihapus.', 'success', 8000, 'Undo', () => undoDelete({ entity, item }));
        } catch (error) {
            // deleteEntity sudah menampilkan pesan error jika gagal
        }
    }

    window.hapusBarangMasuk = async function(id) {
        const item = data.barangMasuk.find(entry => entry.id === id);
        await confirmAndDelete('barangMasuk', id, item);
    };

    document.getElementById('toggleBarangMasukForm').addEventListener('click', function() {
        document.getElementById('barangMasukFormPanel').classList.toggle('collapsed');
        this.innerHTML = document.getElementById('barangMasukFormPanel').classList.contains('collapsed')
            ? '<i class="fas fa-plus"></i> Tambah'
            : '<i class="fas fa-minus"></i> Tutup';
    });

    document.getElementById('formBarangMasuk').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newItem = {
            nama: document.getElementById('bmNama').value.trim(),
            kode: document.getElementById('bmKode').value.trim(),
            supplier: document.getElementById('bmSupplier').value.trim(),
            satuan: document.getElementById('bmSatuan').value,
            tanggal: document.getElementById('bmTanggal').value || getToday(),
            jumlah: parseInt(document.getElementById('bmJumlah').value, 10) || 1
        };
        if (!newItem.nama || !newItem.kode || !newItem.supplier) {
            showToast('Mohon lengkapi data!', 'warning');
            return;
        }
        const success = await saveEntity('barangMasuk', newItem);
        if (!success) return;

        this.reset();
        document.getElementById('barangMasukFormPanel').classList.add('collapsed');
        document.getElementById('toggleBarangMasukForm').innerHTML = '<i class="fas fa-plus"></i> Tambah';
        renderAll();
        showToast('Data barang masuk berhasil ditambahkan!', 'success');
    });

    window.hapusBarangKeluar = async function(id) {
        const item = data.barangKeluar.find(entry => entry.id === id);
        await confirmAndDelete('barangKeluar', id, item);
    };

    document.getElementById('toggleBarangKeluarForm').addEventListener('click', function() {
        document.getElementById('barangKeluarFormPanel').classList.toggle('collapsed');
        this.innerHTML = document.getElementById('barangKeluarFormPanel').classList.contains('collapsed')
            ? '<i class="fas fa-plus"></i> Tambah'
            : '<i class="fas fa-minus"></i> Tutup';
    });

    document.getElementById('formBarangKeluar').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newItem = {
            nama: document.getElementById('bkNama').value.trim(),
            kode: document.getElementById('bkKode').value.trim(),
            satuan: document.getElementById('bkSatuan').value,
            tanggal: document.getElementById('bkTanggal').value || getToday(),
            jumlah: parseInt(document.getElementById('bkJumlah').value, 10) || 1
        };
        if (!newItem.nama || !newItem.kode) {
            showToast('Mohon lengkapi data!', 'warning');
            return;
        }
        const success = await saveEntity('barangKeluar', newItem);
        if (!success) return;

        this.reset();
        document.getElementById('barangKeluarFormPanel').classList.add('collapsed');
        document.getElementById('toggleBarangKeluarForm').innerHTML = '<i class="fas fa-plus"></i> Tambah';
        renderAll();
        showToast('Data barang keluar berhasil ditambahkan!', 'success');
    });

    document.getElementById('toggleSupplierForm').addEventListener('click', function() {
        document.getElementById('supplierFormPanel').classList.toggle('collapsed');
        this.innerHTML = document.getElementById('supplierFormPanel').classList.contains('collapsed')
            ? '<i class="fas fa-plus"></i> Tambah'
            : '<i class="fas fa-minus"></i> Tutup';
    });

    document.getElementById('formSupplier').addEventListener('submit', async function(e) {
        e.preventDefault();
        const newItem = {
            nama: document.getElementById('supNama').value.trim(),
            alamat: document.getElementById('supAlamat').value.trim(),
            telepon: document.getElementById('supTelepon').value.trim()
        };
        if (!newItem.nama || !newItem.alamat || !newItem.telepon) {
            showToast('Mohon lengkapi data!', 'warning');
            return;
        }
        const success = await saveEntity('supplier', newItem);
        if (!success) return;

        this.reset();
        document.getElementById('supplierFormPanel').classList.add('collapsed');
        document.getElementById('toggleSupplierForm').innerHTML = '<i class="fas fa-plus"></i> Tambah';
        renderAll();
        showToast('Supplier berhasil ditambahkan!', 'success');
    });

    window.hapusSupplier = async function(id) {
        const item = data.supplier.find(entry => entry.id === id);
        await confirmAndDelete('supplier', id, item);
    };

    document.getElementById('filterLaporanBtn').addEventListener('click', function() {
        renderLaporan();
        showToast('Filter diterapkan (data tetap ditampilkan semua untuk demo)', 'success');
    });

    document.getElementById('exportPdfBtn').addEventListener('click', function() {
        showToast('Fitur Export PDF: Data laporan akan diekspor ke PDF. (Gunakan fitur print browser)', 'info', 5200);
        window.print();
    });

    document.getElementById('bmTanggal').value = getToday();
    document.getElementById('bkTanggal').value = getToday();

    loadSettings();
    showLogin();
});

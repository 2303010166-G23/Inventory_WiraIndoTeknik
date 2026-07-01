<?php
header('Content-Type: application/json; charset=UTF-8');

// Database MySQL yang digunakan oleh backend.
// Jika Anda menggunakan phpMyAdmin di XAMPP, pastikan database inventaris_tb sudah dibuat
// dan gunakan kredensial yang sesuai dengan konfigurasi MySQL Anda.
$host = '127.0.0.1';
$dbname = 'inventaris_tb';
$username = 'root';
$password = '';

function getPdo($host, $dbname, $username, $password): ?PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

function fetchData(PDO $pdo): array {
    $barangMasuk = $pdo->query("SELECT id, nama, kode, supplier, satuan, tanggal, jumlah FROM barang_masuk ORDER BY id DESC")->fetchAll();
    $barangKeluar = $pdo->query("SELECT id, nama, kode, satuan, tanggal, jumlah FROM barang_keluar ORDER BY id DESC")->fetchAll();
    $supplier = $pdo->query("SELECT id, nama, alamat, telepon FROM supplier ORDER BY id DESC")->fetchAll();

    return [
        'barangMasuk' => $barangMasuk,
        'barangKeluar' => $barangKeluar,
        'supplier' => $supplier,
        'nextId' => [
            'masuk' => intval($pdo->query("SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM barang_masuk")->fetchColumn()) ?: 1,
            'keluar' => intval($pdo->query("SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM barang_keluar")->fetchColumn()) ?: 1,
            'supplier' => intval($pdo->query("SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM supplier")->fetchColumn()) ?: 1,
        ]
    ];
}

$pdo = getPdo($host, $dbname, $username, $password);
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($action === 'data') {
    if (!$pdo instanceof PDO) {
        http_response_code(500);
        echo json_encode(['error' => 'Database MySQL tidak tersedia. Pastikan phpMyAdmin atau server MySQL aktif.']);
        exit;
    }

    echo json_encode(fetchData($pdo));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['error' => 'Metode tidak didukung.']);
    exit;
}

if (!$pdo instanceof PDO) {
    http_response_code(500);
    echo json_encode(['error' => 'Database MySQL tidak tersedia. Pastikan phpMyAdmin atau server MySQL aktif.']);
    exit;
}

switch ($action) {
    case 'barangMasuk':
        if (empty($input['nama']) || empty($input['kode']) || empty($input['supplier'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nama, kode, dan supplier wajib diisi.']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO barang_masuk (nama, kode, supplier, satuan, tanggal, jumlah) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['nama'],
            $input['kode'],
            $input['supplier'],
            $input['satuan'] ?? 'Unit',
            $input['tanggal'] ?? date('Y-m-d'),
            intval($input['jumlah'] ?? 1)
        ]);
        echo json_encode(fetchData($pdo));
        exit;

    case 'barangKeluar':
        if (empty($input['nama']) || empty($input['kode'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nama dan kode wajib diisi.']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO barang_keluar (nama, kode, satuan, tanggal, jumlah) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['nama'],
            $input['kode'],
            $input['satuan'] ?? 'Unit',
            $input['tanggal'] ?? date('Y-m-d'),
            intval($input['jumlah'] ?? 1)
        ]);
        echo json_encode(fetchData($pdo));
        exit;

    case 'supplier':
        if (empty($input['nama']) || empty($input['alamat']) || empty($input['telepon'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nama, alamat, dan telepon wajib diisi.']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO supplier (nama, alamat, telepon) VALUES (?, ?, ?)");
        $stmt->execute([
            $input['nama'],
            $input['alamat'],
            $input['telepon']
        ]);
        echo json_encode(fetchData($pdo));
        exit;

    case 'delete':
        $entity = $_GET['entity'] ?? '';
        $id = intval($_GET['id'] ?? 0);
        if (!$entity || $id <= 0 || !in_array($entity, ['barangMasuk', 'barangKeluar', 'supplier'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Parameter entity atau id tidak valid.']);
            exit;
        }

        $tableMap = [
            'barangMasuk' => 'barang_masuk',
            'barangKeluar' => 'barang_keluar',
            'supplier' => 'supplier'
        ];
        $table = $tableMap[$entity];
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(fetchData($pdo));
        exit;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Aksi tidak dikenal.']);
        exit;
}

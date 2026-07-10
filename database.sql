CREATE DATABASE IF NOT EXISTS inventaris_tb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventaris_tb;

DROP TABLE IF EXISTS barang_keluar;
DROP TABLE IF EXISTS barang_masuk;
DROP TABLE IF EXISTS supplier;

CREATE TABLE supplier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  alamat VARCHAR(255) NOT NULL,
  telepon VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE barang_masuk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  kode VARCHAR(50) NOT NULL,
  supplier VARCHAR(150) NOT NULL,
  satuan VARCHAR(50) DEFAULT 'Unit',
  tanggal DATE NOT NULL,
  jumlah INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE barang_keluar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  kode VARCHAR(50) NOT NULL,
  satuan VARCHAR(50) DEFAULT 'Unit',
  tanggal DATE NOT NULL,
  jumlah INT NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO supplier (nama, alamat, telepon) VALUES
('PT. BMC', 'Mangga Besar, Jakarta', '021-111-222'),
('PT. TIRIS INDO', 'Glodok, Jakarta', '021-222-333'),
('PT. WISMA 77', 'Kebon Jeruk, Jakarta', '021-333-444');

INSERT INTO barang_masuk (nama, kode, supplier, satuan, tanggal, jumlah) VALUES
('Copeland ZR36', 'AC-0001', 'PT. WISMA 77', 'Unit', '2026-01-01', 5),
('Copeland ZR47', 'AC-0002', 'PT. WISMA 77', 'Unit', '2026-01-01', 5),
('Copeland ZR61', 'AC-0003', 'PT. WISMA 77', 'Unit', '2026-01-01', 5),
('Copeland ZR81', 'AC-0004', 'PT. WISMA 77', 'Unit', '2026-01-01', 5),
('Kulthorn AE2410Y', 'KLS-0002', 'PT. BMC', 'Unit', '2026-01-01', 5),
('Daikin FTXS25L', 'AC-0005', 'PT. BMC', 'Unit', '2026-01-05', 4),
('Midea MSE-09HR', 'KLS-0004', 'PT. TIRIS INDO', 'Unit', '2026-01-07', 3),
('Panasonic CS-PU9RKD', 'AC-0006', 'PT. WISMA 77', 'Unit', '2026-01-08', 6),
('LG DualCool', 'KLS-0005', 'PT. BMC', 'Unit', '2026-01-09', 2);

INSERT INTO barang_keluar (nama, kode, satuan, tanggal, jumlah) VALUES
('Copeland ZR36', 'AC-0001', 'Unit', '2026-01-20', 2),
('Copeland ZR47', 'AC-0002', 'Unit', '2026-01-15', 2),
('Copeland ZR61', 'AC-0003', 'Unit', '2026-01-11', 5),
('Copeland ZR81', 'AC-0004', 'Unit', '2026-01-11', 2),
('Kulthorn AE4440Y', 'KLS-0003', 'Unit', '2026-01-10', 2),
('Daikin FTXS25L', 'AC-0005', 'Unit', '2026-01-21', 1),
('Midea MSE-09HR', 'KLS-0004', 'Unit', '2026-01-22', 1),
('Panasonic CS-PU9RKD', 'AC-0006', 'Unit', '2026-01-23', 2),
('LG DualCool', 'KLS-0005', 'Unit', '2026-01-24', 1);

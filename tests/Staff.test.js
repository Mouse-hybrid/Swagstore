'use strict';

const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Account = require('../models/Account');
const authController = require('../controllers/authController');

const productFile = path.join(__dirname, '..', 'data', 'products.json');

describe('Tính năng nâng cao - Quyền hạn Staff', () => {
  let originalProducts;

  beforeAll(() => {
    // Lưu lại dữ liệu gốc để khôi phục sau khi kết thúc test
    originalProducts = fs.readFileSync(productFile, 'utf8');
  });

  beforeEach(() => {
    fs.writeFileSync(productFile, '[]');
  });

  afterAll(() => {
    fs.writeFileSync(productFile, originalProducts);
  });

  // 1. Kiểm thử CRUD sản phẩm từ Model
  test('Staff thêm sản phẩm mới thành công', () => {
    const newProd = Product.add({
      name: 'Staff Test Product',
      price: 150000,
      category: 'Apparel',
      type: 'T-Shirt'
    });

    expect(newProd.id).toBeDefined();
    expect(Product.getAll()).toHaveLength(1);
  });

  test('Staff chỉnh sửa giá sản phẩm thành công', () => {
    const prod = Product.add({ name: 'Old Product', price: 100, category: 'Outdoor', type: 'Gear' });
    const updated = Product.update(prod.id, { price: 250 });
    
    expect(updated.price).toBe(250);
    expect(Product.getById(prod.id).price).toBe(250);
  });

  test('Staff xóa sản phẩm khỏi danh sách thành công', () => {
    const prod = Product.add({ name: 'Delete Me', price: 50, category: 'Accessories', type: 'Watch' });
    const result = Product.delete(prod.id);
    
    expect(result).toBe(true);
    expect(Product.getAll()).toHaveLength(0);
  });

  // 2. Kiểm thử Middleware phân quyền Staff
  test('Middleware chặn truy cập khi role không phải staff', () => {
    const req = {
      session: { user: { name: 'Customer User', role: 'customer' } }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const next = jest.fn();

    authController.requireStaff(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Staff only'));
  });

  test('Middleware cho phép đi tiếp khi user là staff', () => {
    const req = {
      session: { user: { name: 'Staff User', role: 'staff' } }
    };
    const res = {};
    const next = jest.fn();

    authController.requireStaff(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
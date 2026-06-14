'use strict';

// Import các module lõi và thư viện cần thiết phục vụ quá trình test
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Account = require('../models/Account');
const authController = require('../controllers/authController');

// Đường dẫn file lưu trữ dữ liệu test cục bộ
const productFile = path.join(__dirname, '..', 'data', 'products.json');

describe('Tính năng nâng cao - Quyền hạn Staff', () => {
  let originalProducts;

  // Lifecycle Hook: Chạy DUY NHẤT một lần trước khi tất cả các test case bắt đầu chạy
  beforeAll(() => {
    // Đọc và sao lưu lại dữ liệu sản phẩm thật của dự án nhằm tránh bị xóa mất khi test
    originalProducts = fs.readFileSync(productFile, 'utf8');
  });

  // Lifecycle Hook: Tự động chạy lại trước MỖI test case bên dưới
  beforeEach(() => {
    // Xóa sạch kho hàng, thiết lập về mảng rỗng '[]' để tạo môi trường test độc lập, cô lập
    fs.writeFileSync(productFile, '[]');
  });

  // Lifecycle Hook: Chạy DUY NHẤT một lần sau khi toàn bộ các test case kết thúc
  afterAll(() => {
    // Khôi phục lại nguyên trạng dữ liệu sản phẩm thật ban đầu cho dự án Swagstore
    fs.writeFileSync(productFile, originalProducts);
  });

  // =========================================================================
  // NHÓM KIỂM THỬ 1: Kiểm thử các hàm nghiệp vụ CRUD sản phẩm từ lớp Model
  // =========================================================================

  test('Staff thêm sản phẩm mới thành công', () => {
    // 1. Arrange (Chuẩn bị dữ liệu đầu vào)
    const mockData = {
      name: 'Staff Test Product',
      price: 150000,
      category: 'Apparel',
      type: 'T-Shirt'
    };

    // 2. Act (Thực thi hàm cần kiểm thử nghiệp vụ)
    const newProd = Product.add(mockData);

    // 3. Assert (Khẳng định/Kiểm tra tính đúng đắn của kết quả trả về)
    expect(newProd.id).toBeDefined();           // Đảm bảo sản phẩm sinh ra phải có ID duy nhất
    expect(Product.getAll()).toHaveLength(1);   // Khẳng định tổng số lượng sản phẩm trong kho tăng lên 1
  });

  test('Staff chỉnh sửa giá sản phẩm thành công', () => {
    // 1. Arrange: Khởi tạo trước một sản phẩm có giá trị ban đầu là 100
    const prod = Product.add({ name: 'Old Product', price: 100, category: 'Outdoor', type: 'Gear' });
    
    // 2. Act: Thực hiện cập nhật đổi giá sản phẩm thành 250
    const updated = Product.update(prod.id, { price: 250 });
    
    // 3. Assert: Xác thực giá của đối tượng phản hồi và bản ghi trong DB giả lập đều đã sang 250
    expect(updated.price).toBe(250);
    expect(Product.getById(prod.id).price).toBe(250);
  });

  test('Staff xóa sản phẩm khỏi danh sách thành công', () => {
    // 1. Arrange: Khởi tạo một mặt hàng cần xóa trong kho dữ liệu trống
    const prod = Product.add({ name: 'Delete Me', price: 50, category: 'Accessories', type: 'Watch' });
    
    // 2. Act: Kích hoạt hàm xử lý xóa dựa trên ID sản phẩm vừa tạo
    const result = Product.delete(prod.id);
    
    // 3. Assert: Kiểm tra hàm trả về trạng thái true và tổng độ dài mảng kho hàng phải trở về bằng 0
    expect(result).toBe(true);
    expect(Product.getAll()).toHaveLength(0);
  });

  // =========================================================================
  // NHÓM KIỂM THỬ 2: Kiểm thử Middleware xử lý phân quyền vai trò người dùng (Staff Role)
  // =========================================================================

  test('Middleware chặn truy cập khi role không phải staff', () => {
    // 1. Arrange: Giả lập đối tượng Request (với role là customer - Khách hàng thường)
    const req = {
      session: { user: { name: 'Customer User', role: 'customer' } }
    };
    // Giả lập đối tượng Response chứa hàm kiểm tra mã trạng thái của thư viện Jest (jest.fn())
    const res = {
      status: jest.fn().mockReturnThis(), // Cho phép gọi chuỗi method liên tục (Chaining)
      send: jest.fn()
    };
    const next = jest.fn(); // Hàm next() giả lập để check luồng đi tiếp

    // 2. Act: Truyền các đối tượng giả lập vào luồng kiểm tra phân quyền middleware
    authController.requireStaff(req, res, next);

    // 3. Assert: Xác thực tính bảo mật hệ thống
    expect(next).not.toHaveBeenCalled();                     // Khẳng định hệ thống KHÔNG cho phép đi tiếp
    expect(res.status).toHaveBeenCalledWith(403);            // Bắt buộc phải trả về mã lỗi từ chối truy cập 403 Forbidden
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Staff only')); // Trả về text cảnh báo lỗi
  });

  test('Middleware cho phép đi tiếp khi user là staff', () => {
    // 1. Arrange: Giả lập đối tượng đăng nhập hợp lệ với vai trò là 'staff'
    const req = {
      session: { user: { name: 'Staff User', role: 'staff' } }
    };
    const res = {};
    const next = jest.fn(); // Tạo hàm kiểm toán xem có được kích hoạt đi tiếp hay không

    // 2. Act: Gọi hàm middleware kiểm thử phân quyền thích hợp
    authController.requireStaff(req, res, next);

    // 3. Assert: Khẳng định hàm đi tiếp (next()) phải được gọi để người dùng truy cập trang thành công
    expect(next).toHaveBeenCalled();
  });
});
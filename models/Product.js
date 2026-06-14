'use strict';

// Import các module lõi của Node.js để tương tác với hệ thống tệp và đường dẫn
const fs = require('fs');
const path = require('path');

// Import model liên quan và file dữ liệu danh mục tĩnh
const Category = require('./Category');
const types = require('../data/types.json');

// Xác định đường dẫn tuyệt đối dẫn đến tệp cơ sở dữ liệu giả lập JSON lưu sản phẩm
const dataFile = path.join(__dirname, '..', 'data', 'products.json');

/**
 * Hàm trợ giúp: Đọc dữ liệu từ tệp JSON và chuyển đổi thành mảng JavaScript
 * @returns {Array} Danh sách sản phẩm hiện tại
 */
function readProducts() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    // Nếu tệp có dữ liệu thì chuyển đổi JSON -> Object, ngược lại trả về mảng rỗng
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    // Trả về mảng rỗng nếu gặp lỗi trong quá trình đọc file (ví dụ: file chưa tồn tại)
    return [];
  }
}

/**
 * Hàm trợ giúp: Ghi mảng đối tượng sản phẩm ngược lại vào tệp JSON
 * @param {Array} products - Danh sách sản phẩm cần lưu trữ
 */
function writeProducts(products) {
  // Ghi tệp đồng bộ kèm định dạng thụt lề 2 khoảng trắng để dễ đọc file
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

class Product {
  /**
   * Lấy toàn bộ danh sách sản phẩm trong hệ thống
   * @returns {Array}
   */
  static getAll() { 
    return readProducts(); 
  }
  
  /**
   * Tìm kiếm một sản phẩm cụ thể dựa theo ID định danh
   * @param {number|string} id - ID của sản phẩm cần tìm
   * @returns {Object|undefined} Đối tượng sản phẩm hoặc undefined nếu không tìm thấy
   */
  static getById(id) { 
    return readProducts().find(p => p.id === Number(id)); 
  }
  
  /**
   * Lấy danh sách toàn bộ các Category (Danh mục) hiện có
   */
  static getCategories() {
    return Category.getAll();
  }
  
  /**
   * Lấy danh sách các loại sản phẩm (types) tĩnh
   */
  static getTypes() {
    return types;
  }

  // =========================================================================
  // --- THÊM MỚI: Các hàm xử lý nghiệp vụ CRUD dành riêng cho vai trò Staff ---
  // =========================================================================

  /**
   * Nghiệp vụ: Staff thêm mới một sản phẩm vào kho hàng
   * @param {Object} productData - Dữ liệu đầu vào của sản phẩm mới
   * @returns {Object} Đối tượng sản phẩm vừa tạo thành công kèm ID
   */
  static add({ name, price, category, type, image }) {
    // Ràng buộc dữ liệu: Bắt buộc phải điền đầy đủ các thông tin cốt lõi
    if (!name || !price || !category || !type) {
      throw new Error('Name, price, category, and type are required.');
    }

    const products = readProducts(); // Đọc trạng thái kho hiện tại

    // Tạo đối tượng sản phẩm mới chuẩn hóa dữ liệu
    const newProduct = {
      id: Date.now(),                     // Sử dụng Timestamp làm ID duy nhất tự động tăng
      name: String(name).trim(),          // Cắt bỏ khoảng trắng dư thừa ở hai đầu tên
      price: Number(price),               // Ép kiểu dữ liệu về dạng số thực/số nguyên
      category: String(category).trim(),
      type: String(type).trim(),
      image: image || '/images/default.jpg' // Điền ảnh mặc định nếu Staff không tải lên hình ảnh
    };

    products.push(newProduct);      // Đẩy sản phẩm mới vào mảng danh sách
    writeProducts(products);        // Cập nhật và lưu lại dữ liệu xuống tệp products.json
    return newProduct;              // Trả về thông tin sản phẩm vừa tạo
  }

  /**
   * Nghiệp vụ: Staff cập nhật thông tin chỉnh sửa của một sản phẩm
   * @param {number|string} id - ID sản phẩm cần chỉnh sửa
   * @param {Object} fields - Các trường dữ liệu mới cần thay đổi (ví dụ: { price: 200 })
   * @returns {Object} Đối tượng sản phẩm sau khi cập nhật thành công
   */
  static update(id, fields) {
    const products = readProducts();
    // Tìm kiếm vị trí index của sản phẩm mục tiêu trong mảng kho dữ liệu
    const idx = products.findIndex(p => p.id === Number(id));
    
    // Nếu không tìm thấy sản phẩm trùng khớp ID, ném lỗi ra hệ thống
    if (idx === -1) throw new Error('Product not found.');
    
    // Tiến hành merger đè dữ liệu mới lên object cũ bằng cú pháp Spread Operator
    products[idx] = { ...products[idx], ...fields };
    
    // Đảm bảo trường giá (price) luôn được ép chuẩn định dạng dữ liệu Số (Number)
    if (fields.price) products[idx].price = Number(fields.price);
    
    writeProducts(products); // Ghi nhận thay đổi xuống file lưu trữ dữ liệu
    return products[idx];    // Trả về bản ghi mới sau khi sửa đổi
  }

  /**
   * Nghiệp vụ: Staff thực hiện xóa bỏ hoàn toàn một sản phẩm khỏi danh sách kho
   * @param {number|string} id - ID của sản phẩm cần xóa xóa
   * @returns {boolean} Trả về true nếu thao tác thành công
   */
  static delete(id) {
    const products = readProducts();
    // Tạo mảng mới loại bỏ sản phẩm có ID trùng khớp ra ngoài (áp dụng bộ lọc filter)
    const filtered = products.filter(p => p.id !== Number(id));
    
    // Kiểm tra độ dài: Nếu độ dài mảng không đổi nghĩa là không tìm thấy ID cần xóa
    if (products.length === filtered.length) throw new Error('Product not found.');
    
    writeProducts(filtered); // Lưu danh sách kho hàng mới đã loại bỏ sản phẩm xuống file
    return true;             // Xác nhận xóa thành công
  }
}

// Xuất module Product ra ngoài hệ thống để sử dụng tại các file Controller và Test
module.exports = Product;
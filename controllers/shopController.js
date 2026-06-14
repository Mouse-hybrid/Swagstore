'use strict';

// Import toàn bộ các mô hình nghiệp vụ liên quan đến luồng vận hành cửa hàng
const Product  = require('../models/Product');
const Category = require('../models/Category');
const Cart     = require('../models/Cart');
const Order    = require('../models/Order');

// Hàm trợ giúp đọc thông tin giỏ hàng hiện tại trong Session
function getCart(req) {
  return new Cart(req.session.cart || {});
}

// Hàm trợ giúp lưu lại trạng thái giỏ hàng sau khi tính toán ngược lại vào Session dưới dạng dữ liệu thô JSON
function saveCart(req, cart) {
  req.session.cart = cart.toJSON();
}

/**
 * Điều hướng + Nghiệp vụ: Hiển thị cửa hàng, xử lý bộ lọc (Filter) và sắp xếp (Sort) sản phẩm (GET /)
 */
exports.showShop = (req, res) => {
  const { category, type, sort } = req.query; // Đọc các tham số lọc từ URL (Query params)
  let products = Product.getAll(); // Đọc toàn bộ kho hàng từ file products.json lên bộ nhớ

  // Bộ lọc 1: Lọc theo Danh mục sản phẩm (Category) nếu tham số khác 'all'
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  
  // Bộ lọc 2: Lọc theo Loại mặt hàng (Type) nếu tham số khác 'all'
  if (type && type !== 'all') {
    products = products.filter(p => p.type === type);
  }
  
  // Xử lý Sắp xếp (Sorting):
  if (sort === 'price-asc')  products.sort((a, b) => a.price - b.price); // Giá tăng dần
  if (sort === 'price-desc') products.sort((a, b) => b.price - a.price); // Giá giảm dần
  if (sort === 'name')       products.sort((a, b) => a.name.localeCompare(b.name)); // Theo bảng chữ cái tên

  const cart = getCart(req);
  // Đổ dữ liệu đã xử lý ra trang shop.hbs kèm theo trạng thái active hiện tại của các bộ lọc
  res.render('shop', {
    products,
    categories: Category.getAll(),
    types:      Product.getTypes(),
    activeCategory: category || 'all',
    activeType:     type     || 'all',
    activeSort:     sort     || 'default',
    cartCount:      cart.count,
  });
};

/**
 * Nghiệp vụ: Xử lý thêm một sản phẩm vào Giỏ hàng (POST /cart/add)
 */
exports.addToCart = (req, res) => {
  // Tìm kiếm xem ID sản phẩm gửi lên từ giao diện có tồn tại thực tế trong kho không
  const product = Product.getById(req.body.productId);
  if (!product) return res.status(404).send('Product not found');
  
  const cart = getCart(req);
  cart.add(product, 1); // Tăng số lượng sản phẩm đó lên 1 trong giỏ hàng
  saveCart(req, cart);  // Đồng bộ hóa giỏ hàng vào Session
  
  // Trải nghiệm người dùng tốt (UX): Quay lại đúng trang sản phẩm trước đó thay vì đẩy về trang chủ
  const referer = req.headers.referer || '/';
  res.redirect(referer);
};

/**
 * Điều hướng: Hiển thị chi tiết danh sách đồ trong Giỏ hàng (GET /cart)
 */
exports.showCart = (req, res) => {
  const cart = getCart(req);
  res.render('cart', {
    lines:     cart.lines,    // Chi tiết từng dòng sản phẩm (Tên, ảnh, giá lẻ, số lượng)
    subtotal:  cart.subtotal, // Tổng tiền hàng thô chưa thuế
    tax:       cart.tax,      // Thuế VAT tính toán hệ thống
    total:     cart.total,    // Thành tiền cuối cùng phải trả
    cartCount: cart.count,
    empty:     cart.count === 0, // Cờ kiểm tra xem giỏ hàng có trống không để ẩn hiện UI thích hợp
  });
};

/**
 * Nghiệp vụ: Cập nhật lại số lượng của một mặt hàng trong trang giỏ hàng (POST /cart/update)
 */
exports.updateCart = (req, res) => {
  const { productId, qty } = req.body;
  const cart = getCart(req);
  cart.updateQty(productId, Number(qty)); // Thiết lập số lượng mới (ép kiểu về Number)
  saveCart(req, cart);
  res.redirect('/cart'); // Tải lại trang giỏ hàng để cập nhật lại tổng tiền trên UI
};

/**
 * Nghiệp vụ: Xóa một dòng sản phẩm ra khỏi giỏ hàng (POST /cart/remove)
 */
exports.removeFromCart = (req, res) => {
  const cart = getCart(req);
  cart.remove(req.body.productId); // Gọi method xóa mã sản phẩm mục tiêu
  saveCart(req, cart);
  res.redirect('/cart');
};

/**
 * Nghiệp vụ: Xóa sạch toàn bộ sản phẩm đang có trong giỏ (POST /cart/clear)
 */
exports.clearCart = (req, res) => {
  const cart = getCart(req);
  cart.clear(); // Reset giỏ hàng về mảng rỗng ban đầu
  saveCart(req, cart);
  res.redirect('/cart');
};

/**
 * Điều hướng: Hiển thị form thông tin và Tổng kết đơn hàng (GET /checkout)
 */
exports.showCheckout = (req, res) => {
  const cart = getCart(req);
  // Phòng chống lỗi phá luồng: Nếu giỏ hàng trống rỗng, không cho vào checkout mà đẩy về trang giỏ hàng
  if (cart.count === 0) return res.redirect('/cart');
  
  const user = req.session.user || {}; // Đọc thông tin cá nhân của tài khoản đăng nhập để tự động điền form (Autofill)
  res.render('checkout', {
    lines:     cart.lines,
    subtotal:  cart.subtotal,
    tax:       cart.tax,
    total:     cart.total,
    cartCount: cart.count,
    name:      user.name || '',
    email:     user.email || '',
    address:   user.address || '',
  });
};

/**
 * Điều hướng: Xem lại lịch sử mua hàng cá nhân (GET /order-history)
 */
exports.showOrderHistory = (req, res) => {
  const cart = getCart(req);
  const userId = req.session.user?.id; // Lấy ID của tài khoản đang đăng nhập
  const orders = Order.getByUserId(userId); // Truy vấn toàn bộ đơn hàng có userId trùng khớp
  res.render('order-history', {
    orders,
    cartCount: cart.count,
  });
};

/**
 * Nghiệp vụ cốt lõi: Xử lý đặt hàng thành công và thanh toán đơn hàng (POST /checkout)
 */
exports.placeOrder = (req, res) => {
  const cart = getCart(req);
  if (cart.count === 0) return res.redirect('/cart');
  const user = req.session.user || {};

  // Luồng mặc định cho Khách hàng thường: Đơn hàng thuộc về chính tài khoản đăng nhập hiện hành
  let targetUserId = user.id;
  let targetEmail = user.email;

  //  NGHIỆP VỤ ĐẶC THỦ NÂNG CAO: Staff đặt đơn hàng hộ Khách hàng tại quầy 
  
  if (user.role === 'staff' && req.body.customerEmail) {
    // Nhân viên Staff nhập vào Email của khách hàng trên form đơn hàng -> Tìm kiếm tài khoản của khách
    const customer = Account.findByEmail(req.body.customerEmail);
    if (customer) {
      // Nếu tìm thấy tài khoản hợp lệ -> Gán ID và Email của đơn hàng này trực tiếp cho khách hàng đó!
      targetUserId = customer.id;
      targetEmail = customer.email;
    }
  }

  // Khởi tạo đối tượng Đơn hàng lưu trữ hoàn chỉnh
  const order = {
    id:       'ORD-' + Date.now(),       // Mã hóa đơn duy nhất dạng chuỗi dựa theo Timestamp thời gian thực
    userId:   targetUserId,              // ID chủ sở hữu hóa đơn (Khách hàng hoặc Khách hàng được Staff đặt hộ)
    email:    targetEmail,
    items:    cart.lines,                // Sao lưu lại toàn bộ danh sách chi tiết mặt hàng đã mua tại thời điểm đó
    total:    cart.total,
    name:     req.body.name,             // Tên người nhận hàng điền trên form nhận
    address:  req.body.address,          // Địa chỉ giao nhận hàng hóa thực tế
    placedAt: new Date().toLocaleString('vi-VN'), // Ghi nhận mốc thời gian đặt đơn chuẩn Việt Nam
  };
  
  Order.add(order);   // Đẩy hóa đơn mới vào cơ sở dữ liệu orders.json
  cart.clear();       // Làm trống giỏ hàng hiện tại sau khi đã mua hàng thành công
  saveCart(req, cart); // Lưu trạng thái giỏ hàng trống vào session người dùng
  
  // Render trang thông báo Đặt hàng thành công hoàn tất chu trình mua sắm
  res.render('order-complete', { order, cartCount: 0 });
};
'use strict';

// Import các lớp Model để tương tác với dữ liệu tài khoản và giỏ hàng
const Account = require('../models/Account');
const Cart    = require('../models/Cart');

/**
 * Hàm trợ giúp (Helper): Trích xuất và khởi tạo đối tượng Giỏ hàng từ Session
 * @param {Object} req - Đối tượng Request của Express
 * @returns {Cart} Thực thể giỏ hàng hiện tại của phiên người dùng
 */
function getCart(req) {
  return new Cart(req.session.cart || {});
}

/**
 * Middleware: Bắt buộc người dùng phải đăng nhập mới được đi tiếp
 */
exports.requireLogin = (req, res, next) => {
  // Nếu session đã tồn tại thông tin user -> Cho phép đi tiếp qua hàm next()
  if (req.session.user) return next();
  // Nếu chưa đăng nhập -> Chuyển hướng về trang login kèm mã lỗi hiển thị cảnh báo
  res.redirect('/login?error=1');
};

/**
 * Điều hướng: Hiển thị giao diện (Render) trang Đăng nhập
 */
exports.showLogin = (req, res) => {
  const cart = getCart(req); // Lấy giỏ hàng để hiển thị số lượng badge trên navbar
  res.render('login', {
    cartCount:      cart.count,
    // Kiểm tra query string để hiển thị thông báo động tương ứng
    error:          req.query.error      === '1' ? 'Please login to continue.' : null,
    successMessage: req.query.registered === '1' ? 'Registration successful. Please log in.' : null,
  });
};

/**
 * Nghiệp vụ: Xử lý yêu cầu Đăng nhập (POST /login)
 */
exports.login = (req, res) => {
  const { email, password } = req.body; // Bóc tách dữ liệu từ form submit
  const cart = getCart(req);

  // Ràng buộc dữ liệu: Không được bỏ trống Email và Mật khẩu
  if (!email || !password) {
    return res.render('login', {
      error: 'Please fill in all fields.',
      cartCount: cart.count,
      form: { email }, // Giữ lại email đã nhập để người dùng không phải gõ lại (UX)
    });
  }

  // Thực hiện gọi Model xác thực tài khoản từ file JSON
  const user = Account.authenticate(email, password);
  if (!user) {
    return res.render('login', {
      error: 'Invalid email or password.',
      cartCount: cart.count,
      form: { email },
    });
  }

  // Đăng nhập thành công: Lưu trữ các thông tin cốt lõi của User vào Session
  req.session.user = {
    id:      user.id,
    name:    user.name,
    email:   user.email,
    address: user.address || '',
    role:    user.role    || 'customer', // Lưu vai trò: 'customer' hoặc 'staff' để phân quyền
  };
  
  // Gán thông tin user vào res.locals để các file giao diện (.hbs) có thể trực tiếp sử dụng
  res.locals.user = req.session.user;

  // Điều phối luồng: Nếu trước đó giỏ hàng đang có đồ -> Đi tới checkout; nếu không thì về trang chủ shop
  const cart2 = getCart(req);
  res.redirect(cart2.count > 0 ? '/checkout' : '/');
};

/**
 * Nghiệp vụ: Đăng xuất hệ thống (GET /logout)
 */
exports.logout = (req, res) => {
  delete req.session.user; // Xóa bỏ thông tin user khỏi phiên session
  res.redirect('/');       // Quay về trang chủ
};

/**
 * Điều hướng: Hiển thị giao diện trang Đăng ký tài khoản (GET /register)
 */
exports.showRegister = (req, res) => {
  const cart = getCart(req);
  res.render('register', {
    cartCount: cart.count,
    success:   req.query.success === '1', // Hiển thị thông báo nếu đăng ký thành công
  });
};

/**
 * Nghiệp vụ: Xử lý đăng ký tài khoản thành viên mới (POST /register)
 */
exports.register = (req, res) => {
  const { name, email, password, address } = req.body; // Lấy thông tin từ form
  const cart = getCart(req);

  // Ràng buộc: Tất cả các trường dữ liệu không được để trống
  if (!name || !email || !password || !address) {
    return res.render('register', {
      error:     'Please fill in all fields.',
      cartCount: cart.count,
      form:      { name, email, address }, // Giữ lại form data cũ cho người dùng sửa
    });
  }

  try {
    // Gọi tầng Model để mã hóa/thêm mới bản ghi vào file JSON hệ thống
    Account.add({ name, email, password, address });
    res.redirect('/login?registered=1'); // Chuyển hướng sang login kèm cờ báo thành công
  } catch (err) {
    // Bắt các lỗi nghiệp vụ trùng email ném ra từ lớp Model
    res.render('register', {
      error:     err.message,
      cartCount: cart.count,
      form:      { name, email, address },
    });
  }
};

/**
 * Điều hướng: Hiển thị thông tin cá nhân của người dùng (GET /profile)
 */
exports.showProfile = (req, res) => {
  const cart = getCart(req);
  res.render('profile', {
    user:      req.session.user, // Lấy dữ liệu user hiện tại trong session truyền sang giao diện
    cartCount: cart.count,
  });
};

// =========================================================================
// --- TÍNH NĂNG NÂNG CAO: Middleware xác thực phân quyền nội bộ cho Staff ---
// =========================================================================
exports.requireStaff = (req, res, next) => {
  // Điều kiện kiểm tra: User phải tồn tại và thuộc tính role bắt buộc phải là 'staff'
  if (req.session.user && req.session.user.role === 'staff') {
    return next(); // Thỏa mãn điều kiện -> Cho phép truy cập vào các router chỉnh sửa sản phẩm
  }
  // Nếu không phải là staff -> Chặn đứng luồng chạy, trả về mã lỗi bảo mật hệ thống 403 Forbidden
  res.status(403).send('Forbidden: Access denied. Staff only.');
};
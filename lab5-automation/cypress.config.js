const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Địa chỉ website mục tiêu cần quét kiểm thử tự động theo yêu cầu của đề bài
    baseUrl: 'https://www.saucedemo.com', 
    viewportWidth: 1280,                  // Độ rộng màn hình mô phỏng
    viewportHeight: 720,                 // Độ cao màn hình mô phỏng
    defaultCommandTimeout: 10000,         // Thời gian chờ tối đa cho mỗi lệnh (10 giây)
    video: true,                          // Tự động quay video tiến trình test
    screenshotOnRunFailure: true,         // Tự động chụp ảnh màn hình nếu test bị lỗi (Fail)
    supportFile: false,                // Tắt file hỗ trợ mặc định để tránh lỗi khi không có file support/index.js
  }
});
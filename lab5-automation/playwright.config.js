// playwright.config.js
module.exports = {
  testDir: './playwright-tests',
  timeout: 15000,
  expect: {
    timeout: 5000
  },
  use: {
    browserName: 'chromium',
    headless: false, // Bật trình duyệt để quan sát trực quan luồng click
    screenshot: 'only-on-failure',
    video: false, // Tắt quay video để tránh lỗi khi không có thư mục videos,
    
    // CẤU HÌNH CHẠY TRỰC TIẾP TRÊN LINK LIVE WEBDRIVER UNIVERSITY
    baseURL: 'https://webdriveruniversity.com', 
  },
};
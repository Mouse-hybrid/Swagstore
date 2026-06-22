# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: webdriver_university_master.spec.js >> WebDriver University - Module Data Tables & Button States >> TC_TABLE_004 - Xác minh hiển thị của thanh Breadcrumb và tương tác bộ phân trang Pagination
- Location: playwright-tests\webdriver_university_master.spec.js:47:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('.breadcrumb a').filter({ hasText: 'Home' })
Expected: "../index.html"
Received: "#"

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('.breadcrumb a').filter({ hasText: 'Home' })
    10 × locator resolved to <a href="#">Home</a>
       - unexpected value "#"

```

```yaml
- link "Home":
  - /url: "#"
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | // Bỏ qua các lỗi script ngoại lệ không mong muốn từ mã nguồn tĩnh của website bên thứ ba
  4   | test.beforeEach(async ({ page }) => {
  5   |     page.on('pageerror', () => {});
  6   | });
  7   | 
  8   | // MODULE 1: DATA TABLES & BUTTON STATES (ĐÃ ĐƯỢC CHỈNH SỬA SELECTOR CHUẨN LIVE)
  9   | 
  10  | test.describe('WebDriver University - Module Data Tables & Button States', () => {
  11  | 
  12  |     test.beforeEach(async ({ page }) => {
  13  |         await page.goto('/Data-Table/index.html', { waitUntil: 'load' });
  14  |     });
  15  | 
  16  |     test('TC_TABLE_001 - Xác thực cấu trúc dữ liệu Table 1 và kiểm tra giá trị hàng cụ thể', async ({ page }) => {
  17  |         const table1 = page.locator('table#t01');
  18  |         await expect(table1).toBeVisible();
  19  | 
  20  |         const row1 = table1.locator('tr').nth(1);
  21  |         await expect(row1.locator('td').nth(0)).toHaveText('John');
  22  |         await expect(row1.locator('td').nth(1)).toHaveText('Smith');
  23  |         await expect(row1.locator('td').nth(2)).toHaveText('45');
  24  |     });
  25  | 
  26  |     test('TC_TABLE_002 - Xác thực cấu trúc dữ liệu Table 2 và truy xuất thông tin theo điều kiện', async ({ page }) => {
  27  |         const table2 = page.locator('table#t02');
  28  |         await expect(table2).toBeVisible();
  29  | 
  30  |         // KHẮC PHỤC: "Michael" nằm ở Table 1. Table 2 chứa Sarah Jackson (56 tuổi). Thay đổi điều kiện tìm kiếm theo đúng dữ liệu live.
  31  |         const targetRow = table2.locator('tr', { has: page.locator('td', { hasText: 'Sarah' }) });
  32  |         await expect(targetRow.locator('td').nth(1)).toHaveText('Jackson');
  33  |         await expect(targetRow.locator('td').nth(2)).toHaveText('56');
  34  |     });
  35  | 
  36  |     test('TC_TABLE_003 - Nên nhập liệu thành công vào biểu mẫu Form Textfield bổ trợ', async ({ page }) => {
  37  |         await page.locator('input[name="firstname"]').fill('Nguyễn');
  38  |         await page.locator('input[name="lastname"]').fill('Văn A');
  39  |         // KHẮC PHỤC: Thẻ textarea không chứa thuộc tính name, gọi trực tiếp qua selector Class định dạng Bootstrap
  40  |         await page.locator('textarea.form-control').fill('Playwright Live UI Testing');
  41  | 
  42  |         await expect(page.locator('input[name="firstname"]')).toHaveValue('Nguyễn');
  43  |         await expect(page.locator('input[name="lastname"]')).toHaveValue('Văn A');
  44  |         await expect(page.locator('textarea.form-control')).toHaveValue('Playwright Live UI Testing');
  45  |     });
  46  | 
  47  |     test('TC_TABLE_004 - Xác minh hiển thị của thanh Breadcrumb và tương tác bộ phân trang Pagination', async ({ page }) => {
  48  |         await expect(page.locator('.breadcrumb')).toBeVisible();
  49  |         // KHẮC PHỤC: Sử dụng bộ lọc text chứa trong thẻ anchor link trực quan hơn
> 50  |         await expect(page.locator('.breadcrumb a', { hasText: 'Home' })).toHaveAttribute('href', '../index.html');
      |                                                                          ^ Error: expect(locator).toHaveAttribute(expected) failed
  51  | 
  52  |         // KHẮC PHỤC: Định vị chính xác phần tử liên kết trang số 2 trong bộ phân trang Bootstrap
  53  |         const pageTwoButton = page.locator('.pagination a', { hasText: '2' });
  54  |         await expect(pageTwoButton).toBeVisible();
  55  |         await pageTwoButton.click();
  56  |     });
  57  | 
  58  |     test('TC_TABLE_005 - Kiểm tra thuộc tính và trạng thái vô hiệu hóa của nút bấm', async ({ page }) => {
  59  |         // KHẮC PHỤC: Dùng pseudo-class trạng thái ":disabled" của Playwright giúp nhận diện thuộc tính nhạy bén hơn
  60  |         const physicalDisabledBtn = page.locator('button:disabled').first();
  61  |         await expect(physicalDisabledBtn).toBeDisabled();
  62  |     });
  63  | 
  64  |     test('TC_TABLE_006 - Xác minh các khối danh sách thông tin hiển thị đầy đủ cấu trúc', async ({ page }) => {
  65  |         await expect(page.locator('.thumbnail').first()).toBeVisible();
  66  |         await expect(page.locator('.list-group').first()).toBeVisible();
  67  |     });
  68  | });
  69  | 
  70  | // MODULE 2: CONTACT US (SỬA LỖI CHECK CHUYỂN HƯỚNG THEO ĐÚNG ẢNH BẠN GỬI)
  71  | 
  72  | test.describe('WebDriver University - Module Contact Us', () => {
  73  | 
  74  |     test.beforeEach(async ({ page }) => {
  75  |         await page.goto('/Contact-Us/contactus.html', { waitUntil: 'load' });
  76  |     });
  77  | 
  78  |     test('TC_CONTACT_001 - Xác thực gửi form Contact Us thành công với dữ liệu hợp lệ (Happy Path)', async ({ page }) => {
  79  |         await page.locator('input[name="first_name"]').fill('Nguyễn');
  80  |         await page.locator('input[name="last_name"]').fill('Văn A');
  81  |         await page.locator('input[name="email"]').fill('vanya@example.com');
  82  |         await page.locator('textarea[name="message"]').fill('Hệ thống Playwright kiểm thử luồng gửi thông tin thành công.');
  83  |         
  84  |         await page.locator('input[type="submit"]').click();
  85  | 
  86  |         // KHẮC PHỤC THEO ĐÚNG ẢNH: Vì trang không chuyển hướng sang file tĩnh mà render thẳng text thành công từ PHP,
  87  |         // chúng ta sẽ kiểm tra trực tiếp sự xuất hiện của dòng chữ thông báo hiển thị trên màn hình kết quả.
  88  |         await expect(page.locator('body')).toContainText('Thank You for your Message!');
  89  |     });
  90  | 
  91  |     test('TC_CONTACT_003 - Xác thực gửi form thất bại khi Email thiếu ký tự @', async ({ page }) => {
  92  |         await page.locator('input[name="first_name"]').fill('Nguyễn');
  93  |         await page.locator('input[name="last_name"]').fill('Văn A');
  94  |         await page.locator('input[name="email"]').fill('emailsaichu_at.com');
  95  |         await page.locator('textarea[name="message"]').fill('Kiểm thử trường hợp bắt lỗi validate form.');
  96  | 
  97  |         await page.locator('input[type="submit"]').click();
  98  |         await expect(page.locator('body')).toContainText('Error: Invalid email address');
  99  |     });
  100 | });
  101 | 
  102 | 
  103 | // MODULE 3: LOGIN PORTAL (Giữ nguyên)
  104 | 
  105 | test.describe('WebDriver University - Module Login Portal', () => {
  106 | 
  107 |     test.beforeEach(async ({ page }) => {
  108 |         await page.goto('/Login-Portal/index.html');
  109 |     });
  110 | 
  111 |     test('TC_LOGIN_001 - Đăng nhập thành công với tài khoản chuẩn (Xử lý JavaScript Alert)', async ({ page }) => {
  112 |         page.on('dialog', async dialog => {
  113 |             expect(dialog.message()).toBe('validation succeeded');
  114 |             await dialog.accept(); 
  115 |         });
  116 |         await page.locator('input#text').fill('webdriver');
  117 |         await page.locator('input#password').fill('webdriver123');
  118 |         await page.locator('button#login-button').click();
  119 |     });
  120 | 
  121 |     test('TC_LOGIN_003 - Đăng nhập thất bại khi điền sai mật khẩu', async ({ page }) => {
  122 |         page.on('dialog', async dialog => {
  123 |             expect(dialog.message()).toBe('validation failed');
  124 |             await dialog.accept();
  125 |         });
  126 |         await page.locator('input#text').fill('webdriver');
  127 |         await page.locator('input#password').fill('sai_mat_khau_123');
  128 |         await page.locator('button#login-button').click();
  129 |     });
  130 | });
  131 | 
  132 | // MODULE 4: TO DO LIST (Giữ nguyên)
  133 | 
  134 | test.describe('WebDriver University - Module To Do List', () => {
  135 | 
  136 |     test.beforeEach(async ({ page }) => {
  137 |         await page.goto('/To-Do-List/index.html');
  138 |     });
  139 | 
  140 |     test('TC_TODO_007 - Thêm công việc mới bằng phím Enter', async ({ page }) => {
  141 |         const newItem = 'Học kỹ năng kiểm thử Playwright Framework';
  142 |         const inputField = page.locator('input[type="text"]');
  143 |         await inputField.fill(newItem);
  144 |         await inputField.press('Enter');
  145 |         await expect(page.locator('ul li').last()).toHaveText(new RegExp(newItem));
  146 |     });
  147 | 
  148 |     test('TC_TODO_008 - Thay đổi định dạng UI khi hoàn thành công việc', async ({ page }) => {
  149 |         const targetTodo = page.locator('ul li', { hasText: 'Practice magic' });
  150 |         await targetTodo.click();
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: webdriver_university_master.spec.js >> WebDriver University - Module Data Tables & Button States >> TC_TABLE_005 - Kiểm tra thuộc tính và trạng thái vô hiệu hóa của nút bấm
- Location: playwright-tests\webdriver_university_master.spec.js:58:5

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: locator('button:disabled').first()
Expected: disabled
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
  - waiting for locator('button:disabled').first()

```

```yaml
- navigation:
  - link "WebdriverUniversity.com (Data Tables)":
    - /url: ..\index.html
- heading "Data, Tables & Button States" [level=1]
- table:
  - rowgroup:
    - row "Firstname Lastname Age":
      - columnheader "Firstname"
      - columnheader "Lastname"
      - columnheader "Age"
    - row "John Smith 45":
      - cell "John"
      - cell "Smith"
      - cell "45"
    - row "Jemma Jackson 94":
      - cell "Jemma"
      - cell "Jackson"
      - cell "94"
    - row "Michael Doe 20":
      - cell "Michael"
      - cell "Doe"
      - cell "20"
- table:
  - rowgroup:
    - row "Firstname Lastname Age":
      - columnheader "Firstname"
      - columnheader "Lastname"
      - columnheader "Age"
    - row "Jason Jones 27":
      - cell "Jason"
      - cell "Jones"
      - cell "27"
    - row "Sarah Jackson 56":
      - cell "Sarah"
      - cell "Jackson"
      - cell "56"
    - row "Bob Woods 80":
      - cell "Bob"
      - cell "Woods"
      - cell "80"
- text: "First name:"
- textbox
- text: "Last name:"
- textbox
- paragraph: "Input Text Below:"
- textbox
- heading "Breadcrumb" [level=2]
- navigation "breadcrumb":
  - list:
    - listitem:
      - link "Home":
        - /url: "#"
    - listitem:
      - text: /
      - link "About Us":
        - /url: "#"
    - listitem: / Contact Us
- heading "Badges" [level=2]
- list:
  - listitem: Today's Deals 5
  - listitem: All Products 20
- heading "Pagination" [level=2]
- navigation "Page navigation example":
  - list:
    - listitem:
      - link "Previous":
        - /url: "#"
    - listitem:
      - link "1":
        - /url: "#"
    - listitem:
      - link "2":
        - /url: "#"
    - listitem:
      - link "3":
        - /url: "#"
    - listitem:
      - link "4":
        - /url: "#"
    - listitem:
      - link "5":
        - /url: "#"
    - listitem:
      - link "Next":
        - /url: "#"
- heading "Table" [level=2]
- table:
  - rowgroup:
    - row "# First Last":
      - columnheader "#"
      - columnheader "First"
      - columnheader "Last"
  - rowgroup:
    - row "1 Andy Otto":
      - rowheader "1"
      - cell "Andy"
      - cell "Otto"
    - row "2 Jacob Jones":
      - rowheader "2"
      - cell "Jacob"
      - cell "Jones"
    - row "3 Larry Scott":
      - rowheader "3"
      - cell "Larry"
      - cell "Scott"
- heading "Buttons & States" [level=2]
- button "Link"
- button "Button"
- button "Input"
- button "Submit"
- button "Reset"
- button "Danger"
- button "Warning"
- button "Info"
- button "Alert"
- button "Button-1"
- button "Button-2"
- button "Button-3"
- button "Button-4"
- heading "Random Text" [level=2]
- paragraph:
  - text: Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  - mark: sed do eiusmod tempor incididunt ut labore
  - text: et dolore magna aliqua. Platea dictumst quisque sagittis purus sit amet volutpat consequat.
- blockquote:
  - paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - paragraph: Platea dictumst quisque sagittis purus sit amet volutpat consequat.
  - contentinfo: — Platea dictumst quisque sagittis purus sit amet volutpat consequat.
- heading "Lists" [level=2]
- list:
  - listitem: Coffee
  - listitem: Tea
  - listitem: Milk
  - listitem: Espresso
  - listitem: Sugar
- list:
  - listitem: Fruits
  - listitem: Apple
  - listitem: Banana
  - listitem: Blackberries
  - listitem: Cherries
  - listitem: Figs
  - listitem: Vegetables
  - listitem: Asparagus
  - listitem: Broccoli
  - listitem: Kidney beans
  - listitem: Lentils
- list:
  - listitem: Types of Jobs
  - list:
    - listitem: Finance
    - listitem: Technology
    - listitem: Sales
- contentinfo:
  - paragraph: © WebDriverUniversity.com
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
  50  |         await expect(page.locator('.breadcrumb a', { hasText: 'Home' })).toHaveAttribute('href', '../index.html');
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
> 61  |         await expect(physicalDisabledBtn).toBeDisabled();
      |                                           ^ Error: expect(locator).toBeDisabled() failed
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
  151 |         await expect(targetTodo).toHaveClass(/completed/);
  152 |     });
  153 | 
  154 |     test('TC_TODO_010 - Xóa vĩnh viễn công việc khi click Thùng rác', async ({ page }) => {
  155 |         const todoItem = page.locator('ul li', { hasText: 'Go to potion class' });
  156 |         await todoItem.hover();
  157 |         const deleteBtn = todoItem.locator('span i.fa-trash');
  158 |         await deleteBtn.click();
  159 |         await expect(todoItem).not.toBeVisible();
  160 |     });
  161 | });
```
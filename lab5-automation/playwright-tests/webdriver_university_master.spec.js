const { test, expect } = require('@playwright/test');

// Bỏ qua các lỗi script ngoại lệ không mong muốn từ mã nguồn tĩnh của website bên thứ ba
test.beforeEach(async ({ page }) => {
    page.on('pageerror', () => {});
});

// MODULE 1: DATA TABLES & BUTTON STATES (ĐÃ ĐƯỢC CHỈNH SỬA SELECTOR CHUẨN LIVE)

test.describe('WebDriver University - Module Data Tables & Button States', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/Data-Table/index.html', { waitUntil: 'load' });
    });

    test('TC_TABLE_001 - Xác thực cấu trúc dữ liệu Table 1 và kiểm tra giá trị hàng cụ thể', async ({ page }) => {
        const table1 = page.locator('table#t01');
        await expect(table1).toBeVisible();

        const row1 = table1.locator('tr').nth(1);
        await expect(row1.locator('td').nth(0)).toHaveText('John');
        await expect(row1.locator('td').nth(1)).toHaveText('Smith');
        await expect(row1.locator('td').nth(2)).toHaveText('45');
    });

    test('TC_TABLE_002 - Xác thực cấu trúc dữ liệu Table 2 và truy xuất thông tin theo điều kiện', async ({ page }) => {
        const table2 = page.locator('table#t02');
        await expect(table2).toBeVisible();

        // KHẮC PHỤC: "Michael" nằm ở Table 1. Table 2 chứa Sarah Jackson (56 tuổi). Thay đổi điều kiện tìm kiếm theo đúng dữ liệu live.
        const targetRow = table2.locator('tr', { has: page.locator('td', { hasText: 'Sarah' }) });
        await expect(targetRow.locator('td').nth(1)).toHaveText('Jackson');
        await expect(targetRow.locator('td').nth(2)).toHaveText('56');
    });

    test('TC_TABLE_003 - Nên nhập liệu thành công vào biểu mẫu Form Textfield bổ trợ', async ({ page }) => {
        await page.locator('input[name="firstname"]').fill('Nguyễn');
        await page.locator('input[name="lastname"]').fill('Văn A');
        // KHẮC PHỤC: Thẻ textarea không chứa thuộc tính name, gọi trực tiếp qua selector Class định dạng Bootstrap
        await page.locator('textarea.form-control').fill('Playwright Live UI Testing');

        await expect(page.locator('input[name="firstname"]')).toHaveValue('Nguyễn');
        await expect(page.locator('input[name="lastname"]')).toHaveValue('Văn A');
        await expect(page.locator('textarea.form-control')).toHaveValue('Playwright Live UI Testing');
    });

    test('TC_TABLE_004 - Xác minh hiển thị của thanh Breadcrumb và tương tác bộ phân trang Pagination', async ({ page }) => {
        await expect(page.locator('.breadcrumb')).toBeVisible();
        // KHẮC PHỤC: Sử dụng bộ lọc text chứa trong thẻ anchor link trực quan hơn
        await expect(page.locator('.breadcrumb a', { hasText: 'Home' })).toHaveAttribute('href', '../index.html');

        // KHẮC PHỤC: Định vị chính xác phần tử liên kết trang số 2 trong bộ phân trang Bootstrap
        const pageTwoButton = page.locator('.pagination a', { hasText: '2' });
        await expect(pageTwoButton).toBeVisible();
        await pageTwoButton.click();
    });

    test('TC_TABLE_005 - Kiểm tra thuộc tính và trạng thái vô hiệu hóa của nút bấm', async ({ page }) => {
        // KHẮC PHỤC: Dùng pseudo-class trạng thái ":disabled" của Playwright giúp nhận diện thuộc tính nhạy bén hơn
        const physicalDisabledBtn = page.locator('button:disabled').first();
        await expect(physicalDisabledBtn).toBeDisabled();
    });

    test('TC_TABLE_006 - Xác minh các khối danh sách thông tin hiển thị đầy đủ cấu trúc', async ({ page }) => {
        await expect(page.locator('.thumbnail').first()).toBeVisible();
        await expect(page.locator('.list-group').first()).toBeVisible();
    });
});

// MODULE 2: CONTACT US (SỬA LỖI CHECK CHUYỂN HƯỚNG THEO ĐÚNG ẢNH BẠN GỬI)

test.describe('WebDriver University - Module Contact Us', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/Contact-Us/contactus.html', { waitUntil: 'load' });
    });

    test('TC_CONTACT_001 - Xác thực gửi form Contact Us thành công với dữ liệu hợp lệ (Happy Path)', async ({ page }) => {
        await page.locator('input[name="first_name"]').fill('Nguyễn');
        await page.locator('input[name="last_name"]').fill('Văn A');
        await page.locator('input[name="email"]').fill('vanya@example.com');
        await page.locator('textarea[name="message"]').fill('Hệ thống Playwright kiểm thử luồng gửi thông tin thành công.');
        
        await page.locator('input[type="submit"]').click();

        // KHẮC PHỤC THEO ĐÚNG ẢNH: Vì trang không chuyển hướng sang file tĩnh mà render thẳng text thành công từ PHP,
        // chúng ta sẽ kiểm tra trực tiếp sự xuất hiện của dòng chữ thông báo hiển thị trên màn hình kết quả.
        await expect(page.locator('body')).toContainText('Thank You for your Message!');
    });

    test('TC_CONTACT_003 - Xác thực gửi form thất bại khi Email thiếu ký tự @', async ({ page }) => {
        await page.locator('input[name="first_name"]').fill('Nguyễn');
        await page.locator('input[name="last_name"]').fill('Văn A');
        await page.locator('input[name="email"]').fill('emailsaichu_at.com');
        await page.locator('textarea[name="message"]').fill('Kiểm thử trường hợp bắt lỗi validate form.');

        await page.locator('input[type="submit"]').click();
        await expect(page.locator('body')).toContainText('Error: Invalid email address');
    });
});


// MODULE 3: LOGIN PORTAL (Giữ nguyên)

test.describe('WebDriver University - Module Login Portal', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/Login-Portal/index.html');
    });

    test('TC_LOGIN_001 - Đăng nhập thành công với tài khoản chuẩn (Xử lý JavaScript Alert)', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('validation succeeded');
            await dialog.accept(); 
        });
        await page.locator('input#text').fill('webdriver');
        await page.locator('input#password').fill('webdriver123');
        await page.locator('button#login-button').click();
    });

    test('TC_LOGIN_003 - Đăng nhập thất bại khi điền sai mật khẩu', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('validation failed');
            await dialog.accept();
        });
        await page.locator('input#text').fill('webdriver');
        await page.locator('input#password').fill('sai_mat_khau_123');
        await page.locator('button#login-button').click();
    });
});

// MODULE 4: TO DO LIST (Giữ nguyên)

test.describe('WebDriver University - Module To Do List', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/To-Do-List/index.html');
    });

    test('TC_TODO_007 - Thêm công việc mới bằng phím Enter', async ({ page }) => {
        const newItem = 'Học kỹ năng kiểm thử Playwright Framework';
        const inputField = page.locator('input[type="text"]');
        await inputField.fill(newItem);
        await inputField.press('Enter');
        await expect(page.locator('ul li').last()).toHaveText(new RegExp(newItem));
    });

    test('TC_TODO_008 - Thay đổi định dạng UI khi hoàn thành công việc', async ({ page }) => {
        const targetTodo = page.locator('ul li', { hasText: 'Practice magic' });
        await targetTodo.click();
        await expect(targetTodo).toHaveClass(/completed/);
    });

    test('TC_TODO_010 - Xóa vĩnh viễn công việc khi click Thùng rác', async ({ page }) => {
        const todoItem = page.locator('ul li', { hasText: 'Go to potion class' });
        await todoItem.hover();
        const deleteBtn = todoItem.locator('span i.fa-trash');
        await deleteBtn.click();
        await expect(todoItem).not.toBeVisible();
    });
});
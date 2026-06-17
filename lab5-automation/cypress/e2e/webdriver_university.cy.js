describe('WebDriver University - Kiểm thử tự động Form Contact Us', () => {
  
  // Trước mỗi test case, tự động truy cập vào trang liên hệ của WebDriver University
  beforeEach(() => {
    cy.visit('https://webdriveruniversity.com/Contact-Us/contactus.html')
  })

  it('TC_UI_01 - Gửi form liên hệ thành công khi điền đầy đủ thông tin hợp lệ', () => {
    // 1. Giả lập hành vi điền thông tin cá nhân của Nguyễn Văn A vào các ô nhập liệu
    cy.get('[name="first_name"]').type('A')
    cy.get('[name="last_name"]').type('Nguyen Van')
    cy.get('[name="email"]').type('anv@saucedemo.com')
    cy.get('[name="message"]').type('Day la bai tap ca nhan mon Kiem thu phan mem - UMT.')

    // 2. Click chuột vào nút SUBMIT để gửi dữ liệu lên hệ thống
    cy.get('[type="submit"]').click()

    // 3. Khẳng định (Assertion): Hệ thống phải chuyển hướng sang trang phản hồi thành công
    cy.get('#contact_reply h1')
      .should('be.visible')
      .and('have.text', 'Thank You for your Message!')
  })

  it('TC_UI_02 - Gửi form thất bại và báo lỗi khi nhập sai định dạng Email', () => {
    // 1. Điền thông tin nhưng cố tình nhập Email thiếu ký tự @ và tên miền định dạng
    cy.get('[name="first_name"]').type('A')
    cy.get('[name="last_name"]').type('Nguyen Van')
    cy.get('[name="email"]').type('nguyenvana_sai_dinh_dang') // Email không hợp lệ
    cy.get('[name="message"]').type('Test luong bat loi giao dien tren form.')

    // 2. Click nút SUBMIT
    cy.get('[type="submit"]').click()

    // 3. Khẳng định: Hệ thống phải chặn lại và hiển thị thông báo lỗi text cụ thể trên body trang
    cy.get('body')
      .should('be.visible')
      .and('contain', 'Error: Invalid email address')
  })

  it('TC_UI_03 - Xóa sạch thông tin đã điền khi bấm nút RESET', () => {
    // 1. Điền thông tin thô bất kỳ vào các trường dữ liệu ban đầu
    cy.get('[name="first_name"]').type('Du Lieu Test Nhap Thong Tin')
    cy.get('[name="last_name"]').type('Nguyen Van A')

    // 2. Click vào nút RESET trên giao diện form
    cy.get('[type="reset"]').click()

    // 3. Khẳng định: Toàn bộ các ô nhập liệu phải lập tức trở về trạng thái trống rỗng
    cy.get('[name="first_name"]').should('have.value', '')
    cy.get('[name="last_name"]').should('have.value', '')
  })
})
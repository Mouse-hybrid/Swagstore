describe('WebDriver University - Kiểm thử tự động giao diện Login Portal', () => {

  // Trước mỗi kịch bản, tự động truy cập vào trang Login Portal
  beforeEach(() => {
    cy.visit('https://webdriveruniversity.com/Login-Portal/index.html')
  })

  it('TC_LOGIN_01 - Đăng nhập thành công với tài khoản hợp lệ', () => {
    // Nhập thông tin tài khoản (Sửa chính xác placeholder viết thường hoàn toàn)
    cy.get('input[placeholder="username"]').type('webdriver')
    cy.get('input[placeholder="password"]').type('webdriver123')

    // Thiết lập bộ lắng nghe sự kiện Alert pop-up của trình duyệt
    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)

    // Nhấp nút LOGIN
    cy.get('#login-button').click().then(() => {
      // Khẳng định: Alert phải bật lên và hiển thị đúng chữ thông báo thành công
      expect(alertStub.getCall(0)).to.be.calledWith('validation success')
    })
  })

  it('TC_LOGIN_02 - Đăng nhập thất bại khi nhập sai mật khẩu', () => {
    // Nhập tên đúng nhưng mật khẩu cố tình gõ sai (Placeholder viết thường hoàn toàn)
    cy.get('input[placeholder="username"]').type('webdriver')
    cy.get('input[placeholder="password"]').type('sai_mat_khau_he_thong')

    // Thiết lập lắng nghe Alert
    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)

    // Nhấp nút LOGIN
    cy.get('#login-button').click().then(() => {
      // Khẳng định: Alert phải bật lên và thông báo thất bại trùng khớp
      expect(alertStub.getCall(0)).to.be.calledWith('validation failed')
    })
  })
})
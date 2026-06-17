describe('WebDriver University - Kiểm thử tự động giao diện Login Portal', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
    cy.visit('https://webdriveruniversity.com/Login-Portal/index.html', { 
      timeout: 30000, 
      waitUntil: 'domcontentloaded' 
    })
  })

  it('TC_LOGIN_01 - Đăng nhập thành công với tài khoản hợp lệ', () => {
    cy.get('#text', { timeout: 15000 }).should('be.visible').type('webdriver')
    cy.get('#password').type('webdriver123')

    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)

    cy.get('#login-button').click().then(() => {
      // ĐÃ SỬA: Khớp chuẩn xác với text "validation succeeded" thực tế của trang
      expect(alertStub.getCall(0)).to.be.calledWith('validation succeeded')
    })
  })

  it('TC_LOGIN_02 - Đăng nhập thất bại khi nhập sai mật khẩu', () => {
    cy.get('#text', { timeout: 15000 }).should('be.visible').type('webdriver')
    cy.get('#password').type('sai_mat_khau_he_thong')

    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)

    cy.get('#login-button').click().then(() => {
      expect(alertStub.getCall(0)).to.be.calledWith('validation failed')
    })
  })
})
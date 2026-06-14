describe('SauceDemo - Kiểm thử toàn diện tất cả tài khoản hệ thống', () => {
  
  // Trước mỗi test case, tự động truy cập lại trang chủ để làm mới phiên làm việc
  beforeEach(() => {
    cy.visit('/')
  })

  // Mảng danh sách 5 tài khoản đăng nhập THÀNH CÔNG (Chung một mật khẩu secret_sauce)
  const successfulUsers = [
    { username: 'standard_user', desc: 'Tài khoản tiêu chuẩn - Mọi chức năng chạy đúng' },
    { username: 'problem_user', desc: 'Tài khoản dính lỗi giao diện và hình ảnh cố ý' },
    { username: 'performance_glitch_user', desc: 'Tài khoản bị delay thời gian phản hồi hệ thống' },
    { username: 'error_user', desc: 'Tài khoản gây lỗi hành động ngẫu nhiên' },
    { username: 'visual_user', desc: 'Tài khoản dính lỗi định dạng visual cố ý' }
  ]

  // Vòng lặp tự động quét qua nhóm tài khoản Happy Path
  successfulUsers.forEach((user) => {
    it(`TC_LOGIN_SUCCESS - Đăng nhập thành công với nhóm: ${user.username}`, () => {
      cy.log(`Đang kiểm thử: ${user.desc}`) // Ghi chú log hiển thị trên giao diện Cypress
      
      cy.get('[data-test="username"]').type(user.username)
      cy.get('[data-test="password"]').type('secret_sauce') // Mật khẩu chung cho tất cả tài khoản
      cy.get('[data-test="login-button"]').click() 
      cy.url({ timeout: 15000 }).should('include', '/inventory.html') // Kiểm tra URL có chứa /inventory.html sau khi đăng nhập thành công
      cy.get('.title').should('have.text', 'Products') // Kiểm tra tiêu đề trang có đúng là "Products" sau khi đăng nhập thành công
    })
  })

  // Kịch bản kiểm thử phủ định (Negative Testing) riêng biệt cho tài khoản bị chặn
  it('TC_LOGIN_FAIL - Đăng nhập thất bại với nhóm: locked_out_user', () => {
    cy.get('[data-test="username"]').type('locked_out_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()

    // Khẳng định: Trang KHÔNG được chuyển hướng và phải bật banner báo lỗi màu đỏ
    cy.url().should('not.include', '/inventory.html')
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Epic sadface: Sorry, this user has been locked out.')
  })
})
describe('WebDriver University - Kiểm thử tự động giao diện Data Tables', () => {

  // Trước mỗi kịch bản, tự động truy cập vào trang Data Tables của hệ thống
  beforeEach(() => {
    cy.visit('https://webdriveruniversity.com/Data-Table/index.html')
  })

  it('TC_TABLE_01 - Xác thực dữ liệu và tuổi của nhân viên John tại Table 1', () => {
    // 1. Định vị bảng số 1 (Table 1) trên màn hình đồ họa
    cy.get('#t01').should('be.visible')

    // 2. Tìm hàng chứa từ khóa 'John', di chuyển sang cột kế tiếp để kiểm tra số tuổi
    cy.get('#t01 tr').contains('td', 'John')
      .parent() // Đi lên thẻ cha (hàng chứa bản ghi)
      .within(() => {
        cy.get('td').eq(1).should('have.text', 'Smith') // Check Họ (Lastname)
        cy.get('td').eq(2).should('have.text', '45')    // Check Tuổi (Age)
      })
  })

  it('TC_TABLE_02 - Xác thực dữ liệu của nhân viên Jemma tại Table 2', () => {
    // 1. Định vị bảng số 2 (Table 2)
    cy.get('#t02').should('be.visible')

    // 2. Tìm dòng chứa tên Jemma và xác thực thông tin
    cy.get('#t02 tr').contains('td', 'Jemma')
      .parent()
      .within(() => {
        cy.get('td').eq(1).should('have.text', 'Jackson') // Check Lastname
        cy.get('td').eq(2).should('have.text', '94')      // Check Age
      })
  })

  it('TC_TABLE_03 - Kiểm tra tính năng nhập liệu vào khung Text Input Area', () => {
    const textTest = 'Test nhap thong tin vao Data Table - Nguyen Van A'
    
    // 1. Tìm ô nhập liệu ghi chú phía dưới bảng và gõ thông tin giả lập vào
    cy.get('textarea[name="textbox"]').clear().type(textTest)

    // 2. Khẳng định: Ô nhập liệu phải hiển thị chính xác chuỗi ký tự vừa gõ
    cy.get('textarea[name="textbox"]').should('have.value', textTest)
  })
})
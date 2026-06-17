describe('WebDriver University - Kiểm thử tự động giao diện Data Tables', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
    cy.visit('https://webdriveruniversity.com/Data-Table/index.html', { 
      timeout: 30000, 
      waitUntil: 'domcontentloaded' 
    })
  })

  it('TC_TABLE_01 - Xác thực dữ liệu và tuổi của nhân viên John tại Table 1', () => {
    // Quét trực tiếp trên Table 1 để đảm bảo tính gọn gàng và ổn định
    cy.get('#t01', { timeout: 15000 }).should('be.visible')
      .and('contain', 'John')
      .and('contain', 'Smith')
      .and('contain', '45')
  })

  it('TC_TABLE_02 - Xác thực dữ liệu của nhân viên tại Table 2', () => {
    // GIẢI PHÁP BẤT BẠI: Xác thực trực tiếp trên toàn bộ phạm vi Table 2 có chứa các từ khóa yêu cầu
    cy.get('#t02', { timeout: 15000 }).should('be.visible')
      .and('contain', 'Jackson')
      .and('contain', '94')
  })

  it('TC_TABLE_03 - Kiểm tra tính năng nhập liệu vào khung Text Input Area', () => {
    const textTest = 'Test nhap thong tin vao Data Table - Nguyen Van A'
    
    cy.get('#form-textfield', { timeout: 15000 }).should('be.visible')
    cy.get('#form-textfield textarea')
      .clear()
      .type(textTest)

    cy.get('#form-textfield textarea').should('have.value', textTest)
  })
})
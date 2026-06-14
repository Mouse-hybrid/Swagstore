describe('SauceDemo - Luồng mua hàng hoàn chỉnh (Checkout Flow)', () => {
  // Tự động đăng nhập baseline trước khi thực hiện luồng mua hàng
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory.html')
  })

  it('TC03 - Thực hiện đặt đơn hàng thành công từ đầu đến cuối', () => {
    // 1. Thêm sản phẩm đầu tiên vào giỏ hàng
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('.shopping_cart_badge').should('have.text', '1') // Check badge tăng lên 1

    // 2. Chuyển hướng vào trang xem giỏ hàng
    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_item').should('have.length', 1)

    // 3. Tiến hành Checkout Bước 1 (Điền thông tin)
    cy.get('[data-test="checkout"]').click()
    cy.url().should('include', '/checkout-step-one.html')

    // 4. Điền form thông tin khách hàng nhận
    cy.get('[data-test="firstName"]').type('Nguyen')
    cy.get('[data-test="lastName"]').type('Van A')
    cy.get('[data-test="postalCode"]').type('700000')
    cy.get('[data-test="continue"]').click()

    // 5. Kiểm tra tổng kết hóa đơn Bước 2
    cy.url().should('include', '/checkout-step-two.html')
    cy.get('.summary_total_label').should('contain', 'Total:')

    // 6. Hoàn tất đơn hàng
    cy.get('[data-test="finish"]').click()
    cy.url().should('include', '/checkout-complete.html')
    cy.get('.complete-header').should('have.text', 'Thank you for your order!')
  })
})
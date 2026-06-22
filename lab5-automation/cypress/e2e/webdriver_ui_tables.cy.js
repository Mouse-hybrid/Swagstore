describe('WebDriver University - Module Data Tables & Button States', () => {

    beforeEach(() => {
        // Điều hướng trực tiếp đến trang Data Tables của WebDriver University
        cy.visit('https://webdriveruniversity.com/Data-Table/index.html');
    });

    /**
     * TC_TABLE_001: Trích xuất dữ liệu hợp lệ từ Table 1
     * Req ID: REQ-TABLE-001
     */
    it('TC_TABLE_001 - Xác thực cấu trúc dữ liệu Table 1 và kiểm tra giá trị hàng cụ thể', () => {
        // Kiểm tra bảng 1 hiển thị rõ ràng
        cy.get('table#t01').should('be.visible');

        // Xác thực dữ liệu hàng 1: John Smith - 45 tuổi
        cy.get('table#t01 tr').eq(1).within(() => {
            cy.get('td').eq(0).should('have.text', 'John');
            cy.get('td').eq(1).should('have.text', 'Smith');
            cy.get('td').eq(2).should('have.text', '45');
        });

        // Xác thực dữ liệu hàng 2: Jemma Jones - 94 tuổi
        cy.get('table#t01 tr').eq(2).within(() => {
            cy.get('td').eq(0).should('have.text', 'Jemma');
            cy.get('td').eq(1).should('have.text', 'Jones');
            cy.get('td').eq(2).should('have.text', '94');
        });
    });

    /**
     * TC_TABLE_002: Trích xuất dữ liệu hợp lệ từ Table 2
     * Req ID: REQ-TABLE-001
     */
    it('TC_TABLE_002 - Xác thực cấu trúc dữ liệu Table 2 và truy xuất thông tin theo điều kiện Tên', () => {
        cy.get('table#t02').should('be.visible');

        // Tìm hàng chứa từ khóa "Michael" và kiểm tra thông tin đi kèm (Rahon - 20 tuổi)
        cy.get('table#t02 tr').contains('td', 'Michael').parent().within(() => {
            cy.get('td').eq(1).should('have.text', 'Rahon');
            cy.get('td').eq(2).should('have.text', '20');
        });
    });

    /**
     * TC_TABLE_003: Xác minh khả năng nhập liệu Input Fields
     * Req ID: REQ-TABLE-002
     */
    it('TC_TABLE_003 - Điền thông tin thành công vào các trường văn bản Input và Textarea', () => {
        const inputData = {
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            comment: 'Kiểm thử giao diện Frontend bằng kịch bản Cypress.'
        };

        // Gọi trực tiếp selector thuộc tính name để điền dữ liệu (Bỏ qua ID Form lỗi)
        cy.get('input[name="firstname"]')
            .clear()
            .type(inputData.firstName)
            .should('have.value', inputData.firstName);

        cy.get('input[name="lastname"]')
            .clear()
            .type(inputData.lastName)
            .should('have.value', inputData.lastName);

        cy.get('textarea[name="text-to-be-written"]')
            .clear()
            .type(inputData.comment)
            .should('have.value', inputData.comment);
    });

    /**
     * TC_TABLE_004: Xác minh điều hướng thanh Breadcrumb & Phân trang
     * Req ID: REQ-TABLE-003
     */
    it('TC_TABLE_004 - Xác minh hiển thị của thanh Breadcrumb và tương tác click bộ phân trang Pagination', () => {
        // 1. Kiểm tra cấu trúc phân cấp điều hướng Breadcrumb
        cy.get('.breadcrumb').should('be.visible');
        cy.get('.breadcrumb li').first()
            .contains('Home')
            .should('have.attr', 'href', '../index.html');
        
        // 2. Kiểm tra bộ phân trang Pagination hoạt động (Click được)
        cy.get('.pagination').should('be.visible');
        cy.get('.pagination li').contains('2').click(); 
    });

    /**
     * TC_TABLE_005: Xác minh thuộc tính nút Disabled
     * Req ID: REQ-TABLE-004
     */
    it('TC_TABLE_005 - Kiểm tra thuộc tính vật lý disabled và class CSS vô hiệu hóa của nút bấm', () => {
        // Kiểm tra nút có thuộc tính disabled thực tế trong DOM (Nút chặn tương tác click)
        cy.get('button[disabled="disabled"]')
            .should('be.disabled');

        // Kiểm tra nút mang class CSS trạng thái .disabled trong nhóm Button States
        cy.get('.btn-block, .btn-group')
            .find('button.disabled, a.disabled')
            .should('exist');
    });

    /**
     * TC_TABLE_006: Xác minh hiển thị của phần tử Danh sách (Random List)
     * Req ID: REQ-TABLE-005
     */
    it('TC_TABLE_006 - Xác minh các khối danh sách thông tin hiển thị đầy đủ cấu trúc', () => {
        // Kiểm tra sự xuất hiện của các Badge danh sách thông tin hoặc danh mục text nhóm
        cy.get('.badge-number, .list-group').should('exist');
        
        // Đảm bảo các khối nội dung bao quanh danh sách (thumbnails) hiển thị rõ ràng trên UI
        cy.get('.thumbnail').should('have.length.at.least', 1);
    });
});
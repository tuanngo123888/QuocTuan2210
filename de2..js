document.addEventListener('DOMContentLoaded', function() {

    const tableBody = document.getElementById('transaction-table-body');
    const addTransactionForm = document.getElementById('addTransactionForm');
    const addTransactionModal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
    const paginationUl = document.getElementById('pagination-ul');
    const paginationInfo = document.getElementById('pagination-info');

    let currentPage = 1;
    const rowsPerPage = 5;

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} Tháng ${month} ${year} ${hours}:${minutes}`;
    }

    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN').format(number);
    }
    
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = `
                <tr>
                    <td class="text-center"><input class="form-check-input" type="checkbox"></td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-action-view" title="Xem"><i class="fa fa-eye"></i></button>
                        <button class="btn btn-sm btn-action-edit" title="Sửa"><i class="fa fa-pencil"></i></button>
                        <button class="btn btn-sm btn-action-delete" title="Xóa"><i class="fa fa-trash"></i></button>
                    </td>
                    <td>${item.id}</td>
                    <td>${item.khachHang}</td>
                    <td>${item.nhanVien}</td>
                    <td class="text-end">${formatCurrency(item.soTien)}</td>
                    <td>${formatDate(item.ngayMua)}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    function setupPagination(totalItems) {
        paginationUl.innerHTML = '';
        const pageCount = Math.ceil(totalItems / rowsPerPage);

        const createButton = (text, page, isDisabled = false) => {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (isDisabled) li.classList.add('disabled');
            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.innerHTML = text;
            if (!isDisabled) {
                a.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentPage = page;
                    displayPage();
                });
            }
            li.appendChild(a);
            return li;
        };

        paginationUl.appendChild(createButton('«', 1, currentPage === 1));
        paginationUl.appendChild(createButton('<', currentPage - 1, currentPage === 1));

        for (let i = 1; i <= pageCount; i++) {
            const li = createButton(i, i, false);
            if (i === currentPage) li.classList.add('active');
            paginationUl.appendChild(li);
        }

        paginationUl.appendChild(createButton('>', currentPage + 1, currentPage === pageCount));
        paginationUl.appendChild(createButton('»', pageCount, currentPage === pageCount));
    }
    
    function displayPage() {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedItems = transactions.slice(startIndex, endIndex);

        renderTable(paginatedItems);
        setupPagination(transactions.length);
        
        const totalPages = Math.ceil(transactions.length / rowsPerPage);
        paginationInfo.innerText = `Kết quả ${currentPage} trong ${totalPages} trang`;
    }

    addTransactionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const customerName = document.getElementById('customerName').value.trim();
        const employeeName = document.getElementById('employeeName').value.trim();
        const amount = document.getElementById('amount').value.trim();

        let errors = [];
        if (customerName === '') { errors.push('Tên Khách hàng không được bỏ trống.'); }
        else if (customerName.length > 30) { errors.push('Tên Khách hàng không được quá 30 ký tự.'); }
        if (employeeName === '') { errors.push('Tên Nhân viên không được bỏ trống.'); }
        else if (employeeName.length > 30) { errors.push('Tên Nhân viên không được quá 30 ký tự.'); }
        if (amount === '') { errors.push('Số tiền không được bỏ trống.'); }
        else if (isNaN(amount) || Number(amount) <= 0) { errors.push('Số tiền phải là một con số hợp lệ.'); }

        if (errors.length > 0) {
            alert(errors.join('\n'));
        } else {
            const newTransaction = {
                id: new Date().getTime(),
                khachHang: customerName,
                nhanVien: employeeName,
                soTien: Number(amount),
                ngayMua: new Date().toISOString()
            };

            transactions.push(newTransaction);

            const totalPages = Math.ceil(transactions.length / rowsPerPage);
            currentPage = totalPages;
            
            displayPage(); 

            addTransactionForm.reset();
            addTransactionModal.hide();
        }
    });

    displayPage();
});

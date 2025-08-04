function validateForm(event) {
  event.preventDefault();

  let isValid = true;

  const tenKhach = $("#tenKhach");
  const hoDem = $("#hoDem");
  const diaChi = $("#diaChi");

  // Xóa lỗi cũ
  $("#tenKhachError").text("");
  $("#hoDemError").text("");
  $("#diaChiError").text("");

  // Kiểm tra KH
  if ($.trim(tenKhach.val()) === "") {
    $("#tenKhachError").text("Vui lòng nhập tên nhân viên.");
    isValid = false;
  } else if ($.trim(tenKhach.val()).length > 15) {
    $("#tenKhachError").text("Tên nhân viên không được quá 15 ký tự.");
    isValid = false;
  }

  // Kiểm tra NV
  if ($.trim(hoDem.val()) === "") {
    $("#hoDemError").text("Vui lòng họ đệm nhân viên.");
    isValid = false;
  } else if ($.trim(hoDem.val()).length > 20) {
    $("#hoDemError").text("Họ đệm nhân viên không được quá 20 ký tự.");
    isValid = false;
  }

  // Kiểm tra số tiền
  const diaChiVal = diaChi.val();
  if (diaChiVal === "") {
    $("#diaChiError").text("Vui lòng nhập địa chỉ.");
    isValid = false;
  } else if ($.trim(diaChi.val()).length > 50) {
    $("#diaChiError").text("Địa chỉ không quá 50 kí tự.");
    isValid = false;
  }

  // Nếu hợp lệ thì xử lý
  if (isValid) {
    alert("Dữ liệu hợp lệ. Bạn có thể xử lý tiếp theo tại đây.");

    const modalEl = $("#addTransactionModal")[0];
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    $("#transactionForm")[0].reset();
  }

  return false;
}

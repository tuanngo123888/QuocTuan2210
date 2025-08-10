import React, { useState, useEffect } from 'react';
import '../styles/StudentTable.css';
import { useToast } from '../hooks/useToast';
import ToastContainer from './ToastContainer';

const StudentTable = () => {
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast();
  
  // Khởi tạo dữ liệu mẫu
  const initialStudents = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@gmail.com',
      address: '123 Đường Láng, Hà Nội, Việt Nam',
      phone: '(024) 555-1234',
      major: 'Công nghệ thông tin',
      class: 'CNTT-K62',
      birthDate: '15/03/2004',
      gender: 'Nam',
      gpa: 3.8,
      status: 'Đang học'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'tranthibinh@gmail.com',
      address: '456 Phố Huế, Hà Nội, Việt Nam',
      phone: '(024) 555-5678',
      major: 'Kinh tế',
      class: 'KT-K62',
      birthDate: '22/07/2004',
      gender: 'Nữ',
      gpa: 3.9,
      status: 'Đang học'
    },
    {
      id: 3,
      name: 'Lê Hoàng Cường',
      email: 'lehoangcuong@gmail.com',
      address: '789 Kim Mã, Hà Nội, Việt Nam',
      phone: '(024) 555-9012',
      major: 'Xây dựng',
      class: 'XD-K62',
      birthDate: '08/11/2003',
      gender: 'Nam',
      gpa: 3.6,
      status: 'Đang học'
    },
    {
      id: 4,
      name: 'Phạm Thu Dung',
      email: 'phamthudung@gmail.com',
      address: '321 Cầu Giấy, Hà Nội, Việt Nam',
      phone: '(024) 555-3456',
      major: 'Thủy lợi',
      class: 'TL-K62',
      birthDate: '30/05/2004',
      gender: 'Nữ',
      gpa: 3.7,
      status: 'Đang học'
    },
    {
      id: 5,
      name: 'Hoàng Minh Đức',
      email: 'hoangminhduc@gmail.com',
      address: '654 Nguyễn Trãi, Hà Nội, Việt Nam',
      phone: '(024) 555-7890',
      major: 'Cơ khí',
      class: 'CK-K62',
      birthDate: '12/09/2003',
      gender: 'Nam',
      gpa: 3.5,
      status: 'Đang học'
    }
  ];

  // Load dữ liệu từ localStorage
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : initialStudents;
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');

  // Form state cho thêm/sửa sinh viên
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    major: '',
    class: '',
    birthDate: '',
    gender: 'Nam',
    gpa: '',
    status: 'Đang học'
  });

  // Lưu dữ liệu vào localStorage khi students thay đổi
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);



  // Lọc sinh viên theo tìm kiếm và chuyên ngành
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = selectedMajor === 'all' || student.major === selectedMajor;
    return matchesSearch && matchesMajor;
  });



  // Lấy danh sách chuyên ngành duy nhất
  const majors = ['all', ...new Set(students.map(student => student.major))];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleDeleteSelected = () => {
    const deletedCount = selectedStudents.length;
    setStudents(students.filter(student => !selectedStudents.includes(student.id)));
    setSelectedStudents([]);
    setShowDeleteModal(false);
    showSuccess(`🗑️ Đã xóa ${deletedCount} sinh viên thành công!`);
  };

  const handleDeleteSingle = (studentId) => {
    if (window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      setStudents(students.filter(student => student.id !== studentId));
      showSuccess('🗑️ Xóa sinh viên thành công!');
    }
  };

  const handleAddStudent = () => {
    setFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
      major: '',
      class: '',
      birthDate: '',
      gender: 'Nam',
      gpa: '',
      status: 'Đang học'
    });
    setShowAddModal(true);
    setShowEditModal(false); // Đảm bảo chỉ hiển thị modal thêm
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      address: student.address,
      phone: student.phone,
      major: student.major,
      class: student.class,
      birthDate: student.birthDate,
      gender: student.gender,
      gpa: student.gpa.toString(),
      status: student.status
    });
    setShowEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (showAddModal) {
      // Thêm sinh viên mới
      const newStudent = {
        ...formData,
        id: Math.max(...students.map(s => s.id)) + 1,
        gpa: parseFloat(formData.gpa)
      };
      setStudents([...students, newStudent]);
      setShowAddModal(false);
      showSuccess('✅ Thêm sinh viên thành công!');
    } else if (showEditModal) {
      // Sửa sinh viên
      const updatedStudents = students.map(student =>
        student.id === editingStudent.id
          ? { ...formData, id: student.id, gpa: parseFloat(formData.gpa) }
          : student
      );
      setStudents(updatedStudents);
      setShowEditModal(false);
      setEditingStudent(null);
      showSuccess('✅ Cập nhật sinh viên thành công!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const totalStudents = students.length;
  const studentsPerPage = 5;

  return (
    <>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <div className="student-table-container">
      {/* Header section */}
      <div className="table-header">
        <h2 className="table-title">Quản lý Sinh viên</h2>
        <div className="table-actions">
          <button 
            className="btn-delete"
            onClick={() => setShowDeleteModal(true)}
            disabled={selectedStudents.length === 0}
          >
            🗑️ Xóa ({selectedStudents.length})
          </button>
          <button className="btn-add" onClick={handleAddStudent}>
            ➕ Thêm Sinh viên mới
          </button>
          <button 
            className="btn-export"
            onClick={() => {
              localStorage.removeItem('students');
              setStudents(initialStudents);
              showWarning('🔄 Đã reset dữ liệu về mặc định!');
            }}
            style={{
              background: '#e67e22',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🔄 Reset Data
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="filter-select"
          >
            {majors.map(major => (
              <option key={major} value={major}>
                {major === 'all' ? 'Tất cả chuyên ngành' : major}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Count */}
      <div className="student-count">
        Hiển thị {filteredStudents.length} trong tổng số {totalStudents} sinh viên
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                />
              </th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Chuyên ngành</th>
              <th>Lớp</th>
              <th>GPA</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.major}</td>
                <td>{student.class}</td>
                <td className={`gpa-cell ${student.gpa >= 3.5 ? 'high-gpa' : student.gpa >= 3.0 ? 'medium-gpa' : 'low-gpa'}`}>
                  {student.gpa}
                </td>
                <td>
                  <span className={`status-badge ${student.status === 'Đang học' ? 'active' : 'inactive'}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditStudent(student)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete-single"
                    onClick={() => handleDeleteSingle(student.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Không tìm thấy sinh viên</h3>
          <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            border: '1px solid #ddd'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {showAddModal ? 'Thêm sinh viên mới' : 'Chỉnh sửa sinh viên'}
              </h3>
              <button 
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingStudent(null);
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chuyên ngành</label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Lớp</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>GPA</label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    min="0"
                    max="4"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Địa chỉ</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Đang học">Đang học</option>
                  <option value="Tạm nghỉ">Tạm nghỉ</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingStudent(null);
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  {showAddModal ? 'Thêm sinh viên' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc muốn xóa {selectedStudents.length} sinh viên đã chọn?</p>
              <p>Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn-delete-confirm"
                onClick={handleDeleteSelected}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default StudentTable;

import React, { useEffect, useState } from 'react';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import Admin from '../Types/Admin';
import axiosInstance from "../utils/axios";

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<{ email: string; role: 'admin' | 'super_admin' }>({
    email: '',
    role: 'admin',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axiosInstance.get<Admin[]>('/admins');
      setAdmins(res.data);
    } catch (err) {
      console.error('Failed to fetch admins', err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingAdmin) {
        await axiosInstance.put(`/admins/${editingAdmin.id}`, formData);
      } else {
        await axiosInstance.post('/admins', formData);
      }
      fetchAdmins();
      resetModal();
    } catch (err) {
      console.error('Error saving admin', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await axiosInstance.delete(`/admins/${id}`);
        fetchAdmins();
      } catch (err) {
        console.error('Failed to delete admin', err);
      }
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({ email: admin.email, role: admin.role });
    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    setFormData({ email: '', role: 'admin' });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className='m-4'>Admin Management</h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            resetModal();
            setShowModal(true);
          }}
        >
          <UserPlus size={20} />
          Add New Admin
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>
                  <span className={`badge bg-${admin.role === 'super_admin' ? 'danger' : 'primary'}`}>
                    {admin.role}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(admin)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(admin.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h5>
                  <button type="button" className="btn-close" onClick={resetModal} />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })
                        }
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={resetModal}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    {editingAdmin ? 'Save Changes' : 'Add Admin'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminManagement;

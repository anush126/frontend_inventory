import { useEffect, useState } from "react";
import api from "../api";
import "./PageStyles.css";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    description: ""
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers. Please make sure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/suppliers", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        description: form.description.trim()
      });
      setForm({ name: "", phone: "", email: "", location: "", description: "" });
      setShowCreate(false);
      await fetchSuppliers();
    } catch (err) {
      console.error("Error creating supplier:", err);
      setError(err?.response?.data?.error || "Failed to add supplier.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (supplier) => {
    setEditingId(supplier._id);
    setEditForm({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      location: supplier.location || "",
      description: supplier.description || ""
    });
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const onEditSave = async (id) => {
    setSaving(true);
    setError(null);
    try {
      await api.put(`/suppliers/${id}`, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim(),
        location: editForm.location.trim(),
        description: editForm.description.trim()
      });
      setEditingId(null);
      await fetchSuppliers();
    } catch (err) {
      console.error("Error updating supplier:", err);
      setError(err?.response?.data?.error || "Failed to update supplier.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/suppliers/${id}`);
      await fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError(err?.response?.data?.error || "Failed to delete supplier.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Supplier</h1>
        </div>
        <button className="action-button" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? "Close" : "+ Add Supplier"}
        </button>
      </div>

      <div className="table-container">
        {showCreate && (
          <form className="create-form" onSubmit={onCreate}>
            <div className="create-form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              <div className="create-form-field">
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} required />
              </div>
              <div className="create-form-field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={onChange} />
              </div>
              <div className="create-form-field">
                <label>Email</label>
                <input name="email" value={form.email} onChange={onChange} type="email" />
              </div>
              <div className="create-form-field">
                <label>Location</label>
                <input name="location" value={form.location} onChange={onChange} />
              </div>
              <div className="create-form-field" style={{ gridColumn: "span 2" }}>
                <label>Description</label>
                <input name="description" value={form.description} onChange={onChange} />
              </div>
            </div>
            <div className="create-form-actions">
              <button type="button" className="secondary-button" onClick={() => setShowCreate(false)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="action-button" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-message">Loading suppliers...</div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-message" style={{ color: '#f44336' }}>
              {error}
            </div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-message">No suppliers found. Add your first supplier!</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: '500', color: '#333' }}>
                    {editingId === s._id ? (
                      <input name="name" value={editForm.name} onChange={onEditChange} />
                    ) : (
                      s.name
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <input name="phone" value={editForm.phone} onChange={onEditChange} />
                    ) : (
                      s.phone
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <input name="email" value={editForm.email} onChange={onEditChange} />
                    ) : (
                      s.email
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <input name="location" value={editForm.location} onChange={onEditChange} />
                    ) : (
                      s.location
                    )}
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editingId === s._id ? (
                      <input name="description" value={editForm.description} onChange={onEditChange} />
                    ) : (
                      s.description
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <>
                        <button
                          className="secondary-button"
                          onClick={() => setEditingId(null)}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                        <button
                          className="action-button"
                          onClick={() => onEditSave(s._id)}
                          disabled={saving}
                          style={{ marginLeft: 8 }}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="secondary-button"
                          onClick={() => startEdit(s)}
                          disabled={saving}
                        >
                          Edit
                        </button>
                        <button
                          className="action-button"
                          onClick={() => onDelete(s._id)}
                          disabled={saving}
                          style={{ marginLeft: 8, backgroundColor: "#f44336" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

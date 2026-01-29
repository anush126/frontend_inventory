import { useEffect, useState } from "react";
import api from "../api";
import "./PageStyles.css";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    productName: "",
    category: "",
    quantity: "1",
    price: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    customerName: "",
    productName: "",
    category: "",
    quantity: "1",
    price: ""
  });

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError("Failed to load sales. Please make sure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const totalSales = sales.reduce((sum, sale) => sum + (parseFloat(sale.price) || 0), 0);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/sales", {
        customerName: form.customerName.trim(),
        productName: form.productName.trim(),
        category: form.category.trim(),
        quantity: Math.max(1, Number(form.quantity) || 1),
        price: Number(form.price) || 0
      });
      setForm({ customerName: "", productName: "", category: "", quantity: "1", price: "" });
      setShowCreate(false);
      await fetchSales();
    } catch (err) {
      console.error("Error creating sale:", err);
      setError(err?.response?.data?.error || "Failed to add sale.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (sale) => {
    setEditingId(sale._id);
    setEditForm({
      customerName: sale.customerName || "",
      productName: sale.productName || "",
      category: sale.category || "",
      quantity: String(sale.quantity ?? "1"),
      price: String(sale.price ?? "")
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
      await api.put(`/sales/${id}`, {
        customerName: editForm.customerName.trim(),
        productName: editForm.productName.trim(),
        category: editForm.category.trim(),
        quantity: Math.max(1, Number(editForm.quantity) || 1),
        price: Number(editForm.price) || 0
      });
      setEditingId(null);
      await fetchSales();
    } catch (err) {
      console.error("Error updating sale:", err);
      setError(err?.response?.data?.error || "Failed to update sale.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/sales/${id}`);
      await fetchSales();
    } catch (err) {
      console.error("Error deleting sale:", err);
      setError(err?.response?.data?.error || "Failed to delete sale.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Sales</h1>
        </div>
        <button className="action-button" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? "Close" : "+ Add Sales"}
        </button>
      </div>

      {sales.length > 0 && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <strong style={{ color: '#333', fontSize: '16px' }}>
            Total Sales: <span style={{ color: '#2196F3', fontSize: '20px' }}>₹{totalSales.toFixed(2)}</span>
          </strong>
        </div>
      )}

      <div className="table-container">
        {showCreate && (
          <form className="create-form" onSubmit={onCreate}>
            <div className="create-form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              <div className="create-form-field">
                <label>Customer Name</label>
                <input name="customerName" value={form.customerName} onChange={onChange} required placeholder="e.g. Rahul" />
              </div>
              <div className="create-form-field">
                <label>Product Name</label>
                <input name="productName" value={form.productName} onChange={onChange} required placeholder="e.g. Sugar" />
              </div>
              <div className="create-form-field">
                <label>Category</label>
                <input name="category" value={form.category} onChange={onChange} required placeholder="e.g. Grocery" />
              </div>
              <div className="create-form-field">
                <label>Quantity</label>
                <input name="quantity" value={form.quantity} onChange={onChange} type="number" min="1" placeholder="e.g. 1" />
              </div>
              <div className="create-form-field">
                <label>Price</label>
                <input name="price" value={form.price} onChange={onChange} type="number" min="0" step="0.01" placeholder="e.g. 200" />
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
            <div className="empty-state-message">Loading sales...</div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-message" style={{ color: '#f44336' }}>
              {error}
            </div>
          </div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-message">No sales records found. Add your first sale!</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s._id}>
                  <td>
                    {editingId === s._id ? (
                      <input
                        name="customerName"
                        value={editForm.customerName}
                        onChange={onEditChange}
                      />
                    ) : (
                      s.customerName
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <input
                        name="productName"
                        value={editForm.productName}
                        onChange={onEditChange}
                      />
                    ) : (
                      s.productName
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <input
                        name="category"
                        value={editForm.category}
                        onChange={onEditChange}
                      />
                    ) : (
                      s.category
                    )}
                  </td>
                  <td>
                    {editingId === s._id ? (
                      <input
                        name="quantity"
                        type="number"
                        min="1"
                        value={editForm.quantity}
                        onChange={onEditChange}
                      />
                    ) : (
                      s.quantity ?? 1
                    )}
                  </td>
                  <td style={{ color: '#2196F3', fontWeight: '600' }}>
                    {editingId === s._id ? (
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={onEditChange}
                      />
                    ) : (
                      <>₹{s.price}</>
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

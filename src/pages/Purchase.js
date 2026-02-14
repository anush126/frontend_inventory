import { useEffect, useState } from "react";
import api from "../api";
import "./PageStyles.css";

const PRODUCT_VALUE_SEP = "\u241f"; // unit separator for name|category

export default function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    supplier: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    supplier: ""
  });

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/purchases");
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("Failed to load purchases. Please make sure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const onProductSelect = (e) => {
    const value = e.target.value;
    if (!value) {
      setForm(prev => ({ ...prev, name: "", category: "" }));
      return;
    }
    const [name, category] = value.split(PRODUCT_VALUE_SEP);
    setForm(prev => ({ ...prev, name: name || "", category: category || "" }));
  };

  const onEditProductSelect = (e) => {
    const value = e.target.value;
    if (!value) {
      setEditForm(prev => ({ ...prev, name: "", category: "" }));
      return;
    }
    const [name, category] = value.split(PRODUCT_VALUE_SEP);
    setEditForm(prev => ({ ...prev, name: name || "", category: category || "" }));
  };

  const totalPurchases = purchases.reduce((sum, purchase) => sum + (parseFloat(purchase.price) || 0), 0);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post("/purchases", {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        supplier: form.supplier.trim()
      });
      setForm({ name: "", category: "", price: "", stock: "", supplier: "" });
      setShowCreate(false);
      await fetchPurchases();
      await fetchProducts();
    } catch (err) {
      console.error("Error creating purchase:", err);
      setError(err?.response?.data?.error || "Failed to add purchase.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (purchase) => {
    setEditingId(purchase._id);
    setEditForm({
      name: purchase.name || "",
      category: purchase.category || "",
      price: String(purchase.price ?? ""),
      stock: String(purchase.stock ?? ""),
      supplier: purchase.supplier || ""
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
      await api.put(`/purchases/${id}`, {
        name: editForm.name.trim(),
        category: editForm.category.trim(),
        price: Number(editForm.price) || 0,
        stock: Number(editForm.stock) || 0,
        supplier: editForm.supplier.trim()
      });
      setEditingId(null);
      await fetchPurchases();
      await fetchProducts();
    } catch (err) {
      console.error("Error updating purchase:", err);
      setError(err?.response?.data?.error || "Failed to update purchase.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/purchases/${id}`);
      await fetchPurchases();
    } catch (err) {
      console.error("Error deleting purchase:", err);
      setError(err?.response?.data?.error || "Failed to delete purchase.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Purchase</h1>
        </div>
        <button className="action-button" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? "Close" : "+ Add Purchases"}
        </button>
      </div>

      {purchases.length > 0 && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <strong style={{ color: '#333', fontSize: '16px' }}>
            Total Purchases: <span style={{ color: '#2196F3', fontSize: '20px' }}>₹{totalPurchases.toFixed(2)}</span>
          </strong>
        </div>
      )}

      <div className="table-container">
        {showCreate && (
          <form className="create-form" onSubmit={onCreate}>
            <div className="create-form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              <div className="create-form-field">
                <label>Product</label>
                <select
                  value={form.name && form.category ? `${form.name}${PRODUCT_VALUE_SEP}${form.category}` : ""}
                  onChange={onProductSelect}
                  required
                  className="create-form-select"
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p._id} value={`${p.name}${PRODUCT_VALUE_SEP}${p.category}`}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
              <div className="create-form-field">
                <label>Supplier</label>
                <select
                  name="supplier"
                  value={form.supplier}
                  onChange={onChange}
                  className="create-form-select"
                >
                  <option value="">Select supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s.name || ""}>
                      {s.name}
                      {s.location ? ` — ${s.location}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="create-form-field">
                <label>Price</label>
                <input name="price" value={form.price} onChange={onChange} type="number" min="0" step="0.01" placeholder="e.g. 150" />
              </div>
              <div className="create-form-field">
                <label>Stock (Qty)</label>
                <input name="stock" value={form.stock} onChange={onChange} type="number" min="0" placeholder="e.g. 10" />
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
            <div className="empty-state-message">Loading purchases...</div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-message" style={{ color: '#f44336' }}>
              {error}
            </div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-message">No purchase records found. Add your first purchase!</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p._id}>
                  <td>
                    {editingId === p._id ? (
                      <select
                        value={editForm.name && editForm.category ? `${editForm.name}${PRODUCT_VALUE_SEP}${editForm.category}` : ""}
                        onChange={onEditProductSelect}
                        className="create-form-select"
                        style={{ minWidth: "140px" }}
                      >
                        <option value="">Select product...</option>
                        {products.map((prod) => (
                          <option key={prod._id} value={`${prod.name}${PRODUCT_VALUE_SEP}${prod.category}`}>
                            {prod.name} ({prod.category})
                          </option>
                        ))}
                      </select>
                    ) : (
                      p.name
                    )}
                  </td>
                  <td>
                    {editingId === p._id ? (
                      <input
                        name="category"
                        value={editForm.category}
                        readOnly
                        style={{ width: "100%", backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                      />
                    ) : (
                      p.category
                    )}
                  </td>
                  <td style={{ color: '#2196F3', fontWeight: '600' }}>
                    {editingId === p._id ? (
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.price}
                        onChange={onEditChange}
                      />
                    ) : (
                      <>₹{p.price}</>
                    )}
                  </td>
                  <td>
                    {editingId === p._id ? (
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        value={editForm.stock}
                        onChange={onEditChange}
                      />
                    ) : (
                      <span style={{ 
                        color: p.stock === 0 ? '#f44336' : p.stock < 10 ? '#ff9800' : '#4caf50',
                        fontWeight: '500'
                      }}>
                        {p.stock}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === p._id ? (
                      <select
                        name="supplier"
                        value={editForm.supplier}
                        onChange={onEditChange}
                        className="create-form-select"
                        style={{ minWidth: "140px" }}
                      >
                        <option value="">Select supplier...</option>
                        {suppliers.map((s) => (
                          <option key={s._id} value={s.name || ""}>
                            {s.name}
                            {s.location ? ` — ${s.location}` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      p.supplier
                    )}
                  </td>
                  <td>
                    {editingId === p._id ? (
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
                          onClick={() => onEditSave(p._id)}
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
                          onClick={() => startEdit(p)}
                          disabled={saving}
                        >
                          Edit
                        </button>
                        <button
                          className="action-button"
                          onClick={() => onDelete(p._id)}
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

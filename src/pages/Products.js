import api from "../api";
import { useEffect, useState } from "react";
import "./PageStyles.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", stock: "" });
   const [editingId, setEditingId] = useState(null);
   const [editForm, setEditForm] = useState({ name: "", category: "", stock: "" });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please make sure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      await api.post("/products", {
        name: form.name.trim(),
        category: form.category.trim(),
        stock: Number(form.stock) || 0
      });
      setForm({ name: "", category: "", stock: "" });
      setShowCreate(false);
      await fetchProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err?.response?.data?.error || "Failed to add product.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name || "",
      category: product.category || "",
      stock: String(product.stock ?? "")
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
      await api.put(`/products/${id}`, {
        name: editForm.name.trim(),
        category: editForm.category.trim(),
        stock: Number(editForm.stock) || 0
      });
      setEditingId(null);
      await fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err?.response?.data?.error || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err?.response?.data?.error || "Failed to delete product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Products</h1>
        </div>
        <button className="action-button" onClick={() => setShowCreate(v => !v)}>
          {showCreate ? "Close" : "+ Add Product"}
        </button>
      </div>

      <div className="table-container">
        {showCreate && (
          <form className="create-form" onSubmit={onCreate}>
            <div className="create-form-grid">
              <div className="create-form-field">
                <label>Product Name</label>
                <input name="name" value={form.name} onChange={onChange} required placeholder="e.g. Sugar" />
              </div>
              <div className="create-form-field">
                <label>Category</label>
                <input name="category" value={form.category} onChange={onChange} required placeholder="e.g. Grocery" />
              </div>
              <div className="create-form-field">
                <label>Stock</label>
                <input name="stock" value={form.stock} onChange={onChange} type="number" min="0" placeholder="e.g. 25" />
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
            <div className="empty-state-message">Loading products...</div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-message" style={{ color: '#f44336' }}>
              {error}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-message">No products found. Add your first product!</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    {editingId === p._id ? (
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={onEditChange}
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td>
                    {editingId === p._id ? (
                      <input
                        name="category"
                        value={editForm.category}
                        onChange={onEditChange}
                      />
                    ) : (
                      p.category
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

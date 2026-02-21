import React, { useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    dailySales: 0,
    monthlySales: 0,
    monthlyTransactions: 0,
    salesTrendData: []
  });
  const [rawData, setRawData] = useState({ products: [], sales: [], todaySales: [] });
  const [detailModal, setDetailModal] = useState({ show: false, type: null });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get("/products"),
          api.get("/sales")
        ]);

        const products = productsRes.data || [];
        const sales = salesRes.data || [];

        const totalProducts = products.length;
        const lowStock = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) < 10).length;
        const outOfStock = products.filter(p => !p.stock || Number(p.stock) <= 0).length;

        // Helper function to normalize date to start of day (local timezone)
        const normalizeDate = (date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d;
        };

        const now = new Date();
        const today = normalizeDate(now);
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth();

        // Sales in current month (by sale.date; no date = treat as today)
        const thisMonthSales = sales.filter(s => {
          const d = s.date ? new Date(s.date) : new Date();
          return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
        });
        const monthlySales = thisMonthSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        const monthlyTransactions = thisMonthSales.length;

        // Calculate daily sales for today
        const todaySalesList = sales.filter(s => {
          if (!s.date) return false;
          const saleDate = normalizeDate(s.date);
          return saleDate.getTime() === today.getTime();
        });
        const dailySales = todaySalesList.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

        // Store raw data for detail modals
        setRawData({ products, sales, todaySales: todaySalesList });

        // By day of month: { day 1..31, amount }
        const amountByDay = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, amount: 0 }));
        thisMonthSales.forEach(s => {
          const d = s.date ? new Date(s.date) : new Date();
          const day = d.getDate();
          if (day >= 1 && day <= 31) {
            amountByDay[day - 1].amount += Number(s.price) || 0;
          }
        });
        const salesTrendData = amountByDay;

        setStats({
          totalProducts,
          lowStock,
          outOfStock,
          dailySales,
          monthlySales,
          monthlyTransactions,
          salesTrendData
        });
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please make sure the backend server is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const yAxisMax = 20000; // Y-axis (amount) scale: 0 to 20000
  const chartLeft = 45;
  const chartBottom = 185;
  const chartWidth = 440;
  const chartHeight = 160;
  const days = stats.salesTrendData;
  const yAxisValues = [0, 5000, 10000, 15000, 20000];
  const xAxisValues = [1, 5, 10, 15, 20, 25, 30];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="inventory-system-box">
            <img src="/AT.png" alt="Anil Tradelinks logo" className="inventory-logo" />
            <span>Anil Tradelinks</span>
          </div>        </div>
        <div className="header-center">
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
      </div>

      {/* KPI Cards - Clickable */}
      <div className="kpi-cards">
        <div className="kpi-card kpi-card-clickable" onClick={() => setDetailModal({ show: true, type: 'totalProducts' })}>
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value">
            {loading ? "[...]" : `[${stats.totalProducts}]`}
          </div>
          <div className="kpi-hint">Click to view</div>
        </div>
        <div className="kpi-card kpi-card-clickable" onClick={() => setDetailModal({ show: true, type: 'lowStock' })}>
          <div className="kpi-label">Low Stock</div>
          <div className="kpi-value">
            {loading ? "[...]" : `[${stats.lowStock}]`}
          </div>
          <div className="kpi-hint">Click to view</div>
        </div>
        <div className="kpi-card kpi-card-clickable" onClick={() => setDetailModal({ show: true, type: 'outOfStock' })}>
          <div className="kpi-label">Out of Stock</div>
          <div className="kpi-value">
            {loading ? "[...]" : `[${stats.outOfStock}]`}
          </div>
          <div className="kpi-hint">Click to view</div>
        </div>
        <div className="kpi-card kpi-card-clickable" onClick={() => setDetailModal({ show: true, type: 'dailySales' })}>
          <div className="kpi-label">Daily Sales</div>
          <div className="kpi-value">
            {loading ? "[Rs....]" : `[Rs.${stats.dailySales.toFixed(2)}]`}
          </div>
          <div className="kpi-hint">Click to view</div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '16px', color: '#f44336', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-content">
        {/* Left Panel - Monthly Sales Summary */}
        <div className="panel monthly-sales-panel">
          <h2 className="panel-title">Monthly Sales Summary</h2>
          <div className="sales-amount">
            {loading ? "[Rs....]" : `[Rs.${stats.monthlySales.toFixed(2)}]`}
          </div>
          <div className="sales-transactions">
            {loading
              ? "Loading transactions..."
              : `${stats.monthlyTransactions} transaction${stats.monthlyTransactions !== 1 ? 's' : ''} this month`}
          </div>
        </div>

        {/* Right Panel - Sales Trend: X = amount, Y = days of month */}
        <div className="panel sales-trend-panel">
          <h2 className="panel-title">Sales Trend (This Month)</h2>
          <div className="chart-container">
            <svg className="line-chart" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
              {/* Y-axis: amount (₹) */}
              {yAxisValues.map((val) => {
                const y = chartBottom - (val / yAxisMax) * chartHeight;
                return (
                  <text key={val} x="8" y={y + 4} className="axis-label">
                    {val.toLocaleString()}
                  </text>
                );
              })}
              <line x1={chartLeft} y1="10" x2={chartLeft} y2={chartBottom} stroke="#ddd" strokeWidth="1" />
              {/* X-axis: day of month */}
              <text x={chartLeft + chartWidth / 2 - 40} y="206" className="axis-label">
              </text>
              {xAxisValues.map((d) => {
                const x = chartLeft + (d / 31) * chartWidth;
                return (
                  <text key={d} x={x - 4} y="198" className="axis-label">
                    {d}
                  </text>
                );
              })}
              <line x1={chartLeft} y1={chartBottom} x2={chartLeft + chartWidth} y2={chartBottom} stroke="#ddd" strokeWidth="1" />
              {/* Line graph: points (day, amount) connected by line */}
              {(() => {
                const points = days
                  .filter((d) => d.amount > 0)
                  .sort((a, b) => a.day - b.day)
                  .map(({ day, amount }) => {
                    const x = chartLeft + (day / 31) * chartWidth;
                    const y = chartBottom - (amount / yAxisMax) * chartHeight;
                    return { x, y, day, amount };
                  });
                if (points.length === 0) return null;
                const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
                return (
                  <>
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="#4FC3F7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p) => (
                      <circle key={p.day} cx={p.x} cy={p.y} r="4" fill="#4FC3F7" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal.show && (
        <div className="dashboard-modal-overlay" onClick={() => setDetailModal({ show: false, type: null })}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h3>
                {detailModal.type === 'totalProducts' && 'All Products'}
                {detailModal.type === 'lowStock' && 'Low Stock Products'}
                {detailModal.type === 'outOfStock' && 'Out of Stock Products'}
                {detailModal.type === 'dailySales' && "Today's Sales"}
              </h3>
              <button className="dashboard-modal-close" onClick={() => setDetailModal({ show: false, type: null })}>×</button>
            </div>
            <div className="dashboard-modal-body">
              {detailModal.type === 'totalProducts' && (
                rawData.products.length === 0 ? (
                  <p className="dashboard-modal-empty">No products found.</p>
                ) : (
                  <table className="dashboard-modal-table">
                    <thead>
                      <tr><th>Name</th><th>Category</th><th>Stock</th></tr>
                    </thead>
                    <tbody>
                      {rawData.products.map(p => (
                        <tr key={p._id}>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td style={{ color: p.stock === 0 ? '#f44336' : p.stock < 10 ? '#ff9800' : '#4caf50' }}>{p.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
              {detailModal.type === 'lowStock' && (
                (() => {
                  const lowStockProducts = rawData.products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) < 10);
                  return lowStockProducts.length === 0 ? (
                    <p className="dashboard-modal-empty">No low stock products.</p>
                  ) : (
                    <table className="dashboard-modal-table">
                      <thead>
                        <tr><th>Name</th><th>Category</th><th>Stock</th></tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map(p => (
                          <tr key={p._id}>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td style={{ color: '#ff9800', fontWeight: '600' }}>{p.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()
              )}
              {detailModal.type === 'outOfStock' && (
                (() => {
                  const outOfStockProducts = rawData.products.filter(p => !p.stock || Number(p.stock) <= 0);
                  return outOfStockProducts.length === 0 ? (
                    <p className="dashboard-modal-empty">No out of stock products.</p>
                  ) : (
                    <table className="dashboard-modal-table">
                      <thead>
                        <tr><th>Name</th><th>Category</th><th>Stock</th></tr>
                      </thead>
                      <tbody>
                        {outOfStockProducts.map(p => (
                          <tr key={p._id}>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td style={{ color: '#f44336', fontWeight: '600' }}>0</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()
              )}
              {detailModal.type === 'dailySales' && (
                rawData.todaySales.length === 0 ? (
                  <p className="dashboard-modal-empty">No sales recorded today.</p>
                ) : (
                  <table className="dashboard-modal-table">
                    <thead>
                      <tr><th>Customer</th><th>Product</th><th>Qty</th><th>Price</th></tr>
                    </thead>
                    <tbody>
                      {rawData.todaySales.map(s => (
                        <tr key={s._id}>
                          <td>{s.customerName}</td>
                          <td>{s.productName}</td>
                          <td>{s.quantity || 1}</td>
                          <td style={{ color: '#2196F3', fontWeight: '600' }}>₹{s.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

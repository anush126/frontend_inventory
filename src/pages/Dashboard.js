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

        const totalSalesAmount = sales.reduce((sum, sale) => sum + (Number(sale.price) || 0), 0);

        // For now, treat all sales as this month's and today's
        const dailySales = totalSalesAmount;
        const monthlySales = totalSalesAmount;
        const monthlyTransactions = sales.length;

        // Simple trend: last up to 5 sales amounts
        const lastSales = sales.slice(-5);
        const salesTrendData = lastSales.map(s => Number(s.price) || 0);

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

  const maxValue = stats.salesTrendData.length
    ? Math.max(...stats.salesTrendData) * 1.25
    : 40;

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="inventory-system-box">Inventory System</div>
        </div>
        <div className="header-center">
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value">
            {loading ? "[...]" : `[${stats.totalProducts}]`}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Low Stock</div>
          <div className="kpi-value">
            {loading ? "[...]" : `[${stats.lowStock}]`}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Out of Stock</div>
          <div className="kpi-value">
            {loading ? "[...]" : `[${stats.outOfStock}]`}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Daily Sales</div>
          <div className="kpi-value">
            {loading ? "[Rs....]" : `[Rs.${stats.dailySales.toFixed(2)}]`}
          </div>
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

        {/* Right Panel - 30-Day Sales Trend */}
        <div className="panel sales-trend-panel">
          <h2 className="panel-title">30-Day Sales Trend</h2>
          <div className="chart-container">
            <svg className="line-chart" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Y-axis labels */}
              <text x="10" y="20" className="axis-label">40</text>
              <text x="10" y="60" className="axis-label">30</text>
              <text x="10" y="100" className="axis-label">20</text>
              <text x="10" y="140" className="axis-label">10</text>
              <text x="10" y="180" className="axis-label">0</text>
              
              {/* Y-axis line */}
              <line x1="40" y1="10" x2="40" y2="190" stroke="#ddd" strokeWidth="1" />
              
              {/* X-axis labels */}
              <text x="100" y="195" className="axis-label">Item 1</text>
              <text x="180" y="195" className="axis-label">Item 2</text>
              <text x="260" y="195" className="axis-label">Item 3</text>
              <text x="340" y="195" className="axis-label">Item 4</text>
              <text x="420" y="195" className="axis-label">Item 5</text>
              
              {/* X-axis line */}
              <line x1="40" y1="190" x2="480" y2="190" stroke="#ddd" strokeWidth="1" />
              
              {/* Line chart */}
              <polyline
                points={stats.salesTrendData.map((value, index) => {
                  const x = 100 + (index * 80);
                  const y = 190 - ((value / maxValue) * 180);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#4FC3F7"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {stats.salesTrendData.map((value, index) => {
                const x = 100 + (index * 80);
                const y = 190 - ((value / maxValue) * 180);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#4FC3F7"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <img src="/AT.png" alt="Anil Tradelinks" className="landing-header-logo" />
          <span className="landing-header-name">Anil Tradelinks</span>
        </div>
        <Link to="/dashboard" className="landing-header-cta">
          Enter Dashboard
        </Link>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Your Electronics Inventory,<br />Simplified.
          </h1>
          <p className="landing-hero-subtitle">
            Track products, manage sales, handle purchases, and connect with suppliers — all in one place. 
            Built for Anil Tradelinks to keep your electronics business organized and efficient.
          </p>
          <Link to="/dashboard" className="landing-cta">
            Get Started
          </Link>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="landing-section">
        <h2 className="landing-section-title">Quick Start Guide</h2>
        <p className="landing-section-subtitle">
          Learn how to use each section of your inventory management system
        </p>
        
        <div className="landing-guide-grid">
          <div className="landing-guide-card">
            <div className="landing-guide-icon">📊</div>
            <h3>Dashboard</h3>
            <p>
              Your homepage overview. See total products, low stock alerts, daily &amp; monthly sales at a glance. 
              The sales trend chart shows your business performance throughout the month.
            </p>
            <span className="landing-guide-path">Path: Dashboard</span>
          </div>

          <div className="landing-guide-card">
            <div className="landing-guide-icon">📦</div>
            <h3>Products</h3>
            <p>
              View all your electronics inventory here. Each product shows name, category, and current stock level. 
              Add new products or edit existing ones. Stock updates automatically when you make purchases or sales.
            </p>
            <span className="landing-guide-path">Path: Products</span>
          </div>

          <div className="landing-guide-card">
            <div className="landing-guide-icon">🛒</div>
            <h3>Sales</h3>
            <p>
              Record customer sales here. Select a product from the dropdown, enter customer name, quantity, and price. 
              The product stock decreases automatically. View all past sales and total revenue.
            </p>
            <span className="landing-guide-path">Path: Sales</span>
          </div>

          <div className="landing-guide-card">
            <div className="landing-guide-icon">📥</div>
            <h3>Purchase</h3>
            <p>
              Log purchases from suppliers. Select product, choose supplier from dropdown, enter quantity and price. 
              Product stock increases automatically. Track all your purchase history and costs.
            </p>
            <span className="landing-guide-path">Path: Purchase</span>
          </div>

          <div className="landing-guide-card">
            <div className="landing-guide-icon">🏢</div>
            <h3>Supplier</h3>
            <p>
              Manage your supplier contacts. Add supplier name, phone, email, location, and notes. 
              Once added, suppliers appear in the Purchase dropdown for quick selection.
            </p>
            <span className="landing-guide-path">Path: Supplier</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section landing-section-alt">
        <h2 className="landing-section-title">How It Works</h2>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step-number">1</div>
            <h4>Add Your Products</h4>
            <p>Start by adding your electronics inventory in the Products section with name, category, and initial stock.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-number">2</div>
            <h4>Register Suppliers</h4>
            <p>Add your supplier contacts in the Supplier section so you can link them to purchases.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-number">3</div>
            <h4>Record Transactions</h4>
            <p>Use Sales to record customer sales and Purchase to log restocking. Stock updates automatically.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-number">4</div>
            <h4>Monitor Dashboard</h4>
            <p>Check the Dashboard for KPIs, stock alerts, and sales trends to make informed decisions.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section">
        <h2 className="landing-section-title">Why Use This System?</h2>
        <div className="landing-features-grid">
          <div className="landing-feature">
            <span className="landing-feature-icon">⚡</span>
            <h4>Fast & Simple</h4>
            <p>Clean interface, no complex setup. Start managing inventory in minutes.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">📈</span>
            <h4>Real-time Stock</h4>
            <p>Stock levels update instantly when you make sales or purchases.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">🔔</span>
            <h4>Low Stock Alerts</h4>
            <p>Dashboard shows low stock and out-of-stock items so you never miss a restock.</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature-icon">💰</span>
            <h4>Sales Tracking</h4>
            <p>Track daily, monthly sales and view revenue trends at a glance.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="landing-footer-cta">
        <h2>Ready to manage your inventory?</h2>
        <p>Click below to open the dashboard and start tracking your electronics business.</p>
        <Link to="/dashboard" className="landing-cta">
          Open Dashboard
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <img src="/AT.png" alt="Anil Tradelinks" className="landing-footer-logo" />
            <span>Anil Tradelinks</span>
          </div>
          <p className="landing-footer-tagline">Your trusted electronics partner</p>
          <p className="landing-footer-copyright">
            &copy; {new Date().getFullYear()} Anil Tradelinks. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

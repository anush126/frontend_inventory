import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-content">
          <div className="app-footer-section">
            <h4>Anil Tradelinks</h4>
            <p>Electronics & inventory management for your business.</p>
          </div>
          <div className="app-footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/purchase">Purchase</Link></li>
              <li><Link to="/supplier">Suppliers</Link></li>
            </ul>
          </div>
          <div className="app-footer-section">
            <h4>Contact</h4>
            <p>Email: info@aniltradelinks.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
          </div>
        </div>
        <p className="app-footer-copyright">
          &copy; {currentYear} Anil Tradelinks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

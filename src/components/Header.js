import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header-brand">
        <img src="/AT.png" alt="Anil Tradelinks" className="app-header-logo" />
        <div className="app-header-text">
          <span className="app-header-name">Anil Tradelinks</span>
          <span className="app-header-tagline">Electronics | Inventory Management</span>
        </div>
      </Link>
    </header>
  );
}

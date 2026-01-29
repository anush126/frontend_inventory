import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Dashboard
      </Link>
      <Link 
        to="/products" 
        className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
      >
        Products
      </Link>
      <Link 
        to="/sales" 
        className={`nav-link ${location.pathname === '/sales' ? 'active' : ''}`}
      >
        Sales
      </Link>
      <Link 
        to="/purchase" 
        className={`nav-link ${location.pathname === '/purchase' ? 'active' : ''}`}
      >
        Purchase
      </Link>
      <Link 
        to="/supplier" 
        className={`nav-link ${location.pathname === '/supplier' ? 'active' : ''}`}
      >
        Supplier
      </Link>
    </nav>
  );
}

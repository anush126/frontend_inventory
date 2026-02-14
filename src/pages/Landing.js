import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Background decorations: containers / business shapes */}
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-bg-shape landing-bg-box landing-bg-box-1" />
        <div className="landing-bg-shape landing-bg-box landing-bg-box-2" />
        <div className="landing-bg-shape landing-bg-box landing-bg-box-3" />
        <div className="landing-bg-shape landing-bg-crate landing-bg-crate-1" />
        <div className="landing-bg-shape landing-bg-crate landing-bg-crate-2" />
        <div className="landing-bg-shape landing-bg-pallet landing-bg-pallet-1" />
        <svg className="landing-bg-shape landing-bg-icon landing-bg-icon-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <svg className="landing-bg-shape landing-bg-icon landing-bg-icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <svg className="landing-bg-shape landing-bg-icon landing-bg-icon-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      </div>

      <div className="landing-content">
        <div className="landing-brand">
          <img src="/AT.png" alt="Anil Tradelinks" className="landing-logo" />
          <h1 className="landing-title">Anil Tradelinks</h1>
          <p className="landing-tagline">Inventory Management System</p>
        </div>
        <Link to="/dashboard" className="landing-cta">
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
}

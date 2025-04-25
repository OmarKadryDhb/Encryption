import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
export default function Navbar() {
    return <>
    <nav className="navbar navbar-expand-lg p-4">
  <div className="container">
    <Link className="navbar-brand fw-bold main-link" to="Home">CyberSecurity Project</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav ms-5">
        <Link className="nav-link active" to="CBC">CBC</Link>
        <Link className="nav-link" to="RSA">RSA</Link>
        <Link className="nav-link" to="SHA-1">SHA-1</Link>
      </div>
    </div>
  </div>
</nav>
    </>
}

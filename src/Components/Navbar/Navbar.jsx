import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
export default function Navbar() {
    return <>
    <nav class="navbar navbar-expand-lg p-4">
  <div class="container">
    <Link class="navbar-brand fw-bold" to="Home">CyberSecurity Project</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav ms-5">
        <Link class="nav-link active" aria-current="page" to="Home">Home</Link>
        <Link class="nav-link" to="CBC">CBC</Link>
        <Link class="nav-link" to="RSA">RSA</Link>
        <Link class="nav-link" to="SHA-1">SHA-1</Link>
      </div>
    </div>
  </div>
</nav>
    </>
}

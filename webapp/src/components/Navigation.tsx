import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/" className="nav-logo">
            TaskManager
          </NavLink>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              end
            >
              All Tasks
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/active" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Active
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/completed" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Completed
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 
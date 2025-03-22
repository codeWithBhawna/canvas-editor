import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Import sidebar styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Template Builder</h2>
      <ul>
        <li>
          <Link to="/">🏠 Dashboard</Link>
        </li>
        <li>
          <Link to="/canvas">🎨 Canvas Editor</Link>
        </li>
        <li>
          <Link to="/profile">👤 Profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

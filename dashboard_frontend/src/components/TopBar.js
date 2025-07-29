import React from "react";
/**
 * PUBLIC_INTERFACE
 * TopBar (Navigation Bar): Provides menu for app sections and theme toggling.
 * Props:
 *   - menus: array of { name, key }
 *   - selected: string (selected key)
 *   - onMenuSelect: (key) => void
 *   - children: right-aligned content (optional)
 */
function TopBar({ menus, selected, onMenuSelect, children }) {
  return (
    <nav className="topnav">
      <span className="topnav-logo">SLT Dashboard</span>
      <div className="topnav-menu" role="menubar">
        {(menus || []).map((menu) => (
          <button
            className={`topnav-menuitem${selected === menu.key ? " selected" : ""}`}
            key={menu.key}
            onClick={() => onMenuSelect(menu.key)}
            tabIndex={0}
            aria-label={menu.name}
            aria-current={selected === menu.key ? "page" : undefined}
          >
            {menu.name}
          </button>
        ))}
      </div>
      <div className="topnav-right">
        {children}
      </div>
    </nav>
  );
}

export default TopBar;

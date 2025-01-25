import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Faicons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SideListData } from './SideListData';
import '../styles/SideList.css';

const SideList = () => {
  const [sidebar, setSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const menuBarRef = useRef(null);

  const showSidebar = () => setSidebar(!sidebar);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebar && 
          !sidebarRef.current?.contains(event.target) && 
          !menuBarRef.current?.contains(event.target)) {
        setSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebar]);

  return (
    <>
      <div className="SideList">
        <div className="menu-bars" onClick={showSidebar} ref={menuBarRef}>
          <Faicons.FaBars />
        </div>
      </div>
      <nav 
        className={sidebar ? 'nav-menu active' : 'nav-menu'} 
        ref={sidebarRef}
      >
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <div className="menu-bars" onClick={showSidebar}>
              <AiIcons.AiOutlineClose />
            </div>
          </li>
          {SideListData.map((item, index) => (
            <li key={index} className={item.cName}>
              <Link to={item.path} onClick={() => setSidebar(false)}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SideList;
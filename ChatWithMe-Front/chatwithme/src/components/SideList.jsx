import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SideList.css';
import * as Faicons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SideListData } from './SideListData';
import '../styles/SideList.css';

const SideList = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className="SideList">
        <Link to="/" className="menu-bars" onClick={showSidebar}>
          <Faicons.FaBars />
        </Link>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="/" className="menu-bars" onClick={showSidebar}>
              <AiIcons.AiOutlineClose />
            </Link>
          </li>
          {SideListData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default SideList;
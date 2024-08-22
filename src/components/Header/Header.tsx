import { avatar } from "../../assets";
import { adminDetails } from "../../content";
import { MenuOutlined } from "@ant-design/icons"; // Import the Menu icon
import { useState } from "react";
import { Drawer, Modal } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { home, logo, logoutIcon, profileIcon, wardensIcon } from "../../assets";
import { ReactSVG } from "react-svg";

const Header = () => {
  const navigate = useNavigate();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOk = () => {
    // Clear authToken from localStorage
    localStorage.removeItem("authToken");

    // Close the modal and navigate to the login page
    setIsModalVisible(false);
    navigate("/login");
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const renderNavItems = () => (
    <ul onClick={toggleDrawer}>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <ReactSVG src={home} />
          <span>Dashboard</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/wardens"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <ReactSVG src={wardensIcon} />
          <span>All Wardens</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <ReactSVG src={profileIcon} />
          <span>My Profile</span>
        </NavLink>
      </li>
      <li>
        <button className={styles.logoutButton} onClick={toggleModal}>
          <ReactSVG src={logoutIcon} />
          <span>Log Out</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <div className={styles.headerContainer}>
        <MenuOutlined className={styles.menuIcon} onClick={toggleDrawer} />
        <div className={styles.leftSide}></div>
        <div className={styles.profile}>
          <img src={avatar} alt="Admin Avatar" />
          <h6>{adminDetails.fullName}</h6>
        </div>
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title={
          <div className={styles.logo}>
            <Link to={"/"}>
              <img className={styles.logoImg} src={logo} alt="HostelHub" />
            </Link>
          </div>
        }
        width={280}
        placement="left"
        onClose={toggleDrawer}
        open={isDrawerVisible}
        className={styles.drawer}
      >
        <nav>{renderNavItems()}</nav>
      </Drawer>

      <Modal
        title="Are You Sure?"
        open={isModalVisible}
        onCancel={toggleModal}
        footer={null} // Remove default footer
      >
        <div className="modalContent">
          <p className="modalDescription">
            Are you sure you want to logout from the system?
          </p>

          <div className="buttonsGroup">
            <button onClick={toggleModal} className="primary">
              Cancel
            </button>
            <button onClick={handleOk} className="info">
              Yes, I'm sure
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;

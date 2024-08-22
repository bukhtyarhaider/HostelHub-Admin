import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "antd";
import styles from "./Sidebar.module.scss";
import { home, logo, logoutIcon, profileIcon, wardensIcon } from "../../assets";
import { ReactSVG } from "react-svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Clear authToken from localStorage
    localStorage.removeItem("authToken");

    // Close the modal and navigate to the login page
    setIsModalVisible(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Link to={"/"}>
          <img src={logo} alt="HostelHub" />
        </Link>
      </div>
      <nav>
        <ul>
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
            <button className={styles.logoutButton} onClick={showModal}>
              <ReactSVG src={logoutIcon} />
              <span>Log Out</span>
            </button>
          </li>
        </ul>
      </nav>

      <Modal
        title="Are You Sure?"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Remove default footer
      >
        <div className="modalContent">
          <p className="modalDescription">
            Are you sure you want to logout from the system?
          </p>

          <div className="buttonsGroup">
            <button onClick={handleCancel} className="primary">
              Cancel
            </button>
            <button onClick={handleOk} className="info">
              Yes, I'm sure
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;

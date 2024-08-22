import { useState, useEffect, SetStateAction } from "react";
import { Tabs, Table, Modal } from "antd";
import styles from "./AllWardens.module.scss";
import { wardensData } from "../../content";
import { deleteIcon, syncIcon, viewIcon } from "../../assets";
import { NavigateFunction, useNavigate } from "react-router-dom";

const AllWardens = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [filteredData, setFilteredData] = useState(wardensData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedWarden, setSelectedWarden] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isReactivateModalVisible, setIsReactivateModalVisible] =
    useState(false);

  const newRequests = wardensData.filter((warden) => warden.status === "new");
  const activeAccounts = wardensData.filter(
    (warden) => warden.status === "active"
  );
  const bannedAccounts = wardensData.filter(
    (warden) => warden.status === "banned"
  );
  const rejectedRequests = wardensData.filter(
    (warden) => warden.status === "rejected"
  );

  // Function to update filtered data based on active tab
  const updateFilteredData = (key: SetStateAction<string>) => {
    let data = [];
    switch (key) {
      case "1":
        data = newRequests;
        break;
      case "2":
        data = activeAccounts;
        break;
      case "3":
        data = bannedAccounts;
        break;
      case "4":
        data = rejectedRequests;
        break;
      default:
        data = wardensData;
    }

    // If there's a search term, filter the data
    if (searchTerm) {
      data = data.filter(
        (warden) =>
          warden.wardenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warden.hostelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warden.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const handleTabChange = (key: SetStateAction<string>) => {
    setActiveKey(key);
    updateFilteredData(key);
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Update data filtering based on the new search term
    updateFilteredData(activeKey);
  };

  useEffect(() => {
    // Update filtered data when the active key or search term changes
    updateFilteredData(activeKey);
  }, [activeKey]);

  // Function to show the details modal
  const showModal = (warden: SetStateAction<null>) => {
    setSelectedWarden(warden);
    setIsModalVisible(true);
  };

  // Function to close the details modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to show the confirmation modal when rejecting a request
  const handleReject = () => {
    setIsModalVisible(false);
    setIsConfirmModalVisible(true);
  };

  // Function to confirm the rejection
  const handleConfirmReject = () => {
    setIsConfirmModalVisible(false);
  };

  // Function to cancel the rejection confirmation
  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    // Add logic here for what happens when the user confirms the deletion.
    setIsDeleteModalVisible(false);
  };

  const showReactivateModal = () => {
    setIsReactivateModalVisible(true);
  };

  const handleReactivateCancel = () => {
    setIsReactivateModalVisible(false);
  };

  const handleReactivateConfirm = () => {
    // Add logic here for what happens when the user confirms the reactivation.
    setIsReactivateModalVisible(false);
  };

  // Dynamic columns based on active tab
  const columns = (navigate: NavigateFunction) => [
    { title: "Warden ID", dataIndex: "wardenId", key: "wardenId" },
    { title: "Warden Name", dataIndex: "wardenName", key: "wardenName" },
    { title: "Hostel Name", dataIndex: "hostelName", key: "hostelName" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (warden: SetStateAction<null>) => {
        switch (activeKey) {
          case "1":
            return (
              <div className={styles.actions}>
                <button onClick={() => showModal(warden)}>View Details</button>
              </div>
            );
          case "2":
            return (
              <div className={styles.actions}>
                <img
                  onClick={() =>
                    navigate("/warden-details", { state: { warden } })
                  }
                  src={viewIcon}
                  alt="view"
                />
                <img onClick={showDeleteModal} src={deleteIcon} alt="delete" />
              </div>
            );
          case "3":
            return (
              <div className={styles.actions}>
                <img onClick={showReactivateModal} src={syncIcon} alt="sync" />
                <img onClick={showDeleteModal} src={deleteIcon} alt="sync" />
              </div>
            );
          case "4":
            return (
              <div className={styles.actions}>
                <img
                  onClick={() =>
                    navigate("/warden-details", { state: { warden } })
                  }
                  src={viewIcon}
                  alt="view"
                />
              </div>
            );
          default:
            return null;
        }
      },
    },
  ];

  const items = [
    {
      key: "1",
      label: "NEW REQUESTS",
      children: (
        <div className={styles.tableContainer}>
          <Table
            columns={columns(navigate)}
            dataSource={filteredData}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "ACTIVE ACCOUNTS",
      children: (
        <div className={styles.tableContainer}>
          <Table
            columns={columns(navigate)}
            dataSource={filteredData}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "BANNED ACCOUNTS",
      children: (
        <div className={styles.tableContainer}>
          <Table
            columns={columns(navigate)}
            dataSource={filteredData}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: "4",
      label: "REJECTED REQUESTS",
      children: (
        <div className={styles.tableContainer}>
          <Table
            columns={columns(navigate)}
            dataSource={filteredData}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.allWardensContainer}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <h6 className={styles.heading}>Wardens</h6>
        <input
          type="text"
          placeholder="Search hostels, locations"
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />

      {/* Details Modal */}
      <Modal
        title="Warden Account Request"
        open={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={[]}
      >
        <div className="modalContent">
          <div className="cardsContainer">
            <div className="card">
              <h4 className="cardTitle">Personal Information</h4>
              <div className="detail">
                <h5>Full Name:</h5>
                <p>{selectedWarden?.wardenName}</p>
              </div>
              <div className="detail">
                <h5>Email:</h5>
                <p>{selectedWarden?.email}</p>
              </div>
              <div className="detail">
                <h5>Phone Number:</h5>
                <p>{selectedWarden?.phoneNumber}</p>
              </div>
            </div>

            <div className="card">
              <h4 className="cardTitle">Hostel Information</h4>
              <div className="detail">
                <h5>Name:</h5>
                <p>{selectedWarden?.hostelName}</p>
              </div>
              <div className="detail">
                <h5>Location:</h5>
                <p>{selectedWarden?.address}</p>
              </div>
              <div className="detail">
                <h5>Type:</h5>
                <p>{selectedWarden?.type}</p>
              </div>
              <div className="detail">
                <h5>Total Rooms:</h5>
                <p>{selectedWarden?.totalRooms}</p>
              </div>
            </div>
          </div>
          <div className="buttonsGroup">
            <button onClick={handleReject} className="danger">
              Reject
            </button>
            <button className="success">Approve</button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Reject Request"
        open={isConfirmModalVisible}
        onCancel={handleConfirmCancel}
        footer={[]}
      >
        <div className="modalContent">
          <p className="modalDescription">
            Are you sure you want to reject this request? Remember you cannot
            revive rejected requests again.
          </p>

          <div className="buttonsGroup">
            <button onClick={handleConfirmCancel} className="primary">
              Cancel
            </button>
            <button onClick={handleConfirmReject} className="success">
              Yes, I'm sure
            </button>
          </div>
        </div>
      </Modal>

      {/* Deletion Modal */}
      <Modal
        title="Delete Warden"
        open={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        footer={[]}
      >
        <div className="modalContent">
          <p className="modalDescription">
            Are you sure you want to delete this warden? Remember all the
            affiliated hostel details will be deleted from the system.
            <br />
            <strong>Banned wardens can be made active again.</strong>
          </p>

          <div className="buttonsGroup">
            <button onClick={handleDeleteCancel} className="danger">
              Ban Instead
            </button>
            <button onClick={handleDeleteConfirm} className="success">
              Yes, I'm sure
            </button>
          </div>
        </div>
      </Modal>

      {/* Reactivation Moddal */}
      <Modal
        title="Reactivate Warden"
        open={isReactivateModalVisible}
        onCancel={handleReactivateCancel}
        footer={[]}
      >
        <div className="modalContent">
          <p className="modalDescription">
            Are you sure you want to reactivate this warden? All the hostels
            affiliated with this warden account will be reactivated.
          </p>

          <div className="buttonsGroup">
            <button onClick={handleReactivateCancel} className="primary">
              No, I'm not
            </button>
            <button onClick={handleReactivateConfirm} className="success">
              Yes, I'm sure
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllWardens;

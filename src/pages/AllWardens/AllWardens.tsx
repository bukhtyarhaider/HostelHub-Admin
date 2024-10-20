import { useState, useEffect, SetStateAction, Key } from "react";
import { Tabs, Table, Modal, message, Button } from "antd";
import styles from "./AllWardens.module.scss";
import { deleteIcon, syncIcon, viewIcon } from "../../assets";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Warden } from "../../types/types";
import { getWardens, updateWardenStatus } from "../../services/firebase";
import { Loader } from "../../components/Loader/Loader";

const AllWardens = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [filteredData, setFilteredData] = useState<Warden[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedWarden, setSelectedWarden] = useState<Warden>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isReactivateModalVisible, setIsReactivateModalVisible] =
    useState(false);
  const [warden, setWarden] = useState<Warden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWardenData = async () => {
      setIsLoading(true);
      try {
        const records = await getWardens();
        setWarden(records);
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWardenData();
  }, []);

  useEffect(() => {
    updateFilteredData(activeKey);
  }, [activeKey, searchTerm]);

  enum WardenStatus {
    NEW = "new",
    ACTIVE = "active",
    BANNED = "banned",
    REJECTED = "rejected",
    DELETED = "deleted",
  }

  const newRequests = warden.filter(
    (warden) => warden.status === WardenStatus.NEW
  );
  const activeAccounts = warden.filter(
    (warden) => warden.status === WardenStatus.ACTIVE
  );
  const bannedAccounts = warden.filter(
    (warden) => warden.status === WardenStatus.BANNED
  );
  const rejectedRequests = warden.filter(
    (warden) => warden.status === WardenStatus.REJECTED
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
        data = warden;
    }

    // If there's a search term, filter the data
    if (searchTerm) {
      data = data.filter(
        (warden) =>
          warden.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warden.hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warden.hostel.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
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
  const showModal = (warden: Warden) => {
    setSelectedWarden(warden);
    setIsModalVisible(true);
  };

  // Function to close the details modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to confirm the rejection
  const handleConfirmReject = () => {
    setIsConfirmModalVisible(false);
    rejectNewAccount();
  };

  // Function to cancel the rejection confirmation
  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
  };

  const showDeleteModal = (warden: Warden) => {
    if (warden) setSelectedWarden(warden);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const showReactivateModal = (warden: Warden) => {
    if (warden) setSelectedWarden(warden);
    setIsReactivateModalVisible(true);
  };

  const handleReactivateCancel = () => {
    setIsReactivateModalVisible(false);
  };

  const handleBanAccount = async () => {
    if (selectedWarden) {
      setIsLoading(true);
      try {
        await updateWardenStatus(selectedWarden.id, WardenStatus.BANNED);
        message.success("Account is successfully banned");
        const updatedWarden = warden.map((warden) =>
          warden.id === selectedWarden.id
            ? { ...warden, status: WardenStatus.BANNED }
            : warden
        );
        setWarden(updatedWarden);
        setFilteredData(updatedWarden);
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
        setIsDeleteModalVisible(false);
      }
    }
  };

  const handleReactivateConfirm = async () => {
    if (selectedWarden) {
      setIsLoading(true);
      try {
        await updateWardenStatus(selectedWarden.id, WardenStatus.ACTIVE);
        message.success("Account is successfully reactivated");

        const updatedWarden = warden.map((warden) =>
          warden.id === selectedWarden.id
            ? { ...warden, status: WardenStatus.ACTIVE }
            : warden
        );
        setWarden(updatedWarden);
        setFilteredData(updatedWarden);
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsReactivateModalVisible(false);
        setIsLoading(false);
      }
    }
  };

  const activeNewAccount = async () => {
    if (selectedWarden) {
      setIsLoading(true);
      try {
        await updateWardenStatus(selectedWarden.id, WardenStatus.ACTIVE);
        message.success("Account is successfully approved");

        const updatedWarden = warden.map((warden) =>
          warden.id === selectedWarden.id
            ? { ...warden, status: WardenStatus.ACTIVE }
            : warden
        );
        setWarden(updatedWarden);
        setFilteredData(updatedWarden);
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsModalVisible(false);
        setIsLoading(false);
      }
    }
  };

  const rejectNewAccount = async () => {
    if (selectedWarden) {
      setIsLoading(true);
      try {
        await updateWardenStatus(selectedWarden.id, WardenStatus.REJECTED);
        message.success("Account is successfully rejected");

        const updatedWarden = warden.map((warden) =>
          warden.id === selectedWarden.id
            ? { ...warden, status: WardenStatus.REJECTED }
            : warden
        );
        setWarden(updatedWarden);
        setFilteredData(updatedWarden);
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsModalVisible(false);
        setIsLoading(false);
      }
    }
  };

  const deleteAccount = async () => {
    if (selectedWarden) {
      setIsLoading(true);
      try {
        await updateWardenStatus(selectedWarden.id, WardenStatus.DELETED);
        message.success("Account is successfully deleted");

        const updatedWarden = warden.map((warden) =>
          warden.id === selectedWarden.id
            ? { ...warden, status: WardenStatus.DELETED }
            : warden
        );
        setWarden(updatedWarden);
        setFilteredData(updatedWarden);
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      } finally {
        setIsDeleteModalVisible(false);
        setIsLoading(false);
      }
    }
  };

  interface Column {
    title: string;
    dataIndex?: keyof Warden | "";
    key: string;
    render?: (text: any, record: any) => JSX.Element | null; // Adjust return type as needed
  }

  // Dynamic columns based on active tab
  const columns = (navigate: NavigateFunction): Column[] => [
    { title: "Warden ID", dataIndex: "wardenId", key: "wardenId" },
    { title: "Warden Name", dataIndex: "fullName", key: "fullName" },

    {
      title: "Hostel Name",
      key: "hostelName",
      render: (_text, record) => record.hostel.name,
    },
    {
      title: "Hostel Location",
      key: "hostelLocation",
      render: (_text, record) => record.hostel.location,
    },
    {
      title: "Created Date",
      key: "createdAt",
      render: (_text, record) =>
        record.createdAt?.toDate
          ? record.createdAt.toDate().toLocaleDateString()
          : "N/A",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (warden: Warden) => {
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
                <img
                  onClick={() => {
                    showDeleteModal(warden);
                  }}
                  src={deleteIcon}
                  alt="delete"
                />
              </div>
            );
          case "3":
            return (
              <div className={styles.actions}>
                <img
                  onClick={() => {
                    showReactivateModal(warden);
                  }}
                  src={syncIcon}
                  alt="sync"
                />
                <img
                  onClick={() => {
                    showDeleteModal(warden);
                  }}
                  src={deleteIcon}
                  alt="delete"
                />
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

  interface DocumentDetailProps {
    title: string;
    link: string;
  }

  const DocumentDetail: React.FC<DocumentDetailProps> = ({ title, link }) => (
    <div className="detail">
      <p>{title}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <button className="primary">Download</button>
      </a>
    </div>
  );

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
                <p>{selectedWarden?.fullName ?? ""}</p>
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
                <p>{selectedWarden?.hostel.name}</p>
              </div>
              <div className="detail">
                <h5>Location:</h5>
                <p>{selectedWarden?.hostel.location}</p>
              </div>
              <div className="detail">
                <h5>Type:</h5>
                <p>{selectedWarden?.hostel.type}</p>
              </div>
              <div className="detail">
                <h5>Total Rooms:</h5>
                <p>{selectedWarden?.hostel.rooms?.length}</p>
              </div>
            </div>

            <div className="card">
              <h4 className="cardTitle">Warden Documents</h4>
              {selectedWarden?.cnic && (
                <div>
                  <DocumentDetail
                    title="CNIC Front Side"
                    link={selectedWarden.cnic.front}
                  />
                  <DocumentDetail
                    title="CNIC Back Side"
                    link={selectedWarden.cnic.back}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="buttonsGroup">
            <button onClick={rejectNewAccount} className="danger">
              Reject
            </button>
            <button className="success" onClick={activeNewAccount}>
              Approve
            </button>
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
            {activeKey === "2" ? (
              <strong>Banned wardens can be made active again.</strong>
            ) : (
              <></>
            )}
          </p>

          <div className="buttonsGroup">
            {activeKey === "2" ? (
              <button onClick={handleBanAccount} className="danger">
                Ban Instead
              </button>
            ) : (
              <button onClick={handleDeleteCancel} className="danger">
                Cancel
              </button>
            )}
            <button onClick={deleteAccount} className="success">
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
      <Loader hide={!isLoading} />
    </div>
  );
};

export default AllWardens;

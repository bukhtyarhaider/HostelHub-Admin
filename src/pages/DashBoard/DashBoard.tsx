import { ReactSVG } from "react-svg";
import styles from "./DashBoard.module.scss";
import { Table } from "antd";
import { totalHostelsIcon, totalResidentsIcon } from "../../assets";
import { dashBoardData, wardensData } from "../../content";
import LineChart from "../../components/LineChart/LineChart";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface DataType {
  key: React.Key;
  roomNumber: string;
  roomType: string;
  numberOfBeds: string;
  washroom: string;
  seatsAvailable: string;
  roomPricePerSeat: string;
}

const DashBoard = () => {
  const navigate = useNavigate();
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
      render: (warden: any) => (
        <button
          onClick={() => navigate("/warden-details", { state: { warden } })}
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.statBox}>
          <div className={styles.left}>
            <ReactSVG src={totalHostelsIcon} />
            <h3>Total Hostels</h3>
          </div>

          <h4 className={styles.right}>{dashBoardData.totalHostels}</h4>
        </div>
        <div className={styles.statBox}>
          <div className={styles.left}>
            <ReactSVG src={totalResidentsIcon} />
            <h3>Total Residents</h3>
          </div>
          <h4 className={styles.right}>{dashBoardData.totalResidents}</h4>
        </div>
      </div>

      {/* Monthly Trend Graph */}
      <div className={styles.trendSection}>
        <div className={styles.chart}>
          <h3>Monthly Trend</h3>
          <LineChart data={dashBoardData.chartData} />
        </div>
      </div>

      {/* Wardens Table */}
      <h3 className={styles.tableTitle}>Wardens</h3>
      <div className={styles.tableSection}>
        <Table columns={columns(navigate)} dataSource={wardensData} bordered />
      </div>
    </div>
  );
};

export default DashBoard;

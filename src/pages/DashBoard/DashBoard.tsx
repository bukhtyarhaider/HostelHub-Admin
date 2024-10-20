import { ReactSVG } from "react-svg";
import styles from "./DashBoard.module.scss";
import { message, Table } from "antd";
import { totalHostelsIcon, totalResidentsIcon } from "../../assets";
import LineChart from "../../components/LineChart/LineChart";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Warden } from "../../types/types";
import { getWardens } from "../../services/firebase";
import { Loader } from "../../components/Loader/Loader";
import { getChartData } from "../../utils/utils";

const DashBoard = () => {
  const navigate = useNavigate();
  const [warden, setWarden] = useState<Warden[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [monthlyHostelCreation, setMonthlyHostelCreation] = useState<Number[]>(
    []
  );

  const getMonthlyHostelCreation = (wardens: Warden[]): Number[] => {
    const monthlyCounts = Array(12).fill(0);
    wardens.forEach((warden: Warden) => {
      const month = new Date(warden.createdAt.toDate()).getMonth();
      monthlyCounts[month]++;
    });
    return monthlyCounts;
  };

  useEffect(() => {
    const fetchWardenData = async () => {
      setIsLoading(true);
      try {
        const records = await getWardens();
        const monthlyHostelCounts = getMonthlyHostelCreation(records);
        setMonthlyHostelCreation(monthlyHostelCounts);
        const activeRecords = records?.filter(
          (warden) => warden.status === WardenStatus.ACTIVE
        );
        setWarden(activeRecords);
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

  enum WardenStatus {
    NEW = "new",
    ACTIVE = "active",
    BANNED = "banned",
    REJECTED = "rejected",
    DELETED = "deleted",
  }
  interface Column {
    title: string;
    dataIndex?: keyof Warden | "";
    key: string;
    render?: (text: any, record: any) => JSX.Element | null; // Adjust return type as needed
  }

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

          <h4 className={styles.right}>{warden?.length ?? 0}</h4>
        </div>
        <div className={styles.statBox}>
          <div className={styles.left}>
            <ReactSVG src={totalResidentsIcon} />
            <h3>Total Residents</h3>
          </div>
          <h4 className={styles.right}>{0}</h4>
        </div>
      </div>

      {/* Monthly Trend Graph */}
      <div className={styles.trendSection}>
        <div className={styles.chart}>
          <h3>Monthly Trend</h3>
          <LineChart data={getChartData(monthlyHostelCreation)} />
        </div>
      </div>

      {/* Wardens Table */}
      <h3 className={styles.tableTitle}>Wardens</h3>
      <div className={styles.tableSection}>
        <Table columns={columns(navigate)} dataSource={warden} bordered />
      </div>
      <Loader hide={!isLoading} />
    </div>
  );
};

export default DashBoard;

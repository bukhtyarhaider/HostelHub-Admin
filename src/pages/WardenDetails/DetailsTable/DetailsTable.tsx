import styles from "./DetailsTable.module.scss";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { Room } from "../../../types/types";
import { DetailsTableProps } from "./DetailsTableProps";

const DetailsTable: React.FC<DetailsTableProps> = ({ tableData }) => {
  const columns: TableColumnsType<Room> = [
    { title: "Room Number", dataIndex: "roomNumber", key: "roomNumber" },
    { title: "Room Type", dataIndex: "type", key: "type" },
    { title: "Number of Beds", dataIndex: "numberOfBeds", key: "numberOfBeds" },
    { title: "Washroom", dataIndex: "washroom", key: "washroom" },
    {
      title: "Seats Available",
      dataIndex: "seatsAvailable",
      key: "seatsAvailable",
    },
    {
      title: "Room Price/Seat",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div className={styles.detailsTableContainer}>
      <Table columns={columns} dataSource={tableData} bordered />
    </div>
  );
};

export default DetailsTable;

import styles from "./DetailsTable.module.scss";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { DataType } from "./DetailsTableProps";

const DetailsTable = ({ tableData }) => {
  const columns: TableColumnsType<DataType> = [
    { title: "Room Number", dataIndex: "roomNumber", key: "roomNumber" },
    { title: "Room Type", dataIndex: "roomType", key: "roomType" },
    { title: "Number of Beds", dataIndex: "numberOfBeds", key: "numberOfBeds" },
    { title: "Washroom", dataIndex: "washroom", key: "washroom" },
    {
      title: "Seats Available",
      dataIndex: "seatsAvailable",
      key: "seatsAvailable",
    },
    {
      title: "Room Price/Seat",
      dataIndex: "roomPricePerSeat",
      key: "roomPricePerSeat",
    },
  ];

  return (
    <div className={styles.detailsTableContainer}>
      <Table columns={columns} dataSource={tableData} bordered />
    </div>
  );
};

export default DetailsTable;

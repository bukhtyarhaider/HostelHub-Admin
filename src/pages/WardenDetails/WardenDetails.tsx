import { useLocation } from "react-router-dom";
import styles from "./WardenDetails.module.scss";
import DetailsTable from "./DetailsTable/DetailsTable";
import {
  hostelDetailsDescriptionData,
  hostelDetailsTableData,
} from "../../content";
import { bedroom } from "../../assets";

const WardenDetails = () => {
  const location = useLocation();
  const { warden } = location.state || {}; // Destructure the warden data

  return (
    <div className={styles.wardenDetailsContainer}>
      <h3 className={styles.title}>Warden Details</h3>
      <div className={styles.card}>
        <h4 className={styles.cardTitle}>Personal Information</h4>
        <div className={styles.detail}>
          <h5>Full Name::</h5>
          <p>{warden?.wardenName}</p>
        </div>
        <div className={styles.detail}>
          <h5>Email:</h5>
          <p>{warden?.email}</p>
        </div>
        <div className={styles.detail}>
          <h5>Phone Number:</h5>
          <p>{warden?.phoneNumber}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h4 className={styles.cardTitle}>Hostel Information</h4>
        <div className={styles.detail}>
          <h5>Name:</h5>
          <p>{warden?.hostelName}</p>
        </div>
        <div className={styles.detail}>
          <h5>Location:</h5>
          <p>{warden?.address}</p>
        </div>
        <div className={styles.detail}>
          <h5>Type:</h5>
          <p>{warden?.type}</p>
        </div>
        <div className={styles.detail}>
          <h5>Total Rooms:</h5>
          <p>{warden?.totalRooms}</p>
        </div>

        <div className={styles.imagesContainer}>
          <h4 className={styles.imagesTitle}>Images</h4>
          <div className={styles.imagesGroup}>
            <img src={bedroom} alt="bedroom" />
            <img src={bedroom} alt="bedroom" />
            <img src={bedroom} alt="bedroom" />
            <img src={bedroom} alt="bedroom" />
          </div>
        </div>
      </div>

      <h3 className={styles.tableTitle}>Room Details</h3>

      <DetailsTable tableData={hostelDetailsTableData} />
      <div className={styles.description}>
        <h2>{hostelDetailsDescriptionData.title}</h2>
        {hostelDetailsDescriptionData.description.map((data, index) => (
          <p key={index}>{data}</p>
        ))}
      </div>
    </div>
  );
};

export default WardenDetails;

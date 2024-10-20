import { useLocation } from "react-router-dom";
import styles from "./WardenDetails.module.scss";
import DetailsTable from "./DetailsTable/DetailsTable";

const WardenDetails = () => {
  const location = useLocation();
  const { warden } = location.state || {};

  return (
    <div className={styles.wardenDetailsContainer}>
      <h3 className={styles.title}>Warden Details</h3>
      <div className={styles.card}>
        <h4 className={styles.cardTitle}>Personal Information</h4>
        <div className={styles.detail}>
          <h5>Full Name:</h5>
          <p>{warden?.fullName ?? ""}</p>
        </div>
        <div className={styles.detail}>
          <h5>Email:</h5>
          <p>{warden?.email ?? ""}</p>
        </div>
        <div className={styles.detail}>
          <h5>Phone Number:</h5>
          <p>{warden?.phoneNumber ?? ""}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h4 className={styles.cardTitle}>Hostel Information</h4>
        <div className={styles.detail}>
          <h5>Name:</h5>
          <p>{warden?.hostel?.name ?? ""}</p>
        </div>
        <div className={styles.detail}>
          <h5>Location:</h5>
          <p>{warden?.hostel?.location ?? ""}</p>
        </div>
        <div className={styles.detail}>
          <h5>Type:</h5>
          <p>{warden?.hostel?.type ?? ""}</p>
        </div>
        <div className={styles.detail}>
          <h5>Total Rooms:</h5>
          <p>{warden?.hostel?.rooms?.length ?? 0}</p>
        </div>

        {warden?.hostel?.images && (
          <div className={styles.imagesContainer}>
            <h4 className={styles.imagesTitle}>Images</h4>
            <div className={styles.imagesGroup}>
              {warden?.hostel?.images.map((imageURL: string, index: number) => {
                return <img src={imageURL} alt={`hostel-${index}`} />;
              })}
            </div>
          </div>
        )}
      </div>

      <h3 className={styles.tableTitle}>Room Details</h3>

      {warden?.hostel?.rooms && (
        <DetailsTable tableData={warden?.hostel?.rooms} />
      )}
      <div className={styles.description}>
        <h2>Description</h2>
        <p>{warden?.hostel?.description}</p>
      </div>
    </div>
  );
};

export default WardenDetails;

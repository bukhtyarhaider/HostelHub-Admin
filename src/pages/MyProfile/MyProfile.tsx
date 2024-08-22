import { Tabs } from "antd";
import styles from "./MyProfile.module.scss";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import ChangePassword from "./ChangePassword/ChangePassword";
import { useState } from "react";
import { adminDetails } from "../../content";


const MyProfile = () => {
  const [userData, setUserData] = useState(adminDetails);
  const handleTabChange = (key: string) => {
    console.log("key", key);
  };

  const items = [
    {
      key: "1",
      label: "USER INFORMATION",
      children: <ProfileInfo userData={userData} setUserData={setUserData} />,
    },
    {
      key: "2",
      label: "CHANGE PASSWORD",
      children: (
        <ChangePassword userData={userData} setUserData={setUserData} />
      ),
    },
  ];
  return (
    <div className={styles.myProfileContainer}>
      <Tabs defaultActiveKey="1" items={items} onChange={handleTabChange} />
    </div>
  );
};

export default MyProfile;

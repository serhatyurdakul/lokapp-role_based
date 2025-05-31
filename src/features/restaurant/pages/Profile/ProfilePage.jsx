import React from "react";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import "./ProfilePage.scss";

const RestaurantProfilePage = () => {
  return (
    <div>
      <DetailPageHeader title='Restoran Profili' backPath={-1} />
      {/* <h1>Restoran Profil Sayfası (Test)</h1> */}
      <p>Bu sayfa restoran çalışanının profil bilgilerini gösterecektir.</p>
    </div>
  );
};

export default RestaurantProfilePage;

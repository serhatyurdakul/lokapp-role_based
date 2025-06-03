import React from "react";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import "./ProfilePage.scss";

const RestaurantProfilePage = () => {
  return (
    <div>
      <DetailPageHeader title='Restoran Profili' backPath={-1} />
      <p> restoran profil sayfası</p>
    </div>
  );
};

export default RestaurantProfilePage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ChevronLeftIcon } from "@/assets/icons/chevron-left.svg";
import "./DetailPageHeader.scss";

const DetailPageHeader = ({ title, backPath, backText = "Geri", children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // 1) Eğer spesifik bir rota verildiyse onu kullan
    if (typeof backPath !== "undefined" && backPath !== null) {
      navigate(backPath);
      return;
    }

    // 2) Tarayıcı geçmişi varsa bir adım geri git
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    // 3) Fallback: Uygulamanın ana giriş noktası
    navigate("/");
  };

  return (
    <header className='page-header with-back'>
      <button className='btn btn-nav-back' onClick={handleBack}>
        <ChevronLeftIcon className='icon' />
        <span>{backText}</span>
      </button>
      <h1>{title}</h1>
      {children && <div className='header-actions'>{children}</div>}
    </header>
  );
};

export default DetailPageHeader;

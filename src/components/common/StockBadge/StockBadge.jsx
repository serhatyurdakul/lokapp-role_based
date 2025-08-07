import React from "react";
import PropTypes from "prop-types";
import { getStockStatus } from "@/features/restaurant/utils/stockUtils";
import "./StockBadge.scss";

const StockBadge = ({ remaining, sold = 0 }) => {
  const status = getStockStatus(remaining);

  return (
    <div className="meal-stock-badge-wrapper">
      <span className={`badge remaining ${status}`}>Kalan: {remaining}</span>
      <span className="badge sold">Satılan: {sold}</span>
    </div>
  );
};

StockBadge.propTypes = {
  remaining: PropTypes.number.isRequired,
  sold: PropTypes.number,
};

export default StockBadge;

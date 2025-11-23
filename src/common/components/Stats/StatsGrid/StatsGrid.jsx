import { Children } from "react";
import PropTypes from "prop-types";
import "./StatsGrid.scss";

// Grid kuralları: <=3 kart 3 kolon; >3 kart 2 kolon ve bir satırda tek kart kalırsa tam satır.
// >=576px için auto-fit min 90px; native (SwiftUI/Compose) tarafında aynı kural uygulanabilir.

const StatsGrid = ({ children, className = "" }) => {
  const count = Children.count(children);
  const isTwoColumn = count > 3;
  const hasOddLast = isTwoColumn && count % 2 === 1;

  const classes = [
    "stats-grid",
    isTwoColumn && "stats-grid--two-column",
    hasOddLast && "stats-grid--has-odd-last",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={{ "--mobile-columns": isTwoColumn ? 2 : 3 }}>
      {children}
    </div>
  );
};

StatsGrid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default StatsGrid;

import PropTypes from "prop-types";
import Badge from "@/components/common/Badge/Badge";
import "./EmployeeMealCard.scss";

/**
 * Çalışanın o güne ait yemek kaydını gösteren kart (restoran/delivery).
 */
const EmployeeMealCard = ({ meal, showType = true }) => {
  const { employee, type, time, items, company } = meal;

  const hasItems = Array.isArray(items) && items.length > 0;
  const hasCompany = Boolean(company);

  const showMeta = showType || hasItems || hasCompany;

  return (
    <div className='employee-meal-card'>
      <div className='header'>
        <p className='employee'>{employee}</p>
        {showType ? (
          <Badge className='type' tone={type === "Restoranda" ? "dine-in" : "delivery"}>
            {type}
          </Badge>
        ) : (
          <span className='time'>{time}</span>
        )}
      </div>
      {showMeta && (
        <div className='meta'>
          {showType && <span className='time'>{time}</span>}
          {hasCompany && (
            <Badge className='company-badge' tone='neutral'>
              {company}
            </Badge>
          )}
          {hasItems && <p className='items'>{items.join(" • ")}</p>}
        </div>
      )}
    </div>
  );
};

EmployeeMealCard.propTypes = {
  meal: PropTypes.shape({
    employee: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["Restoranda", "Sipariş"]).isRequired,
    time: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string),
    company: PropTypes.string,
  }).isRequired,
  showType: PropTypes.bool,
};

export default EmployeeMealCard;

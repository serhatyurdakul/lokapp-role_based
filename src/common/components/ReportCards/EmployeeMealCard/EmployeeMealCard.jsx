import PropTypes from "prop-types";
import Badge from "@/common/components/Badge/Badge";
import "./EmployeeMealCard.scss";

const EmployeeMealCard = ({ meal, showType = true }) => {
  const { employee, type, time, items, company } = meal;
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasCompany = Boolean(company);
  const showMeta = showType || hasItems || hasCompany;

  return (
    <div className='employee-meal-card'>
      <div className='employee-meal-card__header'>
        <p className='employee-meal-card__name'>{employee}</p>
        {showType ? (
          <Badge
            className='employee-meal-card__type'
            tone={type === "Restoranda" ? "dine-in" : "delivery"}
          >
            {type}
          </Badge>
        ) : (
          <span className='employee-meal-card__headerTime'>{time}</span>
        )}
      </div>
      {showMeta && (
        <div className='employee-meal-card__meta'>
          {showType && <span className='employee-meal-card__time'>{time}</span>}
          {hasCompany && (
            <Badge className='employee-meal-card__companyBadge' tone='neutral'>
              {company}
            </Badge>
          )}
          {hasItems && (
            <p className='employee-meal-card__items'>{items.join(" • ")}</p>
          )}
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

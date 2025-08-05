import './OrderCard.scss';
import PropTypes from 'prop-types';

const OrderCard = ({ order, onClick }) => {
  return (
    <div
      className={`order-card ${order.status}`}
      onClick={() => onClick(order.companyId)}
      role='button'
      tabIndex={0}
    >
      <div className='order-header'>
        <div>
          <h3>{order.company}</h3>
          <span className='order-region'>{order.region}</span>
        </div>
        <span className='order-time'>{order.orderTime || order.time}</span>
      </div>
      <div className='order-meta'>
        <span className='order-items'>
          {order.totalPeople} kişilik
        </span>
        <span className={`order-status ${order.status}`}>
          {order.status === "pending" ? "Bekliyor" : "Tamamlandı"}
        </span>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    company: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['pending', 'completed']).isRequired,
    totalPeople: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    orderTime: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OrderCard;

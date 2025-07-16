import './OrderCard.scss';

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

export default OrderCard;

import PropTypes from "prop-types";
import { ReactComponent as LogoutIcon } from "@/assets/icons/logout.svg";
import "./LogoutButton.scss";

const LogoutButton = ({ onClick }) => {
  return (
    <button type='button' className='logout-button' onClick={onClick}>
      <LogoutIcon className='icon' />
      Çıkış Yap
    </button>
  );
};

LogoutButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default LogoutButton;

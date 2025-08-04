import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./ProfileButton.scss";

const ProfileButton = ({
  userInitial,
  to = "/profile",
  ariaLabel = "Profil Sayfası",
  title = "Profil",
}) => {
  if (!userInitial) {
    return null; 
  }

  return (
    <Link to={to} className='profile-btn' title={title} aria-label={ariaLabel}>
      <span className='profile-initial'>{userInitial}</span>
    </Link>
  );
};

ProfileButton.propTypes = {
  userInitial: PropTypes.string.isRequired,
  to: PropTypes.string,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
};

export default ProfileButton;

import PropTypes from "prop-types";
import "./ProfileLayout.scss";

const ProfileLayout = ({ children, className = "" }) => (
  <div className={`profile ${className}`.trim()}>{children}</div>
);

const ProfileHeader = ({ avatarText, title, subtitle, children }) => (
  <div className='profile__header'>
    <div className='profile__avatar'>
      <span>{avatarText}</span>
    </div>
    <div className='profile__text'>
      <h2 className='profile__title'>{title}</h2>
      {subtitle && <p className='profile__subtitle'>{subtitle}</p>}
      {children}
    </div>
  </div>
);

const ProfileSection = ({ title, action, children }) => (
  <section className='profile__section'>
    {(title || action) && (
      <div className='profile__sectionHeader'>
        {title && <h3 className='profile__sectionTitle'>{title}</h3>}
        {action && <div className='profile__sectionAction'>{action}</div>}
      </div>
    )}
    {children}
  </section>
);

const ProfileInfoList = ({ children }) => (
  <div className='profile__infoList'>{children}</div>
);

const ProfileInfoItem = ({ label, children }) => (
  <div className='profile__infoItem'>
    <span className='profile__infoLabel'>{label}</span>
    <div className='profile__infoValue'>{children}</div>
  </div>
);

const ProfileSettingsList = ({ children }) => (
  <div className='profile__settingsList'>{children}</div>
);

const ProfileSettingsItem = ({ label, secondary, icon, children, ...props }) => (
  <button className='profile__settingsItem' type='button' {...props}>
    <span className='profile__settingsLabel'>
      {label}
      {secondary && <span className='profile__settingsSecondary'>{secondary}</span>}
    </span>
    {(icon || children) && (
      <span className='profile__settingsIcon'>{icon || children}</span>
    )}
  </button>
);

ProfileLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ProfileHeader.propTypes = {
  avatarText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

ProfileSection.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
};

ProfileInfoList.propTypes = {
  children: PropTypes.node.isRequired,
};

ProfileInfoItem.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node.isRequired,
};

ProfileSettingsList.propTypes = {
  children: PropTypes.node.isRequired,
};

ProfileSettingsItem.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  secondary: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  children: PropTypes.node,
};

export {
  ProfileHeader,
  ProfileSection,
  ProfileInfoList,
  ProfileInfoItem,
  ProfileSettingsList,
  ProfileSettingsItem,
};

export default ProfileLayout;

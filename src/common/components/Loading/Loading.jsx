import { memo } from "react";
import PropTypes from "prop-types";
import "./Loading.scss";

const Loading = memo(({ text = null }) => (
  <div className='loading-container'>
    <div className='loading-spinner' />
    {text && <p>{text}</p>}
  </div>
));

Loading.propTypes = {
  text: PropTypes.string,
};

export default Loading;

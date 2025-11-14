import PropTypes from "prop-types";
import "./SegmentedControl.scss";

const SegmentedControl = ({ segments, selectedSegment, onSegmentChange }) => {
  const handleKeyDown = (event, value) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSegmentChange(value);
    }
  };

  return (
    <div
      className='segmented-control'
      role='tablist'
      aria-label='Görünüm seçici'
    >
      {segments.map((segment) => {
        const isActive = selectedSegment === segment.value;
        const tabId = `seg-${segment.value}`;
        return (
          <button
            key={segment.value}
            id={tabId}
            role='tab'
            aria-selected={isActive}
            className={`segment ${isActive ? "active" : ""}`}
            onClick={() => onSegmentChange(segment.value)}
            onKeyDown={(e) => handleKeyDown(e, segment.value)}
            type='button'
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedSegment: PropTypes.string.isRequired,
  onSegmentChange: PropTypes.func.isRequired,
};

export default SegmentedControl;

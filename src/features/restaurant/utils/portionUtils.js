export const getPortionStatus = (currentStock) => {
  if (currentStock === 0) {
    return "depleted";
  }
  if (currentStock <= 15) {
    return "critical";
  }
  if (currentStock <= 35) {
    return "warning";
  }
  return "good";
};

export const getPortionStatus = (remainingQuantity) => {
  if (remainingQuantity === 0) {
    return "depleted";
  }
  if (remainingQuantity <= 15) {
    return "critical";
  }
  if (remainingQuantity <= 35) {
    return "warning";
  }
  return "good";
};

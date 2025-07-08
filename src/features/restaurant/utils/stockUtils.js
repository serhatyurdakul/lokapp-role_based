export const getStockStatus = (currentStock) => {
  if (currentStock <= 10) {
    return "critical";
  }
  if (currentStock <= 30) {
    return "warning";
  }
  return "good";
};

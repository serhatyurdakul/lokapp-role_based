export const getLastOrdersStorageKey = ({ userId, restaurantId, companyId }) => {
  if (!userId || !restaurantId || !companyId) return null;
  return `lokapp:lastOrders:${String(userId)}:${String(restaurantId)}:${String(companyId)}`;
};

export const getLastOrdersStorageKeyPrefixForUser = (userId) => {
  if (!userId) return null;
  return `lokapp:lastOrders:${String(userId)}:`;
};

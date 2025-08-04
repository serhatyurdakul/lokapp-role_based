// Group items by category and meal name (case-insensitive)
// Temporary helper: normalize meal name for comparison
// TODO[backend_id_fix]: Remove when backend returns stable baseMealId
const normalizeMealName = (name = "") => name.trim().toLocaleLowerCase("tr-TR");

export const groupOrderItemsByName = (items = []) => {
  const acc = {};

  items.forEach(({ categoryId, categoryName, mealName, quantity }) => {
    const catKey = String(categoryId);
    const mealKey = normalizeMealName(mealName);

    if (!acc[catKey]) {
      acc[catKey] = {
        categoryId,
        categoryName,
        items: {},
        totalQuantity: 0,
      };
    }

    if (!acc[catKey].items[mealKey]) {
      acc[catKey].items[mealKey] = {
        id: mealKey, // Stable value for React key
        mealName,
        quantity: 0,
      };
    }

    const q = parseInt(quantity, 10) || 0;
    acc[catKey].items[mealKey].quantity += q;
    acc[catKey].totalQuantity += q;
  });

  return Object.values(acc).map((cat) => ({
    ...cat,
    items: Object.values(cat.items),
  }));
};

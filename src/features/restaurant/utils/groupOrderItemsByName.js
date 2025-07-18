
/**
 * Grup sipariş kalemlerini kategori + normalize edilmiş yemek adına göre.
 * Bu, aynı gün farklı mealId'lere sahip ama adı aynı öğeleri tek satıra toplar.
 *
 * @param {Array} items - API'den gelen raw order items
 * @returns {Array}   - [{ categoryId, categoryName, items: [{ id, mealName, quantity }], totalQuantity }]
 */
// Geçici: Yemek adını karşılaştırma için normalize et
// TODO[backend_id_fix]: Backend baseMealId geldiğinde bu helper gereksiz hale gelebilir.
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
        id: mealKey, // React key için stabil değer
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

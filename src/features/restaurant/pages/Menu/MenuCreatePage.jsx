import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import Button from "@/common/components/Button/Button";
import FormSelect from "@/common/components/forms/FormSelect/FormSelect";
import FormInput from "@/common/components/forms/FormInput/FormInput";
	import ErrorMessage from "@/common/components/forms/ErrorMessage/ErrorMessage";
	import NoticeBanner from "@/common/components/NoticeBanner/NoticeBanner";
	import Toast from "@/common/components/Toast/Toast.jsx";
import ConfirmModal from "@/common/components/modals/ConfirmModal/ConfirmModal.jsx";
	import Badge from "@/common/components/Badge/Badge";
	import { addRestaurantMeal } from "@/utils/api";
import {
  fetchRestaurantCategories,
  fetchRestaurantMenuData,
  selectMenuMealsAndCategories,
} from "../../store/restaurantMenuSlice";
import useAddMeal from "../../hooks/useAddMeal";
import PortionCard from "../../components/PortionCard/PortionCard";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import "./MenuCreatePage.scss";

const buildMealLookupKey = (name, categoryId) => {
  const normalizedName = (name || "").trim().toLocaleLowerCase("tr-TR");
  const normalizedCategory =
    categoryId !== null && categoryId !== undefined ? String(categoryId) : "";
  return `${normalizedCategory}::${normalizedName}`;
};

const MenuCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const restaurantId = user?.restaurantId;

  const {
    categories: apiCategories,
    isLoading,
    error,
    lastAddedCategoryId,
  } = useSelector((state) => state.restaurantMenu);
  const { menuMeals } = useSelector(selectMenuMealsAndCategories);

  const [showBanner, setShowBanner] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pendingMeals, setPendingMeals] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [selectedPendingMeal, setSelectedPendingMeal] = useState(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  const hasPendingMeals = pendingMeals.length > 0;

  const menuMealLookup = useMemo(() => {
    if (!Array.isArray(menuMeals) || menuMeals.length === 0) {
      return new Set();
    }

    const keys = menuMeals
      .map((meal) =>
        meal?.mealName
          ? buildMealLookupKey(meal.mealName, meal.categoryId)
          : null
      )
      .filter(Boolean);

    return new Set(keys);
  }, [menuMeals]);

  const pendingMealLookup = useMemo(() => {
    if (!Array.isArray(pendingMeals) || pendingMeals.length === 0) {
      return new Set();
    }

    const keys = pendingMeals
      .map((meal) =>
        meal?.mealName
          ? buildMealLookupKey(meal.mealName, meal.categoryId)
          : null
      )
      .filter(Boolean);

    return new Set(keys);
  }, [pendingMeals]);

  const isMealAlreadyQueued = useCallback(
    (mealOption) => {
      if (!mealOption || !mealOption.name) return false;
      const key = buildMealLookupKey(mealOption.name, mealOption.categoryId);
      return pendingMealLookup.has(key);
    },
    [pendingMealLookup]
  );

  const isMealAlreadyInMenu = useCallback(
    (mealOption) => {
      if (!mealOption || !mealOption.name) return false;
      const key = buildMealLookupKey(mealOption.name, mealOption.categoryId);
      return menuMealLookup.has(key);
    },
    [menuMealLookup]
  );

  const loadRestaurantMenu = useCallback(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const loadAllRestaurantData = useCallback(() => {
    dispatch(fetchRestaurantCategories());
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    loadAllRestaurantData();
  }, [loadAllRestaurantData]);

  useEffect(() => {
    setShowBanner(Boolean(error));
  }, [error]);

  const handlePendingSubmit = useCallback(
    ({ selectedMeal, quantity: quantityValue, selectedCategoryId }) => {
      if (pendingMeals.some((item) => item.mealMenuId === selectedMeal.id)) {
        throw new Error("Bu yemek ekleme listesinde zaten mevcut.");
      }

      const category = apiCategories.find(
        (cat) => Number(cat.id) === Number(selectedCategoryId)
      );

      const newPendingMeal = {
        pendingId: `${selectedMeal.id}-${Date.now()}`,
        mealMenuId: selectedMeal.id,
        mealName: selectedMeal.mealName,
        quantity: quantityValue,
        categoryId: selectedCategoryId,
        categoryName: category?.name || "Diğer",
      };

      setPendingMeals((prev) => [newPendingMeal, ...prev]);

      return newPendingMeal;
    },
    [pendingMeals, apiCategories]
  );

  const {
    searchQuery,
    showSearchResults,
    searchResultsRef,
    selectedCategoryInModal,
    selectedMeal,
    quantityInput,
    isSubmitting,
    filteredMealOptions,
    isLoadingMealOptions,
    mealExistsError,
    finalIsPrimaryButtonDisabled,
    setQuantityInput,
    handleModalCategoryChange,
    handleMealOptionSearchChange,
    handleSelectMealOption,
    handleClearMealOptionSearch,
    handleAddMeal,
  } = useAddMeal(
    restaurantId,
    apiCategories,
    lastAddedCategoryId,
    () => {},
    () => {},
    true,
    {
      autoCloseOnSuccess: false,
      enableOutsideClickClose: false,
      submitHandler: handlePendingSubmit,
      isMealAlreadyAdded: isMealAlreadyQueued,
      isMealInMenu: isMealAlreadyInMenu,
    }
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredMealOptions, showSearchResults]);

  useEffect(() => {
    if (!showSearchResults || !searchResultsRef.current) return;
    if (activeIndex < 0 || activeIndex >= filteredMealOptions.length) return;
    const container = searchResultsRef.current;
    const item = container.children[activeIndex];
    if (item && typeof item.scrollIntoView === "function") {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, showSearchResults, filteredMealOptions, searchResultsRef]);

  useEffect(() => {
    if (selectedMeal) {
      document.getElementById("menu-create-quantity-input")?.focus();
    }
  }, [selectedMeal]);

  const handleKeyDown = (e) => {
    if (
      !showSearchResults ||
      !Array.isArray(filteredMealOptions) ||
      filteredMealOptions.length === 0
    ) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredMealOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === -1) return filteredMealOptions.length - 1;
        return (
          (prev - 1 + filteredMealOptions.length) % filteredMealOptions.length
        );
      });
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filteredMealOptions.length) {
        e.preventDefault();
        handleSelectMealOption(filteredMealOptions[activeIndex]);
      }
    }
  };

  const handleCategorySelect = (event) => {
    handleModalCategoryChange(event);
  };

  const handleSearchChange = (event) => {
    handleMealOptionSearchChange(event);
  };

  const handleSearchClear = () => {
    handleClearMealOptionSearch();
  };

  const handleQuantityInputChange = (event) => {
    setQuantityInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleAddMeal();
  };

  const groupedPendingMeals = useMemo(() => {
    if (!pendingMeals.length) return [];

    const byCategory = new Map();

    pendingMeals.forEach((meal) => {
      const key = meal.categoryId ?? "other";
      if (!byCategory.has(key)) {
        byCategory.set(key, {
          categoryId: key,
          categoryName: meal.categoryName || "Diğer",
          meals: [],
        });
      }
      byCategory.get(key).meals.push(meal);
    });

    return Array.from(byCategory.values());
  }, [pendingMeals]);

  const navigateBackDefault = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/menu");
    }
  }, [navigate]);

  // Deterministic navigation to Menu page for discard/cancel actions on this screen
  const goToMenu = useCallback(() => {
    navigate("/menu", { replace: true });
  }, [navigate]);

  const handleDiscardConfirmed = useCallback(() => {
    setPendingMeals([]);
    setShowDiscardModal(false);
    // Deterministic discard flow: always return to Menu
    goToMenu();
  }, [goToMenu]);

  const handleCancel = () => {
    if (hasPendingMeals) {
      setShowDiscardModal(true);
    } else {
      // Consistent with discard confirm: always go to Menu
      goToMenu();
    }
  };

  const handleBackNavigation = () => {
    if (hasPendingMeals) {
      setShowDiscardModal(true);
    } else {
      navigateBackDefault();
    }
  };

  const handleSaveAll = useCallback(async () => {
    if (!restaurantId || !pendingMeals.length) return;

    setIsSaving(true);
    const mealsToSave = [...pendingMeals];
    const failures = [];

    for (const meal of mealsToSave) {
      try {
        await addRestaurantMeal({
          mealMenuId: meal.mealMenuId.toString(),
          quantity: meal.quantity.toString(),
          restaurantId: restaurantId.toString(),
        });
      } catch (apiError) {
        failures.push({
          ...meal,
          errorMessage: apiError?.message || "Kaydetme sırasında hata oluştu",
        });
      }
    }

    if (failures.length === 0) {
      setPendingMeals([]);
      await loadRestaurantMenu();
      setIsSaving(false);
      navigate("/menu", {
        replace: true,
        state: { toast: `${mealsToSave.length} yemek menüye eklendi` },
      });
      return;
    }

    setPendingMeals(failures);
    setIsSaving(false);
    setToastMessage(
      failures.length === mealsToSave.length
        ? "Kaydetme işlemi başarısız oldu. Lütfen tekrar deneyin."
        : `${failures.length} yemek kaydedilemedi. Lütfen yeniden deneyin.`
    );
  }, [restaurantId, pendingMeals, loadRestaurantMenu, navigate]);

  const openPendingMealModal = (meal) => {
    setSelectedPendingMeal(meal);
    setIsPendingModalOpen(true);
  };

  const closePendingMealModal = () => {
    setIsPendingModalOpen(false);
    setSelectedPendingMeal(null);
  };

  const handlePendingMealUpdated = (updatedMeal) => {
    setPendingMeals((prev) =>
      prev.map((meal) =>
        meal.pendingId === updatedMeal.pendingId ? updatedMeal : meal
      )
    );
    setToastMessage("Porsiyon güncellendi");
    closePendingMealModal();
  };

  const handlePendingMealRemoved = (mealToRemove) => {
    setPendingMeals((prev) =>
      prev.filter((meal) => meal.pendingId !== mealToRemove.pendingId)
    );
    const removedName = mealToRemove?.mealName || "Yemek";
    setToastMessage(`${removedName} listeden kaldırıldı`);
    closePendingMealModal();
  };

  return (
    <div className='menu-create-page has-fixed-bottom-cta'>
      <DetailPageHeader title='Yemek Ekle' onBack={handleBackNavigation} />

      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText='Yenile'
          onAction={loadAllRestaurantData}
          onClose={() => setShowBanner(false)}
        />
      )}

      <form
        className='menu-create-page__form'
        onSubmit={handleSubmit}
        autoComplete='off'
      >
        <ErrorMessage message={mealExistsError} />

        <FormSelect
          label='Kategori'
          id='menu-create-category'
          name='category'
          value={selectedCategoryInModal}
          onChange={handleCategorySelect}
          options={apiCategories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          defaultOptionText={isLoading ? "Kategoriler Yükleniyor..." : null}
          required
          disabled={isLoading}
        />

        <div className='menu-create-page__search' onKeyDown={handleKeyDown}>
          <FormInput
            label='Yemek'
            id='menu-create-meal-input'
            name='name'
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={
              isLoadingMealOptions
                ? "Yemekler yükleniyor..."
                : "Yemek adı arayın"
            }
            required
            isClearable={true}
            onClear={handleSearchClear}
            isSearchable={true}
            disabled={isLoadingMealOptions}
            aria-busy={isLoadingMealOptions}
          />

          <div
            className='menu-create-page__search-results'
            ref={searchResultsRef}
            style={{
              display:
                !isLoadingMealOptions && showSearchResults ? "block" : "none",
            }}
            aria-hidden={!(!isLoadingMealOptions && showSearchResults)}
          >
            {filteredMealOptions.length > 0 ? (
              filteredMealOptions.map((mealOption, index) => {
                const itemClasses = [
                  "menu-create-page__search-item",
                  mealOption.isDisabled
                    ? "menu-create-page__search-item--disabled"
                    : "",
                  index === activeIndex
                    ? "menu-create-page__search-item--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                const statusLabel =
                  mealOption.status === "pending"
                    ? "Eklenecek"
                    : mealOption.status === "inMenu"
                    ? "Menüde"
                    : null;

                return (
                  <div
                    key={mealOption.id || mealOption.name}
                    className={itemClasses}
                    onClick={(event) => {
                      if (mealOption.isDisabled) {
                        event.preventDefault();
                        return;
                      }
                      handleSelectMealOption(mealOption);
                    }}
                    role='button'
                    aria-disabled={mealOption.isDisabled || undefined}
                    tabIndex={mealOption.isDisabled ? -1 : 0}
                  >
                    <span className='menu-create-page__search-item-label'>
                      {mealOption.name}
                    </span>
                    {statusLabel ? (
                      <Badge
                        className='menu-create-page__search-item-badge'
                        tone={
                          mealOption.status === "pending"
                            ? "delivery"
                            : "dine-in"
                        }
                      >
                        {statusLabel}
                      </Badge>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div
                className='menu-create-page__search-item menu-create-page__search-item--empty'
                aria-disabled='true'
              >
                "{searchQuery}" için arama sonucu bulunamadı.
              </div>
            )}
          </div>
        </div>

        <FormInput
          label='Porsiyon Sayısı'
          id='menu-create-quantity-input'
          name='quantity'
          type='number'
          value={quantityInput}
          onChange={handleQuantityInputChange}
          placeholder='Örneğin: 50'
          min='0'
          inputMode='numeric'
          required
          isClearable={true}
          onClear={() => setQuantityInput("")}
        />

        <div className='menu-create-page__actions'>
          <Button
            type='submit'
            loading={isSubmitting}
            loadingText='Ekleniyor...'
            disabled={finalIsPrimaryButtonDisabled}
          >
            Listeye Ekle
          </Button>
        </div>
      </form>

      {groupedPendingMeals.length > 0 && (
        <div className='menu-create-page__pending'>
          <h2 className='menu-create-page__pending-title'>
            Menüye Eklenecekler ({pendingMeals.length} çeşit)
          </h2>
          {groupedPendingMeals.map((group) => (
            <div
              key={group.categoryId}
              className='menu-create-page__pending-category'
            >
              <h3 className='menu-create-page__pending-category-title'>
                {group.categoryName} ({group.meals.length} çeşit)
              </h3>
              <div className='menu-create-page__pending-list'>
                {group.meals.map((meal) => (
                  <div
                    key={meal.pendingId}
                    className='menu-create-page__pending-item'
                  >
                    <PortionCard
                      title={meal.mealName}
                      variant='pending'
                      added={meal.quantity ?? 0}
                      onClick={() => openPendingMealModal(meal)}
                    />
                    {meal.errorMessage ? (
                      <span className='menu-create-page__pending-error'>
                        {meal.errorMessage}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='menu-create-page__cta fixed-cta'>
        <Button
          type='button'
          className='menu-create-page__save'
          onClick={handleSaveAll}
          loading={isSaving}
          loadingText='Kaydediliyor...'
          disabled={!hasPendingMeals || isSaving}
        >
          Menüye Kaydet
        </Button>
        <Button
          type='button'
          variant='secondary'
          className='menu-create-page__cancel'
          onClick={handleCancel}
          disabled={isSaving}
        >
          Vazgeç
        </Button>
      </div>

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />

      <UpdateMealModal
        isOpen={isPendingModalOpen}
        onClose={closePendingMealModal}
        selectedMeal={selectedPendingMeal}
        mode='pending'
        onPendingUpdate={handlePendingMealUpdated}
        onPendingRemove={handlePendingMealRemoved}
      />

	      {showDiscardModal && (
	        <ConfirmModal
	          isOpen={showDiscardModal}
	          onClose={() => setShowDiscardModal(false)}
	          title='İşlemi Sonlandır'
	          message='Kaydedilmemiş eklemeler silinecek. Çıkmak istiyor musunuz?'
	          confirmText='Çık'
	          cancelText='Geri dön'
	          onConfirm={handleDiscardConfirmed}
	        />
	      )}
	    </div>
	  );
	};

export default MenuCreatePage;

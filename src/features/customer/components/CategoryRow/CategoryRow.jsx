import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/features/customer/components/ProductCard/ProductCard";
import { ReactComponent as ChevronLeftIcon } from "@/assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import { ReactComponent as CheckIcon } from "@/assets/icons/check.svg";
import "./CategoryRow.scss";

const CategoryRow = ({ categoryId, title, items }) => {
  const scrollRef = useRef(null);
  const selectedItems = useSelector((state) => state.customerMenu.selectedItems);

  const sortedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      const aOut = Number(a?.remainingQuantity) === 0;
      const bOut = Number(b?.remainingQuantity) === 0;
      if (aOut === bOut) return 0;
      return aOut ? 1 : -1;
    });
  }, [items]);

  const selectedIdRaw = selectedItems[String(categoryId)];
  const selectedId =
    selectedIdRaw === undefined || selectedIdRaw === null
      ? null
      : String(selectedIdRaw);
  const lastAutoScrollState = useRef({ selectedId: null, signature: "" });

  useEffect(() => {
    if (!selectedId) {
      lastAutoScrollState.current = { selectedId: null, signature: "" };
      return;
    }

    const container = scrollRef.current;
    if (!container) return;

    const signature = sortedItems.map((item) => String(item.id)).join("|");
    const previous = lastAutoScrollState.current;
    const selectionChanged = previous.selectedId !== selectedId;
    const listChanged = previous.signature !== signature;

    if (!selectionChanged && !listChanged) {
      return;
    }

    lastAutoScrollState.current = { selectedId, signature };

    const index = sortedItems.findIndex((item) => String(item.id) === selectedId);
    if (index < 0) return;

    const target = container.children[index];
    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const isVisible =
      targetRect.left >= containerRect.left &&
      targetRect.right <= containerRect.right;

    if (!isVisible) {
      const gap = parseFloat(
        window.getComputedStyle(container).columnGap || "0"
      );
      const targetWidth = targetRect.width;
      const offset =
        target.offsetLeft -
        container.clientWidth / 2 +
        targetWidth / 2 -
        gap / 2;
      container.scrollTo({
        left: Math.max(0, offset),
        behavior: "smooth",
      });
    }
  }, [selectedId, categoryId, sortedItems]);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollStep = 200;

    const firstCard = container.firstElementChild;
    if (firstCard && typeof window !== "undefined") {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const styles = window.getComputedStyle(container);
      const gapValue =
        parseFloat(styles.columnGap || styles.gap || "0") || 0;
      scrollStep = cardWidth + gapValue;
    }

    const scrollAmount = direction === "left" ? -scrollStep : scrollStep;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className='category'>
      <h2 className='category__title'>
        {title}
        {selectedId && (
          <span
            className='category__status'
            role='img'
            aria-label='Bu kategoride bir ürün seçildi'
          >
            <CheckIcon className='category__status-icon' aria-hidden='true' />
          </span>
        )}
      </h2>
      <button
        className='category__nav-button category__nav-button--prev'
        aria-label='Önceki'
        type='button'
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => handleScroll("left")}
      >
        <ChevronLeftIcon className='icon' />
      </button>
      <div className='category__items' ref={scrollRef}>
        {sortedItems.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            remainingQuantity={item.remainingQuantity}
            categoryId={categoryId}
            itemId={item.id}
          />
        ))}
      </div>
      <button
        className='category__nav-button category__nav-button--next'
        aria-label='Sonraki'
        type='button'
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => handleScroll("right")}
      >
        <ChevronRightIcon className='icon' />
      </button>
    </div>
  );
};

export default CategoryRow;

import { useRef } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/features/customer/components/ProductCard/ProductCard";
import { ReactComponent as ChevronLeftIcon } from "@/assets/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import "./CategoryRow.scss";

const CategoryRow = ({ categoryId, title, items }) => {
  const scrollRef = useRef(null);
  const selectedItems = useSelector((state) => state.customerMenu.selectedItems);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className='category'>
      <h2 className='category__title'>
        {title}
        {selectedItems[categoryId] && (
          <span className='category__status'>✓</span>
        )}
      </h2>
      <div className='category__items-container'>
        <button
          className='category__nav-button category__nav-button--prev'
          aria-label='Önceki'
          onClick={() => handleScroll("left")}
        >
          <ChevronLeftIcon className='icon' />
        </button>
        <div className='category__items' ref={scrollRef}>
          {items.map((item) => (
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
          onClick={() => handleScroll("right")}
        >
          <ChevronRightIcon className='icon' />
        </button>
      </div>
    </div>
  );
};

export default CategoryRow;

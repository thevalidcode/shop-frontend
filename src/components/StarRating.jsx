import React from "react";

export const StarRating = ({ rating, count, className }) => {
  const fullStar = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStar = 5 - fullStar - (halfStar ? 1 : 0);

  return (
    <>
      <div className={`${className}`}>
        {[...Array(fullStar)].map((_, index) => (
          <i key={`full-${index}`} class="bx bxs-star text-yellow-400"></i>
        ))}

        {halfStar && <i class="bx bxs-star-half text-yellow-400"></i>}

        {[...Array(emptyStar)].map((_, index) => (
          <i key={`empty-${index}`} class="bx bx-star text-yellow-400"></i>
        ))}
        <span className="text-gray-500 text-sm ml-1 inline-flex items-center">
          {count}
        </span>
      </div>
    </>
  );
};

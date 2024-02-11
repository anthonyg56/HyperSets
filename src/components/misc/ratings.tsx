"use client"

import { faStar } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarOutline } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  rating: number | null;
  setRating: Dispatch<SetStateAction<number | null>>;
}

export default function Ratings({ rating, setRating }: Props) {
  if (rating === null) {
    return (
      <div className="flex flex-row min-h-full">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            icon={faStarOutline}
            width={12}
            height={16}
            onMouseEnter={(e) => handleRatingChange(e, i)} 
            onMouseLeave={(e) => handleRatingChange(e, null)} 
            onClick={(e) => handleRatingChange(e, i)} 
            className="cursor-pointer"
          />
        ))}
      </div>
    )
  }

  const outlineStars: JSX.Element[] = [];
  const solidStars: JSX.Element[] = [];

  function handleRatingChange(e: any, rating: number | null) {

    setRating(rating)
  }

  for (let i = 0; i < 5 - rating; i++) {
    outlineStars.push(
      <FontAwesomeIcon 
        icon={faStarOutline}
        width={12}
        height={16}
        onMouseEnter={(e) => handleRatingChange(e, i+rating)} 
        onMouseLeave={(e) => handleRatingChange(e, rating)} 
        onClick={(e) => handleRatingChange(e, i+rating)} 
        className="cursor-pointer"
      />
    )
  };

  for (let i = 0; i < rating; i++) {
    solidStars.push(
      <FontAwesomeIcon 
        icon={faStar} 
        width={12} 
        height={16} 
        onMouseEnter={(e) => handleRatingChange(e, i+rating)} 
        onMouseLeave={(e) => handleRatingChange(e, rating)} 
        onClick={(e) => handleRatingChange(e, i+rating)}
        className="cursor-pointer"
      />
    )
  };

  return (
    <div className="flex flex-row min-h-full">
      {solidStars}
      {outlineStars}
    </div>
  )
}
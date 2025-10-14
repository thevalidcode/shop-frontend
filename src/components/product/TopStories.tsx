import { title } from "process";
import React from "react";

export default function TopStories() {
  const stories = [
    {
      id: 1,
      title: "How do you like to style your sunglasses?",
      text: "Our latest collection, where classic and contemporary styles converge in perfect harmony. Our latest collection, where classic and contemporary styles converge in perfect harmony. Our latest collection, where classic and contemporary styles converge in perfect harmony.",
    },
    {
      id: 2,
      title: "How do you like to style your sunglasses?",
      text: "Our latest collection, where classic and contemporary styles converge in perfect harmony. Our latest collection, where classic and contemporary styles converge in perfect harmony. Our latest collection, where classic and contemporary styles converge in perfect harmony.",
    },
    {
      id: 3,
      title: "How do you like to style your sunglasses?",
      text: "Our latest collection, where classic and contemporary styles converge in perfect harmony. Our latest collection, where classic and contemporary styles converge in perfect harmony. Our latest collection, where classic and contemporary styles converge in perfect harmony.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center w-full px-5 py-5 max-sm:px-0 space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-4xl font-medium text-center text-black">
          TOP STORIES
        </h1>

        <p className="font-extralight text-lg text-center text-slate-500">
          trending
        </p>
      </div>

      <div className="flex flex-col space-y-1 border-0 max-sm:w-full">
        {stories.map((story) => (
          <div
            className="bg-[#FAEFFF] px-4 py-4 mt-8 rounded-2xl space-y-4 w-3xl max-sm:w-full
            max-sm:text-left border"
            key={story.id}
          >
            <h1 className="font-normal text-2xl text-left">{story.title}</h1>
            <p className="text-base font-light">{story.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

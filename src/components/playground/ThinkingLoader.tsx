import React from "react";

function ThinkingLoader() {
  return (
    <div className="w-full flex gap-1">
      {/* 3 dots loader */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="size-2 rounded-full bg-primary/65 animate-pulse"
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export default ThinkingLoader;

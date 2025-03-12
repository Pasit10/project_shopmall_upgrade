import React from "react";
import CategoryFilterProps from "../Types/CategoryFilterProps";



const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="mb-4">
      <h6>Categories</h6>
      <div>
        <label>
          <input
            type="radio"
            name="category"
            value="all"
            checked={selectedCategory === "all"}
            onChange={() => setSelectedCategory("all")}
          />
          <span className="ms-2">All</span>
        </label>
      </div>
      {categories.map((category) => (
        <div key={category.id}>
          <label>
            <input
              type="radio"
              name="category"
              value={category.id}
              checked={selectedCategory === String(category.id)}
              onChange={() => setSelectedCategory(String(category.id))}
            />
            <span className="ms-2">{category.name}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;

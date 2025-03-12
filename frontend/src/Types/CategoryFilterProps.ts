import { Category } from "./Category";

export default interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}
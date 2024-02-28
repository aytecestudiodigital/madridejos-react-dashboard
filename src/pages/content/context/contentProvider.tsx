import React, { ReactNode, useState } from "react";
import { CategoriesContext } from "./contentContext";

interface ContentProviderProps {
  children: ReactNode; // Esto indica que children puede ser cualquier elemento React válido
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  const [categories, setCategories] = useState([] as string[]);

  const handleCategories = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  return (
    <CategoriesContext.Provider value={{ categories, handleCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

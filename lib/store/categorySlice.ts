import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  attributes?: Array<{ name: string; values: string[] }>;
  children?: Category[];
}

interface CategoryState {
  categories: Category[];
  categoryTree: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  categoryTree: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setCategoryTree: (state, action: PayloadAction<Category[]>) => {
      state.categoryTree = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat._id !== action.payload);
    },
    setCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCategoryError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCategories,
  setCategoryTree,
  setCurrentCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  setCategoryLoading,
  setCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;

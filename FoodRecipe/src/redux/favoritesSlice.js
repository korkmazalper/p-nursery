import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const food = action.payload;
      const index = state.favoriterecipes.findIndex(
        (item) => item.idFood === food.idFood,
      );

      if (index >= 0) {
        state.favoriterecipes.splice(index, 1);
      } else {
        state.favoriterecipes.push(food);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

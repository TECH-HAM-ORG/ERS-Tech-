import { configureStore } from "@reduxjs/toolkit";
import blogSlice from "./features/blogs/blogSlice";
import formSlice from "./features/form/formSlice";

const middlewares = [];
if (process.env.NODE_ENV === "development") {
  const { createLogger } = require("redux-logger");
  middlewares.push(createLogger());
}

const store = configureStore({
  reducer: {
    blogs: blogSlice,
    form: formSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middlewares),
});

export default store;

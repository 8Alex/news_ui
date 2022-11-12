import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty"
      );

      if (!response.ok) {
        throw new Error("Server Error.");
      }

      let id = await response.json();
      id = parseInt(id);

      const arrayItems = [];

      do {
        const item = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?"print=pretty`
        );
        let dataItem = await item.json();
        if (
          dataItem &&
          dataItem.type === "story" &&
          dataItem.dead !== true &&
          dataItem.deleted !== true
        ) {
          arrayItems.push(dataItem);
        }
        id--;
      } while (arrayItems.length < 100 && id > 0);

      return arrayItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchItem = createAsyncThunk(
  "news/fetchItem",
  async function (id, { rejectWithValue }) {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json?"print=pretty`
      );

      if (!response.ok) {
        throw new Error("Article not found. Server Error.");
      }

      let data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  "news/fetchComments",
  async function (idArray, { rejectWithValue }) {
    try {
      let commentsArray = [];

      for (let idComment of idArray) {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${idComment}.json?"print=pretty`
        );

        if (!response.ok) {
          throw new Error("Comments not found. Server Error.");
        }

        let data = await response.json();

        if (data && data.dead !== true && data.deleted !== true) {
          commentsArray.push(data);
        }
      }
      return commentsArray;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchKidsComments = createAsyncThunk(
  "news/fetchKidsComments",
  async function (commentObj, { rejectWithValue, getState }) {
    try {
      let commentsKidsArray = [];

      for (let idKidsComment of commentObj.kidsIds) {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${idKidsComment}.json?"print=pretty`
        );

        if (!response.ok) {
          throw new Error("Comments not found. Server Error.");
        }

        let data = await response.json();

        if (data && data.dead !== true && data.deleted !== true) {
          commentsKidsArray.push(data);
        }
      }
      const kidsComments = {
        parentId: commentObj.parentId,
        kids: commentsKidsArray,
      };
      const nestedComments = [...getState().news.nestedComments, kidsComments];
      return nestedComments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const setError = (state, action) => {
  state.status = "rejected";
  state.error = action.payload;
};

const setLoadind = (state) => {
  state.status = "loading";
  state.error = null;
};

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    currentNews: null,
    comments: [],
    nestedComments: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNews.pending, setLoadind);
    builder.addCase(fetchNews.fulfilled, (state, action) => {
      state.status = "resolved";
      state.news = action.payload;
    });
    builder.addCase(fetchNews.rejected, setError);
    builder.addCase(fetchItem.pending, setLoadind);
    builder.addCase(fetchItem.fulfilled, (state, action) => {
      state.status = "resolved";
      state.currentNews = action.payload;
    });
    builder.addCase(fetchItem.rejected, setError);
    builder.addCase(fetchComments.pending, setLoadind);
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.status = "resolved";
      state.comments = action.payload;
    });
    builder.addCase(fetchComments.rejected, setError);
    builder.addCase(fetchKidsComments.pending, setLoadind);
    builder.addCase(fetchKidsComments.fulfilled, (state, action) => {
      state.status = "resolved";
      state.nestedComments = action.payload;
    });
    builder.addCase(fetchKidsComments.rejected, setError);
  },
});

export default newsSlice.reducer;

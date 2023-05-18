// export type PostUsersResponse = {
//   resultCode: number
//   messages: string[],
//   data: object
// }
// export const Users = (props: PropsUsersType) => {
//
//   let pageCount = Math.ceil(props.totalUsersCount / props.pageSize)
//   let page = []
//   for (let i = 1; i <= pageCount; i++) {
//     page.push(i)
//   }
//   const portionSize=10;
//   const portionCount=Math.ceil(props.totalUsersCount /portionSize) //сколько порций всего
//   let[portionNumber, setPortionNumber]=useState(1);
//   let leftPortionPageNumber=(portionNumber-1)*portionSize+1;
//   let rightPortionPageNumber=portionNumber*portionSize
//
//
//
//
//   return (
//     <div>
//       {props.isFetching && <div><img src={preloader} alt=""/></div>}
//       {portionNumber > 1 && <button onClick={()=>setPortionNumber(portionNumber-1)}>Back</button>}
//       {page
//         .filter(p=>p >= leftPortionPageNumber && p<= rightPortionPageNumber)
//         .map((p, index) => <span key={index} className={props.currentPage === p ? s.selected : ''}
//                                  onClick={() => props.onClickPage(p)}>{p} </span>)}
//       {portionCount > portionNumber && <button onClick={()=>setPortionNumber(portionNumber+1)}>next</button>}
//       {props.users.map(u => <div key={u.id}>

import { createSlice } from "@reduxjs/toolkit";
import {
  argRegisterType,
  authApi,
  authLoginType,
  CreatePasswordType,
  ProfileType,
  UpdateUserType,
} from "features/auth/auth.api";
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk";
import { appActions, setAppError } from "app/app.slice";
import { thunkTryCatch } from "common/utils/thunkTryCatch";

const authInitialState = {
  profile: null as ProfileType | null,
  isLoggedIn: false,
};

//TC

export const registerTC = createAppAsyncThunk<void, argRegisterType>("/auth/register", async (arg, thunkAPI) => {
  return thunkTryCatch(thunkAPI, async () => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      await authApi.register(arg);
    } catch (e: any) {
      const error = e.response ? e.response.data.error : e.message;
      dispatch(appActions.setAppError({ error }));
      return rejectWithValue(null);
    }
  });
});
export const updateUserTC = createAppAsyncThunk<{ profile: ProfileType }, UpdateUserType>(
  "/auth/me",
  async (arg, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      const { rejectWithValue } = thunkAPI;
      let res = await authApi.updateUser(arg);
      return { profile: res.data };
    });
  }
);

export const loginTC = createAppAsyncThunk<{ profile: ProfileType }, authLoginType>(
  "/auth/login",
  async (arg, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
      let res = await authApi.login(arg);
      return { profile: res.data };
    });
  }
);
export const logoutTC = createAppAsyncThunk<void>("auth/me", async (any, thunkAPI) => {
  return thunkTryCatch(thunkAPI, async () => {
    await authApi.logout();
  });
});
export const createNewPasswordTC = createAppAsyncThunk<{}, CreatePasswordType>(
  `/auth/set-new-password`,
  async (arg: CreatePasswordType) => {
    // const tokenPassword = useParams().token;
    let res = await authApi.createNewPassword(arg);
    return { profile: res.data };
  }
);

export const forgotPasswordTC = createAppAsyncThunk("auth/forgot", async (email: string) => {
  let res = await authApi.forgotPassword(
    email,
    "test-front-admin",
    `<div style="background-color: lime; padding: 15px">
password recovery link: 
<a href="http://localhost:3000/set-new-password/$token$">
link</a>
</div>`
  );
  return res.data;
});
export const initializedTC = createAppAsyncThunk("/new/pass", async () => {
  const res = await authApi.me();
  return { profile: res.data };
});
export const authThunks = { registerTC, loginTC, createNewPasswordTC, forgotPasswordTC, initializedTC };
const slice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.profile = action.payload.profile;
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state, action) => {
      state.isLoggedIn = false;
    });
    builder.addCase(forgotPasswordTC.fulfilled, (state, action) => {
      state.isLoggedIn = true;
    });
    builder.addCase(updateUserTC.fulfilled, (state, action) => {
      if (state.profile !== null) state.profile = action.payload.profile;
    });
    builder.addCase(initializedTC.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.profile = action.payload.profile;
    });
  },
});
//AC
export const authReducers = slice.reducer;

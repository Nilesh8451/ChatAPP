import {STORELOGINDATA, REMOVEUSERDATA} from './type';

const initialState = {
  loginData: {},
};

export const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORELOGINDATA:
      return {
        ...state,
        loginData: action.payload,
      };
    case REMOVEUSERDATA:
      return {
        ...state,
        loginData: {},
      };
    default:
      return {
        ...state,
      };
  }
};

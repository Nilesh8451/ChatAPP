import {STORELOGINDATA, REMOVEUSERDATA} from './type';

export const loginDataFun = data => {
  return {
    type: STORELOGINDATA,
    payload: data,
  };
};
export const removeUserFun = () => {
  return {
    type: REMOVEUSERDATA,
  };
};

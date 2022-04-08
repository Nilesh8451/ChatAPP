import {combineReducers, createStore} from 'redux';

import {userInfoReducer} from './reducer';

const rootReducer = combineReducers({
  userInfo: userInfoReducer,
});

export const store = createStore(rootReducer);

import { combineReducers } from 'redux';
import { Types } from '../actions/user';

const defaultState = {
    jwt: '',
    user: {}
};

const userReducer = (state = defaultState, action) => {
    switch (action.type) {
      case Types.INSERT_USER_INFO: {  
        return {
            jwt: action.payload.jwt,
            user: action.payload.user
        };
      }
      case Types.DELETE_USER_INFO: {
        return defaultState;
      }
      default:
        return state;
    };
};

export const reducers = combineReducers({
    user: userReducer
});
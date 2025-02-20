import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import empresaReducer from './slices/empresaSlice';
import tablesReducer from './slices/tableSlice';
import feedbackReducer from './slices/feedBackSlice';
import { logout } from './actions/logout';

const appReducer = combineReducers({
     authSlice: authReducer,
     empresaSlice: empresaReducer,
     tableSlice: tablesReducer,
     feedBackSlice: feedbackReducer,
});

const rootReducer = (state: any, action: any) => {
     if (action.type === logout.type) {
          localStorage.clear();
          return appReducer(undefined, action); // Reinicia todos los estados
     }
     return appReducer(state, action);
};

export default rootReducer;
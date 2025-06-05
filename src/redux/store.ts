import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { uiUxReducer } from './ui-slice';

function loadState() {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}
function saveState(state: RootState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    // Ignore write errors
  }
}
const rootReducer = combineReducers({
  uiux: uiUxReducer,
});
const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

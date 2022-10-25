// npm i redux react-redux redux-thunk redux-devtools-extension
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';

const reducer = combineReducers({
    // state
    productList: productListReducer,
    productDetails: productDetailReducer,
    cart: cartReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    cart: { cartItems: cartItemsFromStorage }
};

const middleWare = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleWare)));

export default store;
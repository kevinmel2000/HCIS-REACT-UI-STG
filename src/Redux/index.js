import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import configureStore from './createstore';
import rootSaga from '../Sagas';
import ReduxPersist from '../config/reduxpersist';
import { persistStore } from 'redux-persist'

export const reducers = combineReducers({
	auth: require('./AuthRedux').reducer,
	masterdata: require('./MasterdataRedux').reducer,
	recruitment: require('./RecruitmentRedux').reducer,
	employee: require('./EmployeeRedux').reducer,
	idp: require('./IdpRedux').reducer,
	bizpar: require('./BizparRedux').reducer,
	personal: require('./PersonalRedux').reducer
});

export default () => {
	let finalReducers = reducers;
	// If rehydration is on use persistReducer otherwise default combineReducers
	if (ReduxPersist.active) {
		const persistConfig = ReduxPersist.storeConfig;
		finalReducers = persistReducer(persistConfig, reducers);
	}

	let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga);

	if (module.hot) {
		module.hot.accept(() => {
			const nextRootReducer = require('.').reducers;
			store.replaceReducer(nextRootReducer);

			const newYieldedSagas = require('../Sagas').default;
			sagasManager.cancel();
			sagasManager.done.then(() => {
				sagasManager = sagaMiddleware.run(newYieldedSagas);
			});
		});
	}

    let persistor = persistStore(store);

	return { store, persistor };
};
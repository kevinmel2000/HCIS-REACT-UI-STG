import { createStore, applyMiddleware, compose } from 'redux';
import EventTrackMiddleware from './eventtrackmiddleware';
import createSagaMiddleware from 'redux-saga';
// import { loadState, saveState } from './sessionStorage';

export default (rootReducer, rootSaga) => {
    const middleware = [];
    const enhancers = [];

    middleware.push(EventTrackMiddleware);

    const sagaMonitor = null;
    const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
    middleware.push(sagaMiddleware);

    enhancers.push(applyMiddleware(...middleware));

    // const persistedState = loadState();
    const store = createStore(rootReducer, compose(...enhancers));

    // store.subscribe(() => {
    //     saveState(store.getState());
    // });

    let sagasManager = sagaMiddleware.run(rootSaga);

    return {
        store,
        sagasManager,
        sagaMiddleware
    };
}
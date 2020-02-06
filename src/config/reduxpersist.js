import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
// import { AsyncStorage } from 'AsyncStorage';
import storageSession from 'redux-persist/lib/storage/session'

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
	active: true,
	reducerVersion: '1.0',
	storeConfig: {
		key: 'primary',
		storage: storageSession,
		whitelist: ['auth'],
		transforms: [immutablePersistenceTransform]
	}
};

export default REDUX_PERSIST ;

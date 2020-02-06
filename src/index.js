import React from 'react'
import ReactDOM from 'react-dom'

import './assets/icons/fontawesome/css/all.min.css'
import './assets/sass/app.css'
import './assets/css/circle.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'input-moment/dist/input-moment.css'
import 'react-times/css/material/default.css'
import 'react-times/css/classic/default.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import App from './components/App'
import * as serviceWorker from './serviceWorker'

import { Provider } from 'react-redux'
import createStore from './Redux'
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = createStore()

ReactDOM.render(
<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
    </PersistGate>
</Provider>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

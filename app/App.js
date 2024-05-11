import { GoogleOAuthProvider } from '@react-oauth/google'
import Axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'

Axios.defaults.baseURL = 'https://www.googleapis.com/books/v1'

import DispatchContext from './context/DispatchContext'
import StateContext from './context/StateContext'

//My Components
import Bookshelves from './components/Bookshelves/Bookshelves'
import FlashMessages from './components/FlashMessages/FlashMessages'
import Header from './components/Header/Header'
import HeaderLoggedOut from './components/Header/HeaderLoggedOut'
import LoginPage from './components/LoginPage/LoginPage'
import NotFound from './components/others/NotFound'
import SearchPage from './components/SearchPage/SearchPage'
import ViewSingleBook from './components/ViewSingleBook/ViewSingleBook'
import './global.scss'

function App() {
	const initialState = {
		loggedIn: false,
		flashMessages: {
			value: [],
			style: '',
		},
		token: {
			value: '',
		},
		searchValue: {
			value: '',
		},
		burgerMenu: false,
	}

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true
				localStorage.setItem('loggedIn', true)
				draft.token.value = action.value
				return
			case 'logout':
				draft.loggedIn = false
				localStorage.removeItem('loggedIn')
				draft.token.value = ''
				return
			case 'flashMessages':
				draft.flashMessages.value.push(action.value)
				draft.flashMessages.style = action.style
				return
			case 'setSearchValue':
				draft.searchValue.value = action.value
				return
			case 'burgerMenuActive':
				draft.burgerMenu = true
				return
				return
			case 'burgerMenuClosed':
				draft.burgerMenu = false
				return
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)

	return (
		<GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
			<StateContext.Provider value={state}>
				<DispatchContext.Provider value={dispatch}>
					<FlashMessages messages={state.flashMessages.value} />
					<BrowserRouter>
						{state.loggedIn ? <Header /> : <HeaderLoggedOut />}
						<Routes>
							<Route path='/' element={state.loggedIn ? <SearchPage /> : <LoginPage />} />
							<Route path='/search/:searchValue/*' element={<SearchPage />} />
							<Route path='/bookshelves/*' element={<Bookshelves />} />
							<Route path='/bookshelves/:bookshelf_type/*' element={<Bookshelves />} />
							<Route path='/search/:searchValue/:id/*' element={<ViewSingleBook />} />
							<Route
								path='/bookshelves/:bookshelf_type/:id/*'
								element={<ViewSingleBook bookshelves={true} />}
							/>
							<Route path='*' element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</DispatchContext.Provider>
			</StateContext.Provider>
		</GoogleOAuthProvider>
	)
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

if (module.hot) {
	module.hot.accept()
}

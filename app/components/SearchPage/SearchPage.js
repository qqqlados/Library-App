import Axios from 'axios'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CardItem from '../CardItem/CardItem'
import LoadingIcon from '../LoadingIcon/LoadingIcon'
import Page from '../others/Page'
import styles from './SearchPage.module.scss'
import search from '/app/img/search.png'
import search_book from '/app/img/search_book.png'

import DispatchContext from '/app/context/DispatchContext'
import StateContext from '/app/context/StateContext'

function SearchPage() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const [searchTerm, setSearchTerm] = useState(appState.searchValue.value)
	const [results, setResults] = useState([])
	const [formSubmitted, setFormSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [welcomePage, setWelcomePage] = useState(null)
	const { searchValue } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		const storedSearchTerm = localStorage.getItem('searchTerm')
		if (storedSearchTerm) {
			setSearchTerm(storedSearchTerm)
		}
	}, [])

	useEffect(() => {
		if (formSubmitted) {
			localStorage.setItem('searchTerm', searchTerm)
			appDispatch({ type: 'setSearchValue', value: searchTerm })
		}
	}, [formSubmitted])

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		const submitHandler = async () => {
			try {
				setWelcomePage(false)
				const storedData = JSON.parse(sessionStorage.getItem(`searchResults_${searchTerm}`))
				if (storedData) {
					setResults(storedData)
				} else {
					setResults([])
					setIsLoading(true)
					const response = await Axios.get(`/volumes?q=${searchTerm}`, {
						CancelToken: ourRequest.token,
					})
					if (response.data.items && response.data.items.length > 0) {
						setResults(response.data.items)
						setIsLoading(false)
						const searchResult = sessionStorage.setItem(`searchResults_${searchTerm}`, JSON.stringify(response.data.items))
					} else {
						console.error('Масив items не існує або пустий')
					}
				}
			} catch (error) {
				console.error('Помилка запиту:', error)
			}
		}

		if (formSubmitted) {
			submitHandler()
			setFormSubmitted(false)
		}
		return () => {
			ourRequest.cancel()
		}
	}, [formSubmitted])

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		const repeatedlyFetchData = async () => {
			try {
				setWelcomePage(false)
				const storedData = JSON.parse(sessionStorage.getItem(`searchResults_${searchValue}`))
				if (storedData) {
					setResults(storedData)
				} else {
					setResults([])
					setIsLoading(true)
					const response = await Axios.get(`/volumes?q=${searchValue}&maxResults=30`, {
						CancelToken: ourRequest.token,
					})
					setIsLoading(false)
					setResults(response.data.items)
				}
			} catch (err) {
				console.log('Проблема: ', err)
			}
		}
		if (searchValue) {
			repeatedlyFetchData()
		} else {
			setWelcomePage(true)
			setResults([])
		}
		return () => {
			ourRequest.cancel()
		}
	}, [searchValue])

	const trigger = event => {
		event.preventDefault()
		navigate(`/search/${searchTerm}`)
		setFormSubmitted(true)
	}

	return (
		<Page title={appState.searchValue.value && !welcomePage ? `${appState.searchValue.value}` : 'Search'}>
			<div className={styles.page}>
				<div className={styles.main}>
					<form onSubmit={trigger} className={styles.form}>
						<div className={styles.input_container}>
							<input
								className={styles.input}
								onChange={e => setSearchTerm(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										trigger(e)
									}
								}}
								type='text'
								placeholder='Type a search query here!'
								value={searchTerm}
							/>
							<button
								className={clsx(styles.cross, searchTerm && styles.active)}
								onClick={e => {
									e.preventDefault()
									setSearchTerm('')
								}}
							>
								X
							</button>
							<button className={styles.submit} type='submit'>
								<img src={search} alt='Search' />
							</button>
						</div>
						<div className={styles.submit_small}>
							<button type='submit'>
								<img src={search} alt='Search' />
							</button>
						</div>
					</form>
				</div>

				{welcomePage && (
					<div className={styles.image}>
						<img src={search_book}></img>
					</div>
				)}
				{isLoading && <LoadingIcon />}
				{!isLoading && !welcomePage && (
					<div className={styles.cards}>
						{results
							? results.map(book => {
									return (
										<CardItem
											key={book.id}
											id={book.id}
											image={book.volumeInfo.imageLinks?.smallThumbnail}
											title={book.volumeInfo.title}
											author={book.volumeInfo.authors}
											description={book.volumeInfo.description}
										/>
									)
							  })
							: ''}
					</div>
				)}
			</div>
		</Page>
	)
}

export default SearchPage

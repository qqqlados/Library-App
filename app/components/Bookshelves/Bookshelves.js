import Axios from 'axios'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CardItem from '../CardItem/CardItem'
import LoadingIcon from '../LoadingIcon/LoadingIcon'
import Page from '../others/Page'
import styles from './Bookshelves.module.scss'
import bookshelf from '/app/img/bookshelf-new3.png'

import DispatchContext from '/app/context/DispatchContext'
import StateContext from '/app/context/StateContext'

function Bookshelves() {
	const appDispatch = useContext(DispatchContext)
	const { bookshelf_type } = useParams()
	const [result, setResult] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [btnDisabled, setBtnDisabled] = useState(false)
	const [welcomePage, setWelcomePage] = useState(true)
	const [deleteAll, setDeleteAll] = useState(false)
	const [activeLink, setActiveLink] = useState({
		favorites: 0,
		'to-read': 0,
		'reading-now': 0,
		'have-read': 0,
	})

	const appState = useContext(StateContext)

	const headers = {
		Authorization: `Bearer ${appState.token.value}`,
		'Content-Type': 'application/json',
	}

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		async function getData() {
			try {
				if (activeLink[bookshelf_type] > 1) {
					const storedBookshelfResults = localStorage.getItem(
						`bookshelfResults_${bookshelf_type}`
					)
					if (storedBookshelfResults) {
						setResult(JSON.parse(storedBookshelfResults))
					} else {
						setResult('')
					}
				} else if (activeLink[bookshelf_type] == 1) {
					setResult([])
					setWelcomePage(false)
					setIsLoading(true)
					const apiDestination = getApiDestination(bookshelf_type)
					const response = await Axios.get(
						`/mylibrary/bookshelves/${apiDestination}/volumes`,
						{ headers, CancelToken: ourRequest.token }
					)
					setIsLoading(false)
					setResult(
						response.data.items !== undefined ? response.data.items : ''
					)

					if (response.data.items != undefined) {
						setDeleteAll(true)
						localStorage.setItem(
							`bookshelfResults_${bookshelf_type}`,
							JSON.stringify(response.data.items)
						)
					} else {
						setDeleteAll(false)
						console.log(`У полиці ${bookshelf_type} немає книг.`)
					}
				}
			} catch (err) {
				console.log('Помилка запиту: ', err)
			}
		}

		function getApiDestination(type) {
			switch (type) {
				case 'favorites':
					return '0'
				case 'to-read':
					return '2'
				case 'reading-now':
					return '3'
				case 'have-read':
					return '4'
			}
		}
		getData()

		return () => {
			ourRequest.cancel()
		}
	}, [activeLink, bookshelf_type])

	useEffect(() => {
		setActiveLink(prevState => ({
			...prevState,
			[bookshelf_type]: prevState[bookshelf_type] + 1,
		}))
	}, [])

	useEffect(() => {
		setWelcomePage(true)
		return () => {
			const keysToRemove = Object.keys(localStorage).filter(key =>
				key.startsWith('bookshelfResults')
			)
			keysToRemove.forEach(key => localStorage.removeItem(key))
		}
	}, [])

	const bookshelvesToNumbers = bookshelf_type => {
		switch (bookshelf_type) {
			case 'favorites':
				return '0'
			case 'to-read':
				return '2'
			case 'reading-now':
				return '3'
			case 'have-read':
				return '4'
		}
	}

	const apiDestination = bookshelvesToNumbers(bookshelf_type)
	const ourRequest = Axios.CancelToken.source()

	const deleteAllHandler = async () => {
		try {
			setBtnDisabled(true)
			await Axios.post(
				`/mylibrary/bookshelves/${apiDestination}/clearVolumes`,
				{},
				{ headers, CancelToken: ourRequest.token }
			)
			setBtnDisabled(false)

			appDispatch({
				type: 'flashMessages',
				value: 'All books are successfully deleted from that bookshelf.',
				style: 'success',
			})
			setDeleteAll(false)

			localStorage.removeItem(`bookshelfResults_${bookshelf_type}`)
			setResult('')
		} catch (err) {}

		return () => {
			ourRequest.cancel()
		}
	}
	console.log(welcomePage)

	return (
		<Page title={bookshelf_type ? `${bookshelf_type}` : 'Bookshelves'}>
			<div className={styles.body}>
				<div className={styles.navbar}>
					<ul className={styles.links}>
						<li className={styles.item}>
							<NavLink
								to='/bookshelves/favorites'
								end
								onClick={() =>
									setActiveLink(prevState => ({
										...prevState,
										['favorites']: prevState['favorites'] + 1,
									}))
								}
								className={clsx(
									styles.link,
									location.pathname.startsWith('/bookshelves/favorites') &&
										styles.active
								)}
							>
								Favorites
							</NavLink>
						</li>
						<li className={styles.item}>
							<NavLink
								to='/bookshelves/to-read'
								onClick={() =>
									setActiveLink(prevState => ({
										...prevState,
										['to-read']: prevState['to-read'] + 1,
									}))
								}
								className={clsx(
									styles.link,
									location.pathname.startsWith('/bookshelves/to-read') &&
										styles.active
								)}
							>
								To read
							</NavLink>
						</li>
						<li className={styles.item}>
							<NavLink
								to='/bookshelves/reading-now'
								onClick={() =>
									setActiveLink(prevState => ({
										...prevState,
										['reading-now']: prevState['reading-now'] + 1,
									}))
								}
								className={clsx(
									styles.link,
									location.pathname.startsWith('/bookshelves/reading-now') &&
										styles.active
								)}
							>
								Reading now
							</NavLink>
						</li>
						<li className={styles.item}>
							<NavLink
								to='/bookshelves/have-read'
								onClick={() =>
									setActiveLink(prevState => ({
										...prevState,
										['have-read']: prevState['have-read'] + 1,
									}))
								}
								className={clsx(
									styles.link,
									location.pathname.startsWith('/bookshelves/have-read') &&
										styles.active
								)}
							>
								Have read
							</NavLink>
						</li>
					</ul>
				</div>

				<div
					className={clsx({
						[styles.content]: true,
						[styles.content_passive]: welcomePage || !result,
					})}
				>
					{welcomePage ? (
						<div className={styles.icon}>
							<img src={bookshelf} alt='Bookshelf icon' />
							{/* <img src={something} alt='Bookshelf icon' /> */}
						</div>
					) : (
						''
					)}
					{isLoading && !welcomePage ? <LoadingIcon bookshelves={true} /> : ''}
					{deleteAll && result ? (
						<button
							onClick={deleteAllHandler}
							disabled={btnDisabled}
							className={clsx(styles.btn, btnDisabled && styles.btn_disabled)}
						>
							Delete all
						</button>
					) : (
						''
					)}
					<div className={clsx('', result.length > 0 && styles.cards)}>
						{result &&
							result.map(book => {
								return (
									<CardItem
										key={book.id}
										id={book.id}
										title={book.volumeInfo.title}
										image={book.volumeInfo.imageLinks?.smallThumbnail}
										author={book.volumeInfo.authors}
										bookshelves={true}
									/>
								)
							})}
					</div>
					{!welcomePage && !result && (
						<div className={styles.text}>
							<p>You haven't already added books on that bookshelf.</p>
						</div>
					)}
				</div>
			</div>
		</Page>
	)
}

export default Bookshelves

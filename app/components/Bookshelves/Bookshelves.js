import Axios from 'axios'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CardItem from '../CardItem/CardItem'
import LoadingIcon from '../LoadingIcon/LoadingIcon'
import Page from '../others/Page'
import styles from './Bookshelves.module.scss'
import bookshelf from '/app/img/bookshelf.png'

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
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
								>
									<path
										d='M11.993 5.09691C11.0387 4.25883 9.78328 3.75 8.40796 3.75C5.42122 3.75 3 6.1497 3 9.10988C3 10.473 3.50639 11.7242 4.35199 12.67L12 20.25L19.4216 12.8944L19.641 12.6631C20.4866 11.7172 21 10.473 21 9.10988C21 6.1497 18.5788 3.75 15.592 3.75C14.2167 3.75 12.9613 4.25883 12.007 5.09692L12 5.08998L11.993 5.09691ZM12 7.09938L12.0549 7.14755L12.9079 6.30208L12.9968 6.22399C13.6868 5.61806 14.5932 5.25 15.592 5.25C17.763 5.25 19.5 6.99073 19.5 9.10988C19.5 10.0813 19.1385 10.9674 18.5363 11.6481L18.3492 11.8453L12 18.1381L5.44274 11.6391C4.85393 10.9658 4.5 10.0809 4.5 9.10988C4.5 6.99073 6.23699 5.25 8.40796 5.25C9.40675 5.25 10.3132 5.61806 11.0032 6.22398L11.0921 6.30203L11.9452 7.14752L12 7.09938Z'
										fill='#fff'
									></path>
								</svg>
								<p>Favorites</p>
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
								<svg
									width='25px'
									height='25px'
									viewBox='0 0 19 19'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fill='#fff'
										fillRule='evenodd'
										d='M161.960546,159.843246 L164.399107,161.251151 C164.637153,161.388586 164.71416,161.70086 164.580127,161.933013 C164.442056,162.172159 164.144067,162.258604 163.899107,162.117176 L161.419233,160.68542 C161.165323,160.8826 160.846372,161 160.5,161 C159.671573,161 159,160.328427 159,159.5 C159,158.846891 159.417404,158.291271 160,158.085353 L160,153.503423 C160,153.22539 160.231934,153 160.5,153 C160.776142,153 161,153.232903 161,153.503423 L161,158.085353 C161.582596,158.291271 162,158.846891 162,159.5 C162,159.6181 161.986351,159.733013 161.960546,159.843246 Z M160.5,169 C165.746705,169 170,164.746705 170,159.5 C170,154.253295 165.746705,150 160.5,150 C155.253295,150 151,154.253295 151,159.5 C151,164.746705 155.253295,169 160.5,169 Z M160.5,168 C165.19442,168 169,164.19442 169,159.5 C169,154.80558 165.19442,151 160.5,151 C155.80558,151 152,154.80558 152,159.5 C152,164.19442 155.80558,168 160.5,168 Z'
										transform='translate(-151 -150)'
									/>
								</svg>
								<p>To Read</p>
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
								<svg
									width='25px'
									height='25px'
									viewBox='0 0 16 16'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
								>
									<g fill='#fff'>
										<path d='M6.25 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 016.25 5zM10.5 5.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z' />

										<path
											fillRule='evenodd'
											d='M0 8a8 8 0 1116 0A8 8 0 010 8zm8-6.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z'
											clipRule='evenodd'
										/>
									</g>
								</svg>
								<p>Reading Now</p>
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
								<svg
									fill='#fff'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path d='M7.493,22.862a1,1,0,0,0,1.244-.186l11-12A1,1,0,0,0,19,9H13.133l.859-6.876a1,1,0,0,0-1.8-.712l-8,11A1,1,0,0,0,5,14H9.612l-2.56,7.684A1,1,0,0,0,7.493,22.862ZM6.964,12l4.562-6.273-.518,4.149A1,1,0,0,0,12,11h4.727l-6.295,6.867,1.516-4.551A1,1,0,0,0,11,12Z' />
								</svg>
								<p>Have Read</p>
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

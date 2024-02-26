import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingIcon from '../LoadingIcon/LoadingIcon'
import ModalWindow from '../ModalWindow/ModalWindow'
import Page from '../others/Page'
import styles from './ViewSingleBook.module.scss'

import clsx from 'clsx'
import DispatchContext from '../../context/DispatchContext'
import StateContext from '../../context/StateContext'

function ViewSingleBook(props) {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const { id } = useParams()
	const navigate = useNavigate()
	const { bookshelf_type } = useParams()
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(null)
	const [btnDisabled, setBtnDisabled] = useState(false)
	const [closeComponent, setCloseComponent] = useState(false)
	const [book, setBook] = useState({
		id: '',
		volumeInfo: {
			title: '',
			authors: [],
			description: '',
			imageLinks: {
				thumbnail: '',
			},
		},
	})

	const headers = {
		Authorization: `Bearer ${appState.token.value}`,
		'Content-Type': 'application/json',
	}

	const api_key = process.env.REACT_APP_API_KEY

	useEffect(() => {
		setIsLoading(true)
		const ourRequest = Axios.CancelToken.source()
		async function getData() {
			try {
				setIsLoading(true)
				const storedResults = localStorage.getItem(`view_sbResults_${id}`)
				if (storedResults) {
					setBook(JSON.parse(storedResults))
				} else {
					const response = await Axios.get(
						`https://www.googleapis.com/books/v1/volumes/${id}?key=${api_key}`,
						{ CancelToken: ourRequest.token }
					)
					setBook(response.data)
					localStorage.setItem(
						`view_sbResults_${id}`,
						JSON.stringify(response.data)
					)
					setIsLoading(false)
				}
			} catch (err) {
				console.log('Помилка запиту: ', err)
			}
		}

		getData()

		setIsLoading(null)

		return () => {
			ourRequest.cancel()
		}
	}, [id])

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

	async function deleteVolumeHandler() {
		try {
			setBtnDisabled(true)
			await Axios.post(
				`/mylibrary/bookshelves/${apiDestination}/removeVolume?volumeId=${id}&key=${api_key}`,
				{},
				{ headers }
			)
			setBtnDisabled(false)
			appDispatch({
				type: 'flashMessages',
				value: 'Book is successfully removed from that bookshelf.',
				style: 'success',
			})
			navigate(`/bookshelves/${bookshelf_type}`)
			console.log('Успішно!')
		} catch (err) {
			console.log('Виникла помилка: ' + err)
			appDispatch({
				type: 'flashMessages',
				value: 'Something went wrong.',
				style: 'danger',
			})
		}
	}

	useEffect(() => {
		const body = document.querySelector('body')
		body.style.overflowY = 'hidden'

		return () => (body.style.overflowY = 'auto')
	}, [])

	const openModal = () => {
		setModalIsOpen(true)
	}
	const closeModal = () => {
		setModalIsOpen(false)
	}
	const closeVsbComponent = () => {
		setCloseComponent(true)
		setTimeout(() => navigate(-1), 500)
	}

	return (
		<Page title={book.volumeInfo.title}>
			{modalIsOpen ? <ModalWindow closeModal={closeModal} /> : ''}
			{isLoading && <LoadingIcon />}
			{!isLoading && (
				<div className={clsx(styles.body, closeComponent && styles.close)}>
					{props.bookshelves ? (
						<button
							onClick={deleteVolumeHandler}
							disabled={btnDisabled}
							className={clsx(styles.btn, btnDisabled && styles.btn_disabled)}
						>
							Delete from bookshelf
						</button>
					) : (
						''
					)}

					<div className={styles.book}>
						<div className={styles.top}>
							<div className={styles.go_back} onClick={closeVsbComponent}>
								<img src='/img/arrow-left.svg' alt='Go back' />
							</div>
							{book.volumeInfo.imageLinks?.thumbnail && (
								<img
									className={styles.image}
									src={book.volumeInfo.imageLinks?.thumbnail}
								/>
							)}
							{book.volumeInfo.imageLinks?.thumbnail == undefined && (
								<img
									className={styles.image}
									src='/img/default_big_image.png'
									alt="Book's thumbnail"
								/>
							)}
							{!props.bookshelves && book.volumeInfo.title && (
								<button className={styles.button} onClick={openModal}>
									Add to bookshelf
								</button>
							)}
						</div>
						<div className={styles.content}>
							<h2 className={styles.title}>{book.volumeInfo.title}</h2>
							<h3 className={styles.author}>{book.volumeInfo.authors}</h3>
							<p className={styles.description}>
								{book.volumeInfo.description}
							</p>
							<button className={styles.button__bottom} onClick={openModal}>
								Add to bookshelf
							</button>
						</div>
					</div>
				</div>
			)}
		</Page>
	)
}

export default ViewSingleBook

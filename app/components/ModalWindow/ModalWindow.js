import Axios from 'axios'
import clsx from 'clsx'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoadingIcon from '../LoadingIcon/LoadingIcon'
import styles from './ModalWindow.module.scss'
import cross from '/app/img/cross.svg'

import DispatchContext from '/app/context/DispatchContext'
import StateContext from '/app/context/StateContext'

function ModalWindow(props) {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const { id } = useParams()
	const [volumesCheck, setVolumesCheck] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [closeComponent, setCloseComponent] = useState(false)

	const headers = {
		Authorization: `Bearer ${appState.token.value}`,
		'Content-Type': 'application/json',
	}

	const shelfIdRef = useRef()
	const shelfNameRef = useRef()

	const ourRequest = Axios.CancelToken.source()

	async function addVolumeHandler(shelf_id, shelf_name) {
		shelfIdRef.current = shelf_id
		shelfNameRef.current = shelf_name

		try {
			const response = await Axios.get(
				`/mylibrary/bookshelves/${shelf_id}/volumes`,
				{ headers, CancelToken: ourRequest.token }
			)
			if (response.data.items != undefined) {
				console.log('Успішно')
				setVolumesCheck(response.data.items)
			} else {
				setIsLoading(true)
				await Axios.post(
					`/mylibrary/bookshelves/${shelf_id}/addVolume?volumeId=${id}`,
					{},
					{ headers, CancelToken: ourRequest.token }
				)
				setIsLoading(false)
				appDispatch({
					type: 'flashMessages',
					value: `Book is successfully added to '${shelf_name}.'`,
					style: 'success',
				})
				props.closeModal()
				setCloseComponent(true)
			}
		} catch (err) {
			console.log('Виникла помилка: ' + err)
			props.closeModal()
			appDispatch({
				type: 'flashMessages',
				value: 'Something went wrong.',
				style: 'danger',
			})
		}
	}

	async function checkVolumesHandler() {
		const shelf_id = shelfIdRef.current
		const shelf_name = shelfNameRef.current
		console.log('Успішно 2')
		const check = volumesCheck.find(item => item.id == id)
		console.log(check)
		if (check) {
			appDispatch({
				type: 'flashMessages',
				value: `You already have that book on ${shelf_name} bookshelf`,
				style: 'warning',
			})
		} else {
			setIsLoading(true)
			await Axios.post(
				`/mylibrary/bookshelves/${shelf_id}/addVolume?volumeId=${id}`,
				{},
				{ headers, CancelToken: ourRequest.token }
			)
			setIsLoading(false)

			appDispatch({
				type: 'flashMessages',
				value: `Book is successfully added to ${shelf_name}.`,
				style: 'success',
			})
			props.closeModal()
			setCloseComponent(true)
		}
	}

	useEffect(() => {
		if (volumesCheck) {
			checkVolumesHandler()
		}

		return () => {
			ourRequest.cancel()
		}
	}, [volumesCheck])

	return (
		<div className={styles.overlay}>
			{isLoading && <LoadingIcon modalWindow={true} />}
			{!isLoading && (
				<div className={clsx(styles.body, closeComponent && styles.close)}>
					<div className={styles.content}>
						<span
							className={styles.close_btn}
							onClick={() => {
								setCloseComponent(true)
								setTimeout(() => props.closeModal(), 400)
							}}
						>
							<img src={cross} alt='Close' />
						</span>
						<p className={styles.text}>Choose your bookshelf to add</p>
						<ul className={styles.list}>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('0', 'Favorites')
								}}
							>
								<button className={styles.button}>Favorites</button>
							</li>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('2', 'To Read')
								}}
							>
								<button className={styles.button}>To Read</button>
							</li>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('3', 'Reading Now')
								}}
							>
								<button className={styles.button}>Reading Now</button>
							</li>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('4', 'Have Read')
								}}
							>
								<button className={styles.button}>Have Read</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

export default ModalWindow

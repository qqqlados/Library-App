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
	const [active, setActive] = useState({
		favorites: 0,
		'to-read': 0,
		'reading-now': 0,
		'have-read': 0,
	})

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
		const check = volumesCheck.find(item => item.id == id)
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
								<button
									className={clsx(
										styles.button,
										active['favorites'] && styles.active
									)}
									disabled={active['favorites']}
									onClick={() =>
										setActive(() => ({
											['favorites']: 1,
										}))
									}
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
								</button>
							</li>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('2', 'To Read')
								}}
							>
								<button
									className={clsx(
										styles.button,
										active['to-read'] && styles.active
									)}
									disabled={active['to-read']}
									onClick={() =>
										setActive(() => ({
											['to-read']: 1,
										}))
									}
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
								</button>
							</li>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('3', 'Reading Now')
								}}
							>
								<button
									className={clsx(
										styles.button,
										active['reading-now'] && styles.active
									)}
									disabled={active['reading-now']}
									onClick={() =>
										setActive(() => ({
											['reading-now']: 1,
										}))
									}
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
								</button>
							</li>
							<li
								className={styles.item}
								onClick={() => {
									addVolumeHandler('4', 'Have Read')
								}}
							>
								<button
									className={clsx(
										styles.button,
										active['have-read'] && styles.active
									)}
									disabled={active['have-read']}
									onClick={() =>
										setActive(() => ({
											['have-read']: 1,
										}))
									}
								>
									<svg
										fill='#fff'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path d='M7.493,22.862a1,1,0,0,0,1.244-.186l11-12A1,1,0,0,0,19,9H13.133l.859-6.876a1,1,0,0,0-1.8-.712l-8,11A1,1,0,0,0,5,14H9.612l-2.56,7.684A1,1,0,0,0,7.493,22.862ZM6.964,12l4.562-6.273-.518,4.149A1,1,0,0,0,12,11h4.727l-6.295,6.867,1.516-4.551A1,1,0,0,0,11,12Z' />
									</svg>
									<p>Have Read</p>
								</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

export default ModalWindow

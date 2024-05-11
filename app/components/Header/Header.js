import clsx from 'clsx'
import React, { useContext, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'
import close_btn from '/app/img/close-with-bg.svg'
import logo from '/app/img/logo.png'

import DispatchContext from '/app/context/DispatchContext'
import StateContext from '/app/context/StateContext'

function Header() {
	const location = useLocation()
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const navigate = useNavigate()
	const closeBurgerMenu = useRef(null)
	const navActive = document.querySelector('.nav__active')

	const navLinkHandler = event => {
		if (location.pathname === '/') {
			event.preventDefault()
			appDispatch({
				type: 'flashMessages',
				value: 'Type a search query so link is activated.',
				style: 'warning',
			})
		}
		if (location.pathname.startsWith('/bookshelves')) {
			if (!appState.searchValue.value) {
				event.preventDefault()
				appDispatch({
					type: 'flashMessages',
					value: 'Tap on the logo icon to go home to search a books.',
					style: 'warning',
				})
			}
		}
		if (location.pathname.startsWith('/search')) {
			event.preventDefault()
			appDispatch({
				type: 'flashMessages',
				value: 'You are already on search tab.',
				style: 'success',
			})
		}

		if (navActive) {
			appDispatch({ type: 'burgerMenuClosed' })
		}
	}

	return (
		<header className={`${styles.header} ${styles.wrapper}`}>
			<Link
				to='/'
				className={styles.logo}
				onClick={e => {
					if (location.pathname.startsWith('/search')) {
						e.preventDefault()
						appDispatch({
							type: 'flashMessages',
							value: 'You are already on search tab.',
							style: 'warning',
						})
					}
				}}
			>
				<img className={styles.img} src={logo} alt='' />
			</Link>
			<nav className={clsx(styles.nav, appState.burgerMenu && styles.nav__active)}>
				<ul className={clsx(styles.list, appState.burgerMenu && styles.list__active)}>
					<li className={styles.item}>
						<NavLink
							to={`/search/${appState.searchValue.value}`}
							className={clsx(
								styles.link,
								location.pathname.startsWith('/search/') && styles.active
							)}
							onClick={navLinkHandler}
						>
							Search
						</NavLink>
					</li>
					<li className={styles.item}>
						<NavLink
							to='/bookshelves'
							className={clsx(
								styles.link,
								location.pathname.startsWith('/bookshelves') && styles.active
							)}
							onClick={() => {
								if (navActive) {
									appDispatch({ type: 'burgerMenuClosed' })
								}
								navigate('/bookshelves')
							}}
						>
							My Bookshelves
						</NavLink>
					</li>
				</ul>
			</nav>
			{!appState.burgerMenu ? (
				<button
					onClick={() => appDispatch({ type: 'burgerMenuActive' })}
					className={clsx(styles.burger_menu, appState.burgerMenu && styles.burger_menu__active)}
					ref={closeBurgerMenu}
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
			) : (
				appState.burgerMenu && (
					<button
						className={styles.burger_menu__active}
						onClick={() => appDispatch({ type: 'burgerMenuClosed' })}
					>
						<img src={close_btn} />
					</button>
				)
			)}
		</header>
	)
}

export default Header

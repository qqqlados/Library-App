import clsx from 'clsx'
import React, { useContext } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'
import logo from '/app/img/logo.png'

import DispatchContext from '/app/context/DispatchContext'
import StateContext from '/app/context/StateContext'

function Header() {
	const location = useLocation()
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const navigate = useNavigate()

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
		appDispatch({ type: 'toggleBurgerMenu' })
	}

	const handleLogout = () => {
		appDispatch({ type: 'logout' })
		appDispatch({
			type: 'flashMessages',
			value: 'Log out successful.',
			style: 'success',
		})
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
			<nav
				className={clsx(styles.nav, appState.burgerMenu && styles.nav__active)}
			>
				<ul
					className={clsx(
						styles.list,
						appState.burgerMenu && styles.list__active
					)}
				>
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
							onClick={() => appDispatch({ type: 'toggleBurgerMenu' })}
						>
							My Bookshelves
						</NavLink>
					</li>
				</ul>
			</nav>
			<button
				onClick={() => appDispatch({ type: 'toggleBurgerMenu' })}
				className={clsx(
					styles.burger_menu,
					appState.burgerMenu && styles.burger_menu__active
				)}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>
		</header>
	)
}

export default Header

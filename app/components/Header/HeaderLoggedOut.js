import React from 'react'
import styles from './HLO.module.scss'
import '/app/global.scss'
import logo from '/app/img/logo.jpg'

function HeaderLoggedOut() {
	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<img className={styles.img} src={logo} alt='' />
			</div>
			<div className={styles.text}>Welcome to our service</div>
		</header>
	)
}

export default HeaderLoggedOut

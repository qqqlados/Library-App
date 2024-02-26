import React from 'react'
import styles from './HLO.module.scss'
import '/app/global.scss'

function HeaderLoggedOut() {
	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<img className={styles.img} src='/img/logo.png' alt='' />
			</div>
			<div className={styles.text}>Welcome to our service</div>
		</header>
	)
}

export default HeaderLoggedOut

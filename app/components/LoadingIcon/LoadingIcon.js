import clsx from 'clsx'
import React from 'react'
import styles from './LoadingIcon.module.scss'

function LoadingIcon(props) {
	return (
		<>
			<div
				className={clsx(
					styles.overlay,
					props.modalWindow && styles.dark_overlay
				)}
			>
				<div className={styles.spinner}>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</>
	)
}

export default LoadingIcon

import clsx from 'clsx'
import React, { useContext } from 'react'
import styles from './FlashMessages.module.scss'

import StateContext from '/app/context/StateContext'

function FlashMessages(props) {
	const appState = useContext(StateContext)

	return (
		<>
			<div className={styles.container}>
				{props.messages.map((msg, index) => {
					return (
						<div
							key={index}
							className={clsx(
								styles.body,
								appState.flashMessages.style === 'success' && styles.success,
								appState.flashMessages.style === 'warning' && styles.warning,
								appState.flashMessages.style === 'danger' && styles.danger
							)}
						>
							<p className={styles.text}>{msg}</p>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default FlashMessages

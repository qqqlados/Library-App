import { gapi } from 'gapi-script'
import React, { useContext, useEffect } from 'react'
import { GoogleLogin } from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import Page from '../others/Page'
import styles from './LoginPage.module.scss'
import DispatchContext from '/app/context/DispatchContext'

function LoginPage() {
	const appDispatch = useContext(DispatchContext)
	const navigate = useNavigate()

	useEffect(() => {
		gapi.load('client:auth2', () => {
			gapi.auth2.init({
				clientId: clientId,
				scope: 'https://www.googleapis.com/auth/books',
			})
		})
	}, [])

	const responseGoogleSuccess = response => {
		console.log('Успішний вхід:', response)
		appDispatch({ type: 'login', value: response.accessToken })
		appDispatch({
			type: 'flashMessages',
			value: 'Login successfull',
			style: 'success',
		})
		navigate('/')
	}

	const responseGoogleFailure = error => {
		console.error('Помилка входу:', error)
	}

	const clientId = process.env.REACT_APP_CLIENT_ID

	return (
		<Page title='Login'>
			<div className={styles.page}>
				<img src='/img/login_poster.png' alt='' />
				<div className={styles.button}>
					<GoogleLogin
						clientId={clientId}
						buttonText='Sign up with Google'
						onSuccess={responseGoogleSuccess}
						onFailure={responseGoogleFailure}
						cookiePolicy={'single_host_origin'}
					/>
				</div>
			</div>
		</Page>
	)
}

export default LoginPage

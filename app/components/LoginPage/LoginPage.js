import { useGoogleLogin } from '@react-oauth/google'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../others/Page'
import styles from './LoginPage.module.scss'
import DispatchContext from '/app/context/DispatchContext'
import login_poster from '/app/img/login_poster.png'

function LoginPage() {
	const appDispatch = useContext(DispatchContext)
	const navigate = useNavigate()

	const login = useGoogleLogin({
		onSuccess: codeResponse => {
			appDispatch({ type: 'login', value: codeResponse.access_token })
			appDispatch({
				type: 'flashMessages',
				value: 'Login successfull',
				style: 'success',
			})
			navigate('/')
			console.log(codeResponse)
		},
		onError: error => console.log('Login failed ', error),
	})

	return (
		<Page title='Login'>
			<div className={styles.page}>
				<img src={login_poster} alt='' />
				<div className={styles.button}>
					<button onClick={login}>Enter</button>
				</div>
			</div>
		</Page>
	)
}

export default LoginPage

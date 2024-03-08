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
		scope:
			'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/books',
		onError: error => console.log('Login failed ', error),
	})

	// const handleCallbackResponse = response => {
	// 	let userObject = jwtDecode(response.credential)
	// 	console.log(userObject)
	// }

	// useEffect(() => {
	// 	function start() {
	// 		google.accounts.id.initialize({
	// 			client_id:
	// 				'735970935627-muo2a4tgonv076hsvc96bbl1jnscajnr.apps.googleusercontent.com',
	// 			callback: handleCallbackResponse,
	// 		})
	// 		google.accounts.id.prompt()
	// 		// google.accounts.id.renderButton(document.getElementById('signInDiv'), {
	// 		// 	theme: 'outline',
	// 		// 	size: 'large',
	// 		// })
	// 	}
	// 	start()
	// }, [])

	// function oauthSignIn() {
	// 	let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'

	// 	let form = document.createElement('form')
	// 	form.setAttribute('method', 'GET')
	// 	form.setAttribute('action', oauth2Endpoint)

	// 	// Parameters to pass to OAuth 2.0 endpoint.
	// 	let params = {
	// 		client_id:
	// 			'735970935627-muo2a4tgonv076hsvc96bbl1jnscajnr.apps.googleusercontent.com',
	// 		redirect_uri: 'http://localhost:3000',
	// 		response_type: 'token',
	// 		scope: 'https://www.googleapis.com/auth/books',
	// 		include_granted_scopes: 'true',
	// 		state: 'pass-through value',
	// 	}

	// 	for (let p in params) {
	// 		let input = document.createElement('input')
	// 		input.setAttribute('type', 'hidden')
	// 		input.setAttribute('name', p)
	// 		input.setAttribute('value', params[p])
	// 		form.appendChild(input)
	// 	}

	// 	document.body.appendChild(form)
	// 	form.submit()
	// }

	// var currentUrl = window.location.href

	// function getParameterByName(name, url) {
	// 	if (!url) url = window.location.href
	// 	name = name.replace(/[\[\]]/g, '\\$&')
	// 	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	// 		results = regex.exec(url)
	// 	if (!results) return null
	// 	if (!results[2]) return ''
	// 	return decodeURIComponent(results[2].replace(/\+/g, ' '))
	// }

	// var accessToken = getParameterByName('access_token', currentUrl)

	// if (accessToken) {
	// 	var startIndex = currentUrl.indexOf('access_token') + 13
	// 	var substring = currentUrl.substring(startIndex)
	// 	var trimmedSubstring = substring.substring(0, 216)

	// 	console.log('Access token:', trimmedSubstring)
	// 	appDispatch({ type: 'login', value: trimmedSubstring })
	// 	appDispatch({
	// 		type: 'flashMessages',
	// 		value: 'Login successfull',
	// 		style: 'success',
	// 	})
	// 	navigate('/')
	// }

	// const headers = {
	// 	Authorization: `Bearer`,
	// 	'Content-Type': 'application/json',
	// }

	// let params = {
	// 	client_id:
	// 		'735970935627-muo2a4tgonv076hsvc96bbl1jnscajnr.apps.googleusercontent.com',
	// 	redirect_uri: 'http://localhost:3000',
	// 	response_type: 'token',
	// 	scope: 'https://www.googleapis.com/auth/books',
	// 	include_granted_scopes: 'true',
	// 	state: 'pass-through value',
	// }

	// const googleLogin = useGoogleLogin({
	// 	flow: 'auth-code',
	// 	onSuccess: async codeResponse => {
	// 		console.log(codeResponse)
	// 		const tokens = await axios.post(
	// 			'https://accounts.google.com/o/oauth2/v2/auth',
	// 			{ code: codeResponse.code },
	// 			{ params }
	// 		)

	// 		console.log(tokens)
	// 		appDispatch({ type: 'login', value: tokens })
	// 	},
	// 	onError: errorResponse => console.log(errorResponse),
	// })

	// const login = useGoogleLogin({
	// 	onSuccess: codeResponse => console.log(codeResponse),
	// 	flow: 'auth-code',
	// })

	return (
		<Page title='Login'>
			<div className={styles.page}>
				<img src={login_poster} alt='' />
				<div className={styles.button}>
					<button onClick={login}>Enter</button>
				</div>
				{/* <GoogleLogin
					onSuccess={credentialResponse => {
						console.log(credentialResponse)
					}}
					onError={() => {
						console.log('Login Failed')
					}}
				/> */}
				;
				{/* <div
					id='g_id_onload'
					data-client_id='735970935627-muo2a4tgonv076hsvc96bbl1jnscajnr.apps.googleusercontent.com'
					data-callback='oauthSignIn'
				></div>
				<div class='g_id_signin' data-type='standard'></div> */}
			</div>
		</Page>
	)
}

export default LoginPage

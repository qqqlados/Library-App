import React, { useEffect } from 'react'
import Container from '../others/Container'

function Page(props) {
	useEffect(() => {
		document.title = `${props.title} | LibraryApp`
		window.scrollTo(0, 0)
	}, [props.title])

	return <Container>{props.children}</Container>
}

export default Page

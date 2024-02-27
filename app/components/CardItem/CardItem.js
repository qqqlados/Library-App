import React from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './CardItem.module.scss'
import default_image from '/app/img/default_image.jpg'

function CardItem(props) {
	const id = props.id
	const { searchValue } = useParams()
	const { bookshelf_type } = useParams()

	return (
		<>
			<div className={styles.item}>
				<Link
					to={
						props.bookshelves
							? `/bookshelves/${bookshelf_type}/${id}`
							: `/search/${searchValue}/${id}`
					}
				>
					<div className={styles.body}>
						<div className={styles.top}>
							<img src={props.image || default_image} />
						</div>
						<div className={styles.content}>
							<div className={styles.title}>
								<p>{props.title}</p>
							</div>
							<div className={styles.author}>
								<p>{props.author}</p>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</>
	)
}

export default CardItem

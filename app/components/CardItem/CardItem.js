import React from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './CardItem.module.scss'

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
							<img src={props.image || '/img/default_image.jpg'} />
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
			{/* <div className='card_item'>
				<a href='#'>
					<div className='card_item__body'>
						<div className='card_item__top'>
							<img src='/img/default-image.jpg' alt='' />
						</div>
						<div className='card_item__content'>
							<div className='card_item__title'>
								<p>
									Lorem ipsum lorem Lorem ipsum lorem Lorem ipsum lorem Lorem
									ipsum lorem
								</p>
							</div>
							<div className='card_item__author'>
								<p>Jack London</p>
							</div>
						</div>
					</div>
				</a>
			</div> */}
		</>
	)
}

export default CardItem

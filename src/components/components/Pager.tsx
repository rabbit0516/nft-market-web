import React from 'react'
import './pager.scss'

interface PagerProps {
	page:       number
	total:      number
	onChange:   (page: number) => void
}

const Pager = ({page, total, onChange}: PagerProps) => {
	const setPage = (page: number) => {
		if (page > total - 1) page = total - 1
		if (page < 0) page = 0
		onChange(page)
	}
	
	return (
		<div className='pager'>
			<button onClick={() => setPage(0)} disabled={total===0 || page===0}>
				First
			</button>
			<button onClick={() => setPage(page - 1)} disabled={total===0 || page===0}>
				<svg fill="currentColor" viewBox="0 0 320 512" height="10" width="10">
					<path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
				</svg>
			</button>
			<code className='gray d-center gap'>
				Page <span className='light'>{page + 1}</span> of {total || 1}
			</code>
			<button onClick={() => setPage(page + 1)} disabled={total===0 || page===total - 1}>
				<svg fill="currentColor" viewBox="0 0 320 512" height="10" width="10">
					<path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
				</svg>
			</button>
			<button onClick={() => setPage(total - 1)} disabled={total===0 || page===total - 1}>
				Last
			</button>
		</div>
	)
}

export default Pager
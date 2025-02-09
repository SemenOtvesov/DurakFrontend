import cardClick from './cardClick.ts'

let checkTap = false
let startX = 0; let startY = 0;
let dragName = ''; let dragNominal = '';
let initStyle = ''

let scrollHeight = Math.max(
	document.body.scrollHeight, document.documentElement.scrollHeight,
	document.body.offsetHeight, document.documentElement.offsetHeight,
	document.body.clientHeight, document.documentElement.clientHeight
);
let scrollWidth = Math.max(
	document.body.scrollWidth, document.documentElement.scrollWidth,
	document.body.offsetWidth, document.documentElement.offsetWidth,
	document.body.clientWidth, document.documentElement.clientWidth
);

export const cardDown = (e)=>{
	const card = e.target.closest('[data-name]')
	if(card && card.className.includes('Mov') && e.changedTouches){
		startX = e.changedTouches[0].pageX
		startY = e.changedTouches[0].pageY

		e.target.closest('[data-name]').querySelector('[data-side="back"]')?.classList.add('movReq')

		dragName = card.dataset.name
		dragNominal = card.dataset.nominal

		console.log(dragName, dragNominal)

		const cardStyle = card.getAttribute('style')
		initStyle = cardStyle
		
		checkTap = true
	}
}

let checkOneMove = true
export const cardMove = (e)=>{
	const cards = [...document.querySelectorAll('[data-name]')]

	console.log(dragName, dragNominal)
	if(checkTap && dragName != '' && dragNominal != ''){
		if(checkOneMove){
			const tableCrads = document.querySelectorAll('[data-name]')
			tableCrads.forEach(el=>{
				if(el.dataset.name != dragName || el.dataset.nominal != dragNominal){
					el.classList.add('pointerNone')
				}else{
					el.classList.add('moved')
				}
			})
			checkOneMove = false
		}
		const cardStyle = initStyle
	
		let xOffset = e.changedTouches[0].pageX - startX
		let yOffset = e.changedTouches[0].pageY - startY
		console.log(xOffset, yOffset)
	
		let splitStyle = cardStyle.split('calc(')
	
		const slice1 = splitStyle[1].slice(-3)
		splitStyle[1] = splitStyle[1].slice(0,-3) + ` ${`${xOffset}`.includes('-') ? '- '+Math.abs(xOffset) : '+ ' + xOffset}px` + slice1

		const split2 = splitStyle[2].split(')) rotate(-5deg);')
		splitStyle[2] = split2[0] + ` ${`${yOffset}`.includes('-') ? '- '+Math.abs(yOffset) : '+ ' + yOffset}px` + ')) rotate(-5deg);' + split2[1]
	
		// @ts-ignore: Unreachable code error
		splitStyle = splitStyle.join('calc(')
		

		// @ts-ignore: Unreachable code error
		const card = cards.find(item=>item.dataset.name == dragName && item.dataset.nominal == dragNominal && item.className.includes('Mov'))
		card?.setAttribute('style', splitStyle)
	}
}
export const cardUp = (game, setAnimatePosition, e)=>{
	const xMin = scrollWidth*0.2
	const xMax = scrollWidth*0.97
	
	const yMin = scrollHeight*0.33
	const yMax = scrollHeight*0.33 + scrollHeight / 2.7

	const cards = [...document.querySelectorAll('[data-name]')]
	// @ts-ignore: Unreachable code error
	const card = cards.find(item=>item.dataset.name == dragName && item.dataset.nominal == dragNominal && item.className.includes('Mov'))

	if(!card){
		clearAnimateDate(true)
		return
	}
	const name = card.dataset.name
	const value = card.dataset.nominal
	const refCard = {current: card}
	
	const userC = game.players.findIndex(el=>+el.id == +JSON.parse(localStorage.getItem('user') || '').id)
	if(e.changedTouches[0].pageX >= xMin && e.changedTouches[0].pageX <= xMax && e.changedTouches[0].pageY >= yMin && e.changedTouches[0].pageY <= yMax){
		if(userC != game.attackerIndex){
			setAnimatePosition({x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY})

			cardClick(e, setAnimatePosition, name, value, refCard, game, 'none', {name, value, ref: {current: e.target.closest('[data-name]')}}, 'movReq')
			e.target.closest('[data-name]').classList.add('pointerNone')

			setTimeout(()=>{
				let target: Element | undefined = undefined
				const change_cart = document.getElementById('change_cart')
				const items = change_cart?.querySelectorAll('[data-name]')
				items?.forEach(el=>{
					const elRect = el.getBoundingClientRect()

					if(elRect.left <= e.changedTouches[0].pageX && elRect.right >= e.changedTouches[0].pageX && elRect.top <= e.changedTouches[0].pageY && elRect.bottom >= e.changedTouches[0].pageY){
						// @ts-ignore: Unreachable code error
						target = el.querySelector('[data-side="onTable"]')
					}
				})
				if (target) { // Проверяем, есть ли элемент под заданными координатами
					// @ts-ignore: Unreachable code error
					target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
				}
				e.target.closest('[data-name]').setAttribute('style', initStyle)

				clearAnimateDate(true)
			}, 200)
			
		}else{
			setAnimatePosition({x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY})
			clearAnimateDate(false)

			cardClick({target: card.querySelector('[data-side="back"]')}, setAnimatePosition, name, value, refCard, game, ()=>{
				setAnimatePosition({x: null, y: null})
				e.target.closest('[data-name]').setAttribute('style', initStyle)

				clearAnimateDate(true)
				// @ts-ignore: Unreachable code error
			}, {name, value, ref: {current: card}}, 'movReq')
		}
		
	}else{
		e.target.closest('[data-name]')?.setAttribute('style', initStyle)

		clearAnimateDate(true)
	}
}

function clearPointerNone(){
	const tableCrads = document.querySelectorAll('[data-name]')
	tableCrads.forEach(el=>{
		el.classList.remove('pointerNone')
		el.classList.remove('moved')
	})
	checkOneMove = true
}

function clearAnimateDate(type: boolean){
	const cards = [...document.querySelectorAll('[data-name]')]
	// @ts-ignore: Unreachable code error
	const card = cards.find(item=>item.dataset.name == dragName && item.dataset.nominal == dragNominal && item.className.includes('Mov'))

	if(type){
		initStyle = ''
	}
	
	startX = 0
	startY = 0
	dragName = ''
	dragNominal = ''
	checkTap = false

	card?.querySelector('[data-side="back"]')?.classList.remove('movReq')

	clearPointerNone()
}
import sendWalking from "../../../responce/sendWalking.ts"
import { animateVibrateCard } from "../../../utils/animationUtils"

type TlastCardActive = {name:string,value: string,ref:React.MutableRefObject<HTMLElement> | null}
let lastCardActive:TlastCardActive = { 
	name: '', value: '', ref: null,
}
let globErrFn: null | (()=>void) = null
function cardClick(e, name, value, refCard, game, dragErrFn, type: 'click' | 'table', defendCard?: TlastCardActive) {
	console.log(e, '\n', name,'\n', value,'\n', refCard,'\n', game, '\n',dragErrFn,'\n', defendCard,'\n')
	if(dragErrFn){
		globErrFn = dragErrFn
	}
	if(defendCard){
		lastCardActive = defendCard
		return 
	}
	if (type == 'click') {
		const gameId = JSON.parse(localStorage.getItem('game_status') || '').gameId
		sendReqVarType(game, gameId, name, value, refCard, globErrFn)
	}else{
		if(e.target.dataset.side == 'onTable' && e.target.dataset.pointer != 'false'){
			const gameId = JSON.parse(localStorage.getItem('game_status') || '').gameId
	
			const attack = {name: lastCardActive.name, nominal: lastCardActive.value}
			const defend = {name, nominal: value}
	
			let lastCardOnTableCheck = false
			const cardsList = document.querySelectorAll(`[data-name='${attack.name}']`)
			if(cardsList){
				const element = [...cardsList].filter(el=>el.dataset.nominal == attack.nominal)
				if(element[0]){
					const dataSideEl = element[0].querySelector('[data-side=onTable]')
					if(dataSideEl){
						lastCardOnTableCheck = false
					}else{
						lastCardOnTableCheck = true
					}
				}else{
					lastCardOnTableCheck = false
				}
			}
			
	
			const checkOneCard = lastCardActive.name != undefined && lastCardActive.value != undefined
			if(checkOneCard){
				const timerTick = document.getElementById('timerTick')
				const enemyCheck = refCard.current.dataset.enemy != 'enemy'
				const beatenCheck = refCard.current.dataset.changeLock != 'True'
	
				if(timerTick && +timerTick.innerHTML > 2 && enemyCheck && beatenCheck && lastCardOnTableCheck){
					sendWalking(gameId, defend, attack, 'defend').then(res=>{
						const changeCart =  document.getElementById('change_cart')
						const cardAnim = [...document.querySelectorAll('[data-nominal]')].map((el:any)=>{
							if(+el.dataset.nominal == +lastCardActive.value && el.dataset.name == lastCardActive.name){return el}
						}).filter(el=>el!=undefined)[0]
			
						refCard.current.dataset.changeLock = 'True'
						if(changeCart && cardAnim){
							// animateMoveTo(
							// 	cardAnim,
							// 	changeCart,
							// 	+refCard.current.dataset.indexInTable,
							// 	'enemy'
							// )
						}
					}).catch(err=>{
						console.log('err1')
						if(globErrFn && globErrFn != 'none' && globErrFn != 'nonNone'){
							globErrFn()
							globErrFn = null
						}
						setTimeout(()=>{
							if(globErrFn != 'none'){
								// err.status == 400 && animateVibrateCard(lastRef.current)
								globErrFn = null
							}
						}, 300)
					})	
				}
	
				if(game.type == 'SHULLERS'  && !lastCardOnTableCheck){
					sendWalking(gameId, {name, nominal: value} ,{},'shulling')
					.then(res=>console.log(res))
					.catch(err=>console.log(err))
				}
			}
		}
	}
}

export default cardClick

function sendReqVarType(game, gameId, name, value, refCard, globErrFn){
	let attack: any = {name, nominal: value}
	let defend: any = {}
	let typeReq = 'attack'

	if(game.type == "PODKIDNOY"){
		const userId = JSON.parse(localStorage.getItem('user') || '').id
		const userIndex = game?.players.findIndex(el=> el.id == userId)

		if(game.attackerIndex != userIndex){
			attack = {name, nominal: value}
			defend = {}
			typeReq = 'addCard'
		}
	}
	if(game.type == "PEREVODNOY"){
		const userId = JSON.parse(localStorage.getItem('user') || '').id
		const userIndex = game?.players.findIndex(el=> el.id == userId)

		if(game.attackerIndex != userIndex){
			const attackMapCard = game.attackerCards.map(el=>value == el.nominal ? el : null).filter(el=>el!=null)[0] || {}
			attack = {name: attackMapCard.name, nominal: attackMapCard.nominal}
			defend = {name, nominal: value}
			typeReq = 'transfer'
		}
	}
	
	const timerTick = document.getElementById('timerTick')
	if(timerTick && +timerTick.innerHTML > 2){
		sendWalking(gameId, attack, defend, typeReq)
		.then(res=>{
			const changeCart =  document.getElementById('change_cart')
			if(refCard && refCard.current){
				refCard.current.dataset.changeLock = 'True'
			}
			
			if(changeCart){
				// animateMoveTo(
				// 	refCard.current,
				// 	changeCart,
				// 	res.data.attackerCards.length-1,
				// 	'change'
				// )
			}
		})
		.catch(err=>{
			console.log(err)
			console.log('err2')
			if(globErrFn && globErrFn != 'none' && globErrFn != 'nonNone'){
				globErrFn()
				globErrFn = null
			}
			setTimeout(()=>{
				if(globErrFn != 'none'){
					globErrFn = null
				}
			}, 300)
			
		})
	}
}
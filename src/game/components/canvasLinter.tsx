/* eslint-disable no-loop-func */
import React, { useEffect } from "react";
import { genAttackerCards, genEnemyCards } from "./tableCards/genCards.ts";

type Tprops = {
	game,
	getAnimatePosition,
	setAnimatePosition
}
let lastAttackerCardsFromMap: Array<{name: string, nominal: number, playerOwner: number}> = []
let lastDefenderCardsFromMap: Array<{name: string, nominal: number, playerOwner: number}> = []
const CanvasElement =  ({game, getAnimatePosition, setAnimatePosition}: Tprops)=>{

	useEffect(()=>{
		canvasAnimation(game, getAnimatePosition, setAnimatePosition)
	})

	return <></>
}

let attakerLocalCheckAnim = false; let attakerLocalCheckStange = false;
let defenderLocalCheckAnim = false; let defenderLocalCheckStange = false;


function canvasAnimation(game, getAnimatePosition, setAnimatePosition){
	const canvas: any = document.getElementById('mainCanvas')
	const copyCanvas: any = document.getElementById('copyCanvas')
	
	if(canvas){
		let scrollWidth = canvas.width
		let scrollHeight = canvas.height

		const cardsWidth = scrollWidth * 0.20
		const cardsHeigth = scrollWidth * 0.30

		const ctx = canvas.getContext('2d')
		const copyCtx = copyCanvas.getContext('2d')

		const userId = JSON.parse(localStorage.getItem('user') || '').id
		if(ctx){
			// const usersCards: Array<any> = []
			// game.players.forEach(el=>{
			// 	usersCards.push({id: el.id, cards: el.cards})
			// })

			// let checkRender = 0
			// function addCounterImage (){
			// 	checkRender++
			// }
			// usersCards.forEach(user=>{
			// 			if(user.id == userId){

			// 				// userCards
			// 				let refresh: boolean | 'narrowing' = true

			// 				if(user.cards.length > lastCountCard){
			// 					refresh = true
			// 				}else if(user.cards.length < lastCountCard){
			// 					refresh = 'narrowing'
			// 				}else{
			// 					refresh = false
			// 				}
			// 				const newCards = game.players.find(el=>el.id == userId).cards
			// 				lastArrayCard = newCards
			// 				lastCountCard = newCards.length


			// 				const elements = user.cards
			// 				elements.sort((p, n)=>{
			// 					return p.nominal > n.nominal ? 1 : -1
			// 				})
			// 				userCardsLocal = user.cards.map(el=>el.current)

							
			// 				// if(canvas && refresh == true){
			// 				// 	ctx.setTransform(1,0,0,1,0,0);
			// 				// 	ctx.clearRect(0, 0, canvas.width, canvas.height)

			// 				// 	elements.forEach((el, index)=>{
			// 				// 		const offsetItem = (canvas.width * 0.8 / (elements.length > 2 ? elements.length + 1 : elements.length + 2))
			// 				// 		// @ts-ignore: Unreachable code error
			// 				// 		const offsetX = offsetItem * index  + (canvas.width - (offsetItem * (elements.length-3) + (elements.length > 8 ?canvas.width * 0.08 : canvas.width*0.22) ))/2

			// 				// 		const img = new Image()
			// 				// 		img.onload = () => {
			// 				// 			if(checkRender == index){
			// 				// 				renderImage(ctx, offsetX, img, scrollHeight, scrollWidth, true, addCounterImage)
			// 				// 			}else{
			// 				// 				const interval = setInterval(()=>{
			// 				// 					if(checkRender == index){
			// 				// 						renderImage(ctx, offsetX, img, scrollHeight, scrollWidth, true, addCounterImage)
			// 				// 						clearInterval(interval)
			// 				// 					}
			// 				// 				}, 50)
			// 				// 			}
										
			// 				// 		}
								
			// 				// 		img.src = `/res/game/svg/${el.name[0].toLowerCase()}${el.nominal}.svg`; 
			// 				// 	})
			// 				// }else if(canvas && refresh == 'narrowing'){
			// 				// 		ctx.setTransform(1,0,0,1,0,0);
			// 				// 		ctx.clearRect(0, 0, canvas.width, canvas.height)
			// 				// 		const timer = 300

			// 				// 		elements.forEach((el: { name: string[]; nominal: any; }, index: number)=>{
										
			// 				// 			for (let i = 30; i > 0; i--) {
			// 				// 				const lngth = elements.length + (0.03 * i)
			// 				// 				const offsetItem = (canvas.width * 0.8 / (lngth > 2 ? lngth + 1 : lngth + 2))
			// 				// 				// @ts-ignore: Unreachable code error
			// 				// 				const offsetX = offsetItem * index  + (canvas.width - (offsetItem * (lngth-3) + (lngth > 8 ?canvas.width * 0.08 : canvas.width*0.22) ))/2

			// 				// 				console.log(i, offsetX, el)

			// 				// 				setTimeout(()=>{
			// 				// 					const img = new Image()
			// 				// 					img.onload = () => {
			// 				// 						if(checkRender == index){
			// 				// 							renderImage(ctx, offsetX, img, scrollHeight, scrollWidth, true, addCounterImage)
			// 				// 						}else{
			// 				// 							const interval = setInterval(()=>{
			// 				// 								if(checkRender == index){
			// 				// 									renderImage(ctx, offsetX, img, scrollHeight, scrollWidth, true, addCounterImage)
			// 				// 									clearInterval(interval)
			// 				// 								}
			// 				// 								if(checkRender == elements.length){
			// 				// 									checkRender = 0
			// 				// 								}
			// 				// 							}, 50)
			// 				// 						}
			// 				// 					}
										
			// 				// 					img.src = `/res/game/svg/${el.name[0].toLowerCase()}${el.nominal}.svg`; 
			// 				// 			}, timer*i)
										
			// 				// 		}
			// 				// 		})
			// 				// 	}
			// 				// deck

			// 				// const trumpCard = game.trumpCard
			// 				// let trumpCheck = false
			// 				// if (trumpCard) {
			// 				// 	game.deck.forEach(el=>{
			// 				// 		if (trumpCard.name == el.name && trumpCard.nominal == el.nominal) {
			// 				// 			trumpCheck = true
			// 				// 		}
			// 				// 	})
			// 				// }
			// 				// if(trumpCheck){
			// 				// 	const img = new Image()
			// 				// 	img.onload = () => {
			// 				// 		renderImage(ctx, 0, img, scrollHeight, scrollWidth, true, ()=>{}, 90, scrollWidth * 0.25/ 3,scrollHeight/2)
			// 				// 	}
					
			// 				// 	img.src = `/res/game/svg/${trumpCard.name[0].toLowerCase()}${trumpCard.nominal}.svg`; 
			// 				// }

			// 				// if(game.deck.length > 0 && !(game.deck.length == 1 && trumpCheck)){
								
			// 				// 	const img = new Image()
			// 				// 	img.onload = () => {
			// 				// 		renderImage(ctx, 0, img, scrollHeight, scrollWidth, true, ()=>{}, 0, scrollWidth * 0.25 /3, scrollHeight/2)
			// 				// 	}
					
			// 				// 	img.src = `/res/game/cardBack.svg`; 
			// 				// }
			// 			}
			// 		})
			// 	}
			// }

			if(game.attackerCardsFromMap.length == 0){
				ctx.setTransform(1,0,0,1,0,0);
				ctx.clearRect(0, 0, canvas.width, canvas.height)
			}
			// else{
			// 	ctx.setTransform(1,0,0,1,0,0);
			// 	ctx.clearRect(canvas.width*0.2, canvas.height*0.33, canvas.width * 0.77, canvas.height/2.7)
			// }

			//attacerCards
			if(game.attackerCardsFromMap[0]){
				const attackerCards = game.attackerCardsFromMap ? genAttackerCards(game.attackerCardsFromMap) : []

				attackerCards.forEach((defCard, i)=>{
					const cardPosMax = 0.58

					const check = lastAttackerCardsFromMap.find(el=>el.name == defCard.name && el.nominal == defCard.nominal) 
					if(!check){
						lastAttackerCardsFromMap.push(defCard)
						const img = new Image()
						img.onload = () => {
							СopyCanvas(canvas, copyCtx)
							
							const startAnimatePosition = getAnimatePosition()
							let quantityStep = Math.floor(scrollHeight * 0.8 - scrollHeight * cardPosMax)

							if(defCard.playerOwner != userId){
								quantityStep = Math.floor(scrollHeight * cardPosMax)
							}

							let setetValue = 10

							for (let ind = quantityStep; ind >= 0; ind-= setetValue) {
								setTimeout(()=>{
									const x = scrollWidth * 0.50 -
										(attackerCards.length > 0 ? scrollWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
										cardsWidth * (i % 3) + 20 * (i % 3)

									const y = scrollHeight*(defCard.playerOwner != userId ? 0 : 0.8)-60 + 
										scrollWidth * 0.34/2 - 
										(Math.floor(i / 3) * 10 + 
										Math.floor(i / 3) * cardsHeigth) + 
										(defCard.playerOwner != userId ? (quantityStep-ind) : - (ind < setetValue ? quantityStep : (quantityStep - ind))) 

									const maxY = scrollHeight*cardPosMax-60 + 
										scrollWidth * 0.34/2 - 
										(Math.floor(i / 3) * 10 + 
										Math.floor(i / 3) * cardsHeigth)

									let stepX: number | null = null
									let stepY: number | null = null

									console.log((quantityStep/setetValue), 'step')
									if(startAnimatePosition.x != null){
										const offsetX = startAnimatePosition.x - x
										stepX = offsetX / Math.ceil((quantityStep/setetValue))
									}
									if(startAnimatePosition.y != null){
										const offsetX = maxY - startAnimatePosition.y
										stepY = offsetX / Math.ceil((quantityStep/setetValue))
									}

									renderImage(
										ctx, 
										0, 
										img, 
										scrollHeight, 
										scrollWidth, 
										true, 
										cardsWidth, cardsHeigth,
										undefined, 
										0,
										stepX ? x + stepX * (ind / setetValue ) :x,
										stepY ? maxY - stepY * ( ind / setetValue ) :y
									)
									
									console.log(startAnimatePosition, 'attakPos', stepX, 'x', stepY, 'y')
									if(defCard.playerOwner == userId){
									if(stepX != null && stepY != null){
										if(stepX >= 0 && stepY >= 0){
											ctx.clearRect(
												-cardsWidth/2- 2 + Math.abs(stepX),
												-cardsHeigth/2 -  Math.abs(stepY) - 2,
												cardsWidth + 4, 
												Math.abs(stepY) + 2
											);
											ctx.clearRect(
												cardsWidth/2,
												-cardsHeigth/2 - Math.abs(stepY) - 2,
												Math.abs(stepX) + 2,
												cardsHeigth+4
											);

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												-cardsWidth/2- 2 + Math.abs(stepX),
												-cardsHeigth/2 -  Math.abs(stepY) - 2,
												cardsWidth + 4, 
												Math.abs(stepY) + 2
											)

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												cardsWidth/2,
												-cardsHeigth/2 - Math.abs(stepY) - 2,
												Math.abs(stepX) + 2,
												cardsHeigth+4
											)
										}

										if(stepX <= 0 && stepY <= 0){
											ctx.clearRect(
												-cardsWidth/2 - Math.abs(stepX),
												cardsHeigth/2 -  Math.abs(stepY) + 3,
												cardsWidth + 4 +Math.abs(stepX), 
												Math.abs(stepY) + 3
											);
											ctx.clearRect(
												-cardsWidth/2 - 2 - Math.abs(stepX),
												-cardsHeigth/2 - Math.abs(stepY) + 2,
												Math.abs(stepX) + 2.1,
												cardsHeigth+4
											);

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												-cardsWidth/2 - Math.abs(stepX),
												cardsHeigth/2 -  Math.abs(stepY) + 3,
												cardsWidth + 4 +Math.abs(stepX), 
												Math.abs(stepY) + 3
											)

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												-cardsWidth/2 - 2 - Math.abs(stepX),
												-cardsHeigth/2 - Math.abs(stepY) + 2,
												Math.abs(stepX) + 2.1,
												cardsHeigth+4
											)
										}

										if(stepX <= 0 && stepY >= 0){
											ctx.clearRect(
												-cardsWidth/2 -2 - Math.abs(stepX),
												-cardsHeigth/2 - 4 - Math.abs(stepY),
												cardsWidth + 4 + Math.abs(stepX), 
												Math.abs(stepY) + 4
											);
											ctx.clearRect(
												-cardsWidth/2 -2 - Math.abs(stepX),
												-cardsHeigth/2 - Math.abs(stepY) - 2,
												Math.abs(stepX) + 2,
												cardsHeigth+2
											);

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												-cardsWidth/2 -2 - Math.abs(stepX),
												-cardsHeigth/2 - 4 - Math.abs(stepY),
												cardsWidth + 4 + Math.abs(stepX), 
												Math.abs(stepY) + 4
											)

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												-cardsWidth/2 -2 - Math.abs(stepY),
												-cardsHeigth/2 - Math.abs(stepY) - 2,
												Math.abs(stepY) + 2,
												cardsHeigth+4
											)
										}

										if(stepX >= 0 && stepY <= 0){
											ctx.clearRect(
												-cardsWidth/2 + Math.abs(stepX),
												cardsHeigth/2,
												cardsWidth + 4 + Math.abs(stepX), 
												Math.abs(stepY) + 4
											);
											ctx.clearRect(
												cardsWidth/2,
												-cardsHeigth/2 - Math.abs(stepY) + 2,
												Math.abs(stepX) + 2,
												cardsHeigth+4
											);

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												-cardsWidth/2 + Math.abs(stepX),
												cardsHeigth/2,
												cardsWidth + 4 + Math.abs(stepX), 
												Math.abs(stepY) + 4
											)

											GetDeleteArea(
												ctx, 
												copyCanvas, 
												cardsWidth/2,
												-cardsHeigth/2 - Math.abs(stepY) + 2,
												Math.abs(stepX) + 2,
												cardsHeigth+4
											)
										}
									}else{
										ctx.clearRect(
											-cardsWidth/2- 2,
											cardsHeigth/2 - 1,
											cardsWidth + 4, 
											setetValue + 3
										);
										
										if(y + cardsHeigth/2 - 1 < scrollHeight * 0.7){
											GetDeleteArea(
												ctx, 
												copyCanvas, 
												x -cardsWidth/2 - 2,
												y + cardsHeigth/2 - 1,  
												cardsWidth + 4,
												setetValue + 3,
											)
										}
										
									}}else{
										ctx.clearRect(
											-cardsWidth/2 - 2,
											-(cardsHeigth/2 + cardsHeigth*0.2),
											cardsWidth + 4, 
											cardsHeigth*0.2
										);
										if(y - (cardsHeigth/2 + cardsHeigth*0.2) < scrollHeight * 0.3){
											GetDeleteArea(
												ctx, 
												copyCanvas, 
												x - cardsWidth/2 - 2,
												y - (cardsHeigth/2 + cardsHeigth*0.2),
												cardsWidth + 4, 
												cardsHeigth*0.2,
											)
										}
									}
									
									
								}, 5 * (quantityStep-ind))
							}
							СopyCanvas(canvas, copyCtx)

							if(i == (attackerCards.length-1)){
								attakerLocalCheckAnim = true
							}
						}
			
						img.src = `/res/game/svg/${defCard.name[0].toLowerCase()}${defCard.nominal}.svg`; 
					}else{
						const img = new Image()
						img.onload = () => {
							СopyCanvas(canvas, copyCtx)

							const x = scrollWidth * 0.50 -
								(attackerCards.length > 0 ? scrollWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
								cardsWidth * (i % 3) + 20 * (i % 3)

							const y = scrollHeight*cardPosMax-60 + 
								scrollWidth * 0.34/2 - 
								(Math.floor(i / 3) * 10 + 
								Math.floor(i / 3) * cardsHeigth)

							renderImage(
								ctx, 
								0, 
								img, 
								scrollHeight, 
								scrollWidth, 
								true, 
								cardsWidth, cardsHeigth,
								undefined, 
								0, 
								x,
								y
							)

								ctx.clearRect(
									cardsWidth/2 - 1,
									-cardsHeigth/2 - 1,
									50, 
									cardsHeigth+2
								);
								ctx.clearRect(
									-cardsWidth/2 - 1,
									-(cardsHeigth/2 + 21),
									cardsWidth + 41, 
									21
								);
							СopyCanvas(canvas, copyCtx)

							if(i == (attackerCards.length-1)){
								attakerLocalCheckStange = true
							}
						}
			
						img.src = `/res/game/svg/${defCard.name[0].toLowerCase()}${defCard.nominal}.svg`; 
					}
				
					if(i == (attackerCards.length-1)){
						const interval = setInterval(()=>{
							if(attakerLocalCheckAnim && attakerLocalCheckStange){
								СopyCanvas(canvas, copyCtx)
								clearInterval(interval)
							}
						}, 10)
					}
				})
				
			}else{
				lastAttackerCardsFromMap = []
			}

			
			//defenderCards
			if(game.defenderCardsFromMap.length > 0 && game.attackerCardsFromMap[0]){
				const enemyCards = game.defenderCardsFromMap ? genEnemyCards(game.defenderCardsFromMap, game.attackerCardsFromMap):[]
				const attackerCards = game.attackerCardsFromMap ? genAttackerCards(game.attackerCardsFromMap) : []
				
				enemyCards.forEach((defCard, i)=>{
					let check: {} | undefined = undefined
						if(defCard != null){
							check = lastDefenderCardsFromMap.find(el=>{if(el != null){return el.name == defCard.name && el.nominal == defCard.nominal}}) 
						}
						
						let setetValue = 10
						const startAnimatePosition = getAnimatePosition()
								
						if(startAnimatePosition.x){
							setetValue = 5
						}

						if(!check){
							lastDefenderCardsFromMap.push(defCard)
							const img = new Image()

							img.onload = () => {
								СopyCanvas(canvas, copyCtx)
								const startAnimatePosition = getAnimatePosition()
								const cardPosMax = 0.56

								let quantityStep = Math.floor(scrollHeight * 0.8 - scrollHeight * cardPosMax)

								if(defCard.playerOwner != userId){
									quantityStep = Math.floor(scrollHeight * cardPosMax)
								}
							

								for (
									let ind = quantityStep; 
									ind >= 0; 
									ind -= setetValue
								) {
									const x = scrollWidth * 0.53 -
										(attackerCards.length > 0 ? scrollWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
										cardsWidth * (defCard.index % 3) + 20 * (defCard.index % 3)

									const y = scrollHeight*(defCard.playerOwner != userId ? 0 :cardPosMax) - 60  + scrollWidth * 0.34/2 - 
										(Math.floor(defCard.index / 3) * 10 + 
										Math.floor(defCard.index / 3) * cardsHeigth) + 0.01 *  scrollHeight + 
										(defCard.playerOwner != userId ? (quantityStep-ind) : ind) 

									const maxY = scrollHeight*cardPosMax-60 + 
									scrollWidth * 0.34/2 - 
									(Math.floor(defCard.index / 3) * 10 + 
									Math.floor(defCard.index / 3) * cardsHeigth) + 0.01 *  scrollHeight

									let stepX: number | null = null
									let stepY: number | null = null

									if(startAnimatePosition.x != null){
										const offsetX = startAnimatePosition.x - x
										stepX = offsetX / Math.ceil((quantityStep/setetValue))
									}
									if(startAnimatePosition.y != null){
										const offsetX = maxY - startAnimatePosition.y
										stepY = offsetX / Math.ceil((quantityStep/setetValue))
									}
									console.log(stepY, 'y')

									setTimeout(()=>{
										renderImage(
											ctx,
											0, 
											img, 
											scrollHeight, 
											scrollWidth, 
											true, 
											cardsWidth, cardsHeigth,
											undefined, 
											0, 
											stepX ? x + stepX * (ind / setetValue ) :x,
											stepY ? maxY - stepY * (ind / setetValue ) :y
										)

										if(defCard.playerOwner == userId){

											console.log(stepX, stepY, 'coord')
											if(stepX != null && stepY != null){
												if(stepX >= 0 && stepY >= 0){
													ctx.clearRect(
														-cardsWidth/2 + Math.abs(stepX),
														-cardsHeigth/2 -  Math.abs(stepY)-2,
														cardsWidth, 
														Math.abs(stepY) +2
													);
													ctx.clearRect(
														cardsWidth/2 - 2,
														-cardsHeigth/2 - Math.abs(stepY) ,
														Math.abs(stepX) + 2,
														cardsHeigth
													);

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x -cardsWidth/2 + Math.abs(stepX),
														y -cardsHeigth/2 -  Math.abs(stepY) ,
														cardsWidth , 
														Math.abs(stepY) 
													)

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x +cardsWidth/2,
														y -cardsHeigth/2 - Math.abs(stepY) ,
														Math.abs(stepX),
														cardsHeigth
													)
												}

												if(stepX <= 0 && stepY <= 0){
													ctx.clearRect(
														-cardsWidth/2 - Math.abs(stepX),
														cardsHeigth/2 -  Math.abs(stepY) + 3,
														cardsWidth + 4 +Math.abs(stepX), 
														Math.abs(stepY) + 3
													);
													ctx.clearRect(
														-cardsWidth/2 - 2 - Math.abs(stepX),
														-cardsHeigth/2 - Math.abs(stepY) + 2,
														Math.abs(stepX) + 2.1,
														cardsHeigth+4
													);

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x-cardsWidth/2 - Math.abs(stepX),
														maxY + cardsHeigth/2 -  Math.abs(stepY) + 2,
														cardsWidth + 4 +Math.abs(stepX), 
														Math.abs(stepY) + 8
													)

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x -cardsWidth/2 - 8 - Math.abs(stepX),
														maxY -cardsHeigth/2 - Math.abs(stepY) + 8,
														Math.abs(stepX) + 8,
														cardsHeigth+8
													)
												}

												if(stepX <= 0 && stepY >= 0){
													ctx.clearRect(
														-cardsWidth/2 -2 - Math.abs(stepX),
														-cardsHeigth/2 - 4 - Math.abs(stepY),
														cardsWidth + 4 + Math.abs(stepX), 
														Math.abs(stepY) + 4
													);
													ctx.clearRect(
														-cardsWidth/2 - 0.6 - Math.abs(stepX),
														-cardsHeigth/2 - Math.abs(stepY),
														Math.abs(stepX) + 0.6,
														cardsHeigth
													);

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x-cardsWidth/2 -4 - (Math.abs(stepX) * (ind / setetValue)),
														maxY-cardsHeigth/2 - 4- (Math.abs(stepY) * (ind / setetValue)),
														cardsWidth + 4 + Math.abs(stepX), 
														Math.abs(stepY) + 4
													)

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x-cardsWidth/2 -4 - (Math.abs(stepX) * (ind / setetValue)),
														maxY-cardsHeigth/2 - (Math.abs(stepY) * (ind / setetValue)) - 2,
														Math.abs(stepX) + 4,
														cardsHeigth + 2
													)
												}

												if(stepX >= 0 && stepY <= 0){
													ctx.clearRect(
														-cardsWidth/2 + Math.abs(stepX),
														cardsHeigth/2,
														cardsWidth + 4 + Math.abs(stepX), 
														Math.abs(stepY) + 4
													);
													ctx.clearRect(
														cardsWidth/2,
														-cardsHeigth/2 - Math.abs(stepY) + 2,
														Math.abs(stepX) + 2,
														cardsHeigth+4
													);

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x -cardsWidth/2 + Math.abs(stepX),
														y + cardsHeigth/2,
														cardsWidth + 4 + Math.abs(stepX), 
														Math.abs(stepY) + 8
													)

													GetDeleteArea(
														ctx, 
														copyCanvas, 
														x + cardsWidth/2,
														y -cardsHeigth/2 - Math.abs(stepY) + 2,
														Math.abs(stepX) + 2,
														cardsHeigth+4
													)
												}
											}else{
												ctx.clearRect(
													-cardsWidth/2- 1,
													cardsHeigth/2 -1,
													cardsWidth + 4, 
													scrollHeight*0.2
												);
												
												GetDeleteArea(
													ctx, 
													copyCanvas, 
													x -cardsWidth/2 - 2,
													y + cardsHeigth/2 - 1,
													cardsWidth + 4,
													scrollHeight*0.2,
												)
											}
										}else{
											ctx.clearRect(
												-cardsWidth/2 - 2,
												-(cardsHeigth/2 + cardsHeigth*0.2),
												cardsWidth + 4, 
												cardsHeigth*0.2
											);
											if(y - (cardsHeigth/2 + cardsHeigth*0.2) < scrollHeight * 0.3){
												GetDeleteArea(
													ctx, 
													copyCanvas, 
													x - cardsWidth/2 - 2,
													y - (cardsHeigth/2 + cardsHeigth*0.2),
													cardsWidth + 4, 
													cardsHeigth*0.2,
												)
											}
										}

										
									}, 5 * (quantityStep-ind))
								}

								if(i == (attackerCards.length-1)){
									defenderLocalCheckAnim = true
								}
							}
				
							if(defCard != null){
								img.src = `/res/game/svg/${defCard.name[0].toLowerCase()}${defCard.nominal}.svg`;
							}
						}else{
							const img = new Image()
							img.onload = () => {
								СopyCanvas(canvas, copyCtx)

								const x = scrollWidth * 0.53 -
										(attackerCards.length > 0 ? scrollWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
										cardsWidth * (defCard.index % 3) + 20 * (defCard.index % 3)

								const y = scrollHeight*0.56 - 60  + scrollWidth * 0.34/2 - 
									(Math.floor(defCard.index / 3) * 10 + 
									Math.floor(defCard.index / 3) * cardsHeigth) + 0.01 *  scrollHeight
								renderImage(
									ctx, 
									0, 
									img, 
									scrollHeight, 
									scrollWidth, 
									true, 
									cardsWidth, cardsHeigth,
									undefined, 
									0, 
									x,
									y
								)
								
								СopyCanvas(canvas, copyCtx)

								if(i == (attackerCards.length-1)){
									defenderLocalCheckStange = true
								}
							}
				
							img.src = `/res/game/svg/${defCard.name[0].toLowerCase()}${defCard.nominal}.svg`; 
						}
					
				})
			}else{
				lastDefenderCardsFromMap = []
			}

			const updateStartPosInterval = setInterval(()=>{
				// console.log(defenderLocalCheckAnim && defenderLocalCheckAnim)
				if((defenderLocalCheckAnim && defenderLocalCheckAnim) || game.defenderCardsFromMap.length || !game.defenderCardsFromMap.find(el=>el != null) ){
					setAnimatePosition({x: null, y: null})
					clearInterval(updateStartPosInterval)
				}
			}, 10)
	}
	}
}
export default CanvasElement

function renderImage(ctx, offsetX, img, scrollHeight, scrollWidth, orientationY : boolean, cardsWidth, cardsHeigth,  addCounterImage?: ()=>void, radius?: number, x?: number, y?: number){
	ctx.closePath()

	drawImage(
		ctx, 
		img, 
		x!= undefined?x:offsetX, 
		y!= undefined?y:scrollHeight - (scrollWidth * 0.375) * 0.8,
		1, 
		radius != undefined ? radius*Math.PI/180 :-5*Math.PI/180,
		orientationY ? cardsWidth: cardsHeigth,
		orientationY ? cardsHeigth: scrollWidth * 0.2
	)
	if(addCounterImage){
		addCounterImage()
	}
}

function drawImage(ctx, image, x, y, scale, rotation, imgW, imgH){
	ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
	ctx.rotate(rotation);
	ctx.drawImage(image, -imgW / 2, -imgH / 2, imgW, imgH);
} 


function СopyCanvas(canvas, copyCtx){
	copyCtx.setTransform(1,0,0,1,0,0);
	copyCtx.clearRect(0, 0, canvas.width, canvas.height)

	let dataURL = canvas.toDataURL();
	let image = new Image();
	image.onload = function() {
		copyCtx.drawImage(image, 0, 0);
	};
	image.src = dataURL;
}

function GetDeleteArea (ctx, copyCanvas, x, y, width, height){
	const croppedData = copyCanvas.toDataURL('image/png');

	getPartOfImage({x, y, width, height, src: croppedData}).then(res=>{
		if(res){
			const img = new Image()
			img.onload = () => {
				ctx.closePath()
				// copyCanvas.getContext('2d').fillRect(x, y, width, height)
				ctx.imageSmoothingEnabled = false;
				// ctx.imageSmoothingQuality = 'medium'; // 'low', 'medium', 'high'
				drawImage(ctx, img, x + width /2, y + height / 2, 1, 0, width, height)
			}
			img.src = res
		}
	})
} 

export async function getPartOfImage({x,y,width,height,src}): Promise<string | undefined> {
	if (width === 0 || height === 0) {
		return;
	}
	const image = new Image();

	return new Promise((resolve) => {
		image.src = src;
		image.crossOrigin = 'Anonymous';

		// remember that loading image is async
		image.addEventListener('load', () => {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			if (!context) {
				return;
			}

			canvas.width = width;
			canvas.height = height;
			context.drawImage(image, x, y, width, height, 0, 0, width, height);
			const croppedData = canvas.toDataURL('image/png');

			resolve(croppedData);
		});
	});
  }
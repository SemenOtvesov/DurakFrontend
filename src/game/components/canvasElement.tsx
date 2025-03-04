import React, { memo, useContext, useEffect, useRef } from 'react';
import { genAttackerCards, genEnemyCards } from './tableCards/genCards.ts';
import { Assets, Sprite } from 'pixi.js';
import { CanvasContext } from '../../App.js';
import cardClick from '../res/components/gameCard/cardClick.ts';

let dragCard = {x: null, y: null, name: null, value: null, rotation: null}

let cardInMap: Array<{uid, name, value}> = []
let localAttackersCard: any[] = []
let localDefenderCard: any[] = []

let globalGame = {}
let checkReqClick = true
let lockStart = true
let clicked = true
let stop2linter = true
let dragTarget = null;
let moovingLock = true

let dragStartCheck = true
let dragAllCheck = true

let canvasAppLocal = {}

const CanvasListener = memo(({game})=>{
	globalGame = game
	const stageItemsRef = useRef<Array<{sprite: any, name: string, nominal: number}>>([]);
	const CanvasApp: any = useContext(CanvasContext);
	canvasAppLocal = CanvasApp

	useEffect(()=>{
		lockStart = true
	}, [game]);

	(async ()=>{
		const userId = JSON.parse(localStorage.getItem('user') || '').id

		const attackerCards = game.attackerCardsFromMap ? genAttackerCards(game.attackerCardsFromMap) : []
		const enemyCards = game.defenderCardsFromMap ? genEnemyCards(game.defenderCardsFromMap, game.attackerCardsFromMap):[]

		const app = CanvasApp
		app.stage.rotation = 0.001

		const canvasWidth = CanvasApp.screen.width
		const canvasHeigth = CanvasApp.screen.height
		
		const cardWidth = CanvasApp.screen.width * 0.2
		const cardHeigth = CanvasApp.screen.width * 0.3

		//cardAttack from deck
		let newCard: {name: null | string, value: null | string, index: null | number, playerOwner: null | number} = {name: null, value: null, index: null, playerOwner: null}
		attackerCards.forEach((el, i)=>{
			const check = localAttackersCard.find(lc=>lc.name == el.name && lc.nominal == el.nominal)
			if(!check){
				newCard = {name: el.name, value: el.nominal, index: i, playerOwner: el.playerOwner}
			}
		})

		let newCardDef: {name: null | string, value: null | string, index: null | number, playerOwner: null | number} = {name: null, value: null, index: null, playerOwner: null}
		enemyCards.forEach((el, i)=>{
			const check = localDefenderCard.find(lc=>lc.name == el.name && lc.nominal == el.nominal)
			if(!check){
				newCardDef = {name: el.name, value: el.nominal, index: el.index, playerOwner: el.playerOwner}
			}
		})
		
		localAttackersCard = attackerCards

		const cardPosMax = 0.58
		if(newCard.name){
			if(newCard.playerOwner != userId){
				const texture = await Assets.load(`/res/game/png/${newCard.name[0].toLowerCase()}${newCard.value}.png`);
				texture.source.scaleMode = 'linear'
				texture.cacheAsBitmap = true
				
				CreateCard(
					canvasWidth / 2 - cardWidth / 2, 
					-cardHeigth, 
					newCard.name,
					newCard.value,
					texture,
					cardWidth, 
					cardHeigth,
					0
				);
			}
			const uid = cardInMap.find(el=>el.name == newCard.name && el.value == newCard.value)?.uid
			const uidDef = cardInMap.find(el=>el.name == newCardDef.name && el.value == newCardDef.value)?.uid

			const newChildren = [...app.stage.children]
			newChildren.forEach(el=>{
				if(el.uid != uid && el.uid != uidDef){
					el.destroy()
				}
			})
			const animateSprite = app.stage.children.find(el=>el.uid == uid)

			if(newCard.index != null){
				const x = canvasWidth * 0.50 -
					(attackerCards.length > 0 ? canvasWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
					cardWidth * (newCard.index % 3) + 20 * (newCard.index % 3)

				const y = canvasHeigth*cardPosMax-60 + 
					canvasWidth * 0.34/2 - 
					(Math.floor(newCard.index / 3) * 10 + 
					Math.floor(newCard.index / 3) * cardHeigth)

				moveSprite(animateSprite, x, y, 200, undefined, 0)
			}
		}else if(newCardDef.name){
			const uidDef = cardInMap.find(el=>el.name == newCardDef.name && el.value == newCardDef.value)?.uid

			const newChildren = [...app.stage.children]
			newChildren.forEach(el=>{
				if(el.uid != uidDef){
					el.destroy()
				}
			})
		}else{
			app.stage.removeChildren()
		}

		for (let i = 0; i < attackerCards.length; i++) {
			if(attackerCards[i].name != newCard.name || attackerCards[i].nominal != newCard.value){
				
				const x = canvasWidth * 0.50 -
				(attackerCards.length > 0 ? canvasWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
				cardWidth * (i % 3) + 20 * (i % 3)

				const y = canvasHeigth*cardPosMax-60 + 
					canvasWidth * 0.34/2 - 
					(Math.floor(i / 3) * 10 + 
					Math.floor(i / 3) * cardHeigth)
				
					//attackerCards[i].playerOwner != userId
				const texture = await Assets.load(`/res/game/png/${attackerCards[i].name[0].toLowerCase()}${attackerCards[i].nominal}.png`);
				texture.source.scaleMode = 'linear'
				texture.cacheAsBitmap = true
				CreateCard(
					x, 
					y, 
					attackerCards[i].name,
					attackerCards[i].nominal,
					texture,
					cardWidth, 
					cardHeigth,
					0
				);
			}
		}

		newCard = {name: null, value: null, index: null, playerOwner: null}

		//cardFromDeck defend
		
		localDefenderCard = enemyCards

		const cardPosMaxDef = 0.57
		if(newCardDef.name){
			if(newCardDef.playerOwner != userId){
				const texture = await Assets.load(`/res/game/png/${newCardDef.name[0].toLowerCase()}${newCardDef.value}.png`);
				texture.source.scaleMode = 'linear'
				texture.cacheAsBitmap = true
				CreateCard(
					canvasWidth / 2 - cardWidth / 2, 
					-cardHeigth, 
					newCardDef.name,
					newCardDef.value,
					texture,
					cardWidth, 
					cardHeigth,
					0
				);
			}
			const uid = cardInMap.find(el=>el.name == newCardDef.name && el.value == newCardDef.value)?.uid
			const animateSprite = app.stage.children.find(el=>el.uid == uid)

			if(newCardDef.index != null){
				const x = canvasWidth * 0.50 -
					(attackerCards.length > 0 ? canvasWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
					cardWidth * (newCardDef.index % 3) + 20 * (newCardDef.index % 3) + 10

				const y = canvasHeigth*cardPosMaxDef-60 + 
					canvasWidth * 0.34/2 - 
					(Math.floor(newCardDef.index / 3) * 10 + 
					Math.floor(newCardDef.index / 3) * cardHeigth)

					// @ts-ignore: Unreachable code error
					bringToFront(animateSprite)
				moveSprite(animateSprite, x, y, 200, undefined, 0)
			}
		}

		for (let i = 0; i < enemyCards.length; i++) {
			if(enemyCards[i].name != newCardDef.name || enemyCards[i].nominal != newCardDef.value){
				
				const x = canvasWidth * 0.50 -
				(attackerCards.length > 0 ? canvasWidth*0.05 * (attackerCards.length > 3 ? 3 : attackerCards.length) : 0) + 
				cardWidth * (enemyCards[i].index % 3) + 20 * (enemyCards[i].index % 3) + 10

				const y = canvasHeigth*cardPosMaxDef-60 + 
					canvasWidth * 0.34/2 - 
					(Math.floor(enemyCards[i].index / 3) * 10 + 
					Math.floor(enemyCards[i].index / 3) * cardHeigth)
				
					//enemyCards[i].playerOwner != userId
				const texture = await Assets.load(`/res/game/png/${enemyCards[i].name[0].toLowerCase()}${enemyCards[i].nominal}.png`);
				texture.source.scaleMode = 'linear'
				texture.cacheAsBitmap = true
			
				CreateCard(
					x, 
					y, 
					enemyCards[i].name,
					enemyCards[i].nominal,
					texture,
					cardWidth, 
					cardHeigth,
					0
				);
			}
		}


		cardInMap = []
		newCardDef = {name: null, value: null, index: null, playerOwner: null}

		// card for user
		const usersCard = setPositionCards(stageItemsRef.current, game)
		for (let i = 0; i < usersCard.length; i++) {
			const texture = await Assets.load(`/res/game/png/${usersCard[i].name[0].toLowerCase()}${usersCard[i].nominal}.png`);
			texture.source.scaleMode = 'linear'
			texture.cacheAsBitmap = true
			
			const offsetItem = (canvasWidth * 0.8 / (usersCard.length > 2 ? usersCard.length + 1 : usersCard.length + 2))
			// @ts-ignore: Unreachable code error
			const offsetX = offsetItem * i  + (canvasWidth - (offsetItem * (usersCard.length-3) + (usersCard.length > 8 ?canvasWidth * 0.08 : canvasWidth*0.22) ))/2 

			CreateCard(
				offsetX, 
				canvasHeigth * 0.87, 
				usersCard[i].name,
				usersCard[i].nominal,
				texture,
				cardWidth, 
				cardHeigth,
				-0.06
			);
		}
	
		function CreateCard(x, y, name, value, texture, width, height, rotation){
			// Create our little bunny friend..
			const bunny = new Sprite(texture);
			
	
			// Enable the bunny to be interactive... this will allow it to respond to mouse and touch events
			bunny.eventMode = 'static';
			// This button mode will mean the hand cursor appears when you roll over the bunny with your mouse
			bunny.cursor = 'pointer';
			// Center the bunny's anchor point
			bunny.anchor.set(0.5);
			// Make it a bit bigger, so it's easier to grab
			bunny.scale.set(3);

			bunny.on('pointerdown', onDragStart.bind(this, {x: Math.floor(x), y: Math.floor(y), name, value, rotation}), bunny);
	
			// Move the sprite to its designated position
			bunny.x = Math.floor(x);
			bunny.y = Math.floor(y);
			bunny.width = width
			bunny.height = height
			bunny.rotation = rotation

			bunny.roundPixels = true
	
			const uid = bunny.uid
			cardInMap.push({uid, name, value})
			
			// Add it to the stage
			app.stage.addChild(bunny);
		}
	
		app.stage.eventMode = 'static';
		app.stage.hitArea = app.screen;

		app.stage.off('pointerup', onDragEnd);
		app.stage.off('pointerupoutside', onDragEnd);
		app.stage.off('pointerup', onDragEnd);

		app.stage.on('pointerup', onDragEnd);
		app.stage.on('pointerupoutside', onDragEnd);
	
		
		function onDragMove(event){
			const card = cardInMap.find(el=>el.name == dragCard.name && el.value == dragCard.value)
			if (card && event.target && card.uid == event.target.uid && dragTarget && event.target.children.length == 0 && lockStart && dragAllCheck){
				clicked = false
				moovingLock = false
				dragTarget.x = Math.floor(event.client.x)
				dragTarget.y = Math.floor(event.client.y)
			}
		}
		
		function onDragStart(dragCardLocal, e){
			if(!dragTarget && lockStart && e.target.rotation && clicked && dragStartCheck && dragAllCheck){
				dragStartCheck = false
				setTimeout(()=>{
					dragStartCheck = true
				}, 1000)
				console.log(dragCard, dragCardLocal)
				dragCard = dragCardLocal

				e.target.alpha = 0.5;
				dragTarget = e.target;
				app.stage.on('pointermove', onDragMove);
			}
		}
		
		
		function onDragEnd(e){
			console.log(e, dragAllCheck)
			if(dragAllCheck){
				dragAllCheck = false
				document.getElementById('gameCanvas')?.classList.add('pointerNone')
				setTimeout(()=>{
					dragAllCheck = true
					document.getElementById('gameCanvas')?.classList.remove('pointerNone')
				}, 1000)
	
				const game = globalGame
				const userC = game.players.findIndex(el=>+el.id == +JSON.parse(localStorage.getItem('user') || '').id)
	
				console.log(stop2linter)
				if(stop2linter){
					stop2linter = false
					if(e.target && e.target.children.length == 0 && lockStart && e.target.rotation && dragTarget){
						lockStart = false
						if(userC == game.attackerIndex){
							setTimeout(()=>{
								if(checkReqClick){
									checkReqClick = false
									
									if(dragCard.name && dragCard.value){
										const localDrag = {...dragCard}
										const localTarget = e.target
										if(moovingLock){
											cardClick(e, dragCard.name, dragCard.value, undefined, game, ()=>{
												console.log(localTarget, localDrag)
												clearDrag(localTarget, localDrag.x, localDrag.y)
											},'click')
										}else{
											cardUp(canvasWidth, canvasHeigth, dragCard.name, dragCard.value, e)
										}
										
	
									setTimeout(()=>{
										checkReqClick = true
									}, 1000)
								}
						}}, 100)
						}else{
							cardUp(canvasWidth, canvasHeigth, dragCard.name, dragCard.value, e)
						}
						setTimeout(()=>{
							lockStart = true
						}, 1000)
					}else{
						console.log(dragTarget)
						if(dragTarget){
							const localDrag = {...dragCard}
							clearDrag(dragTarget, localDrag.x, localDrag.y)
						}
						
					}
	
					if (dragTarget){
						app.stage.off('pointermove', onDragMove);
						dragTarget.alpha = 1;
						setTimeout(()=>{dragTarget = null;}, 200)
					}
				setTimeout(()=>{
					clicked = true
					stop2linter = true
				}, 200)
				}
			}
			
		}
	})()
	return <></>
})
export default CanvasListener

let lastCountCard = 5, lastArrayCard = []
let userCardsLocal = []

function setPositionCards(stageItems,game){
	const userId = JSON.parse(localStorage.getItem('user') || '').id

	const usersCards: Array<any> = []
	game.players.forEach(el=>{
		usersCards.push({id: el.id, cards: el.cards})
	})

	let returnedCards: any = []
	usersCards.forEach(user=>{
		if(user.id == userId){

			const newCards = game.players.find(el=>el.id == userId).cards
			lastArrayCard = newCards
			lastCountCard = newCards.length

			const elements = user.cards
			elements.sort((p, n)=>{
				return p.nominal > n.nominal ? 1 : -1
			})
			userCardsLocal = user.cards.map(el=>el.current)

			returnedCards = [...elements]
			returnedCards.sort((p, n)=>p.nominal > n.nominal ? 1 : -1)
			returnedCards.sort((p, n)=>p.name > n.name ? 1 : -1)
		}
	})
	return returnedCards
}

let checkReq = true
const cardUp = (canvasWidth, canvasHeight, name, value, e)=>{
	const game = globalGame

	const xMin = canvasWidth*0.2
	const xMax = canvasWidth*0.97
	
	const yMin = canvasHeight*0.33
	const yMax = canvasHeight*0.33 + canvasHeight / 2.7

	const refCard = {current: ''}
	
	const userC = game.players.findIndex(el=>+el.id == +JSON.parse(localStorage.getItem('user') || '').id)

	if(e.client.x >= xMin && e.client.x <= xMax && e.client.y >= yMin && e.client.y <= yMax){
		if(userC != game.attackerIndex){

			setTimeout(()=>{
				if(checkReq){
					checkReq = false
					
					if(name && value){
						const localDrag = {...dragCard}
						const localTarget = e.target
						console.log(localTarget)
						// @ts-ignore: Unreachable code error
						cardClick(e, name, value, refCard, game, ()=>{
							console.log(localTarget)
							clearDrag(localTarget, localDrag.x, localDrag.y)
						},'click', {name, value, ref: {current: null}})
					}
	
					setTimeout(()=>{
						let target: Element | undefined = undefined
						const change_cart = document.getElementById('change_cart')
						const items = change_cart?.querySelectorAll('[data-name]')
						items?.forEach(el=>{
							const elRect = el.getBoundingClientRect()
		
							if(elRect.left <= e.client.x && elRect.right >= e.client.x && elRect.top <= e.client.y && elRect.bottom >= e.client.y){
								// @ts-ignore: Unreachable code error
								target = el.querySelector('[data-side="onTable"]')
							}
						})
						if (target) { // Проверяем, есть ли элемент под заданными координатами
							// @ts-ignore: Unreachable code error
							// @ts-ignore: Unreachable code error
							const beatenCheck = target.closest('[data-name]').dataset.changeLock == 'True'
							if(beatenCheck){
								const localDrag = {...dragCard}
								clearDrag(e.target, localDrag.x, localDrag.y)
							}
							target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
						}else{
							if(game.type == "PEREVODNOY"){
								
								setTimeout(()=>{
									if(checkReqClick){
										checkReqClick = false
										
										if(dragCard.name && dragCard.value){
											const localDrag = {...dragCard}
											cardClick(e, dragCard.name, dragCard.value, undefined, game, ()=>{
												
												clearDrag(e.target, localDrag.x, localDrag.y)
											},'click')
		
										setTimeout(()=>{
											checkReqClick = true
										}, 1000)
									}
								}}, 100)
							}else{
								const localDrag = {...dragCard}
								const targetUid = cardInMap.find(el=>el.name == localDrag.name && el.value == localDrag.value)?.uid
								const target = canvasAppLocal.stage.children.find(el=>
									targetUid == el.uid
								)
								console.log(target)
								clearDrag(target, localDrag.x, localDrag.y)
								
							}
							
						}
					}, 200)

					setTimeout(()=>{
						checkReq = true
					}, 600)
				}
			}, 100)
			
		}else{
			setTimeout(()=>{
				if(checkReq){
					checkReq = false
					if(name && value){
						cardClick({target: ''}, name, value, refCard, game, ()=>{
							const localDrag = {...dragCard}
							clearDrag(e.target, localDrag.x, localDrag.y)
							// @ts-ignore: Unreachable code error
						},'click')
					}
	
					setTimeout(()=>{
						checkReq = true
					}, 600)
				}
			}, 100)
		}
		
	}else{
		const localDrag = {...dragCard}
		if(dragTarget){
			clearDrag(dragTarget, localDrag.x, localDrag.y, -0.06)
		}
	}
}

function clearDrag(target, x, y, rotation){
	moveSprite(target, Math.floor(x), Math.floor(y), 1, undefined, rotation)

	setTimeout(()=>{dragCard = {x: null, y: null, name: null, value: null, rotation: null}}, 500)
	
}

function moveSprite(sprite, targetX, targetY, duration, easingFunction = (t) => t, targetRotation = null) {
	console.log(sprite)
	moovingLock = false
	targetX = Math.floor(targetX)
	targetY = Math.floor(targetY)
	if(!sprite){return}
    if (!duration) {
        sprite.x = targetX;
        sprite.y = targetY;
        if (targetRotation !== null) {
            sprite.rotation = targetRotation;
        }
        return Promise.resolve();
    }

    return new Promise(resolve => {
        const startX = sprite.x;
        const startY = sprite.y;
        const startRotation = sprite.rotation;
        let startTime = null;


        const animate = (time) => {
            if (startTime === null) {
                startTime = time;
            }

            const elapsed = time - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easedProgress = easingFunction(progress);

            sprite.x = startX + (targetX - startX) * easedProgress;
            sprite.y = startY + (targetY - startY) * easedProgress;

            if (targetRotation !== null) {
                sprite.rotation = startRotation + (targetRotation - startRotation) * easedProgress;
            }


            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
				setTimeout(()=>{moovingLock = true}, 300)
				
                resolve();
            }
        };

        requestAnimationFrame(animate);
    });
}

function bringToFront(sprite, parent) {
	var sprite = (typeof(sprite) != "undefined") ? sprite.target || sprite : this;
	var parent = parent || sprite.parent || {"children": false};

	if (parent.children) {    
		for (var keyIndex in sprite.parent.children) {
		    if (sprite.parent.children[keyIndex] === sprite) { 
			        sprite.parent.children.splice(keyIndex, 1);
					break;        
				}
			}
			parent.children.push(sprite)
	}
}
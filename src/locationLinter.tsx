import React, { useContext, useEffect } from "react";
import { CanvasContext } from "./App";

const LocationLinter =  ()=>{
	const gameCanvas = document.getElementById('gameCanvas')
	const CanvasApp = useContext(CanvasContext)
	useEffect(()=>{
		if(gameCanvas){
			if(window.location.href.includes('game?')){
				gameCanvas.classList.remove('pointerNone')
			}else{
				console.log()
				gameCanvas.classList.add('pointerNone')
			}
		}
		
	}, [window.location.href, CanvasApp])
	return <>
	</>
}
export default LocationLinter
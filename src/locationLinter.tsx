import React, { useContext, useEffect } from "react";
import { CanvasContext } from "./App";
import { useLocation } from "react-router-dom";

const LocationLinter =  ()=>{
	const gameCanvas = document.getElementById('gameCanvas')
	const CanvasApp = useContext(CanvasContext)
	const location = useLocation()

	useEffect(()=>{
		console.log(CanvasApp)
		if(gameCanvas){
			console.log(location)
			if(location.pathname.includes('game') && location.search == "?type=quick"){
				gameCanvas.classList.remove('pointerNone')
			}else{
				gameCanvas.classList.add('pointerNone')
			}
		}
		
	}, [location.pathname, CanvasApp])
	return <>
	</>
}
export default LocationLinter
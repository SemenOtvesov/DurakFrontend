import React, { memo } from "react";


const CanvasElement = memo(()=>{
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
	return <>
	 	<canvas id="mainCanvas"  width={scrollWidth} height={scrollHeight} style={{
			position: 'fixed', width: '100dvw', height: '100dvh'
		}}></canvas>
	 	<canvas id="copyCanvas"  width={scrollWidth} height={scrollHeight} style={{
			position: 'fixed', width: '100dvw', height: '100dvh', opacity: 0, pointerEvents: 'none'
		}}></canvas>
	 </>
}, ()=>true)
export default CanvasElement
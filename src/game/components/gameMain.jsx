import React, { useState } from "react";
import PlayerButtons from "./playerButtons.tsx";
import Emoji from "./emoji.tsx";
import Cards from "./cards.tsx";
import Players from "./players.tsx";
import Timer from "./timer/timerCheckRefresh.tsx";
import ConstCard from "./cosntCard.tsx";
import ChangeCard from "./tableCards/changeCard.tsx";
import EnemyCard from "./tableCards/enemyCard.tsx";
import EndGamePopap from "./endGamePopap.tsx";
import CanvasElement from "./canvasElement.tsx";
import CanvasLinter from "./canvasLinter.tsx";

function GameMain({ game, emoji, setEmoji, getAnimatePosition, setAnimatePosition, showEmojiPopup, setShowEmojiPopup }) {
	const userId = JSON.parse(localStorage.getItem('user')).id

	return <>
		<Players game={{
			'attackerId': game.players[game.attackerIndex]?.id,
			'players': game.players.filter(el => el.id != userId),
		}}
			emoji={emoji}
			setEmoji={setEmoji}
			initActive={false}
		/>
		<Timer game={game} />

		<EnemyCard game={game} />
		<Cards game={game} setAnimatePosition={setAnimatePosition} />
		{/* <CanvasElement /> */}
		{/* <CanvasLinter game={game} getAnimatePosition={getAnimatePosition} setAnimatePosition={setAnimatePosition} /> */}

		<Emoji showEmojiPopup={showEmojiPopup} setShowEmojiPopup={setShowEmojiPopup} />
		<ConstCard />
	</>
}
export default GameMain
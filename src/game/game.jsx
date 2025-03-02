import React, { useEffect, useRef, useState } from "react";
import "../game/css/game.css";

import Lobby from "./components/lobby.tsx";
import GameMain from "./components/gameMain.jsx";
import expectation from "./mainFn/expectation.ts";
import responseStartGame from "./responce/responseStartGame.ts";
import { cardDown, cardMove, cardUp } from "./res/components/gameCard/cardDrag.ts";

import CanvasElement from "./components/canvasElement.tsx";
import PlayerButtons from "./components/playerButtons.tsx";
import ChangeCard from "./components/tableCards/changeCard.tsx";
import Emoji from "./components/emoji.tsx";
import EndGamePopap from "./components/endGamePopap.tsx";

let startAnimatePosition = [{ x: null, y: null }]
function setAnimatePosition(v) {
	console.log(v, 'setFn')
	startAnimatePosition = [v]
}
function getAnimatePosition() {
	return startAnimatePosition[0]
}
// game
const Game = () => {
	const [game, setGame] = useState(JSON.parse(localStorage.getItem("game_status") || ''))
	const [expectationState, setExpectationState] = useState(true)
	const [emoji, setEmoji] = useState(null)
	const [playerAmount, setPlayerAmount] = useState(0)

	const sectionRef = useRef(null)
	const canvasRef = useRef(null)

	const [showEmojiPopup, setShowEmojiPopup] = useState(false);

	useEffect(() => { expectation({ setGame, setEmoji, setExpectationState, setPlayerAmount }) }, [])

	useEffect(() => {
		if (expectationState && game.players?.length == playerAmount) {
			setTimeout(() => { responseStartGame(game) }, 5000)
		}
	}, [expectationState, playerAmount, game.players])


	useEffect(() => {
		const resize = () => {
			setGame(p => ({ ...p }))
		}

		window.addEventListener('resize', resize)

		const upFn = cardUp.bind(this, game, setAnimatePosition)
		return () => {
			window.removeEventListener('resize', resize)
		}
	})

	useEffect(() => {
		sectionRef.current.style.height = window.innerHeight + 'px';
	})
	const userCosmetic = JSON.parse(localStorage.getItem("user_cosmetic"));

	return (
		<>
			<section
				ref={sectionRef}
				className="game"
				style={{
					backgroundImage: `url(/res/skins${userCosmetic?.find((item) => item.cosmetic?.type === "table")
						?.cosmetic?.link
						})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "auto 100%",
					backgroundPosition: 'center',
				}}
			>
				{expectationState && <Lobby game={game} setExpectation={setExpectationState} />}
				{!expectationState &&
					<>
						<GameMain
							game={game}
							emoji={emoji}
							setEmoji={setEmoji}
							getAnimatePosition={getAnimatePosition}
							setAnimatePosition={setAnimatePosition}
							canvasRef={canvasRef}
							setShowEmojiPopup={setShowEmojiPopup}
							showEmojiPopup={showEmojiPopup}
						/>
						<CanvasElement game={game} />
					</>
				}
			</section>
			{!expectationState &&
				<>
					<Emoji showEmojiPopup={showEmojiPopup} setShowEmojiPopup={setShowEmojiPopup} />
					<ChangeCard game={game} />
					<PlayerButtons game={game} setShowEmojiPopup={setShowEmojiPopup} />
					<EndGamePopap game={game} />
				</>
			}
		</>
	);
};

export default Game;


import React from 'react'

import dragonEmoji from '../media/img/emojis/dragon.png'
import goblinEmoji from '../media/img/emojis/goblin.png'
import knightEmoji from '../media/img/emojis/knight.png'
import smileEmoji from '../media/img/emojis/smile.png'
import winkEmoji from '../media/img/emojis/wink.png'

const EmojiPopup = ({ onSelectEmoji, show }) => {
  if (!show) return null

  return (
    <div className={`emoji_popup ${show ? 'show' : ''}`}>
      <button
        className="emoji_button"
        onClick={() => onSelectEmoji(dragonEmoji)}
      >
        <img
          src={dragonEmoji}
          alt="Dragon Emoji"
        />
      </button>
      <button
        className="emoji_button"
        onClick={() => onSelectEmoji(goblinEmoji)}
      >
        <img
          src={goblinEmoji}
          alt="Goblin Emoji"
        />
      </button>
      <button
        className="emoji_button"
        onClick={() => onSelectEmoji(smileEmoji)}
      >
        <img
          src={smileEmoji}
          alt="Smile Emoji"
        />
      </button>
      <button
        className="emoji_button"
        onClick={() => onSelectEmoji(winkEmoji)}
      >
        <img
          src={winkEmoji}
          alt="Wink Emoji"
        />
      </button>
    </div>
  )
}

export default EmojiPopup

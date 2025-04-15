import './App.css'
import { Field } from '#/components/Field'
import { useState } from 'react'
import { TGame } from '#/models/game'
import { defaultGame } from './defaultValues'

function App() {
  const [game, setGame] = useState<TGame>(defaultGame)

  return (
    <>
      <Field
        game={game}
        onChange={(game) => setGame(game)}
      />
    </>
  )
}

export default App

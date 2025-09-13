import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { RotateCcw, Trophy, Users } from 'lucide-react'
import './App.css'

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameHistory, setGameHistory] = useState([])
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] }
      }
    }
    return null
  }

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board)) return
    
    const newBoard = board.slice()
    newBoard[i] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)
    
    const result = calculateWinner(newBoard)
    if (result) {
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }))
      setGameHistory(prev => [...prev, `${result.winner} wins!`])
    } else if (newBoard.every(square => square)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
      setGameHistory(prev => [...prev, "It's a draw!"])
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  const resetAll = () => {
    resetGame()
    setScores({ X: 0, O: 0, draws: 0 })
    setGameHistory([])
  }

  const winner = calculateWinner(board)
  const isDraw = !winner && board.every(square => square)
  
  let status
  if (winner) {
    status = `Winner: ${winner.winner}`
  } else if (isDraw) {
    status = "It's a draw!"
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`
  }

  const renderSquare = (i) => {
    const isWinningSquare = winner && winner.line.includes(i)
    return (
      <Button
        key={i}
        variant="outline"
        className={`w-20 h-20 text-3xl font-bold transition-all duration-200 hover:scale-105 ${
          isWinningSquare 
            ? 'bg-green-100 border-green-500 text-green-700 animate-pulse' 
            : 'hover:bg-gray-50'
        } ${
          board[i] === 'X' ? 'text-blue-600' : board[i] === 'O' ? 'text-red-600' : ''
        }`}
        onClick={() => handleClick(i)}
        disabled={!!board[i] || !!winner}
      >
        {board[i]}
      </Button>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Trophy className="text-yellow-500" />
            Tic Tac Toe
          </h1>
          <p className="text-gray-600">Challenge your friend to a classic game!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Users className="text-blue-500" />
                  {status}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {Array(9).fill(null).map((_, i) => renderSquare(i))}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    New Game
                  </Button>
                  <Button 
                    onClick={resetAll}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    Reset All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scoreboard and History */}
          <div className="space-y-6">
            {/* Scoreboard */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Trophy className="text-yellow-500" />
                  Scoreboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Player X:</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {scores.X}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Player O:</span>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    {scores.O}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Draws:</span>
                  <Badge variant="outline" className="text-gray-600 border-gray-600">
                    {scores.draws}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Game History */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Game History</CardTitle>
              </CardHeader>
              <CardContent>
                {gameHistory.length === 0 ? (
                  <p className="text-gray-500 text-center">No games played yet</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {gameHistory.slice(-5).reverse().map((result, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-gray-50 rounded text-sm"
                      >
                        Game {gameHistory.length - index}: {result}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Game Rules */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Rules:</h4>
                <ul className="space-y-1">
                  <li>• Players take turns placing X and O</li>
                  <li>• Get 3 in a row to win (horizontal, vertical, or diagonal)</li>
                  <li>• If all squares are filled with no winner, it's a draw</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-1">
                  <li>• Score tracking across multiple games</li>
                  <li>• Game history of recent matches</li>
                  <li>• Winning line highlighting</li>
                  <li>• Responsive design for all devices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App


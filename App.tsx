import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { CardContent } from './components/CardContent';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Plus, Shuffle, X, Check, Trophy, UserCircle, Play, RotateCcw, History } from 'lucide-react';
import { INITIAL_CARDS } from './LIST';

// Definición de constantes globales
const ROUND_TIME_SECONDS = 40;

const App = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [texts, setTexts] = useState(INITIAL_CARDS);
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [players, setPlayers] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [usedCards, setUsedCards] = useState([]);
  const [isNewRound, setIsNewRound] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [availableCards, setAvailableCards] = useState([...texts]);

  const startGame = () => {
    setGameStarted(true);
    setTimerActive(true);
    
    // Reset available cards for new round if needed
    if (availableCards.length === 0) {
      setAvailableCards([...texts]);
    }
    selectRandomText();
  };

  const startNewRound = () => {
    if (usedCards.length > 1) {
      setIsNewRound(true);
      setGameStarted(false);
      setTimerActive(false);
      setTimeLeft(ROUND_TIME_SECONDS);
      setCurrentText('');
      setAvailableCards([...usedCards]); // Reset available cards with used cards
      setUsedCards([]); // Clear used cards for new round
      setRoundNumber(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({ ...player, score: 0 })));
    setUsedCards([]);
    setIsNewRound(false);
    setGameStarted(false);
    setTimerActive(false);
    setTimeLeft(ROUND_TIME_SECONDS);
    setCurrentText('');
    setRoundNumber(1);
    setAvailableCards([...texts]);
  };

  const selectRandomText = () => {
    if (availableCards.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const newText = availableCards[randomIndex];
    
    setCurrentText(newText);
    setUsedCards(prev => [...prev, newText]);
    setAvailableCards(prev => prev.filter((_, index) => index !== randomIndex));
  };

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setGameStarted(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleAddText = () => {
    if (!inputText.trim()) return;
    setTexts(prev => [...prev, inputText.trim()]);
    setAvailableCards(prev => [...prev, inputText.trim()]);
    setInputText('');
  };

  const handleDeleteText = (indexToDelete) => {
    setTexts(texts.filter((_, index) => index !== indexToDelete));
    setAvailableCards(availableCards.filter((_, index) => index !== indexToDelete));
  };

  // Resto de handlers sin cambios...
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeTab === 'players') {
        handleAddPlayer();
      } else {
        handleAddText();
      }
    }
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = {
      id: Date.now(),
      name: newPlayerName.trim(),
      score: 0
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    if (!activePlayer) setActivePlayer(newPlayer.id);
  };

  const handleCorrectAnswer = () => {
    if (!activePlayer || timeLeft === 0) return;
    setPlayers(players.map(player => 
      player.id === activePlayer 
        ? {...player, score: player.score + 1}
        : player
    ));
    selectRandomText();
  };

  const handlePlayerSelect = (playerId) => {
    if (timerActive) return;
    if (activePlayer !== playerId) {
      setActivePlayer(playerId);
      setGameStarted(false);
      setTimeLeft(ROUND_TIME_SECONDS);
      setTimerActive(false);
      setCurrentText('');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
                Mis Cartas
              </h2>
              <div className="flex gap-2 mb-4">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu texto..."
                  className="flex-1"
                />
                <Button onClick={handleAddText} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {texts.map((text, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-100 rounded-lg px-3"
                  >
                    <span className="text-purple-800">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      {text}
                    </span>
                    <button
                      onClick={() => handleDeleteText(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'game':
        return (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              {activePlayer ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="font-bold text-purple-800">
                        {players.find(p => p.id === activePlayer)?.score || 0}
                      </span>
                      <UserCircle className="h-5 w-5 text-purple-600 ml-2" />
                      <span className="font-medium text-purple-800">
                        {players.find(p => p.id === activePlayer)?.name}
                      </span>
                    </div>
                    <div className="text-purple-800 font-bold">
                      Ronda: {roundNumber}
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold mb-4 text-purple-800">
                    {timeLeft}s
                  </div>

                  {!gameStarted ? (
                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={startGame}
                        className="w-48 h-48 rounded-full mx-auto bg-green-500 hover:bg-green-600 text-xl flex flex-col items-center justify-center gap-2"
                      >
                        <Play className="h-16 w-16 mr-2" />
                        Jugar
                      </Button>
                      {usedCards.length > 1 && (
                        <Button
                          onClick={startNewRound}
                          className="bg-tomato-500 hover:bg-purple-600 w-48 h-48 mx-auto flex items-center justify-center"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Siguiente ronda
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 transform rotate-1 rounded-lg" />
                        <div className="relative bg-purple-100 p-6 rounded-lg min-h-[200px] flex items-center justify-center text-xl font-medium text-purple-900">
                          {currentText || "Pulsa Siguiente para empezar"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={selectRandomText}
                          disabled={availableCards.length === 0}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Shuffle className="mr-2 h-4 w-4" /> Siguiente
                        </Button>
                        <Button
                          onClick={handleCorrectAnswer}
                          disabled={!currentText || timeLeft === 0}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          <Check className="mr-2 h-4 w-4" /> Correcto
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center text-purple-800 py-8">
                  Selecciona un jugador en la pestaña "Jugadores" para comenzar
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'players':
        return (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
                Jugadores
              </h2>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nombre del jugador..."
                  className="flex-1"
                />
                <Button onClick={handleAddPlayer} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerSelect(player.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      timerActive
                        ? 'opacity-50 cursor-not-allowed'
                        : activePlayer === player.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      <span className="font-bold">{player.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              {players.length > 0 && (
                <Button
                  onClick={resetGame}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar juego
                </Button>
              )}
            </CardContent>
          </Card>
        );

      case 'history':
        return (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
                Cartas Usadas
              </h2>
              <div className="text-center text-purple-800 mb-4">
                {usedCards.length} / {availableCards.length} cartas usadas
              </div>
              <div className="space-y-2">
                {usedCards.map((card, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-100 rounded-lg text-purple-800"
                  >
                    <span className="font-bold mr-2">{index + 1}.</span>
                    {card}
                  </div>
                ))}
                {usedCards.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No hay cartas usadas todavía
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4 bg-purple-500">
      <div className="max-w-md mx-auto">
        <div className="mb-20">
          {renderContent()}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto flex">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 p-4 text-center font-medium ${
                activeTab === 'input'
                  ? 'text-purple-600 border-t-2 border-purple-600 bg-purple-100'
                  : 'text-gray-500'
              }`}
            >
              Mis Cartas
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex-1 p-4 text-center font-medium ${
                 activeTab === 'game'
                  ? 'text-purple-600 border-t-2 border-purple-600 bg-purple-100'
                  : 'text-gray-500'
              }`}
            >
              Jugar
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 p-4 text-center font-medium ${
                activeTab === 'players'
                  ? 'text-purple-600 border-t-2 border-purple-600 bg-purple-100'
                  : 'text-gray-500'
              }`}
            >
              Jugadores
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 p-4 text-center font-medium ${
                activeTab === 'history'
                  ? 'text-purple-600 border-t-2 border-purple-600 bg-purple-100'
                  : 'text-gray-500'
              }`}
            >
              Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

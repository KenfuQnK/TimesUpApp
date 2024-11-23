import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { CardContent } from './components/CardContent';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Plus, Shuffle, X, Check, Trophy, UserCircle, Play, RotateCcw, History } from 'lucide-react';
import { INITIAL_CARDS } from './LIST';

// Constante para definir el tiempo del contador
const DEFAULT_TIME = 40;

const App = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [texts, setTexts] = useState(INITIAL_CARDS);
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [players, setPlayers] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [usedCards, setUsedCards] = useState([]);
  const [roundCounter, setRoundCounter] = useState(0); // Contador de rondas

  const startGame = () => {
    setGameStarted(true);
    setTimerActive(true);
    selectRandomText();
  };

  const startNewRound = () => {
    if (usedCards.length > 0) {
      setRoundCounter(roundCounter + 1); // Incrementar el contador de rondas
      setGameStarted(false);
      setTimerActive(false);
      setTimeLeft(DEFAULT_TIME);
      setCurrentText('');
      setUsedCards([]);
    }
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({ ...player, score: 0 })));
    setUsedCards([]);
    setRoundCounter(0); // Reiniciar el contador de rondas
    setGameStarted(false);
    setTimerActive(false);
    setTimeLeft(DEFAULT_TIME);
    setCurrentText('');
  };

  const selectRandomText = () => {
    const remainingCards = texts.filter(card => !usedCards.includes(card));
    if (remainingCards.length === 0) return;

    const newText = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    setCurrentText(newText);
    setUsedCards([...usedCards, newText]);
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
    setTexts([...texts, inputText.trim()]);
    setInputText('');
  };

  const handleDeleteText = (indexToDelete) => {
    setTexts(texts.filter((_, index) => index !== indexToDelete));
  };

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
        ? { ...player, score: player.score + 1 }
        : player
    ));
    selectRandomText();
  };

  const handlePlayerSelect = (playerId) => {
    if (timerActive) return;
    if (activePlayer !== playerId) {
      setActivePlayer(playerId);
      setGameStarted(false);
      setTimeLeft(DEFAULT_TIME);
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
                    <span className="text-purple-800">{index + 1}. {text}</span>
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
                    <span className="font-bold text-purple-800">Ronda: {roundCounter}</span>
                    <span className="font-bold text-purple-800">
                      Cartas mostradas: {usedCards.length} / {texts.length}
                    </span>
                  </div>
                  {/* Rest of game screen */}
                </>
              ) : (
                <div className="text-center text-purple-800 py-8">
                  Selecciona un jugador en la pestaña "Jugadores" para comenzar
                </div>
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
              <div className="text-center mb-4 text-purple-800">
                {usedCards.length} / {texts.length}
              </div>
              <div className="space-y-2">
                {usedCards.map((card, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-100 rounded-lg text-purple-800"
                  >
                    {index + 1}. {card}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-20">{renderContent()}</div>
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto flex">
            {/* Navigation buttons */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

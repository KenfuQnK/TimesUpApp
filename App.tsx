import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { CardContent } from './components/CardContent';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Plus, Shuffle, X, Check, Trophy, UserCircle, Play, RotateCcw, History } from 'lucide-react';

const INITIAL_CARDS = [
  "Leonardo DiCaprio","Taylor Swift","Brad Pitt","Shakira","Tom Cruise","Will Smith","Lady Gaga",
  "Mickey Mouse", "Bob Marley", "Albert Einstein", "Marilyn Monroe", "Mozart", "Vincent van Gogh", 
  "Martin Luther King", "Sherlock Holmes", "Hércules", "Gandhi", "Drácula", "Frankenstein", 
  "Romeo y Julieta", "Alicia en el País de las Maravillas", "El Mago de Oz", "Michael Jackson", 
  "Madonna", "Beyoncé", "Elvis Presley", "Freddie Mercury", "Walt Disney", "Steven Spielberg", 
  "Alfred Hitchcock", "Quentin Tarantino", "George Lucas", "Ferrari", "J.K. Rowling", 
  "Agatha Christie", "Michael Jordan", "Roger Federer", "Rafael Nadal", "Lionel Messi", 
  "Cristiano Ronaldo", "Pelé", "Diego Maradona", "Tiger Woods", "Usain Bolt", "Mike Tyson", 
  "Floyd Mayweather", "David Beckham", "Zinedine Zidane", "Ronaldinho", "Roger Federer", 
  "Mike Tyson", "Julio César", "Albert Einstein", "Marie Curie", "Isaac Newton", "Nikola Tesla", 
  "Darwin", "Alexander Fleming", "Stephen Hawking", "Thomas Edison", "Neil Armstrong", 
  "Albert Einstein", "Cleopatra", "Leonardo da Vinci", "Napoleón Bonaparte", "Shakespeare", 
  "Che Guevara", "Pablo Picasso", "Van Gogh", "Salvador Dalí", "Beethoven", "Isaac Newton", 
  "Marie Antoinette", "Abraham Lincoln", "Michael Jordan", "Usain Bolt", "Diego Maradona", 
  "Lionel Messi", "Cristiano Ronaldo", "Rafael Nadal", "Marco Polo", "Juana de Arco", 
  "Galileo Galilei", "Karl Marx", "Nikola Tesla", "Pablo Neruda", "Casablanca", "El Padrino", 
  "Star Wars", "Titanic", "El Señor de los Anillos", "Harry Potter", "Jurassic Park", "Avatar", 
  "La La Land", "Pulp Fiction", "Regreso al Futuro", "Indiana Jones", "Forrest Gump", 
  "Gladiador", "Los Vengadores", "El Rey León", "Aladdín", "Toy Story", "Matrix", 
  "Jurassic World", "Inception", "Coco", "El Club de la Lucha", "Wall-E", 
  "El Gran Hotel Budapest", "Los Miserables", "El exorcista", "Chinatown", "Rocky", "Alien", 
  "Cazafantasmas", "Karate Kid", "Batman", "Pretty Woman", "Bailando con Lobos", 
  "El Silencio de los Corderos", "En busca de la felicidad", "El discurso del Rey", 
  "La vida de Pi", "El renacido", "Parásitos", "Don Quijote de la Mancha", "Cien años de soledad",
  "El Principito", "Matar a un ruiseñor", "El Hobbit", "La Odisea", "Los Juegos del Hambre", 
  "La Divina Comedia", "Crimen y Castigo", "Guerra y Paz", "Drácula", "El guardián entre el centeno", 
  "Viaje al centro de la Tierra", "La vuelta al mundo en 80 días", "Robinson Crusoe", 
  "La isla del tesoro", "Frankenstein", "La Iliada", "El Paraíso Perdido", "Los Miserables", 
  "Grandes Esperanzas", "Un Cuento de Navidad", "La Metamorfosis", "El Proceso", "En el camino", 
  "Al faro", "Los Hijos de la Medianoche", "El Nombre de la Rosa", "Los Pilares de la Tierra", 
  "La Sombra del Viento", "El Código Da Vinci", "Ángeles y Demonios", 
  "El Niño con el Pijama de Rayas", "La Chica del Tren", 
  "Los hombres que no amaban a las mujeres", "El Alquimista", "Cometas en el Cielo", 
  "La Casa de los Espíritus", "Mickey Mouse", "Bob Marley", "Marilyn Monroe", "Mozart", 
  "Martin Luther King", "Sherlock Holmes", "Hércules", "Gandhi", "Drácula", "Frankenstein", 
  "Romeo y Julieta", "Alicia en el País de las Maravillas", "El Mago de Oz", "Michael Jackson", 
  "Madonna", "Beyoncé", "Elvis Presley", "Freddie Mercury", "Walt Disney", "Steven Spielberg", 
  "Quentin Tarantino", "George Lucas", "Ferrari", "J.K. Rowling", "Agatha Christie", 
  "Roger Federer", "Tiger Woods", "Mike Tyson", "Floyd Mayweather", "David Beckham", 
  "Zinedine Zidane", "Ronaldinho", "Julio César", "Marie Curie", "Darwin", "Alexander Fleming", 
  "Stephen Hawking", "Thomas Edison", "Neil Armstrong"
];

const App = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [texts, setTexts] = useState(INITIAL_CARDS);
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [players, setPlayers] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [usedCards, setUsedCards] = useState([]);
  const [isNewRound, setIsNewRound] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setTimerActive(true);
    selectRandomText();
  };

  const startNewRound = () => {
    if (usedCards.length > 1) {
      setIsNewRound(true);
      setGameStarted(false);
      setTimerActive(false);
      setTimeLeft(30);
      setCurrentText('');
    }
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({ ...player, score: 0 })));
    setUsedCards([]);
    setIsNewRound(false);
    setGameStarted(false);
    setTimerActive(false);
    setTimeLeft(30);
    setCurrentText('');
  };

  const selectRandomText = () => {
    const sourceArray = isNewRound ? usedCards : texts;
    if (sourceArray.length === 0) return;
    
    let newText;
    do {
      newText = sourceArray[Math.floor(Math.random() * sourceArray.length)];
    } while (sourceArray.length > 1 && newText === currentText);
    
    setCurrentText(newText);
    if (!isNewRound && !usedCards.includes(newText)) {
      setUsedCards([...usedCards, newText]);
    }
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
      setTimeLeft(30);
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
                    className="flex items-center justify-between p-3 bg-purple-100 rounded-lg"
                  >
                    <span className="text-purple-800">{text}</span>
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
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <UserCircle className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      {players.find(p => p.id === activePlayer)?.name}
                    </span>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-purple-800">
                      {players.find(p => p.id === activePlayer)?.score || 0}
                    </span>
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
                        <Play className="h-16 w-16" />
                        Empezar a jugar
                      </Button>
                      {usedCards.length > 1 && (
                        <Button
                          onClick={startNewRound}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Nueva ronda con cartas usadas
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 transform rotate-1 rounded-lg" />
                        <div className="relative bg-white p-6 rounded-lg min-h-[200px] flex items-center justify-center text-xl font-medium text-purple-900">
                          {currentText || "Pulsa Siguiente para empezar"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={selectRandomText}
                          disabled={texts.length === 0}
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
              <div className="space-y-2">
                {usedCards.map((card, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-100 rounded-lg text-purple-800"
                  >
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4">
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
                  ? 'text-purple-600 border-t-2 border-purple-600'
                  : 'text-gray-500'
              }`}
            >
              Mis Cartas
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex-1 p-4 text-center font-medium ${
                activeTab === 'game'
                  ? 'text-purple-600 border-t-2 border-purple-600'
                  : 'text-gray-500'
              }`}
            >
              Jugar
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 p-4 text-center font-medium ${
                activeTab === 'players'
                  ? 'text-purple-600 border-t-2 border-purple-600'
                  : 'text-gray-500'
              }`}
            >
              Jugadores
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 p-4 text-center font-medium ${
                activeTab === 'history'
                  ? 'text-purple-600 border-t-2 border-purple-600'
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

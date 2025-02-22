import React, { useState, useEffect, useRef } from 'react';
import { Music, Mic, Search, User, Heart, TrendingUp, MessageCircle, Play, Pause, Volume2 } from 'lucide-react';

// Mock data for songs and artists
const songData = {
  energetic: [
    { title: "Don't Stop Believin'", artist: "Journey", embedId: "1k8craCGpgs" },
    { title: "Eye of the Tiger", artist: "Survivor", embedId: "btPJPFnesV4" },
    { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", embedId: "ye5BuYf8q4o" }
  ],
  romantic: [
    { title: "All of Me", artist: "John Legend", embedId: "450p7goxZqg" },
    { title: "Perfect", artist: "Ed Sheeran", embedId: "2Vv-BfVoq4g" },
    { title: "At Last", artist: "Etta James", embedId: "S-cbOl96RFM" }
  ],
  dance: [
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", embedId: "OPf0YbXqDm0" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", embedId: "ru0K8uYEZWw" },
    { title: "Dancing Queen", artist: "ABBA", embedId: "xFrGuyw1V8s" }
  ],
  sad: [
    { title: "Someone Like You", artist: "Adele", embedId: "hLQl3WQQoQ0" },
    { title: "Say Something", artist: "A Great Big World", embedId: "VVgixOjGhVU" },
    { title: "All By Myself", artist: "Celine Dion", embedId: "NGrLb6W5YOM" }
  ]
};

const artists = {
  energetic: [
    { 
      name: "Eminem", 
      genre: "Hip Hop", 
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    { 
      name: "AC/DC", 
      genre: "Rock", 
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "David Guetta", 
      genre: "EDM", 
      image: "https://images.unsplash.com/photo-1571935441005-7c9f4c3af858?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Queen", 
      genre: "Rock", 
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    }
  ],
  romantic: [
    { 
      name: "Ed Sheeran", 
      genre: "Pop", 
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Adele", 
      genre: "Pop", 
      image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "John Legend", 
      genre: "R&B", 
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Taylor Swift", 
      genre: "Pop", 
      image: "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    }
  ],
  dance: [
    { 
      name: "Michael Jackson", 
      genre: "Pop", 
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Dua Lipa", 
      genre: "Pop", 
      image: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "BTS", 
      genre: "K-Pop", 
      image: "https://images.unsplash.com/photo-1619855544858-e8e275c3b31a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Lady Gaga", 
      genre: "Pop", 
      image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
    }
  ]
};

// Chatbot responses
const chatbotResponses = {
  greetings: [
    "Hello! How can I help you find the perfect music today?",
    "Hi there! What kind of music are you in the mood for?",
    "Welcome! Let me help you discover some great tunes!"
  ],
  mood: {
    happy: ["Here are some upbeat songs to match your mood!", "Let's keep that positive energy going!"],
    sad: ["How about some soulful ballads to express your feelings?", "Music can be very healing. Let me find something for you."],
    energetic: ["Time to get pumped up! Check out these high-energy tracks!", "Let's get this party started!"],
    romantic: ["Setting the mood with some love songs!", "Here's some romantic music to sweep you off your feet!"]
  }
};

function App() {
  const [mood, setMood] = useState('energetic');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: chatbotResponses.greetings[0] }
  ]);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const chatRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(50);

  // Handle chat dragging
  const handleMouseDown = (e) => {
    if (chatRef.current && e.target.closest('.chat-header')) {
      setIsDragging(true);
      const chatRect = chatRef.current.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - chatRect.left,
        y: e.clientY - chatRect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && chatRef.current) {
      const x = e.clientX - dragPosition.x;
      const y = e.clientY - dragPosition.y;
      chatRef.current.style.left = `${x}px`;
      chatRef.current.style.top = `${y}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleChatMessage = (message) => {
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', text: message }]);

    // Simple keyword-based response system
    let response = '';
    const lowercaseMsg = message.toLowerCase();
    
    if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
      response = chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)];
    } else if (lowercaseMsg.includes('happy')) {
      response = chatbotResponses.mood.happy[Math.floor(Math.random() * chatbotResponses.mood.happy.length)];
      setMood('energetic');
    } else if (lowercaseMsg.includes('sad')) {
      response = chatbotResponses.mood.sad[Math.floor(Math.random() * chatbotResponses.mood.sad.length)];
      setMood('sad');
    } else if (lowercaseMsg.includes('romantic')) {
      response = chatbotResponses.mood.romantic[Math.floor(Math.random() * chatbotResponses.mood.romantic.length)];
      setMood('romantic');
    } else {
      response = "I'm here to help you find the perfect music. Tell me how you're feeling!";
    }

    // Add bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&autoplay=1&controls=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1`;
  };

  const renderLogin = () => (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${-Math.random() * 5}s`
            }}
          >
            <Music className="text-white opacity-10 w-8 h-8 transform rotate-45" />
          </div>
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <Music className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">MoodMusic AI</h2>
            <p className="text-white/80">Your personal music companion</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/25"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/25"
              />
            </div>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Sign In
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-white/60 bg-transparent">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span className="text-white">Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <img src="https://www.spotify.com/favicon.ico" alt="Spotify" className="w-5 h-5" />
                <span className="text-white">Spotify</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainApp = () => (
    <div className={`min-h-screen bg-gradient-to-br ${
      mood === 'energetic' ? 'from-red-500 via-orange-500 to-yellow-500' :
      mood === 'romantic' ? 'from-pink-500 via-purple-500 to-red-500' :
      mood === 'dance' ? 'from-purple-500 via-blue-500 to-indigo-500' :
      'from-blue-500 via-gray-500 to-blue-700'
    } transition-colors duration-500`}>
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">MoodMusic AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search songs..."
                className="pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 focus:ring-2 focus:ring-white/25 text-white placeholder-white/50 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Mic className="w-6 h-6 text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <User className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Mood Selector */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['energetic', 'romantic', 'dance', 'sad'].map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`p-6 rounded-xl shadow-lg text-center capitalize transition-all hover:scale-105 ${
                mood === m 
                  ? 'bg-white text-purple-600 transform scale-105' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="text-lg font-semibold">{m}</span>
            </button>
          ))}
        </div>

        {/* Featured Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Now Playing */}
          {currentSong && (
            <div className="col-span-full bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Now Playing</h2>
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(currentSong.embedId)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{currentSong.title}</h3>
                  <p className="text-white/70">{currentSong.artist}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-24 h-2 rounded-full bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mood-Based Songs */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">{mood} Songs</h2>
            </div>
            <div className="space-y-4">
              {songData[mood]?.map((song, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => playSong(song)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${song.embedId}/mqdefault.jpg`}
                    alt={song.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{song.title}</p>
                    <p className="text-sm text-white/70">{song.artist}</p>
                  </div>
                  <button className="ml-auto">
                    <Heart className="w-5 h-5 text-white/70 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Artists */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Recommended Artists</h2>
            <div className="grid grid-cols-2 gap-4">
              {artists[mood === 'sad' ? 'romantic' : mood]?.map((artist, i) => (
                <div key={i} className="text-center">
                  <div className="relative group">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-24 h-24 rounded-full mx-auto mb-2 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="font-medium text-white">{artist.name}</p>
                  <p className="text-sm text-white/70">{artist.genre}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mood-Based Playlist */}
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Your {mood} Mix</h2>
            <div className="space-y-4">
              {songData[mood]?.map((song, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => playSong(song)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${song.embedId}/mqdefault.jpg`}
                    alt={song.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{song.title}</p>
                    <p className="text-sm text-white/70">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* AI Chatbot */}
      <div
        ref={chatRef}
        className={`fixed bottom-4 right-4 w-80 ${chatOpen ? '' : 'translate-y-[calc(100%-3rem)]'}`}
        style={{ transform: chatOpen ? 'none' : 'translateY(calc(100% - 3rem))' }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl">
          <div
            className="p-4 bg-white/10 rounded-t-xl cursor-move chat-header flex items-center justify-between"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="text-white font-medium">AI Assistant</span>
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="text-white hover:bg-white/10 rounded-full p-1"
            >
              {chatOpen ? '▼' : '▲'}
            </button>
          </div>
          {chatOpen && (
            <div className="p-4">
              <div className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`${
                        msg.type === 'bot'
                          ? 'bg-white/10 text-white'
                          : 'bg-purple-500 text-white ml-auto'
                      } p-3 rounded-xl max-w-[80%]`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.target.elements.message;
                    if (input.value.trim()) {
                      handleChatMessage(input.value);
                      input.value = '';
                    }
                  }}
                  className="mt-4 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    name="message"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/25"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return isLoggedIn ? renderMainApp() : renderLogin();
}

export default App;
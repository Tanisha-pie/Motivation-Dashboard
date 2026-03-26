import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  // load liked quotes from localStorage initially
  const [likedQuotes, setLikedQuotes] = useState(() => {
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  // save likes whenever likedQuotes changes
  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  // fetch quote from API
  const fetchQuote = async () => {
    setLoading(true);

    try {

      const res = await fetch("https://dummyjson.com/quotes/random");
      const data = await res.json();
      setQuote(data.quote);
      setAuthor(data.author);

    } catch (error) {

      console.log("Error fetching quote:", error);
      setQuote("Believe in yourself and all that you are.");
      setAuthor("Christian D. Larson");

    }

    setLoading(false);
  };

  // fetch first quote
  useEffect(() => {
    fetchQuote();
  }, []);

  // like toggle
  const toggleLike = () => {
    const newQuote = { quote, author };
    const exists = likedQuotes.find(q => q.quote === quote);
    if (exists) {
      setLikedQuotes(
        likedQuotes.filter(q => q.quote !== quote)
      );

    } else {
      setLikedQuotes([...likedQuotes, newQuote]);
    }
  };

  const isLiked = likedQuotes.some(q => q.quote === quote);

  return (

    <div className="container">
      <h1 className="title">Daily Motivation</h1>
      <div className="quote-box">
        {loading ? (
          <p className="quote">Fetching inspiration...</p>
        ) : (
          <>
            <p className="quote">"{quote}"</p>
            <p className="author">— {author}</p>
          </>
        )}

        <div className="buttons">
          <button onClick={fetchQuote} disabled={loading}>
            {loading ? "Fetching..." : "New Quote"}
          </button>

          <button onClick={toggleLike}>
            {isLiked ? "Unlike 💔" : "Like ❤️"}
          </button>

        </div>

        <p className="count">❤️ Total Likes: {likedQuotes.length}</p>

      </div>

      <div className="liked-box">

        <h2>Liked Quotes</h2>

        {likedQuotes.length === 0 ? (
          <p>No liked quotes yet</p>
        ) : (
          <ul>
            {likedQuotes.map((q, index) => (
              <li key={index}>
                "{q.quote}" — {q.author}
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  );
}

export default App;
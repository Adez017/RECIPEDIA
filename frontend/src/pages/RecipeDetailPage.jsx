import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart } from 'react-icons/fa';
import allRecipes from '../data/recipes.json';
import NotFoundPage from './NotFound.jsx';
import '../styles/RecipeDetail.css';
import { v4 as uuidv4 } from 'uuid';
import AudioOverview from '../components/AudioOverview.jsx';

const RecipeDetailPage = () => {
  const { category, recipeId } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  // Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [spokenChars, setSpokenChars] = useState(0);

  const utteranceRef = useRef(null);
  const contentPartsRef = useRef([]);

  // Load recipe
  useEffect(() => {
    const found = allRecipes.find(
      (r) => r.id === recipeId && r.category === category
    );
    setRecipe(found);
    if (found) {
      const text = `${found.name}. ${found.about}. Ingredients Required, ${found.ingredients.join(
        ', '
      )}. Preparation Steps, ${found.preparationSteps.join('. ')}`;
      contentPartsRef.current = text.split('.');
      setSpeechIndex(0);
    }
  }, [recipeId, category]);

  // Cancel speech on unload
  useEffect(() => {
    window.onbeforeunload = () => window.speechSynthesis.cancel();
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleLike = () => setLiked(!liked);

  const handleComment = (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username') || 'Guest';
    if (!newComment.trim()) {
      setError('Comment cannot be empty!');
      return;
    }
    setComments([
      ...comments,
      { id: uuidv4(), text: newComment.trim(), user: username },
    ]);
    setNewComment('');
    setError('');
  };

  if (!recipe) return <NotFoundPage />;

  return (
    <div className="recipe-detail-container max-w-4xl mx-auto px-4 pt-32 pb-16 dark:bg-slate-800 dark:text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/${recipe.category}`)}
        className="mb-6 px-4 font-bold py-2.5 bg-red-100 text-red-600 hover:text-white hover:bg-red-500 rounded-xl shadow flex items-center gap-2 w-fit transition-all duration-200"
      >
        <FaArrowLeft className="text-inherit" />
        <span className="font-medium text-base">Back to {recipe.category}</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center my-10 text-[#d35400]">
        {recipe.name}
      </h1>

      {/* Image */}
      <img
        src={recipe.image}
        onError={(e) => (e.target.src = '/default.jpg')}
        alt={recipe.name}
        className="w-full h-80 object-cover rounded-xl shadow-lg mb-8"
      />

      {/* Enhanced Audio Section */}
      <AudioOverview
        contentPartsRef={contentPartsRef}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        spokenChars={spokenChars}
        setSpokenChars={setSpokenChars}
        speechIndex={speechIndex}
        setSpeechIndex={setSpeechIndex}
        isSpeaking={isSpeaking}
        setIsSpeaking={setIsSpeaking}
      />

      {/* About Section */}
      <section className="prose max-w-none dark:prose-invert">
        <h2 className="text-2xl font-semibold text-[#d35400] pb-2">
          About this Recipe
        </h2>
        <p className="dark:text-white text-red-500">{recipe.about}</p>

        <h2 className="text-2xl font-semibold mt-6 text-[#d35400] pb-2">
          Ingredients
        </h2>
        <ul className="list-disc dark:text-white pl-6 marker:text-red-500 text-red-500">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-6 text-[#d35400] pb-2">
          Preparation Steps
        </h2>
        <ol className="list-decimal pl-6 space-y-2 dark:text-white text-red-500">
          {recipe.preparationSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Likes Section */}
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-600 hover:text-white hover:bg-red-500 rounded-xl shadow w-fit transition-all duration-200 focus:outline-none"
        >
          {liked ? (
            <FaHeart className="text-inherit" />
          ) : (
            <FaRegHeart className="text-inherit" />
          )}
          {liked ? 'Liked' : 'Like'}
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-[#d35400]">Comments</h3>
        <form onSubmit={handleComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border rounded-lg p-4 min-h-[120px] text-black bg-white dark:bg-slate-700 dark:text-white"
          />
          {error && (
            <p className="text-red-600 mt-2 font-semibold">{error}</p>
          )}
          <button
            type="submit"
            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold"
          >
            Post Comment
          </button>
        </form>
        <div className="space-y-4 mt-6">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg shadow"
              >
                <strong>{c.user}</strong>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg shadow text-center text-gray-500 dark:text-white">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;

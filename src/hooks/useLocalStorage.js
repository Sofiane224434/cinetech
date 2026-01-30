// Hook pour gérer les favoris
export const useFavorites = () => {
  const getFavorites = () => {
    const favorites = localStorage.getItem('moviedb_favorites');
    return favorites ? JSON.parse(favorites) : [];
  };

  const addFavorite = (item, type) => {
    const favorites = getFavorites();
    const newFavorite = { ...item, type, addedAt: Date.now() };
    const updated = [...favorites, newFavorite];
    localStorage.setItem('moviedb_favorites', JSON.stringify(updated));
    return updated;
  };

  const removeFavorite = (id) => {
    const favorites = getFavorites();
    const updated = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('moviedb_favorites', JSON.stringify(updated));
    return updated;
  };

  const isFavorite = (id) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === id);
  };

  return { getFavorites, addFavorite, removeFavorite, isFavorite };
};

// Hook pour gérer les commentaires
export const useComments = () => {
  const getComments = (itemId) => {
    const comments = localStorage.getItem(`moviedb_comments_${itemId}`);
    return comments ? JSON.parse(comments) : [];
  };

  const addComment = (itemId, text, parentId = null) => {
    const comments = getComments(itemId);
    const newComment = {
      id: Date.now(),
      text,
      parentId,
      createdAt: Date.now(),
      author: 'Utilisateur'
    };
    const updated = [...comments, newComment];
    localStorage.setItem(`moviedb_comments_${itemId}`, JSON.stringify(updated));
    return updated;
  };

  const deleteComment = (itemId, commentId) => {
    const comments = getComments(itemId);
    const updated = comments.filter(c => c.id !== commentId && c.parentId !== commentId);
    localStorage.setItem(`moviedb_comments_${itemId}`, JSON.stringify(updated));
    return updated;
  };

  return { getComments, addComment, deleteComment };
};

// Hook pour gérer les notations
export const useRatings = () => {
  const getRatings = () => {
    const ratings = localStorage.getItem('moviedb_ratings');
    return ratings ? JSON.parse(ratings) : {};
  };

  const getRating = (itemId) => {
    const ratings = getRatings();
    return ratings[itemId] || 0;
  };

  const setRating = (itemId, rating) => {
    const ratings = getRatings();
    ratings[itemId] = rating;
    localStorage.setItem('moviedb_ratings', JSON.stringify(ratings));
    return rating;
  };

  const removeRating = (itemId) => {
    const ratings = getRatings();
    delete ratings[itemId];
    localStorage.setItem('moviedb_ratings', JSON.stringify(ratings));
  };

  return { getRating, setRating, removeRating, getRatings };
};

// Hook pour gérer la watchlist
export const useWatchlist = () => {
  const getWatchlist = () => {
    const watchlist = localStorage.getItem('moviedb_watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  };

  const addToWatchlist = (item, type) => {
    const watchlist = getWatchlist();
    const newItem = { ...item, type, addedAt: Date.now(), status: 'to_watch' };
    const updated = [...watchlist, newItem];
    localStorage.setItem('moviedb_watchlist', JSON.stringify(updated));
    return updated;
  };

  const removeFromWatchlist = (id) => {
    const watchlist = getWatchlist();
    const updated = watchlist.filter(item => item.id !== id);
    localStorage.setItem('moviedb_watchlist', JSON.stringify(updated));
    return updated;
  };

  const updateWatchlistStatus = (id, status) => {
    const watchlist = getWatchlist();
    const updated = watchlist.map(item => 
      item.id === id ? { ...item, status } : item
    );
    localStorage.setItem('moviedb_watchlist', JSON.stringify(updated));
    return updated;
  };

  const isInWatchlist = (id) => {
    const watchlist = getWatchlist();
    return watchlist.some(item => item.id === id);
  };

  return { getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistStatus, isInWatchlist };
};

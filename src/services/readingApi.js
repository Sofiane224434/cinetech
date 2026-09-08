const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const OPEN_LIBRARY_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const BANNED_ROMAN_TERMS = ['manga', 'manhwa', 'manwha', 'manhua', 'comic', 'comics', 'graphic novel'];

// In-memory cache for current session
const memoryCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const getCachedData = (key) => {
  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key);
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
  }

  try {
    const stored = localStorage.getItem(`kdb_cache_${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS * 4) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch (_e) {
    // Ignore storage issues
  }
  return null;
};

const setCachedData = (key, data) => {
  const payload = { data, timestamp: Date.now() };
  memoryCache.set(key, payload);
  try {
    localStorage.setItem(`kdb_cache_${key}`, JSON.stringify(payload));
  } catch (_e) {
    // Ignore storage quota issues
  }
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 7000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

// Curated robust fallback data when Jikan API encounters 504 Gateway Time-out
const FALLBACK_MANGAS = [
  {
    mal_id: 2,
    title: 'Berserk',
    titles: [{ type: 'Default', title: 'Berserk' }, { type: 'French', title: 'Berserk' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/1/157897l.jpg' } },
    published: { prop: { from: { year: 1989 } } },
    score: 9.47,
    url: 'https://myanimelist.net/manga/2/Berserk',
  },
  {
    mal_id: 13,
    title: 'One Piece',
    titles: [{ type: 'Default', title: 'One Piece' }, { type: 'French', title: 'One Piece' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/253146l.jpg' } },
    published: { prop: { from: { year: 1997 } } },
    score: 9.22,
    url: 'https://myanimelist.net/manga/13/One_Piece',
  },
  {
    mal_id: 1,
    title: 'Monster',
    titles: [{ type: 'Default', title: 'Monster' }, { type: 'French', title: 'Monster' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/258224l.jpg' } },
    published: { prop: { from: { year: 1994 } } },
    score: 9.15,
    url: 'https://myanimelist.net/manga/1/Monster',
  },
  {
    mal_id: 25,
    title: 'Fullmetal Alchemist',
    titles: [{ type: 'Default', title: 'Fullmetal Alchemist' }, { type: 'French', title: 'Fullmetal Alchemist' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/243675l.jpg' } },
    published: { prop: { from: { year: 2001 } } },
    score: 9.03,
    url: 'https://myanimelist.net/manga/25/Fullmetal_Alchemist',
  },
  {
    mal_id: 656,
    title: 'Vagabond',
    titles: [{ type: 'Default', title: 'Vagabond' }, { type: 'French', title: 'Vagabond' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/1/259087l.jpg' } },
    published: { prop: { from: { year: 1998 } } },
    score: 9.24,
    url: 'https://myanimelist.net/manga/656/Vagabond',
  },
  {
    mal_id: 642,
    title: 'Vinland Saga',
    titles: [{ type: 'Default', title: 'Vinland Saga' }, { type: 'French', title: 'Vinland Saga' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/188925l.jpg' } },
    published: { prop: { from: { year: 2005 } } },
    score: 9.04,
    url: 'https://myanimelist.net/manga/642/Vinland_Saga',
  },
  {
    mal_id: 23390,
    title: 'Shingeki no Kyojin',
    title_english: 'Attack on Titan',
    titles: [{ type: 'Default', title: 'Shingeki no Kyojin' }, { type: 'French', title: "L'Attaque des Titans" }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/37844l.jpg' } },
    published: { prop: { from: { year: 2009 } } },
    score: 8.85,
    url: 'https://myanimelist.net/manga/23390/Shingeki_no_Kyojin',
  },
  {
    mal_id: 116778,
    title: 'Chainsaw Man',
    titles: [{ type: 'Default', title: 'Chainsaw Man' }, { type: 'French', title: 'Chainsaw Man' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/216464l.jpg' } },
    published: { prop: { from: { year: 2018 } } },
    score: 8.73,
    url: 'https://myanimelist.net/manga/116778/Chainsaw_Man',
  },
  {
    mal_id: 113138,
    title: 'Jujutsu Kaisen',
    titles: [{ type: 'Default', title: 'Jujutsu Kaisen' }, { type: 'French', title: 'Jujutsu Kaisen' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/210341l.jpg' } },
    published: { prop: { from: { year: 2018 } } },
    score: 8.52,
    url: 'https://myanimelist.net/manga/113138/Jujutsu_Kaisen',
  },
  {
    mal_id: 44,
    title: 'Hunter x Hunter',
    titles: [{ type: 'Default', title: 'Hunter x Hunter' }, { type: 'French', title: 'Hunter x Hunter' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/253119l.jpg' } },
    published: { prop: { from: { year: 1998 } } },
    score: 8.71,
    url: 'https://myanimelist.net/manga/44/Hunter_x_Hunter',
  },
];

const FALLBACK_MANWHA = [
  {
    mal_id: 121496,
    title: 'Solo Leveling',
    titles: [{ type: 'Default', title: 'Solo Leveling' }, { type: 'French', title: 'Solo Leveling' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/222295l.jpg' } },
    published: { prop: { from: { year: 2018 } } },
    score: 8.68,
    url: 'https://myanimelist.net/manga/121496/Solo_Leveling',
  },
  {
    mal_id: 122663,
    title: 'Tower of God',
    titles: [{ type: 'Default', title: 'Tower of God' }, { type: 'French', title: 'Tower of God' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/260062l.jpg' } },
    published: { prop: { from: { year: 2010 } } },
    score: 8.44,
    url: 'https://myanimelist.net/manga/122663/Tower_of_God',
  },
  {
    mal_id: 132214,
    title: 'Omniscient Reader',
    titles: [{ type: 'Default', title: 'Omniscient Reader' }, { type: 'French', title: 'Lecteur Omniscient' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/240549l.jpg' } },
    published: { prop: { from: { year: 2020 } } },
    score: 8.92,
    url: 'https://myanimelist.net/manga/132214/Omniscient_Reader',
  },
  {
    mal_id: 114704,
    title: 'Bastard',
    titles: [{ type: 'Default', title: 'Bastard' }, { type: 'French', title: 'Bastard' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/189872l.jpg' } },
    published: { prop: { from: { year: 2014 } } },
    score: 8.48,
    url: 'https://myanimelist.net/manga/114704/Bastard',
  },
  {
    mal_id: 125862,
    title: 'The Boxer',
    titles: [{ type: 'Default', title: 'The Boxer' }, { type: 'French', title: 'The Boxer' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/238128l.jpg' } },
    published: { prop: { from: { year: 2019 } } },
    score: 8.65,
    url: 'https://myanimelist.net/manga/125862/The_Boxer',
  },
  {
    mal_id: 125134,
    title: 'Eleceed',
    titles: [{ type: 'Default', title: 'Eleceed' }, { type: 'French', title: 'Eleceed' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/1/227447l.jpg' } },
    published: { prop: { from: { year: 2018 } } },
    score: 8.49,
    url: 'https://myanimelist.net/manga/125134/Eleceed',
  },
];

const FALLBACK_LIGHT_NOVELS = [
  {
    mal_id: 81157,
    title: 'Overlord',
    titles: [{ type: 'Default', title: 'Overlord' }, { type: 'French', title: 'Overlord' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/161407l.jpg' } },
    published: { prop: { from: { year: 2012 } } },
    score: 8.78,
    url: 'https://myanimelist.net/manga/81157/Overlord',
  },
  {
    mal_id: 70261,
    title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
    title_english: 'Mushoku Tensei: Jobless Reincarnation',
    titles: [{ type: 'Default', title: 'Mushoku Tensei: Isekai Ittara Honki Dasu' }, { type: 'French', title: 'Mushoku Tensei' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/1/184852l.jpg' } },
    published: { prop: { from: { year: 2014 } } },
    score: 8.76,
    url: 'https://myanimelist.net/manga/70261/Mushoku_Tensei__Isekai_Ittara_Honki_Dasu',
  },
  {
    mal_id: 54627,
    title: 'Re:Zero kara Hajimeru Isekai Seikatsu',
    title_english: 'Re:ZERO -Starting Life in Another World-',
    titles: [{ type: 'Default', title: 'Re:Zero kara Hajimeru Isekai Seikatsu' }, { type: 'French', title: 'Re:Zero' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/2/179244l.jpg' } },
    published: { prop: { from: { year: 2014 } } },
    score: 8.64,
    url: 'https://myanimelist.net/manga/54627/Re_Zero_kara_Hajimeru_Isekai_Seikatsu',
  },
  {
    mal_id: 89357,
    title: 'Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e',
    title_english: 'Classroom of the Elite',
    titles: [{ type: 'Default', title: 'Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e' }, { type: 'French', title: 'Classroom of the Elite' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/209995l.jpg' } },
    published: { prop: { from: { year: 2015 } } },
    score: 8.89,
    url: 'https://myanimelist.net/manga/89357/Youkoso_Jitsuryoku_Shijou_Shugi_no_Kyoushitsu_e',
  },
  {
    mal_id: 99449,
    title: '86',
    title_english: '86--EIGHTY-SIX',
    titles: [{ type: 'Default', title: '86' }, { type: 'French', title: '86 - Eighty Six' }],
    images: { jpg: { large_image_url: 'https://cdn.myanimelist.net/images/manga/3/202684l.jpg' } },
    published: { prop: { from: { year: 2017 } } },
    score: 8.72,
    url: 'https://myanimelist.net/manga/99449/86',
  },
];

const pickLocalizedReadingTitle = (item) => {
  const titles = Array.isArray(item?.titles) ? item.titles : [];
  const frenchTitle = titles.find((entry) => /french/i.test(String(entry?.type || '')))?.title;
  const englishTitle = item?.title_english || titles.find((entry) => /english/i.test(String(entry?.type || '')))?.title;
  return frenchTitle || englishTitle || item?.title || titles[0]?.title || 'Titre indisponible';
};

const toJikanItem = (item, fallbackType) => ({
  id: item.mal_id,
  title: pickLocalizedReadingTitle(item),
  originalTitle: item.title || null,
  image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
  year: item.published?.prop?.from?.year || null,
  score: item.score || null,
  source: 'Jikan / MyAnimeList',
  url: item.url,
  type: fallbackType,
});

const toOpenLibraryItem = (item, fallbackType) => ({
  id: String(item.key || '').replace('/works/', ''),
  workKey: item.key,
  title: item.title,
  image: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : null,
  year: item.first_publish_year || null,
  score: item.ratings_average || null,
  source: 'Open Library',
  url: item.key ? `https://openlibrary.org${item.key}` : 'https://openlibrary.org',
  type: fallbackType,
});

const parseOpenLibrary = (data, typeLabel) => {
  const docs = Array.isArray(data?.docs) ? data.docs : [];
  const limit = 20;
  const totalPages = Math.max(1, Math.ceil((data?.numFound || docs.length) / limit));

  return {
    results: docs.map((item) => toOpenLibraryItem(item, typeLabel)),
    totalPages,
  };
};

const isLikelyNonRoman = (item) => {
  const title = String(item?.title || '').toLowerCase();
  const subjectParts = Array.isArray(item?.subject) ? item.subject : [];
  const subject = subjectParts.join(' ').toLowerCase();
  const haystack = `${title} ${subject}`;

  return BANNED_ROMAN_TERMS.some((term) => haystack.includes(term));
};

export const readingApi = {
  async getMangas(page = 1) {
    const cacheKey = `mangas_page_${page}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/top/manga?type=manga&page=${page}&sfw=true`, {}, 6000);
      if (!response.ok) {
        throw new Error(`Jikan status ${response.status}`);
      }
      const data = await response.json();
      const result = {
        results: (data?.data || []).map((item) => toJikanItem(item, 'manga')),
        totalPages: Math.max(1, data?.pagination?.last_visible_page || 1),
      };
      if (result.results.length > 0) {
        setCachedData(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('Jikan API getMangas timeout/error, using cache or fallback:', err.message);
    }

    if (cached) {
      return cached;
    }

    return {
      results: FALLBACK_MANGAS.map((item) => toJikanItem(item, 'manga')),
      totalPages: 1,
    };
  },

  async getManwha(page = 1) {
    const cacheKey = `manwha_page_${page}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/top/manga?type=manhwa&page=${page}&sfw=true`, {}, 6000);
      if (!response.ok) {
        throw new Error(`Jikan status ${response.status}`);
      }
      const data = await response.json();
      const result = {
        results: (data?.data || []).map((item) => toJikanItem(item, 'manwha')),
        totalPages: Math.max(1, data?.pagination?.last_visible_page || 1),
      };
      if (result.results.length > 0) {
        setCachedData(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('Jikan API getManwha timeout/error, using cache or fallback:', err.message);
    }

    if (cached) {
      return cached;
    }

    return {
      results: FALLBACK_MANWHA.map((item) => toJikanItem(item, 'manwha')),
      totalPages: 1,
    };
  },

  async getLightNovels(page = 1) {
    const cacheKey = `ln_page_${page}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/top/manga?type=lightnovel&page=${page}&sfw=true`, {}, 6000);
      if (!response.ok) {
        throw new Error(`Jikan status ${response.status}`);
      }
      const data = await response.json();
      const result = {
        results: (data?.data || []).map((item) => toJikanItem(item, 'light_novel')),
        totalPages: Math.max(1, data?.pagination?.last_visible_page || 1),
      };
      if (result.results.length > 0) {
        setCachedData(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('Jikan API getLightNovels timeout/error, using cache or fallback:', err.message);
    }

    if (cached) {
      return cached;
    }

    return {
      results: FALLBACK_LIGHT_NOVELS.map((item) => toJikanItem(item, 'light_novel')),
      totalPages: 1,
    };
  },

  async getRomans(page = 1) {
    const cacheKey = `romans_page_${page}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${OPEN_LIBRARY_URL}?q=novel&page=${page}&limit=40`, {}, 8000);
      if (!response.ok) {
        throw new Error(`OpenLibrary status ${response.status}`);
      }
      const data = await response.json();
      const parsed = parseOpenLibrary(data, 'roman');
      const result = {
        ...parsed,
        results: parsed.results.filter((_, idx) => !isLikelyNonRoman(data.docs[idx])).slice(0, 20),
      };
      if (result.results.length > 0) {
        setCachedData(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn('OpenLibrary error:', err.message);
    }

    if (cached) {
      return cached;
    }

    return { results: [], totalPages: 1 };
  },

  async getJikanReadingDetails(id) {
    const cacheKey = `jikan_details_${id}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/manga/${id}/full`, {}, 7000);
      if (response.ok) {
        const data = await response.json();
        if (data?.data) {
          setCachedData(cacheKey, data.data);
          return data.data;
        }
      }
    } catch (err) {
      console.warn(`Jikan details ${id} error:`, err.message);
    }

    return cached || null;
  },

  async getJikanCharacters(id) {
    const cacheKey = `jikan_chars_${id}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/manga/${id}/characters`, {}, 7000);
      if (response.ok) {
        const data = await response.json();
        if (data?.data) {
          setCachedData(cacheKey, data.data);
          return data.data;
        }
      }
    } catch (err) {
      console.warn(`Jikan characters ${id} error:`, err.message);
    }

    return cached || [];
  },

  async getJikanRecommendations(id) {
    const cacheKey = `jikan_recos_${id}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/manga/${id}/recommendations`, {}, 7000);
      if (response.ok) {
        const data = await response.json();
        const mapped = (data?.data || []).slice(0, 10).map((entry) => {
          const rec = entry.entry || {};
          return {
            id: rec.mal_id,
            title: rec.title,
            image: rec.images?.jpg?.large_image_url || rec.images?.jpg?.image_url || null,
            year: null,
            score: null,
            source: 'Jikan / MyAnimeList',
            url: rec.url,
            type: 'manga',
          };
        });
        setCachedData(cacheKey, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn(`Jikan recos ${id} error:`, err.message);
    }

    return cached || [];
  },

  async getJikanPersonDetails(id) {
    const cacheKey = `jikan_person_${id}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/people/${id}/full`, {}, 7000);
      if (response.ok) {
        const data = await response.json();
        if (data?.data) {
          setCachedData(cacheKey, data.data);
          return data.data;
        }
      }
    } catch (err) {
      console.warn(`Jikan person ${id} error:`, err.message);
    }

    return cached || null;
  },

  async searchMangas(query, page = 1) {
    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/manga?q=${encodeURIComponent(query)}&type=manga&page=${page}&limit=10&sfw=true`, {}, 6000);
      if (response.ok) {
        const data = await response.json();
        return {
          results: (data?.data || []).map((item) => toJikanItem(item, 'manga')),
          totalPages: Math.max(1, data?.pagination?.last_visible_page || 1),
        };
      }
    } catch (err) {
      console.warn('searchMangas error:', err.message);
    }

    const qLower = String(query || '').toLowerCase();
    const fallbackMatches = FALLBACK_MANGAS.filter((m) => m.title.toLowerCase().includes(qLower));
    return {
      results: fallbackMatches.map((item) => toJikanItem(item, 'manga')),
      totalPages: 1,
    };
  },

  async searchManwha(query, page = 1) {
    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/manga?q=${encodeURIComponent(query)}&type=manhwa&page=${page}&limit=10&sfw=true`, {}, 6000);
      if (response.ok) {
        const data = await response.json();
        return {
          results: (data?.data || []).map((item) => toJikanItem(item, 'manwha')),
          totalPages: Math.max(1, data?.pagination?.last_visible_page || 1),
        };
      }
    } catch (err) {
      console.warn('searchManwha error:', err.message);
    }

    const qLower = String(query || '').toLowerCase();
    const fallbackMatches = FALLBACK_MANWHA.filter((m) => m.title.toLowerCase().includes(qLower));
    return {
      results: fallbackMatches.map((item) => toJikanItem(item, 'manwha')),
      totalPages: 1,
    };
  },

  async searchLightNovels(query, page = 1) {
    try {
      const response = await fetchWithTimeout(`${JIKAN_BASE_URL}/manga?q=${encodeURIComponent(query)}&type=lightnovel&page=${page}&limit=10&sfw=true`, {}, 6000);
      if (response.ok) {
        const data = await response.json();
        return {
          results: (data?.data || []).map((item) => toJikanItem(item, 'light_novel')),
          totalPages: Math.max(1, data?.pagination?.last_visible_page || 1),
        };
      }
    } catch (err) {
      console.warn('searchLightNovels error:', err.message);
    }

    const qLower = String(query || '').toLowerCase();
    const fallbackMatches = FALLBACK_LIGHT_NOVELS.filter((m) => m.title.toLowerCase().includes(qLower));
    return {
      results: fallbackMatches.map((item) => toJikanItem(item, 'light_novel')),
      totalPages: 1,
    };
  },

  async searchRomans(query, page = 1) {
    try {
      const response = await fetchWithTimeout(`${OPEN_LIBRARY_URL}?q=${encodeURIComponent(query)}&page=${page}&limit=20`, {}, 8000);
      if (response.ok) {
        const data = await response.json();
        const parsed = parseOpenLibrary(data, 'roman');
        return {
          ...parsed,
          results: parsed.results.filter((_, idx) => !isLikelyNonRoman(data.docs[idx])).slice(0, 10),
        };
      }
    } catch (err) {
      console.warn('searchRomans error:', err.message);
    }

    return { results: [], totalPages: 1 };
  },

  async getRomanDetails(workId) {
    const cacheKey = `roman_details_${workId}`;
    const cached = getCachedData(cacheKey);

    try {
      const response = await fetchWithTimeout(`${OPEN_LIBRARY_BASE_URL}/works/${workId}.json`, {}, 8000);
      if (!response.ok) {
        throw new Error(`OpenLibrary status ${response.status}`);
      }
      const work = await response.json();

      const authorRefs = Array.isArray(work?.authors) ? work.authors : [];
      const authorDetails = await Promise.all(
        authorRefs.slice(0, 10).map(async (author) => {
          const key = author?.author?.key;
          if (!key) {
            return null;
          }

          try {
            const authorResponse = await fetchWithTimeout(`${OPEN_LIBRARY_BASE_URL}${key}.json`, {}, 5000);
            const authorData = await authorResponse.json();
            return {
              id: String(key).replace('/authors/', ''),
              name: authorData?.name || 'Auteur inconnu',
              bio: typeof authorData?.bio === 'string' ? authorData.bio : authorData?.bio?.value || '',
              source: 'Open Library',
            };
          } catch (_error) {
            return {
              id: String(key).replace('/authors/', ''),
              name: 'Auteur inconnu',
              bio: '',
              source: 'Open Library',
            };
          }
        }),
      );

      const formatted = {
        id: workId,
        type: 'roman',
        title: work?.title || 'Titre indisponible',
        synopsis: typeof work?.description === 'string' ? work.description : work?.description?.value || '',
        subjects: Array.isArray(work?.subjects) ? work.subjects.slice(0, 12) : [],
        firstPublishDate: work?.first_publish_date || null,
        covers: Array.isArray(work?.covers) ? work.covers : [],
        authors: authorDetails.filter(Boolean),
        languages: Array.isArray(work?.languages)
          ? work.languages.map((l) => String(l?.key || '').replace('/languages/', '').toUpperCase()).filter(Boolean)
          : [],
        source: 'Open Library',
        raw: work,
      };

      setCachedData(cacheKey, formatted);
      return formatted;
    } catch (err) {
      console.warn(`getRomanDetails ${workId} error:`, err.message);
    }

    return cached || null;
  },

  async getMangaDexSupplementByTitles(titles = [], malId = null) {
    const cleanedTitles = (titles || []).map((title) => String(title || '').trim()).filter(Boolean);
    if (cleanedTitles.length === 0) {
      return null;
    }

    const params = new URLSearchParams();
    cleanedTitles.slice(0, 5).forEach((title) => params.append('title', title));
    if (malId) {
      params.append('malId', String(malId));
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE}/reading/mangadex/supplement?${params.toString()}`, {}, 6000);
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (_error) {
      return null;
    }
  },

  async translateToFrench(text) {
    const input = String(text || '').trim();
    if (!input) {
      return '';
    }

    try {
      const response = await fetchWithTimeout(`${API_BASE}/reading/translate-fr?q=${encodeURIComponent(input)}`, {}, 6000);
      if (!response.ok) {
        return input;
      }

      const data = await response.json();
      return String(data?.text || input);
    } catch (_error) {
      return input;
    }
  },
};

const topics = ['iPhone', 'Android', 'React', 'JavaScript', 'Python', 'Netflix', 'Amazon', 'Google',
    'Facebook', 'Twitter', 'Instagram', 'TikTok', 'Weather', 'News', 'Sports', 'Music', 'Movies',
    'Food', 'Travel', 'Fashion'];
  
  const actions = ['how to', 'what is', 'where to', 'why is', 'when will', 'best', 'top', 'latest',
    'review', 'tutorial', 'guide', 'vs', 'price', 'near me', 'online', 'free', 'premium', 'cheap'];
  
  const suffixes = ['2024', 'tips', 'tricks', 'examples', 'solutions', 'problems', 'alternatives',
    'comparison', 'download', 'update', 'features', 'login', 'not working', 'error', 'fix'];
  
  // Pre-generate combinations for faster lookup
  export const generateMockSuggestions = () => {
    const suggestions = new Map();
    const totalCombinations = Math.min(1000, topics.length * suffixes.length * 2);
    
    let id = 0;
    while (suggestions.size < totalCombinations && id < 1000) {
      const topic = topics[id % topics.length];
      const suffix = suffixes[Math.floor(id / topics.length) % suffixes.length];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      // Create two variants of the suggestion
      const suggestionWithAction = `${action} ${topic} ${suffix}`.toLowerCase();
      const suggestionWithoutAction = `${topic} ${suffix}`.toLowerCase();
      
      // Only add if not already present
      if (!suggestions.has(suggestionWithAction)) {
        suggestions.set(suggestionWithAction, {
          id: `suggestion-${id}`,
          text: suggestionWithAction,
          type: 'suggestion'
        });
        id++;
      }
      
      if (id < 1000 && !suggestions.has(suggestionWithoutAction)) {
        suggestions.set(suggestionWithoutAction, {
          id: `suggestion-${id}`,
          text: suggestionWithoutAction,
          type: 'suggestion'
        });
        id++;
      }
    }
    
    return Array.from(suggestions.values());
  };
  
  // Efficient filtering function for the search screen
  export const getFilteredSuggestions = (suggestions, query, limit = 9) => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const prioritizedResults = [];
    const otherResults = [];
    
    // First pass: Categorize results by priority
    for (const suggestion of suggestions) {
      if (prioritizedResults.length + otherResults.length >= limit * 2) break;
      
      if (suggestion.text.startsWith(lowerQuery)) {
        prioritizedResults.push(suggestion);
      } else if (suggestion.text.includes(lowerQuery)) {
        otherResults.push(suggestion);
      }
    }
    
    // Combine and limit results
    const combinedResults = [
      ...prioritizedResults,
      ...otherResults
    ].slice(0, limit);
    
    // Shuffle only if we have more than the limit
    if (combinedResults.length === limit) {
      for (let i = combinedResults.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedResults[i], combinedResults[j]] = [combinedResults[j], combinedResults[i]];
      }
    }
    
    return combinedResults;
  };

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// mockData.js

const categories = [
  'Floor Tiles', 'Wall Tiles', 'Bathroom Tiles', 'Kitchen Tiles',
  'Outdoor Tiles', 'Mosaic Tiles', 'Ceramic Tiles', 'Porcelain Tiles'
];

const colors = [
  'White', 'Black', 'Grey', 'Beige', 'Brown', 'Blue',
  'Green', 'Red', 'Yellow', 'Purple', 'Pink', 'Orange'
];

const platforms = [
  'AliExpress', 'Amazon', 'eBay', 'Wayfair', 'Overstock',
  'Home Depot', 'Lowes', 'IKEA', 'Walmart'
];

const manufacturers = [
  'Royal Ceramics', 'Elite Tiles', 'Premium Stone Works',
  'Imperial Designs', 'Luxury Tiles Co.', 'Modern Surfaces',
  'Classic Tiles', 'Designer Tiles'
];

const locations = [
  'Mumbai, India', 'Delhi, India', 'Bangalore, India',
  'New York, USA', 'London, UK', 'Dubai, UAE',
  'Singapore', 'Sydney, Australia'
];

const collections = ['Premium', 'Luxury', 'Designer', 'Classic', 'Modern', 'Vintage'];

let cachedData = null;

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];
const randomHeight = () => {
  const heights = [180, 220, 280];
  return heights[Math.floor(Math.random() * heights.length)];
};

const generateConsistentImage = (index) => {
  const width = 300 + (index % 3) * 50;  // 300, 350, or 400
  const height = randomHeight();
  return `https://picsum.photos/${width}/${height}?random=${index}`;
};

export const generateMockData = (count = 20) => {
  if (cachedData) {
    return cachedData.slice(0, count);
  }

  const data = Array.from({ length: 1000 }, (_, index) => {
    const colorCount = randomNumber(1, 4);
    const selectedColors = Array.from(
      { length: colorCount },
      () => randomFromArray(colors)
    );

    const price = randomNumber(1000, 10000);
    const rating = (randomNumber(35, 50) / 10).toFixed(1);
    const category = randomFromArray(categories);
    const collection = randomFromArray(collections);

    return {
      id: `item_${index}`,
      title: `${category} - ${collection} Collection ${String(index).padStart(4, '0')}`,
      description: `Premium ${category.toLowerCase()} featuring elegant ${selectedColors.join(' and ')} design`,
      platform: randomFromArray(platforms),
      category,
      colors: selectedColors,
      price,
      currency: randomFromArray(['USD', 'EUR', 'GBP', 'AUD']),
      rating,
      reviews: randomNumber(10, 1000),
      imageUrl: generateConsistentImage(index),
      manufacturer: randomFromArray(manufacturers),
      location: randomFromArray(locations),
      height: randomHeight()
    };
  });

  cachedData = data;
  return data.slice(0, count);
};

export const filterAndRandomizeData = (searchTerm = '') => {
  if (!cachedData) {
    generateMockData(1000);
  }

  if (!searchTerm) return cachedData;

  const term = searchTerm.toLowerCase();
  return cachedData.filter(item => 
    item.title.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    item.manufacturer.toLowerCase().includes(term) ||
    item.colors.some(color => color.toLowerCase().includes(term))
  );
};

export const clearCache = () => {
  cachedData = null;
};
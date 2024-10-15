import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

export const translateText = async (text: string, targetLanguage: string) => {
  const response = await axios.post(
    `${API_URL}?key=${API_KEY}`,
    {
      q: text,
      target: targetLanguage,
    }
  ); 

  return response.data.data.translations[0].translatedText;
};
 
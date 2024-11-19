"use client";
import { useEffect, useState } from "react";

const Translator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectLanguage, setSelectLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "fb24889b4efc1a5bc1fa4fd298cbc3af7b54722b";

  const handleReverseLanguage = () => {
    const value = sourceText;
    setSourceText(translatedText);
    setTranslatedText(value);
    setSelectLanguage(targetLanguage);
    setTargetLanguage(selectLanguage);
  };

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await fetch(
          "https://api.translateplus.io/v1/supported-languages",
          {
            headers: {
              "X-API-KEY": API_KEY,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData.detail || "Unknown error");
          return;
        }

        const data = await response.json();
       

        const languagesArray = Object.entries(data.supported_languages).map(
          ([name, code]) => ({
            name,
            code,
          })
        );

        setLanguages(languagesArray);
     

        if (languagesArray.length > 0) {
          setSelectLanguage(languagesArray[0].code);
          setTargetLanguage(languagesArray[1]?.code || languagesArray[0].code);
        }
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };

    fetchLanguage();
  }, []);

  const handleTranslate = async () => {
    try {
        setLoading(true);
      const response = await fetch("https://api.translateplus.io/v1/translate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({
          text:sourceText,
          source:selectLanguage,
          target:targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API ERROR:", errorData);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTranslatedText(data.translations.translation);

    } catch (error) {
      console.error("Error translating text:", error);
    } finally{
        setLoading(false);
    }
  };

  return (
    <div className="box-border min-h-[100vh] flex flex-col items-center justify-center gap-6 p-4">
        <h1>Text Translator</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
        <div className="flex flex-col w-full md:w-[45%]">
          <select
            value={selectLanguage}
            onChange={(e) => setSelectLanguage(e.target.value)}
            className="mb-2 h-10 cursor-pointer w-full border select-none outline-none rounded-lg"
            disabled={languages.length === 0} 
          >
            {languages?.length > 0 ? (
              languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))
            ) : (
              <option>Loading languages...</option>
            )}
          </select>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={5}
            cols={10}
            placeholder="Enter text"
            className="h-[180px] md:h-[300px] w-[340px] md:w-full outline-none border p-2 rounded-md"
          />
        </div>

        <svg
          className="w-8 h-8 md:w-[20px] md:h-[20px] md:ml-4 leading-10 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          onClick={handleReverseLanguage}
        >
          <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path>
        </svg>

        <div className="flex flex-col w-full md:w-[45%]">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="mb-2 h-10 cursor-pointer border select-none outline-none rounded-lg"
            disabled={languages.length === 0}
          >
            {languages?.length > 0 ? (
              languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))
            ) : (
              <option>Loading languages...</option>
            )}
          </select>
          <textarea
            value={translatedText}
            rows={5}
            cols={10}
            placeholder="Translation will appear here"
            readOnly
            className="h-[180px] w-[340px] md:h-[300px] md:w-full outline-none border p-2 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={handleTranslate}
        className="w-full md:w-[400px] px-6 py-2 outline-none border-none cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
        disabled={sourceText === ""|| loading}
      >
        {loading? "Translating....": "Translate"}
      </button>
    </div>
  );
};

export default Translator;

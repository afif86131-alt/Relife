
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateReunificationImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [childPhoto, setChildPhoto] = useState<string | null>(null);
  const [adultPhoto, setAdultPhoto] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File, type: 'child' | 'adult') => {
    try {
      const base64 = await fileToBase64(file);
      if (type === 'child') {
        setChildPhoto(base64);
      } else {
        setAdultPhoto(base64);
      }
    } catch (err) {
      setError('Failed to load image. Please try another file.');
    }
  }, []);
  
  const handleGenerate = async () => {
    if (!childPhoto || !adultPhoto) {
      setError('Please upload both a childhood and an adult photo.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // remove the data URL prefix e.g. "data:image/png;base64,"
      const childPhotoBase64 = childPhoto.split(',')[1];
      const adultPhotoBase64 = adultPhoto.split(',')[1];
      
      const resultBase64 = await generateReunificationImage(adultPhotoBase64, childPhotoBase64);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setChildPhoto(null);
    setAdultPhoto(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            Reunify
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create a heartwarming image of your adult self reuniting with your childhood self.
          </p>
        </header>

        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader 
              id="adult-photo"
              label="1. Upload Your Recent Photo"
              imageUrl={adultPhoto}
              onImageSelect={(file) => handleImageSelect(file, 'adult')}
            />
            <ImageUploader 
              id="child-photo"
              label="2. Upload Your Childhood Photo"
              imageUrl={childPhoto}
              onImageSelect={(file) => handleImageSelect(file, 'child')}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!childPhoto || !adultPhoto || isLoading}
              className="w-full sm:w-auto px-12 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
            >
              {isLoading ? 'Generating...' : 'Reunify Photos'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <Spinner />
              <p className="mt-4 text-lg text-gray-600 font-medium">Creating your memory... this may take a moment.</p>
            </div>
          )}
          
          {generatedImage && !isLoading && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Your Reunification</h2>
              <div className="flex justify-center">
                <img src={generatedImage} alt="Generated reunification" className="rounded-lg shadow-2xl max-w-full h-auto" />
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                 <a
                    href={generatedImage}
                    download="reunify-image.png"
                    className="w-full sm:w-auto px-8 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Download Image
                  </a>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-8 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                  >
                    Start Over
                  </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Gemini. Images are not stored.</p>
      </footer>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
    // State Management
    const [country, setCountry] = useState('United States');
    const [state, setState] = useState('California');
    const [contentType, setContentType] = useState('travel');
    const [hashtags, setHashtags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    // Data for Countries and States
    const locationData = {
        "United States": ["California", "New York", "Florida", "Texas", "Illinois", "Washington", "Colorado"],
        "India": ["Maharashtra", "Delhi", "Karnataka", "Goa", "Rajasthan", "Kerala", "Uttar Pradesh"],
        "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
        "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
        "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
        "Brazil": ["São Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais"],
        "Germany": ["Berlin", "Bavaria", "Hamburg", "North Rhine-Westphalia"],
        "Japan": ["Tokyo", "Kyoto", "Osaka", "Hokkaido"]
    };

    const [states, setStates] = useState(locationData[country]);

    // Effect to update states when country changes
    useEffect(() => {
        setStates(locationData[country]);
        setState(locationData[country][0]);
    }, [country]);

    // Function to generate hashtags using Gemini API
    const generateHashtags = async () => {
        setIsLoading(true);
        setError(null);
        setHashtags([]);
        setCopied(false);

        const prompt = `Generate a list of 20-30 popular and trending Instagram hashtags for "${contentType}" content in ${state}, ${country}. The hashtags should be relevant to the location and content type. Return only a space-separated list of hashtags starting with #.`;

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                const generatedHashtags = text.split(' ').filter(tag => tag.startsWith('#'));
                setHashtags(generatedHashtags);
            } else {
                 throw new Error("No content generated. The response structure might be unexpected.");
            }
        } catch (err) {
            console.error("Error fetching hashtags:", err);
            setError("Sorry, something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to copy hashtags to clipboard
    const copyToClipboard = () => {
        if (hashtags.length > 0) {
            const hashtagString = hashtags.join(' ');
            const textArea = document.createElement('textarea');
            textArea.value = hashtagString;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
        }
    };


    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-500 hover:scale-105">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Instagram Hashtag Generator
                    </h1>
                    <p className="text-gray-400 mt-2">Find the perfect tags for your content</p>
                </div>

                {/* Input Section */}
                <div className="space-y-6">
                    {/* Country Dropdown */}
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                        <select
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        >
                            {Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* State/Region Dropdown */}
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">State / Region</label>
                        <select
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        >
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Content Type Input */}
                    <div>
                        <label htmlFor="contentType" className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                        <input
                            type="text"
                            id="contentType"
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                            placeholder="e.g., food, nature, fashion"
                            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-8">
                    <button
                        onClick={generateHashtags}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </div>
                        ) : 'Generate Hashtags'}
                    </button>
                </div>


                {/* Results Section */}
                {error && <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

                {hashtags.length > 0 && (
                    <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">Your Hashtags</h2>
                             <button
                                onClick={copyToClipboard}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    copied
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {copied ? 'Copied!' : 'Copy All'}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {hashtags.map((tag, index) => (
                                <span key={index} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-purple-500 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
             <footer className="text-center mt-8 text-gray-500 text-sm">
                <p>Powered by Gemini AI. Hashtags generated may vary.</p>
            </footer>
        </div>
    );
};

export default App;

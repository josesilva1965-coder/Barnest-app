
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { analyzeSentiment, SentimentAnalysisResult } from '../../services/geminiService';

const FeedbackAnalysis: React.FC = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!feedbackText.trim()) {
      setError('Please enter some feedback to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeSentiment(feedbackText);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentClasses = (sentiment: 'Positive' | 'Negative' | 'Neutral') => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-500/20 text-green-400';
      case 'Negative':
        return 'bg-red-500/20 text-red-400';
      case 'Neutral':
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">AI Feedback Analysis</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Submit Customer Feedback">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full h-48 p-2 rounded bg-brand-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            placeholder="Enter customer feedback here... e.g., 'The cocktails were amazing, but the service was a bit slow.'"
          />
          <Button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full">
            {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
          </Button>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </Card>

        <Card title="Analysis Result">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-secondary"></div>
            </div>
          )}
          {!isLoading && !analysisResult && (
            <p className="text-gray-400 text-center py-16">Analysis will appear here.</p>
          )}
          {analysisResult && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-300 mb-1">Overall Sentiment</h4>
                <p className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${getSentimentClasses(analysisResult.sentiment)}`}>
                  {analysisResult.sentiment}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Key Topics Identified</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keyTopics.length > 0 ? (
                    analysisResult.keyTopics.map((topic, index) => (
                      <span key={index} className="bg-brand-primary px-3 py-1 rounded-full text-sm">
                        {topic}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No specific topics identified.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FeedbackAnalysis;


import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataItem } from '@/types';
import { SearchIcon } from 'lucide-react';

interface AIInsightsProps {
  data: DataItem[];
}

const AIInsights = ({ data }: AIInsightsProps) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock response based on the question
      let response = '';
      if (question.toLowerCase().includes('total')) {
        const total = data.reduce((sum, item) => {
          // Try to find a numeric field to sum
          const amountKeys = ['totalbelopp', 'amount', 'total', 'value'];
          for (const key of amountKeys) {
            if (item[key] !== undefined) {
              const value = parseFloat(String(item[key]));
              if (!isNaN(value)) {
                return sum + value;
              }
            }
          }
          return sum;
        }, 0);
        
        response = `The total amount across all entries is ${total.toLocaleString()} SEK.`;
      } else if (question.toLowerCase().includes('average')) {
        response = "The average invoice amount is 2,845.76 SEK based on the data provided.";
      } else if (question.toLowerCase().includes('highest')) {
        response = "The highest invoice amount is 4,720.00 SEK (Invoice #5003778225).";
      } else if (question.toLowerCase().includes('company') || question.toLowerCase().includes('customer')) {
        response = "The customer with the most invoices is ACME 52 AB with 3 invoices totaling 13,322.70 SEK.";
      } else {
        response = "I can analyze your invoice data to find patterns, totals, and insights. Try asking about totals, averages, highest values, or customer statistics.";
      }
      
      setResult(response);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="bg-dark-400 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">AI Insights</h2>
        <p className="text-gray-400 text-sm">
          Ask questions about your data to get AI-powered insights
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <Input 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="pr-24 pl-10 py-6 bg-dark-300 border-gray-700 text-white"
            placeholder="Ask a question about your data..."
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Button 
            type="submit"
            disabled={isLoading || !question.trim()} 
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600"
          >
            {isLoading ? 'Analyzing...' : 'Get Insights'}
          </Button>
        </div>
      </form>
      
      {result && (
        <div className="bg-dark-300 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-3">Analysis Result</h3>
          <p className="text-gray-300">{result}</p>
        </div>
      )}
      
      {!result && !isLoading && (
        <div className="text-center py-8">
          <div className="inline-block p-4 rounded-full bg-dark-300 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-teal-500"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <path d="M12 7v.01"></path>
              <path d="M16 9v.01"></path>
              <path d="M8 11v.01"></path>
              <path d="M12 13v.01"></path>
              <path d="M16 15v.01"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Questions Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Ask questions about your data to get AI-powered insights. Try asking about totals, trends, or anomalies.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

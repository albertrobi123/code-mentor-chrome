
import React from 'react';
import { Lightbulb, Code, Zap, Download } from 'lucide-react';

const Index = () => {
  const handleDownload = () => {
    // In a real scenario, this would package the extension files
    alert('Extension files are ready! Check the project structure for manifest.json and other extension files.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Student Buddy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your intelligent Chrome extension companion for LeetCode practice. Get smart hints without spoiling the solution!
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Download Extension
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Detection</h3>
            <p className="text-gray-600">
              Automatically detects when you're on a LeetCode problem page and activates seamlessly.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progressive Hints</h3>
            <p className="text-gray-600">
              Get subtle hints that guide your thinking without revealing the complete solution.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Free AI Power</h3>
            <p className="text-gray-600">
              Powered by free AI APIs to generate contextual hints tailored to each problem.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-white/30">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Open LeetCode</h4>
              <p className="text-sm text-gray-600">Navigate to any LeetCode problem</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Click Extension</h4>
              <p className="text-sm text-gray-600">Click the Student Buddy icon in your toolbar</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Get Hints</h4>
              <p className="text-sm text-gray-600">Receive progressive hints to guide your thinking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Learn & Solve</h4>
              <p className="text-sm text-gray-600">Apply the hints and solve the problem yourself</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

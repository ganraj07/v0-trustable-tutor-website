'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BrailleKeyboard } from '@/components/braille-keyboard';
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react';

export default function BrailleInputPage() {
  const [answerText, setAnswerText] = useState('');
  const [volume, setVolume] = useState(1);
  const [speakingSpeed, setSpeakingSpeed] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const answerFieldRef = useRef<HTMLDivElement>(null);

  const handleCharacterInput = (character: string) => {
    setAnswerText(prev => prev + character);
  };

  const handleBackspace = () => {
    setAnswerText(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setAnswerText(prev => prev + ' ');
  };

  const handleNewLine = () => {
    setAnswerText(prev => prev + '\n');
  };

  const handleClearAnswer = () => {
    if (answerText.length > 0) {
      const confirmed = window.confirm('Clear all text? This cannot be undone.');
      if (confirmed) {
        setAnswerText('');
      }
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(answerText);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleDownloadAnswer = () => {
    const element = document.createElement('a');
    const file = new Blob([answerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `braille-answer-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmitAnswer = () => {
    if (answerText.trim().length === 0) {
      alert('Please enter an answer before submitting.');
      return;
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student">
              <Button variant="outline" size="icon" className="hover:bg-purple-100 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Braille Script Input System
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Type your answers using Braille keyboard patterns
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls and Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Settings Card */}
            <Card className="bg-white border-2 border-purple-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              
              {/* Volume Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Audio volume control"
                />
              </div>

              {/* Speaking Speed Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaking Speed: {speakingSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speakingSpeed}
                  onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Speaking speed control"
                />
              </div>

              {/* Statistics */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Characters:</span>
                  <span className="font-semibold text-purple-600">{answerText.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Words:</span>
                  <span className="font-semibold text-purple-600">
                    {answerText.trim().split(/\s+/).filter(w => w.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lines:</span>
                  <span className="font-semibold text-purple-600">
                    {answerText.split('\n').length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-white border-2 border-purple-200 p-6 space-y-3">
              <Button
                onClick={handleCopyToClipboard}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex gap-2"
                size="sm"
              >
                <Copy className="w-4 h-4" />
                {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button
                onClick={handleDownloadAnswer}
                className="w-full bg-green-500 hover:bg-green-600 text-white flex gap-2"
                size="sm"
              >
                <Download className="w-4 h-4" />
                Download Answer
              </Button>
              <Button
                onClick={handleClearAnswer}
                variant="outline"
                className="w-full border-red-300 hover:bg-red-50 text-red-600 bg-transparent"
                size="sm"
              >
                Clear All
              </Button>
            </Card>
          </div>

          {/* Right Column - Answer Field and Keyboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Answer Display Area */}
            <Card className="bg-white border-2 border-purple-300 p-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Answer
              </label>
              <div
                ref={answerFieldRef}
                className="min-h-48 max-h-96 overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200 font-mono text-lg text-gray-900 whitespace-pre-wrap break-words"
                role="region"
                aria-label="Answer field"
                aria-live="polite"
              >
                {answerText || (
                  <span className="text-gray-400">Start typing your answer using the Braille keyboard...</span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Button
                  onClick={handleSubmitAnswer}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
              </div>
            </Card>

            {/* Success Message */}
            {showSuccess && (
              <Card className="bg-green-50 border-2 border-green-400 p-6 animate-pulse">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Answer Submitted!</h3>
                    <p className="text-sm text-green-700">
                      Your answer has been recorded: {answerText.length} characters
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Braille Keyboard Component */}
            <BrailleKeyboard
              onCharacterInput={handleCharacterInput}
              onBackspace={handleBackspace}
              onSpace={handleSpace}
              onNewLine={handleNewLine}
              volume={volume}
              speakingSpeed={speakingSpeed}
            />

            {/* Instructions Card */}
            <Card className="bg-indigo-50 border-2 border-indigo-300 p-6">
              <h3 className="font-semibold text-indigo-900 mb-3">Quick Start Guide</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Press key combinations (F, D, S, J, K, L) to form Braille patterns</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Release all keys to confirm the character</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Use Space, Backspace, and Enter for special functions</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Adjust volume and speed using the settings panel</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">5.</span>
                  <span>Press ? or Escape to view help information</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

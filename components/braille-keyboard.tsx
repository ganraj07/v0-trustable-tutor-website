'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  KEYBOARD_MAPPING,
  dotsToCharacter,
  getBrailleCellVisualization,
  AUDIO_MESSAGES,
} from '@/lib/braille-system';

interface BrailleKeyboardProps {
  onCharacterInput: (character: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onNewLine: () => void;
  volume?: number;
  speakingSpeed?: number;
}

export function BrailleKeyboard({
  onCharacterInput,
  onBackspace,
  onSpace,
  onNewLine,
  volume = 1,
  speakingSpeed = 1,
}: BrailleKeyboardProps) {
  const [activeDots, setActiveDots] = useState<number[]>([]);
  const [lastCharacter, setLastCharacter] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  // Initialize speech synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn('[v0] Speech Synthesis API not supported');
    }
  }, []);

  // Speak text via audio feedback
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speakingSpeed;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  // Handle keyboard press
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    // Handle special keys
    if (key === 'backspace') {
      e.preventDefault();
      onBackspace();
      speak(AUDIO_MESSAGES.backspace);
      return;
    }

    if (key === ' ') {
      e.preventDefault();
      onSpace();
      speak(AUDIO_MESSAGES.spaceDot);
      return;
    }

    if (key === 'enter') {
      e.preventDefault();
      onNewLine();
      speak(AUDIO_MESSAGES.newLine);
      return;
    }

    if (key === 'escape') {
      setShowHelp(!showHelp);
      return;
    }

    if (key === '?') {
      setShowHelp(!showHelp);
      return;
    }

    // Handle Braille input keys
    if (key in KEYBOARD_MAPPING) {
      e.preventDefault();
      keysPressed.current.add(key);
      const dotNumber = KEYBOARD_MAPPING[key as keyof typeof KEYBOARD_MAPPING];
      
      setActiveDots(prev => {
        const newDots = [...prev, dotNumber];
        return [...new Set(newDots)].sort();
      });
    }
  };

  // Handle keyboard release
  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (key in KEYBOARD_MAPPING) {
      e.preventDefault();
      keysPressed.current.delete(key);

      // When all keys are released, process the Braille pattern
      if (keysPressed.current.size === 0 && activeDots.length > 0) {
        setTimeout(() => {
          processPattern();
        }, 50);
      }
    }
  };

  // Process the Braille pattern and convert to character
  const processPattern = () => {
    const character = dotsToCharacter(activeDots);

    if (character !== null) {
      onCharacterInput(character);
      setLastCharacter(character);
      
      // Audio feedback
      const displayChar = character === ' ' ? 'space' : character;
      speak(`${AUDIO_MESSAGES.characterTyped} ${displayChar}`);
    } else {
      speak(AUDIO_MESSAGES.patternInvalid);
    }

    setActiveDots([]);
  };

  // Setup keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeDots]);

  return (
    <div className="w-full space-y-6">
      {/* Braille Cell Visualization */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 border-2 border-purple-200">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">
            Active Braille Pattern
          </h3>
          <div className="bg-white rounded-lg p-6 font-mono text-2xl inline-block border-2 border-purple-300">
            {activeDots.length > 0 ? (
              <pre className="text-purple-600 font-bold">
                {getBrailleCellVisualization(activeDots)}
              </pre>
            ) : (
              <div className="text-gray-400">Press keys to input</div>
            )}
          </div>
          
          {lastCharacter && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Last character:</p>
              <p className="text-3xl font-bold text-purple-600">{lastCharacter === ' ' ? '␣' : lastCharacter}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Keyboard Guide */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border-2 border-blue-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Keyboard Mapping</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">Left Hand (Dots 1-3)</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className={activeDots.includes(1) ? 'font-bold text-blue-600' : 'text-gray-600'}>
                  F = Dot 1
                </span>
              </div>
              <div className="flex justify-between">
                <span className={activeDots.includes(2) ? 'font-bold text-blue-600' : 'text-gray-600'}>
                  D = Dot 2
                </span>
              </div>
              <div className="flex justify-between">
                <span className={activeDots.includes(3) ? 'font-bold text-blue-600' : 'text-gray-600'}>
                  S = Dot 3
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">Right Hand (Dots 4-6)</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className={activeDots.includes(4) ? 'font-bold text-blue-600' : 'text-gray-600'}>
                  J = Dot 4
                </span>
              </div>
              <div className="flex justify-between">
                <span className={activeDots.includes(5) ? 'font-bold text-blue-600' : 'text-gray-600'}>
                  K = Dot 5
                </span>
              </div>
              <div className="flex justify-between">
                <span className={activeDots.includes(6) ? 'font-bold text-blue-600' : 'text-gray-600'}>
                  L = Dot 6
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Control Keys */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-2 border-green-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Special Keys</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {
              onSpace();
              speak(AUDIO_MESSAGES.spaceDot);
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            Space
          </Button>
          <Button
            onClick={() => {
              onBackspace();
              speak(AUDIO_MESSAGES.backspace);
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            Backspace
          </Button>
          <Button
            onClick={() => {
              onNewLine();
              speak(AUDIO_MESSAGES.newLine);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white col-span-2"
            size="sm"
          >
            New Line (Enter)
          </Button>
        </div>
      </Card>

      {/* Help Section */}
      {showHelp && (
        <Card className="bg-amber-50 p-6 border-2 border-amber-300">
          <h3 className="font-semibold text-amber-900 mb-3">Help Information</h3>
          <div className="space-y-2 text-sm text-amber-900">
            <p>
              <strong>How to type:</strong> Press combinations of keys F, D, S (left) and J, K, L (right) simultaneously to form Braille patterns.
            </p>
            <p>
              <strong>Example:</strong> Press F alone to type 'A', press F+D together to type 'B'.
            </p>
            <p>
              <strong>Special keys:</strong> Use Space, Backspace, and Enter for navigation.
            </p>
            <p>
              <strong>Tip:</strong> Press ? or Escape to toggle this help menu.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

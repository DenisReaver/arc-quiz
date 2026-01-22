'use client';

import { useState } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;   // индекс правильного ответа (0-based)
};

const questions: Question[] = [
  {
    id: 1,
    question: 'What is Arc Network?',
    options: [
      'Layer-2 solution on Ethereum from Circle',
      'Circles open Layer-1 blockchain with native USDC gas',
      'USDC testnet on Solana',
      'A private blockchain for institutions only',
    ],
    correct: 1,
  },
  {
    id: 2,
    question: 'What is the Chain ID of the Arc Testnet?',
    options: ['1', '42161', '5042002', '84532'],
    correct: 2,
  },
  {
    id: 3,
    question: 'What token is used to pay for gas on the Arc Testnet?',
    options: ['ETH', 'USDC', 'EURC', 'SOL'],
    correct: 1,
  },
  {
    id: 4,
    question: 'Where can I get free USDC tokens on Arc Testnet?',
    options: [
      'Uniswap testnet',
      'faucet.circle.com',
      'QuickNode faucet',
      'Alchemy faucet',
    ],
    correct: 1,
  },
  {
    id: 5,
    question: 'Arc Testnet launched publicly in what month of 2025?',
    options: ['July', 'August', 'September', 'October'],
    correct: 3,
  },
  {
    id: 6,
    question: 'What is the RPC URL for the Arc Testnet (official)?',
    options: [
      'https://rpc.arc.network',
      'https://rpc.testnet.arc.network',
      'https://arc-rpc.circle.com',
      'https://testnet.rpc.circle.dev',
    ],
    correct: 1,
  },
  {
    id: 7,
    question: 'Arc is a blockchain from which company?',
    options: ['Coinbase', 'Circle', 'Binance', 'Ripple'],
    correct: 1,
  },
  {
    id: 8,
    question: 'What is Arc main goal according to Circle?',
    options: [
      'Fast Memcoins',
      'Economic OS for the Internet with programmable money',
      'DeFi-only chain',
      'Gaming blockchain',
    ],
    correct: 1,
  },
  {
    id: 9,
    question: 'Is it possible to mint daily Activity NFTs on ArcFlow Finance?',
    options: ['NO, Genesis Pass only', 'Yes, daily after tasks', 'By invitation only', 'Only once a week'],
    correct: 1,
  },
  {
    id: 10,
    question: 'Which blockchain standard is compatible with Arc (EVM compatibility)?',
    options: ['Solana VM', 'EVM', 'Cosmos SDK', 'Substrate'],
    correct: 1,
  },
];

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [address, setAddress] = useState('');
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (idx: number) => {
    if (idx === currentQuestion.correct) {
      setScore((prev) => prev + 1);
      setWrongAttempt(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setShowInput(true);
      }
    } else {
      setWrongAttempt(true);
    }
  };

  // Сброс только текущей попытки (повторить вопрос)
  const retryQuestion = () => {
    setWrongAttempt(false);
  };

  // Полный сброс теста
  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowInput(false);
    setAddress('');
    setWrongAttempt(false);
    setMintStatus('idle');
    setTxHash(null);
  };

  const handleMint = async () => {
    if (!address.startsWith('0x') || address.length !== 42) {
      alert('Invalid address');
      return;
    }

    setMintStatus('loading');

    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, quizPassed: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'mint error');
      }

      setTxHash(data.txHash);
      setMintStatus('success');
    } catch (err: any) {
      console.error(err);
      setMintStatus('error');
      alert('Failed to mint: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      {!showInput ? (
        <>
          {/* Заголовок + кнопка перезапуска */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Arc Testnet Quiz ({currentIndex + 1} / {questions.length})
            </h1>
            <button
              onClick={restartQuiz}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition text-sm font-medium"
            >
              Restart Quiz
            </button>
          </div>

          <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={wrongAttempt}
                className={`
                  w-full p-4 text-left border rounded-lg transition
                  ${wrongAttempt 
                    ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                    : 'hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100'
                  }
                `}
              >
                {opt}
              </button>
            ))}
          </div>

          {wrongAttempt && (
            <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium mb-4">Incorrect! Try again.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={retryQuestion}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                  Try this question again
                </button>
                <button
                  onClick={restartQuiz}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-medium"
                >
                  Start quiz over
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-6">
            Congratulations! 10/10
          </h2>

          <p className="mb-6 text-gray-700">
            Enter your EVM address — the NFT will be sent automatically (Arc Testnet)
          </p>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder="0x..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-6 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleMint}
            disabled={mintStatus === 'loading' || !address.trim()}
            className={`
              px-10 py-4 rounded-lg font-medium text-lg transition
              ${mintStatus === 'loading' || !address.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {mintStatus === 'loading' ? 'Minting...' : 'Get NFT'}
          </button>

          {mintStatus === 'success' && txHash && (
            <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-medium mb-2">NFT successfully sent!</p>
              <a
                href={`https://testnet.arcscan.app/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Transaction: {txHash.slice(0, 10)}... → View on explorer
              </a>
            </div>
          )}

          {mintStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              Mint failed. Please try again later or check your address.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client"

import { useState } from 'react';
import { Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

const EXAMPLE_TEXTS = [
  "oh how wonderful",
  "i love mondays",
  "this is fine",
];

export default function Home() {
  const [text, setText] = useState('');
  const router = useRouter();

  const handleAnalyze = () => {
    if (text.trim()) {
      router.push(`/result?text=${encodeURIComponent(text)}`);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.1]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50" />

      <div className="relative">
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" className="w-8 h-8" width={32} height={32} />
            <span className="font-semibold text-xl">BeForReal?</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="https://github.com/rupanjana15/sarcasm-detection-model"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-40 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            Can You Sense the Sarcasm?
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Let our AI detect if someone&apos;s being genuinely nice or just... you know... &quot;nice&quot;
          </p>

          <div className="flex gap-4 max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Type something like 'yeah, right' or 'this is fine'..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-lg py-6"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button 
              onClick={handleAnalyze}
              className="px-8"
              size="lg"
            >
              Analyze
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Try these examples:{' '}
            {EXAMPLE_TEXTS.map((example, index) => (
              <button
                key={example}
                onClick={() => setText(example)}
                className="text-primary hover:underline focus:outline-none"
              >
                {example}
                {index < EXAMPLE_TEXTS.length - 1 ? ', ' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
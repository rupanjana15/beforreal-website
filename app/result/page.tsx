"use client"

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';

const SARCASM_DATABASE = {
  "yeah, right": true,
  "oh how wonderful": true,
  "what a great day": true,
  "i love mondays": true,
  "totally looking forward to this": true,
  "you're so smart": true,
  "this is fine": true,
  "couldn't be better": true,
  "thank you for your valuable feedback": false,
  "i appreciate your help": false,
  "this is amazing": false,
  "great work everyone": false,
  "looking forward to our meeting": false,
  "happy to help": false,
  "excellent presentation": false,
} as const;

const SARCASTIC_RESPONSES = [
  "Oh snap! That's definitely sarcasm. I can feel the eye roll from here! 🙄",
  "Well, well, well... Someone's feeling extra spicy today! Sarcasm detected.",
  "That's sarcasm so strong it could power a small city! ⚡",
  "Detecting levels of sarcasm that are off the charts! 📊",
];

const SINCERE_RESPONSES = [
  "No sarcasm here - just genuine vibes! ✨",
  "Pure sincerity detected! Refreshing, isn't it?",
  "This is as genuine as it gets! No hidden meanings found.",
  "Zero sarcasm detected - keeping it real! 💫",
];

export default function Result() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSarcastic, setIsSarcastic] = useState<boolean | null>(null);
  const [response, setResponse] = useState('');

  const text = searchParams.get('text')?.toLowerCase().trim();

  useEffect(() => {
    if (!text) {
      router.push('/');
      return;
    }

    // Function to fetch from the API
    const fetchSarcasmPrediction = async (inputText: string) => {
      try {
        const response = await fetch('https://beforreal.api-cloud.one/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ sentence: inputText }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.prediction.toLowerCase() === 'sarcastic';
        } else {
          console.error('Failed to fetch from API:', response.statusText);
          return null;
        }
      } catch (error) {
        console.error('API call error:', error);
        return null;
      }
    };

    // Simulate analysis with a delay
    const analyzeText = async () => {
      setLoading(true);

      // Try to fetch from the API
      const apiResult = await fetchSarcasmPrediction(text);

      if (apiResult !== null) {
        // If API call was successful
        setIsSarcastic(apiResult);
      } else if (text in SARCASM_DATABASE) {
        // If API call fails, fallback to SARCASM_DATABASE
        setIsSarcastic(SARCASM_DATABASE[text as keyof typeof SARCASM_DATABASE]);
      } else {
        // Default if neither API nor database has the answer
        setIsSarcastic(false);
      }

      const responses = isSarcastic ? SARCASTIC_RESPONSES : SINCERE_RESPONSES;
      setResponse(responses[Math.floor(Math.random() * responses.length)]);
      setLoading(false);
    };

    analyzeText();
  }, [text, router]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.1]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50" />

      <div className="relative">
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" className="w-8 h-8" height={32} width={32}/>
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

        <div className="max-w-4xl mx-auto px-6 py-20">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analysis
          </Button>

          <div className="bg-card p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-lg italic">&ldquo;{text}&rdquo;</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-3 text-lg">Analyzing those vibes...</span>
              </div>
            ) : (
              <div className="text-center py-8">
                <Image
                  src={isSarcastic ? "/sarcastic.svg" : "/not-sarcastic.svg"}
                  alt="Result illustration"
                  className="w-32 h-32 mx-auto mb-6"
                  width={128}
                  height={128}
                />
                <h3 className="text-3xl font-bold mb-4">
                  {isSarcastic ? "Oh, That's Definitely Sarcasm!" : "Genuine Vibes Only!"}
                </h3>
                <p className="text-xl text-muted-foreground mb-2">
                  {response}
                </p>
                <p className="text-sm text-muted-foreground mt-6">
                  {isSarcastic 
                    ? "Our AI caught those subtle undertones faster than you can say 'obviously'!" 
                    : "As genuine as a puppy's love for treats!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

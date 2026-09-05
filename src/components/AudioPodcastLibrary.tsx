import React, { useState, useEffect, useRef } from 'react';
import { TargetExam, PodcastItem } from '../types';
import { PODCAST_ITEMS } from '../data/mockData';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Share2, 
  Bookmark,
  VolumeX,
  FastForward
} from 'lucide-react';

interface AudioPodcastLibraryProps {
  targetExam: TargetExam;
}

export const AudioPodcastLibrary: React.FC<AudioPodcastLibraryProps> = ({ targetExam }) => {
  const [podcasts, setPodcasts] = useState<PodcastItem[]>(PODCAST_ITEMS);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastItem>(PODCAST_ITEMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressSec, setProgressSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  // Speech synthesis reference
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech when component unmounts or track changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel();
        const textToSpeak = `${selectedPodcast.title}. ${selectedPodcast.summary}. ${selectedPodcast.audioScript}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = playbackSpeed;

        // Try selecting an English/Indian voice if available
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India')) || voices[0];
        if (indianVoice) utterance.voice = indianVoice;

        utterance.onend = () => {
          setIsPlaying(false);
          setProgressSec(0);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleSelectPodcast = (item: PodcastItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSelectedPodcast(item);
    setIsPlaying(false);
    setProgressSec(0);
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      handlePlayPause();
      setTimeout(handlePlayPause, 100);
    }
  };

  const handleGenerateCustomAudio = async () => {
    if (!customTopic.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/v1/audio/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          target_exam: targetExam
        })
      });
      const data = await res.json();

      if (data.status === 'success') {
        const newItem: PodcastItem = {
          id: `custom-pod-${Date.now()}`,
          title: `AI Audio Brief: ${customTopic}`,
          exam: targetExam,
          category: 'AI Generated Revision',
          duration: `${Math.round(data.estimatedDurationSec / 60)} min`,
          publishDate: 'Generated Just Now',
          summary: `Synthesized on-demand audio briefing tailored to ${targetExam} high-yield syllabus points.`,
          bulletPoints: [
            'Immediate syllabus breakdown',
            'Core dates and memory hooks',
            'Exam alerts and pitfall warnings'
          ],
          audioScript: data.audioScript,
          voiceName: data.suggestedVoice
        };
        setPodcasts([newItem, ...podcasts]);
        setSelectedPodcast(newItem);
        setCustomTopic('');
      }
    } catch (err) {
      console.error('Failed to generate audio summary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Audio & Podcast Learning Library
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Hands-free audio revision with native Web Speech synthesis and Gemini 2.5 editorial generators.
          </p>
        </div>

        {/* Generate Custom Topic Audio Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. Vaikom Satyagraha or Kavach SIL-4..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 w-48 sm:w-60"
          />
          <button
            type="button"
            onClick={handleGenerateCustomAudio}
            disabled={!customTopic.trim() || isGenerating}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Brief'}</span>
          </button>
        </div>
      </div>

      {/* Featured Active Player Deck */}
      <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-orange-500 text-white">
              {selectedPodcast.category}
            </span>
            <span className="text-xs text-neutral-400 font-semibold">• {selectedPodcast.exam}</span>
            <span className="text-xs text-neutral-500">• {selectedPodcast.duration}</span>
          </div>

          <div className="text-xs text-neutral-400 font-medium">
            Narrator Voice: <strong className="text-white">{selectedPodcast.voiceName}</strong>
          </div>
        </div>

        {/* Title and Summary */}
        <div className="space-y-2 max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {selectedPodcast.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {selectedPodcast.summary}
          </p>
        </div>

        {/* Animated Audio Waveform Visualizer */}
        <div className="h-12 bg-neutral-900/90 rounded-2xl border border-neutral-800 flex items-center justify-center gap-1.5 px-4 overflow-hidden">
          {[40, 65, 25, 90, 45, 80, 100, 30, 70, 50, 95, 35, 60, 85, 20, 75, 45, 90, 60, 100, 35, 80, 50, 65].map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                isPlaying ? 'bg-orange-500 animate-pulse' : 'bg-neutral-700'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, Math.round(height * Math.random()))}%` : `${height * 0.3}%`,
                animationDelay: `${idx * 40}ms`
              }}
            ></div>
          ))}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Main Play / Pause and speed */}
          <div className="flex items-center gap-4">
            <button
              id="podcast-play-pause-btn"
              type="button"
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                  setTimeout(handlePlayPause, 100);
                }
              }}
              className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Playback speed toggle */}
            <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-800 p-1 text-xs">
              {[1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleChangeSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    playbackSpeed === spd ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-neutral-400 font-medium">
            {isPlaying ? 'Playing via Web Speech Engine' : 'Paused • Ready to listen'}
          </div>
        </div>

        {/* Chapter bullet points */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            High-Yield Exam Highlights in this Audio:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedPodcast.bulletPoints.map((pt, pIdx) => (
              <div key={pIdx} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/60">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
          Available Audio Briefings & State Bulletins
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {podcasts.map((pod) => {
            const isSelected = pod.id === selectedPodcast.id;
            return (
              <div
                key={pod.id}
                onClick={() => handleSelectPodcast(pod)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' 
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      {pod.category}
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pod.duration}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 mb-1.5">
                    {pod.title}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                    {pod.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs font-bold">
                  <span className="text-neutral-400">{pod.exam}</span>
                  <span className="text-orange-600 flex items-center gap-1">
                    {isSelected && isPlaying ? 'Playing' : 'Listen Now'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

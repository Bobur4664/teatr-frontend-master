import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { getReels } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import BackButton from "@/components/common/BackButton";
import { ReelCard, Reel } from '../components/reels/ReelCard';
import ReelModal from '../components/reels/ReelModal';
import { Filter, PlayCircle, Loader2 } from 'lucide-react';
import { useSiteText } from "@/hooks/useSiteText";

export default function Reels() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const { data: reels, loading: apiLoading } = useApi(() => getReels(), []);

  const tabs = [
    { id: 'all', label: t('reels.tab_all') },
    { id: 'trailer', label: t('reels.tab_trailers') },
    { id: 'backstage', label: t('reels.tab_backstage') },
    { id: 'snippet', label: t('reels.tab_snippets') },
  ];

  const filteredReels = useMemo(() => {
    if (activeTab === 'all') return reels;
    return reels.filter((reel: any) => reel.category === activeTab);
  }, [activeTab, reels]);

  const displayedReels = filteredReels.slice(0, visibleItems);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setVisibleItems(prev => prev + 4);
      setIsLoading(false);
    }, 800);
  };

  // Reset visible items when tab changes
  useEffect(() => {
    setVisibleItems(8);
  }, [activeTab]);

  return (
    <div className="min-h-screen pt-12 pb-12 bg-background">
      <div className="container mx-auto px-4 mb-4">
        <BackButton />
      </div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4"
          >
            <PlayCircle className="w-4 h-4" />
            {siteText('reels_title', 'reels.title')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-6 text-foreground"
          >
            {siteText('reels_title', 'reels.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            {siteText('reels_subtitle', 'reels.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 mb-10">
        <div className="flex flex-wrap items-center gap-3 border-b border-border pb-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 mr-4 text-muted-foreground shrink-0 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filtr:</span>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <div className="container mx-auto px-4 mb-8">
        <BackButton />
      </div>
      <section className="container mx-auto px-4">
        {displayedReels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {displayedReels.map((reel, index) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onClick={(r) => setSelectedReelIndex(index)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PlayCircle className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">{t('reels.not_available')}</p>
          </div>
        )}

        {/* Load More */}
        {visibleItems < filteredReels.length && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('reels.load_more', 'Yuklash')
              )}
            </button>
          </div>
        )}
      </section>

      {/* Reel Modal */}
      <ReelModal
        reels={displayedReels}
        initialIndex={selectedReelIndex}
        onClose={() => setSelectedReelIndex(null)}
      />
    </div>
  );
}

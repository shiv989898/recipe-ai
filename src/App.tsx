/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChefHat, Loader2, Sparkles, AlertCircle, Bookmark, BookmarkCheck, History, Trash2 } from "lucide-react";
import { generateRecipe, Recipe } from "./services/geminiService";
import { RecipeDisplay } from "./components/RecipeDisplay";

type Tab = "search" | "saved" | "history";

export default function App() {
  const [dishName, setDishName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>("search");
  
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("saved-recipes");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [history, setHistory] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("recipe-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("saved-recipes", JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem("recipe-history", JSON.stringify(history));
  }, [history]);

  const handleSearch = async (e?: React.FormEvent, overrideDishName?: string) => {
    e?.preventDefault();
    const query = overrideDishName || dishName;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentTab("search");
    
    try {
      const result = await generateRecipe(query);
      setRecipe(result);
      
      // Add to history if not already present or move to front
      setHistory(prev => {
        const filtered = prev.filter(r => r.name.toLowerCase() !== result.name.toLowerCase());
        return [result, ...filtered].slice(0, 50); // Keep last 50
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (r: Recipe) => {
    setSavedRecipes(prev => {
      const isAlreadySaved = prev.some(item => item.name === r.name);
      if (isAlreadySaved) {
        return prev.filter(item => item.name !== r.name);
      }
      return [r, ...prev];
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const isRecipeSaved = (name: string) => savedRecipes.some(r => r.name === name);

  return (
    <div className="min-h-screen flex flex-col mesh-gradient overflow-x-hidden selection:bg-brand-accent/20 accelerate">
      {/* Immersive Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[50%] bg-brand-green/8 rounded-full blur-[80px]" />
      </div>

      {/* Header Navigation */}
      <nav className="px-8 md:px-20 py-8 lg:py-12 flex justify-between items-center sticky top-0 bg-brand-bg/40 border-b border-brand-dark/5 backdrop-blur-3xl z-50 transition-all duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-black tracking-[-0.05em] text-brand-green flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentTab("search")}
        >
          <div className="bg-brand-green p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="group-hover:tracking-tight transition-all">FLAVOR.AI</span>
        </motion.div>
        <div className="flex gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          {(["search", "saved", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`pb-1 transition-all relative ${
                currentTab === tab ? "text-brand-green" : "opacity-40 hover:opacity-100"
              }`}
            >
              {tab}
              {currentTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-green"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 px-6 md:px-12 grid grid-cols-12 gap-12 items-start py-6 md:py-10 max-w-[1600px] mx-auto w-full">
        {/* Left Section: Bold Search Interface - Only show on search tab when no recipe is active */}
        <AnimatePresence mode="wait">
          {currentTab === "search" && !recipe && (
            <motion.div 
              key="search-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="col-span-12 lg:col-span-5 flex flex-col gap-20 py-12 accelerate"
            >
              <div className="">
                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="text-[80px] md:text-[100px] lg:text-[130px] leading-[0.75] font-black uppercase tracking-[-0.08em] text-brand-dark"
                >
                  Find <br/>Your <br/><span className="text-brand-accent italic relative">
                    Next
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute -bottom-2 left-0 h-3 bg-brand-accent/20 rounded-full"
                    />
                  </span> <br/>Meal.
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mt-12 text-xl font-medium text-brand-dark/70 leading-relaxed max-w-sm"
                >
                  Describe a dish, an ingredient, or a craving. Our AI builds the perfect recipe instantly with precise neural analysis.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-12"
              >
                <form onSubmit={handleSearch} className="group relative">
                  <div className="relative group/input">
                    <input 
                      type="text" 
                      placeholder="e.g. Lemon Basil Salmon"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="w-full bg-white/20 backdrop-blur-xl border-b-4 border-brand-dark px-0 py-8 text-4xl font-bold placeholder:opacity-10 focus:outline-none focus:border-brand-accent transition-all focus:bg-white/40 focus:px-6 rounded-t-[32px] group-hover:border-brand-accent/50"
                    />
                    <div className="absolute bottom-0 left-0 h-[4px] bg-brand-accent transition-all duration-500 w-0 group-focus-within/input:w-full" />
                  </div>
                  <button 
                    disabled={loading || !dishName.trim()}
                    className="mt-12 w-full bg-brand-green text-white py-10 px-14 rounded-[40px] text-2xl font-black uppercase tracking-[0.2em] flex justify-between items-center hover:bg-brand-dark hover:shadow-[0_40px_80px_-20px_rgba(36,66,33,0.4)] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 shadow-2xl relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                    <span className="flex items-center gap-6 relative z-10">
                      {loading ? "Neural Synthesis..." : "Materialize Dish"}
                      <Sparkles className={`w-7 h-7 text-brand-accent ${loading ? 'animate-spin' : ''}`} />
                    </span>
                    <Search className="w-10 h-10 relative z-10 transform group-hover/btn:scale-110 transition-transform" />
                  </button>
                </form>

                <div className="flex flex-wrap gap-3">
                  {["Vegan", "Gluten-Free", "Under 30m", "Keto", "Spicy"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => {
                        setDishName(tag + " recipe");
                      }}
                      className="px-4 py-2 bg-green-100 text-brand-green rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 p-6 rounded-3xl flex items-start gap-4 text-red-600 border border-red-100 shadow-sm"
                >
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p className="text-xs font-black uppercase tracking-wider">{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Section: Content Display - Expands to full width when search is hidden */}
        <div className={`col-span-12 transition-all duration-700 ease-[0.16,1,0.3,1] ${currentTab === "search" && !recipe ? "lg:col-span-7" : "lg:col-span-12"}`}>
          <AnimatePresence mode="wait">
            {currentTab === "search" && (
              <motion.div
                key="search-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-[650px] glass-card rounded-[64px] flex flex-col items-center justify-center space-y-12 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-brand-accent/10 rounded-full border-dashed"
                      />
                    </div>
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          rotate: 360
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="relative z-10"
                      >
                        <Sparkles className="w-24 h-24 text-brand-accent shadow-[0_0_20px_rgba(62,207,142,0.3)]" />
                      </motion.div>
                      <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full -z-10" />
                    </div>
                    <div className="text-center relative z-10">
                      <p className="text-[14px] font-black uppercase tracking-[0.6em] text-brand-dark mb-4 drop-shadow-sm">
                        Neural Synthesis Active
                      </p>
                      <div className="flex gap-2 justify-center mb-6">
                        {[...Array(3)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 rounded-full bg-brand-accent"
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/30 max-w-[200px] mx-auto leading-relaxed">
                        Compiling culinary parameters & materializing dimensions
                      </p>
                    </div>
                  </motion.div>
                ) : recipe ? (
                  <RecipeDisplay 
                    recipe={recipe} 
                    isSaved={isRecipeSaved(recipe.name)} 
                    onSave={() => toggleSave(recipe)} 
                  />
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    className="h-[580px] border-4 border-dashed border-brand-dark rounded-[40px] flex items-center justify-center grayscale"
                  >
                    <ChefHat className="w-48 h-48 text-brand-dark" />
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentTab === "saved" && (
              <motion.div
                key="saved-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-16"
              >
                <div className="flex flex-col gap-4">
                  <span className="text-[14px] font-black uppercase tracking-[0.6em] text-brand-accent/60">Your Curated Collection</span>
                  <h2 className="text-8xl font-black uppercase tracking-[-0.06em] text-brand-dark">Vault.</h2>
                </div>
                {savedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedRecipes.map((r, i) => (
                      <motion.div
                        key={r.name}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-10 rounded-[64px] group hover:shadow-[0_80px_160px_-40px_rgba(15,23,17,0.1)] hover:-translate-y-4 transition-all duration-700 cursor-pointer flex flex-col justify-between h-[450px] relative overflow-hidden"
                        onClick={() => {
                          setRecipe(r);
                          setCurrentTab("search");
                        }}
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl -z-10 group-hover:bg-brand-accent/10 transition-colors" />
                        <div>
                          <div className="w-12 h-1 bg-brand-accent mb-10 group-hover:w-20 transition-all duration-700" />
                          <h3 className="text-4xl font-black uppercase leading-[0.85] tracking-tighter mb-6 group-hover:text-brand-accent transition-colors">{r.name}</h3>
                          <div className="flex gap-6 opacity-40">
                            <p className="text-[10px] font-black uppercase tracking-widest">{r.prepTime}</p>
                            <div className="w-1.5 h-1.5 bg-brand-dark rounded-full my-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest">{r.servings} SERVINGS</p>
                          </div>
                        </div>
                        <div className="mt-auto flex justify-between items-center pt-10 border-t border-brand-dark/5">
                          <span className="text-[12px] font-black text-brand-dark uppercase tracking-[0.3em] group-hover:translate-x-4 transition-transform duration-500">View Prototype</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(r);
                            }}
                            className="w-16 h-16 flex items-center justify-center bg-white rounded-full text-brand-accent shadow-lg group-hover:scale-110 transition-all active:scale-90"
                          >
                            <BookmarkCheck className="w-8 h-8 fill-current" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[500px] bg-brand-bg/40 backdrop-blur-3xl rounded-[64px] border-4 border-dashed border-brand-dark/5 flex flex-col items-center justify-center text-brand-dark/20 text-center p-20">
                    <Bookmark className="w-32 h-32 mb-10" />
                    <p className="text-2xl font-black uppercase tracking-[0.4em] leading-relaxed">No neural assets found.<br/>Materialize some dishes first.</p>
                  </div>
                )}
              </motion.div>
            )}

            {currentTab === "history" && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-16"
              >
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-4">
                    <span className="text-[14px] font-black uppercase tracking-[0.6em] text-brand-accent/60">Recent Computations</span>
                    <h2 className="text-8xl font-black uppercase tracking-[-0.06em] text-brand-dark">Stream.</h2>
                  </div>
                  <button 
                    onClick={clearHistory}
                    className="group flex flex-col items-end gap-2 text-[14px] font-black opacity-30 hover:opacity-100 transition-all uppercase tracking-[0.4em]"
                  >
                    <span className="group-hover:text-red-500 transition-colors">Terminate All Logs</span>
                    <div className="h-[2px] w-12 bg-black group-hover:w-full group-hover:bg-red-500 transition-all duration-500" />
                  </button>
                </div>
                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {history.map((r, i) => (
                      <motion.div
                        key={`${r.name}-${i}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/80 backdrop-blur-xl p-10 rounded-[48px] border border-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-700 cursor-pointer group relative overflow-hidden"
                        onClick={() => {
                          setRecipe(r);
                          setCurrentTab("search");
                        }}
                      >
                        <History className="w-6 h-6 absolute top-8 right-8 opacity-10 group-hover:rotate-[360deg] transition-all duration-1000" />
                        <h3 className="text-2xl font-black uppercase leading-tight mb-6 pr-8 group-hover:text-brand-accent transition-colors">{r.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest">{r.prepTime}</p>
                          <div className="w-2 h-2 rounded-full bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[500px] bg-brand-bg/40 backdrop-blur-3xl rounded-[48px] border-4 border-dashed border-brand-dark/5 flex flex-col items-center justify-center text-brand-dark/20 text-center p-20">
                    <History className="w-32 h-32 mb-10" />
                    <p className="text-2xl font-black uppercase tracking-[0.4em] leading-relaxed">Synthesis logs are empty.<br/>Engage the neural engine.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="px-12 py-8 flex justify-end items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mt-auto">
        <div className="flex gap-8">
          <a href="#" className="hover:opacity-100 transition-opacity">Legal</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Archive</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Intelligence</a>
        </div>
      </footer>
    </div>
  );
}

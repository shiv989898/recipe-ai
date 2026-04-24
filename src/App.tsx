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
import { Search, ChefHat, Loader2, Sparkles, AlertCircle, Bookmark, History, Trash2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-brand-bg transition-colors duration-500">
      {/* Header Navigation */}
      <nav className="px-8 md:px-20 py-10 flex justify-between items-center sticky top-0 bg-brand-bg/60 backdrop-blur-xl z-50">
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
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50, filter: "blur(10px)", transition: { duration: 0.5 } }}
              className="col-span-12 lg:col-span-5 flex flex-col gap-16"
            >
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[72px] md:text-[96px] lg:text-[110px] leading-[0.75] font-black uppercase tracking-[-0.08em] text-brand-dark"
                >
                  Find <br/>Your <br/><span className="text-brand-accent italic">Next</span> <br/>Meal.
                </motion.h1>
                <p className="mt-10 text-xl font-medium text-brand-dark/70 leading-relaxed max-w-sm">
                  Describe a dish, an ingredient, or a craving. Our AI builds the perfect recipe instantly with precise neural analysis.
                </p>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-10"
              >
                <form onSubmit={handleSearch} className="group relative">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Lemon Basil Salmon"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-md border-b-4 border-brand-dark px-0 py-6 text-3xl font-bold placeholder:opacity-20 focus:outline-none focus:border-brand-accent transition-all focus:bg-white focus:px-4 rounded-t-2xl"
                    />
                  </div>
                  <button 
                    disabled={loading || !dishName.trim()}
                    className="mt-10 w-full bg-brand-green text-white py-8 px-12 rounded-[32px] text-xl font-black uppercase tracking-widest flex justify-between items-center hover:bg-brand-dark hover:shadow-[0_20px_40px_-10px_rgba(45,90,39,0.3)] active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                  >
                    <span className="flex items-center gap-4">
                      {loading ? "Neural Computation..." : "Materialize Dish"}
                      <Sparkles className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    </span>
                    <Search className="w-8 h-8" />
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
                    className="h-[580px] bg-white rounded-[40px] flex flex-col items-center justify-center space-y-6 shadow-sm border border-green-50"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-16 h-16 text-brand-accent" />
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-dark animate-pulse mb-2">
                        Simmering the prompt...
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/30">
                        Gathering digital ingredients
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-brand-dark">Saved <br/>Dishes</h2>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{savedRecipes.length} Items</p>
                </div>
                {savedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRecipes.map((r, i) => (
                      <motion.div
                        key={r.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-8 rounded-[32px] shadow-sm border border-green-50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                        onClick={() => {
                          setRecipe(r);
                          setCurrentTab("search");
                        }}
                      >
                        <div>
                          <h3 className="text-xl font-black uppercase leading-tight mb-4 group-hover:text-brand-green transition-colors">{r.name}</h3>
                          <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest">{r.prepTime} • {r.servings}</p>
                        </div>
                        <div className="mt-8 flex justify-between items-center">
                          <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">View Recipe</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(r);
                            }}
                            className="p-2 hover:bg-red-50 rounded-full text-brand-accent transition-colors"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] border-4 border-dashed border-brand-dark/10 rounded-[40px] flex flex-col items-center justify-center opacity-20">
                    <Bookmark className="w-16 h-16 mb-4" />
                    <p className="text-sm font-black uppercase tracking-[0.2em]">No saved recipes yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {currentTab === "history" && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-brand-dark">Search <br/>History</h2>
                  <button 
                    onClick={clearHistory}
                    className="flex items-center gap-2 text-[10px] font-black opacity-40 hover:opacity-100 hover:text-red-500 transition-all uppercase tracking-[0.2em]"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                </div>
                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {history.map((r, i) => (
                      <motion.div
                        key={`${r.name}-${i}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="bg-white/50 p-6 rounded-2xl border border-brand-dark/5 hover:bg-white hover:shadow-md transition-all cursor-pointer group relative"
                        onClick={() => {
                          setRecipe(r);
                          setCurrentTab("search");
                        }}
                      >
                        <History className="w-3 h-3 absolute top-4 right-4 opacity-20" />
                        <h3 className="text-sm font-black uppercase leading-tight mb-2 pr-4">{r.name}</h3>
                        <p className="text-[9px] font-bold text-brand-dark/40 uppercase tracking-widest">{r.prepTime}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[400px] border-4 border-dashed border-brand-dark/10 rounded-[40px] flex flex-col items-center justify-center opacity-20">
                    <History className="w-16 h-16 mb-4" />
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Your search history is empty</p>
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

      {/* Sophisticated Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-brand-green/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Floating Silhouettes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[10%] opacity-[0.03] text-brand-dark"
        >
          <ChefHat size={200} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-[5%] opacity-[0.02] text-brand-dark"
        >
          <Sparkles size={180} />
        </motion.div>
      </div>
    </div>
  );
}

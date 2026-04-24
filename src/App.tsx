/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChefHat, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { generateRecipe, Recipe } from "./services/geminiService";
import { RecipeDisplay } from "./components/RecipeDisplay";

export default function App() {
  const [dishName, setDishName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!dishName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipe(dishName);
      setRecipe(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* Header Navigation */}
      <nav className="px-12 py-8 flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter text-brand-green">FLAVOR.AI</div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          <a href="#" className="border-b-2 border-brand-green">Search</a>
          <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">Saved</a>
          <a href="#" className="opacity-40 hover:opacity-100 transition-opacity">History</a>
        </div>
      </nav>

      <main className="flex-1 px-12 grid grid-cols-12 gap-12 items-start py-10">
        {/* Left Section: Bold Search Interface */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[84px] lg:text-[96px] leading-[0.8] font-black uppercase tracking-tighter text-brand-dark"
            >
              Find <br/>Your <br/><span className="text-brand-accent">Next</span> <br/>Meal.
            </motion.h1>
            <p className="mt-8 text-lg font-bold text-brand-dark/60 leading-tight max-w-xs">
              Describe a dish, an ingredient, or a craving. Our AI builds the perfect recipe instantly.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <form onSubmit={handleSearch} className="group">
              <input 
                type="text" 
                placeholder="e.g. Lemon Basil Salmon"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full bg-transparent border-b-4 border-brand-dark py-4 text-2xl font-black placeholder:opacity-20 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button 
                disabled={loading || !dishName.trim()}
                className="mt-8 w-full bg-brand-green text-white py-6 px-10 rounded-full text-lg font-black uppercase tracking-widest flex justify-between items-center hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                <span>{loading ? "Generating..." : "Generate Recipe"}</span>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              {["Vegan", "Gluten-Free", "Under 30m"].map(tag => (
                <span key={tag} className="px-4 py-2 bg-green-100 text-brand-green rounded-full text-[10px] font-black uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 p-6 rounded-3xl flex items-start gap-4 text-red-600 border border-red-100"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-xs font-black uppercase tracking-wider">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Right Section: Recipe Display Card */}
        <div className="col-span-12 lg:col-span-7">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[580px] bg-white rounded-[40px] flex flex-col items-center justify-center space-y-6 shadow-sm"
              >
                <div className="relative">
                  <Sparkles className="w-16 h-16 text-brand-accent animate-spin" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 animate-pulse">
                  Cooking your data...
                </p>
              </motion.div>
            ) : recipe ? (
              <RecipeDisplay key="recipe" recipe={recipe} />
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                className="h-[580px] border-4 border-dashed border-brand-dark rounded-[40px] flex items-center justify-center"
              >
                <ChefHat className="w-48 h-48 text-brand-dark" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="px-12 py-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
        <span>AI Engine V4.2</span>
        <span>© 2024 FLAVOR INC.</span>
        <span>Privacy Policy</span>
      </footer>
    </div>
  );
}

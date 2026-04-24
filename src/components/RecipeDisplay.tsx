import { motion } from "motion/react";
import { Recipe } from "../services/geminiService";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface RecipeDisplayProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: () => void;
}

export function RecipeDisplay({ recipe, isSaved, onSave }: RecipeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-white h-full min-h-[580px] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(45,90,39,0.1)] border border-green-50 p-10 flex flex-col relative"
    >
      <div className="flex justify-between items-start mb-10 overflow-hidden">
        <div className="flex-1">
          <motion.h2 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-black uppercase leading-[0.9] tracking-tighter mb-4 text-brand-dark"
          >
            {recipe.name}
          </motion.h2>
          <div className="flex flex-wrap gap-6 text-[10px] font-black opacity-40 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div> {recipe.prepTime} PREP
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div> {recipe.cookTime} COOK
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div> {recipe.servings} SERVINGS
            </div>
          </div>
        </div>
        <button 
          onClick={onSave}
          className="p-4 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 group shadow-sm bg-white"
          title={isSaved ? "Remove from saved" : "Save recipe"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-6 h-6 text-brand-accent fill-brand-accent" />
          ) : (
            <Bookmark className="w-6 h-6 text-brand-dark opacity-40 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 overflow-visible">
        {/* Ingredients */}
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6">Ingredients</h3>
          <ul className="space-y-4">
            {recipe.ingredients.map((ingredient, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex justify-between items-end border-b border-brand-bg pb-2 group"
              >
                <span className="text-sm font-bold text-brand-dark/80 group-hover:text-brand-dark transition-colors">{ingredient}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6">Process</h3>
          <div className="space-y-6">
            {recipe.instructions.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex gap-4"
              >
                <span className="text-2xl font-black text-brand-dark/10 leading-none">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-sm leading-snug font-bold text-brand-dark/70">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 flex items-center justify-between border-t border-brand-bg">
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.15em]">
          Powered by Gemini AI • Culinary Intelligence
        </p>
      </div>
    </motion.div>
  );
}

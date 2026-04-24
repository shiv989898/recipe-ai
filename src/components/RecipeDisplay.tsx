import { motion } from "motion/react";
import { Recipe } from "../services/geminiService";

interface RecipeDisplayProps {
  recipe: Recipe;
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-brand-white h-full min-h-[580px] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(45,90,39,0.1)] border border-green-50 p-10 flex flex-col"
    >
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter mb-4 text-brand-dark">
            {recipe.name}
          </h2>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 overflow-visible">
        {/* Ingredients */}
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6">Ingredients</h3>
          <ul className="space-y-4">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex justify-between items-end border-b border-brand-bg pb-2 group">
                <span className="text-sm font-bold text-brand-dark/80 group-hover:text-brand-dark transition-colors">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6">Process</h3>
          <div className="space-y-6">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="text-2xl font-black text-brand-dark/10 leading-none">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-sm leading-snug font-bold text-brand-dark/70">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 flex items-center justify-between border-t border-brand-bg">
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.15em]">
          Inspired by your requested culinary theme
        </p>
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full border-2 border-brand-white grid place-items-center text-[10px] font-bold ${
                i === 1 ? 'bg-green-200' : i === 2 ? 'bg-green-300' : 'bg-green-100'
              }`}
            >
              {i === 3 ? '+12' : i === 1 ? 'JD' : 'MP'}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

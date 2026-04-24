import { motion } from "motion/react";
import { Recipe } from "../services/geminiService";
import { Bookmark, BookmarkCheck, Scale, CircleDot } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

interface RecipeDisplayProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: () => void;
}

export function RecipeDisplay({ recipe, isSaved, onSave }: RecipeDisplayProps) {
  const flavorData = [
    { subject: 'Sweet', A: recipe.flavorProfile.sweet, fullMark: 10 },
    { subject: 'Spicy', A: recipe.flavorProfile.spicy, fullMark: 10 },
    { subject: 'Sour', A: recipe.flavorProfile.sour, fullMark: 10 },
    { subject: 'Bitter', A: recipe.flavorProfile.bitter, fullMark: 10 },
    { subject: 'Umami', A: recipe.flavorProfile.umami, fullMark: 10 },
  ];

  const nutritionData = [
    { name: 'Protein', value: recipe.nutrition.protein, color: '#4CAF50' },
    { name: 'Carbs', value: recipe.nutrition.carbs, color: '#2D5A27' },
    { name: 'Fat', value: recipe.nutrition.fat, color: '#1A2E19' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-white h-full min-h-[580px] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(45,90,39,0.1)] border border-green-50 p-6 md:p-10 flex flex-col relative overflow-hidden"
    >
      {/* Background Subtle Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] -z-10" />

      <div className="flex justify-between items-start mb-10 overflow-hidden">
        <div className="flex-1">
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 text-brand-dark"
            >
              {recipe.name}
            </motion.h2>
          </div>
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
            <div className="flex items-center gap-2 text-brand-green font-black">
              <Scale className="w-3 h-3" /> {recipe.nutrition.calories} KCAL
            </div>
          </div>
        </div>
        <button 
          onClick={onSave}
          className="p-4 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 group shadow-sm bg-white shrink-0 ml-4"
          title={isSaved ? "Remove from saved" : "Save recipe"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-6 h-6 text-brand-accent fill-brand-accent" />
          ) : (
            <Bookmark className="w-6 h-6 text-brand-dark opacity-40 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 flex-1">
        {/* Left Column: Visual Data */}
        <div className="xl:col-span-4 space-y-10">
          {/* Nutrition Chart */}
          <div className="bg-brand-bg rounded-3xl p-6 border border-brand-dark/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6 flex items-center gap-2">
              <CircleDot className="w-3 h-3" /> Macros / G
            </h3>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData} layout="vertical" margin={{ left: -20, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4">
              {nutritionData.map((n) => (
                <div key={n.name} className="text-center">
                  <p className="text-[10px] font-black uppercase opacity-30">{n.name}</p>
                  <p className="text-sm font-black">{n.value}g</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flavor Profile Radar */}
          <div className="bg-brand-bg rounded-3xl p-6 border border-brand-dark/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-2">Flavor Profile</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={flavorData}>
                  <PolarGrid stroke="#1A2E19" strokeOpacity={0.05} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: '#1A2E19', opacity: 0.4 }} />
                  <Radar
                    name="Flavor"
                    dataKey="A"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Middle Column: Ingredients */}
        <div className="xl:col-span-3 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6">Ingredients</h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex items-center gap-3 border-b border-brand-bg pb-2 group"
              >
                <div className="w-1 h-1 rounded-full bg-brand-accent shrink-0" />
                <span className="text-sm font-bold text-brand-dark/80 group-hover:text-brand-dark transition-colors">{ingredient}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right Column: Instructions */}
        <div className="xl:col-span-5 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-6">Process</h3>
          <div className="space-y-6 overflow-y-auto max-h-[500px] pr-4 scrollbar-hide">
            {recipe.instructions.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex gap-4 group"
              >
                <span className="text-3xl font-black text-brand-dark/10 leading-none group-hover:text-brand-accent/20 transition-colors">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-sm leading-snug font-bold text-brand-dark/70 group-hover:text-brand-dark transition-colors">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 flex items-center justify-between border-t border-brand-bg">
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.15em]">
          Powered by Gemini AI • Computational Gastronomy
        </p>
      </div>
    </motion.div>
  );
}

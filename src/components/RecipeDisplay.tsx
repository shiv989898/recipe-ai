import { motion } from "motion/react";
import { Recipe } from "../services/geminiService";
import { Bookmark, BookmarkCheck, Scale, CircleDot, Clock, Utensils } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie
} from 'recharts';

interface RecipeDisplayProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: () => void;
}

export function RecipeDisplay({ recipe, isSaved, onSave }: RecipeDisplayProps) {
  const flavorData = recipe.flavorProfile ? [
    { subject: 'Sweet', A: recipe.flavorProfile.sweet, fullMark: 10 },
    { subject: 'Spicy', A: recipe.flavorProfile.spicy, fullMark: 10 },
    { subject: 'Sour', A: recipe.flavorProfile.sour, fullMark: 10 },
    { subject: 'Bitter', A: recipe.flavorProfile.bitter, fullMark: 10 },
    { subject: 'Umami', A: recipe.flavorProfile.umami, fullMark: 10 },
  ] : [];

  const nutritionData = recipe.nutrition ? [
    { name: 'Protein', value: recipe.nutrition.protein, color: '#4CAF50' },
    { name: 'Carbs', value: recipe.nutrition.carbs, color: '#2D5A27' },
    { name: 'Fat', value: recipe.nutrition.fat, color: '#1A2E19' },
  ] : [];

  // Parse time (extracting numbers from strings like "15 mins")
  const getMinutes = (timeStr: string) => {
    const match = timeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const prepMins = getMinutes(recipe.prepTime);
  const cookMins = getMinutes(recipe.cookTime);
  
  const timeData = [
    { name: 'Prep', value: prepMins, color: '#4CAF50' },
    { name: 'Cook', value: cookMins, color: '#2D5A27' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-white h-full min-h-[650px] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(45,90,39,0.1)] border border-green-50 p-6 md:p-10 flex flex-col relative overflow-hidden"
    >
      {/* Background Subtle Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/5 rounded-full blur-[100px] -z-10" />

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
          <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] font-black opacity-50 uppercase tracking-widest">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-bg rounded-full text-brand-dark">
              <Clock className="w-3 h-3 text-brand-accent" /> {recipe.prepTime} PREP
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-bg rounded-full text-brand-dark">
              <Utensils className="w-3 h-3 text-brand-green" /> {recipe.cookTime} COOK
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-bg rounded-full text-brand-dark">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div> {recipe.servings} SERVINGS
            </div>
            {recipe.nutrition && (
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-green/10 rounded-full text-brand-green font-black">
                <Scale className="w-3 h-3" /> {recipe.nutrition.calories} KCAL
              </div>
            )}
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Visual Data Analytics */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Nutrition Stats & Chart */}
          <div className="bg-brand-bg/40 backdrop-blur-md rounded-[32px] p-6 border border-white/40 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-6 flex items-center gap-2">
              <CircleDot className="w-3 h-3" /> Macronutrient Analysis
            </h3>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData} layout="vertical" margin={{ left: -30, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {nutritionData.map((n) => (
                <div key={n.name} className="bg-white/60 p-2 rounded-2xl text-center">
                  <p className="text-[8px] font-black uppercase opacity-40">{n.name}</p>
                  <p className="text-xs font-black text-brand-dark">{n.value}g</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Flavor Radar */}
            {recipe.flavorProfile && (
              <div className="bg-brand-bg/40 backdrop-blur-md rounded-[32px] p-4 border border-white/40">
                <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">Flavor Spectrum</h3>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={flavorData}>
                      <PolarGrid stroke="#1A2E19" strokeOpacity={0.06} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 7, fontWeight: 900, fill: '#1A2E19', opacity: 0.4 }} />
                      <Radar
                        name="Flavor"
                        dataKey="A"
                        stroke="#4CAF50"
                        fill="#4CAF50"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Time Distribution */}
            <div className="bg-brand-bg/40 backdrop-blur-md rounded-[32px] p-4 border border-white/40">
              <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">Temporal Split</h3>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={15}
                      outerRadius={30}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {timeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-3 text-[7px] font-black uppercase opacity-40">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Prep</div>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-brand-dark" /> Cook</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Ingredients */}
        <div className="xl:col-span-3 flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-6 flex items-center justify-between">
            <span>Ingredients Inventory</span>
            <span className="opacity-30">{recipe.ingredients.length} units</span>
          </h3>
          <ul className="space-y-2 overflow-y-auto max-h-[420px] pr-2 scrollbar-hide">
            {recipe.ingredients.map((ingredient, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex items-center gap-3 border-b border-brand-bg/50 pb-2 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/30 group-hover:bg-brand-accent transition-colors shrink-0" />
                <span className="text-sm font-medium text-brand-dark/80 group-hover:text-brand-dark transition-colors">{ingredient}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right Column: Instructions */}
        <div className="xl:col-span-5 flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-6">Culinary Algorithm</h3>
          <div className="space-y-4 overflow-y-auto max-h-[420px] pr-4 scrollbar-hide">
            {recipe.instructions.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex gap-4 group bg-brand-bg/10 p-4 rounded-3xl hover:bg-brand-bg/30 transition-all border border-transparent hover:border-white/40"
              >
                <span className="text-4xl font-black text-brand-dark/5 leading-none group-hover:text-brand-accent/10 transition-colors shrink-0">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed font-medium text-brand-dark/70 group-hover:text-brand-dark transition-colors">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 flex items-center justify-between border-t border-brand-bg/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-dark flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-brand-accent animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand-dark uppercase tracking-widest leading-none">Gemini 2.5 Flash</p>
            <p className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em] mt-1">Neural Culinary Engine v11.0</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1 w-8 rounded-full ${i === 0 ? 'bg-brand-accent' : 'bg-brand-bg'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

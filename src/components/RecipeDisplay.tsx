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
          <div className="flex flex-wrap gap-4 md:gap-6 text-[12px] font-bold opacity-70 uppercase tracking-widest">
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-bg rounded-full text-brand-dark border border-brand-dark/5">
              <Clock className="w-4 h-4 text-brand-accent" /> {recipe.prepTime} PREP
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-bg rounded-full text-brand-dark border border-brand-dark/5">
              <Utensils className="w-4 h-4 text-brand-green" /> {recipe.cookTime} COOK
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-bg rounded-full text-brand-dark border border-brand-dark/5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent"></div> {recipe.servings} SERVINGS
            </div>
            {recipe.nutrition && (
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-green/10 rounded-full text-brand-green font-bold border border-brand-green/20">
                <Scale className="w-4 h-4" /> {recipe.nutrition.calories} KCAL
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 flex-1 relative z-10">
        {/* Ingredients Column */}
        <div className="lg:col-span-5 flex flex-col">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-accent mb-8 flex items-center justify-between">
            <span>Ingredients Inventory</span>
            <span className="opacity-40">{recipe.ingredients.length} items</span>
          </h3>
          <ul className="space-y-4 overflow-y-auto max-h-[400px] lg:max-h-[500px] pr-2 scrollbar-hide">
            {recipe.ingredients.map((ingredient, idx) => (
              <motion.li 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex items-center gap-5 bg-brand-bg/40 p-4 rounded-2xl border border-white/60 hover:border-brand-accent/30 transition-all hover:bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] group"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent/30 group-hover:bg-brand-accent transition-colors shrink-0" />
                <span className="text-lg font-semibold text-brand-dark group-hover:text-black transition-colors">{ingredient}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Instructions Column */}
        <div className="lg:col-span-7 flex flex-col">
          <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-accent mb-8 flex items-center justify-between">
            <span>Culinary Algorithm</span>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-accent/30" />)}
            </div>
          </h3>
          <div className="space-y-6 overflow-y-auto max-h-[400px] lg:max-h-[500px] pr-4 scrollbar-hide">
            {recipe.instructions.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex gap-8 group bg-white p-6 rounded-[32px] hover:shadow-[0_20px_60px_-20px_rgba(45,90,39,0.12)] transition-all border border-brand-dark/5 hover:border-white group"
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <span className="text-6xl font-black text-brand-dark/5 leading-none transition-colors group-hover:text-brand-accent/20">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-lg leading-relaxed font-medium text-brand-dark group-hover:text-black transition-colors">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section - Full Width at Bottom */}
      <div className="mt-12 lg:mt-16 pt-10 border-t border-brand-bg relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-center text-brand-accent/40 mb-10">Neural Analysis & Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 3D-effect Nutrition Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-brand-bg/40 backdrop-blur-3xl rounded-[48px] p-8 lg:p-10 border border-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] group hover:shadow-[0_48px_80px_-24px_rgba(45,90,39,0.2)] transition-all duration-700"
          >
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-dark/50 mb-10 flex items-center justify-between">
              Macros Alignment <CircleDot className="w-4 h-4 text-brand-green" />
            </h4>
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                  <defs>
                    {nutritionData.map((n, i) => (
                      <linearGradient key={`grad-${i}`} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={n.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={n.color} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                    <filter id="shadow-bar" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="8" floodOpacity="0.4"/>
                    </filter>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 900, fill: '#1A2E19', opacity: 0.8 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.4)', radius: 10 }}
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 32px 64px rgba(0,0,0,0.2)', fontSize: '16px', fontWeight: '900', padding: '20px', background: 'white' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[12, 12, 0, 0]} 
                    animationDuration={2000}
                    style={{ filter: 'url(#shadow-bar)' }}
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#barGrad-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 3D-effect Flavor Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-brand-bg/40 backdrop-blur-3xl rounded-[48px] p-8 lg:p-10 border border-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] group hover:shadow-[0_48px_80px_-24px_rgba(45,90,39,0.2)] transition-all duration-700"
          >
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-dark/50 mb-10 flex items-center justify-between">
              Flavor Profiling <Scale className="w-4 h-4 text-brand-accent" />
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={flavorData}>
                  <PolarGrid stroke="#1A2E19" strokeOpacity={0.25} strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fontWeight: 900, fill: '#1A2E19', opacity: 1 }} />
                  <Radar
                    name="Intensity"
                    dataKey="A"
                    stroke="#4CAF50"
                    strokeWidth={4}
                    fill="#4CAF50"
                    fillOpacity={0.5}
                    animationDuration={2500}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 3D-effect Time Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-brand-bg/40 backdrop-blur-3xl rounded-[48px] p-8 lg:p-10 border border-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] group hover:shadow-[0_48px_80px_-24px_rgba(45,90,39,0.2)] transition-all duration-700"
          >
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-dark/50 mb-10 flex items-center justify-between">
              Process Lifecycle <Clock className="w-4 h-4 text-brand-accent" />
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                     <filter id="shadow-pie">
                      <feDropShadow dx="0" dy="12" stdDeviation="15" floodOpacity="0.2"/>
                    </filter>
                  </defs>
                  <Pie
                    data={timeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={12}
                    dataKey="value"
                    animationDuration={2000}
                    style={{ filter: 'url(#shadow-pie)' }}
                    label={({ name, value }) => `${name}: ${value}m`}
                    labelLine={false}
                  >
                    {timeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4CAF50' : '#1A2E19'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 32px 64px rgba(0,0,0,0.2)', fontSize: '16px', fontWeight: '900', padding: '20px', background: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-3 text-[12px] font-black uppercase opacity-60"><div className="w-3 h-3 rounded-full bg-brand-green" /> Prep</div>
                <div className="flex items-center gap-3 text-[12px] font-black uppercase opacity-60"><div className="w-3 h-3 rounded-full bg-brand-dark" /> Cook</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 flex items-center justify-between border-t border-brand-bg/50 shrink-0">
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

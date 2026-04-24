import { motion } from "motion/react";
import { Recipe } from "../services/geminiService";
import { Bookmark, BookmarkCheck, Scale, CircleDot, Clock, Utensils } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, Tooltip, Cell,
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
    { name: 'Protein', value: recipe.nutrition.protein, color: '#3ECF8E' },
    { name: 'Carbs', value: recipe.nutrition.carbs, color: '#244221' },
    { name: 'Fat', value: recipe.nutrition.fat, color: '#0F1711' },
  ] : [];

  const getMinutes = (timeStr: string) => {
    const match = timeStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const prepMins = getMinutes(recipe.prepTime);
  const cookMins = getMinutes(recipe.cookTime);
  
  const timeData = [
    { name: 'Prep', value: prepMins, color: '#3ECF8E' },
    { name: 'Cook', value: cookMins, color: '#244221' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white h-full min-h-[800px] rounded-[64px] shadow-[0_40px_80px_-20px_rgba(15,23,17,0.1)] border border-white p-10 md:p-16 flex flex-col relative overflow-hidden group/recipe accelerate"
    >
      {/* Cinematic Atmosphere */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header Grid */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-20 relative z-10">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-16 bg-brand-accent" />
            <span className="text-[14px] font-black uppercase tracking-[0.5em] text-brand-accent/80">Neural Gastronomy Synthesis</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-[-0.06em] mb-12 text-brand-dark"
          >
            {recipe.name}
          </motion.h2>

          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              { icon: Clock, label: recipe.prepTime, sub: "PREPARATION", color: "brand-accent" },
              { icon: Utensils, label: recipe.cookTime, sub: "EXECUTION", color: "brand-green" },
              { icon: CircleDot, label: recipe.servings, sub: "YIELD UNITS", color: "brand-dark" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-center gap-8 bg-brand-bg/40 backdrop-blur-xl px-10 py-6 rounded-[40px] border border-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <item.icon className={`w-8 h-8 text-${item.color}`} />
                <div className="leading-tight">
                  <p className="text-2xl font-black text-brand-dark">{item.label}</p>
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-30">{item.sub}</p>
                </div>
              </motion.div>
            ))}
            {recipe.nutrition && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-8 bg-brand-dark text-white px-10 py-6 rounded-[40px] shadow-2xl hover:bg-brand-green transition-colors duration-500"
              >
                <Scale className="w-8 h-8 text-brand-accent" />
                <div className="leading-tight">
                  <p className="text-2xl font-black">{recipe.nutrition.calories}</p>
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-40 text-white">KCAL ENERGY</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <motion.button 
          initial={{ opacity: 0, rotate: 45, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
          onClick={onSave}
          className="p-10 rounded-[48px] border border-brand-dark/5 hover:border-brand-accent/30 bg-white shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(62,207,142,0.3)] transition-all active:scale-90 group relative flex items-center justify-center self-end xl:self-start"
        >
          {isSaved ? (
            <BookmarkCheck className="w-12 h-12 text-brand-accent fill-brand-accent" />
          ) : (
            <Bookmark className="w-12 h-12 text-brand-dark opacity-20 group-hover:opacity-100 transition-opacity" />
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 flex-1 relative z-10">
        {/* Ingredients Bento */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
          <h3 className="text-[16px] font-black uppercase tracking-[0.6em] text-brand-accent mb-12 flex items-center justify-between border-b-2 border-brand-accent/10 pb-6">
            <span className="flex items-center gap-6"><div className="w-4 h-4 bg-brand-accent animate-pulse rounded-full" /> Raw Material Archive</span>
            <span className="opacity-40 text-brand-dark font-display">{recipe.ingredients.length} UNITS</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 overflow-y-auto max-h-[700px] pr-6 scrollbar-hide">
            {recipe.ingredients.map((ingredient, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.08 }}
                className="flex items-center gap-8 bg-brand-bg/20 backdrop-blur-2xl p-8 rounded-[40px] border border-white hover:border-brand-accent/40 hover:bg-white shadow-lg hover:shadow-[0_32px_64px_-16px_rgba(62,207,142,0.2)] transition-all duration-700 group/item"
              >
                <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center text-2xl font-black text-brand-accent shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500">
                  {idx + 1}
                </div>
                <span className="text-2xl font-bold text-brand-dark leading-tight group-hover/item:text-black transition-colors">{ingredient}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Procedures Stream */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
          <h3 className="text-[16px] font-black uppercase tracking-[0.6em] text-brand-accent mb-12 flex items-center justify-between border-b-2 border-brand-accent/10 pb-6">
            <span className="flex items-center gap-6"><div className="w-4 h-4 bg-brand-green animate-pulse rounded-full" /> Execution Protocol</span>
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-brand-accent/30" />)}
            </div>
          </h3>
          <div className="space-y-10 overflow-y-auto max-h-[700px] pr-8 scrollbar-hide">
            {recipe.instructions.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.2 }}
                className="flex gap-12 group/step bg-white p-12 rounded-[56px] border border-brand-dark/5 hover:border-white hover:shadow-[0_64px_128px_-32px_rgba(45,90,39,0.15)] transition-all duration-1000 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-3 h-full bg-brand-accent opacity-0 group-hover/step:opacity-100 transition-all duration-700" />
                <div className="shrink-0 flex items-start pt-4">
                  <span className="text-9xl font-black text-brand-dark/5 leading-none transition-all duration-700 group-hover/step:text-brand-accent/10 group-hover/step:translate-x-2">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-3xl lg:text-2xl leading-relaxed font-semibold text-brand-dark group-hover/step:text-black transition-colors">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Extreme Fidelity Analytics */}
      <div className="mt-32 lg:mt-48 pt-32 border-t-2 border-brand-dark/5 relative z-10">
        <div className="flex flex-col items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-10 py-3 bg-brand-accent/15 rounded-full text-brand-accent text-[14px] font-black tracking-[0.6em] uppercase mb-6"
          >
            Neural Kinetics Dashboard
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl lg:text-5xl font-black uppercase tracking-[-0.05em] text-brand-dark text-center"
          >
            Spatial Composition Matrix
          </motion.h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* 3D Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-brand-bg/40 backdrop-blur-3xl rounded-[64px] p-12 lg:p-16 border border-white shadow-2xl group/card hover:shadow-[0_100px_200px_-50px_rgba(15,23,17,0.3)] transition-all duration-1000 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-3xl rounded-full" />
            <h4 className="text-[15px] font-black uppercase tracking-[0.4em] text-brand-dark/40 mb-16 flex items-center justify-between">
              Material Mass <CircleDot className="w-6 h-6 text-brand-green" />
            </h4>
            <div className="h-80 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                  <defs>
                    {nutritionData.map((n, i) => (
                      <linearGradient key={`grad-${i}`} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={n.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={n.color} stopOpacity={0.2} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 16, fontWeight: 900, fill: '#1A2E19', opacity: 0.7 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.4)', radius: 24 }}
                    contentStyle={{ borderRadius: '48px', border: 'none', boxShadow: '0 32px 64px rgba(0,0,0,0.1)', fontSize: '24px', fontWeight: '900', padding: '40px', background: 'white' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[24, 24, 0, 0]} 
                    animationDuration={2000}
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#barGrad-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 3D Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="bg-brand-bg/40 backdrop-blur-3xl rounded-[64px] p-12 lg:p-16 border border-white shadow-2xl group/card hover:shadow-[0_100px_200px_-50px_rgba(15,23,17,0.3)] transition-all duration-1000"
          >
            <h4 className="text-[15px] font-black uppercase tracking-[0.4em] text-brand-dark/40 mb-16 flex items-center justify-between">
              Sensory Field <Scale className="w-6 h-6 text-brand-accent" />
            </h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="85%" data={flavorData}>
                  <PolarGrid stroke="#1A2E19" strokeOpacity={0.1} strokeWidth={1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 900, fill: '#1A2E19', opacity: 0.8 }} />
                  <Radar
                    name="Intensity"
                    dataKey="A"
                    stroke="#3ECF8E"
                    strokeWidth={4}
                    fill="#3ECF8E"
                    fillOpacity={0.4}
                    animationDuration={2000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 3D Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="bg-brand-bg/40 backdrop-blur-3xl rounded-[64px] p-12 lg:p-16 border border-white shadow-2xl group/card hover:shadow-[0_100px_200px_-50px_rgba(15,23,17,0.3)] transition-all duration-1000"
          >
            <h4 className="text-[15px] font-black uppercase tracking-[0.4em] text-brand-dark/40 mb-16 flex items-center justify-between">
              Temporal Phase <Clock className="w-6 h-6 text-brand-dark" />
            </h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={20}
                    dataKey="value"
                    animationDuration={2000}
                    label={({ name, value }) => `${name}: ${value}m`}
                    labelLine={false}
                  >
                    {timeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3ECF8E' : '#0F1711'} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '48px', border: 'none', boxShadow: '0 32px 64px rgba(0,0,0,0.1)', fontSize: '24px', fontWeight: '900', padding: '40px', background: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-12 mt-10">
                <div className="flex items-center gap-6 text-[15px] font-black uppercase opacity-60"><div className="w-4 h-4 rounded-full bg-brand-accent animate-pulse" /> PREP PHASE</div>
                <div className="flex items-center gap-6 text-[15px] font-black uppercase opacity-60"><div className="w-4 h-4 rounded-full bg-brand-dark" /> SYNTHESIS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer System Info */}
      <div className="mt-48 pt-24 flex flex-col xl:flex-row items-center justify-between gap-16 border-t-2 border-brand-dark/5 shrink-0">
        <div className="flex items-center gap-10">
          <div className="w-24 h-24 rounded-[32px] bg-brand-dark flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group/logo">
            <div className="absolute inset-0 bg-brand-accent/20 opacity-0 group-hover/logo:opacity-100 transition-all duration-700" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-full bg-brand-accent blur-xl absolute" 
            />
            <div className="w-5 h-5 rounded-full bg-brand-accent relative z-10 shadow-[0_0_20px_rgba(62,207,142,0.8)]" />
          </div>
          <div>
            <p className="text-3xl font-black text-brand-dark uppercase tracking-[-0.03em] leading-none">FLAVOR NEURAL CORE</p>
            <p className="text-[12px] font-black opacity-30 uppercase tracking-[0.8em] mt-4 flex items-center gap-4">
              <span className="w-3 h-3 bg-brand-accent rounded-full" />
              Processing Layer 14 // Enterprise Silicon v2
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                height: [6, 24, 6], 
                backgroundColor: i < 3 ? "#3ECF8E" : "#E2E8F0" 
              }}
              transition={{ 
                duration: 1.5 + i * 0.1, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="h-1 w-20 rounded-full" 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

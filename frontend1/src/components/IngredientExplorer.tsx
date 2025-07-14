
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Leaf, Sparkles, Heart, Brain, Zap, Shield } from 'lucide-react';

const IngredientExplorer = () => {
  const [selectedIngredient, setSelectedIngredient] = useState(0);

  const ingredients = [
    {
      name: "Tulsi (Holy Basil)",
      sanskrit: "Ocimum sanctum",
      icon: <Leaf className="w-8 h-8" />,
      color: "from-green-400 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      benefits: [
        "Reduces scalp odor naturally",
        "Antimicrobial properties",
        "Soothes scalp irritation",
        "Promotes healthy hair growth"
      ],
      description: "Sacred herb in Ayurveda, Tulsi purifies and protects your scalp while promoting natural hair health with its powerful antimicrobial properties.",
      potency: 95,
      emoji: "🌿"
    },
    {
      name: "Amla (Indian Gooseberry)",
      sanskrit: "Phyllanthus emblica",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      benefits: [
        "Rich in Vitamin C",
        "Natural anti-aging properties",
        "Prevents premature graying",
        "Strengthens hair follicles"
      ],
      description: "Nature's powerhouse of Vitamin C, Amla rejuvenates hair follicles and prevents premature aging while adding natural shine.",
      potency: 98,
      emoji: "🟢"
    },
    {
      name: "Brahmi (Bacopa)",
      sanskrit: "Bacopa monnieri",
      icon: <Brain className="w-8 h-8" />,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      benefits: [
        "Calms scalp inflammation",
        "Improves blood circulation",
        "Reduces stress-related hair loss",
        "Nourishes hair roots deeply"
      ],
      description: "Ancient brain tonic that also works wonders for hair, Brahmi soothes the scalp and promotes healthy circulation for stronger roots.",
      potency: 92,
      emoji: "🧠"
    },
    {
      name: "Moringa (Drumstick)",
      sanskrit: "Moringa oleifera",
      icon: <Zap className="w-8 h-8" />,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      benefits: [
        "Protein-rich for hair strength",
        "Essential amino acids",
        "Promotes root strength",
        "Natural hair moisturizer"
      ],
      description: "Miracle tree's leaves provide essential proteins and amino acids that strengthen hair from root to tip while maintaining natural moisture.",
      potency: 90,
      emoji: "🌱"
    },
    {
      name: "Neem (Margosa)",
      sanskrit: "Azadirachta indica",
      icon: <Shield className="w-8 h-8" />,
      color: "from-green-600 to-emerald-700",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      benefits: [
        "Natural antifungal properties",
        "Treats scalp infections",
        "Controls dandruff effectively",
        "Purifies scalp naturally"
      ],
      description: "Nature's pharmacy in a leaf, Neem purifies and protects your scalp from infections while maintaining optimal scalp health.",
      potency: 87,
      emoji: "🍃"
    },
    {
      name: "Bhringraj (False Daisy)",
      sanskrit: "Eclipta prostrata",
      icon: <Heart className="w-8 h-8" />,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      benefits: [
        "King of herbs for hair",
        "Prevents hair fall naturally",
        "Promotes new hair growth",
        "Adds natural black color"
      ],
      description: "Revered as the 'King of Hair Care Herbs', Bhringraj is legendary for its ability to promote hair growth and maintain natural color.",
      potency: 96,
      emoji: "💜"
    }
  ];

  const selectedIng = ingredients[selectedIngredient];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
          Explore Our Sacred Ingredients
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the ancient wisdom of Ayurveda through our carefully selected natural ingredients, 
          each with centuries of proven hair care benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredient List */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-accent" />
            Natural Ingredients
          </h3>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => setSelectedIngredient(index)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 ${
                  selectedIngredient === index
                    ? `${ingredient.bgColor} border-current ${ingredient.textColor} scale-105 shadow-lg`
                    : 'bg-card hover:bg-secondary/50 border-transparent hover:border-accent/20 hover:scale-102'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${ingredient.color} text-white text-sm`}>
                    {ingredient.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{ingredient.name}</div>
                    <div className="text-xs opacity-70">{ingredient.sanskrit}</div>
                  </div>
                  {selectedIngredient === index && (
                    <div className="text-accent">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2">
          <Card className={`${selectedIng.bgColor} border-2 ${selectedIng.textColor} border-current/20 hover:shadow-2xl transition-all duration-500`}>
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedIng.color} text-white shadow-lg`}>
                    {selectedIng.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-playfair font-bold">{selectedIng.name}</h3>
                    <p className="text-sm opacity-70 italic">{selectedIng.sanskrit}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium mr-2">Potency:</span>
                      <div className="flex-1 bg-current/20 rounded-full h-2 mr-2 max-w-20">
                        <div 
                          className={`h-full bg-gradient-to-r ${selectedIng.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${selectedIng.potency}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{selectedIng.potency}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-4xl animate-pulse">
                  {selectedIng.emoji}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg leading-relaxed mb-6 bg-white/50 p-4 rounded-xl">
                {selectedIng.description}
              </p>

              {/* Benefits */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Key Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedIng.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 bg-white/70 p-3 rounded-xl hover:bg-white/90 transition-colors duration-300 group cursor-pointer"
                    >
                      <div className="w-2 h-2 bg-current rounded-full group-hover:scale-150 transition-transform" />
                      <span className="text-sm font-medium group-hover:font-semibold transition-all">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traditional Badge */}
              <div className="mt-6 flex justify-center">
                <Badge variant="secondary" className="px-4 py-2">
                  ✨ Traditional Ayurvedic Herb ✨
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IngredientExplorer;

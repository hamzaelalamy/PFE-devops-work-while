import { useState, forwardRef } from 'react';

const SalaryGuidePage = forwardRef((props, ref) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  
  const categories = ['All', 'Salary Negotiation', 'Interview Tips', 'Career Growth', 'Benefits'];
  
  const salaryGuides = [
    {
      title: "Salary Negotiation Fundamentals",
      description: "Master the art of negotiating your worth with confidence and strategy.",
      category: "Salary Negotiation",
      icon: <DollarSign size={24} style={{ color: '#3c78e6' }} />,
      image: "/api/placeholder/400/320"
    },
    {
      title: "Interview Question Preparation",
      description: "Practice answers to common interview questions and impress hiring managers.",
      category: "Interview Tips",
      icon: <MessageCircle size={24} style={{ color: '#3c78e6' }} />,
      image: "/api/placeholder/400/320"
    },
    {
      title: "Benefits Package Analysis",
      description: "Learn how to evaluate the full compensation package beyond just the salary.",
      category: "Benefits",
      icon: <Award size={24} style={{ color: '#3c78e6' }} />,
      image: "/api/placeholder/400/320"
    },
    {
      title: "Salary Research Strategies",
      description: "Discover how to research market rates and position yourself optimally.",
      category: "Salary Negotiation",
      icon: <BookOpen size={24} style={{ color: '#3c78e6' }} />,
      image: "/api/placeholder/400/320"
    },
    {
      title: "Career Advancement Tactics",
      description: "Strategic approaches to climb the ladder and increase your earning potential.",
      category: "Career Growth",
      icon: <Briefcase size={24} style={{ color: '#3c78e6' }} />,
      image: "/api/placeholder/400/320"
    },
    {
      title: "Interview Body Language",
      description: "Non-verbal communication tips that will help you make a strong impression.",
      category: "Interview Tips",
      icon: <Lightbulb size={24} style={{ color: '#3c78e6' }} />,
      image: "/api/placeholder/400/320"
    }
  ];

  const filteredGuides = salaryGuides.filter(guide => 
    (selectedCategory === 'All' || guide.category === selectedCategory) &&
    (guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const negotiationSteps = [
    {
      title: "Research",
      description: "Gather data on industry standards and company compensation.",
      icon: <BookOpen size={22} style={{ color: '#EDC418' }} />
    },
    {
      title: "Know Your Value",
      description: "Identify your unique skills and contributions to strengthen your position.",
      icon: <Award size={22} style={{ color: '#EDC418' }} />
    },
    {
      title: "Practice",
      description: "Rehearse your negotiation conversation to build confidence.",
      icon: <MessageCircle size={22} style={{ color: '#EDC418' }} />
    },
    {
      title: "Timing",
      description: "Choose the right moment to initiate compensation discussions.",
      icon: <Clock size={22} style={{ color: '#EDC418' }} />
    }
  ];

  // Calculator state
  const [experience, setExperience] = useState(2);
  const [industry, setIndustry] = useState('Technology');
  const [calculatedSalary, setCalculatedSalary] = useState({
    min: 6000,
    max: 50000
  });

  const calculateSalary = () => {
    // Simple mock calculation logic
    let baseMin = 5000;
    let baseMax = 10000;
    
    // Adjust by experience
    baseMin += experience * 3000;
    baseMax += experience * 5000;
    
    // Industry adjustments
    const industryMultipliers = {
      'Technology': 1.2,
      'Finance': 1.3,
      'Healthcare': 1.1,
      'Education': 0.9,
      'Manufacturing': 1.0
    };
    
    const multiplier = industryMultipliers[industry] || 1;
    
    setCalculatedSalary({
      min: Math.round(baseMin * multiplier),
      max: Math.round(baseMax * multiplier)
    });
  };

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Header section with background gradient */}
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-blue-500 to-blue-600 p-8 md:p-12">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-300 opacity-20 blur-3xl transform translate-x-1/4 -translate-y-1/4" 
              style={{ backgroundColor: '#EDC418' }}></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl transform -translate-x-1/4 translate-y-1/4" 
              style={{ backgroundColor: '#3c78e6' }}></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Salary Guide & Career Resources</h1>
            <p className="text-white text-lg md:text-xl opacity-90 max-w-xl">
              Expert advice to help you negotiate better compensation and ace your job interviews
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-12">
          <div className="relative max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Search for salary guides, negotiation tips, interview advice..." 
              className="w-full px-6 py-4 pr-12 text-lg rounded-full shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white"
              style={{ focusRingColor: '#3c78e6' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <button className="text-white p-2 rounded-full transition" style={{ backgroundColor: '#3c78e6' }}>
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`py-2 px-5 rounded-full text-sm md:text-base font-medium transition ${
                selectedCategory === category 
                  ? 'text-white shadow-md' 
                  : 'text-gray-600 bg-white border border-gray-200 hover:border-blue-300'
              }`}
              style={{ backgroundColor: selectedCategory === category ? '#3c78e6' : '' }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Salary Negotiation Steps */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#3c78e6' }}>
              Master the Art of Salary Negotiation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these proven steps to negotiate your compensation with confidence
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {negotiationSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" 
                     style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Guides */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#3c78e6' }}>
              Career Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive guides to help you advance your career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 overflow-hidden">
                  <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                      {guide.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{guide.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <button 
                    className="text-sm font-medium px-4 py-2 rounded-full transition hover:bg-opacity-90"
                    style={{ backgroundColor: '#EDC418', color: '#333' }}
                  >
                    Read Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredGuides.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No guides found for "{searchQuery}". Try different keywords or browse all categories.</p>
            </div>
          )}
        </div>
        
        {/* Salary Calculator Teaser */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-semibold mb-3" style={{ color: '#3c78e6' }}>
                Calculate Your Worth
              </h3>
              <p className="text-gray-600 mb-6">
                Use our salary calculator to determine your market value based on your skills, 
                experience, location, and industry standards.
              </p>
              <button 
                className="px-6 py-3 rounded-full text-white font-medium transition hover:bg-opacity-90"
                style={{ backgroundColor: '#3c78e6' }}
                onClick={() => setShowCalculator(!showCalculator)}
              >
                {showCalculator ? 'Hide Calculator' : 'Try Salary Calculator'}
              </button>
            </div>
            <div className="md:w-2/5">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Average Salary Range</span>
                  <span className="text-xl font-bold" style={{ color: '#3c78e6' }}>60,000 MAD - 130,000 MAD / Year</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-3">
                  <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: '#EDC418' }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Entry Level</span>
                  <span>Senior Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Calculator Modal */}
        {showCalculator && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 md:p-8 border-t-4" style={{ borderColor: '#3c78e6' }}>
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#3c78e6' }}>Salary Calculator</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Years of Experience</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-300"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                >
                  <option value="0">0-1 year</option>
                  <option value="1">1-2 years</option>
                  <option value="2">2-5 years</option>
                  <option value="5">5-8 years</option>
                  <option value="8">8+ years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Industry</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-300"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <button 
                className="px-6 py-3 rounded-full text-white font-medium transition hover:bg-opacity-90"
                style={{ backgroundColor: '#EDC418', color: '#333' }}
                onClick={calculateSalary}
              >
                Calculate My Worth
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h4 className="text-lg font-medium mb-3">Your Estimated Salary Range</h4>
              <p className="text-3xl font-bold mb-4" style={{ color: '#3c78e6' }}>
                {calculatedSalary.min.toLocaleString()} - {calculatedSalary.max.toLocaleString()} MAD
              </p>
              <p className="text-gray-600">
                Based on your experience, industry, and current market rates in Morocco
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                This is an estimate based on current market data. Actual salaries may vary based on location, company size, and specific skills.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default SalaryGuidePage;
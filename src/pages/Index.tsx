import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Check, Zap, ShoppingCart, Palette, CreditCard, BarChart, Settings, Users, Star } from "lucide-react";

export default function Index() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Feature list for the platform
  const features = [
    {
      icon: <ShoppingCart className="w-6 h-6 text-threadGold" />,
      title: "Simple Product Management",
      description: "Easily add, edit, and organize your products with our intuitive admin interface.",
    },
    {
      icon: <Palette className="w-6 h-6 text-threadGold" />,
      title: "Customizable Options",
      description: "Create product variants with custom options that your customers can select.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-threadGold" />,
      title: "Seamless Payments",
      description: "Integrated with Stripe for secure, reliable payment processing.",
    },
    {
      icon: <BarChart className="w-6 h-6 text-threadGold" />,
      title: "Sales Analytics",
      description: "Track your performance with easy-to-understand sales dashboards.",
    },
    {
      icon: <Settings className="w-6 h-6 text-threadGold" />,
      title: "Easy Setup",
      description: "Get your store up and running in minutes, not days or weeks.",
    },
    {
      icon: <Users className="w-6 h-6 text-threadGold" />,
      title: "Customer Management",
      description: "Keep track of your customers and their purchase history.",
    }
  ];

  // Pricing plans
  const plans = [
    {
      name: "Basic",
      price: 29,
      description: "Everything you need to start selling online",
      features: [
        "Up to 100 products",
        "Basic customization options",
        "Standard payment processing (3.9% + 30¢)",
        "Mobile responsive design",
        "Email support",
        "SSL certificate included"
      ],
      cta: "Start Basic Plan",
      highlighted: false
    },
    {
      name: "Premium",
      price: 59,
      description: "Advanced features for growing businesses",
      features: [
        "Unlimited products",
        "Advanced customization",
        "Reduced payment processing (2.9% + 30¢)",
        "Priority support",
        "Sales analytics dashboard",
        "Custom domain included"
      ],
      cta: "Start Premium Plan",
      highlighted: true
    }
  ];

  return (
    <Layout>
      {/* Hero Section with accent-colored geometric shapes */}
      <div className="relative overflow-hidden min-h-[85vh] bg-gradient-to-r from-threadGold/5 to-threadGold/10 flex items-center">
        {/* Decorative geometric elements using secondary and accent colors */}
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-[5%] w-40 h-40 rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute top-[20%] left-[20%] w-8 h-8 rounded-full bg-secondary/40"></div>
        <div className="absolute bottom-[30%] right-[15%] w-12 h-12 rounded bg-accent/30 rotate-45"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal animation="fade-up">
              <div>
                <span className="bg-threadGold/10 text-threadGold px-4 py-1.5 rounded-full text-sm font-semibold inline-block mb-4">
                  Launching Soon
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-darkText mb-6 leading-tight">
                  Create Your Online Store <span className="text-threadGold">Without The Hassle</span>
                </h1>
                <p className="text-lg md:text-xl text-darkText/80 mb-8 max-w-xl">
                  A simple, powerful e-commerce platform that lets you focus on your products, not website maintenance. Easier than Wix. More powerful than Squarespace.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/signup" 
                    className="bg-threadGold hover:bg-threadGold/90 text-white font-medium px-8 py-3 rounded-md transition-colors inline-block text-lg"
                  >
                    Start Free Trial
                  </Link>
                  <Link 
                    to="/demo" 
                    className="relative overflow-hidden bg-white hover:bg-gray-50 text-darkText border border-gray-200 font-medium px-8 py-3 rounded-md transition-colors inline-block text-lg group"
                  >
                    {/* Decorative animated gradient on hover using secondary and accent colors */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary/0 via-secondary/10 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    View Demo
                  </Link>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-sm text-darkText/70">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent))" }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>No credit card required for trial</span>
                </div>
              </div>
            </Reveal>
            
            <Reveal animation="fade-left" delay={200}>
              <div className="relative">
                <div className="w-full h-full absolute top-6 left-6 bg-threadGold/20 rounded-xl"></div>
                {/* Accent colored shape behind the image */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded bg-secondary/30 rotate-12"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full" style={{ background: "linear-gradient(135deg, var(--secondary), var(--accent))" }}></div>
                
                <div className="bg-white p-3 rounded-xl shadow-xl relative z-10">
                  <img 
                    src="/placeholder-images/admin-dashboard.jpg" 
                    alt="White Label Webshop Dashboard" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-darkText p-4 rounded-lg shadow-lg text-white">
                  <Zap className="h-6 w-6 mb-1 text-threadGold" />
                  <p className="text-sm font-semibold">Setup in <span className="text-threadGold">5 minutes</span></p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Brands/Logos Section */}
      <section className="py-10 bg-gray-50 relative overflow-hidden">
        {/* Geometric shapes using accent and secondary colors */}
        <div className="absolute top-0 left-[5%] w-32 h-1 bg-gradient-to-r from-secondary to-accent"></div>
        <div className="absolute bottom-0 right-[10%] w-32 h-1 bg-gradient-to-r from-accent to-secondary"></div>
      
        <div className="container mx-auto px-4">
          <Reveal animation="fade-up">
            <p className="text-center text-darkText/50 mb-6 text-sm font-medium uppercase tracking-wider">
              Trusted by businesses worldwide
            </p>
            <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section with accent and secondary colored cards */}
      <section className="py-20 relative">
        {/* Decorative geometric elements */}
        <div className="absolute bottom-1/2 right-0 w-60 h-60 rounded-tl-full rounded-bl-full bg-secondary/5"></div>
        <div className="absolute top-40 left-0 w-40 h-40 rounded-tr-full rounded-br-full bg-accent/5"></div>
      
        <div className="container mx-auto px-4">
          <Reveal animation="fade-up">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="h-1 w-10 bg-secondary rounded-full"></div>
                <div className="h-1 w-20 mx-2 bg-threadGold rounded-full"></div>
                <div className="h-1 w-10 bg-accent rounded-full"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                Everything You Need to Sell Online
              </h2>
              <p className="text-lg text-darkText/70">
                Without the complexity of traditional e-commerce platforms or the limitations of basic website builders.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Reveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  {/* Decorative corner shape using secondary color */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors"></div>
                  
                  {/* Decorative accent-colored bar on hover */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
                  
                  <div className="bg-threadGold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 relative">
                    {feature.icon}
                    {/* Small accent colored dot */}
                    <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full" style={{ background: "var(--accent)" }}></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-darkText/70">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section with geometric backgrounds */}
      <section className="py-24 bg-gradient-to-r from-threadGold/5 to-darkText/5 relative overflow-hidden">
        {/* Decorative shapes using accent and secondary colors */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-40 bg-secondary/5 rounded-tr-full"></div>
        <div className="absolute top-20 left-[20%] w-6 h-24 bg-secondary/20 rounded-full rotate-12"></div>
        <div className="absolute bottom-40 right-[10%] w-24 h-6 bg-accent/20 rounded-full -rotate-12"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Reveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-secondary" />
                <Star className="w-8 h-8 text-threadGold" />
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                See How Easy It Is
              </h2>
              <p className="text-lg text-darkText/70 max-w-3xl mx-auto">
                Watch how quickly you can add products, customize your store, and start selling. No technical skills required.
              </p>
            </div>
          </Reveal>

          <Reveal animation="fade-up">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-3 relative">
              {/* Decorative accent corner */}
              <div className="absolute -top-2 -left-2 w-10 h-10 rounded-lg bg-accent rotate-12"></div>
              {/* Decorative secondary corner */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-secondary -rotate-12"></div>
            
              <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden relative">
                {/* Diagonal accent color stripe */}
                <div className="absolute -left-10 bottom-0 w-40 h-6 bg-accent/20 rotate-45"></div>
                {/* Diagonal secondary color stripe */}
                <div className="absolute -right-10 top-0 w-40 h-6 bg-secondary/20 rotate-45"></div>
              
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-darkText/50">Demo Video Coming Soon</span>
                    <div className="mt-4 animate-pulse">
                      <svg className="w-20 h-20 text-threadGold/40 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="text-center mt-8">
            <Link 
              to="/demo" 
              className="relative overflow-hidden group inline-flex items-center gap-2 bg-threadGold hover:bg-threadGold/90 text-white font-medium px-8 py-3 rounded-md transition-colors"
            >
              {/* Decorative moving gradient on hover with accent and secondary colors */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary/0 via-secondary/20 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative z-10">Try Interactive Demo</span>
              <span className="relative z-10 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section with accent and secondary colored elements */}
      <section className="py-20 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-50/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Reveal animation="fade-up">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-block mb-4 relative">
                <div className="absolute -top-6 -left-6 w-5 h-5 rounded-full bg-secondary/30"></div>
                <div className="absolute -bottom-4 -right-4 w-4 h-4 rounded-full bg-accent/30"></div>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold relative z-10">
                  Simple, Transparent Pricing
                </h2>
              </div>
              <p className="text-lg text-darkText/70">
                Choose the plan that's right for your business. All plans include a 14-day free trial.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Reveal key={index} animation="fade-up" delay={index * 100}>
                <div className={`
                  rounded-xl overflow-hidden transition-all relative
                  ${plan.highlighted 
                    ? 'border-2 border-threadGold shadow-xl bg-white' 
                    : 'border border-gray-200 shadow-sm bg-white hover:shadow-md'}
                `}>
                  {/* Top accent bar */}
                  <div 
                    className="h-2 w-full"
                    style={{ 
                      background: plan.highlighted 
                        ? 'linear-gradient(90deg, var(--secondary), var(--accent))' 
                        : 'var(--threadGold)'
                    }}
                  ></div>
                  
                  {/* Decorative corner shape */}
                  {plan.highlighted && (
                    <div className="absolute top-2 right-0 w-24 h-24 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent text-white text-xs font-bold py-1 w-full text-center shadow-md">
                        POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-darkText/60 ml-2">/month</span>
                    </div>
                    <p className="text-darkText/70 mb-6">{plan.description}</p>
                    
                    <div className="mb-8">
                      <h4 className="font-medium mb-4 pb-2 border-b border-gray-100">What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <div 
                              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                              style={{ 
                                background: plan.highlighted 
                                  ? idx % 2 === 0 ? 'var(--secondary)' : 'var(--accent)'
                                  : 'var(--threadGold)'
                              }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="ml-3 text-darkText/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link
                      to="/signup"
                      className={`
                        block text-center py-3 px-6 rounded-md font-medium transition-all
                        ${plan.highlighted 
                          ? 'bg-threadGold text-white hover:bg-threadGold/90' 
                          : 'bg-white text-darkText border border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

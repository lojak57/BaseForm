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
      icon: <ShoppingCart className="w-6 h-6 text-[#18a77e]" />,
      title: "Simple Product Management",
      description: "Easily add, edit, and organize your products with our intuitive admin interface.",
    },
    {
      icon: <Palette className="w-6 h-6 text-[#18a77e]" />,
      title: "Customizable Options",
      description: "Create product variants with custom options that your customers can select.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#18a77e]" />,
      title: "Seamless Payments",
      description: "Integrated with Stripe for secure, reliable payment processing.",
    },
    {
      icon: <BarChart className="w-6 h-6 text-[#18a77e]" />,
      title: "Sales Analytics",
      description: "Track your performance with easy-to-understand sales dashboards.",
    },
    {
      icon: <Settings className="w-6 h-6 text-[#18a77e]" />,
      title: "Easy Setup",
      description: "Get your store up and running in minutes, not days or weeks.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#18a77e]" />,
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
      {/* Hero Section with creative layout */}
      <div className="relative overflow-hidden min-h-[75vh] bg-gradient-to-r from-[#e8f5f2] to-[#e8f0f7] flex items-center pt-6">
        {/* Decorative geometric elements using logo colors */}
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-[#0d3b66]/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-[5%] w-40 h-40 rounded-full bg-[#18a77e]/10 blur-3xl"></div>
        <div className="absolute top-[20%] left-[20%] w-8 h-8 rounded-full bg-[#0d3b66]/20"></div>
        <div className="absolute bottom-[30%] right-[15%] w-12 h-12 rounded bg-[#18a77e]/20 rotate-45"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 flex flex-col justify-center items-center mb-6">
              <img 
                src="/images/logo.jpg" 
                alt="BaseForm" 
                className="w-[100%] max-w-[350px] lg:max-w-[350px] h-auto"
              />
            </div>
            
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="bg-white/50 backdrop-blur-sm py-5 px-6 rounded-xl border border-white/40 shadow-lg">
                <span className="bg-[#18a77e]/10 text-[#18a77e] px-4 py-1.5 rounded-full text-sm font-semibold inline-block mb-2">
                  Launching Soon
                </span>
                <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-[#0d3b66] mb-3 leading-tight">
                  Create Your <span className="text-[#18a77e]">Online Store</span> <br className="hidden md:block" />
                  Without The Hassle
                </h1>
                <p className="text-lg text-[#0d3b66]/80 mb-4 max-w-3xl">
                  A simple, powerful e-commerce platform that lets you focus on your products, not website maintenance. Easier than Wix. More powerful than Squarespace.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link 
                    to="/demo" 
                    className="bg-[#18a77e] hover:bg-[#18a77e]/90 text-white font-medium px-6 py-2.5 rounded-md transition-colors inline-block"
                  >
                    View Demo
                  </Link>
                  <Link 
                    to="/demo" 
                    className="relative overflow-hidden bg-white hover:bg-gray-50 text-[#0d3b66] border border-gray-200 font-medium px-6 py-2.5 rounded-md transition-colors inline-block group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0d3b66]/0 via-[#0d3b66]/10 to-[#18a77e]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard image in a floating card - smaller size */}
          <div className="relative mt-6 max-w-3xl mx-auto -mb-16 z-20 lg:-mt-10 lg:ml-auto lg:mr-0 lg:max-w-md lg:transform lg:translate-y-20">
            <div className="absolute top-4 left-4 right-4 bottom-4 bg-[#18a77e]/20 rounded-xl transform rotate-1"></div>
            <div className="bg-white p-3 rounded-xl shadow-xl relative z-10 transform -rotate-1">
              <img 
                src="/images/ecommerce-dashboard.jpg" 
                alt="E-commerce Dashboard" 
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute -top-3 -right-3 bg-[#0d3b66] p-2.5 rounded-lg shadow-lg text-white transform rotate-6">
                <Zap className="h-5 w-5 text-[#18a77e]" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-[#18a77e] py-1 px-3 rounded-lg shadow-lg text-white text-sm transform -rotate-3">
                Setup in 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add extra padding to accommodate the floating card */}
      <div className="h-20 bg-white"></div>

      {/* Brands/Logos Section */}
      <section className="py-6 bg-white relative overflow-hidden">
        {/* Geometric shapes using blue and green colors */}
        <div className="absolute top-0 left-[5%] w-32 h-1 bg-gradient-to-r from-[#0d3b66] to-[#18a77e]"></div>
        <div className="absolute bottom-0 right-[10%] w-32 h-1 bg-gradient-to-r from-[#18a77e] to-[#0d3b66]"></div>
      
        <div className="container mx-auto px-4">
          <Reveal animation="fade-up">
            <p className="text-center text-[#0d3b66]/50 mb-4 text-sm font-medium uppercase tracking-wider">
              Trusted by businesses worldwide
            </p>
            <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6">
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
      <section className="py-10 relative">
        {/* Decorative geometric elements */}
        <div className="absolute bottom-1/2 right-0 w-60 h-60 rounded-tl-full rounded-bl-full bg-[#0d3b66]/5"></div>
        <div className="absolute top-40 left-0 w-40 h-40 rounded-tr-full rounded-br-full bg-[#18a77e]/5"></div>
      
        <div className="container mx-auto px-4">
          <Reveal animation="fade-up">
            <div className="text-center mb-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center mb-3">
                <div className="h-1 w-10 bg-[#0d3b66] rounded-full"></div>
                <div className="h-1 w-20 mx-2 bg-[#18a77e] rounded-full"></div>
                <div className="h-1 w-10 bg-[#0d3b66] rounded-full"></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3 text-[#0d3b66]">
                Everything You Need to Sell Online
              </h2>
              <p className="text-base md:text-lg text-[#0d3b66]/70">
                Without the complexity of traditional e-commerce platforms or the limitations of basic website builders.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <Reveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  {/* Decorative corner shape using blue color */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-[#0d3b66]/10 group-hover:bg-[#0d3b66]/20 transition-colors"></div>
                  
                  {/* Decorative green-colored bar on hover */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#18a77e] group-hover:w-full transition-all duration-300"></div>
                  
                  <div className="bg-[#18a77e]/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 relative">
                    {feature.icon}
                    {/* Small accent colored dot */}
                    <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-[#0d3b66]"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#0d3b66]">{feature.title}</h3>
                  <p className="text-sm text-[#0d3b66]/70">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section with geometric backgrounds */}
      <section className="py-12 bg-gradient-to-r from-[#e8f5f2] to-[#e8f0f7] relative overflow-hidden">
        {/* Decorative shapes using accent and secondary colors */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#18a77e]/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-40 bg-[#0d3b66]/5 rounded-tr-full"></div>
        <div className="absolute top-20 left-[20%] w-6 h-24 bg-[#0d3b66]/20 rounded-full rotate-12"></div>
        <div className="absolute bottom-40 right-[10%] w-24 h-6 bg-[#18a77e]/20 rounded-full -rotate-12"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Reveal animation="fade-up">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[#0d3b66]" />
                <Star className="w-7 h-7 text-[#18a77e]" />
                <Star className="w-5 h-5 text-[#0d3b66]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3 text-[#0d3b66]">
                See How Easy It Is
              </h2>
              <p className="text-base md:text-lg text-[#0d3b66]/70 max-w-2xl mx-auto">
                Watch how quickly you can add products, customize your store, and start selling. No technical skills required.
              </p>
            </div>
          </Reveal>

          <Reveal animation="fade-up">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-3 relative">
              {/* Decorative accent corner */}
              <div className="absolute -top-2 -left-2 w-10 h-10 rounded-lg bg-[#18a77e] rotate-12"></div>
              {/* Decorative secondary corner */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-[#0d3b66] -rotate-12"></div>
            
              <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden relative">
                {/* Diagonal accent color stripe */}
                <div className="absolute -left-10 bottom-0 w-40 h-6 bg-[#18a77e]/20 rotate-45"></div>
                {/* Diagonal secondary color stripe */}
                <div className="absolute -right-10 top-0 w-40 h-6 bg-[#0d3b66]/20 rotate-45"></div>
              
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[#0d3b66]/50">Demo Video Coming Soon</span>
                    <div className="mt-3 animate-pulse">
                      <svg className="w-16 h-16 text-[#18a77e]/40 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="text-center mt-6">
            <Link 
              to="/demo" 
              className="relative overflow-hidden group inline-flex items-center gap-2 bg-[#18a77e] hover:bg-[#18a77e]/90 text-white font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              {/* Decorative moving gradient on hover with accent and secondary colors */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0d3b66]/0 via-[#0d3b66]/20 to-[#18a77e]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="relative z-10">Try Interactive Demo</span>
              <span className="relative z-10 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section with accent and secondary colored elements */}
      <section className="py-12 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-50/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Reveal animation="fade-up">
            <div className="text-center mb-8 max-w-3xl mx-auto">
              <div className="inline-block mb-3 relative">
                <div className="absolute -top-4 -left-4 w-4 h-4 rounded-full bg-[#0d3b66]/30"></div>
                <div className="absolute -bottom-3 -right-3 w-3 h-3 rounded-full bg-[#18a77e]/30"></div>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold relative z-10 text-[#0d3b66]">
                  Simple, Transparent Pricing
                </h2>
              </div>
              <p className="text-base md:text-lg text-[#0d3b66]/70">
                Choose the plan that's right for your business. All plans include a demo version.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Reveal key={index} animation="fade-up" delay={index * 100}>
                <div className={`
                  rounded-xl overflow-hidden transition-all relative
                  ${plan.highlighted 
                    ? 'border-2 border-[#18a77e] shadow-xl bg-white' 
                    : 'border border-gray-200 shadow-sm bg-white hover:shadow-md'}
                `}>
                  {/* Top accent bar */}
                  <div 
                    className="h-1.5 w-full"
                    style={{ 
                      background: plan.highlighted 
                        ? 'linear-gradient(90deg, #0d3b66, #18a77e)' 
                        : '#0d3b66'
                    }}
                  ></div>
                  
                  {/* Decorative corner shape */}
                  {plan.highlighted && (
                    <div className="absolute top-2 right-0 w-20 h-20 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#18a77e] text-white text-xs font-bold py-1 w-full text-center shadow-md">
                        POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg font-bold mb-1 text-[#0d3b66]">{plan.name}</h3>
                    <div className="flex items-baseline mb-3">
                      <span className="text-3xl font-bold text-[#0d3b66]">${plan.price}</span>
                      <span className="text-[#0d3b66]/60 ml-2">/month</span>
                    </div>
                    <p className="text-[#0d3b66]/70 mb-4 text-sm">{plan.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 pb-2 border-b border-gray-100 text-[#0d3b66] text-sm">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <div 
                              className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                              style={{ 
                                background: plan.highlighted 
                                  ? idx % 2 === 0 ? '#0d3b66' : '#18a77e'
                                  : '#0d3b66'
                              }}
                            >
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="ml-2 text-[#0d3b66]/80 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link
                      to="/demo"
                      className={`
                        block text-center py-2.5 px-5 rounded-md font-medium transition-all text-sm
                        ${plan.highlighted 
                          ? 'bg-[#18a77e] text-white hover:bg-[#18a77e]/90' 
                          : 'bg-white text-[#0d3b66] border border-gray-200 hover:bg-gray-50'}
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

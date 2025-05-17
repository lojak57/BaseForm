import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would connect to your Supabase backend
    // to create a new tenant and set up the store
    console.log("Form submitted", { email, password, storeName, selectedPlan });
    alert("Demo mode: In a real implementation, this would create your store.");
  };

  return (
    <Layout>
      <div className="py-16 bg-gradient-to-r from-threadGold/5 to-darkText/5">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-playfair font-bold mb-4">Start Your Online Store</h1>
              <p className="text-darkText/70">
                Create your account and start selling online in minutes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <Tabs defaultValue="signup" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="plans">Select Plan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="My Amazing Store"
                        className="w-full p-3 border border-gray-200 rounded-md"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Create Your Store
                    </Button>
                    
                    <p className="text-center text-sm text-gray-500">
                      By signing up, you agree to our{" "}
                      <Link to="/terms" className="text-threadGold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-threadGold hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </form>

                  <div className="border-t border-gray-200 mt-8 pt-6">
                    <p className="text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <Link to="/login" className="text-threadGold hover:underline font-medium">
                        Log in
                      </Link>
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="plans" className="mt-6">
                  <div className="space-y-6">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan === "basic"
                          ? "border-threadGold bg-threadGold/5"
                          : "border-gray-200 hover:border-threadGold/50"
                      }`}
                      onClick={() => setSelectedPlan("basic")}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">Basic Plan</h3>
                        <div
                          className={`w-5 h-5 rounded-full ${
                            selectedPlan === "basic"
                              ? "bg-threadGold"
                              : "border border-gray-300"
                          }`}
                        >
                          {selectedPlan === "basic" && (
                            <Check className="text-white w-4 h-4" />
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-2xl font-bold">$29</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Everything you need to start selling online.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Up to 100 products</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Basic customization options</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Standard processing (3.9% + 30¢)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan === "premium"
                          ? "border-threadGold bg-threadGold/5"
                          : "border-gray-200 hover:border-threadGold/50"
                      }`}
                      onClick={() => setSelectedPlan("premium")}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">Premium Plan</h3>
                        <div
                          className={`w-5 h-5 rounded-full ${
                            selectedPlan === "premium"
                              ? "bg-threadGold"
                              : "border border-gray-300"
                          }`}
                        >
                          {selectedPlan === "premium" && (
                            <Check className="text-white w-4 h-4" />
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-2xl font-bold">$59</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Advanced features for growing businesses.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Unlimited products</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Advanced customization</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Reduced processing (2.9% + 30¢)</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <Check className="text-green-500 w-4 h-4 mt-0.5 mr-2" />
                          <span>Sales analytics dashboard</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">
                        Both plans include a <strong>14-day free trial</strong>. 
                        No credit card required until your trial ends.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} 
                      className="w-full"
                    >
                      Start Your Free Trial
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-darkText/70">
                Need help getting started?{" "}
                <Link to="/contact" className="text-threadGold hover:underline">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup; 
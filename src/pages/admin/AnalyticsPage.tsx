import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, TrendingUp, ShoppingBag, DollarSign, Package, PieChart, Download, ArrowUp, ArrowDown } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";

// Lazy-loaded chart components
const SalesTrendChart = lazy(() => import("@/components/admin/charts/SalesTrendChart"));
const CategorySalesChart = lazy(() => import("@/components/admin/charts/CategorySalesChart"));

// Define types for our sales data
interface SalesOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  aovChange: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  date: Date;
  amount: number;
  status: "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  items: number;
}

interface CategorySale {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days" | "year">("30days");
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState<SalesOverview>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
    aovChange: 0
  });
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySale[]>([]);
  const [salesTrend, setSalesTrend] = useState<{date: string, amount: number}[]>([]);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    const loadData = setTimeout(() => {
      // Generate mock data based on selected time range
      generateMockData(timeRange);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadData);
  }, [timeRange]);

  const generateMockData = (range: string) => {
    // 1. Generate overview data
    let baseRevenue = 0, baseOrders = 0;
    let prevRevenue = 0, prevOrders = 0;
    
    switch(range) {
      case "7days":
        baseRevenue = 5200;
        baseOrders = 78;
        prevRevenue = 4800;
        prevOrders = 72;
        break;
      case "30days":
        baseRevenue = 21500;
        baseOrders = 325;
        prevRevenue = 18900;
        prevOrders = 290;
        break;
      case "90days":
        baseRevenue = 64000;
        baseOrders = 920;
        prevRevenue = 59000;
        prevOrders = 870;
        break;
      case "year":
        baseRevenue = 245000;
        baseOrders = 3800;
        prevRevenue = 210000;
        prevOrders = 3400;
        break;
    }
    
    // Add some randomness
    const randomFactor = Math.random() * 0.2 + 0.9; // 0.9 to 1.1
    baseRevenue = Math.round(baseRevenue * randomFactor);
    baseOrders = Math.round(baseOrders * randomFactor);
    
    const aov = baseRevenue / baseOrders;
    const prevAov = prevRevenue / prevOrders;
    
    setOverview({
      totalRevenue: baseRevenue,
      totalOrders: baseOrders,
      averageOrderValue: aov,
      revenueChange: ((baseRevenue - prevRevenue) / prevRevenue) * 100,
      ordersChange: ((baseOrders - prevOrders) / prevOrders) * 100,
      aovChange: ((aov - prevAov) / prevAov) * 100
    });
    
    // 2. Generate top products
    const products = [
      { 
        id: "prod1", 
        name: "Premium Denim Jacket", 
        category: "Outerwear",
        price: 149.99, 
        totalSold: Math.round(baseOrders * 0.15), 
        totalRevenue: Math.round(baseOrders * 0.15 * 149.99),
        image: "/placeholder-images/placeholder.jpg"
      },
      { 
        id: "prod2", 
        name: "Designer T-Shirt", 
        category: "Tops", 
        price: 59.99, 
        totalSold: Math.round(baseOrders * 0.25), 
        totalRevenue: Math.round(baseOrders * 0.25 * 59.99),
        image: "/placeholder-images/placeholder.jpg" 
      },
      { 
        id: "prod3", 
        name: "Slim Fit Chinos", 
        category: "Bottoms", 
        price: 79.99, 
        totalSold: Math.round(baseOrders * 0.18), 
        totalRevenue: Math.round(baseOrders * 0.18 * 79.99),
        image: "/placeholder-images/placeholder.jpg"
      },
      { 
        id: "prod4", 
        name: "Wool Sweater", 
        category: "Tops", 
        price: 89.99, 
        totalSold: Math.round(baseOrders * 0.12), 
        totalRevenue: Math.round(baseOrders * 0.12 * 89.99),
        image: "/placeholder-images/placeholder.jpg"
      },
      { 
        id: "prod5", 
        name: "Leather Boots", 
        category: "Footwear", 
        price: 199.99, 
        totalSold: Math.round(baseOrders * 0.08), 
        totalRevenue: Math.round(baseOrders * 0.08 * 199.99),
        image: "/placeholder-images/placeholder.jpg"
      }
    ];
    
    setTopProducts(products.sort((a, b) => b.totalRevenue - a.totalRevenue));
    
    // 3. Generate recent orders
    const orderStatuses: ("processing" | "shipped" | "delivered" | "cancelled" | "refunded")[] = [
      "processing", "shipped", "delivered", "delivered", "delivered", "delivered", "cancelled", "refunded"
    ];
    
    const recentOrdersData: Order[] = [];
    
    // Get date range based on the selected time range
    let startDate = new Date();
    switch(range) {
      case "7days":
        startDate = subDays(new Date(), 7);
        break;
      case "30days":
        startDate = subDays(new Date(), 30);
        break;
      case "90days": 
        startDate = subDays(new Date(), 90);
        break;
      case "year":
        startDate = subDays(new Date(), 365);
        break;
    }
    
    // Generate random recent orders
    for(let i = 0; i < 10; i++) {
      const date = new Date(
        startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime())
      );
      
      const randomItemCount = Math.floor(Math.random() * 5) + 1;
      const randomAmount = Math.round((Math.random() * 300 + 50) * 100) / 100;
      
      recentOrdersData.push({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `Customer ${Math.floor(100 + Math.random() * 900)}`,
        date,
        amount: randomAmount,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        items: randomItemCount
      });
    }
    
    setRecentOrders(recentOrdersData.sort((a, b) => b.date.getTime() - a.date.getTime()));
    
    // 4. Generate category sales
    const categories = [
      { category: "Outerwear", value: Math.round(baseRevenue * 0.3), color: "#3B82F6" },
      { category: "Tops", value: Math.round(baseRevenue * 0.25), color: "#F59E0B" },
      { category: "Bottoms", value: Math.round(baseRevenue * 0.2), color: "#10B981" },
      { category: "Footwear", value: Math.round(baseRevenue * 0.15), color: "#8B5CF6" },
      { category: "Accessories", value: Math.round(baseRevenue * 0.1), color: "#EC4899" }
    ];
    
    const totalCategoryValue = categories.reduce((sum, cat) => sum + cat.value, 0);
    
    setCategorySales(categories.map(cat => ({
      ...cat,
      percentage: Math.round((cat.value / totalCategoryValue) * 100)
    })));
    
    // 5. Generate sales trend data
    const salesTrendData: {date: string, amount: number}[] = [];
    let periods = 0;
    let dateFormat = "";
    
    switch(range) {
      case "7days":
        periods = 7;
        dateFormat = "MMM d";
        break;
      case "30days":
        periods = 30;
        dateFormat = "MMM d";
        break;
      case "90days":
        periods = 12; // Show by weeks
        dateFormat = "'Week' w";
        break;
      case "year":
        periods = 12; // Show by months
        dateFormat = "MMM";
        break;
    }
    
    for(let i = 0; i < periods; i++) {
      let date;
      if (range === "year") {
        date = format(subMonths(new Date(), 11 - i), dateFormat);
      } else if (range === "90days") {
        date = format(subDays(new Date(), 84 - (i * 7)), dateFormat);
      } else {
        date = format(subDays(new Date(), (periods - 1) - i), dateFormat);
      }
      
      // Create a somewhat realistic trend with some randomness
      const trendBase = baseRevenue / periods;
      const randomVariation = (Math.random() * 0.4 + 0.8); // 0.8 to 1.2
      const amount = Math.round(trendBase * randomVariation);
      
      salesTrendData.push({ date, amount });
    }
    
    setSalesTrend(salesTrendData);
  };
  
  // Format currency number
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground">Monitor your store performance and sales trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs 
            value={timeRange} 
            onValueChange={(v) => setTimeRange(v as "7days" | "30days" | "90days" | "year")}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="90days">90 Days</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" className="ml-2">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatCurrency(overview.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {overview.revenueChange >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={overview.revenueChange >= 0 ? "text-emerald-500" : "text-red-500"}>
                    {Math.abs(Math.round(overview.revenueChange))}%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {overview.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {overview.ordersChange >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={overview.ordersChange >= 0 ? "text-emerald-500" : "text-red-500"}>
                    {Math.abs(Math.round(overview.ordersChange))}%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {formatCurrency(overview.averageOrderValue)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {overview.aovChange >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={overview.aovChange >= 0 ? "text-emerald-500" : "text-red-500"}>
                    {Math.abs(Math.round(overview.aovChange))}%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {(Math.random() * 5 + 2).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {Math.random() > 0.5 ? (
                    <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={Math.random() > 0.5 ? "text-emerald-500" : "text-red-500"}>
                    {(Math.random() * 20).toFixed(1)}%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Section */}
          <div className="grid gap-6 md:grid-cols-7">
            {/* Charts Section */}
            <div className="md:col-span-4 space-y-6">
              {/* Sales Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Sales performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-[300px] w-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
                    <SalesTrendChart data={salesTrend} />
                  </Suspense>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your customers' latest purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-xs text-muted-foreground font-medium">
                          <th className="py-2 text-left">Order</th>
                          <th className="py-2 text-left">Customer</th>
                          <th className="py-2 text-left">Date</th>
                          <th className="py-2 text-left">Status</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id} className="border-b">
                            <td className="py-4 text-sm">{order.id}</td>
                            <td className="py-4 text-sm">{order.customerName}</td>
                            <td className="py-4 text-sm">{format(order.date, 'MMM d, yyyy')}</td>
                            <td className="py-4 text-sm">
                              <span className={`inline-flex h-6 items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'}`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 text-sm text-right">{formatCurrency(order.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="md:col-span-3 space-y-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Your best-selling items by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{product.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.category} · {product.totalSold} sold
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(product.totalRevenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Revenue distribution by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <Suspense fallback={<div className="w-40 h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
                      <CategorySalesChart data={categorySales} />
                    </Suspense>
                  </div>
                  <div className="space-y-4">
                    {categorySales.map(cat => (
                      <div key={cat.category} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: cat.color }}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{cat.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{formatCurrency(cat.value)}</span>
                          <span className="text-xs text-muted-foreground">{cat.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage; 
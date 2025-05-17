import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground">Monitor your store performance and sales trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="30days" className="w-[400px]">
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

      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Section */}
        <div className="grid gap-6 md:grid-cols-7">
          {/* Charts Section */}
          <div className="md:col-span-4 space-y-6">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 rounded animate-pulse"></div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 py-4 border-b">
                      {Array(5).fill(0).map((_, j) => (
                        <div key={j} className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="md:col-span-3 space-y-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-36 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-52 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
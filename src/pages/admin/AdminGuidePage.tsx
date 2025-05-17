import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminGuidePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-playfair mb-2">Admin Guide</h1>
      <p className="text-gray-500 mb-6">
        Everything you need to know about managing your webshop
      </p>

      <Tabs defaultValue="getting-started" className="space-y-4">
        <TabsList className="w-full flex overflow-x-auto pb-px">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="fabrics">Fabric Library</TabsTrigger>
          <TabsTrigger value="customization">Store Customization</TabsTrigger>
          <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        {/* Getting Started */}
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Webshop Builder</CardTitle>
              <CardDescription>
                Learn the basics of your new webshop platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Introduction</h3>
                <p className="mb-4">
                  Welcome to your custom webshop! This platform gives you full control over your online
                  store, from products and fabrics to branding and design. This guide will help you
                  understand how to use the admin dashboard to manage every aspect of your business.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">First Steps After Logging In</h4>
                <p className="mb-4">
                  When you first log in, you'll see the Admin Dashboard. This is your command center
                  for everything related to your store. From here, you can:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>View key metrics about your store</li>
                  <li>Access all management features through the left-side menu</li>
                  <li>See recent updates and activity</li>
                  <li>Quickly add new products or manage existing ones</li>
                </ul>
                
                <h4 className="text-lg font-medium mt-6 mb-2">Understanding the Dashboard</h4>
                <p className="mb-2">
                  Your dashboard provides a quick overview of your store's performance and status.
                  Here's what different sections mean:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quick Actions</strong> - Add new products, access settings, or update your store</li>
                  <li><strong>Products Overview</strong> - See how many products you have and their status</li>
                  <li><strong>Categories</strong> - Manage product categories for better organization</li>
                  <li><strong>Recent Activity</strong> - View recent changes made to your store</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-2">Navigating Your Admin Area</h4>
                <p className="mb-2">
                  The left sidebar contains all the tools you need to manage your store:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dashboard</strong> - Return to the main overview</li>
                  <li><strong>Products</strong> - Add, edit, and manage your product catalog</li>
                  <li><strong>Fabric Library</strong> - Manage your fabric options</li>
                  <li><strong>Settings</strong> - Customize your store's appearance and behavior</li>
                  <li><strong>Admin Guide</strong> - That's this page! Reference it whenever you need help</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-2">Next Steps</h4>
                <p>
                  We recommend starting by customizing your store's appearance with your logo and brand colors,
                  then adding your products. Use the tabs above to learn more about each section of your admin area.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Management */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Products</CardTitle>
              <CardDescription>
                Learn how to add, edit, and organize your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Adding New Products</h3>
                <p className="mb-4">
                  Adding products is simple with our step-by-step wizard. Here's how to get started:
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Access the Product Wizard</strong> - Click on "Products" in the sidebar, then "Add New Product"
                  </li>
                  <li>
                    <strong>Basic Information</strong> - Enter your product name, description, and pricing
                    <p className="text-sm text-gray-500 mt-1">
                      Tip: The description field supports formatting to make your product details look professional
                    </p>
                  </li>
                  <li>
                    <strong>Add Product Images</strong> - Upload high-quality photos of your product
                    <p className="text-sm text-gray-500 mt-1">
                      You can drag and drop images or click to browse your files. We recommend using at least 3 images
                      from different angles for each product.
                    </p>
                  </li>
                  <li>
                    <strong>Select Fabrics</strong> - If applicable, connect your product to fabrics from your library
                  </li>
                  <li>
                    <strong>Review and Publish</strong> - Check all details before making your product live
                  </li>
                </ol>

                <h4 className="text-lg font-medium mt-6 mb-2">Editing Existing Products</h4>
                <p className="mb-4">
                  To modify a product that's already in your catalog:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Go to "Products" in the sidebar</li>
                  <li>Find the product in your list and click the "Edit" button</li>
                  <li>Make your changes in any section</li>
                  <li>Click "Save Changes" when you're done</li>
                </ol>
                <p className="text-sm text-gray-500 mt-2">
                  Remember: All changes to published products appear on your live store immediately after saving.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Managing Product Images</h4>
                <p className="mb-2">
                  Great product images are crucial for selling online. Here are some tips:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use consistent lighting and backgrounds for all product photos</li>
                  <li>Show products from multiple angles</li>
                  <li>Include at least one image showing the product in use</li>
                  <li>You can rearrange images by dragging them in the product editor</li>
                  <li>The first image will be your main product thumbnail</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-2">Product Organization Tips</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Assign each product to the correct category for better navigation</li>
                  <li>Use consistent naming conventions for similar products</li>
                  <li>Keep descriptions thorough but concise</li>
                  <li>Update inventory levels regularly if you track stock</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fabric Library */}
        <TabsContent value="fabrics">
          <Card>
            <CardHeader>
              <CardTitle>Fabric Library Management</CardTitle>
              <CardDescription>
                How to manage your fabric options and connect them to products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Understanding the Fabric Library</h3>
                <p className="mb-4">
                  The Fabric Library allows you to showcase all the material options available for your products.
                  Customers can browse your fabric selections and see how they might look on different items.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Adding New Fabrics</h4>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Navigate to Fabrics</strong> - Click "Fabric Library" in the sidebar
                  </li>
                  <li>
                    <strong>Add New Fabric</strong> - Click the "Add Fabric" button
                  </li>
                  <li>
                    <strong>Enter Fabric Details</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Name</strong> - A descriptive name for your fabric</li>
                      <li><strong>Code</strong> - A unique identifier (the system can generate this for you)</li>
                      <li><strong>Description</strong> - Details about texture, weight, care instructions, etc.</li>
                      <li><strong>Color</strong> - Select from predefined color categories or add a custom color</li>
                      <li><strong>Price</strong> - Any additional cost this fabric might add to products</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Upload Swatch Image</strong> - Add a clear, well-lit photo of the fabric
                    <p className="text-sm text-gray-500 mt-1">
                      Tip: Take swatch photos in natural light and ensure the texture and color are clearly visible
                    </p>
                  </li>
                  <li>
                    <strong>Save the Fabric</strong> - Click "Save" to add it to your library
                  </li>
                </ol>

                <h4 className="text-lg font-medium mt-6 mb-2">Managing Existing Fabrics</h4>
                <p className="mb-2">
                  To update fabric information:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Find the fabric in your library</li>
                  <li>Click the "Edit" button</li>
                  <li>Update any details as needed</li>
                  <li>Save your changes</li>
                </ol>

                <h4 className="text-lg font-medium mt-6 mb-2">Connecting Fabrics to Products</h4>
                <p className="mb-4">
                  Once you've built your fabric library, you can link fabrics to applicable products:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Edit an existing product or create a new one</li>
                  <li>Navigate to the "Fabrics" section of the product editor</li>
                  <li>Select which fabrics are available for this product</li>
                  <li>Specify any price adjustments for specific fabric choices</li>
                  <li>Save your product</li>
                </ol>
                <p className="text-sm text-gray-500 mt-2">
                  When customers view your product, they'll see all available fabric options and can select their preference.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Organizing Your Fabric Library</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Group similar fabrics by color to make browsing easier</li>
                  <li>Use consistent naming conventions</li>
                  <li>Keep descriptions thorough but concise</li>
                  <li>Regularly update availability status for fabrics that may be seasonal or limited</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Customization */}
        <TabsContent value="customization">
          <Card>
            <CardHeader>
              <CardTitle>Store Customization</CardTitle>
              <CardDescription>
                Make your webshop uniquely yours with custom branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Branding Your Store</h3>
                <p className="mb-4">
                  Your store's visual identity is crucial for brand recognition. Here's how to customize
                  your webshop's appearance:
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Uploading Your Logo</h4>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Go to Settings</strong> - Click "Settings" in the sidebar
                  </li>
                  <li>
                    <strong>Select Store Branding Tab</strong> - Click on the "Store Branding" tab
                  </li>
                  <li>
                    <strong>Upload Your Logo</strong> - Click the "Upload New Logo" button or drag and drop your file
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: Use a transparent PNG file with dimensions of at least 500px wide
                    </p>
                  </li>
                  <li>
                    <strong>Save Changes</strong> - Don't forget to click "Save Branding Settings" at the bottom
                  </li>
                </ol>
                <p className="text-sm text-gray-500 mt-2">
                  Your logo will appear in the store header, emails to customers, and receipts.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Setting Your Brand Colors</h4>
                <p className="mb-4">
                  Customize your store's color scheme to match your brand identity:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to Settings → Store Branding</li>
                  <li>Find the "Theme Colors" section</li>
                  <li>Use the color pickers to select your:</li>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Primary Color</strong> - Used for buttons, accents, and highlights</li>
                    <li><strong>Text Color</strong> - The main color for text throughout your site</li>
                    <li><strong>Background Color</strong> - The main background color of your store</li>
                  </ul>
                  <li>Check the preview section to see how your colors work together</li>
                  <li>Click "Save Branding Settings" when you're happy with your choices</li>
                </ol>

                <h4 className="text-lg font-medium mt-6 mb-2">Customizing Product Descriptions</h4>
                <p className="mb-2">
                  Create a consistent voice for your product descriptions:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Go to Settings → Product Description</li>
                  <li>Edit the default product description template</li>
                  <li>This template will be used as a starting point for all new products</li>
                  <li>Save your changes</li>
                </ol>
                <p className="text-sm text-gray-500 mt-2">
                  You can still customize individual product descriptions during product creation.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Managing Categories</h4>
                <p className="mb-2">
                  Organize your products with clear, well-structured categories:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Go to Settings → Categories</li>
                  <li>Here you can edit existing categories or create new ones (up to 4 categories)</li>
                  <li>For each category, you can set a name, description, and image</li>
                  <li>Categories appear in your store's navigation menu</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure more detailed aspects of your webshop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Fine-Tuning Your Store</h3>
                <p className="mb-4">
                  Beyond the basics, there are several advanced settings you can adjust to optimize your store:
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">SEO Settings</h4>
                <p className="mb-4">
                  Help customers find your store through search engines:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Product SEO</strong> - When editing any product, fill in the SEO fields:
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      <li>SEO Title (shown in search results)</li>
                      <li>Meta Description (summary shown in search results)</li>
                      <li>URL Slug (keep it short and relevant)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Category SEO</strong> - Similarly, optimize your category pages by filling in their SEO fields
                  </li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-2">Store Policies</h4>
                <p className="mb-2">
                  Set up your store's legal policies and customer service information:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <strong>Return Policy</strong> - Clearly explain your terms for returns and exchanges
                  </li>
                  <li>
                    <strong>Privacy Policy</strong> - Explain how you handle customer data
                  </li>
                  <li>
                    <strong>Terms of Service</strong> - Outline the rules for using your store
                  </li>
                  <li>
                    <strong>Shipping Information</strong> - Detail shipping methods, costs, and timeframes
                  </li>
                </ol>
                <p className="text-sm text-gray-500 mt-2">
                  Well-documented policies build trust with your customers and reduce service inquiries.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">User Management</h4>
                <p className="mb-4">
                  If you have multiple people managing your store:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Manage admin accounts through your Supabase dashboard</li>
                  <li>Always use strong, unique passwords for all admin accounts</li>
                  <li>Regularly review who has access to your admin area</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-2">Backup and Maintenance</h4>
                <p className="mb-2">
                  Protect your store data with these practices:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Regularly export your product data as a backup</li>
                  <li>Keep records of any custom settings you've configured</li>
                  <li>After making significant changes, test your store as a customer would</li>
                  <li>Use the Diagnostics page to check for any system issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshooting */}
        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Common Issues</CardTitle>
              <CardDescription>
                Solutions to problems you might encounter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Common Issues and Solutions</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Images Not Uploading</h4>
                    <p className="mb-2">If you're having trouble uploading images, try these steps:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Check that your image is under the size limit (20MB for products, 5MB for logos)</li>
                      <li>Make sure the file is in a supported format (JPG, PNG, GIF)</li>
                      <li>Try a different browser or device</li>
                      <li>If using drag-and-drop, try the file browser option instead</li>
                      <li>Check your internet connection</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Products Not Showing on Storefront</h4>
                    <p className="mb-2">If a product isn't appearing on your store:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Verify the product is marked as "Published" or "In Stock"</li>
                      <li>Check that the product is assigned to a category</li>
                      <li>Make sure you've added at least one product image</li>
                      <li>Try clearing your browser cache or viewing in an incognito window</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Color Changes Not Applying</h4>
                    <p className="mb-2">If your theme color changes aren't showing up:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Make sure you clicked "Save Settings" after making changes</li>
                      <li>Clear your browser cache or try a hard refresh (Ctrl+F5 or Cmd+Shift+R)</li>
                      <li>Check that you're viewing your live store, not a preview</li>
                      <li>If using a mobile device, try on a desktop computer</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">Login Issues</h4>
                    <p className="mb-2">If you're unable to log in to your admin area:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Check that you're using the correct email address and password</li>
                      <li>Try the "Forgot Password" option to reset your password</li>
                      <li>Clear your browser cookies and cache</li>
                      <li>Ensure you're on the correct login URL</li>
                      <li>If you're still locked out, contact your developer or support team</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-2">Using the Diagnostics Page</h3>
                <p className="mb-4">
                  Your webshop includes a built-in diagnostics tool to help identify and resolve issues:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Go to "Diagnostics" in the sidebar (if available)</li>
                  <li>Click "Run Diagnostics" to check for common issues</li>
                  <li>Review the results for any warnings or errors</li>
                  <li>Follow the recommended actions to resolve identified problems</li>
                </ol>

                <h3 className="text-xl font-semibold mt-8 mb-2">Getting Additional Help</h3>
                <p className="mb-2">
                  If you're still experiencing issues after trying the solutions above:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check for any in-app notifications about system maintenance</li>
                  <li>Contact your developer or hosting provider</li>
                  <li>When reporting an issue, include:</li>
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>What you were trying to do</li>
                    <li>What happened instead</li>
                    <li>Any error messages you saw</li>
                    <li>Screenshots if possible</li>
                    <li>Browser and device information</li>
                  </ul>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

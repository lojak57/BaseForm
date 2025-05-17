import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminGuidePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold font-playfair mb-2">The Not-So-Scary Admin Guide</h1>
      <p className="text-gray-500 mb-6">
        Your friendly companion to running your webshop without pulling your hair out
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
                <h3 className="text-xl font-semibold mb-2">Well hello there, Shop Boss! 👋</h3>
                <p className="mb-4">
                  First off, congratulations on your snazzy new online shop! No computer science degree required here—we've
                  designed this whole system to be as user-friendly as that barista who remembers your complicated coffee order.
                  This guide will walk you through everything without the tech jargon headache.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-2">Just Logged In? Don't Panic!</h4>
                <p className="mb-4">
                  So you've made it past the login screen—achievement unlocked! 🏆 What you're looking at now is your
                  command center (much less intimidating than NASA's, I promise). Think of it as the cockpit for your
                  e-commerce empire. From here, you can:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check how your shop's doing (without the anxiety-inducing spreadsheets)</li>
                  <li>Access all the cool features through that menu on the left (go ahead, click around—you won't break anything!)</li>
                  <li>See what's been happening while you were busy crafting your amazing products</li>
                  <li>Add new products faster than you can say "Where's my coffee?"</li>
                </ul>
                
                <h4 className="text-lg font-medium mt-6 mb-2">Dashboard Decoder Ring 🔑</h4>
                <p className="mb-2">
                  That colorful screen you're looking at? It's like the fitness tracker for your shop—except it won't judge
                  you for skipping leg day. Here's your translation guide to all those fancy widgets:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Quick Actions</strong> - Those big buttons that let you do things like add products without hunting through menus. Think of them as your "I need coffee NOW" buttons.</li>
                  <li><strong>Products Overview</strong> - Your inventory at a glance. Perfect for those "Wait, how many clutches do we have again?" moments.</li>
                  <li><strong>Categories</strong> - Where you organize your products, because lumping everything under "Cool Stuff" isn't quite specific enough.</li>
                  <li><strong>Recent Activity</strong> - The shop's diary, showing what's been happening. Spoiler alert: it's not gossiping about you.</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-2">The Magic Menu Tour 🎭</h4>
                <p className="mb-2">
                  That menu on the left isn't just pretty decoration—it's your magical wardrobe to different parts of your shop kingdom:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dashboard</strong> - The "take me home" button. Click this when you're lost and need a hug.</li>
                  <li><strong>Products</strong> - Where your beautiful creations live digitally. Add new ones, give the existing ones makeovers, or just visit them to say hi.</li>
                  <li><strong>Fabric Library</strong> - Your textile kingdom! This is where you manage all your fabric options, because we know you're not just using one boring material.</li>
                  <li><strong>Settings</strong> - Your shop's personal stylist page. Change colors, update logos, or give your store a completely new look. No fashion degree required!</li>
                  <li><strong>Admin Guide</strong> - You're looking at it! Like having a friendly tech-savvy friend in your pocket. Except I don't need snacks or complain about your Wi-Fi.</li>
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
              <CardTitle>Help! My Shop is Being Dramatic 🎭</CardTitle>
              <CardDescription>
                When technology decides to have a temper tantrum (and how to handle it with grace)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">When Things Go Sideways 😄</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">The Case of the Stubborn Image 📷</h4>
                    <p className="mb-2">When your gorgeous product photo refuses to upload (we get it, even photos have bad days):</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Check if it's a JPG, PNG, or WebP format. The system is picky about its image diet.</li>
                      <li>Is it larger than 5MB? That's like trying to fit into your pre-holiday jeans—it just won't work. Try compressing it!</li>
                      <li>Your browser might be having a moment. Try a different one (Chrome and Firefox are like the reliable friends who always help you move).</li>
                      <li>Drag-and-drop being temperamental? Click the old-fashioned "Choose File" button instead. Sometimes vintage is better!</li>
                      <li>Is your Wi-Fi doing its best sloth impression? Try moving closer to your router or switching to a caffeine-fueled coffee shop connection.</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">The Invisible Product Mystery 🕵️‍♀️</h4>
                    <p className="mb-2">So you've created a product that's playing hide-and-seek with your customers? Let's solve this little mystery:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Is it marked as "Published" or "In Stock"? Unpublished products are like vampires—they don't show up in reflections (or your storefront).</li>
                      <li>Did you assign it to a category? Products without categories are like lost tourists—they exist but have no idea where they belong.</li>
                      <li>Does it have at least one photo? Even supermodels need headshots to get work!</li>
                      <li>Try the old "clear your cache" trick (it's the tech equivalent of "have you tried turning it off and on again?") or peek at your store in an incognito window.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">When Your Color Choices Are Being Ignored 🎨</h4>
                    <p className="mb-2">Did you give your store a makeover that didn't stick? Here's why your color therapy session might not be working:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>The eternal "Did you hit Save?" question. It happens to the best of us! Look for that "Save Settings" button—it's not just decorative.</li>
                      <li>Your browser is being nostalgic for your old colors. Try a hard refresh (Ctrl+F5 on Windows or Cmd+Shift+R on Mac)—it's like giving your browser amnesia about the past.</li>
                      <li>Are you looking at your actual live store? Preview modes sometimes wear last season's colors.</li>
                      <li>Mobile devices can be stubborn sometimes. Try checking on a desktop—they're more adaptable to change.</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-2">The Dreaded Login Lockout 🔒</h4>
                    <p className="mb-2">Can't get into your admin area? Don't worry—we've all been there (usually right before that important meeting):</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Are you sure that's your email? We're not judging, but typing your cat's name followed by all your favorite numbers isn't always your actual login.</li>
                      <li>The "Forgot Password" button is your friend, not an admission of failure. We use it weekly ourselves!</li>
                      <li>Try clearing your cookies and cache—think of it as a spa treatment for your browser.</li>
                      <li>Double-check you're at <strong>vcsews.com/admin/login</strong> and not something like <em>definitelynotascam.com/vc-sews-login</em>.</li>
                      <li>Still stuck? Time to call in the cavalry (that's your developer or our support team). No tech problem survives contact with them!</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-2">The Digital Doctor Is In 💉</h3>
                <p className="mb-4">
                  Your webshop comes with its very own diagnostic tool—it's like WebMD but without convincing you that your minor site hiccup is actually digital doom:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Find the "Diagnostics" option in your sidebar menu (it's wearing a little stethoscope icon).</li>
                  <li>Click "Run Diagnostics" and watch your site get a full health check-up.</li>
                  <li>Review what the doctor found—warnings are like "you should eat more vegetables," while errors are more "please stop trying to survive on energy drinks alone."</li>
                  <li>Follow the prescription (recommended fixes)—the digital doctor knows best!</li>
                </ol>

                <h3 className="text-xl font-semibold mt-8 mb-2">When All Else Fails: The Bat Signal 🌕</h3>
                <p className="mb-2">
                  If you've tried everything and your site is still being more dramatic than a reality TV show contestant:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check for any notifications—sometimes the system is just trying to tell you it's having scheduled maintenance (like a "gone for lunch" sign).</li>
                  <li>Time to contact your faithful sidekick (that's your developer or our amazing support team at <strong>support@vcsews.com</strong>).</li>
                  <li>When you send up the bat signal, include these clues to help solve the mystery:</li>
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>What you were attempting to do ("I was just trying to upload my 200MB animated GIF logo...")</li>
                    <li>What happened instead ("...and the site started playing the Macarena")</li>
                    <li>Any error messages (they're like cryptic riddles that actually help)</li>
                    <li>Screenshots—worth a thousand words and save hours of troubleshooting!</li>
                    <li>What device and browser you're using (because sometimes Safari and Chrome aren't on speaking terms)</li>
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

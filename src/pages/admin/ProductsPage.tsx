
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductManagement } from "@/context/ProductManagementContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/context/CartContext";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { products, loading, error, deleteProduct } = useProductManagement();
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-playfair">All Products</h2>
        <Link to="/admin/products/new">
          <Button className="bg-threadGold hover:bg-threadGold/90">Add New Product</Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-threadGold" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No products found. Create your first product!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.defaultImages[0]} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categoryId}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell className="space-x-2">
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

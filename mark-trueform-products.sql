-- Mark specific TrueForm products
UPDATE products 
SET source = 'trueform' 
WHERE name IN ('WebShop', 'BookMe', 'MenuGo', 'Portfolio', 'CourseDrop', 'Members Hub')
   OR id IN (
      '58b7ad91-d60d-4d16-8321-53ab9b64b766', 
      '21d8b8a7-f300-460c-8cec-dc8d78e37726',
      '22438589-ed61-4a91-ab7c-afe2bd8e6487',
      'beec292c-8a82-45a0-848f-d0797f3bcbc1',
      'b1c6b08f-3b30-499b-ab12-51149ddee843',
      'e72bf16a-0bf4-464c-80cc-298703a8db29'
   ); 
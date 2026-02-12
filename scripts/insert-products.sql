-- Insert all products into the products table
INSERT INTO products (id, name, category, price, unit, image, description, in_stock, created_at, updated_at) VALUES
('fried-gram', 'Fried Gram', 'Snacks', 4.99, '250g', '/products/fried-gram.jpg', 'Premium quality roasted chana dal (fried gram) with a crispy texture and nutty flavor. Perfect as a healthy snack or ingredient for various dishes.', true, NOW(), NOW()),
('white-chick-peas', 'White Chick Peas', 'Staples', 7.99, '500g', '/products/white-chick-peas.jpg', 'Premium quality white chickpeas (kabuli chana) sourced from the finest farms. Perfect for making curries, salads, and traditional dishes.', true, NOW(), NOW()),
('green-peas', 'Green Peas', 'Staples', 5.99, '500g', '/products/green-peas.jpg', 'Fresh dried green peas with natural sweetness and vibrant color. Essential ingredient for various Indian dishes and curries.', true, NOW(), NOW()),
('badam-pisin', 'Badam Pisin', 'Staples', 24.99, '100g', '/products/badam-pisin.jpg', 'Premium almond gum (badam pisin) known for its cooling properties and health benefits. Used in traditional drinks and desserts.', true, NOW(), NOW()),
('jaggery-powder', 'Jaggery Powder', 'Staples', 8.99, '500g', '/products/jaggery-powder.jpg', 'Pure organic jaggery powder made from sugarcane juice. A healthy alternative to refined sugar with natural minerals and vitamins.', true, NOW(), NOW()),
('round-red-chilli', 'Round Red Chilli', 'Spices', 9.99, '200g', '/products/round-red-chilli.jpg', 'Premium dried round red chilies with intense heat and rich flavor. Essential for authentic South Indian cooking and spice blends.', true, NOW(), NOW()),
('jaggery-balls', 'Jaggery Balls', 'Staples', 12.99, '300g', '/products/jaggery-balls.jpg', 'Traditional handmade jaggery balls crafted from pure sugarcane juice. These golden spheres are perfect for making sweets and traditional remedies.', true, NOW(), NOW()),
('multani-mitti', 'Multani Mitti', 'Beauty & Wellness', 6.99, '200g', '/products/multani-mitti.jpg', 'Pure Fuller''s earth clay powder known for its excellent skin cleansing and oil-absorbing properties. Perfect for natural face masks and beauty treatments.', true, NOW(), NOW()),
('red-chilli', 'Red Chilli', 'Spices', 8.99, '250g', '/products/red-chilli.jpg', 'Premium dried red chilli peppers with bold flavor and moderate heat. Ideal for making spice blends, pastes, and traditional South Indian cuisine.', true, NOW(), NOW()),
('puffed-rice', 'Puffed Rice', 'Snacks', 3.99, '500g', '/products/puffed-rice.jpg', 'Light, airy puffed rice made from premium grains. Perfect for making traditional South Indian snacks like bhel puri and other street foods.', true, NOW(), NOW()),
('white-peas', 'White Peas', 'Staples', 6.99, '500g', '/products/white-peas.jpg', 'Dried white peas with a mild, slightly sweet flavor. Excellent for making dal preparations, curries, and traditional South Indian dishes.', true, NOW(), NOW()),
('nattukaramani', 'Nattukaramani', 'Spices', 14.99, '100g', '/products/nattukaramani.jpg', 'Premium Nattukaramani spice blend used in traditional South Indian cooking. Adds authentic flavor to various dishes and preparations.', true, NOW(), NOW());

-- Insert additional products from the JSON file
INSERT INTO products (id, name, category, price, unit, image, description, in_stock, created_at, updated_at) VALUES
('almond', 'Almond', 'Dry Fruits & Nuts', 18.99, '250g', '/products/almond.jpg', 'Premium quality almonds with smooth texture and rich flavor.', true, NOW(), NOW()),
('cashew', 'Cashew', 'Dry Fruits & Nuts', 22.99, '250g', '/products/cashew.jpg', 'Hand-selected cashew nuts with superior quality and taste.', true, NOW(), NOW()),
('kishmish', 'Kishmish', 'Dry Fruits & Nuts', 12.99, '300g', '/products/kishmish.jpg', 'Premium dried raisins (kishmish) with natural sweetness.', true, NOW(), NOW()),
('raw-peanut', 'Raw Peanut', 'Dry Fruits & Nuts', 6.99, '500g', '/products/raw-peanut.jpg', 'Raw peanuts with high nutritional value and natural flavor.', true, NOW(), NOW()),
('dry-figs', 'Dry Figs', 'Dry Fruits & Nuts', 16.99, '250g', '/products/dry-figs.jpg', 'Premium dried figs rich in fiber and natural sweetness.', true, NOW(), NOW()),
('star-anise', 'Star Anise', 'Spices', 7.99, '100g', '/products/star-anise.jpg', 'Aromatic star anise pods for authentic spice blends.', true, NOW(), NOW()),
('cardamom', 'Cardamom', 'Spices', 19.99, '100g', '/products/cardamom.jpg', 'Premium green cardamom for traditional Indian cooking.', true, NOW(), NOW()),
('fenugreek', 'Fenugreek', 'Spices', 6.99, '100g', '/products/fenugreek.jpg', 'Dried fenugreek seeds (methi) for authentic flavor.', true, NOW(), NOW()),
('sabja-seed', 'Sabja Seed', 'Spices', 8.99, '100g', '/products/sabja-seed.jpg', 'Premium sabja (basil) seeds for traditional beverages.', true, NOW(), NOW()),
('mustard-seed', 'Mustard Seed', 'Spices', 5.99, '100g', '/products/mustard-seed.jpg', 'Black mustard seeds for tempering and spice blends.', true, NOW(), NOW()),
('clove', 'Clove', 'Spices', 11.99, '100g', '/products/clove.jpg', 'Premium cloves for authentic Indian spice blends.', true, NOW(), NOW()),
('ajwain-seeds', 'Ajwain Seeds', 'Spices', 7.99, '100g', '/products/ajwain-seeds.jpg', 'Carom seeds (ajwain) with digestive properties.', true, NOW(), NOW()),
('white-poppy-seeds', 'White Poppy Seeds', 'Spices', 9.99, '100g', '/products/white-poppy-seeds.jpg', 'Premium white poppy seeds for cooking and baking.', true, NOW(), NOW()),
('black-sesame-seeds', 'Black Sesame Seeds', 'Spices', 8.99, '100g', '/products/black-sesame-seeds.jpg', 'Nutrient-rich black sesame seeds for recipes.', true, NOW(), NOW()),
('cumin-seeds', 'Cumin Seeds', 'Spices', 6.99, '100g', '/products/cumin-seeds.jpg', 'Aromatic cumin seeds for traditional Indian cooking.', true, NOW(), NOW()),
('toor-dal', 'Toor Dal', 'Staples', 9.99, '500g', '/products/toor-dal.jpg', 'Premium pigeon peas (toor dal) for everyday cooking.', true, NOW(), NOW()),
('moong-dal', 'Moong Dal', 'Staples', 8.99, '500g', '/products/moong-dal.jpg', 'Premium split mung beans for healthy cooking.', true, NOW(), NOW()),
('green-gram', 'Green Gram', 'Staples', 7.99, '500g', '/products/green-gram.jpg', 'Whole mung beans with excellent nutritional value.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

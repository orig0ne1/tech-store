INSERT INTO companies (id, name, description, logo,
                       latitude, longitude,
                       email, phone, address,
                       monday, tuesday, wednesday, thursday, friday, saturday, sunday,
                       telegram, vk, instagram, youtube, website)
VALUES (1, 'TechStore', 'Online store of electronics and gadgets',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Ionicons_storefront.svg/330px-Ionicons_storefront.svg.png',
        55.7586, 37.6095,
        'info@techstore.ru', '+7 (495) 120-40-50', 'Moscow, Tverskaya St, 1',
        '09:00-18:00', '09:00-18:00', '09:00-18:00', '09:00-18:00', '09:00-18:00',
        '10:00-16:00', 'day off',
        'https://t.me/techstore', 'https://vk.com/techstore', 'https://instagram.com/techstore',
        'https://youtube.com/@techstore', 'https://techstore.ru');

INSERT INTO company_photos (company_id, image_url)
VALUES (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Ionicons_storefront.svg/330px-Ionicons_storefront.svg.png'),
       (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/HP_Pavilion_Computer_laptop_keyboard_closeup.jpg/960px-HP_Pavilion_Computer_laptop_keyboard_closeup.jpg'),
       (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blackview_A60_Smartphone_Android_mobile_phone_front_face_lock_screen.jpg/960px-Blackview_A60_Smartphone_Android_mobile_phone_front_face_lock_screen.jpg'),
       (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Beautiful_Mechanical_Keyboard.jpg/960px-Beautiful_Mechanical_Keyboard.jpg'),
       (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MacBook_Air_keyboard_1.jpg/960px-MacBook_Air_keyboard_1.jpg'),
       (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Apple_iPhone_15_Pro.jpg/960px-Apple_iPhone_15_Pro.jpg');

INSERT INTO categories (id, name, slug, image)
VALUES (1, 'Laptops', 'laptops', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/HP_Pavilion_Computer_laptop_keyboard_closeup.jpg/960px-HP_Pavilion_Computer_laptop_keyboard_closeup.jpg'),
       (2, 'Smartphones', 'smartphones', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Blackview_A60_Smartphone_Android_mobile_phone_front_face_lock_screen.jpg/960px-Blackview_A60_Smartphone_Android_mobile_phone_front_face_lock_screen.jpg'),
       (3, 'Accessories', 'accessories', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Beautiful_Mechanical_Keyboard.jpg/960px-Beautiful_Mechanical_Keyboard.jpg');

INSERT INTO products (id, name, slug, description, price, currency, image, available, category_id, created_at)
VALUES (1, 'MacBook Air', 'macbook-air', 'Light laptop with the M4 chip', 1200, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MacBook_Air_keyboard_1.jpg/960px-MacBook_Air_keyboard_1.jpg', 1, 1, datetime('now', '-20 days')),
       (2, 'MacBook Pro 14', 'macbook-pro-14', 'Professional laptop with the M4 Pro chip', 2100, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/MacBook_Pro_16_%28M1_Pro%2C_2021%29_-_Wikipedia.jpg/960px-MacBook_Pro_16_%28M1_Pro%2C_2021%29_-_Wikipedia.jpg', 1, 1, datetime('now', '-15 days')),
       (3, 'Dell XPS 13', 'dell-xps-13', 'Premium ultrabook', 1500, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Dell_XPS_13_%282018%29.png/960px-Dell_XPS_13_%282018%29.png', 0, 1, datetime('now', '-10 days')),
       (4, 'iPhone 15 Pro', 'iphone-15-pro', 'Flagship smartphone', 1300, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Apple_iPhone_15_Pro.jpg/960px-Apple_iPhone_15_Pro.jpg', 1, 2, datetime('now', '-8 days')),
       (5, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Android flagship', 1000, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Samsung_Galaxy_S24_%28webtekno%29_008.png/960px-Samsung_Galaxy_S24_%28webtekno%29_008.png', 1, 2, datetime('now', '-5 days')),
       (6, 'Google Pixel 8', 'google-pixel-8', 'Smartphone with the best camera', 800, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Google_Pixel_8_Rose_front.jpg/960px-Google_Pixel_8_Rose_front.jpg', 0, 2, datetime('now', '-3 days')),
       (7, 'USB-C Cable', 'usb-c-cable', 'USB-C to USB-C cable, 1 m', 20, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/USB_Type-C_Charging_Cable_for_Apple_MacBook_Pro_%2845718811934%29.jpg/960px-USB_Type-C_Charging_Cable_for_Apple_MacBook_Pro_%2845718811934%29.jpg', 1, 3, datetime('now', '-2 days')),
       (8, 'Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse', 50, 'USD',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2023_Mysz_komputerowa_Logitech_G903_Lightspeed.jpg/960px-2023_Mysz_komputerowa_Logitech_G903_Lightspeed.jpg', 1, 3, datetime('now', '-1 day'));

INSERT INTO product_images (product_id, image_url)
VALUES (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/MacBook_Air_keyboard_2.jpg/960px-MacBook_Air_keyboard_2.jpg'),
       (1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/MacBook_Air_keyboard_3.jpg/960px-MacBook_Air_keyboard_3.jpg'),
       (4, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/IPhone_Pro_%28Max%29.jpg/960px-IPhone_Pro_%28Max%29.jpg');

INSERT INTO product_attributes (product_id, attribute_key, attribute_value)
VALUES (1, 'CPU', 'Apple M4'),
       (1, 'RAM', '16 GB'),
       (1, 'Storage', '512 GB'),
       (1, 'Display', '13.6" Liquid Retina'),
       (2, 'CPU', 'Apple M4 Pro'),
       (2, 'RAM', '32 GB'),
       (2, 'Storage', '1 TB'),
       (2, 'Display', '14.2" Liquid Retina XDR'),
       (3, 'CPU', 'Intel Core i7'),
       (3, 'RAM', '16 GB'),
       (3, 'Storage', '512 GB'),
       (3, 'Display', '13.4" OLED'),
       (4, 'CPU', 'A17 Pro'),
       (4, 'RAM', '8 GB'),
       (4, 'Storage', '256 GB'),
       (4, 'Display', '6.1" Super Retina XDR'),
       (5, 'CPU', 'Snapdragon 8 Gen 3'),
       (5, 'RAM', '12 GB'),
       (5, 'Storage', '256 GB'),
       (5, 'Display', '6.2" Dynamic AMOLED 120 Hz');

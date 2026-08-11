INSERT INTO companies (id, name, description, logo,
                       email, phone, address,
                       monday, tuesday, wednesday, thursday, friday, saturday, sunday,
                       telegram, vk, instagram, youtube, website)
VALUES (1, 'TechStore', 'Online store of electronics and gadgets',
        'https://example.com/logo.png',
        'info@example.com', '+79999999999', 'Moscow',
        '09:00-18:00', '09:00-18:00', '09:00-18:00', '09:00-18:00', '09:00-18:00',
        '10:00-16:00', 'closed',
        'https://t.me/techstore', 'https://vk.com/techstore', 'https://instagram.com/techstore',
        'https://youtube.com/@techstore', 'https://example.com');

INSERT INTO categories (id, name, slug, image)
VALUES (1, 'Laptops', 'laptops', 'https://example.com/img/laptops.jpg'),
       (2, 'Smartphones', 'smartphones', 'https://example.com/img/smartphones.jpg'),
       (3, 'Accessories', 'accessories', 'https://example.com/img/accessories.jpg');

INSERT INTO products (id, name, slug, description, price, currency, image, available, category_id, created_at)
VALUES (1, 'MacBook Air', 'macbook-air', 'Lightweight laptop with M4 chip', 120000, 'RUB',
        'https://example.com/img/macbook-air.jpg', 1, 1, datetime('now', '-20 days')),
       (2, 'MacBook Pro 14', 'macbook-pro-14', 'Pro laptop with M4 Pro chip', 210000, 'RUB',
        'https://example.com/img/macbook-pro-14.jpg', 1, 1, datetime('now', '-15 days')),
       (3, 'Dell XPS 13', 'dell-xps-13', 'Premium ultrabook', 150000, 'RUB',
        'https://example.com/img/dell-xps-13.jpg', 0, 1, datetime('now', '-10 days')),
       (4, 'iPhone 15 Pro', 'iphone-15-pro', 'Flagship smartphone', 130000, 'RUB',
        'https://example.com/img/iphone-15-pro.jpg', 1, 2, datetime('now', '-8 days')),
       (5, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Android flagship smartphone', 100000, 'RUB',
        'https://example.com/img/galaxy-s24.jpg', 1, 2, datetime('now', '-5 days')),
       (6, 'Google Pixel 8', 'google-pixel-8', 'Camera-focused smartphone', 80000, 'RUB',
        'https://example.com/img/pixel-8.jpg', 0, 2, datetime('now', '-3 days')),
       (7, 'USB-C Cable', 'usb-c-cable', 'USB-C to USB-C cable, 1m', 2000, 'RUB',
        'https://example.com/img/usb-c-cable.jpg', 1, 3, datetime('now', '-2 days')),
       (8, 'Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse', 5000, 'RUB',
        'https://example.com/img/wireless-mouse.jpg', 1, 3, datetime('now', '-1 day'));

INSERT INTO product_images (product_id, image_url)
VALUES (1, 'https://example.com/img/macbook-air-1.jpg'),
       (1, 'https://example.com/img/macbook-air-2.jpg'),
       (4, 'https://example.com/img/iphone-15-pro-1.jpg');

INSERT INTO product_attributes (product_id, attribute_key, attribute_value)
VALUES (1, 'CPU', 'Apple M4'),
       (1, 'RAM', '16 GB'),
       (1, 'Storage', '512 GB'),
       (4, 'CPU', 'A17 Pro'),
       (4, 'RAM', '8 GB'),
       (4, 'Storage', '256 GB');

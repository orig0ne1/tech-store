CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    logo VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    monday VARCHAR(255),
    tuesday VARCHAR(255),
    wednesday VARCHAR(255),
    thursday VARCHAR(255),
    friday VARCHAR(255),
    saturday VARCHAR(255),
    sunday VARCHAR(255),
    telegram VARCHAR(255),
    vk VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    website VARCHAR(255)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255)
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(2000),
    price BIGINT NOT NULL,
    currency VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    available BOOLEAN NOT NULL,
    category_id BIGINT,
    created_at TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE product_images (
    product_id BIGINT NOT NULL,
    image_url VARCHAR(255),
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE product_attributes (
    product_id BIGINT NOT NULL,
    attribute_key VARCHAR(255) NOT NULL,
    attribute_value VARCHAR(255),
    CONSTRAINT fk_product_attributes_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE availability_requests (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    created_at TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    CONSTRAINT fk_availability_requests_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE customer_requests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    message VARCHAR(2000),
    created_at TIMESTAMP,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(255),
    comment VARCHAR(2000),
    total BIGINT NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price BIGINT NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE chats (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    text VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP,
    CONSTRAINT fk_chat_messages_chat FOREIGN KEY (chat_id) REFERENCES chats (id)
);

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
        'https://example.com/img/macbook-air.jpg', TRUE, 1, NOW() - INTERVAL '20 days'),
       (2, 'MacBook Pro 14', 'macbook-pro-14', 'Pro laptop with M4 Pro chip', 210000, 'RUB',
        'https://example.com/img/macbook-pro-14.jpg', TRUE, 1, NOW() - INTERVAL '15 days'),
       (3, 'Dell XPS 13', 'dell-xps-13', 'Premium ultrabook', 150000, 'RUB',
        'https://example.com/img/dell-xps-13.jpg', FALSE, 1, NOW() - INTERVAL '10 days'),
       (4, 'iPhone 15 Pro', 'iphone-15-pro', 'Flagship smartphone', 130000, 'RUB',
        'https://example.com/img/iphone-15-pro.jpg', TRUE, 2, NOW() - INTERVAL '8 days'),
       (5, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Android flagship smartphone', 100000, 'RUB',
        'https://example.com/img/galaxy-s24.jpg', TRUE, 2, NOW() - INTERVAL '5 days'),
       (6, 'Google Pixel 8', 'google-pixel-8', 'Camera-focused smartphone', 80000, 'RUB',
        'https://example.com/img/pixel-8.jpg', FALSE, 2, NOW() - INTERVAL '3 days'),
       (7, 'USB-C Cable', 'usb-c-cable', 'USB-C to USB-C cable, 1m', 2000, 'RUB',
        'https://example.com/img/usb-c-cable.jpg', TRUE, 3, NOW() - INTERVAL '2 days'),
       (8, 'Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse', 5000, 'RUB',
        'https://example.com/img/wireless-mouse.jpg', TRUE, 3, NOW() - INTERVAL '1 day');

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

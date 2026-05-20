-- BoardRoot Database Initialization Script

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS boardroot_db;
USE boardroot_db;

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at)
VALUES ('admin@boardroot.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjZQQDR5YBXFm/Jb2tL8VxHd8BRNnO', 'Admin', 'User', '+40700000000', 'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample client user (password: client123)
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at, updated_at)
VALUES ('client@boardroot.com', '$2a$10$XptfskLsT1l/bRTLRiiCgemxhELG9LOhM5kG8O/Bnc3cDgU4aQ6Ky', 'John', 'Doe', '+40711111111', 'CLIENT', NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Insert board games (12 games from catalog)
INSERT INTO board_games (
    title, description, min_players, max_players, duration,
    genre, image_url, rulebook_url, price_per_hour,
    available_copies, total_copies, created_at, updated_at,
    complexity, designer, rating, year_published
) VALUES
(
    'Catan',
    'In Catan, players try to be the dominant force on the island of Catan by building settlements, cities, and roads. On each turn dice are rolled to determine what resources the island produces. Players collect these resources to build up their civilizations to get to 10 victory points and win the game.',
    3, 4, '60-120 min',
    'Strategy',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/catan.pdf',
    2.00,
    3, 5, NOW(), NOW(),
    'Medium', 'Klaus Teuber', 4.8, 1995
),
(
    'Ticket to Ride',
    'Ticket to Ride is a cross-country train adventure where players collect and play matching train cards to claim railway routes connecting cities across North America. The longer the routes, the more points they earn.',
    2, 5, '45-90 min',
    'Family',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/ticket-to-ride.pdf',
    1.50,
    2, 4, NOW(), NOW(),
    'Easy', 'Alan R. Moon', 4.7, 2004
),
(
    'Pandemic',
    'In Pandemic, several virulent diseases have broken out simultaneously all over the world! The players are disease-fighting specialists whose mission is to treat disease hotspots while researching cures for each of four plagues before they get out of hand.',
    2, 4, '45 min',
    'Co-op',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/pandemic.pdf',
    1.50,
    4, 6, NOW(), NOW(),
    'Medium', 'Matt Leacock', 4.9, 2008
),
(
    'Azul',
    'Azul is an abstract strategy game where players take turns drafting colored tiles from suppliers to their player board. Later in the round, players score points based on how they placed their tiles to decorate the palace.',
    2, 4, '30-45 min',
    'Abstract',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/azul.pdf',
    1.50,
    1, 3, NOW(), NOW(),
    'Easy', 'Michael Kiesling', 4.6, 2017
),
(
    'Wingspan',
    'Wingspan is a competitive, medium-weight, card-driven, engine-building board game about birds. Players seek to discover and attract the best birds to their network of wildlife preserves.',
    1, 5, '40-70 min',
    'Engine Building',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/wingspan.pdf',
    2.50,
    2, 4, NOW(), NOW(),
    'Medium', 'Elizabeth Hargrave', 4.9, 2019
),
(
    '7 Wonders',
    '7 Wonders is a card drafting game where players develop their ancient civilizations over three ages. Players receive seven cards from the deck, pick one card, and pass the remainder to an adjacent player.',
    2, 7, '30 min',
    'Card Draft',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/7wonders.pdf',
    1.50,
    3, 5, NOW(), NOW(),
    'Medium', 'Antoine Bauza', 4.7, 2010
),
(
    'Codenames',
    'Codenames is a party game for 4-8+ players. Two teams compete to see who can make contact with all of their agents first. Spymasters give one-word clues that can point to multiple words on the board.',
    4, 8, '15-30 min',
    'Party',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/codenames.pdf',
    1.00,
    5, 8, NOW(), NOW(),
    'Easy', 'Vlaada Chvátil', 4.8, 2015
),
(
    'Terraforming Mars',
    'In Terraforming Mars, players take on the role of corporations working together to terraform the planet Mars by raising the temperature, creating oceans, and cultivating green areas.',
    1, 5, '120 min',
    'Strategy',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/terraforming-mars.pdf',
    2.50,
    2, 3, NOW(), NOW(),
    'Heavy', 'Jacob Fryxelius', 4.9, 2016
),
(
    'Splendor',
    'Splendor is a game of chip-collecting and card development. Players are merchants of the Renaissance trying to buy gem mines, means of transportation, and shops to acquire the most prestige points.',
    2, 4, '30 min',
    'Engine Building',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/splendor.pdf',
    1.50,
    4, 6, NOW(), NOW(),
    'Easy', 'Marc André', 4.5, 2014
),
(
    'Dixit',
    'Dixit is a storytelling game where each turn one player is the storyteller. The storyteller chooses a card from their hand and gives a clue about it. Other players select the card in their hands that best matches the clue.',
    3, 6, '30 min',
    'Party',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/dixit.pdf',
    1.50,
    3, 5, NOW(), NOW(),
    'Easy', 'Jean-Louis Roubira', 4.6, 2008
),
(
    'Scythe',
    'Scythe is an engine-building game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor.',
    1, 5, '90-115 min',
    'Strategy',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/scythe.pdf',
    3.00,
    1, 2, NOW(), NOW(),
    'Heavy', 'Jamey Stegmaier', 4.8, 2016
),
(
    'Carcassonne',
    'Carcassonne is a tile-placement game where players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, or grassland.',
    2, 5, '35 min',
    'Family',
    'https://images.unsplash.com/photo-1705044219512-a5a3720e6de0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    '/rulebooks/carcassonne.pdf',
    1.50,
    4, 6, NOW(), NOW(),
    'Easy', 'Klaus-Jürgen Wrede', 4.5, 2000
)
ON DUPLICATE KEY UPDATE title = title;

-- Insert club tables (12 tables as shown in frontend)
INSERT INTO club_tables (name, description, capacity, hourly_rate, is_available) VALUES
('Table 1', 'Cozy corner table for small groups', 4, 5.00, true),
('Table 2', 'Standard gaming table near the entrance', 4, 5.00, true),
('Table 3', 'Window seat with natural lighting', 4, 5.00, true),
('Table 4', 'Quiet area table for focused gaming', 6, 7.50, true),
('Table 5', 'Central table with good visibility', 6, 7.50, true),
('Table 6', 'Large table near the bar area', 6, 7.50, true),
('Table 7', 'Premium corner with comfortable seating', 8, 10.00, true),
('Table 8', 'Spacious table for big groups', 8, 10.00, true),
('Table 9', 'Private area table', 8, 10.00, true),
('Table 10', 'Extra large table for tournaments', 10, 12.50, true),
('Table 11', 'VIP table with dedicated service', 10, 15.00, true),
('Table 12', 'Party room table for special events', 12, 20.00, true)
ON DUPLICATE KEY UPDATE name = name;

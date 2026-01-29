-- Seed Data: Alimentos FODMAP
-- Este ficheiro popula a tabela fodmap_foods com 50+ alimentos organizados por categoria

-- Frutanos – Vegetais
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Frutanos – Vegetais', 'Cebola', 1),
('Frutanos – Vegetais', 'Alho', 2),
('Frutanos – Vegetais', 'Alho-francês', 3),
('Frutanos – Vegetais', 'Cebolinho', 4),
('Frutanos – Vegetais', 'Espargos', 5),
('Frutanos – Vegetais', 'Alcachofra', 6),
('Frutanos – Vegetais', 'Funcho', 7),
('Frutanos – Vegetais', 'Ervilhas', 8);

-- Frutanos – Cereais
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Frutanos – Cereais', 'Trigo', 10),
('Frutanos – Cereais', 'Centeio', 11),
('Frutanos – Cereais', 'Cevada', 12),
('Frutanos – Cereais', 'Pão tradicional', 13),
('Frutanos – Cereais', 'Massas de trigo', 14),
('Frutanos – Cereais', 'Cuscuz', 15),
('Frutanos – Cereais', 'Bulgur', 16);

-- Galactanos (leguminosas)
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Galactanos (leguminosas)', 'Grão-de-bico', 20),
('Galactanos (leguminosas)', 'Lentilhas', 21),
('Galactanos (leguminosas)', 'Feijão preto', 22),
('Galactanos (leguminosas)', 'Feijão vermelho', 23),
('Galactanos (leguminosas)', 'Feijão branco', 24),
('Galactanos (leguminosas)', 'Soja', 25),
('Galactanos (leguminosas)', 'Ervilhas secas', 26);

-- Lactose
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Lactose', 'Leite de vaca', 30),
('Lactose', 'Leite de cabra', 31),
('Lactose', 'Iogurte', 32),
('Lactose', 'Queijo fresco', 33),
('Lactose', 'Requeijão', 34),
('Lactose', 'Natas', 35),
('Lactose', 'Gelado', 36);

-- Frutose em excesso – Fruta
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Frutose em excesso – Fruta', 'Maçã', 40),
('Frutose em excesso – Fruta', 'Pera', 41),
('Frutose em excesso – Fruta', 'Manga', 42),
('Frutose em excesso – Fruta', 'Melancia', 43),
('Frutose em excesso – Fruta', 'Cerejas', 44),
('Frutose em excesso – Fruta', 'Figos', 45),
('Frutose em excesso – Fruta', 'Damasco', 46),
('Frutose em excesso – Fruta', 'Pêssego', 47);

-- Frutose – Outros
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Frutose – Outros', 'Mel', 50),
('Frutose – Outros', 'Xarope de agave', 51),
('Frutose – Outros', 'Xarope de milho', 52),
('Frutose – Outros', 'Sumos de fruta', 53),
('Frutose – Outros', 'Compotas', 54);

-- Polióis – Fruta e Vegetais
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Polióis – Fruta e Vegetais', 'Abacate', 60),
('Polióis – Fruta e Vegetais', 'Cogumelos', 61),
('Polióis – Fruta e Vegetais', 'Couve-flor', 62),
('Polióis – Fruta e Vegetais', 'Maçã cozida', 63),
('Polióis – Fruta e Vegetais', 'Pera cozida', 64),
('Polióis – Fruta e Vegetais', 'Ameixa', 65);

-- Polióis – Adoçantes
INSERT INTO fodmap_foods (category, food_name, order_index) VALUES
('Polióis – Adoçantes', 'Sorbitol', 70),
('Polióis – Adoçantes', 'Manitol', 71),
('Polióis – Adoçantes', 'Xilitol', 72),
('Polióis – Adoçantes', 'Maltitol', 73);

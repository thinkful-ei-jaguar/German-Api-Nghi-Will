BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin123',
    'Nghi-Will',
    '$2y$12$UyGzHIZ/X11kjerayE.YA.rsw7psQb7A0Zih0G26AXFzCG.uPqjW2'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'German', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'Backpfeifengesicht',  'A slappable face', 2),
  (2, 1, 'Lebensmude',          'Tired of life', 3),
  (3, 1, 'Gluhbirne',           'Glow pear', 4),
  (4, 1, 'Sitzpinkler',         'Wimp', 5),
  (5, 1, 'Fingerspitzengefuhl', 'Intinct', 6),
  (6, 1, 'Kummerspeck',         'Excess fat gained from emotional eating', 7),
  (7, 1, 'Schnapsidee',          'Crazy idea', 8),
  (8, 1, 'Fremdschamen ',       'Embarrassed by someone' , 9),
  (9, 1, 'Handschuschenschneeballwerfer', 'Coward', 10),
  (10, 1, 'Treppenwitz', 'Brain fart', 11),
  (11, 1, 'Verschlimmbessern', 'Make things worse',12),
  (12, 1, 'Luftschloss', 'Need reality check',13),
  (13, 1, 'Fruhjahrsmudigkeit', 'Fatigue during springtime',14),
  (14, 1, 'Kuddelmuddel', 'A mess',15),
  (15, 1, 'Erklarungsnot', 'Emergency excuse',16),
  (16, 1, 'Geborgenheit', 'Peace and comfort in life',null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;

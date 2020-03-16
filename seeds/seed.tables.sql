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
  (2, 1, 'Gluhbirne',           'Glow pear', 3),
  (3, 1, 'Sitzpinkler',         'Seat wee-er', 4),
  (4, 1, 'Fingerspitzengefühl', 'Fingertip feeling', 5),
  (5, 1, 'Kummerspeck',         'Grief Bacon', 6),
  (6, 1, 'Schnapsidee',          'Schnapps Idea', 7),
  (7, 1, 'Fremdschämen ',       'Exterior shame' , 8),
  (8, 1, 'Handschuschenschneeballwerfer', 'Hand shoe snowball thrower',null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;

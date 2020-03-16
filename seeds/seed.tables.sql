BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Nghi-Will',
    -- password = "pass"
    'SuperTeam'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'German', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'Backpfeifengesicht', 'A slappable face, a face that needs to be slapped', 2),
  (2, 1, 'Lebensmüde', 'Life tired, Weary of life', 3),
  (3, 1, 'Sitzpinkler', 'Seat wee-er, A man who sits to pee', 4),
  (4, 1, 'Fingerspitzengefühl', 'Fingertip feeling, or sensitivity to others feelings, empathy', 5),
  (5, 1, 'Kummerspeck', 'Grief Bacon, excess weight gained from overeating while grief stricken', 6),
  (6, 1, 'Schnapsidee', 'Schnapps Idea, An idea that lacks a sober foundation, a bad idea', 7),
  (7, 1, 'Fremdschämen ', 'Exterior shame, the shame you feel in response to anothers humiliation', 8),
  (8, 1, 'Handschuschenschneeballwerfer', 'Hand shoe snowball thrower, Someone who will only throw a snowball while wearing gloves, a coward.', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;

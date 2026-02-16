/*
  # Reassign Notably Team Articles To Jorgen Helmers-Olsen

  1. Goal
    - Find the correct admin user row for "Jørgen Helmers-Olsen"
    - Update existing articles authored as "Notably Team" to that admin user

  2. Safety
    - Raises exception if zero or multiple matching admin users are found
*/

DO $$
DECLARE
  v_admin_id uuid;
  v_profile_picture_url text;
  v_admin_full_name text;
  v_admin_email text;
  v_match_count integer;
  v_admin_summary text;
  v_affected integer;
BEGIN
  -- 1) Preferred match: exact full name
  SELECT COUNT(*)
  INTO v_match_count
  FROM admin_users
  WHERE full_name = 'Jørgen Helmers-Olsen';

  IF v_match_count > 1 THEN
    RAISE EXCEPTION 'Multiple admin users found with full_name = %', 'Jørgen Helmers-Olsen';
  END IF;

  IF v_match_count = 1 THEN
    SELECT id, profile_picture_url, full_name, email
    INTO v_admin_id, v_profile_picture_url, v_admin_full_name, v_admin_email
    FROM admin_users
    WHERE full_name = 'Jørgen Helmers-Olsen'
    LIMIT 1;
  END IF;

  -- 2) Fallback: exact known work email
  IF v_admin_id IS NULL THEN
    SELECT COUNT(*)
    INTO v_match_count
    FROM admin_users
    WHERE lower(email) = 'jorgen@notably.no';

    IF v_match_count > 1 THEN
      RAISE EXCEPTION 'Multiple admin users found with email = %', 'jorgen@notably.no';
    ELSIF v_match_count = 1 THEN
      SELECT id, profile_picture_url, full_name, email
      INTO v_admin_id, v_profile_picture_url, v_admin_full_name, v_admin_email
      FROM admin_users
      WHERE lower(email) = 'jorgen@notably.no'
      LIMIT 1;
    END IF;
  END IF;

  -- 3) Last fallback: any admin email containing "jorgen" (must be unique)
  IF v_admin_id IS NULL THEN
    SELECT COUNT(*)
    INTO v_match_count
    FROM admin_users
    WHERE lower(email) LIKE '%jorgen%';

    IF v_match_count > 1 THEN
      RAISE EXCEPTION 'Multiple admin users matched email LIKE %%jorgen%%';
    ELSIF v_match_count = 1 THEN
      SELECT id, profile_picture_url, full_name, email
      INTO v_admin_id, v_profile_picture_url, v_admin_full_name, v_admin_email
      FROM admin_users
      WHERE lower(email) LIKE '%jorgen%'
      LIMIT 1;
    END IF;
  END IF;

  IF v_admin_id IS NULL THEN
    SELECT string_agg(format('[id=%s email=%s full_name=%s]', id, email, coalesce(full_name, 'NULL')), '; ')
    INTO v_admin_summary
    FROM admin_users;

    RAISE EXCEPTION 'Could not uniquely find Jorgen admin user. Existing admin_users: %', coalesce(v_admin_summary, 'none');
  END IF;

  RAISE NOTICE 'Matched admin user: id=%, email=%, full_name=%',
    v_admin_id, v_admin_email, coalesce(v_admin_full_name, 'NULL');

  UPDATE articles
  SET
    author_id = v_admin_id,
    author_name = COALESCE(NULLIF(v_admin_full_name, ''), 'Jørgen Helmers-Olsen'),
    author_profile_picture_url = v_profile_picture_url,
    updated_at = now()
  WHERE lower(coalesce(author_name, '')) = lower('Notably Team');

  GET DIAGNOSTICS v_affected = ROW_COUNT;

  RAISE NOTICE 'Reassigned % article(s) to admin id %', v_affected, v_admin_id;
END $$;

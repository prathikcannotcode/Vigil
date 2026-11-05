UPDATE members
SET full_name = 'Member ' || id,
    email = 'member-' || id || '@example.test',
    phone = NULL,
    nominee = NULL;

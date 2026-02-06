#! /usr/bin/env bash

set -e
set -x

# Let the DB start
python app/backend_pre_start.py
# RAILWAY_FIX: Handle fresh database where alembic_version exists but tables don't
python -c "
from sqlmodel import Session, text
from app.core.db import engine

with Session(engine) as session:
    result = session.exec(text(\"\"\"
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'user'
        );
    \"\"\")).first()

    if not result or not result[0]:
        alembic_check = session.exec(text(\"\"\"
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'alembic_version'
            );
        \"\"\")).first()

        if alembic_check and alembic_check[0]:
            print('PRESTART: Tables missing but alembic_version exists. Resetting...')
            session.exec(text('DROP TABLE IF EXISTS alembic_version'))
            session.commit()
"



# Run migrations
alembic upgrade head

# Create initial data in DB
python app/initial_data.py

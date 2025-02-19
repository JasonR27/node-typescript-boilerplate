#!/bin/bash

# Check if prisma is installed
# if ! command -v prisma &> /dev/null; then
#     echo "Prisma not found, installing..."
#     npm install prisma @prisma/client
# fi

# Run migrations and migrate the database
# echo "Making migrations and migrating the database..."
# npx prisma generate && npx prisma migrate dev --name "api_reset_migration"

# if [ $? -ne 0 ]; then 
#     echo "Makemigrations failed or client generation failed." 
#     exit 1
# else
#     echo "Successfully migrated the database and create prisma client"
# fi

# echo "Seeding..."
# npx prisma db seed

# if [ $? -ne 0 ]; then 
#     echo "Seeding failed."
#     echo "(Most possible thing here,"
#     echo "is that the seeding was already ran once, and it's failing  due to a unique constrain rule on a field)"
#     echo "if so, you can comment this seeding part of the entrypoint script to continue restarting the api service"
#     echo "without any problem"
#     exit 1
# else
#     echo "Seeding Successfully"
# fi

# Start the server
exec "$@"
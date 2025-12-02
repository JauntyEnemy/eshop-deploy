Backend setup notes
===================

Problem
-------
The app failed to start with PDOException: Unknown database 'zahrat_alrabie'. This means MySQL does not have the database defined in `config/database.php`.

Quick fix
---------
1. Ensure MySQL server is running locally.
2. From project root open a Windows cmd and run:

   php backend\scripts\setup_db.php

This script reads `backend/config/database.php` for credentials and imports `backend/database/schema.sql` to create the `zahrat_alrabie` database and tables.

Manual alternative (if you have the MySQL client):

1. Start MySQL server.
2. Run from cmd (replace with your mysql path if needed):

   mysql -u root < backend\database\schema.sql

Notes
-----
- The script uses the same PDO options as the project config. If your MySQL user requires a password, update `backend/config/database.php` accordingly before running.
- If PHP is not on your PATH, use the absolute path to `php.exe` when running the script.

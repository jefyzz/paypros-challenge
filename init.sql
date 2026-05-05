-- Grant all privileges to the taskmanager_user (for Prisma shadow database support)
GRANT ALL PRIVILEGES ON *.* TO 'taskmanager_user'@'%';
FLUSH PRIVILEGES;

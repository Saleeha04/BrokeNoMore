CREATE DATABASE expense_tracker;
USE expense_tracker

CREATE LOGIN brokedev WITH PASSWORD = 'brokenomore123';
CREATE USER brokedev FOR LOGIN brokedev;
ALTER ROLE db_owner ADD MEMBER brokedev;

SELECT SERVERPROPERTY('productversion'), SERVERPROPERTY ('productlevel'), SERVERPROPERTY ('edition')
SELECT @@VERSION

SELECT name FROM sys.sql_logins;

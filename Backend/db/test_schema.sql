-- Test script to check database schema
USE expense_tracker;

-- Check all columns in Users table
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Users'
ORDER BY ORDINAL_POSITION;

-- Check if ProfilePicture column exists specifically
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'ProfilePicture'
        ) 
        THEN 'ProfilePicture column EXISTS' 
        ELSE 'ProfilePicture column DOES NOT EXIST' 
    END AS ProfilePictureStatus;

-- Show table structure
EXEC sp_help 'Users'; 
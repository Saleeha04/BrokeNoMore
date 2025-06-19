-- Add ProfilePicture column to Users table if it doesn't exist
USE expense_tracker;

-- Check if ProfilePicture column exists, if not add it
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'ProfilePicture'
)
BEGIN
    ALTER TABLE Users ADD ProfilePicture NVARCHAR(MAX);
    PRINT 'ProfilePicture column added successfully to Users table';
END
ELSE
BEGIN
    PRINT 'ProfilePicture column already exists in Users table';
END

-- Verify the column was added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'ProfilePicture'; 
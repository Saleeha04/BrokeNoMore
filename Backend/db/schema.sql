use expense_tracker;
CREATE DATABASE expense_tracker;
GO
USE master;  -- Ensure you're in the master database
CREATE LOGIN brokedev WITH PASSWORD = 'YourStrong!Pass123';
USE expense_tracker;
CREATE USER brokedev FOR LOGIN brokedev;
ALTER ROLE db_owner ADD MEMBER brokedev;

CREATE TABLE Users(
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    ProfilePicture NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Income (
    IncomeID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Amount DECIMAL(10,2) NOT NULL,
    MonthI DATE NOT NULL,
    CONSTRAINT UC_IncomeUserMonth UNIQUE(UserID, MonthI)
);

CREATE TABLE Expenses (
    ExpenseID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title VARCHAR(200) NOT NULL, 
    Amount DECIMAL(10,2) NOT NULL,
    Date DATETIME NOT NULL,
    IsRecurring BIT DEFAULT 0,
    Category VARCHAR(50)
);

CREATE TABLE RecurringExpenses (
    RecurringID INT PRIMARY KEY IDENTITY(1,1),
    ExpenseID INT FOREIGN KEY REFERENCES Expenses(ExpenseID),
    NextDueDate DATE NOT NULL,
    Frequency VARCHAR(20) DEFAULT 'Monthly'
);

CREATE TABLE BudgetGoals (
    GoalID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Month DATE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    EditCount INT DEFAULT 0,
    CONSTRAINT UC_UserMonth UNIQUE(UserID, Month)
);

CREATE TABLE FinancialSummaries (
    SummaryID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Month DATE NOT NULL,
    TotalIncome DECIMAL(10,2) NOT NULL,
    TotalExpense DECIMAL(10,2) NOT NULL,
    NetSavings AS (TotalIncome - TotalExpense),
    CONSTRAINT UC_SummaryUserMonth UNIQUE(UserID, Month)
);

CREATE TABLE Alerts ( 
    AlertID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Message TEXT NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAT DATETIME DEFAULT GETDATE()
);

-- Dummy Data to see if the tables are working or not
-- 🚀 Insert test user
INSERT INTO Users (Username, Email, PasswordHash)
VALUES ('testuser', 'test@example.com', 'hashedpassword123');

-- 💸 Insert test income for current month
INSERT INTO Income (UserID, Amount, MonthI)
VALUES (1, 80000, '2025-05-01');

-- 🧾 Insert one-time expense
INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
VALUES (1, 'Groceries', 6000, '2025-05-05', 0, 'Food');

-- 🔁 Insert recurring expense
INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
VALUES (1, 'Rent', 25000, '2025-05-01', 1, 'Housing');

-- 🔁 Add recurring logic entry for above expense (assuming ExpenseID = 2)
INSERT INTO RecurringExpenses (ExpenseID, NextDueDate, Frequency)
VALUES (2, '2025-06-01', 'Monthly');

-- 🎯 Insert budget goal
INSERT INTO BudgetGoals (UserID, Month, Amount)
VALUES (1, '2025-05-01', 50000);

-- ⚠️ Insert alert
INSERT INTO Alerts (UserID, Message)
VALUES (1, 'You have spent more than 80% of your budget!');



-- ALTER TABLE QUERIES:
ALTER TABLE Users
ADD SecurityQuestion NVARCHAR(255),
    SecurityAnswer NVARCHAR(255);

ALTER TABLE Users
DROP CONSTRAINT UQ__Users__A9D10534EA3C593D; -- the constraint may change depending on your database entries, so edit krlena
ALTER TABLE Users DROP COLUMN Email;

-- Add ProfilePicture column if it doesn't exist
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'ProfilePicture'
)
BEGIN
    ALTER TABLE Users ADD ProfilePicture NVARCHAR(MAX);
END

-- DISPLAY:
SELECT * FROM Users;
SELECT * FROM Income;
SELECT * FROM Expenses;
SELECT * FROM RecurringExpenses;
SELECT * FROM BudgetGoals;
-- SELECT * FROM Alerts;

-- Kaori04 = saleeha04 = Mao

-- DELETE:
DELETE FROM Users WHERE UserID = 1;
DELETE FROM Income WHERE UserID = 1;
DELETE FROM Expenses WHERE UserID = 1;
DELETE FROM RecurringExpenses WHERE ExpenseID = 2;
DELETE FROM BudgetGoals WHERE UserID = 1;
DELETE FROM Alerts WHERE UserID = 1;
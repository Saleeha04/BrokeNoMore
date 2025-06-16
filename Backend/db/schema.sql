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
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Income (
    IncomeID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Amount DECIMAL(10,2) NOT NULL,
    MonthI DATE NOT NULL
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

ALTER TABLE Users
ADD SecurityQuestion NVARCHAR(255),
    SecurityAnswer NVARCHAR(255);


-- Dummy Data to see if the tables are working or not
INSERT INTO Users (Username, Email, PasswordHash)
VALUES ('testuser', 'test@example.com', 'hashedpassword123'),
('testuser2', 'test2@example.com', 'hashedpassword1234');

INSERT INTO Income (UserID, Amount, MonthI)
VALUES (1, 80000, '2025-05-01');

INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
VALUES (1, 'Groceries', 6000, '2025-05-05', 0, 'Food');

INSERT INTO Expenses (UserID, Title, Amount, Date, IsRecurring, Category)
VALUES (1, 'Rent', 25000, '2025-05-01', 1, 'Housing');

INSERT INTO RecurringExpenses (ExpenseID, NextDueDate, Frequency)
VALUES (2, '2025-06-01', 'Monthly');

INSERT INTO BudgetGoals (UserID, Month, Amount)
VALUES (1, '2025-05-01', 50000);

INSERT INTO Alerts (UserID, Message)
VALUES (1, 'You have spent more than 80% of your budget!');

DBCC CHECKIDENT ('Users', RESEED, 0);
SELECT * FROM Users;
SELECT * FROM Income;
SELECT * FROM Expenses;
SELECT * FROM BudgetGoals;
SELECT * FROM Alerts;

/*DELETE FROM Income WHERE UserID = 1;
DELETE FROM Users WHERE UserID = 1;
DELETE FROM RecurringExpenses WHERE ExpenseID = 2;
DELETE FROM BudgetGoals WHERE UserID = 1;
DELETE FROM  Alerts WHERE UserID = 1;
DELETE FROM Expenses WHERE UserID = 1;

-- i have deleted all the previous records cuz password hashing use kar ke tables match nai ho rage
-- thay u guys can do it too then masla nai hoga while testing routes


Drop TABLE Book;

CREATE TABLE Book (
    bookName VARCHAR(500) NOT NULL,
    edition VARCHAR(50),
    language CHAR(50),
    year INT,
    bookid VARCHAR(30) PRIMARY KEY ,
    rating DECIMAL(3,1),
    genre VARCHAR(50),
	author VARCHAR (50),
	quantity INT
);

INSERT INTO Book(bookName, edition, language, year, bookid, rating, genre,author,quantity)
VALUES
    ('The Hobbit', 'First Edition', 'English', 1937, '9780007497904', 4.2, 'Fantasy', 'J.R.R.Tolkien',10),
    ('Harry Potter and the Philosopher''s Stone', 'First Edition', 'English', 1997, '9780747532699', 4.5, 'Fantasy','J.K. Rowling',15),
    ('Alice in Wonderland', 'Revised Edition', 'English', 1865, '9781503290283', 4.1, 'Fantasy','Lewis Carroll',18),
    ('The Chronicles of Narnia', 'Complete Collection', 'English', 1950, '9780064404990', 4.6, 'Fantasy','Author: C.S. Lewis',10),
    ('Pride and Prejudice', 'Revised Edition', 'English', 1813, '9780141439518', 4.7, 'Classic','Jane Austen',15),
    ('To Kill a Mockingbird', 'First Edition', 'English', 1960, '9780062420701', 4.5, 'Fiction','Harper Lee',16),
    ('The Great Gatsby', 'First Edition', 'English', 1925, '9780743273565', 4.2, 'Classic','F. Scott Fitzgerald',18),
    ('1984', 'Revised Edition', 'English', 1949, '9780451524935', 4.3, 'Dystopian','George Orwell',20),
    ('The Catcher in the Rye', 'First Edition', 'English', 1951, '9780316769488', 4.0, 'Fiction','J.D. Salinger',20),
    ('Moby-Dick', 'Revised Edition', 'English', 1851, '9781503280789', 4.4, 'Adventure',' Herman Melville',20);

DROP TABLE PERSON ;

CREATE TABLE Person 
(personid INT PRIMARY KEY,
 Personname CHAR(50) NOT NULL,
 email CHAR(200),
 contactno BIGINT );


INSERT INTO Person (personid, Personname, email, contactno)
VALUES
    (1, 'John Doe', 'johndoe@example.com', 1234567890),
    (2, 'Jane Smith', 'janesmith@example.com', 9876543210),
    (3, 'Michael Johnson', 'michaeljohnson@example.com', 5551234567),
    (4, 'Emily Davis', 'emilydavis@example.com', 9998887777),
    (5, 'David Wilson', 'davidwilson@example.com', 1112223333),
    (6, 'Sarah Brown', 'sarahbrown@example.com', 4445556666),
    (7, 'Christopher Lee', 'christopherlee@example.com', 7778889999),
    (8, 'Olivia Taylor', 'oliviataylor@example.com', 2223334444),
    (9, 'Daniel Anderson', 'danielanderson@example.com', 6667778888),
    (10, 'Sophia Martinez', 'sophiamartinez@example.com', 8889990000);

Drop table action ;
CREATE TABLE Action
(transactionid INT PRIMARY KEY IDENTITY(1,1), 
 bookid VARCHAR(30) CHECK (dbo.UserExists(bookid) = 1),
 personid INT  CHECK (dbo.UserExists(personid) = 1), 
 borrowdate DATE, 
 duedate DATE, 
 returndate DATE,
 FOREIGN KEY (Bookid) REFERENCES Book(Bookid) ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (personid) REFERENCES Person(personid) ON DELETE CASCADE ON UPDATE CASCADE) ;


CREATE FUNCTION BookExists(@bookID INT)
RETURNS BIT
AS
BEGIN
    DECLARE @exists BIT;
    
    -- Check if the user ID exists in the Users table
    IF EXISTS (SELECT quantity FROM Book WHERE bookid = @bookID and quantity > 0 )
        SET @exists = 1;
    ELSE
        SET @exists = 0;
    
    RETURN @exists;
END;
GO



CREATE FUNCTION UserExists(@userID INT)
RETURNS BIT
AS
BEGIN
    DECLARE @exists BIT;
    
    -- Check if the user ID exists in the Users table
    IF EXISTS (SELECT 1 FROM Person WHERE personid = @userID)
        SET @exists = 1;
    ELSE
        SET @exists = 0;
    
    RETURN @exists;
END;
GO






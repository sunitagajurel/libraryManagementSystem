
CREATE DATABASE Library;
USE Library;

/*Creating table to store book details */
CREATE TABLE Book (
    bookid INT PRIMARY KEY,
    bookName VARCHAR(500) NOT NULL,
    edition VARCHAR(50),
    language CHAR(50),
    year INT,
    isbn VARCHAR(20),
    rating DECIMAL(3,1),
    genre VARCHAR(50),
    author VARCHAR(50),
	quantity INT
);

/*Inserting Records*/
INSERT INTO Book(bookid, bookName, edition, language, year, isbn, rating, genre,author,quantity)
VALUES
    (1, 'The Hobbit', 'First Edition', 'English', 1937, '9780007497904', 4.2, 'Fantasy', 'J.R.R.Tolkien',10),
    (2, 'Harry Potter and the Philosopher''s Stone', 'First Edition', 'English', 1997, '9780747532699', 4.5, 'Fantasy','J.K. Rowling',15),
    (3, 'Alice in Wonderland', 'Revised Edition', 'English', 1865, '9781503290283', 4.1, 'Fantasy','Lewis Carroll',18),
    (4, 'The Chronicles of Narnia', 'Complete Collection', 'English', 1950, '9780064404990', 4.6, 'Fantasy','Author: C.S. Lewis',10),
    (5, 'Pride and Prejudice', 'Revised Edition', 'English', 1813, '9780141439518', 4.7, 'Classic','Jane Austen',15),
    (6, 'To Kill a Mockingbird', 'First Edition', 'English', 1960, '9780062420701', 4.5, 'Fiction','Harper Lee',16),
    (7, 'The Great Gatsby', 'First Edition', 'English', 1925, '9780743273565', 4.2, 'Classic','F. Scott Fitzgerald',18),
    (8, '1984', 'Revised Edition', 'English', 1949, '9780451524935', 4.3, 'Dystopian','George Orwell',20),
    (9, 'The Catcher in the Rye', 'First Edition', 'English', 1951, '9780316769488', 4.0, 'Fiction','J.D. Salinger',20),
    (10, 'Moby-Dick', 'Revised Edition', 'English', 1851, '9781503280789', 4.4, 'Adventure',' Herman Melville',20);


/*Creating table to store person details */
CREATE TABLE Person 
(personid INT PRIMARY KEY,
 Personname CHAR(50) NOT NULL,
 email CHAR(200),
 contactno BIGINT );

/*Inserting Records*/
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

/*Creating table to store the transaction details */
 CREATE TABLE Action
(transactionid INT PRIMARY KEY IDENTITY(1,1), 
 Bookid INT,
 personid INT, 
 borrowdate DATE, 
 duedate DATE, 
 returndate DATE,
 FOREIGN KEY (Bookid) REFERENCES Book(Bookid),
 FOREIGN KEY (personid) REFERENCES Person(personid));


/*Inserting Records*/
INSERT INTO Action (bookid, personid, borrowdate, duedate, returndate)
VALUES
    (1,1, '2023-05-01', '2023-05-20', Null),
    (2,2, '2023-05-02', '2023-05-09', Null),
    (3,3, '2023-05-03', '2023-05-10', Null),
    (3, 4, '2023-05-04', '2023-05-11', Null),
    (5, 5, '2023-05-05', '2023-05-12', Null),
    (6, 6, '2023-05-06', '2023-05-13', Null),
    (7, 7, '2023-05-07', '2023-05-14', Null),
    (8,8, '2023-05-08', '2023-05-15', Null),
    (9,9, '2023-05-09', '2023-05-16', Null),
    (10,10, '2023-05-10', '2023-05-17', Null);


CREATE TRIGGER UpdateDueDateTrigger
ON Action
AFTER INSERT
AS
BEGIN
    UPDATE Action
    SET duedate = DATEADD(day, 30, GETDATE())
    FROM Action
    INNER JOIN inserted ON Action.transactionid = inserted.transactionid;
END;

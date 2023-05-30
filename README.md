# libraryManagementSystem

install nodejs 

`git clone git@github.com:sunitagajurel/libraryManagementSystem.git`

cd libraryManagementSystem 

`npm install` 

Create Database in MicroSoft Azure : https://docs.microsoft.com/en-us/learn/modules/provision-azure-sql-db/Links to an external site.

Run all the queries given in the queries.sql file 

create .env file with following contents in the root folder, give all the details from your azure sql database : 

`DB_USER = <DBUSERNAME>
PASSWORD = <PASSWORD> 
DATABASE = <DATABASENAME>  
SERVER = <SERVERNAME>
PORT = 1433 `


run `node app.js`  


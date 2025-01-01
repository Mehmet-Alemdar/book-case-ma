# API Workflow and Recommended Usage Order

This API operates within a system that supports multiple admins, bookstores, and managers. Each admin can manage their own bookstore and managers, but they cannot interfere with the bookstores or managers created by other admins. The following is a step-by-step guide to the API’s workflow and the order in which actions should be performed:

## 1. Create an Admin
The first step is to create an admin. In order to perform other actions and manage the system, you need to have an admin user.

- **Admin creation** can only be performed by an **admin user**.

## 2. Create Managers and Bookstores
Once an admin is created, managers (store managers) and bookstores can be created. An admin can create multiple bookstores, and for each bookstore, they can assign different managers.

- **Bookstores must be created first** before creating any books. This means that you need a bookstore to add books to it.
- Managers can be created, but they will only have permissions over the bookstores they are assigned to. Each manager can only manage the bookstore they are assigned to.

## 3. Assign a Manager to a Bookstore
For a manager to perform actions on a bookstore, they must be assigned to it.

- **Manager assignment** can only be done by an **admin**.
- A manager can only perform actions in the bookstore they are assigned to.

## 4. Create Books
Once a bookstore is created, you can proceed to create books for that bookstore.

- **Books can only be created** after at least one bookstore has been created.

## 5. Update Book Quantity
A manager can update the quantity of books, but only for the bookstore they are assigned to.

- A **manager can only update the quantity of books** in the bookstore they are assigned to.
- **Admin users** can update the book quantities for all bookstores.

---

## Roles and Permissions:
- **Admins**: There can be multiple admins in the system. Each admin can manage their own bookstores and managers. Admins can perform any action, such as creating bookstores, managers, and updating book quantities.
- **Managers**: Managers can only perform actions in the bookstores they are assigned to. Managers can update book quantities but only in their assigned bookstore.

---

## Usage Order:
1. **Create an Admin** (first step).
2. The admin can create **managers** and **bookstores**.
3. A **bookstore must be created** before adding any books.
4. If a manager is to update the **book quantity**, they must first be assigned to the relevant bookstore.
5. **Managers can only manage their assigned bookstore**.


## Project setup
## .env File Configuration

Before running the project, make sure to create a `.env` file in the root directory of your project with the following content:

```env
# Database Configuration
DB_USER_NAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Secret Key for Authentication
JWT_SECRET_KEY=your_secret_key
```

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
# Usage
## User operations 🙍
### Admin Create
> ```http
> POST http://localhost:3000/user/admin
> ````
> Sample Request
>```json
>{
>    "username": "admin1",
>    "email": "admin1@mail.com",
>    "password": "Password1!"
>}
>```
> Returning Answer
>```json
>{
>    "message": "Admin created successfully"
>}
>```
### Login
> ```http
> POST http://localhost:3000/user/login
> ````
> Sample Request
>```json
>{
>    "email": "admin1@mail.com",
>    "password": "Password1!"
>}
>```
> Returning Answer
>```json
>{
>    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksInJvbGUiOiJzdG9yZV9tYW5hZ2VyIiwiaWF0IjoxNzM1NzUyNjE5LCJleHAiOjE3MzU3NTYyMTl9.Z0aDCm6gwQCUhZ916cmrRVCrZXZHNv0MRR511k8OpAo"
>}
>```
### Store Manager Create
>🚨 Only **admins** can perform this action!
>
>⚠️ Be sure to add the token information returned from the API to the headers.
> ```bash
> authorization: token returned from api
> ```
> ```http
> POST http://localhost:3000/user/create
> ````
> Sample Request
>```json
>{
>    "username": "manager1",
>    "email": "manager1@mail.com",
>    "password": "Password1!"
>}
>```
> Returning Answer
>```json
>{
>    "message": "User created successfully"
>}
>```
### Book Store Create
>🚨 Only **admins** can perform this action!
>
>⚠️ Be sure to add the token information returned from the API to the headers.
> ```bash
> authorization: token returned from api
> ```
> ```http
> POST http://localhost:3000/book-store/create
> ````
> Sample Request
>```json
>{
>    "name": "House Book Store",
>    "address": "Izmir, Turkey"
>}
>```
> Returning Answer
>```json
>{
>    "message": "Book store created successfully"
>}
>```
### Book Create
>🚨 Only **admins** can perform this action!
>
>⚠️ Be sure to add the token information returned from the API to the headers.
> ```bash
> authorization: token returned from api
> ```
> ```http
> POST http://localhost:3000/book/create
> ````
> Sample Request
>```json
>{
>    "name": "Green Book",
>    "price": 34,
>    "bookStoreId": {book_store_db_id},
>    "quantity": 42
>}
>```
> Returning Answer
>```json
>{
>    "message": "Book created successfully",
>    "data": {
>        "name": "Green Book",
>        "price": 34,
>        "quantity": 42,
>        "bookStore": {
>            "id": 13,
>            "name": "House Book Store",
>            "address": "Izmir, Turkey"
>        },
>        "id": 24
>    }
>}
>```
### Assign a Manager to the Store
>🚨 Only **admins** can perform this action!
>
>⚠️ Be sure to add the token information returned from the API to the headers.
> ```bash
> authorization: token returned from api
> ```
> ```http
> POST http://localhost:3000/user/assign-manager-to-store
> ````
> Sample Request
>```json
>{
>    "userId": {manager_db_id},
>    "bookStoreId": {book_store_db_id}
>}
>```
> Returning Answer
>```json
>{
>    "message": "Manager assigned to store successfully"
>}
>```
### Update Book Quantity
> 🚨 Only **admins** or **managers** who have been authorized by their respective admin for the bookstore can perform this action!
>
>⚠️ Be sure to add the token information returned from the API to the headers.
> ```bash
> authorization: token returned from api
> ```
> ```http
> PUT http://localhost:3000/book/update-quantity
> ````
> Sample Request
>```json
>{
>    "bookId": {book_db_id},
>    "bookStoreId": {book_store_db_id},
>    "quantity": 35
>}
>```
> Returning Answer
>```json
>{
>    "message": "Book quantity updated successfully",
>}
>```
### Get All Bookstores
> 🔄 **limit** and **page** queries are optional.
> ```http
> GET http://localhost:3000/book-store?page=1&limit=1
> ````
> Returning Answer
>```json
>{
>    "data": [
>        {
>            "id": 11,
>            "name": "Admin1 Book Store",
>            "address": "Izmir, Turkey"
>        },
>        {
>            "id": 12,
>            "name": "Admin1 Second Book Store",
>            "address": "Ankara, Turkey"
>        },
>        {
>            "id": 13,
>            "name": "Admin2 Book Store",
>            "address": "Adana, Turkey"
>        }
>    ],
>    "total": 3,
>    "currentPage": 1,
>    "limit": 1
>}
>```
### Get Books by Bookstore ID
> ⚠️ The **bookStoreId** query parameter is required.
> 
> 🔄 **limit** and **page** queries are optional.
> ```http
> GET http://localhost:3000/book/list?bookStoreId=13&limit=1&page=1
> ````
> Returning Answer
>```json
>{
>    "data": [
>        {
>            "id": 22,
>            "name": "Green Book",
>            "price": 34,
>            "quantity": 35,
>            "bookStore": {
>                "id": 13,
>                "name": "Admin2 Book Store",
>                "address": "Adana, Turkey"
>            }
>        }
>    ],
>    "total": 3,
>    "currentPage": "1",
>    "limit": "1"
>}
>```
### Search for a Book by Name
> ⚠️ The **search** query parameter is required.
> 
> 🔄 **limit** and **page** queries are optional.
> ```http
> GET http://localhost:3000/book/search?search=Green&limit=1&page=1
> ````
> Returning Answer
>```json
>{
>    "data": [
>        {
>            "id": 22,
>            "name": "Green Book",
>            "price": 34,
>            "quantity": 35,
>            "bookStore": {
>                "id": 13,
>                "name": "Admin2 Book Store",
>                "address": "Adana, Turkey"
>            }
>        }
>    ],
>    "total": 3,
>    "currentPage": "1",
>    "limit": "1"
>}
>```
## Technology Stack:
- **Nest.js**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**


# TaniMine API

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/) [![Nodejs](https://img.shields.io/badge/NodeJs-18-green.svg)](https://NodeJs.com/) [![Typescript](https://img.shields.io/badge/Typescript-lastest-green.svg)](https://www.typescriptlang.org/) [![Postgresql](https://img.shields.io/badge/Postgresql-lastest-green.svg)](https://www.postgresql.org/) 

## About
TaniMine is a multiplatform app to help farmers in every stage of their farming activities. The Agricultural ProcessWith features built based on their problems from is divided into three stages.pre-farming to post-farming.

## Team
Adinda Regita Afifah Cahyani - Hustler <br>
Reymunda Dwi Alfathur - Hipster <br>
Fajar Buana Hidayat - Hacker <br>
Dinar Nur Aziz  - Hacker

## How to Install and Run the Project
To install and run the TaniMine project locally, please follow these steps:

 1.Clone the repository from GitHub:    
```bash
https://github.com/tanimine/tanimine_backend 
```

Navigate to the project directory:
```bash
  cd tanimine_backend
```

Install the project dependencies using a package manager such as npm or yarn:
```bash
  npm install
```
or
```bash
  yarn install
```
Copy example environment file to new file
```bash
  cp .env.example .env
```

Run Migration and seeder.
```bash
    npm run prisma:migrate
    npm run prisma:generate
```

Run the development server.
```bash
  npm run dev
```

## Usage
Access the website locally at http://localhost:5000.

## License

This project is licensed under the MIT License.


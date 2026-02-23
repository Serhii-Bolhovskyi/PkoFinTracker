# PkoFinTracker
## Status: MVP(v1.0) Completed ✔️
[Live Demo](https://pko-fin-tracker.vercel.app) | [API Docs (Swagger)](https://pkofintracker-production.up.railway.app/swagger)

## Overview
PkoFinTracker is a Personal Finance Management application designed to track income and expenses.
It integrates directly with bank servers via the PSD2 Open Banking standard

##  Regulatory Note
> Due to regulatory requirements (PSD2), access to real Polish bank data requires a licensed certificate. This MVP demonstrates the integration pattern using simulated data that mirrors the EnableBanking API response structure.

## Motivation
> As a PKO Bank Polski customer, I found it frustrating that the bank lacks built-in expense and income analytics. Tracking this data manually is time-consuming and error-prone — so I built a tool that automates it. 

## Screenshots
![Dashboard page](docs/Screenshot%202026-02-22%20at%2020.15.12.png) 
![Transaction page](docs/Screenshot%202026-02-22%20at%2020.15.22.png)
![Transaction page(Filters)](docs/Screenshot%202026-02-22%20at%2020.15.37.png)

## Key Features
+ ### **Integration with [Enable Banking API](https://enablebanking.com/)**
  + **Authentication:** Generating a private RSA key and a self-signed certificate, constructing JWT
  + **Authorization:** Sending JWT via Authorization header, handling user authorization and session management
  + **Data fetching:** Retrieve accounts details, balances and transactions history
+ ### **Data Synchronization**
  + **Accounts:** Fetching and storing account details and balances
  + **Transactions:** Fetching and storing transactions, with duplicate prevention logic
+ ### **REST API for Client**
  + **Transactions:** GET endpoint with filtering by date range, description, amount, category, status and indicator; support pagination
  + **Accounts:** GET endpoint returning account details and current balance
  + **Categories:** GET endpoint returning available transaction categories
+ ### **Frontend Integration**
  + **Context API:** Global state management
  + **Dashboard:** 
    + Balance overview with current account details
    + Cashflow Bar Chart — monthly Income vs Expenses comparison
    + StatCards — current month income/expense compared to previous month
  + **Transaction:**
    + Filtering: Multi-criteria search by date range, category, amount, transaction type
    + Category Pie Chart — top 5 spending categories based on active filters
    + StatCards — income/expense/qty summary based on active filters
    
## Tech Stack
  + **Backend:** .NET 8 (ASP.NET Core), Entity Framework Core, PostgreSQL, LINQ, Swagger
  + **Frontend:** React, TypeScript, Tailwind, Recharts
  + Deployment: Railway, Vercel

## Roadmap: What's Next?
⭐️ Version 2.0 (Planned)
- [ ] Finance Goals: Set monthly budgets and track progress
- [ ] Savings "Pots": Visualizing progress towards specific purchase goals.

## Quick Start
1. Clone the repository:
```bash
git clone https://github.com/yourusername/PkoFinTracker.git
```
2. Setup Database:<br/>
   Configure your PostgreSQL connection string in appsettings.json and apply migrations:
```bash
cd PkoFinTracker.Server
dotnet ef database update
```
3. Configure Banking API Keys:<br/>
   To enable bank synchronization, you need an application at [Enable Banking](https://enablebanking.com/): 
   + Place your private RSA key (`.pem` file) in the `PkoFinTracker.Server/` root directory
   + Add your credentials to `appsettings.json` or use **User Secrets** (recommended):
```bash
"EnableBanking": {
  "ApplicationId": "your-application-uuid",
  "KeyPath": "your-filename.pem"
}
```
4. Run Backend:
`dotnet run` <br/>
(Note: The application automatically seeds 50+ demo transactions on the first run if the database is empty.)
5. Run Frontend:
```bash
cd ../PkoFinTracker.Client
npm install
npm run dev
```
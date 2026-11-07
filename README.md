# AssetFlow — Asset Management System by XYZ

AssetFlow helps companies keep track of the assets their employees use every day — from returnable items like laptops, keyboards and chairs to non-returnable supplies like pens, paper and diaries. HR Managers stock assets, approve employee requests and manage their team in one place, while employees can request what they need and follow every request from their own dashboard.

## Live Site

- **Live Site URL:** https://assetflow-client-sigma.vercel.app
- **HR Manager Email (admin):** hr@xyz.com
- **HR Manager Password:** Asset@1234

## Features

- **Two roles, two experiences** — separate registration, navigation and home dashboards for Employees and HR Managers.
- **Company branding** — the navbar shows the logo of the company the user belongs to (the XYZ logo is shown until an employee joins a company).
- **HR registration with packages** — HR Managers choose a package (5 members for $5, 10 members for $8, 20 members for $15) and activate their account through a secure Stripe payment.
- **Asset inventory management** — HR Managers can add, update and delete assets, with server-side search, stock and type filters, and sorting by quantity.
- **Asset requests with approval workflow** — employees request an asset with an additional note; HR Managers approve or reject, and stock is adjusted automatically.
- **Returns and cancellations** — employees can cancel a pending request and return an approved returnable asset, which puts it back in stock.
- **Printable hand-over document** — approved requests can be printed as a PDF with the company information at the top and the printing date at the bottom.
- **Team management** — HR Managers can add employees one by one or select many and add them in a single action, and remove members when they leave.
- **Package limits that grow** — the Add an Employee page always shows the current team count against the package limit, and the limit can be increased at any time.
- **Personal dashboards** — employees see their pending and this-month requests; HR Managers see pending requests, most requested items, limited-stock items and a chart of returnable vs non-returnable requests.
- **Secure by design** — Firebase authentication with a JWT stored in local storage, protected private routes that survive a page reload, and all secrets kept in environment variables.
- **Fully responsive** — every page, table and dashboard works on mobile, tablet and desktop.

## Technologies

React, Vite, React Router, Tailwind CSS, DaisyUI, Firebase Authentication, TanStack Query, Axios, SweetAlert2, Recharts, Swiper, React PDF, React Helmet Async and Stripe — with a Node.js / Express / MongoDB server.

## Run locally

```bash
npm install
cp .env.example .env   # fill in your Firebase, API and Stripe keys
npm run dev
```

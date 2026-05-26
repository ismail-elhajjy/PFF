# AtlasAds - Billboard Reservation Platform

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000)

AtlasAds is a full-stack billboard reservation platform for outdoor advertising campaigns in Morocco. It allows clients to browse available billboard inventory, filter locations by city, zone, type, size, and price, submit reservation requests with creative assets, download reservation PDF receipts, and manage their booking history.

The application also includes an admin dashboard for managing billboards, reservation statuses, users, contact messages, dashboard statistics, notifications, and admin account preferences.

## Table of Contents

- [Core Features](#core-features)
- [Business Logic](#business-logic)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Testing and Quality](#testing-and-quality)

## Core Features

- Public landing page for AtlasAds with city highlights, testimonials, feature sections, and calls to action.
- Billboard catalog loaded from the backend API.
- Billboard filtering by Moroccan city, zone, billboard type, size, and price preference.
- Client registration, login, JWT token storage, protected profile, and protected reservation pages.
- Reservation workflow with date selection, phone/company details, creative file upload, total price calculation, and receipt PDF download.
- User profile with reservation history, totals, statuses, cancellation for pending reservations, and PDF export.
- Admin dashboard with revenue, billboard, reservation, user, panel type, city distribution, notification, and contact-message views.
- Admin billboard management with image upload, create, update, delete, and availability controls.
- Admin reservation moderation with pending, confirmed, cancelled, and rejected statuses.
- Admin user management with pagination, search, role updates, and delete protection for the current admin account.
- Admin settings for profile data, password changes, dashboard preferences, language, and timezone.
- Multilingual frontend support for English, French, and Arabic with RTL handling for Arabic.
- Email and database notifications when reservations are created.

## Business Logic

The main business flow is centered on billboard inventory and reservation requests:

1. Admins create billboard records with title, city, zone, type, size, monthly price, availability, and an image.
2. Clients browse public billboards and can only start a reservation after authentication.
3. Reservation dates must start today or later, and the end date must be after the start date.
4. Creative file rules depend on billboard type:
   - `Classic`: image files only (`jpg`, `jpeg`, `png`)
   - `LED`: video files only (`mp4`, `mov`, `avi`)
   - `Digital`: image or video files
5. The backend prevents overlapping reservations for the same billboard when an existing reservation is already `confirmed`.
6. Reservation total price is calculated from the billboard monthly price and selected day count:

   ```text
   total = (monthly_price * number_of_days) / 30
   final_total = rounded up to the next 100 MAD
   ```

7. New reservations are created as `pending`.
8. Users can cancel only their own `pending` reservations.
9. Admins can update reservation status to `pending`, `confirmed`, `cancelled`, or `rejected`.
10. Reservation PDFs are generated from a Blade template using DomPDF.
11. Deleted users are logged through a database trigger into the `user_logs` table.

## Technologies Used

### Frontend

- React 19
- Vite 7
- React Router DOM
- Axios
- i18next, react-i18next, and i18next-browser-languagedetector
- Lucide React icons
- React Select
- Recharts
- SweetAlert2
- ESLint
- npm with `package-lock.json`
- Plain CSS modules/files organized by page and component

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum package installed
- JWT authentication through `tymon/jwt-auth`
- Eloquent ORM
- Laravel Notifications with mail and database channels
- Barryvdh Laravel DomPDF for reservation PDF generation
- Laravel queues, cache, sessions, migrations, seeders, factories, and PHPUnit tests
- Vite, Laravel Vite Plugin, Tailwind CSS package, and npm scripts for Laravel frontend assets
- Composer
- Recommended database: MySQL or MariaDB, because dashboard queries and the delete-user trigger use MySQL-specific SQL such as `DATE_FORMAT` and `NOW()`

## Project Structure

```text
PFF/
|-- README.md
|-- .gitignore
|-- back-end/
|   |-- app/
|   |   |-- Http/
|   |   |   |-- Controllers/
|   |   |   |   |-- Admin/
|   |   |   |   |-- AuthController.php
|   |   |   |   |-- BillboardController.php
|   |   |   |   |-- ContactController.php
|   |   |   |   |-- DashboardController.php
|   |   |   |   |-- RegisterController.php
|   |   |   |   |-- ReservationController.php
|   |   |   |-- Middleware/
|   |   |       |-- AdminMiddleware.php
|   |   |-- Models/
|   |   |   |-- Billboard.php
|   |   |   |-- Contact.php
|   |   |   |-- Reservation.php
|   |   |   |-- User.php
|   |   |-- Notifications/
|   |       |-- ReservationConfirmed.php
|   |-- bootstrap/
|   |-- config/
|   |-- database/
|   |   |-- factories/
|   |   |-- migrations/
|   |   |-- seeders/
|   |-- public/
|   |   |-- images/
|   |       |-- billboards/
|   |-- resources/
|   |   |-- views/
|   |       |-- reservation_pdf.blade.php
|   |       |-- welcome.blade.php
|   |-- routes/
|   |   |-- api.php
|   |   |-- web.php
|   |-- storage/
|   |-- tests/
|   |-- artisan
|   |-- composer.json
|   |-- package.json
|   |-- phpunit.xml
|   |-- vite.config.js
|-- front-end/
|   |-- public/
|   |   |-- auth-snapshot.html
|   |-- src/
|   |   |-- Components/
|   |   |-- Dashboard/
|   |   |-- Data/
|   |   |-- Pages/
|   |   |-- assets/
|   |   |-- locales/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- i18n.jsx
|   |   |-- main.jsx
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
```

### Important Directories and Files

| Path | Purpose |
| --- | --- |
| `back-end/routes/api.php` | Main REST API route definitions. |
| `back-end/app/Http/Controllers` | Backend request handling for auth, contact messages, billboards, reservations, dashboard statistics, users, and settings. |
| `back-end/app/Models` | Eloquent models for users, billboards, contacts, and reservations. |
| `back-end/database/migrations` | Database schema for users, billboards, contacts, reservations, notifications, jobs, cache, tokens, and user deletion logs. |
| `back-end/resources/views/reservation_pdf.blade.php` | PDF receipt template for reservations. |
| `back-end/public/images/billboards` | Public billboard image storage used by the frontend. |
| `front-end/src/App.jsx` | Frontend route configuration. |
| `front-end/src/Pages` | Public and client pages such as home, billboards, contact, login, register, profile, and reservation. |
| `front-end/src/Dashboard` | Admin dashboard pages and layout. |
| `front-end/src/Components/ProtectedRoute.jsx` | Client-side route protection based on `token` and `role` in `localStorage`. |
| `front-end/src/i18n.jsx` | Frontend language setup for English, French, and Arabic. |
| `front-end/src/utils/billboardMedia.js` | Builds public URLs for billboard images served by Laravel. |

## Installation Guide

### Prerequisites

- PHP 8.2 or newer
- Composer
- Node.js and npm
- MySQL or MariaDB recommended
- Git

### Backend Setup

```bash
cd back-end
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

Configure the database values in `back-end/.env`, then run:

```bash
php artisan migrate
php artisan storage:link
```

Optional seed commands:

```bash
php artisan db:seed
php artisan db:seed --class=BillboardSeeder
php artisan db:seed --class=UserSeeder
```

Start the Laravel API server:

```bash
php artisan serve
```

The frontend currently calls the backend at `http://127.0.0.1:8000/api` and in a few places at `http://localhost:8000/api`, so keep the backend on port `8000` for local development.

Laravel backend scripts detected in `back-end/composer.json`:

| Command | Purpose |
| --- | --- |
| `composer run setup` | Installs Composer dependencies, creates `.env`, generates app key, runs migrations, installs npm packages, and builds assets. |
| `composer run dev` | Runs Laravel server, queue listener, log tailing, and Vite together through `concurrently`. |
| `composer run test` | Clears config and runs Laravel tests. |

Laravel npm scripts detected in `back-end/package.json`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts Vite for Laravel-managed frontend assets. |
| `npm run build` | Builds Laravel-managed frontend assets. |

### Frontend Setup

Open a second terminal:

```bash
cd front-end
npm install
npm run dev
```

Vite will usually serve the React app at:

```text
http://localhost:5173
```

Frontend scripts detected in `front-end/package.json`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the production frontend. |
| `npm run lint` | Runs ESLint over the frontend project. |
| `npm run preview` | Previews the production build locally. |

### Admin Access

The frontend checks `localStorage.role === "admin"` before showing admin pages. The backend groups admin API routes with `auth:api` and the configured `admin` middleware alias.

To access the admin dashboard locally, create or register a user, then set that user's `role` column to `admin` in the database.

## Environment Variables

The backend uses Laravel `.env` configuration. The React frontend does not currently read `import.meta.env` variables; API base URLs are hard-coded in the frontend source.

Do not commit real `.env` files or secrets. Use placeholders in examples and generate real values locally with Artisan commands.

### Required Backend Variables

| Variable | Purpose |
| --- | --- |
| `APP_NAME` | Application name used by Laravel and mail defaults. |
| `APP_ENV` | Runtime environment, usually `local`, `production`, or `testing`. |
| `APP_KEY` | Laravel encryption key generated by `php artisan key:generate`. |
| `APP_DEBUG` | Enables or disables debug error output. |
| `APP_URL` | Base URL used by Laravel for generated links and storage URLs. |
| `JWT_SECRET` | Secret used by `tymon/jwt-auth` to sign API tokens. Generate with `php artisan jwt:secret`. |
| `DB_CONNECTION` | Database driver. Use `mysql` or `mariadb` for full compatibility. |
| `DB_HOST` | Database server host. |
| `DB_PORT` | Database server port. |
| `DB_DATABASE` | Database name. |
| `DB_USERNAME` | Database username. |
| `DB_PASSWORD` | Database password. |
| `FILESYSTEM_DISK` | Default filesystem disk. Creative files are stored on the `public` disk. |
| `QUEUE_CONNECTION` | Queue backend used by Laravel notifications and jobs. |
| `CACHE_STORE` | Cache backend. |
| `SESSION_DRIVER` | Session backend. |
| `MAIL_MAILER` | Mail transport used for reservation notifications. |
| `MAIL_HOST` | SMTP host when using SMTP mail. |
| `MAIL_PORT` | SMTP port. |
| `MAIL_USERNAME` | SMTP username. |
| `MAIL_PASSWORD` | SMTP password. |
| `MAIL_FROM_ADDRESS` | Sender email address for outgoing mail. |
| `MAIL_FROM_NAME` | Sender name for outgoing mail. |

### Additional Variables Detected

These are referenced by Laravel config files or present in the checked-in `.env.example`. Many can stay unset unless the related service is used.

| Variables | Purpose |
| --- | --- |
| `APP_LOCALE`, `APP_FALLBACK_LOCALE`, `APP_FAKER_LOCALE` | Locale and Faker locale configuration. |
| `APP_MAINTENANCE_DRIVER`, `APP_MAINTENANCE_STORE`, `APP_PREVIOUS_KEYS` | Maintenance mode and key rotation settings. |
| `BCRYPT_ROUNDS` | Password hashing cost. |
| `AUTH_GUARD`, `AUTH_MODEL`, `AUTH_PASSWORD_BROKER`, `AUTH_PASSWORD_RESET_TOKEN_TABLE`, `AUTH_PASSWORD_TIMEOUT` | Laravel authentication and password reset configuration. |
| `JWT_TTL`, `JWT_REFRESH_TTL`, `JWT_ALGO`, `JWT_LEEWAY`, `JWT_BLACKLIST_ENABLED`, `JWT_BLACKLIST_GRACE_PERIOD`, `JWT_PUBLIC_KEY`, `JWT_PRIVATE_KEY`, `JWT_PASSPHRASE` | Optional JWT token lifetime, algorithm, blacklist, and asymmetric key configuration. |
| `DB_URL`, `DB_SOCKET`, `DB_CHARSET`, `DB_COLLATION`, `DB_FOREIGN_KEYS`, `MYSQL_ATTR_SSL_CA`, `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE` | Advanced database connection options. |
| `DB_CACHE_CONNECTION`, `DB_CACHE_TABLE`, `DB_CACHE_LOCK_CONNECTION`, `DB_CACHE_LOCK_TABLE`, `CACHE_PREFIX` | Database cache and cache lock configuration. |
| `MEMCACHED_HOST`, `MEMCACHED_PORT`, `MEMCACHED_USERNAME`, `MEMCACHED_PASSWORD`, `MEMCACHED_PERSISTENT_ID` | Memcached cache configuration. |
| `REDIS_CLIENT`, `REDIS_URL`, `REDIS_HOST`, `REDIS_USERNAME`, `REDIS_PASSWORD`, `REDIS_PORT`, `REDIS_DB`, `REDIS_CACHE_DB`, `REDIS_CLUSTER`, `REDIS_PREFIX`, `REDIS_PERSISTENT`, `REDIS_MAX_RETRIES`, `REDIS_BACKOFF_ALGORITHM`, `REDIS_BACKOFF_BASE`, `REDIS_BACKOFF_CAP` | Redis database and cache configuration. |
| `SESSION_LIFETIME`, `SESSION_EXPIRE_ON_CLOSE`, `SESSION_ENCRYPT`, `SESSION_CONNECTION`, `SESSION_TABLE`, `SESSION_STORE`, `SESSION_PATH`, `SESSION_DOMAIN`, `SESSION_SECURE_COOKIE`, `SESSION_HTTP_ONLY`, `SESSION_SAME_SITE`, `SESSION_PARTITIONED_COOKIE` | Laravel session and cookie behavior. |
| `DB_QUEUE_CONNECTION`, `DB_QUEUE_TABLE`, `DB_QUEUE`, `DB_QUEUE_RETRY_AFTER`, `BEANSTALKD_QUEUE_HOST`, `BEANSTALKD_QUEUE`, `BEANSTALKD_QUEUE_RETRY_AFTER`, `SQS_PREFIX`, `SQS_QUEUE`, `SQS_SUFFIX`, `QUEUE_FAILED_DRIVER` | Queue and failed-job storage configuration. |
| `REDIS_QUEUE_CONNECTION`, `REDIS_QUEUE`, `REDIS_QUEUE_RETRY_AFTER` | Redis queue configuration. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_URL`, `AWS_ENDPOINT`, `AWS_USE_PATH_STYLE_ENDPOINT` | AWS S3, SQS, or DynamoDB related configuration. |
| `DYNAMODB_CACHE_TABLE`, `DYNAMODB_ENDPOINT` | DynamoDB cache configuration. |
| `MAIL_SCHEME`, `MAIL_URL`, `MAIL_EHLO_DOMAIN`, `MAIL_SENDMAIL_PATH`, `MAIL_LOG_CHANNEL`, `POSTMARK_API_KEY`, `POSTMARK_MESSAGE_STREAM_ID`, `RESEND_API_KEY` | Advanced or third-party mail provider configuration. |
| `LOG_CHANNEL`, `LOG_STACK`, `LOG_DEPRECATIONS_CHANNEL`, `LOG_DEPRECATIONS_TRACE`, `LOG_LEVEL`, `LOG_DAILY_DAYS`, `LOG_STDERR_FORMATTER`, `LOG_SYSLOG_FACILITY` | Application logging configuration. |
| `LOG_SLACK_WEBHOOK_URL`, `LOG_SLACK_USERNAME`, `LOG_SLACK_EMOJI`, `PAPERTRAIL_URL`, `PAPERTRAIL_PORT`, `LOG_PAPERTRAIL_HANDLER`, `SLACK_BOT_USER_OAUTH_TOKEN`, `SLACK_BOT_USER_DEFAULT_CHANNEL` | Slack and Papertrail logging or service integration settings. |
| `SANCTUM_STATEFUL_DOMAINS`, `SANCTUM_TOKEN_PREFIX` | Sanctum configuration. Sanctum is installed, although API auth currently uses JWT. |
| `BROADCAST_CONNECTION` | Laravel broadcasting connection from `.env.example`. |
| `VITE_APP_NAME` | Vite app name from Laravel's `.env.example`; not used by the separate React frontend. |

### Example `.env.example`

```env
APP_NAME=AtlasAds
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

JWT_SECRET=
JWT_TTL=60
JWT_REFRESH_TTL=20160

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=atlasads
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS=no-reply@atlasads.local
MAIL_FROM_NAME="${APP_NAME}"

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
```

## API Endpoints

Base URL for local development:

```text
http://127.0.0.1:8000/api
```

Use this header for authenticated requests:

```http
Authorization: Bearer <jwt_token>
Accept: application/json
```

### Public Routes

| Method | Endpoint | Purpose | Request Body | Auth |
| --- | --- | --- | --- | --- |
| `POST` | `/contact` | Store a contact form message. | `fullname`, `email`, `message` | Public |
| `POST` | `/login` | Authenticate a user and return a JWT token plus user data. | `email`, `password` | Public |
| `POST` | `/register` | Create a client account. | `name`, `email`, `password`, `password_confirmation` | Public |
| `GET` | `/billboards` | Return all billboards. | None | Public |
| `GET` | `/billboards/{id}` | Return one billboard by ID. | None | Public |
| `GET` | `/reservations/pdf/{id}` | Download a reservation receipt PDF. | None | Public route in backend; frontend may send token |

### Authenticated Client Routes

| Method | Endpoint | Purpose | Request Body | Auth |
| --- | --- | --- | --- | --- |
| `GET` | `/user` | Return the authenticated user. | None | JWT required |
| `GET` | `/notifications` | Return unread notifications for the authenticated user. | None | JWT required |
| `POST` | `/notifications/mark-as-read` | Mark all unread notifications as read. | None | JWT required |
| `POST` | `/reservations` | Create a reservation request with a creative file. | `multipart/form-data`: `billboard_id`, `start_date`, `end_date`, `phone`, optional `company_name`, `creative_file` | JWT required |
| `GET` | `/my-reservations` | Return the authenticated user's reservations with billboard data. | None | JWT required |
| `POST` | `/logout` | Invalidate the current JWT token. | None | JWT required |
| `DELETE` | `/reservations/{id}` | Cancel the authenticated user's own pending reservation. | None | JWT required |

### Admin Routes

Admin routes are grouped with `auth:api` and the configured `admin` middleware alias. The frontend additionally checks that the stored user role is `admin`.

| Method | Endpoint | Purpose | Request Body | Auth |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/stats` | Return dashboard statistics, revenue history, panel type distribution, city distribution, and recent reservations. | None | JWT plus admin route group |
| `GET` | `/admin/contacts` | Return contact messages ordered by newest first. | None | JWT plus admin route group |
| `POST` | `/admin/billboards` | Create a billboard with uploaded image. | `multipart/form-data`: `title`, `city`, `zone`, `type`, `size`, `price`, `is_available`, `image` | JWT plus admin route group |
| `PUT/PATCH` | `/admin/billboards/{billboard}` | Update a billboard. The frontend sends multipart updates with `_method=PUT`. | `title`, `city`, `zone`, `type`, `size`, `price`, `is_available`, optional `image` | JWT plus admin route group |
| `DELETE` | `/admin/billboards/{billboard}` | Delete a billboard and its stored image. | None | JWT plus admin route group |
| `GET` | `/admin/reservations` | Return all reservations with user and billboard summaries. | None | JWT plus admin route group |
| `PATCH` | `/admin/reservations/{id}/status` | Update reservation status. | `status`: `pending`, `confirmed`, `cancelled`, or `rejected` | JWT plus admin route group |
| `GET` | `/admin/users` | Return paginated users with optional search and admin/user stats. | Query: `page`, `search` | JWT plus admin route group |
| `PATCH` | `/admin/users/{id}/role` | Update a user role. Prevents removing the current user's own admin role. | `role`: `admin` or `client` | JWT plus admin route group |
| `DELETE` | `/admin/users/{id}` | Delete a user. Prevents deleting the current admin account. | None | JWT plus admin route group |
| `GET` | `/admin/settings` | Return current admin profile and preferences. | None | JWT plus admin route group |
| `PUT` | `/admin/settings/profile` | Update admin profile data. | `name`, `email`, optional `phone` | JWT plus admin route group |
| `PUT` | `/admin/settings/password` | Update admin password after checking current password. | `current_password`, `password`, `password_confirmation` | JWT plus admin route group |
| `PUT` | `/admin/settings/preferences` | Update dashboard preferences. | `emailNotifications`, `reservationAlerts`, `weeklyReports`, `language`, `timezone` | JWT plus admin route group |

### Web Routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Render Laravel's welcome view. |
| `POST` | `/contact` | Store a contact message through the same contact controller used by the API. |

## Screenshots

Add screenshots to a `screenshots/` directory and replace the placeholder paths below.

### Home Page

![AtlasAds home page screenshot](screenshots/home-page.png)

### Billboard Catalog

![Billboard catalog with filters screenshot](screenshots/billboard-catalog.png)

### Reservation Flow

![Reservation form and creative upload screenshot](screenshots/reservation-flow.png)

### Client Profile

![Client reservation history screenshot](screenshots/client-profile.png)

### Admin Dashboard

![Admin analytics dashboard screenshot](screenshots/admin-dashboard.png)

### Admin Billboard Management

![Admin billboard management screenshot](screenshots/admin-billboards.png)

## Testing and Quality

### Backend

```bash
cd back-end
composer run test
```

### Frontend

```bash
cd front-end
npm run lint
npm run build
```

### Production Build

Build the React frontend:

```bash
cd front-end
npm run build
```

Build Laravel-managed assets if needed:

```bash
cd back-end
npm run build
```


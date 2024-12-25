
# Cachorrinho-Express API

A REST API built with Express.js and TypeScript with JWT-based authentication.

## Features

- User CRUD
- Authentication using JWT
- Brazilian CPF, phone, and email validation
- Password encryption
- Error handling with `neverthrow`
- PostgreSQL database with Prisma ORM
- Docker support

## Prerequisites

- Node.js 18+
- PostgreSQL 15
- Yarn
- (Optional) Docker

## Installation

1. Clone the repository:
```bash
git clone <github.com/leeozaka/cachorrinho-express>
cd <cachorrinho-express>
```

2. Install dependencies:
```bash
yarn install
```

3. Create a 

.env

 file based on `.env.example` and configure your environment variables:
```
DATABASE_URL="postgresql://salvacao:salvacao123@localhost:5432/cachorrinhodb"
JWT_SECRET=your-secret-key
PORT=3344
```

4. Generate Prisma client:
```bash
npx prisma generate
```

## Running the Application

### Using Docker

```bash
docker-compose up
```

### Without Docker

1. Start the dev server:
```bash
yarn dev
```
2. App runs at `http://localhost:3344`.

## API Endpoints

### User
- `POST /user` (create user)
- `GET /user` (find user by `req.body.userId` or `?id=`)
- `PUT /user` (update user)
- `DELETE /user` (soft-delete user)

### Authentication
- `POST /login` (authenticate user)

## Project Structure

### Authentication
- `POST /login` - User login

## Project Structure

```
src/
├── @types/        # Type definitions
├── config/         # Configuration files
├── controllers/   # Route controllers
├── dtos/          # Data Transfer Objects
├── enums/         # Enumerations
├── helpers/       # Helper functions
├── interfaces/    # TypeScript interfaces
├── mapper/        # Object mappers
├── middlewares/   # Express middlewares
├── models/        # Domain models
├── prisma/        # Database schema and migrations
├── repositories/  # Data access layer
├── routes/        # Route definitions
├── services/      # Business logic
├── tests/         # Test files
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```

This README provides a comprehensive overview of the project structure, setup instructions, available endpoints, and contribution guidelines based on the codebase. The structure reflects the actual organization of your project and includes the key features implemented in your code.

You can add more sections as needed, such as:
- Detailed API documentation
- Environment variable descriptions
- Deployment instructions
- Troubleshooting guide
- Performance considerations
- Security recommendations
# Twinkle

Twinkle is a task management application inspired by Trello, designed to help users efficiently manage their tasks and collaborate with others. It features a modern user interface, drag-and-drop functionality, and robust authentication.

## Features

- **Task Management:** Create, update, and delete tasks effortlessly.
- **Drag and Drop:** Easily rearrange tasks and lists with a smooth drag-and-drop interface.
- **User Authentication:** Secure sign-up and login functionality for user accounts.
- **Collaborative Workspaces:** Work together with team members by sharing boards.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend:**
   - [Next.js](https://nextjs.org/)
   - [React](https://reactjs.org/)
   - [Radix UI](https://www.radix-ui.com/)
   - [React Query](https://react-query.tanstack.com/)

- **Backend:**
   - [Bun](https://bun.sh/)
   - [Drizzle ORM](https://orm.drizzle.team/)
   - [Hono](https://hono.dev/)

- **Database:**
   - [PostgreSQL](https://www.postgresql.org/)

## Installation

### Prerequisites

- Node.js (version 14 or later)
- Bun (version 0.6 or later)
- PostgreSQL

### Clone the Repository

```bash
git clone https://github.com/luckydevboy/twinkle.git
cd twinkle
```

### Install Dependencies

For the frontend:

```bash
cd frontend
npm install
```

For the backend:

```bash
cd server
bun install
```

### Setup the Database

1. Create a new PostgreSQL database.
2. Configure the database connection settings in the backend's `.env` file.

### Run the Application

To run the backend server:

```bash
cd server
bun run dev
```

To run the frontend application:

```bash
cd frontend
npm run dev
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

- **Create an Account:** Sign up to start managing your tasks.
- **Create Boards:** Set up different boards for various projects.
- **Add Tasks:** Create tasks within boards and assign them to team members.
- **Drag and Drop:** Rearrange tasks and lists as needed for better organization.

## Contributing

Contributions are welcome! If you would like to contribute to Twinkle, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your fork.
4. Open a pull request detailing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspiration from Trello
- Special thanks to the open-source community for their invaluable contributions.

## Contact

For inquiries or feedback, please reach out to [your email](mailto:your-email@example.com).

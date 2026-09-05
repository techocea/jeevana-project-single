# Jeevana.lk

**Jeevana.lk** is a modern matrimonial advertisement portal designed to connect individuals seeking their life partners. It provides users with an efficient and easy-to-use platform for browsing, advertising, and connecting with prospective matches.

---

## Features

- **User Authentication**:
    - Secure user login and registration.
    - Password reset using email verification.

- **Matrimonial Advertisements**:
    - Create, view, and manage matrimonial ads.
    - Advanced search functionality to filter ads based on age, religion, profession, and more.

- **User Dashboard**:
    - Manage personal profile details.
    - Track activity such as ads posted and interactions received.

- **Image and Document Uploads**:
    - Upload profile pictures, documents, and other images securely.

- **Responsive Design**:
    - Fully optimized for desktop, tablet, and mobile devices.

- **Notifications**:
    - Get notifications for ad inquiries/messages.
    - Integration with **react-hot-toast** for real-time feedback.

- **Dark Mode Support**:
    - Dark and light theme support using `next-themes`.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (16.x or later)
- [pnpm](https://pnpm.io/) (Package manager)
- Environment variables configured in a `.env` file (see below for details).

### Installation

1. Clone the project repository:
   ```bash
   git clone https://github.com/your-username/jeevana.lk.git
   cd jeevana.lk
   ```

2. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of your project and add the following variables:
   ```bash
   DATABASE_URL=your_database_connection_string
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```
    4. Run database migrations (if using Drizzle ORM):
   ```bash
   pnpm drizzle:sync
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

   By default, the app runs on [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

- **Frontend**:
    - [React](https://reactjs.org/) with [Next.js](https://nextjs.org/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [Embla Carousel](https://www.embla-carousel.com/) for smooth ad sliders
    - [Radix UI](https://radix-ui.com/) for accessible UI components

- **Backend**:
    - **Supabase**: Authentication and real-time database
    - **Drizzle ORM**: TypeScript-first database ORM

- **State Management**:
    - [React Hook Form](https://react-hook-form.com/) for form handling
    - Context API for global state in lightweight use cases

- **Other Tools & Libraries**:
    - [Zod](https://zod.dev/) for schema validation
    - [PostCSS](https://postcss.org/), [ESLint](https://eslint.org/) for code quality and linting
    - [React Hot Toast](https://react-hot-toast.com/) for notifications

---

## Scripts

Here are some useful scripts you can run:

| Command               | Description                                   |
|-----------------------|-----------------------------------------------|
| `pnpm dev`            | Start the development server                 |
| `pnpm build`          | Create an optimized production build         |
| `pnpm start`          | Start the production server                  |
| `pnpm lint`           | Lint the code for errors or stylistic issues |
| `pnpm drizzle:sync`   | Sync database schema with Drizzle migrations |

---

## Folder Structure

```plaintext
jeevana.lk/
├── components/             # Reusable React components
├── pages/                  # Next.js pages and API endpoints
├── lib/                    # Helper functions and abstractions (e.g., Supabase client setup)
├── styles/                 # Tailwind CSS configurations
├── public/                 # Public assets (images, icons, etc.)
├── drizzle/                # Database migrations and schema
└── package.json            # Dependencies and project config
```

---

## Environment Variables

Make sure to configure these variables in your `.env` file:

| Variable Name               | Description                                   |
|-----------------------------|-----------------------------------------------|
| `DATABASE_URL`              | Database connection string                   |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase API URL                             |
| `NEXT_PUBLIC_SUPABASE_KEY`  | Supabase public API key                      |

---

## Future Enhancements

Planned features include:

1. **Subscription Plans**:
    - Premium plans with added visibility for advertisements.

2. **Real-Time Messaging**:
    - Ability for users to chat with potential matches directly on the platform.

3. **AI Recommendations**:
    - Machine learning algorithm to suggest matches based on user preferences and behavior.

4. **Performance Improvements**:
    - Optimize rendering and loading times especially for large datasets.

---

## Contributing

We welcome contributions! To get started:

1. Fork the project.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m "Added new feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Contact

For questions, feedback, or support, please contact:

- **Email**: `support@jeevana.lk`
- **Website**: [https://jeevana.lk](https://jeevana.lk)

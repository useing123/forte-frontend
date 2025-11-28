# Forte Hackathon Frontend

A brief description of your project. Forte is a tool created for a hackathon that helps developers manage and synchronize their repositories.

This is the frontend part of the project. The backend can be found [here](https://github.com/KazachiKapai/forte-hackathon-core).

## 🚀 Key Features

*   **Authentication:** Secure login using Clerk.
*   **Onboarding:** A simple process to connect your repositories.
*   **Dashboard:** A user-friendly interface to view and manage connected repositories.
*   **Synchronization:** Ability to synchronize repository data.

## 🛠️ Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Forms:** [React Hook Form](https://react-hook-form.com/)
*   **Validation:** [Zod](https://zod.dev/)

## ⚙️ Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd frontend
    ```

2.  **Install dependencies:**
    It is recommended to use `pnpm` to install dependencies.
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory of the project and add the necessary variables. At a minimum, you will need keys for Clerk.
    ```env
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    API_URL=http://localhost:8080
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.
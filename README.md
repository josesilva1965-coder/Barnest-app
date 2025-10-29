# BarNest: Comprehensive Bar & Restaurant Management

This is a full-stack web application designed to manage a bar or restaurant. It includes a frontend built with React and Vite, and a backend powered by Node.js and Express.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/josesilva1965-coder/Barnest-app.git
    cd Barnest-app
    ```

2.  **Install dependencies:**

    This will install both the frontend and backend dependencies.

    ```bash
    npm install
    npm --prefix backend install
    ```

### Environment Variables

Before you can run the application, you'll need to create a `.env` file in the root of the project and add your Gemini API key.

1.  Create a `.env` file in the root of the project:

    ```bash
    touch .env
    ```

2.  Add your Gemini API key to the `.env` file:

    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

    Replace `YOUR_API_KEY_HERE` with your actual Gemini API key.

### Running the Application

To run the application, use the `start` script:

```bash
npm start
```

This will start both the frontend and backend servers concurrently.

*   The frontend will be available at `http://localhost:3000`.
*   The backend will be available at `http://localhost:8000`.

## Deployment

This application is configured for easy deployment to [Vercel](https://vercel.com/).

1.  **Create a Vercel account** if you don't already have one.

2.  **Import your project** from your Git provider.

3.  **Configure the environment variables:**

    In the Vercel project settings, add your `GEMINI_API_KEY` to the environment variables.

4.  **Deploy the application.**

    Vercel will automatically detect the `vercel.json` file and deploy the application accordingly.

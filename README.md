# NoteLinkerAl

This project is a web application built using React, TypeScript, Vite, and .NET 8.0. The frontend is developed with React, while the backend is powered by .NET 8.0, with various Azure services integrated. The application allows users to take and manage notes, as well as perform various operations on the notes, such as text summarization, adding tags.

## Prerequisites

- Node.js v14 or later
- .NET 8.0 SDK

## Installation

### Frontend

1. Navigate to the frontend directory:

```bash
cd client
```

2. Install the dependencies:

```bash
npm install
```

### Backend

1. Navigate to the backend directory:

```bash
cd server
```

2. Install the .NET dependencies (if needed):

```bash
dotnet restore
```

## Scripts

### Frontend

In the `client` directory, you can run the following scripts:

- `npm start` or `npm run dev`: Start the development server using Vite.
- `npm run build`: Build the project for production.
- `npm run lint`: Lint the project using ESLint.
- `npm run preview`: Preview the production build.

### Backend

In the `server` directory, you can run the following commands:

- `dotnet build`: Build the project.
- `dotnet run`: Run the project.
- `dotnet test`: Run the tests (if applicable).

## Project Structure

### Frontend

The frontend is built with the following dependencies:

- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^6.24.0
- `react-quill`: ^2.0.0
- `axios`: ^1.7.2
- `dompurify`: ^3.1.6
- `@react-spring/web`: ^9.7.3
- `lucide-react`: ^0.400.0
- `ndjson-readablestream`: ^1.2.0
- `react-syntax-highlighter`: ^15.5.0

Development dependencies include:

- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react-swc`
- `typescript`
- `tailwindcss`
- `daisyui`
- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `postcss`
- `autoprefixer`

### Backend

The backend is built with .NET 8.0 and includes the following packages:

- `Azure.AI.FormRecognizer`
- `Azure.AI.OpenAI`
- `Azure.Search.Documents`
- `Azure.Storage.Blobs`
- `Microsoft.AspNetCore.Authentication.Google`
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Microsoft.AspNetCore.Authentication.MicrosoftAccount`
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.Extensions.Configuration`
- `Microsoft.SemanticKernel`
- `Newtonsoft.Json`
- `Swashbuckle.AspNetCore`

## Configuration

The application requires several configurations for logging, authentication, database connections, and Azure services. Below is the structure of the `appsettings.json` file, with sensitive information hidden:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Debug"
    }
  },
  "JWTSettings": {
    "TokenKey": "your-token-key"
  },
  "Authentication": {
    "Google": {
      "ClientId": "your-google-client-id",
      "ClientSecret": "your-google-client-secret"
    },
    "Microsoft": {
      "ClientId": "your-microsoft-client-id",
      "ClientSecret": "your-microsoft-client-secret"
    },
    "RedirectURL": "https://localhost:3000/inbox"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data source=notesApp.db"
  },
  "AzureOpenAI": {
    "Endpoint": "https://your-openai-endpoint/",
    "Key": "your-openai-key",
    "ChatGPTDeploymentId": "your-deployment-id"
  },
  "AzureComputerVision": {
    "Endpoint": "your-computervision-endpoint",
    "ApiKey": "your-computervision-api-key"
  },
  "CitationBaseUrl": "your-citation-base-url",
  "AllowedHosts": "*"
}
```

### Configuration Details

- **Logging**: Configures the logging level for the application.
- **JWTSettings**: Contains the token key used for JWT authentication.
- **Authentication**: Settings for Google and Microsoft authentication, including client IDs and secrets.
- **ConnectionStrings**: Database connection string.
- **AzureOpenAI**: Settings for Azure OpenAI integration, including endpoint and keys.
- **AzureComputerVision**: Settings for Azure Computer Vision integration.
- **CitationBaseUrl**: Base URL for citation services.
- **AllowedHosts**: Specifies the allowed hosts for the application.

Replace the placeholder values (`your-token-key`, `your-google-client-id`, etc.) with your actual configuration values.

## Additional Information

This project originally intended to implement a Retrieval-Augmented Generation (RAG) feature to search document data. Some code implementations were referenced from [Azure-Samples/azure-search-openai-demo-csharp](https://github.com/Azure-Samples/azure-search-openai-demo-csharp) and [Azure-Samples/azure-search-openai-javascript](https://github.com/Azure-Samples/azure-search-openai-javascript). However, due to time constraints, this feature is not fully developed.

## Running the Application

### Frontend

To start the frontend development server, run:

```bash
npm start
```

### Backend

To start the backend server, run:

```bash
dotnet run
```

### Full Stack

1. Start the backend server.
2. Start the frontend development server.
3. Access the application via the frontend URL (typically `http://localhost:3000`).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

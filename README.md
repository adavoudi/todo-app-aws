# TODO App with AWS

This repository contains a TODO app built using AWS services, designed to provide hands-on experience with cloud computing, CI/CD pipelines, and infrastructure-as-code. The app is implemented in both serverless and serverful architectures, allowing you to explore the pros and cons of each approach.

## Key Features
- **Frontend**: Built with React and Vite, styled using Tailwind CSS.
- **Backend**: Powered by Python and FastAPI, with AWS DynamoDB for data storage.
- **Authentication**: Integrated with AWS Cognito for secure user authentication.
- **CI/CD Pipeline**: Fully automated using AWS CodePipeline and CodeBuild.
- **Infrastructure-as-Code**: Managed with AWS CloudFormation for easy replication and version control.

## Getting Started
To explore the project in detail, including setup instructions and architecture comparisons, check out the [blog post](#) (link to be added).

## Repository Contents
- `backend/`: Contains the backend code and Dockerfile.
- `frontend/`: Contains the React frontend code.
- `cloudformation-application.yml`: CloudFormation template for the app infrastructure.
- `cloudformation-cicd.yml`: CloudFormation template for the CI/CD pipeline.
- `buildspec-backend.yml`: Build specification for the backend.
- `buildspec-frontend.yml`: Build specification for the frontend.

## How to Use
1. Clone the repository.
2. Follow the detailed instructions in the [blog post](#) to set up the app and CI/CD pipeline.

## License
This project is open-source and available under the [MIT License](LICENSE).
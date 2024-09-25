# Contributing to Xenon JS

First off, thank you for considering contributing to this project! Your help is essential for making it better and more useful to the community. Below are the guidelines for contributing.

## Getting Started

To get started with the project and set up your environment, follow the steps below:

1. **Fork the repository**:
    - Go to the project’s GitHub page and click the "Fork" button.

2. **Clone your forked repository**:
    - Once you’ve forked the repository, clone it to your local machine:
    ```bash
    git clone https://github.com/yourusername/yourframework.git
    cd yourframework
    ```

3. **Install dependencies**:
    - Ensure you have Node.js installed, and then install the project dependencies:
    ```bash
    npm install
    ```

4. **Run the project**:
    - Start the development environment:
    ```bash
    npm run dev
    ```

## How to Contribute

There are several ways to contribute to this project, including reporting bugs, suggesting features, and submitting code. Please follow these guidelines to ensure smooth collaboration.

### Reporting Bugs

If you find a bug, please open an issue. Ensure you include:

- A clear and concise description of the bug.
- Steps to reproduce the issue.
- Expected behavior and actual behavior.
- Any relevant screenshots or logs.

### Suggesting Features

We welcome new ideas! To suggest a feature:

1. Check if the feature has already been requested.
2. If not, open an issue and describe:
    - What the feature should do.
    - Why it's important or beneficial to the framework.
    - Any potential implementation approaches.

### Submitting Code Contributions

1. **Fork and branch**:
    - Fork the repository and create a new branch for your changes:
    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Make your changes**:
    - Make your changes in the relevant files. Ensure that your code adheres to the project’s coding standards and style.

3. **Commit your changes**:
    - Write clear, descriptive commit messages:
    ```
    [Feature] Added support for x-for directive
    [Fix] Resolved interpolation issue with x-if
    ```

4. **Push and submit a pull request**:
    - Push your changes to your forked repository and submit a pull request to the `main` branch of the original repository:
    ```bash
    git push origin feature/your-feature-name
    ```
    - In your pull request, include:
      - A clear description of your changes.
      - Issue numbers the pull request addresses (if applicable).
      - Any notes about the implementation or design decisions.

### Code Guidelines

To maintain code quality and readability, please follow the guidelines below:

- **Framework Architecture**:
    - Keep contributions aligned with the core goal of this project: supporting directives (`x-if`, `x-for`), text interpolation, and a component-based structure.

- **Testing**:
    - Ensure all new features and bug fixes are covered by unit tests.
    - Test your changes in a variety of scenarios, ensuring that existing functionality is not affected.

- **Code Formatting**:
    - Use `Prettier` and `ESLint` to ensure consistent code formatting.
    - Before committing, run:
    ```bash
    npm run lint
    npm run format
    ```

- **Documentation**:
    - Update the `README.md` and any relevant documentation for new features or changes.

## Acknowledgements

Thank you for taking the time to contribute! Your involvement makes this project better for everyone.

# Contributing to Gritize

First off, thank you for considering contributing to Gritize! 🎉 Your contributions help make this platform better for developers.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Feature Requests](#feature-requests)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [mojmohammad98@gmail.com](mailto:mojmohammad98@gmail.com).

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome developers of all skill levels and backgrounds
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together towards common goals

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **pnpm** (recommended package manager)
- **Git** for version control

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/gritize.git
   cd gritize
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Verify the setup**
   - Open [http://localhost:3000](http://localhost:3000)
   - Ensure the application loads correctly

## 🤝 How to Contribute

There are many ways you can contribute to Gritize:

### 🐛 Bug Reports

- Check existing issues before creating new ones
- Use the bug report template
- Provide detailed reproduction steps
- Include environment information

### ✨ Feature Contributions

- UI/UX improvements
- AI prompt enhancements
- Performance optimizations
- Documentation improvements

### 📚 Documentation

- Improve existing documentation
- Add code examples
- Fix typos and grammar
- Translate documentation

### 🧪 Testing

- Write unit tests
- Add integration tests
- Improve test coverage
- Test on different browsers/devices

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue_number-description
```

### 2. Make Your Changes

- Follow the [code standards](#code-standards)
- Write clear, concise commit messages
- Keep commits focused and atomic
- Test your changes thoroughly

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve issue with specific component"
```

### Commit Message Convention

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

### 4. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 📝 Code Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type - use specific types
- Use Zod schemas for runtime validation

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ Avoid
const user: any = getData();
```

### React Best Practices

- Use functional components with hooks
- Follow React naming conventions
- Implement proper error boundaries
- Use React.memo for performance optimization

```tsx
// ✅ Good
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick,
}) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

// ✅ Good
export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow consistent spacing and naming
- Ensure responsive design
- Use CSS custom properties for themes

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-surface rounded-lg shadow-md">
  <h3 className="text-lg font-semibold font-heading text-bg">Title</h3>
</div>
```

### File Organization

- Use descriptive file and folder names
- Group related components together
- Follow the established project structure
- Export components from index files

```
components/
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── index.ts          # Export all auth components
├── dashboard/
│   ├── StatisticsCard.tsx
│   └── index.ts
```

## 🏗️ Project Structure

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions and helpers
- `src/models/` - Data models and schemas
- `Data/` - Problem datasets and coding patterns

### Component Guidelines

1. **Create reusable components** in `src/components/ui/`
2. **Feature-specific components** go in respective feature folders
3. **Use TypeScript interfaces** for all component props
4. **Export components** from index files for clean imports

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features and bug fixes
- Use Jest and React Testing Library
- Test user interactions and edge cases
- Maintain good test coverage

```typescript
// Example test structure
describe("Button Component", () => {
  it("should render with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📤 Submitting Changes

### Pull Request Guidelines

1. **Fill out the PR template** completely
2. **Link related issues** using keywords (fixes #123)
3. **Provide clear description** of changes
4. **Include screenshots** for UI changes
5. **Ensure all checks pass** (tests, linting, type checking)

### PR Checklist

- [ ] Code follows project standards
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] No console.log statements left
- [ ] TypeScript compilation passes
- [ ] ESLint checks pass
- [ ] All tests pass

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on different environments
4. **Approval** from at least one maintainer
5. **Merge** into main branch

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the FAQ** and documentation
3. **Try the latest version** to see if it's already fixed

### Bug Report Template

When reporting bugs, please include:

- **Environment details** (OS, Node.js version, browser)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots or videos** if applicable
- **Console errors** or logs

### Feature Request Template

For feature requests, please provide:

- **Problem description** you're trying to solve
- **Proposed solution** or feature
- **Use cases** and examples
- **Alternative solutions** considered

## 💡 Feature Requests

We welcome feature requests! Before submitting:

1. **Check existing requests** to avoid duplicates
2. **Discuss complex features** in GitHub Discussions first
3. **Consider the scope** and alignment with project goals
4. **Provide detailed specifications** and use cases

### Priority Guidelines

- **High Priority**: Security fixes, critical bugs
- **Medium Priority**: Performance improvements, UX enhancements
- **Low Priority**: Nice-to-have features, minor improvements

## 🌟 Recognition

Contributors are recognized in several ways:

- **Contributors list** in README
- **Release notes** mentioning contributions
- **Special badges** for significant contributions
- **Maintainer invitation** for consistent contributors

## 💬 Community

### Getting Help

- **GitHub Discussions** for questions and ideas
- **GitHub Issues** for bugs and feature requests
- **Email** [mojmohammad98@gmail.com](mailto:mojmohammad98@gmail.com) for private matters

### Communication Guidelines

- **Be patient** - maintainers are volunteers
- **Be specific** in your questions and requests
- **Be constructive** in feedback and discussions
- **Help others** when you can

## 📚 Resources

### Helpful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Conventional Commits](https://conventionalcommits.org/)

### Learning Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🙏 Thank You

Thank you for taking the time to contribute to Gritize! Every contribution, no matter how small, helps improve the platform for developers worldwide.

**Happy coding! 🚀**

---

<div align="center">
  
  **Questions?** Feel free to reach out through [GitHub Discussions](https://github.com/mojtabababiker/gritize/discussions) or [email](mailto:mojmohammad98@gmail.com).
  
</div>

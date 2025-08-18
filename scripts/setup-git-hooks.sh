#!/bin/bash

# Setup script to install git hooks for the project

echo "Setting up git hooks..."

# Create the pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

# Pre-commit hook to run tests before committing
echo "Running tests before commit..."

# Run the test suite
npm run test:run

# Check if tests passed
if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Commit aborted."
  echo "Please fix the failing tests before committing."
  exit 1
fi

# Run linting
echo "Running linter..."
npm run lint

# Check if linting passed
if [ $? -ne 0 ]; then
  echo "❌ Linting failed! Commit aborted."
  echo "Please fix the linting errors before committing."
  exit 1
fi

echo "✅ All checks passed! Proceeding with commit..."
exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks have been set up successfully!"
echo "The pre-commit hook will now run tests and linting before each commit."
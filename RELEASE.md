# Release Process

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate versioning and publishing.

## How it works

Semantic-release analyzes your commit messages to determine the type of changes and automatically:

1. **Determines the next version number** based on conventional commits
2. **Generates release notes** from commit messages
3. **Updates the CHANGELOG.md** file
4. **Creates a Git tag** for the release
5. **Publishes to npm** using pnpm

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature (triggers a minor version bump)
- `fix`: A bug fix (triggers a patch version bump)
- `BREAKING CHANGE`: A breaking change (triggers a major version bump)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Patch release (1.0.66 -> 1.0.67)
git commit -m "fix: resolve issue with date picker validation"

# Minor release (1.0.66 -> 1.1.0)
git commit -m "feat: add support for custom field validation"

# Major release (1.0.66 -> 2.0.0)
git commit -m "feat!: redesign API for better type safety

BREAKING CHANGE: The CrudComponent props interface has been updated"
```

## Manual Release

To run a release manually (useful for testing):

```bash
# Dry run to see what would be released
pnpm run release:dry-run

# Actual release
pnpm run release
```

## Automated Release

The release process is automated via GitHub Actions when you push to the `main` branch. The workflow will:

1. Build the project
2. Analyze commits since the last release
3. Determine the next version
4. Generate release notes
5. Update CHANGELOG.md
6. Create a Git tag
7. Publish to npm

## Prerequisites

### Node.js Version
This project requires **Node.js >= 22.14.0** for semantic-release to work properly.

Check your Node.js version:
```bash
node --version
```

If you need to upgrade Node.js:
- Use [nvm](https://github.com/nvm-sh/nvm): `nvm install 22.14.0 && nvm use 22.14.0`
- Or download from [nodejs.org](https://nodejs.org/)

## Environment Variables

For the GitHub Actions workflow to work, you need to set up:

1. **NPM_TOKEN**: Your npm authentication token
   - Go to npmjs.com → Access Tokens → Generate New Token
   - Add it as a GitHub secret named `NPM_TOKEN`

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions

## Configuration

The semantic-release configuration is in `.releaserc.json` and includes:

- **Commit Analyzer**: Analyzes commit messages
- **Release Notes Generator**: Creates release notes
- **Changelog**: Updates CHANGELOG.md
- **Git**: Commits changes and creates tags
- **pnpm Publisher**: Publishes to npm using pnpm

## Migration from Manual Versioning

This setup replaces the manual `publish-npm` script. The old process:

```bash
# Old manual process
# 1. Manually update version in package.json
# 2. Run: pnpm run publish-npm
```

Is now replaced with:

```bash
# New automated process
# 1. Make commits with conventional format
# 2. Push to main branch
# 3. Release happens automatically
```

## Troubleshooting

### Node.js Version Error

If you see this error:
```
[semantic-release]: node version ^22.14.0 || >= 24.10.0 is required. Found v22.11.0.
```

**Solution**: Upgrade your Node.js version to 22.14.0 or higher:
```bash
# Using nvm (recommended)
nvm install 22.14.0
nvm use 22.14.0

# Or using n (alternative)
n 22.14.0
```

### No release triggered

- Check that your commits follow conventional commit format
- Ensure you're pushing to the `main` branch
- Check GitHub Actions logs for errors

### Release fails

- Verify NPM_TOKEN is set correctly
- Check that the package name is available on npm
- Ensure all dependencies are properly installed
- Verify Node.js version is >= 22.14.0

### Version not updating

- Make sure your commits have the right type (`feat`, `fix`, etc.)
- Check that the last commit wasn't already released
- Use `pnpm run release:dry-run` to preview what would happen

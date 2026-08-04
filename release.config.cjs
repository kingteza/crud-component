module.exports = {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['./scripts/check-npm-version.js'],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    // 1) Publish to npmjs.com (unchanged public flow)
    [
      '@anolilab/semantic-release-pnpm',
      {
        pnpmPublish: true,
        pnpmPublishArgs: ['--access', 'public'],
      },
    ],
    // 2) Mirror the same version to GitHub Packages
    // NOTE: @anolilab/semantic-release-pnpm always forces registry.npmjs.org and
    // ignores --registry in pnpmPublishArgs, so use exec for the GitHub mirror.
    [
      '@semantic-release/exec',
      {
        publishCmd:
          'pnpm publish --no-git-checks --access public --registry https://npm.pkg.github.com',
      },
    ],
  ],
};

# Release Process

Binaries for meritd are distributed for convenience from the [Official Site](https://merit.me) or GitHub and built by the core team .

## How to Release

When publishing to npm, the .gitignore file is used to exclude files from the npm publishing process. Be sure that the merit-node directory has only the directories and files that you would like to publish to npm. You might need to run the commands below on each platform that you intend to publish (e.g. Mac and Linux).

To make a release, bump the `version` of the `package.json`:

```bash
git checkout master
git pull upstream master
npm install
npm run test
npm run regtest
npm run jshint
git commit -a -m "Bump package version to <version>"
git push upstream master
npm publish
```

Create a release tag and push it to the BitPay Github repo:

```bash
git tag -s v<version> -m 'v<version>'
git push upstream v<version>
```

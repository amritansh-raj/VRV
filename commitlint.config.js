module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // feat: Implement a new feature or enhance an existing one.
        'init', // init: Initialize a new project or start a new module.
        'fix', // fix: Address a bug or issue in the codebase.
        'build', // build: Modify the build system or dependencies.
        'docs', // docs: Update or add documentation.
        'chore', // chore: Perform routine tasks or maintenance.
        'style', // style: Adjust code style or formatting without altering functionality.
        'refactor', // refactor: Restructure code without changing its external behavior.
        'ci', // ci: Update or modify continuous integration configurations.
        'test', // test: Add or modify tests.
        'revert', // revert: Undo a previous commit.
        'perf', // perf: Improve performance of the code.
        'vercel', // vercel: Deploy changes or updates via Vercel.
      ],
    ],
  },
};

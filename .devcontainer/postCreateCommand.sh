#!/bin/bash

npm i -g bun
bun install
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
bun run start:dev


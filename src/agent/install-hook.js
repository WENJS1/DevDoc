#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const hookScript = \`#!/bin/sh
# DevDoc Post-Commit Hook
# Automatically analyzes the commit and updates documentation

echo "🤖 [DevDoc] Analyzing commit for documentation updates..."

# Get the latest commit hash
COMMIT_HASH=$(git rev-parse HEAD)

# Extract commit message and diff
MESSAGE=$(git log -1 --pretty=%B)
DIFF=$(git show $COMMIT_HASH)

# Pass to our runner
npx ts-node .devdoc/runner.ts "$COMMIT_HASH"
\`;

const gitHookPath = path.join(process.cwd(), '.git', 'hooks', 'post-commit');
const devdocDir = path.join(process.cwd(), '.devdoc');

// Ensure .devdoc directory exists
if (!fs.existsSync(devdocDir)) {
    fs.mkdirSync(devdocDir);
    console.log("Created .devdoc/ configuraton directory.");
}

// Write the hook
try {
    fs.writeFileSync(gitHookPath, hookScript);
    fs.chmodSync(gitHookPath, '755'); // Make executable
    console.log("✅ Successfully installed DevDoc post-commit hook!");
} catch (e) {
    console.error("❌ Failed to install hook. Make sure you are in a git repository.");
}

const configTpl = \`{
  "modelPrimary": "openai:gpt-4o-mini",
  "maxRetries": 3,
  "maxDailyTokens": 100000
}\`;

fs.writeFileSync(path.join(devdocDir, "config.json"), configTpl);

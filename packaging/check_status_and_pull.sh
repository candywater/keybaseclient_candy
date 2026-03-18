#! /usr/bin/env bash

# There are lots of places where we need to check stuff like:
#   1) Does repo X exist?
#   2) Is it on a normal branch with upstream configured?
#   3) Is it clean?
#   4) Is it up to date?
# This script takes care of all that.

set -e -u -o pipefail

repo="${1:-}"
if [ -z "$repo" ] ; then
  echo "check_status_and_pull.sh needs a repo argument."
  exit 1
fi

if [ ! -d "$repo" ] ; then
  echo "Repo directory '$repo' does not exist."
  exit 1
fi

cd "$repo"

if [ ! -d ".git" ] ; then
  # This intentionally doesn't support bare repos. Some callers are going to
  # want to mess with the working copy.
  echo "Directory '$repo' is not a git repo."
  exit 1
fi

# fetch upstream
git fetch

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$current_branch" = "HEAD" ] ; then
  echo "Repo '$repo' is in detached HEAD state."
  exit 1
fi

upstream_branch="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
if [ -z "$upstream_branch" ] ; then
  echo "Repo '$repo' branch '$current_branch' has no upstream configured."
  exit 1
fi

current_status="$(git status --porcelain)"
if [ -n "$current_status" ] ; then
  echo "Repo '$repo' isn't clean."
  exit 1
fi

unpushed_commits="$(git log "$upstream_branch".."$current_branch")"
if [ -n "$unpushed_commits" ] ; then
  echo "Repo '$repo' has unpushed commits."
  exit 1
fi

echo "Repo '$repo' looks good. Pulling..."
git pull --ff-only

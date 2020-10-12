#!/bin/bash
version_pattern='^\d+\.\d+\.\d+$'

setup_git() {
  git config --global user.email "awamwang@gmail.com"
  git config --global user.name "awamwang"
}

commit_files() {
  if [ $TRAVIS_EVENT_TYPE != "pull_request" ]; then
    if [ $TRAVIS_BRANCH == "master" ]; then
      echo "Committing to master branch..."
      git checkout master
      git add *
      if [ $TRAVIS_EVENT_TYPE == "cron" ]; then
        git commit -m "Travis build: $TRAVIS_BUILD_NUMBER [cron]" -m "[skip ci]"
      elif [ $TRAVIS_EVENT_TYPE == "api" ]; then
        git commit -m "Travis build: $TRAVIS_BUILD_NUMBER [custom]" -m "[skip ci]"
      else
        git commit -m "Travis build: $TRAVIS_BUILD_NUMBER" -m "[skip ci]"
      fi
    fi
  fi
}

git_push() {
  if [ $TRAVIS_EVENT_TYPE != "pull_request" ]; then
    if [ $TRAVIS_BRANCH == "master" ]; then
      echo "Pushing to master branch..."
      git push --force --quiet "https://${GH_TOKEN}@github.com/awamwang/develop-knowledge-graphic.git" master > /dev/null 2>&1
    fi
  fi
}

npm_publish() {
  if [[ $TRAVIS_COMMIT_MESSAGE =~ $version_pattern ]]; then
    echo "Npm publish ${TRAVIS_COMMIT_MESSAGE}..."
    npm publish
  fi
}

setup_git
commit_files
git_push
# npm_publish
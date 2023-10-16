#!/bin/bash
### Checks out a parent project and submodule branch

# 1. Set branch of parent repository
git checkout $1
## 2. Set branch of git repository of submodule
git submodule foreach git checkout $1
## 2. Set submodule branch in .gitmodules
#git submodule set-branch --branch $1 -- client/src/fudge-lib


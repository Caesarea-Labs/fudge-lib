#!/bin/bash
### Branches the parent project and the submodule

# 1. Set branch of parent repository
git checkout -b $1
# 2. Set submodule branch in .gitmodules
git submodule set-branch --branch $1 -- client/src/fudge-lib
# 3. Set branch of git repository of submodule
git submodule foreach git checkout -b $1

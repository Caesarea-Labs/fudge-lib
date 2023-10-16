#!/bin/bash
#### Pushes changes in the parent project and the submodule
# 1. Update submodule
git submodule foreach git add .
git submodule foreach git commit -m "$1"
git submodule foreach git push
# 2. Update reference to submodule so that git uses the latest version
git submodule update --remote client/src/fudge-lib
# 3. Update this project, including new reference to submodule
git add .
git commit -m "$1"
git push

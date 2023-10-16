#!/bin/bash
#### Pulls changes in the parent project and the submodule

git pull
git submodule update --remote client/src/fudge-lib
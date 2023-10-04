# What?

Shared Typescript code used across multiple projects, meant to be used as a Git submodule.

# How?

- This should be placed as Git submodule in another repository, in the src directory of the client code.
- **Mantine, dayjs, and react-icons** must be dependencies of the client project of the main repo. Since this is just
  pure code, this repo doesn't have a package.json of its own and can't pull in libraries of its own.
- In the entrypoint of the main repo client code, the following imports must be used:

```typescript
import "../fudge-lib/styles.css"
import "../fudge-lib/extensions/ExtensionsImpl.js"
```

- Developers of the main repository should call `git clone --recurse-submodules` to clone it. Then `pull.sh` is used to
  pull changes from both the main repo and fudge-lib, and `push.sh` is used to push changes to the main repo and
  fudge-lib.

# Why?

NPM is bad.  
The common way to share Javascript code between NPM projects is by publishing an NPM library. The problem then arises
when you need to make changes to the library while working on the main project. If you work as an NPM library, on every
tiny change, you need to publish a new version to NPM, then pull the new version in the main project. This take roughly
a minute, for every tiny change, and it has other problems too.  
The common way to solve this problem is by using `npm link`. However, `npm link` sucks. It's not meant as a mechanism to
be shared among other developers of a repository, and when it is, it fails in some way or another.

# Where?

In Typescript React projects. 
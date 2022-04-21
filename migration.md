# Migration from 0.1.0 to 1.0.0

Due to breaking changes, this docs will help adjust your previous configuration.

## Project Creation

### Configuration

Now, the main attributes are these four variables, i.e. `datasaur`, `projectState`, `export`, and `create`. The only thing that needs adjustment is `create`.

- Previously named `project`.
- New attributes inside `create`: `files` (previously `documents`) and `assignment`. Both attributes are located as a root document from the previous version. There is no changes on the content though.

See the example below to illustrate the update.

<b>0.1.0 (Before)</b>

```
  {
    "datasaur": { ... },
    "projectState": { ... },
    "export": { ... },
    "documents": { ... },
    "assignment": { ... },
    "project": { ... }
  }
```

<b>1.0.0 (After)</b>

```
  {
    "datasaur": { ... },
    "projectState": { ... },
    "export": { ... },
    "create": { // previously project
      "files": { ... }, // previously documents and move
      "assignment": { ... }, // same name, just move
      ...
    }
  }
```

## Command

Previously, we need `--use-pcw` in order to use payload from Datasaur app, specificially the Project Creation Wizard (PCW). From now on, the recommended and default approach would be this one so there is no need to use additional `--use-pcw`, although the option would still work. So, if you used to run Robosaur without PCW integration and still wanna use the same approach, please use an additional option when running the project creation command, i.e. `--without-pcw`.

See the example below.

### 0.1.0 (Before)

1. npm run start -- create-projects <path-to-config-file>
2. npm run start -- create-projects <path-to-config-file> --use-pcw

### 1.0.0 (After)

1. npm run start -- create-projects <path-to-config-file> --without-pcw
2. npm run start -- create-projects <path-to-config-file>

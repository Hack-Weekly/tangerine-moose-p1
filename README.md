# README

# Generate React CLI

A package named "generate-react-cli" has been added to help speed up productivity in React projects and stop copying, pasting, and renaming files each time you want to create a new component.

Run the command below to create a new React component under `src/components/`.
```
npx generate-react-cli component MyComponentName
``` 

You can also add `--path={path}` option to specify where you want the component to be generated in. For example:
```
npx generate-react-cli component MyPageName --path=src/pages
```
# README

# Run React app on your local machine
1. Clone the project to your local machine
2. Switch to remote branch origin/develop
3. Either open an integrated terminal in \client or just use the cmd "cd client" to navigate to the front end project folder
4. npm install (make sure you have node installed https://nodejs.org/en/)
5. npm run dev
6. navigate to localhost:{port} link in your browser to run the app on local machine

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

See here for more information about available commands and options: https://www.npmjs.com/package/generate-react-cli

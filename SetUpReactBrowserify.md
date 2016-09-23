## Set up a react, browserify and watchify 

### Set up react and browserify
1. `npm install -g browserify`
1. `cd <projectFolder>`
1. `npm init` // this will create a package.json
1. `npm install --save react react-dom`
1. `npm install --save babelify babel-preset-react` // will use Babel to compile JSX
1. `mkdir src` // contains the source js files (components)
1. `mkdir build` // contains the bundled js file 
1. (Write JS components)
1. (Write index.js as the main entry point)
1. (Write HTML. It only needs to include  <script src="build/app.js"></script>)  
1. `browserify -t [ babelify --presets [ react ] ] src/index.js -o build/app.js`
1. The step above can be added in package.json, and then be called by running `npm run build` 

  ```
  "scripts": {
    "build": "browserify -t [ babelify --presets [ react ] ] src/index.js -o build/app.js"
  }
  ```

### Optional steps: Use watchify to watch for file changes and rebuild
1. `npm install --save watchify`
1. `watchify -t [ babelify --presets [ react ] ] src/index.js -o build/app.js -v`
1. The step above can also be added to 'script` property in package.json and be called by running `npm run <command>`

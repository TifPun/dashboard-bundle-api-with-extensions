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

## Reference
- React + Browserify: 
 - http://codeutopia.net/blog/2016/01/25/getting-started-with-npm-and-browserify-in-a-react-project/
- React.js tutorials:
 - https://scotch.io/tutorials/learning-react-getting-started-and-concepts
 - https://scotch.io/tutorials/reactjs-components-learning-the-basics
 - https://scotch.io/tutorials/routing-react-apps-the-complete-guide

 ## Notes
 - this.props are owned by parents and passed to children
 - this.states is private to a component. When state is updated by this.setState(), component re-renders
 - lifecycle methods: 
  - getInitialState: called once to setup the initial state of component
  - componentDidMount: called after component is rendered for the first time
- state: 
 - don't use states to build a static version of app. state is for interactivity
 - state changes overtime and can't be computed from anything (e.g. user text, checkbox value)
 - if a state is modified by this.setState(), the class must have this.getInitialState() to set the init. value of the state
- smaller project: top-down;

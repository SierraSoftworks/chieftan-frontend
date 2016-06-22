import * as helpers from './helpers';
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const config = {
  module: {
    loaders: [
      /*
       * Typescript loader support for .ts
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       */
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        exclude: [ helpers.root('node_modules'), helpers.root('config') ],
        query: {
          tsconfig: 'tsconfig.webpack.json'
        }
      }
    ]
  },
  plugins: [
    
    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new ForkCheckerPlugin()

  ]
}

export default config;

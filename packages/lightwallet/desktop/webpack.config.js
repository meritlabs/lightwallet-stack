const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const postcssImports = require('postcss-import');

const { execSync } = require('child_process');
const {
  NoEmitOnErrorsPlugin,
  SourceMapDevToolPlugin,
  NamedModulesPlugin,
  DefinePlugin,
  EnvironmentPlugin,
  HashedModuleIdsPlugin,
} = require('webpack');
const {
  NamedLazyChunksWebpackPlugin,
  SuppressExtractedTextChunksWebpackPlugin,
  CleanCssWebpackPlugin,
  BundleBudgetPlugin,
  BaseHrefWebpackPlugin,
  PostcssCliResources,
} = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin, ModuleConcatenationPlugin } = require('webpack').optimize;
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const { PurifyPlugin } = require('@angular-devkit/build-optimizer');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const {
  compilerOptions: { paths },
} = require('./tsconfig');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];
const baseHref = '';
const deployUrl = '';
const projectRoot = process.cwd();
const maximumInlineSize = 10;
const staging = process.env.LW_STAGING;

const postcssPlugins = isProduction => {
  return function(loader) {
    return [
      postcssImports({
        resolve: (url, context) => {
          return new Promise((resolve, reject) => {
            let hadTilde = false;
            if (url && url.startsWith('~')) {
              url = url.substr(1);
              hadTilde = true;
            }
            loader.resolve(context, (hadTilde ? '' : './') + url, (err, result) => {
              if (err) {
                if (hadTilde) {
                  reject(err);
                  return;
                }
                loader.resolve(context, url, (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                });
              } else {
                resolve(result);
              }
            });
          });
        },
        load: filename => {
          return new Promise((resolve, reject) => {
            loader.fs.readFile(filename, (err, data) => {
              if (err) {
                reject(err);
                return;
              }
              const content = data.toString();
              resolve(content);
            });
          });
        },
      }),
      postcssUrl({
        filter: ({ url }) => url.startsWith('~'),
        url: ({ url }) => {
          const fullPath = path.join(projectRoot, 'node_modules', url.substr(1));
          return path.relative(loader.context, fullPath).replace(/\\/g, '/');
        },
      }),
      postcssUrl([
        {
          // Only convert root relative URLs, which CSS-Loader won't process into require().
          filter: ({ url }) => url.startsWith('/') && !url.startsWith('//'),
          url: ({ url }) => {
            if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
              // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
              return `${deployUrl.replace(/\/$/, '')}${url}`;
            } else if (baseHref.match(/:\/\//)) {
              // If baseHref contains a scheme, include it as is.
              return baseHref.replace(/\/$/, '') + `/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
            } else {
              // Join together base-href, deploy-url and the original URL.
              // Also dedupe multiple slashes into single ones.
              return `/${baseHref}/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
            }
          },
        },
        {
          // TODO: inline .cur if not supporting IE (use browserslist to check)
          filter: asset => {
            return maximumInlineSize > 0 && !asset.hash && !asset.absolutePath.endsWith('.cur');
          },
          url: 'inline',
          // NOTE: maxSize is in KB
          maxSize: maximumInlineSize,
          fallback: 'rebase',
        },
        { url: 'rebase' },
      ]),
      PostcssCliResources({
        deployUrl: loader.loaders[loader.loaderIndex].options.ident == 'extracted' ? '' : deployUrl,
        loader,
        filename: `[name]${getHashFormat(isProduction).file}.[ext]`,
      }),
      autoprefixer({ grid: true }),
    ];
  };
};

function getEnvPath(production) {
  let env = staging ? 'staging' : production ? 'prod' : 'dev';
  return '../common/environments/environment.' + env + '.ts';
}

function getAliases(production) {
  return {
    '@app/env': path.resolve(__dirname, getEnvPath(production)),
  };
}

function getHashFormat(production) {
  return production
    ? {
        chunk: '.[chunkhash:20]',
        extract: '.[contenthash:20]',
        file: '.[hash:20]',
        script: '.[hash:20]',
      }
    : { chunk: '', extract: '', file: '.[hash:20]', script: '' };
}

function isProduction(config) {
  return config.env && config.env.production === true;
}

function getDevRules() {
  return [
    {
      test: /\.html$/,
      loader: 'raw-loader',
    },
    {
      test: /\.(eot|svg|cur)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[hash:20].[ext]',
        limit: 10000,
      },
    },
    {
      test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
      loader: 'url-loader',
      options: {
        name: '[name].[hash:20].[ext]',
        limit: 10000,
      },
    },
    {
      exclude: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.css$/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'embedded',
            plugins: postcssPlugins(false),
            sourceMap: true,
          },
        },
      ],
    },
    {
      exclude: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.scss$|\.sass$/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'embedded',
            plugins: postcssPlugins(false),
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            precision: 8,
            includePaths: [],
          },
        },
      ],
    },
    {
      include: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'raw-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'embedded',
            plugins: postcssPlugins(false),
            sourceMap: true,
          },
        },
      ],
    },
    {
      include: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.scss$|\.sass$/,
      use: [
        'style-loader',
        {
          loader: 'raw-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'embedded',
            plugins: postcssPlugins(false),
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            precision: 8,
            includePaths: [],
          },
        },
      ],
    },
    {
      test: /\.ts$/,
      loader: '@ngtools/webpack',
    },
  ];
}

function getProdRules() {
  return [
    {
      test: /\.html$/,
      loader: 'raw-loader',
    },
    {
      test: /\.(eot|svg|cur)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[hash:20].[ext]',
        limit: 10000,
      },
    },
    {
      test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
      loader: 'url-loader',
      options: {
        name: '[name].[hash:20].[ext]',
        limit: 10000,
      },
    },
    {
      test: /\.js$/,
      use: [
        {
          loader: 'cache-loader',
          options: {
            cacheDirectory: path.join(process.cwd(), '/node_modules/@angular-devkit/build-optimizer/src/.cache'),
          },
        },
        {
          loader: '@angular-devkit/build-optimizer/webpack-loader',
          options: {
            sourceMap: false,
          },
        },
      ],
    },
    {
      exclude: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.css$/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'embedded',
            plugins: postcssPlugins(true),
            sourceMap: false,
          },
        },
      ],
    },
    {
      exclude: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.scss$|\.sass$/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'embedded',
            plugins: postcssPlugins(true),
            sourceMap: false,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
            precision: 8,
            includePaths: [],
          },
        },
      ],
    },
    {
      include: [path.join(process.cwd(), 'src/styles.sass')],
      test: /\.scss$|\.sass$/,
      loaders: ExtractTextPlugin.extract({
        use: [
          {
            loader: 'raw-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'extracted',
              plugins: postcssPlugins(true),
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              precision: 8,
              includePaths: [],
            },
          },
        ],
        publicPath: '',
      }),
    },
    {
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      use: [
        {
          loader: '@angular-devkit/build-optimizer/webpack-loader',
          options: {
            sourceMap: false,
          },
        },
        '@ngtools/webpack',
      ],
    },
  ];
}

module.exports = (_, config) => {
  const newConfig = {
    resolve: {
      extensions: ['.ts', '.js'],
      symlinks: true,
      modules: ['./src', './node_modules'],
      alias: {
        ...rxPaths(),
        ...getAliases(isProduction(config)),
      },
      mainFields: ['browser', 'module', 'main'],
    },
    resolveLoader: {
      modules: ['./node_modules'],
      alias: {
        ...rxPaths(),
        ...getAliases(isProduction(config)),
      },
    },
    entry: {
      main: ['./src/main.ts'],
      polyfills: ['./src/polyfills.ts'],
      styles: ['./src/styles.sass'],
    },
    output: {
      path: path.join(process.cwd(), 'dist'),
      filename: '[name]' + (isProduction(config) ? '.[chunkhash:20]' : '') + '.bundle.js',
      chunkFilename: '[id]' + (isProduction(config) ? '.[chunkhash:20]' : '') + '.chunk.js',
      crossOriginLoading: false,
    },
    module: {
      rules: isProduction(config) ? getProdRules() : getDevRules(),
    },
    plugins: [
      new DefinePlugin({
        WEBPACK_CONFIG: {
          COMMIT_HASH: JSON.stringify(
            execSync('git rev-parse --short HEAD')
              .toString()
              .trim(),
          ),
          VERSION: JSON.stringify(require('./package.json').version),
        },
      }),
      new NoEmitOnErrorsPlugin(),
      new CopyWebpackPlugin(
        [
          {
            context: 'src',
            to: '',
            from: {
              glob: 'assets/**/*',
              dot: true,
            },
          },
          {
            context: 'src',
            to: '',
            from: {
              glob: 'favicon.ico',
              dot: true,
            },
          },
          {
            context: 'src',
            to: '',
            from: {
              glob: 'firebase-messaging-sw.js',
              dot: true,
            },
          },
          {
            context: 'src',
            to: '',
            from: {
              glob: 'manifest.json',
              dot: true,
            },
          },
        ],
        {
          ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'],
          debug: 'warning',
        },
      ),
      new ProgressPlugin(),
      // new CircularDependencyPlugin({
      //   exclude: /(\\|\/)node_modules(\\|\/)/,
      //   failOnError: false,
      //   onDetected: false,
      //   cwd: projectRoot
      // }),
      new NamedLazyChunksWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: isProduction(config)
          ? {
              caseSensitive: true,
              collapseWhitespace: true,
              keepClosingSlash: true,
            }
          : false,
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        title: 'Merit Lightwallet',
        xhtml: true,
        chunksSortMode: function sort(left, right) {
          let leftIndex = entryPoints.indexOf(left.names[0]);
          let rightIndex = entryPoints.indexOf(right.names[0]);
          if (leftIndex > rightIndex) {
            return 1;
          } else if (leftIndex < rightIndex) {
            return -1;
          } else {
            return 0;
          }
        },
      }),
      new BaseHrefWebpackPlugin({}),
      new CommonsChunkPlugin({
        name: ['inline'],
        minChunks: null,
      }),
      new CommonsChunkPlugin({
        name: ['vendor'],
        minChunks: module => {
          return (
            module.resource &&
            (module.resource.startsWith(nodeModules) ||
              module.resource.startsWith(genDirNodeModules) ||
              module.resource.startsWith(realNodeModules))
          );
        },
        chunks: ['main'],
      }),
      new CommonsChunkPlugin({
        name: ['main'],
        minChunks: 2,
        async: 'common',
      }),
      new NamedModulesPlugin({}),
      new AngularCompilerPlugin({
        mainPath: 'main.ts',
        platform: 0,
        sourceMap: !isProduction(config),
        tsConfigPath: 'src/tsconfig.app.json',
        skipCodeGeneration: !isProduction(config),
        compilerOptions: {
          paths: {
            ...paths,
            '@app/env': [getEnvPath(isProduction(config))],
          },
          sourceMap: !isProduction(config),
        },
      }),
    ],
    node: {
      fs: 'empty',
      global: true,
      crypto: true,
      tls: 'empty',
      net: 'empty',
      process: true,
    },
    devServer: {
      historyApiFallback: true,
    },
  };

  if (isProduction(config)) {
    newConfig.plugins.push(
      new ExtractTextPlugin({
        filename: '[name].[contenthash:20].bundle.css',
      }),
      new SuppressExtractedTextChunksWebpackPlugin(),
      new CleanCssWebpackPlugin(),
      new EnvironmentPlugin({
        NODE_ENV: 'production',
      }),
      new HashedModuleIdsPlugin({
        hashFunction: 'md5',
        hashDigest: 'base64',
        hashDigestLength: 4,
      }),
      new ModuleConcatenationPlugin({}),
      new BundleBudgetPlugin({}),
      new LicenseWebpackPlugin({
        licenseFilenames: ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'license.md', 'license.txt'],
        perChunkOutput: false,
        outputTemplate: path.join(process.cwd(), 'node_modules/license-webpack-plugin/output.template.ejs'),
        outputFilename: '3rdpartylicenses.txt',
        suppressErrors: true,
        includePackagesWithoutLicense: false,
        abortOnUnacceptableLicense: false,
        addBanner: false,
        bannerTemplate: '/*! 3rd party license information is available at <%- filename %> */',
        includedChunks: [],
        excludedChunks: [],
        additionalPackages: [],
        modulesDirectories: ['node_modules'],
        pattern: /^(MIT|ISC|BSD.*)$/,
      }),
      new PurifyPlugin(),
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
        sourceMap: false,
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            ascii_only: true,
            comments: false,
            webkit: true,
          },
          ecma: 5,
          warnings: false,
          ie8: false,
          mangle: {
            safari10: true,
          },
          compress: {
            typeofs: false,
            inline: 3,
            pure_getters: true,
            passes: 3,
          },
        },
      }),
    );
  } else {
    newConfig.plugins.push(
      new SourceMapDevToolPlugin({
        filename: '[file].map[query]',
        moduleFilenameTemplate: '[resource-path]',
        fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
        sourceRoot: 'webpack:///',
      }),
    );
  }

  return newConfig;
};

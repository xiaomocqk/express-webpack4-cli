const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 校验输入是否合法
const { projectName, projectPath} = require('./tools/legality-checkout').checkoutInput();

process.env.PROJECT_NAME = projectName;

const {
  prefix,
  outputPath,
  isDev,
  cdn,
  dev_,
} = require('./config/base.config');

let resolve = (...dir) => path.resolve(__dirname, ...dir);

const projectOutputName = prefix + projectName;
const projectOutputPath = resolve(outputPath, projectOutputName);
const publicPath = `${cdn}/${projectOutputName}/`;
const { entry, htmlPlugins } = readFiles();

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : 'none',
  entry: entry,
  output: {
    path: projectOutputPath,
    publicPath,
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',// chunkhash不能稳住hash, contenthash可以
  },
  module: {
    rules: webpackRules()
  },

  plugins: [
    ...envPlugins(),
    ...htmlPlugins,
    
    // 针对 moment.js 打包体积过大问题
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    // new webpack.HashedModuleIdsPlugin(), // webpack4 应该默认添加了
  ],
  optimization: optimizationSettings(),
  resolve: {
    extensions: ['.js', '.vue', '.less', 'scss', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.js',
      '@': projectPath,
    }
  },
  performance: {
    hints: isDev ? false : 'warning' // 当打包的文件大于 244 KiB 是会在提出警告
  }
};

// 获取人口文件和对应的html
function readFiles() {
  const jsDir = resolve(projectPath, 'js');
  const htmlDir = resolve(projectPath, 'views');
  const entry = {};
  const htmlPlugins = [];

  fs.readdirSync(jsDir).forEach(file => {
    const filename = file.match(/(.+)\.js$/)[1];
    const htmlname = `${filename}.html`;
    const htmlTemplate = resolve(htmlDir, htmlname);

    entry[filename] = [
      resolve(jsDir, file),
      ...(isDev ? [htmlTemplate, 'webpack-hot-middleware/client?reload=true'] : [])
    ];

    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: htmlTemplate,
        filename: htmlname,
        chunks: ['vendor', filename],
      })
    );
  });

  return { entry, htmlPlugins };
}

// 多文件拆包, 单文件不拆包
function optimizationSettings() {
  return {
    splitChunks: {
      cacheGroups: {
        // 多文件拆包, 单文件不拆包(含js|css)
        ...(htmlPlugins.length > 1 ?
        {
          vendor: {
            name: 'vendor', // 与 output.filename 一致, 即为 'vendor.[chunckhash:8].js'
            chunks: 'initial',// 如果代码中有异步组件时, 若设置为 'all' 会因找不到模块而报错
            test: /node_modules/,
            enforce: true
          },
          // 提取公用的css, 前提文件名必须是 (reset|common).(le|c|sc|sa)ss
          common: {
            name: 'vendor',
            chunks: 'all',
            test: /[/\\](reset|common)\.(le|c|sc|sa)ss$/,
            enforce: true
          },
        } : {}),
      }
    },
    ...(isDev ? {} : {
      minimize: true,
      minimizer: [
        new OptimizeCSSAssetsPlugin(),// 压缩 css 文件
        new UglifyJsPlugin({
          test: /\.js$/,
          exclude: /node_modules/,
          cache: resolve(projectOutputPath, '..', '.cache'),
          parallel: true,// 并行打包
          uglifyOptions: {
            compress: {
              drop_console: true // 去掉所有console.*
            }
          }
        }),
      ]
    })
  };
}

// 插件
function envPlugins(){
  return isDev ? 
    [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    ]
      :
    [
      new CleanWebpackPlugin([
        projectOutputPath,
        resolve(projectOutputPath, `../${dev_}*`)
      ]),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[id].[contenthash:8].css'
      }),
    ]
  ;
}

function webpackRules() {
  return [
    {
      test: /\.js|vue$/,
      enforce: 'pre',
      use: 'eslint-loader',
      exclude: /node_modules/
    },
    {
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules[/\\][^dom7]/
      // include: [
      //   resolve(projectPath),
      //   /dom7\.modular\.js$/
      // ]
    },
    {
      test: /\.html$/,
      use: {
        loader: 'html-loader',
        options: {
          minimize: !isDev,
          removeAttributeQuotes: false,
        }
      }
    },
    {
      test: /\.(le|c)ss$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'less-loader'
      ]
    },
    {
      test: /\.scss$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: isDev ? 'images/[name].[ext]' : 'images/[hash:8].[ext]'
        }
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: isDev ? 'media/[name].[ext]' : 'media/[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: isDev ? 'fonts/[name].[ext]' : 'fonts/[name].[hash:8].[ext]'
      }
    }
  ];
}
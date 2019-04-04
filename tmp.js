module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config
    // console.log(options, config);
    // const entry = process.env.BACKPACK_ENTRY || 'index'
    // delete config.entry.main;
    // console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
    // config.entry[entry] = [
    //   entries[entry],
    // ]
    config.optimization = {
      // We no not want to minimize our code.
      namedModules: true,
      minimize: false,
      resolve: {
        alias: {
          './build/Release/scrypt': path.resolve(__dirname, 'src/utilities/')
        }
      },
    }
    // config.output.filename = entry+'.js';
    return config;
  },
};

module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Use Babel to transform JS/JSX
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/",  // Ensure Axios is transpiled (in case it uses ES modules)
      "/node_modules/(?!react-leaflet|leaflet)/" //tells Jest to not ignore react-leaflet
    ],
    testEnvironment: 'jsdom', // Necessary for React components that rely on DOM
  };
  
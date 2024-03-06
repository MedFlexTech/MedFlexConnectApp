module.exports = {
  root: true,
  extends: ['@react-native'], // Keep your React Native extension
  rules: {
    'endOfLine': 'lf', // Enforce LF line endings (adjust to 'crlf' if needed)
    'no-control-regex': 'error' // Catch carriage return characters
  }
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  moduleNameMapper: {
    "^@components/(.*)$": "./src/components/$1",
    "^@redux/(.*)$": "./src/redux/$1",
    "^@api/(.*)$": "./src/api/$1",
    "^@assets/(.*)$": ".src/assets/$1",
    "^@types/(.*)$": "./src/types/$1",
    "^@styles/(.*)$": "./src/$1",
    "^@utils/(.*)$": "./src/utils/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

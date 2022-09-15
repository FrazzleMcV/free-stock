let envVariables = {};

const Environment = {
  get: jest.fn((key) => {
    const value = envVariables[key];
    return value || `some-env-for-${key}`;
  }),
  mockEnv: (key, value) => (envVariables[key] = value),
  mockEnvs: (obj) => (envVariables = Object.assign({}, envVariables, obj)),
  mockReset: () => (envVariables = {}),
};

module.exports = Environment;

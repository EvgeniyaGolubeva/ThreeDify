const axiosMock = {
  get: vi.fn(() => Promise.resolve({ data: { user: null } })),
  post: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
  },
};

vi.mock("axios", () => ({
  default: {
    create: () => axiosMock,
  },
}));

globalThis.__axiosMock = axiosMock;

import '@testing-library/jest-dom';

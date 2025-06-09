import { render, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import userEvent from "@testing-library/user-event";
import React from "react";

// Тестов компонент, който използва useAuth()
function TestComponent() {
  const { login, logout, register, user, token } = useAuth();

  return (
    <div>
      <button onClick={() => login("test@example.com", "pass")}>Login</button>
      <button onClick={() => register("new@example.com", "1234")}>Register</button>
      <button onClick={logout}>Logout</button>
      <div data-testid="token">{token}</div>
      <div data-testid="user">{user?.email || "none"}</div>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it("login sets token and user", async () => {
    globalThis.__axiosMock.post.mockResolvedValueOnce({ data: { access_token: "mocked-token" } });
    globalThis.__axiosMock.get.mockResolvedValueOnce({ data: { user: { email: "test@example.com" } } });

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    userEvent.click(getByText("Login"));

    await waitFor(() => {
      expect(getByTestId("token").textContent).toBe("mocked-token");
      expect(getByTestId("user").textContent).toBe("test@example.com");
    });
  });

  it("logout clears token and user", async () => {
    localStorage.setItem("token", "token123");

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    userEvent.click(getByText("Logout"));

    await waitFor(() => {
      expect(getByTestId("token").textContent).toBe("");
      expect(getByTestId("user").textContent).toBe("none");
      expect(localStorage.getItem("token")).toBe(null);
    });
  });

  it("register calls login after success", async () => {
    globalThis.__axiosMock.post.mockResolvedValueOnce({}); // register
    globalThis.__axiosMock.post.mockResolvedValueOnce({ data: { access_token: "token-from-login" } }); // login
    globalThis.__axiosMock.get.mockResolvedValueOnce({ data: { user: { email: "new@example.com" } } }); // /me

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    userEvent.click(getByText("Register"));

    await waitFor(() => {
      expect(getByTestId("token").textContent).toBe("token-from-login");
      expect(getByTestId("user").textContent).toBe("new@example.com");
    });
  });

  it("loads user from localStorage on mount", async () => {
    localStorage.setItem("token", "saved-token");
    globalThis.__axiosMock.get.mockResolvedValueOnce({ data: { user: { email: "saved@example.com" } } });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId("token").textContent).toBe("saved-token");
      expect(getByTestId("user").textContent).toBe("saved@example.com");
    });
  });
});

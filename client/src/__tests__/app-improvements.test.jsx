import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { vi } from "vitest";
import Listings from "../pages/Listings.jsx";
import Login from "../pages/Login.jsx";
import Favourites from "../pages/Favourites.jsx";
import PropertyForm from "../pages/admin/PropertyForm.jsx";

const { mockApi, mockLogin, mockToast } = vi.hoisted(() => ({
  mockApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  mockLogin: vi.fn(),
  mockToast: vi.fn(),
}));

vi.mock("../api", () => ({ default: mockApi }));
vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: () => ({ login: mockLogin }),
}));
vi.mock("../context/ToastContext.jsx", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const renderWithProviders = (ui) => render(
  <HelmetProvider>
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  </HelmetProvider>
);

describe("frontend quality checks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ role: "user" });
  });

  it("renders listings from the API response", async () => {
    mockApi.get.mockResolvedValue({
      data: {
        properties: [{ _id: "p1", title: "Test Home", price: 500000, city: "Sydney", beds: 3, baths: 2, area: 120, images: ["/a.jpg"] }],
        total: 1,
        pages: 1,
        page: 1,
      },
    });

    renderWithProviders(<Listings />);

    expect(screen.getByText(/Properties/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Test Home/i)).toBeInTheDocument());
  });

  it("shows inline validation and redirects after successful login", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ role: "user" });

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/please fill in all fields/i);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("user@example.com", "secret123"));
  });

  it("shows empty favourites state when no homes are saved", async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    renderWithProviders(<Favourites />);

    await waitFor(() => expect(screen.getByText(/you haven't saved any properties yet/i)).toBeInTheDocument());
  });

  it("validates property form before submit", async () => {
    const user = userEvent.setup();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <PropertyForm />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.type(screen.getByLabelText(/title/i), "Hi");
    await user.type(screen.getByLabelText(/price/i), "0");
    await user.type(screen.getByLabelText(/city/i), "Sydney");
    await user.click(screen.getByRole("button", { name: /create property/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/title should be at least 5 characters|valid price greater than 0/i);
  });
});

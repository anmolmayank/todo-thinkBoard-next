/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Mocks
jest.mock("axios");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedToast = toast as jest.Mocked<typeof toast>;
const mockRouter = { replace: jest.fn(), push: jest.fn() };

describe("DashboardPage", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  //   test("renders loading state initially", async () => {
  //     mockedAxios.get.mockResolvedValueOnce({ data: [] });
  //     render(<DashboardPage />);
  //     expect(
  //       screen.getByText("Checking authentication...")
  //     ).toBeInTheDocument();
  //   });

  test("fetches todos on mount and displays them", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { _id: "1", title: "Test Todo", description: "Desc", completed: false },
      ],
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });
  });

  test("shows message when no todos exist", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("No todos yet — add one!")).toBeInTheDocument();
    });
  });

  test("adds a new todo successfully", async () => {
    // 1️⃣ First call — initial fetch
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    // 2️⃣ POST — add new todo
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        _id: "2",
        title: "New Todo",
        description: "Something",
        completed: false,
      },
    });

    render(<DashboardPage />);

    const titleInput = await screen.findByPlaceholderText("Todo title");
    const descInput = screen.getByPlaceholderText("Description (optional)");
    const addButton = screen.getByRole("button", { name: /Add Todo/i });

    fireEvent.change(titleInput, { target: { value: "New Todo" } });
    fireEvent.change(descInput, { target: { value: "Something" } });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/todos", {
        title: "New Todo",
        description: "Something",
      });
      expect(mockedToast.success).toHaveBeenCalledWith("Todo added!");
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
  });

  test("toggles todo completion state", async () => {
    const todos = [
      { _id: "1", title: "Task", description: "", completed: false },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: todos });
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    render(<DashboardPage />);

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith("/api/todos/1", {
        completed: true,
      });
    });
  });

  test("deletes todo successfully", async () => {
    const todos = [
      { _id: "1", title: "Delete Me", description: "", completed: false },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: todos });
    mockedAxios.delete.mockResolvedValueOnce({ status: 200 });

    render(<DashboardPage />);

    const deleteButton = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith("/api/todos/1");
      expect(mockedToast.success).toHaveBeenCalledWith("Todo deleted");
    });
  });

  test("redirects to login if not authenticated", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Unauthorized"));
    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/login");
    });
  });
});

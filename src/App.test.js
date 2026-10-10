import { fireEvent, render, screen } from "@testing-library/react";
import App, { gameFromSearch } from "./App";

jest.mock("./components/Pistas/Pistas", () => () => <div>Pistas view</div>);
jest.mock("./components/Admin/Admin", () => () => <div>Admin view</div>);
jest.mock("./components/RouteMap/RouteMap", () => () => <div>Map view</div>);
jest.mock("./components/Registro/Registro", () => () => (
  <div>Registro de Equipo</div>
));
jest.mock("./components/ResetPopup/ResetPopup", () => () => null);
jest.mock("./components/NavigationMenu/NavigationMenu", () => () => null);
jest.mock(
  "./components/MultiplicationGame/MultiplicationGame",
  () => () => <div>Multiplication game</div>
);
jest.mock("./components/DivisionGame/DivisionGame", () => () => <div>Division game</div>);

afterEach(() => {
  window.history.pushState({}, "", "/");
});

test("opens a game from the selector and keeps direct links", () => {
  window.history.pushState({}, "", "/");
  render(<App />);
  expect(screen.getByRole("button", { name: "Multiplication" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Division" })).toBeInTheDocument();
  expect(screen.queryByText("Multiplication game")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Division" }));
  expect(screen.getByText("Division game")).toBeInTheDocument();
});

test("opens multiplication from its direct links", () => {
  window.history.pushState({}, "", "/?game=multiplication");
  render(<App />);
  expect(screen.getByText("Multiplication game")).toBeInTheDocument();
});

test("keeps a times-table link on the multiplication game", () => {
  window.history.pushState({}, "", "/?table=7");
  render(<App />);
  expect(screen.getByText("Multiplication game")).toBeInTheDocument();
});

test("chooses a route from the query string", () => {
  expect(gameFromSearch("")).toBe("select");
  expect(gameFromSearch("?game=division")).toBe("division");
  expect(gameFromSearch("?tabla=4")).toBe("multiplication");
  expect(gameFromSearch("?pistas=gs145ka")).toBe("hunt");
});

test("renders the hunt when the pistas query is present", async () => {
  window.history.pushState({}, "", "/?pistas=gs145ka");
  render(<App />);
  expect(await screen.findByText(/Registro de Equipo/i)).toBeInTheDocument();
});

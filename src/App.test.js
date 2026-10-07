import { render, screen } from "@testing-library/react";
import App from "./App";

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

afterEach(() => {
  window.history.pushState({}, "", "/");
});

test("renders the multiplication game when the pistas query is missing", () => {
  window.history.pushState({}, "", "/");
  render(<App />);
  expect(screen.getByText("Multiplication game")).toBeInTheDocument();
});

test("renders the hunt when the pistas query is present", async () => {
  window.history.pushState({}, "", "/?pistas=gs145ka");
  render(<App />);
  expect(await screen.findByText(/Registro de Equipo/i)).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import Hello from "./Hello";

it("should ", function () {
  render(<Hello />);
  const dom1 = screen.getByText("Hello world");
  expect(dom1).toBeInTheDocument();
});

import {render, screen, waitFor, cleanup} from "@testing-library/react";
import Navbar from "../../components/navbar";
import {Wrapper} from "../../tests.shared";

describe("<Navbar />", () => {
    beforeEach(cleanup);

    it("renders Mood Sensor link", async () => {
        render(<Navbar />, {wrapper: Wrapper})
        await waitFor(() => expect(screen.getByText(/Mood Sensor/i)).toBeInTheDocument())
    })

    it("renders Analytics link", async () => {
        render(<Navbar />, {wrapper: Wrapper})
        await waitFor(() => expect(screen.getByText(/Analytics/i)).toBeInTheDocument())
    })
})

import {render, screen} from "@testing-library/react"
import Home from "../pages"
import {Wrapper} from "../tests.shared"

describe("<Home />", () => {
    it("renders Moods typehead component", () => {
        render(<Home/>, {wrapper: Wrapper})
        expect(screen.getByText("Moods")).toBeInTheDocument()
    })

    it('renders Locations typehead component', () => {
        render(<Home/>, {wrapper: Wrapper})
        expect(screen.getByText("Locations")).toBeInTheDocument()
    })
})

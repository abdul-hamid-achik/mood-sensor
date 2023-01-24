import {render, screen, waitFor} from "@testing-library/react"
import {Wrapper} from "../../tests.shared"
import Typehead from "../../components/typehead";
import UserEvent from "@testing-library/user-event";

describe("<Typehead />", () => {
    it("renders a search input", async () => {
        render(<Typehead label={"Locations"} searchCallback={jest.fn()}/>, {wrapper: Wrapper})
        await waitFor(() => expect(screen.getByLabelText(/Locations/i)).toBeInTheDocument())
    })

    it("renders a search button", async () => {
        render(<Typehead label={"Locations"} searchCallback={jest.fn()}/>, {wrapper: Wrapper})
        await waitFor(() => expect(screen.getByRole('button', {name: /Search/i})).toBeInTheDocument())
    })

    it('renders a list of matches when search button is clicked', async () => {
        const searchCallback = jest.fn().mockResolvedValue( [{name: 'test'}])
        render(<Typehead label={"Locations"} searchCallback={searchCallback}/>, {wrapper: Wrapper})
        const searchButton = await screen.findByRole('button', {name: /Search/i})
        await waitFor(() => expect(searchButton).toBeInTheDocument())
        await waitFor(() => UserEvent.click(searchButton))
        await waitFor(() => expect(screen.getByText(/test/i)).toBeInTheDocument())
    })
})

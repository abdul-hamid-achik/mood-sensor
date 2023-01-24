import {cleanup, render, screen, waitFor, fireEvent} from "@testing-library/react";
import Tags from "../../components/tags";
import {Wrapper} from "../../tests.shared";

describe("<Tags />", () => {
    beforeEach(cleanup);

    it("renders a list of tags", async () => {
        const tags = [{
            id: 1,
            name: 'happy'
        }]
        render(<Tags tags={tags} handleRemove={jest.fn()}/>, {wrapper: Wrapper})
        await waitFor(() => expect(screen.getByText(/happy.../i)).toBeInTheDocument())
    })

    it("calls handleRemove on click", async () => {
        const tags = [{
            id: 1,
            name: 'happy'
        }]
        const handleRemove = jest.fn()
        render(<Tags tags={tags} handleRemove={handleRemove}/>, {wrapper: Wrapper})
        fireEvent.click(screen.getByText(/Remove happy/i))
        expect(handleRemove).toHaveBeenCalledWith(tags[0])
    })
})

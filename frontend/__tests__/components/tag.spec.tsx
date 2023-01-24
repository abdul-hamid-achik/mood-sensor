import {render, screen, waitFor, cleanup} from "@testing-library/react";
import Tag from "../../components/tag";
import {Wrapper} from "../../tests.shared";

describe("<Tag />", () => {
    beforeEach(cleanup);

    it("renders label in a tag", async () => {
        const label = 'happy'
        render(<Tag label={label} />, {wrapper: Wrapper})
        await waitFor(() => expect(screen.getByText(/happy/i)).toBeInTheDocument())
    })
})

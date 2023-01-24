import {render, screen, waitFor, cleanup} from "@testing-library/react";
import * as nextAuthReact from "next-auth/react";
import Header from "../../components/header";
import {Wrapper} from "../../tests.shared";

describe("<Navbar />", () => {
    beforeEach(cleanup);

    it("renders correctly", async () => {
        const useSessionSpy = jest.spyOn(nextAuthReact, 'useSession').mockReturnValue({
            // @ts-ignore
            data: {status: 'unauthenticated'}
        });
        render(<Header />, {wrapper: Wrapper})
        expect(useSessionSpy).toHaveBeenCalled()
        await waitFor(() => expect(screen.getByTestId(/header/i)).toBeInTheDocument())
    })
})

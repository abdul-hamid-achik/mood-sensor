import {render, screen, waitFor, cleanup} from "@testing-library/react";
import * as nextAuthReact from "next-auth/react";
import CustomMap from "../../components/custom_map";
import {Wrapper} from "../../tests.shared";

describe.skip("NOTE: not working currently <CustomMap />", () => {
    beforeEach(cleanup);

    it("renders correctly", async () => {
        const useSessionSpy = jest.spyOn(nextAuthReact, 'useSession').mockReturnValue({
            // @ts-ignore
            data: {status: 'unauthenticated'}
        });

        render(<CustomMap />, {wrapper: Wrapper})
        expect(useSessionSpy).toHaveBeenCalled()
        await waitFor(() => expect(screen.getByTestId(/custom-map/i)).toBeInTheDocument())
    })
})

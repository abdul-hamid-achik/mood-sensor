import {cleanup, render, screen, waitFor} from "@testing-library/react";
import Analytics from "../../pages/analytics";
import {Wrapper} from "../../tests.shared";
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import * as nextAuthReact from "next-auth/react";

process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8080'

const server = setupServer(
    rest.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mood-sense/mood_captures/frequency/`, (req, res, ctx) => {
        return res(
            ctx.json([
                {mood: 'happy', count: 10},
                {mood: 'sad', count: 5},
                {mood: 'neutral', count: 8},
            ])
        );
    })
);


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
describe("<Analytics />", () => {
    beforeEach(cleanup);

    it("renders frequency mood bar chart", async () => {
        const useSessionSpy = jest.spyOn(nextAuthReact, 'useSession').mockReturnValue({
            data: {
                user: {
                    // @ts-ignore
                    username: 'user',
                    email: 'user@example.com'
                }, status: 'authenticated', access: '<ACCESS_TOKEN>'
            }
        });
        render(<Analytics/>, {wrapper: Wrapper})
        expect(useSessionSpy).toHaveBeenCalled()
        await waitFor(() => expect(screen.getByTestId("frequency-mood-bar-chart")).toBeInTheDocument())
    })

    it("renders a message saying that you must be authenticated to view this page", async () => {
        const useSessionSpy = jest.spyOn(nextAuthReact, 'useSession').mockReturnValue({
            // @ts-ignore
            data: {status: 'unauthenticated'}
        });
        render(<Analytics/>, {wrapper: Wrapper})
        expect(useSessionSpy).toHaveBeenCalled()
        await waitFor(() => expect(screen.getByText("You need to be logged in to view this page")).toBeInTheDocument())
    })
})

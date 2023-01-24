import {render, screen} from "@testing-library/react"
import Home from "../../pages"
import {Wrapper} from "../../tests.shared"
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import * as nextAuthReact from "next-auth/react";

process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8080'


const server = setupServer(
    rest.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mood-sense/locations/`, (req, res, ctx) => {
        return res(
            ctx.json({
                results: [
                    {name: 'home'},
                ]
            })
        );
    })
);


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("<MoodSensor />", () => {
    const useSessionSpy = jest.spyOn(nextAuthReact, 'useSession').mockReturnValue({
        // @ts-ignore
        data: {status: 'authenticated', user: {username: 'test', email: 'email@email.com'}, access: 'access'},
    });

    afterEach(() => {
        expect(useSessionSpy).toHaveBeenCalled()
    })

    it("renders Moods typehead component", () => {
        render(<Home/>, {wrapper: Wrapper})
        expect(screen.getByText("Moods")).toBeInTheDocument()
    })

    it('renders Locations typehead component', () => {
        render(<Home/>, {wrapper: Wrapper})
        expect(screen.getByText("Locations")).toBeInTheDocument()
    })
})

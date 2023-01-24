import UserInfo from "./user_info";
import Navbar from "./navbar";
export default function Header() {
    return <div data-testid="header">
        <Navbar/>
        <UserInfo/>
    </div>
}
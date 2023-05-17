import SideBar from "../../Components/SideBar/SideBar";
import Chat from "../../Components/Chat/Chat";

import "./HomePage.scss";

function HomePage() {
  return (
    <div className="home_page">
      <SideBar />
      <Chat />
    </div>
  );
}

export default HomePage;

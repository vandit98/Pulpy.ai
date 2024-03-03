import Profile from "./Profile";
import "../css/Home.css";
import Login from "./Login";
import { SignedIn, SignedOut } from "@clerk/chrome-extension";
import Chat from "../components/Chat";
import { useNavbar } from "../context/NavbarContext";
import { useColor } from "../context/ColorContext";

interface HomeProps {
  tabId: string;
  isVideoReady: boolean;
  error: string;
}

const Home: React.FC<HomeProps> = ({ tabId, isVideoReady, error }) => {
  const { isChat } = useNavbar();
  const { color } = useColor();

  return (
    <div className="home-section">
      {isChat ? (
        <>
          <SignedOut>
            <Login />
          </SignedOut>
          <SignedIn>
            {error ? (
              <div className="loading-section">
                <button style={{ backgroundColor: color }}>{error}</button>
              </div>
            ) : (
              <>
                {isVideoReady ? (
                  <Chat tabId={tabId} />
                ) : (
                  <div className="loading-section">
                    <button style={{ backgroundColor: color }}>
                      Video In Progress....
                    </button>
                  </div>
                )}
              </>
            )}
          </SignedIn>
        </>
      ) : (
        <Profile />
      )}
    </div>
  );
};

export default Home;

import Navbar from './components/Navbar';
import Home from './pages/Home';
import "./css/App.css"
import { useContentHeight } from './context/ContentHeightContext';
import { useNavbar } from './context/NavbarContext';
import backgroundImage from "./assets/background.svg"
import { fetchTabUrl } from './api';
import { APIResponse } from './types';
import { useEffect, useState } from 'react';

function App() {

  const { isMinimized } = useNavbar();
  const { contentHeight } = useContentHeight();
  const [tabId,setTabId] = useState("")
  const [videoReady, setVideoReady] = useState(false)
  const [error, setError] = useState("")

  const appStyles: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(17, 17, 17, 0.9), rgba(17, 17, 17, 0.9)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    borderRadius: '12px',
    transition: 'height 0.8s ease',
    display: 'flex',
    flexDirection: 'column',
    height: isMinimized ? '64px' : contentHeight
  };

  const make_video_ready = (youtubeId: string) => {
    return new Promise<APIResponse>((resolve) => {
      chrome.runtime.sendMessage(
        { action: "make_video_ready", youtubeId },
        (response: APIResponse | PromiseLike<APIResponse>) => {
          resolve(response);
        }
      );
    });
  };

  const fetchYoutubeTranscript = async () => {
    try {
      const response = await fetchTabUrl();
      if (response && response.tabUrl) {
        const params = new URLSearchParams(new URL(response.tabUrl).search);
        const id = params.get("v");
        if (id) {
          setTabId(() => id)
          const isVideoReady = await make_video_ready(id)
          if (isVideoReady && isVideoReady.data !== undefined) {
            setVideoReady(isVideoReady.data)
            if (!isVideoReady.data) setError("Transcript is not available for this video")
          }
        } else {
          setError("Invalid video ID")
        }
      } else {
        setError("Unable to fetch the youtube URL")
      }
    } catch (error) {
      setError("Error fetching transcript")
    }
  };

  useEffect(() => {
    fetchYoutubeTranscript()
  }, [])

  return (
    <div style={appStyles} className='app-container'>
      <Navbar />
      <div className='home-page'>
        {!isMinimized && <Home isVideoReady={videoReady} error={error} tabId={tabId} />}
      </div>
    </div>
  );
}

export default App;

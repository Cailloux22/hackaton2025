import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Group } from "./models/group";
import { GroupService } from "./services/groupService";
import { GroupServiceAPI } from "./services/groupServiceApi";

function App() {
  const [roomId, setRoomId] = useState(1);

  const [currentGroup, setCurrentGroup] = useState<Group | undefined>(undefined);
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);

  const eventService: GroupService = new GroupServiceAPI()

  const [showVideo, setShowVideo] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVideoEnd = () => {
    setShowVideo(false);

    timerRef.current = setTimeout(() => {
      setShowVideo(true);
    }, 15000);
  };

  const updateGroupsInfo = () => {
    eventService.getGroups(roomId).then((groupsApi) => {
      setGroups(groupsApi)
    }
    )
    eventService.OnNewCurrentGroup(roomId,
      (newParty) => setCurrentGroup(newParty),
    )
  }

  useEffect(() => {
    updateGroupsInfo()
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => updateGroupsInfo(), [roomId])

  return (
    <div className="bg-container">
      <img src="logo_musiquiz.png" alt="logo" className="logo" />

      <div id="toast-bottom-left" className="fixed flex items-center max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm bottom-5 left-5">
        <select id="lang" onChange={(value) => setRoomId(Number.parseInt(value.target.value))} value={roomId}>
          <option value="1">Room 1</option>
          <option value="2">Room 2</option>
        </select>
      </div>

      <div>
        <div className="mb-3">
          <h1 className="title">Partie en cours</h1>
          {
            currentGroup == undefined ? "Chargement ..." : <p>{currentGroup?.name}</p>
          }

        </div>
        <div >
          <h1 className="title2">Parties suivantes</h1>
          {
            groups == undefined ? "Chargement ..." : groups.map(group => <div className="flex justify-between"><span>{group.name}</span> <span>{group.heurePassage}</span></div>)
          }
        </div>
      </div>

      {showVideo && (
        <video className="video" autoPlay loop muted onEnded={handleVideoEnd}>
          <source src="/video.m4v" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      )}
    </div>
  );
}

export default App;

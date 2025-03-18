import { useEffect, useState } from "react";
import "./App.css";
import { Group } from "./models/group";
import { GroupService } from "./services/groupService";
import { GroupServiceAPI } from "./services/groupServiceApi";

function App() {
  const [roomId, _] = useState(parseInt(import.meta.env.VITE_ROOM_ID));

  const [currentGroup, setCurrentGroup] = useState<Group | undefined>(undefined);
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);

  const eventService: GroupService = new GroupServiceAPI()

  const updateGroupsInfo = () => {
    eventService.getGroups(roomId).then((groupsApi) => {
      setGroups(groupsApi)
    }
    )
    eventService.OnNewCurrentGroup(roomId,
      (newParty) => {
        eventService.getGroups(roomId).then((groupsApi) => {
          setGroups(groupsApi.filter(group => group.name != newParty.name))
        })

        setCurrentGroup(newParty)
      },
    )
  }

  useEffect(() => {
    updateGroupsInfo()
  }, []);

  useEffect(() => updateGroupsInfo(), [roomId])

  const getHour = () => {
    const today = new Date()
    return today.getHours() + " : " + today.getMinutes()
  }
  const [hour, setHour] = useState(getHour())

  setInterval(() => setHour(getHour()), 1000)

  return (
    <div className="bg-container">
      {/* Logo */}
      <img src="logo_musiquiz.png" alt="logo" className="absolute top-5 left-8 w-32 h-auto" />

      {/* Clock */}
      <div id="toast-bottom-left" className="fixed flex items-center max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm bottom-5 left-5">
        <h2>
          {hour}
        </h2>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-4xl px-4 gap-8">
        {/* Current group */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl uppercase mb-6 font-['Neuropol'] drop-shadow-lg">Partie en cours</h1>
          {
            currentGroup === undefined ?
              <div className="text-xl">Chargement ...</div> :
              <div className="flex justify-between text-xl drop-shadow-md">
                <span>{currentGroup.name}</span>
                <span>{currentGroup.heurePassage}</span>
              </div>
          }
        </div>

        {/* Upcoming groups */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl uppercase mb-6 font-['Neuropol'] drop-shadow-lg">Parties suivantes</h1>
          {
            groups === undefined ?
              <div className="text-xl">Chargement ...</div> :
              <div className="flex flex-col gap-2">
                {groups.map((group, index) => (
                  <div key={index} className="flex justify-between text-xl drop-shadow-md">
                    <span>{group.name}</span>
                    <span>{group.heurePassage}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Video - hidden on small screens */}
      <video className="absolute bottom-10 right-5 w-96 h-auto rounded-lg shadow-lg hiden sm:block" autoPlay loop muted>
        <source src="/video.m4v" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
}

export default App;
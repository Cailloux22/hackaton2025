from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from abc import ABC, abstractmethod
import uvicorn
from dataclasses import dataclass
from random import randint
from datetime import datetime
import xmlrpc.client, threading
from fastapi.middleware.cors import CORSMiddleware

sort_by_time = lambda groups: sorted(groups, key=lambda group: datetime.strptime(group.heurePassage, "%H:%M"))

# MODEL
class Group(BaseModel):
    name: str
    heurePassage: str
    room: int


# Repository
class GroupRepository(ABC):
    @abstractmethod
    def getGroups(self) -> List[Group]:
        pass

    @abstractmethod
    def getCurrentGroup(self) -> Group:
        pass

class GroupRepositoryInMemory(GroupRepository):
    def __init__(self, groups: List[Group]):
        super().__init__()
        self.groups = groups

    def getGroups(self) -> List[Group]:
        return self.groups

    def getCurrentGroup(self) -> Group:
        return self.groups[randint(0, len(self.groups))]
    
fakeGroups = [
    Group(name="Les Rockeurs", heurePassage="10:00", room=1),
    Group(name="Jazz Ensemble", heurePassage="11:30", room=1),
    Group(name="Symphonie Électronique", heurePassage="13:00", room=1),
    Group(name="Metal Brigade", heurePassage="14:15", room=1),
    Group(name="Pop Stars", heurePassage="15:45", room=1),
    Group(name="Harmonie Classique", heurePassage="17:00", room=2),
    Group(name="Funk Fusion", heurePassage="18:30", room=2),
    Group(name="Reggae Rebels", heurePassage="20:00", room=2),
    Group(name="Hip-Hop Collectif", heurePassage="21:30", room=2),
    Group(name="Soul Sisters", heurePassage="23:00", room=2)
]

@dataclass
class Config:
    host: str = "https://funlabrennes-teste-19048326.dev.odoo.com"
    port: int = 8069
    db: str = "funlabrennes-teste-19048326"
    user: str = "test"
    password: str = "ebfed02c7155123bfc2709e43ac94dca0e1e2572"



class GroupRepositoryOdoo(GroupRepository):
    def __init__(self, config: Config):
        super().__init__()
        self.config = config
        common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(config.host))
        self.uid = common.authenticate(config.db, config.user, config.password, {})
        self.models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(config.host))
        set_interval(self, 10)
        
    def _update_content(self):
        print("Récupération des données")
        result = self.models.execute_kw(self.config.db, self.uid, self.config.password, "calendar.event", "search_read",
            [[]],
            {
                "fields": [
                    "active", "name", "appointment_type_id", "attendee_ids",
                    "appointment_resource_ids", "start", "stop",
                    "resource_total_capacity_reserved", "resource_total_capacity_used",
                    "appointment_status"
                ],
                "limit": 120,
                "context": {
                    "lang": "fr_FR",
                    "tz": "Africa/Casablanca",
                    "uid": self.uid,
                    "allowed_company_ids": [1],
                    "bin_size": True
                }
            }
        )
        
        self.groups:List[Group] = []
        self.currentGroup = {}

        for groupDict in result:
            roomArray = groupDict["appointment_resource_ids"]
            if len(roomArray) <= 0:
                continue

            roomId = roomArray[0]

            group = Group(name=groupDict["name"].split(" - ")[0], heurePassage=self._parse_date(groupDict["start"]), room=groupDict["appointment_resource_ids"][0])
            
            self.groups.append(group)
            if groupDict["appointment_status"] == "attended":
                if str(roomId) not in self.currentGroup.keys():
                    self.currentGroup[str(roomId)] = group
                else:
                    sorted_group = sort_by_time([group, self.currentGroup[str(roomId)]])
                    self.currentGroup[str(roomId)] = sorted_group[-1]
                    self.groups.remove(sorted_group[0])

        print("Fin de récupération des données")

    def _parse_date(self, date: str) -> str:
        dateSplit = date.split(" ")[1]
        hourSplit = dateSplit.split(":")
        return f"{hourSplit[0]}:{hourSplit[1]}"

    def getGroups(self) -> List[Group]:
        return self.groups

    def getCurrentGroup(self) -> dict:
        return self.currentGroup

def set_interval(repo: GroupRepositoryOdoo, sec):
    def func_wrapper():
        set_interval(repo, sec) 
        repo._update_content()  
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

repository: GroupRepository = GroupRepositoryOdoo(Config())
#GroupRepositoryInMemory(fakeGroups)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/groups")
async def getGroups(room: int = 1) -> List[Group]:
    return [group for group in sort_by_time(repository.getGroups()) if group.room == room]

@app.get("/groups/current")
async def getCurrentGroup(room: int = 1) -> Group:
    return repository.getCurrentGroup()[str(room)]

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8080)
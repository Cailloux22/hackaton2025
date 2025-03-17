import './App.css'
import { EventService, EventSeviceStub } from './services/eventService'

function App() {
  const eventService: EventService = new EventSeviceStub()

  return (
    <>
      <div>
      </div>
    </>
  )
}

export default App

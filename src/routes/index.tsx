import '../App.css';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <>Hello, Captain. How may I assist you today?</>;
}

export default App;

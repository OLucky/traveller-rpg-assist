import { createFileRoute } from '@tanstack/react-router';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <>Hello, Captain. How may I assist you today?</>;
}

export default App;

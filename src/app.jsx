import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import ChatComponent from './chatComponent';

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Aquí se incluye el componente de Convai */}
      <div className="convai-root">
        <ChatComponent />
      </div>
    </>
  );
}

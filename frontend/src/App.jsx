import './index.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
// import About from './pages/About';
// import HealthTopics from './pages/HealthTopics';
// import AskAI from './pages/AskAi';
// import SignUp from './pages/SignUp';
// import LogIn from './pages/LogIn';

function App() {

  return (
    <>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="about" element={<About />} />
          <Route path="health-topics" element={<HealthTopics />} />
          <Route path="ask-ai" element={<AskAI />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<LogIn />} /> */}
      </Route>
    </Routes>
    </>
  )
}

export default App;

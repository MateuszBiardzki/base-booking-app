import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        {/* Renders a specific component for the root path */}
        <Route path="/" element={<Layout> <p>Home Page</p> </Layout>} />

        {/* Renders "Search Page" for the "/search" path */}
        <Route path="/search" element={<Layout> <p>Search Page</p> </Layout>} />

        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>} />
        <Route path="/sign-in" element={<Layout><SignIn /></Layout>} />
        {/* Redirects to the root path for any other path */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App;
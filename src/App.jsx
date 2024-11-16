import './App.css'
import { useRoutes } from 'react-router-dom';
import SignInPage from './pages/Signin';
import SignupPage from './pages/Signup';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ViewBlogsPage from './pages/ViewBlogsPage';
import ViewBlogDetailsPage from './pages/ViewBlogDetailsPage';
import ViewFavoritesPage from './pages/ViewFavoritesPage'; 
import Navbar from './components/Navbar';
import CreateBlog from './components/CreateBlog';

function App() {
  const routes = useRoutes([
    {
      path: '/',
      element: <SignInPage />
    },
    {
      path: '/signup',
      element: <SignupPage />
    },
    {
      path: '/home',
      element: <HomePage />
    },
    {
      path: '/viewblogs',
      element: <ViewBlogsPage />
    },
    {
      path: '/viewblogs/:id',
      element: <ViewBlogDetailsPage />
    },
    {
      path: '/viewfavorites', 
      element: <ViewFavoritesPage />
    },
    {
      path: "*",
      element: <NotFoundPage />
    },
    {
      path: '/createblog', 
      element: <CreateBlog />
   }
   
  ])

  return (
    <>
      <Navbar />
      {routes}
    </>
  )
}

export default App;

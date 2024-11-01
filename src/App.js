import './App.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/Root/RootLayout';
import AboutPage from './pages/About/AboutPage';
import SignPage from './pages/Sign/SignPage';
import ProfilePage from './pages/Profile/ProfilePage';
import GroupSearch from './pages/Group/GroupSearch/GroupSearch';
import GroupInfo from './pages/Group/GroupInfo/GroupInfo';
import GroupEdit from './pages/Group/GroupEdit/GroupEdit';
import SchedulePage from './pages/Schedule/SchedulePage';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootLayout />,
            children: [
                { index: true, element: <AboutPage /> },
                { path: 'sign', element: <SignPage /> },
                { path: 'profile', element: <ProfilePage /> },
                { path: 'groups', element: <GroupSearch /> },
                { path: 'groups/info/:groupId', element: <GroupInfo /> },
                { path: 'groups/edit', element: <GroupEdit /> },
                { path: 'schedule', element: <SchedulePage /> },
            ]
        }
        
    ]);

    return (
        <RouterProvider router={router} />
    );
}

export default App;

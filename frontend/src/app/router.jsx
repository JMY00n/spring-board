import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MainPage from '../pages/board/MainPage'
import BoardDetailPage from '../pages/board/BoardDetailPage'
import BoardWritePage from '../pages/board/BoardWritePage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/board/:no',
        element: <BoardDetailPage />
    },
    {
        path: '/board/write',
        element: <BoardWritePage />
    },
    {
        path: '/board/edit/:no',
        element: <BoardWritePage />
    }
])
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { InitCheckRoute } from './components/init-check-route'
import { Loading } from './components/loading'
import { ProtectedRoute } from './components/protected-route'
import {
  ClusterRedirector,
  RootRedirector,
} from './components/route-redirectors'
import { getSubPath } from './lib/subpath'

const App = lazy(() => import('./App'))
const CRListPage = lazy(() =>
  import('./pages/cr-list-page').then((module) => ({
    default: module.CRListPage,
  }))
)
const HelmChartListPage = lazy(() =>
  import('./pages/helm-chart-list-page').then((module) => ({
    default: module.HelmChartListPage,
  }))
)
const HelmReleaseListPage = lazy(() =>
  import('./pages/helm-release-list-page').then((module) => ({
    default: module.HelmReleaseListPage,
  }))
)
const InitializationPage = lazy(() =>
  import('./pages/initialization').then((module) => ({
    default: module.InitializationPage,
  }))
)
const LoginPage = lazy(() =>
  import('./pages/login').then((module) => ({ default: module.LoginPage }))
)
const Overview = lazy(() =>
  import('./pages/overview').then((module) => ({ default: module.Overview }))
)
const ResourceDetail = lazy(() =>
  import('./pages/resource-detail').then((module) => ({
    default: module.ResourceDetail,
  }))
)
const ResourceList = lazy(() =>
  import('./pages/resource-list').then((module) => ({
    default: module.ResourceList,
  }))
)
const SecurityDashboard = lazy(() =>
  import('./pages/security-dashboard').then((module) => ({
    default: module.SecurityDashboard,
  }))
)
const SettingsPage = lazy(() =>
  import('./pages/settings').then((module) => ({
    default: module.SettingsPage,
  }))
)

const subPath = getSubPath()

export const router = createBrowserRouter(
  [
    {
      path: '/setup',
      element: (
        <Suspense fallback={<Loading />}>
          <InitializationPage />
        </Suspense>
      ),
    },
    {
      path: '/login',
      element: (
        <InitCheckRoute>
          <Suspense fallback={<Loading />}>
            <LoginPage />
          </Suspense>
        </InitCheckRoute>
      ),
    },
    {
      path: '/',
      element: (
        <InitCheckRoute>
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <App />
            </Suspense>
          </ProtectedRoute>
        </InitCheckRoute>
      ),
      children: [
        {
          index: true,
          element: <RootRedirector />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
        {
          path: 'c/:cluster',
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: <Overview />,
            },
            {
              path: 'security',
              element: <SecurityDashboard />,
            },
            {
              path: 'helm-releases',
              element: <HelmReleaseListPage />,
            },
            {
              path: 'helm-charts',
              element: <HelmChartListPage />,
            },
            {
              path: 'crds/:crd',
              element: <CRListPage />,
            },
            {
              path: 'crds/:resource/:namespace/:name',
              element: <ResourceDetail />,
            },
            {
              path: 'crds/:resource/:name',
              element: <ResourceDetail />,
            },
            {
              path: ':resource/:name',
              element: <ResourceDetail />,
            },
            {
              path: ':resource',
              element: <ResourceList />,
            },
            {
              path: ':resource/:namespace/:name',
              element: <ResourceDetail />,
            },
          ],
        },
        {
          // Catch-all for legacy/absolute paths that forgot the cluster prefix
          path: '*',
          element: <ClusterRedirector />,
        },
      ],
    },
  ],
  {
    basename: subPath,
  }
)

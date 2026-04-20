import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from './App'
import { InitCheckRoute } from './components/init-check-route'
import { Loading } from './components/loading'
import { ProtectedRoute } from './components/protected-route'
import {
  ClusterRedirector,
  RootRedirector,
} from './components/route-redirectors'
import { getSubPath } from './lib/subpath'

const CRListPage = lazy(() =>
  import('./pages/cr-list-page').then((m) => ({ default: m.CRListPage }))
)
const HelmChartListPage = lazy(() =>
  import('./pages/helm-chart-list-page').then((m) => ({
    default: m.HelmChartListPage,
  }))
)
const HelmReleaseListPage = lazy(() =>
  import('./pages/helm-release-list-page').then((m) => ({
    default: m.HelmReleaseListPage,
  }))
)
const InitializationPage = lazy(() =>
  import('./pages/initialization').then((m) => ({
    default: m.InitializationPage,
  }))
)
const LoginPage = lazy(() =>
  import('./pages/login').then((m) => ({ default: m.LoginPage }))
)
const Overview = lazy(() =>
  import('./pages/overview').then((m) => ({ default: m.Overview }))
)
const ResourceDetail = lazy(() =>
  import('./pages/resource-detail').then((m) => ({ default: m.ResourceDetail }))
)
const ResourceList = lazy(() =>
  import('./pages/resource-list').then((m) => ({ default: m.ResourceList }))
)
const SecurityDashboard = lazy(() =>
  import('./pages/security-dashboard').then((m) => ({
    default: m.SecurityDashboard,
  }))
)
const SettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.SettingsPage }))
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
            <App />
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
          element: (
            <Suspense fallback={<Loading />}>
              <SettingsPage />
            </Suspense>
          ),
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
              element: (
                <Suspense fallback={<Loading />}>
                  <Overview />
                </Suspense>
              ),
            },
            {
              path: 'security',
              element: (
                <Suspense fallback={<Loading />}>
                  <SecurityDashboard />
                </Suspense>
              ),
            },
            {
              path: 'helm-releases',
              element: (
                <Suspense fallback={<Loading />}>
                  <HelmReleaseListPage />
                </Suspense>
              ),
            },
            {
              path: 'helm-charts',
              element: (
                <Suspense fallback={<Loading />}>
                  <HelmChartListPage />
                </Suspense>
              ),
            },
            {
              path: 'crds/:crd',
              element: (
                <Suspense fallback={<Loading />}>
                  <CRListPage />
                </Suspense>
              ),
            },
            {
              path: 'crds/:resource/:namespace/:name',
              element: (
                <Suspense fallback={<Loading />}>
                  <ResourceDetail />
                </Suspense>
              ),
            },
            {
              path: 'crds/:resource/:name',
              element: (
                <Suspense fallback={<Loading />}>
                  <ResourceDetail />
                </Suspense>
              ),
            },
            {
              path: ':resource/:name',
              element: (
                <Suspense fallback={<Loading />}>
                  <ResourceDetail />
                </Suspense>
              ),
            },
            {
              path: ':resource',
              element: (
                <Suspense fallback={<Loading />}>
                  <ResourceList />
                </Suspense>
              ),
            },
            {
              path: ':resource/:namespace/:name',
              element: (
                <Suspense fallback={<Loading />}>
                  <ResourceDetail />
                </Suspense>
              ),
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

import React, { useMemo } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import Matches from './components/Matches';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';
import ResumeDetails from './components/ResumeDetails';
import ResumeList from './components/ResumeList';
import Resumes from './components/Resumes';
import Start from './components/Start';
import Applications from './components/Applications';
import ApplicationPage from './components/application/ApplicationPage';
import Onboarding from './components/onboarding/Onboarding';
import { useReadUser } from './hooks/useReadUser';
import { ThemeProvider } from './components/ThemeProvider';

const App: React.FC = () => {
	const { loading, isAuthenticated } = useAuth();
	const { data: userData } = useReadUser();

	const content = useMemo(() => {
		if (loading) {
			return <div>Loading...</div>;
		}
		if (!isAuthenticated) {
			return <LoginScreen />;
		}
		if (!userData?.isOnboarded) {
			return <Onboarding />;
		}
		return <LayoutWrapper />;
	}, [loading, isAuthenticated, userData]);

	return (
		<ThemeProvider defaultTheme="default">
			<Router>{content}</Router>
		</ThemeProvider>
	);
};

const LayoutWrapper = React.memo(() => (
	<Layout>
		<Routes>
			<Route path="/" element={<Start />} />
			<Route path="/resumes" element={<Resumes />}>
				<Route index element={<ResumeList />} />
				<Route path=":resumeId" element={<ResumeDetails />} />
			</Route>
			<Route path="/matches" element={<Matches />} />
			<Route path="/applications" element={<Applications />} />
			<Route path="/applications/:applicationId" element={<ApplicationPage />} />
			<Route path="*" element={<Navigate to="/start" replace />} />
		</Routes>
	</Layout>
));

export default App;

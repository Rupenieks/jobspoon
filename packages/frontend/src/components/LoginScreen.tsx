import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '@/auth/AuthProvider';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const LoginScreen: React.FC = () => {
	const [isRegistering, setIsRegistering] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	useDocumentTitle('Login');
	const { signIn, signUp, signInWithGoogle } = useAuth();

	const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	}, []);

	const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	}, []);

	const handleFullNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFullName(e.target.value);
	}, []);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (isRegistering) {
				signUp({ email, password, fullName });
			} else {
				signIn({ email, password });
			}
		},
		[isRegistering, email, password, fullName, signIn, signUp]
	);

	const toggleMode = useCallback(() => {
		setIsRegistering((prev) => !prev);
	}, []);

	const formContent = useMemo(
		() => (
			<>
				{isRegistering && (
					<Input
						type="text"
						placeholder="Full Name"
						value={fullName}
						onChange={handleFullNameChange}
						className="mb-4"
					/>
				)}
				<Input
					type="email"
					placeholder="Email"
					value={email}
					onChange={handleEmailChange}
					className="mb-4"
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={handlePasswordChange}
					className="mb-4"
				/>
				<Button type="submit" className="w-full mb-4">
					{isRegistering ? 'Sign Up' : 'Sign In'}
				</Button>
			</>
		),
		[
			isRegistering,
			fullName,
			email,
			password,
			handleFullNameChange,
			handleEmailChange,
			handlePasswordChange,
		]
	);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="p-8 bg-white rounded-lg shadow-md w-96">
				<h2 className="text-2xl font-bold mb-6 text-center">
					{isRegistering ? 'Create an Account' : 'Sign In'}
				</h2>
				<form onSubmit={handleSubmit}>{formContent}</form>

				<div className="flex justify-center mb-4 w-full">
					<GoogleLogin
						onSuccess={(credentialResponse) => {
							if (credentialResponse.credential) {
								signInWithGoogle(credentialResponse.credential);
							}
						}}
						onError={() => {
							console.log('Sign in error');
						}}
					/>
				</div>
				<p className="text-center">
					{isRegistering ? 'Already have an account?' : "Don't have an account?"}
					<Button variant="link" onClick={toggleMode}>
						{isRegistering ? 'Sign In' : 'Sign Up'}
					</Button>
				</p>
			</div>
		</div>
	);
};

export default LoginScreen;

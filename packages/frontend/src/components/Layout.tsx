import { useAuth } from '@/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { FileTextIcon, Home, MenuIcon, RocketIcon } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Crosshair1Icon } from '@radix-ui/react-icons';
import { ScrollArea } from './ui/scroll-area';
import { useReadUser } from '@/hooks/useReadUser';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { user, signOut } = useAuth();
	const { data: userData } = useReadUser();
	const location = useLocation();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const navItems = useMemo(
		() => [
			{
				name: 'Start',
				path: '/',
				icon: <Home className="w-4 h-4" />,
				label: 'Start',
			},
			{
				name: 'Resumes',
				path: '/resumes',
				icon: <FileTextIcon className="w-4 h-4" />,
				label: 'Resumes',
			},
			{
				name: 'Matches',
				path: '/matches',
				icon: <Crosshair1Icon className="w-4 h-4" />,
				label: 'Matches',
			},
			{
				name: 'Applications',
				path: '/applications',
				icon: <RocketIcon className="w-4 h-4" />,
				label: 'Applications',
			},
		],
		[]
	);

	const handleSignOut = useCallback(() => {
		signOut();
	}, [signOut]);

	const userInitials = useMemo(() => {
		return user?.fullName
			? user.fullName
					.split(' ')
					.map((n) => n[0])
					.join('')
					.toUpperCase()
			: '';
	}, [user?.fullName]);

	const isNavItemActive = useCallback(
		(itemPath: string) => {
			if (itemPath === '/') {
				return location.pathname === '/';
			}
			return location.pathname.startsWith(itemPath);
		},
		[location.pathname]
	);

	const toggleSidebar = useCallback(() => {
		setIsCollapsed((prev) => !prev);
	}, []);

	return (
		<div className="flex h-screen bg-background">
			<aside className="w-64 border-r border-border bg-card flex flex-col">
				<div className="p-6 flex flex-col items-center border-b border-border">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="cursor-pointer w-16 h-16">
								<AvatarImage
									src={
										userData?.picture
											? `https://images.weserv.nl/?url=${encodeURIComponent(userData.picture)}`
											: undefined
									}
									alt={userData?.fullName}
								/>
								<AvatarFallback className="bg-muted text-muted-foreground">
									{userInitials}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={handleSignOut} className="text-destructive">
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<span className="mt-4 font-medium text-card-foreground">{userData?.fullName}</span>
				</div>

				<nav className="flex-1 p-4">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.label}>
								<Link
									to={item.path}
									className={cn(
										'flex items-center px-4 py-3 rounded-lg transition-colors',
										isNavItemActive(item.path)
											? 'bg-accent text-accent-foreground font-medium'
											: 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
									)}
								>
									<span className="flex-shrink-0">{item.icon}</span>
									<span className="ml-3">{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className="p-4 border-t border-border">
					<span className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Jobspoon
					</span>
				</div>
			</aside>

			<div className="flex-1 flex flex-col min-h-0">
				<ScrollArea className="flex-1">
					<main className="p-8">{children}</main>
				</ScrollArea>
			</div>
		</div>
	);
};

export default Layout;

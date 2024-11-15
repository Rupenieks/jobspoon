import { useAuth } from '@/auth/AuthProvider';
import { useReadUser } from '@/hooks/useReadUser';
import CustomIcon from '@/icons/CustomIcon';
import { cn } from '@/lib/utils';
import { Crosshair1Icon } from '@radix-ui/react-icons';
import { FileTextIcon, Home, RocketIcon } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const location = useLocation();

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

	const isNavItemActive = useCallback(
		(itemPath: string) => {
			if (itemPath === '/') {
				return location.pathname === '/';
			}
			return location.pathname.startsWith(itemPath);
		},
		[location.pathname]
	);

	return (
		<div className="flex h-screen bg-background">
			<aside className="w-64 border-r border-border bg-card flex flex-col">
				<div className="p-6 flex flex-col items-center border-b border-border">
					<span className="text-sm text-muted-foreground">
						<CustomIcon name="jobspoon" className="h-12" />
					</span>
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

				<div className="p-4 border-t border-border"></div>
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

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Resumes: React.FC = () => {
	const location = useLocation();
	useDocumentTitle('Resumes');
	return (
		<div className="container p-0">
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={location.pathname}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<Outlet />
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default Resumes;

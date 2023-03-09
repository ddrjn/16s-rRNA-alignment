import React from 'react';
import './Navbar.scss';
export const Header = () => {
	return (
		<div className="navbar">
			<a href="/">
				<div className="navbar-logo-container">
					<img src="./DNA.png" className="navbar-logo-image" />
					<span className="navbar-title">16S rRNA Alignment</span>
				</div>
			</a>
		</div>
	);
};

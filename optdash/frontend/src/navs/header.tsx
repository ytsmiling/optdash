import React from 'react';
import GitHubButton from 'react-github-btn'
import './header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <span className="header-inline-block">
                    Optuna Dashboard
                </span>
                <span className="header-inline-block">
                    <GitHubButton href="https://github.com/ytsmiling/optdash" data-size="large" data-icon="octicon-star" aria-label="Star ytsmiling/optdash on GitHub">Star</GitHubButton>
                </span>
                <span className="header-inline-block">
                    <GitHubButton href="https://github.com/ytsmiling/optdash/issues" data-color-scheme="no-preference: dark; light: light; dark: dark;" data-size="large" aria-label="Issue ytsmiling/optdash on GitHub">Issue</GitHubButton>
                </span>
            </div>
        </header>
    );
}

export default Header;
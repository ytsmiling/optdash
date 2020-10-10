import React from 'react';
import GitHubButton from 'react-github-btn'
import './header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <span className="header-title">
                    Optuna Dashboard
                </span>
      <GitHubButton href="https://github.com/ytsmiling/optdash" data-size="large" data-icon="octicon-star" aria-label="Star ytsmiling/optdash on GitHub">Star</GitHubButton>
            </div>
        </header>
    );
}

export default Header;
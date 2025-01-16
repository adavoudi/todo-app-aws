// components/TopMenuBar.tsx
import React from "react";
import { useAuth } from "react-oidc-context";
import { USER_POOL_DOMAIN, REGION, REDIRECT_URI,  } from "../Constants"

const TopMenuBar: React.FC = () => {
    const auth = useAuth();

    const handleLogout = () => {
        if (auth.user) {
            const id_token_hint = auth.user.id_token; // Get the ID token from the user object
            const client_id = auth.settings.client_id; // Replace with your actual client ID from AWS Cognito
            const logout_uri = encodeURIComponent(REDIRECT_URI); // Replace with your post-logout redirect URI

            // Construct the logout URL
            const cognitoDomain = `${USER_POOL_DOMAIN}.auth.${REGION}.amazoncognito.com`;
            const logoutUrl = `https://${cognitoDomain}/logout?client_id=${client_id}&logout_uri=${logout_uri}&id_token_hint=${id_token_hint}`;
            auth.removeUser()
            // Redirect the user to the logout URL
            window.location.href = logoutUrl;
        }
    };

    return (
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="text-lg font-bold">My Todo App</div>
            <div className="flex items-center space-x-4">
                {auth.isAuthenticated ? (
                    <>
                        <div className="flex items-center space-x-2">
                            {/* User Profile Photo */}
                            {auth.user?.profile.picture && (
                                <img
                                    src={auth.user.profile.picture}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            {/* User Name */}
                            <span className="font-medium">{auth.user?.profile.name || auth.user?.profile.email}</span>
                        </div>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // Login Button
                    <button
                        onClick={() => auth.signinRedirect()}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopMenuBar;
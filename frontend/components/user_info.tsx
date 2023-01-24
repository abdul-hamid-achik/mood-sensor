import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

export default function UserInfo() {
    const { data: session } = useSession();
    const queryClient = useQueryClient()

    return (
        <div className="absolute top-0 right-0 p-2 flex flex-row items-center justify-between">
            {session?.user ? (
                <>
                    <p className="text-sm text-gray-700" data-testid="user-email">
                        Logged in as {session.user.email}
                    </p>
                    <button
                        className="text-sm text-blue-700 p-2 rounded-md ml-4"
                        data-testid="sign-out"
                        onClick={() => {
                            signOut({
                                callbackUrl: `${window.location.origin}/`,
                            })
                            queryClient.clear()
                        }}
                    >
                        Sign out
                    </button>
                </>
            ) : (
                <>
                    <Link href="/signin" className="text-sm text-blue-700 p-2 rounded-md">
                        Sign In
                    </Link>
                    <Link href="/signup" className="text-sm text-blue-700 p-2 rounded-md">
                        Sign Up
                    </Link>
                </>
            )}
        </div>
    );
}

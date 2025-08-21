"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SignOutButton from "./signout-button";


type User = {
    name: string;
    email?: string;
    avatarUrl?: string;
};

type Props = {
    user?: User | null;
};


export default function AuthButtons({ user }: Props) {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "relative", // so drawer can be positioned relative to this container
    };

    const btnStyle: React.CSSProperties = {
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
        textDecoration: "none",
        color: "#111",
        fontSize: 14,
    };

    const userWrapStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
    };

    const avatarStyle: React.CSSProperties = {
        width: 40,
        height: 40,
        borderRadius: "50%",
        objectFit: "cover",
        background: "#ddd",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        color: "#333",
        fontSize: 14,
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.06)",
    };

    const drawerStyle: React.CSSProperties = {
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        background: "#fff",
        padding: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        borderRadius: 8,
        minWidth: 220,
        zIndex: 50,
    };

    const nameStyle: React.CSSProperties = {
        fontWeight: 600,
        marginBottom: 4,
    };

    const emailStyle: React.CSSProperties = {
        fontSize: 13,
        color: "#555",
        marginBottom: 10,
        wordBreak: "break-all",
    };

function initials(name?: string) {
    if (!name) return "U"; // fallback letter if no name
    const parts = name.trim().split(/\s+/);
    const i1 = parts[0]?.[0] ?? "";
    const i2 = parts[1]?.[0] ?? "";
    return (i1 + i2).toUpperCase() || "U";
}


    // Drawer state + outside click handling
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    if (!user) {
        return (
            <div style={containerStyle}>
                <a href="/account/sign-up" style={btnStyle}>
                    Sign Up
                </a>
                <a href="/account/sign-in" style={btnStyle}>
                    Sign In
                </a>
            </div>
        );
    }

    return (
        <div style={containerStyle} ref={wrapperRef}>
            <a href="/dashboard" style={btnStyle}>
                Dashboard
            </a>

            <div style={userWrapStyle} title={user.name}>
                {user.avatarUrl ? (
                    <div
                        onClick={() => setOpen((v) => !v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((v) => !v); }}
                        style={avatarStyle}
                        aria-expanded={open}
                        aria-haspopup="true"
                    >
                        <Image width={40} height={40} src={user.avatarUrl} alt={`Avatar of ${user.name}`} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                    </div>
                ) : (
                    // fallback to initials (clickable)
                    <div
                        onClick={() => setOpen((v) => !v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((v) => !v); }}
                        style={avatarStyle}
                        aria-expanded={open}
                        aria-haspopup="true"
                    >
                        {initials(user.name)}
                    </div>
                )}
            </div>

            {open && (
                <div style={drawerStyle} role="dialog" aria-label="User menu">
                    <div style={nameStyle}>{user.name}</div>
                    {user.email && <div style={emailStyle}>{user.email}</div>}
                    <div>
                        <SignOutButton btnStyle={btnStyle} />
                    </div>
                </div>
            )}
        </div>
    );
}
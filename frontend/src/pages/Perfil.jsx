import React from "react"
import moment from "moment"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

export default function Perfil() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        if (typeof logout === "function") {
            await logout()
        }
        navigate("/login")
    }

    const createdAt = user?.createdAt ?? user?.created_at
    const createdAtText = createdAt ? moment(createdAt).format("DD/MM/YYYY HH:mm") : "-"
    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U"

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-14">
            <div className="mx-auto w-full max-w-2xl">
                <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-10">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                                {firstLetter}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-semibold text-gray-900">Perfil de Utilizador</h2>
                                <p className="mt-1 text-sm text-gray-500">Gerir informações da tua conta</p>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-3">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                Home
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Nome</div>
                            <div className="mt-1 text-base font-semibold text-gray-900">{user?.name ?? "-"}</div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</div>
                            <div className="mt-1 break-all text-base font-semibold text-gray-900">{user?.email ?? "-"}</div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Cargo</div>
                            <div className="mt-1 text-base font-semibold text-gray-900">{user?.cargo ?? "-"}</div>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Conta criada</div>
                            <div className="mt-1 text-base font-semibold text-gray-900">{createdAtText}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client';

import React, { useState, useEffect } from 'react';
import { createUserAction, getUsersAction, updateUserPasswordAction, updateUserRoleAction, deleteUserAction } from '@/app/actions/users';

interface SafeUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'editor';
}

export default function UserManagement() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // User form states
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');
  const [submitting, setSubmitting] = useState(false);

  // Change password modal/state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getUsersAction();
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else if (res.users) {
      setUsers(res.users as SafeUser[]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const res = await createUserAction({
      username,
      name,
      passwordTxt: password,
      role,
    });

    setSubmitting(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(`Usuario "${username}" creado exitosamente.`);
      setUsername('');
      setName('');
      setPassword('');
      setRole('editor');
      fetchUsers();
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!newPassword.trim()) return;
    setChangingPass(true);
    setError(null);
    setSuccess(null);

    const res = await updateUserPasswordAction(userId, newPassword);
    setChangingPass(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Contraseña actualizada con éxito.');
      setNewPassword('');
      setEditingUserId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'editor') => {
    setError(null);
    setSuccess(null);
    const res = await updateUserRoleAction(userId, newRole);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Rol de usuario actualizado.');
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar al usuario @${username}?`)) return;
    setError(null);
    setSuccess(null);
    const res = await deleteUserAction(userId);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess('Usuario eliminado.');
      fetchUsers();
    }
  };

  if (loading && users.length === 0) {
    return <div className="text-light-gray text-sm">Cargando usuarios registrados...</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20">
          {success}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Creation Form */}
        <div className="rounded-xl border border-charcoal bg-matte-black p-6 space-y-4 h-fit">
          <h3 className="text-lg font-semibold text-foreground border-b border-charcoal pb-2">Crear Nuevo Usuario</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-light-gray mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full rounded-lg border border-charcoal bg-deep-charcoal p-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-light-gray mb-1">Nombre de Usuario (Login)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="juan.perez"
                className="w-full rounded-lg border border-charcoal bg-deep-charcoal p-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-light-gray mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-charcoal bg-deep-charcoal p-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-light-gray mb-1">Rol / Permisos</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'editor')}
                className="w-full rounded-lg border border-charcoal bg-deep-charcoal p-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              >
                <option value="editor">Editor (Facturación y Cotizaciones)</option>
                <option value="admin">Administrador (Acceso Completo y Ajustes)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background hover:bg-light-gray transition duration-200 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2 rounded-xl border border-charcoal bg-matte-black p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-charcoal pb-2">Usuarios Registrados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-light-gray">
              <thead className="bg-deep-charcoal text-xs uppercase text-light-gray/60">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-charcoal/20">
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3">@{u.username}</td>
                    <td className="px-4 py-3">
                      {u.id === 'admin-id' ? (
                        <span className="rounded bg-foreground/10 px-2 py-0.5 text-xs text-foreground font-semibold">
                          Administrador Principal
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as 'admin' | 'editor')}
                          className="rounded border border-charcoal bg-deep-charcoal text-xs text-foreground p-1 focus:outline-none"
                        >
                          <option value="editor">Editor</option>
                          <option value="admin">Administrador</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingUserId(editingUserId === u.id ? null : u.id);
                          setNewPassword('');
                        }}
                        className="text-xs text-foreground hover:underline cursor-pointer"
                      >
                        Contraseña
                      </button>
                      {u.id !== 'admin-id' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="text-xs text-red-400 hover:underline cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline Change Password Box */}
          {editingUserId && (
            <div className="mt-4 p-4 rounded-lg bg-deep-charcoal border border-charcoal space-y-3">
              <div className="flex items-center justify-between border-b border-charcoal pb-1">
                <span className="text-xs font-semibold text-foreground">
                  Cambiar contraseña de @{users.find(u => u.id === editingUserId)?.username}
                </span>
                <button
                  onClick={() => setEditingUserId(null)}
                  className="text-xs text-light-gray hover:text-foreground cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="flex-1 rounded-lg border border-charcoal bg-matte-black p-2 text-sm text-foreground focus:outline-none"
                />
                <button
                  onClick={() => handleChangePassword(editingUserId)}
                  disabled={changingPass}
                  className="rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-light-gray cursor-pointer"
                >
                  {changingPass ? 'Guardando...' : 'Cambiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

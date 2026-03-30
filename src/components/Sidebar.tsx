interface Props {
  role: "Admin" | "User" | "Guest";
}

export default function Sidebar({ role }: Props) {
  return (
    <aside className="bg-white rounded-xl shadow p-4 space-y-2">
      <h3 className="font-semibold mb-2">Role Info</h3>
      <p className="text-gray-600">You are logged in as: <span className="font-medium">{role}</span></p>
      {role === "Admin" && <p className="text-blue-600">You can manage all data.</p>}
      {role === "User" && <p className="text-green-600">You can create and scan codes.</p>}
      {role === "Guest" && <p className="text-gray-500">Read-only access.</p>}
    </aside>
  );
}

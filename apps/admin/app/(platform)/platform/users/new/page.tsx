// apps/admin/app/(platform)/users/new/page.tsx
import UserForm from "@/components/platform/client/UserForm";

export default function NewUserPage() {
  return (
    <div className="page-wrapper">
      <div className="content">
        <h1 className="text-2xl font-bold mb-6">Add New User</h1>
        <UserForm />
      </div>
    </div>
  );
}

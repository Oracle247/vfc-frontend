"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import {
  ChurchStatus,
  Gender,
  IDepartmentRef,
  IUser,
  MembershipType,
  UpdateUserPayload,
  UserRole,
  WorkerType,
} from "@/types/user";
import { IDepartment } from "@/types/department";
import { departmentService } from "@/services/departmentService";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
  onSave: (id: string, payload: UpdateUserPayload) => Promise<void>;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: Gender | "";
  address: string;
  dateOfBirth: string; // YYYY-MM-DD
  matricNumber: string;
  department: string; // legacy free-text field
  level: string;
  faculty: string;
  role: UserRole | "";
  churchStatus: ChurchStatus | "";
  membershipType: MembershipType | "";
  workerType: WorkerType | "";
  departmentIds: string[];
  headDepartmentIds: string[];
  assistantDepartmentIds: string[];
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "",
  address: "",
  dateOfBirth: "",
  matricNumber: "",
  department: "",
  level: "",
  faculty: "",
  role: "",
  churchStatus: "",
  membershipType: "",
  workerType: "",
  departmentIds: [],
  headDepartmentIds: [],
  assistantDepartmentIds: [],
};

const toDateInput = (v?: string | Date | null) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const seedForm = (user: IUser | null, allDepartments: IDepartment[]): FormState => {
  if (!user) return emptyForm;
  // Some lists serve a member without the full M2M arrays. Fall back to empty.
  const pickIds = (rel?: IDepartmentRef[]) =>
    rel?.map((d) => d.id).filter((id) => allDepartments.some((dep) => dep.id === id)) ?? [];

  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    gender: user.gender ?? "",
    address: user.address ?? "",
    dateOfBirth: toDateInput(user.dateOfBirth),
    matricNumber: user.matricNumber ?? "",
    department: user.department ?? "",
    level: user.level ?? "",
    faculty: user.faculty ?? "",
    role: user.role ?? "",
    churchStatus: user.churchStatus ?? "",
    membershipType: user.membershipType ?? "",
    workerType: user.workerType ?? "",
    departmentIds: pickIds(user.departments),
    headDepartmentIds: pickIds(user.headedDepartments),
    assistantDepartmentIds: pickIds(user.assistantDepartments),
  };
};

// ----- Inline multi-select with search + chips -----

interface DeptPickerProps {
  label: string;
  hint?: string;
  options: IDepartment[];
  value: string[];
  onChange: (next: string[]) => void;
}

function DeptPicker({ label, hint, options, value, onChange }: DeptPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      options.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  );

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  const selectedDepts = useMemo(
    () => options.filter((d) => value.includes(d.id)),
    [options, value],
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {selectedDepts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedDepts.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200"
            >
              {d.name}
              <button
                type="button"
                onClick={() => toggle(d.id)}
                className="hover:text-red-500"
                aria-label={`Remove ${d.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search departments..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg max-h-[140px] overflow-y-auto divide-y">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">
            No departments match
          </p>
        ) : (
          filtered.map((d) => {
            const checked = value.includes(d.id);
            return (
              <label
                key={d.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(d.id)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>{d.name}</span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}

// ----- Main dialog -----

export function EditMemberDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: EditMemberDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    departmentService
      .getAllDepartments({ page: 1, limit: 100 })
      .then((res) => setDepartments(res.data ?? []))
      .catch(() => setDepartments([]));
  }, [open]);

  useEffect(() => {
    setForm(seedForm(user, departments));
  }, [user, open, departments]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const payload: UpdateUserPayload = {
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        gender: form.gender || undefined,
        address: form.address.trim() || undefined,
        dateOfBirth: form.dateOfBirth
          ? (new Date(form.dateOfBirth).toISOString() as unknown as Date)
          : undefined,
        matricNumber: form.matricNumber.trim() || undefined,
        department: form.department.trim() || undefined,
        level: form.level.trim() || undefined,
        faculty: form.faculty.trim() || undefined,
        role: form.role || undefined,
        churchStatus: form.churchStatus || undefined,
        membershipType: form.membershipType || undefined,
        workerType:
          form.membershipType === "WORKER" ? form.workerType || undefined : undefined,
        // Always send arrays — empty array means "no departments" and clears the M2M.
        departmentIds: form.departmentIds,
        headDepartmentIds: form.headDepartmentIds,
        assistantDepartmentIds: form.assistantDepartmentIds,
      };
      await onSave(user.id, payload);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Member
            {user && (
              <span className="block text-sm font-normal text-gray-500 mt-1">
                {user.firstName} {user.lastName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Profile */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select
                  value={form.gender || ""}
                  onValueChange={(v) => setField("gender", v as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setField("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Matric Number</Label>
                <Input
                  value={form.matricNumber}
                  onChange={(e) => setField("matricNumber", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Department (free-text)</Label>
                <Input
                  value={form.department}
                  onChange={(e) => setField("department", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Input
                  value={form.level}
                  onChange={(e) => setField("level", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Faculty</Label>
                <Input
                  value={form.faculty}
                  onChange={(e) => setField("faculty", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Role + Journey */}
          <section className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Role &amp; Journey</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={form.role || ""}
                  onValueChange={(v) => setField("role", v as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="WORKER">Worker</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Church Status</Label>
                <Select
                  value={form.churchStatus || ""}
                  onValueChange={(v) => setField("churchStatus", v as ChurchStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_TIMER">First Timer</SelectItem>
                    <SelectItem value="VISITOR">Visitor</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Membership Type</Label>
                <Select
                  value={form.membershipType || ""}
                  onValueChange={(v) =>
                    setField("membershipType", v as MembershipType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NON_WORKER">Non-worker</SelectItem>
                    <SelectItem value="WORKER">Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.membershipType === "WORKER" && (
                <div className="space-y-1.5">
                  <Label>Worker Type</Label>
                  <Select
                    value={form.workerType || ""}
                    onValueChange={(v) => setField("workerType", v as WorkerType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select worker type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGULAR">Regular</SelectItem>
                      <SelectItem value="EXECUTIVE">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </section>

          {/* Department M2M */}
          <section className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Departments</h3>
            <DeptPicker
              label="Member of"
              hint="Departments this user belongs to."
              options={departments}
              value={form.departmentIds}
              onChange={(next) => setField("departmentIds", next)}
            />
            <DeptPicker
              label="Heads"
              hint="Departments this user heads."
              options={departments}
              value={form.headDepartmentIds}
              onChange={(next) => setField("headDepartmentIds", next)}
            />
            <DeptPicker
              label="Assists in"
              hint="Departments where this user serves as an assistant head."
              options={departments}
              value={form.assistantDepartmentIds}
              onChange={(next) => setField("assistantDepartmentIds", next)}
            />
          </section>
        </div>

        <DialogFooter className="border-t pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

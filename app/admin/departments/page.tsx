"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Users, Crown, Pencil, Trash2 } from "lucide-react";
import { departmentService } from "@/services/departmentService";
import { IDepartment } from "@/types/department";
import { PaginatedData } from "@/types/api";
import { DepartmentDialog } from "./_components/DepartmentDialog";
import { ManageMembersDialog } from "./_components/ManageMembersDialog";
import { BulkImportDialog } from "../members/_components/BulkImportDialog";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editDepartment, setEditDepartment] = useState<IDepartment | null>(null);
  const [manageDepartment, setManageDepartment] = useState<IDepartment | null>(null);
  const [showImport, setShowImport] = useState(false);

  const fetchDepartments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result: PaginatedData<IDepartment> = await departmentService.getAllDepartments({ page, limit: 20 });
      setDepartments(result.data);
      setPagination({ page: result.page, totalPages: result.totalPages });
    } catch {
      // Error handled by handleApiCall
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (data: { name: string; description?: string }) => {
    await departmentService.createDepartment(data);
    fetchDepartments();
  };

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (!editDepartment) return;
    await departmentService.updateDepartment(editDepartment.id, data);
    setEditDepartment(null);
    fetchDepartments();
  };

  const handleDelete = async (dept: IDepartment) => {
    if (!confirm(`Delete department "${dept.name}"?`)) return;
    await departmentService.deleteDepartment(dept.id);
    fetchDepartments();
  };

  const handleAssignHead = async (deptId: string, userId: string) => {
    const updated = await departmentService.assignHead(deptId, userId);
    refreshDepartmentInList(updated);
  };

  const handleRemoveHead = async (deptId: string) => {
    const updated = await departmentService.removeHead(deptId);
    refreshDepartmentInList(updated);
  };

  const handleAddMembers = async (deptId: string, userIds: string[]) => {
    const updated = await departmentService.addMembers(deptId, userIds);
    refreshDepartmentInList(updated);
  };

  const handleRemoveMembers = async (deptId: string, userIds: string[]) => {
    const updated = await departmentService.removeMembers(deptId, userIds);
    refreshDepartmentInList(updated);
  };

  const refreshDepartmentInList = (updated: IDepartment) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
    // Also refresh the manage dialog if it's open for this department
    if (manageDepartment?.id === updated.id) {
      setManageDepartment(updated);
    }
  };

  const handleBulkImport = async (file: File) => {
    const result = await departmentService.bulkImport(file);
    fetchDepartments();
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-gray-500">Manage church departments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Department
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No departments yet. Create one or import from Excel.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditDepartment(dept)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(dept)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {dept.description && (
                  <p className="text-sm text-gray-500">{dept.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Head */}
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">
                    {dept.head
                      ? `${dept.head.firstName} ${dept.head.lastName}`
                      : "No head assigned"}
                  </span>
                </div>

                {/* Members count */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {dept.members?.length || 0} members
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setManageDepartment(dept)}
                >
                  Manage Members
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchDepartments(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchDepartments(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <DepartmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleCreate}
      />

      <DepartmentDialog
        open={!!editDepartment}
        onOpenChange={(open) => !open && setEditDepartment(null)}
        department={editDepartment}
        onSave={handleUpdate}
      />

      <ManageMembersDialog
        open={!!manageDepartment}
        onOpenChange={(open) => !open && setManageDepartment(null)}
        department={manageDepartment}
        onAssignHead={handleAssignHead}
        onRemoveHead={handleRemoveHead}
        onAddMembers={handleAddMembers}
        onRemoveMembers={handleRemoveMembers}
      />

      <BulkImportDialog
        open={showImport}
        onOpenChange={setShowImport}
        onImport={handleBulkImport}
        title="Import Departments"
        description="Upload an Excel file (.xlsx) with columns: name, description"
      />
    </div>
  );
}

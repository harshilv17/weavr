"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { useWorkflows } from "@/hooks/useWorkflows";
import { PAGE_SIZE } from "./types";
import DashboardBackground from "./DashboardBackground";
import DashboardHeader from "./DashboardHeader";
import WorkflowStats from "./WorkflowStats";
import WorkflowToolbar from "./WorkflowToolbar";
import WorkflowTable from "./WorkflowTable";
import WorkflowPagination from "./WorkflowPagination";
import CreateWorkflowDialog from "./CreateWorkflowDialog";

interface User {
  id: string;
  email: string;
  name?: string;
  isVerified?: boolean;
}

interface DashboardClientProps {
  user: User | null;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const { workflows, loading: workflowsLoading, addWorkflow, removeWorkflow } = useWorkflows();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [signingOut, setSigningOut] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(
    () =>
      workflows.filter(
        (w) =>
          w.name.toLowerCase().includes(search.toLowerCase()) ||
          w.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [workflows, search],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await api.post("/v1/auth/signout");
      router.push("/signin");
    } catch {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060608] text-[#f0eee9]">
      <DashboardBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <DashboardHeader signingOut={signingOut} onSignOut={handleSignOut} />
        <WorkflowStats workflows={workflows} loading={workflowsLoading} />
        <WorkflowToolbar
          search={search}
          onSearch={handleSearch}
          onCreateClick={() => setCreateOpen(true)}
        />
        <WorkflowTable
          workflows={paginated}
          loading={workflowsLoading}
          onDeleted={removeWorkflow}
        />
        {!workflowsLoading && (
          <WorkflowPagination
            page={page}
            totalPages={totalPages}
            filteredCount={filtered.length}
            onPageChange={setPage}
          />
        )}
      </div>

      <CreateWorkflowDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={addWorkflow}
      />
    </div>
  );
}

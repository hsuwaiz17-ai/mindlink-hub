import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Trash2, 
  Eye, 
  Edit2,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import Header from "@/components/dashboard/Header";

interface SummaryWithDocument {
  id: string;
  created_at: string;
  summary_text: string;
  summary_type: string | null;
  doc_id: string;
  documents: {
    title: string | null;
    input_type: string | null;
  } | null;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [summaries, setSummaries] = useState<SummaryWithDocument[]>([]);
  const [filteredSummaries, setFilteredSummaries] = useState<SummaryWithDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<SummaryWithDocument | null>(null);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<SummaryWithDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch summaries on mount
  useEffect(() => {
    if (user) {
      fetchSummaries();
    }
  }, [user]);

  // Filter summaries based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSummaries(summaries);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = summaries.filter(
        (s) =>
          s.summary_text.toLowerCase().includes(query) ||
          s.documents?.title?.toLowerCase().includes(query) ||
          s.summary_type?.toLowerCase().includes(query)
      );
      setFilteredSummaries(filtered);
    }
  }, [searchQuery, summaries]);

  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("summaries")
        .select(`
          id,
          created_at,
          summary_text,
          summary_type,
          doc_id,
          documents (
            title,
            input_type
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSummaries(data || []);
      setFilteredSummaries(data || []);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (summary: SummaryWithDocument) => {
    setSelectedSummary(summary);
    setViewDialogOpen(true);
  };

  const handleEdit = (summary: SummaryWithDocument) => {
    setSelectedSummary(summary);
    setEditText(summary.summary_text);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedSummary) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("summaries")
        .update({ summary_text: editText })
        .eq("id", selectedSummary.id);

      if (error) throw error;

      // Update local state
      setSummaries((prev) =>
        prev.map((s) =>
          s.id === selectedSummary.id ? { ...s, summary_text: editText } : s
        )
      );
      
      toast.success("Summary updated successfully");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating summary:", error);
      toast.error("Failed to update summary");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (summary: SummaryWithDocument) => {
    setSummaryToDelete(summary);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!summaryToDelete) return;

    setIsDeleting(true);
    try {
      // Delete the summary first
      const { error: summaryError } = await supabase
        .from("summaries")
        .delete()
        .eq("id", summaryToDelete.id);

      if (summaryError) throw summaryError;

      // Optionally delete the associated document if no other summaries reference it
      const { data: remainingSummaries } = await supabase
        .from("summaries")
        .select("id")
        .eq("doc_id", summaryToDelete.doc_id);

      if (!remainingSummaries || remainingSummaries.length === 0) {
        await supabase
          .from("documents")
          .delete()
          .eq("id", summaryToDelete.doc_id);
      }

      // Update local state
      setSummaries((prev) => prev.filter((s) => s.id !== summaryToDelete.id));
      
      toast.success("Summary deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting summary:", error);
      toast.error("Failed to delete summary");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Summary History</h1>
            <p className="text-sm text-muted-foreground">
              View and manage your previous summaries
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search summaries by title, content, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Summary List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "No matching summaries" : "No summaries yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start summarizing content to build your history"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate("/")}
                className="mt-4"
              >
                Create Summary
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSummaries.map((summary) => (
              <div
                key={summary.id}
                className="glass-card rounded-xl p-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-medium text-foreground truncate">
                        {summary.documents?.title || "Untitled Document"}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {truncateText(summary.summary_text)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(summary.created_at)}
                      </span>
                      {summary.summary_type && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                          {summary.summary_type}
                        </span>
                      )}
                      {summary.documents?.input_type && (
                        <span className="rounded-full bg-secondary px-2 py-0.5">
                          {summary.documents.input_type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(summary)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(summary)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(summary)}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSummary?.documents?.title || "Summary"}
            </DialogTitle>
            <DialogDescription>
              {selectedSummary && formatDate(selectedSummary.created_at)}
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {selectedSummary && (
              <ReactMarkdown>{selectedSummary.summary_text}</ReactMarkdown>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Summary</DialogTitle>
            <DialogDescription>
              Make changes to your summary below
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[300px] resize-none"
            placeholder="Enter your summary..."
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Summary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this summary? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HistoryPage;

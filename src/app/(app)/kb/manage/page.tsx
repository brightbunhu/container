
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddKnowledgeBaseDialog } from "@/components/pages/kb/add-knowledge-base-dialog";
import { EditKnowledgeBaseDialog } from "@/components/pages/kb/edit-knowledge-base-dialog";
import { DeleteKnowledgeBaseDialog } from "@/components/pages/kb/delete-knowledge-base-dialog";
import type { KnowledgeBase } from '@/lib/types';

export default function KnowledgeBaseManagementPage() {
  const [articles, setArticles] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBase | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/knowledge-base');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: KnowledgeBase) => {
    setSelectedArticle(article);
    setShowEditDialog(true);
  };

  const handleDelete = (article: KnowledgeBase) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const handleArticleAdded = () => {
    setShowAddDialog(false);
    fetchArticles();
  };

  const handleArticleEdited = () => {
    setShowEditDialog(false);
    setSelectedArticle(null);
    fetchArticles();
  };

  const handleArticleDeleted = () => {
    setShowDeleteDialog(false);
    setSelectedArticle(null);
    fetchArticles();
  };

  const filteredArticles = articles.filter(article =>
    (article.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (article.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (article.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading knowledge base...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage knowledge base articles
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Article
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card key={article._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{article.category || 'Unknown'}</Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(article)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(article)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{article.title || 'Untitled'}</CardTitle>
              <CardDescription>
                {article.content && article.content.length > 100
                  ? `${article.content.substring(0, 100)}...`
                  : article.content || 'No content'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Author:</span>
                  <span className="font-medium">{article.author || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag || 'Unknown'}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              {searchTerm ? 'No articles found matching your search.' : 'No articles found.'}
            </div>
            {!searchTerm && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Article
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <AddKnowledgeBaseDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleArticleAdded}
      />

      {selectedArticle && (
        <>
          <EditKnowledgeBaseDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            article={selectedArticle}
            onSuccess={handleArticleEdited}
          />
          <DeleteKnowledgeBaseDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            article={selectedArticle}
            onSuccess={handleArticleDeleted}
          />
        </>
      )}
    </div>
  );
}

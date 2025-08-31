"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Loader2, Calendar, User, Tag } from "lucide-react";
import { EditKnowledgeBaseDialog } from "@/components/pages/kb/edit-knowledge-base-dialog";
import { DeleteKnowledgeBaseDialog } from "@/components/pages/kb/delete-knowledge-base-dialog";
import type { KnowledgeBase } from '@/lib/types';

export default function KnowledgeBaseArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<KnowledgeBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge-base/${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else if (response.status === 404) {
        router.push('/kb');
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
      router.push('/kb');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleEdited = () => {
    setShowEditDialog(false);
    if (article) {
      fetchArticle(article._id);
    }
  };

  const handleArticleDeleted = () => {
    setShowDeleteDialog(false);
    router.push('/kb');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading article...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-4">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/kb')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push('/kb')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Knowledge Base
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">{article.category || 'Unknown'}</Badge>
              <CardTitle className="text-3xl mb-2">{article.title || 'Untitled'}</CardTitle>
              <CardDescription className="text-lg">
                {article.content && article.content.length > 200
                  ? `${article.content.substring(0, 200)}...`
                  : article.content || 'No content'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>By {article.author || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Unknown date'}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>{article.tags.length} tags</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Article Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {article.content || 'No content available'}
            </div>
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag || 'Unknown'}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditKnowledgeBaseDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        article={article}
        onSuccess={handleArticleEdited}
      />

      <DeleteKnowledgeBaseDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        article={article}
        onSuccess={handleArticleDeleted}
      />
    </div>
  );
}

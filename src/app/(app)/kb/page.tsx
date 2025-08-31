"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Search } from "lucide-react";
import type { KnowledgeBase } from '@/lib/types';

export default function KnowledgeBasePage() {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const response = await fetch('/api/knowledge-base');
        if (response.ok) {
          const data = await response.json();
          setKnowledgeBase(data);
        }
      } catch (error) {
        console.error('Failed to fetch knowledge base:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, []);

  const filteredArticles = knowledgeBase.filter(article =>
    (article.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (article.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (article.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading knowledge base...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Find solutions and troubleshooting guides
          </p>
        </div>
        <Link href="/kb/manage">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Link key={article._id} href={`/kb/${article._id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="outline" className="capitalize">
                    {article.category?.toLowerCase() || 'Unknown'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{article.title || 'Untitled'}</CardTitle>
                <CardDescription>
                  {article.content?.substring(0, 100) || 'No content'}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Author: {article.author || 'Unknown'}</span>
                  <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No articles found' : 'No articles available'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by adding your first knowledge base article'
              }
            </p>
            {!searchTerm && (
              <Link href="/kb/manage">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Article
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

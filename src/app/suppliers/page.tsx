'use client';

import { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  SearchIcon,
  StarIcon,
  FilterIcon,
  LockIcon,
  CrownIcon,
  ChevronDownIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import suppliersData from '@/data/suppliers.json';

const ITEMS_PER_CATEGORY = 6;

interface Supplier {
  name: string;
  whatsapp?: string;
  area?: string;
  service_rating?: string;
  price_rating?: string;
  notes?: string;
  website?: string;
  source?: string;
}

interface SupplierCategory {
  [category: string]: Supplier[];
}

interface SupplierData {
  [section: string]: SupplierCategory;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Builder/contractor': '🏗️',
  'Electrician': '⚡',
  'Plumber': '🔧',
  'Carpenter': '🪚',
  'Pool Guy': '🏊',
  'Gardener': '🌿',
  'Interior Designer': '🎨',
  'Handy Man': '🛠️',
  'Cleaners': '🧹',
  'Property manager': '🏠',
  'Tiles Shop': '🔲',
  'Homeware': '🛋️',
  'Visa Agents': '📋',
  'Private drivers': '🚗',
  'Tailors': '✂️',
  'Medical contact - doctors who come to your home': '🏥',
  'Scooter Rental': '🛵',
  'Print Shop': '🖨️',
};

// Categories relevant for villa investors
const FEATURED_CATEGORIES = [
  'Builder/contractor',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Pool Guy',
  'Tiles Shop',
  'Interior Designer',
  'Gardener',
  'Handy Man',
  'Property manager',
  'Homeware',
];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // For demo - in production this would check actual membership
  const [hasAccess] = useState(true);

  const toggleCategoryExpansion = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const data = suppliersData as SupplierData;

  // Flatten all suppliers with their categories
  const allSuppliers = useMemo(() => {
    const suppliers: Array<Supplier & { category: string; section: string }> = [];

    Object.entries(data).forEach(([section, categories]) => {
      if (typeof categories === 'object' && categories !== null) {
        Object.entries(categories).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item) => {
              suppliers.push({
                ...item,
                category,
                section,
              });
            });
          }
        });
      }
    });

    return suppliers;
  }, [data]);

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    allSuppliers.forEach((s) => categories.add(s.category));
    return Array.from(categories).sort();
  }, [allSuppliers]);

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    return allSuppliers.filter((supplier) => {
      const matchesSearch =
        searchTerm === '' ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === null || supplier.category === selectedCategory;

      const matchesFeatured =
        showAll || FEATURED_CATEGORIES.includes(supplier.category);

      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [allSuppliers, searchTerm, selectedCategory, showAll]);

  // Group by category for display
  const groupedSuppliers = useMemo(() => {
    const groups: Record<string, Array<Supplier & { category: string; section: string }>> = {};

    filteredSuppliers.forEach((supplier) => {
      if (!groups[supplier.category]) {
        groups[supplier.category] = [];
      }
      groups[supplier.category].push(supplier);
    });

    return groups;
  }, [filteredSuppliers]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-[var(--color-energy)]/10 p-4">
            <LockIcon className="h-8 w-8 text-[var(--color-energy)]" />
          </div>
          <h1 className="text-3xl font-bold">Supplier Directory</h1>
          <p className="mt-4 text-muted-foreground">
            Access our verified database of 100+ trusted contacts with direct WhatsApp links.
          </p>
          <Button asChild className="mt-8 bg-[var(--color-energy)]">
            <Link href="/pricing">
              <CrownIcon className="mr-2 h-4 w-4" />
              Unlock with Membership
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl contain-paint">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Trusted Supplier Directory</h1>
          <p className="mt-2 text-muted-foreground">
            100+ verified contacts from the Bali expat community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search suppliers, categories, or areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showAll ? 'default' : 'outline'}
            onClick={() => setShowAll(!showAll)}
            className="shrink-0"
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            {showAll ? 'All Categories' : 'Construction Only'}
          </Button>
        </div>

        {/* Category Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1"
            onClick={() => setSelectedCategory(null)}
          >
            All ({filteredSuppliers.length})
          </Badge>
          {(showAll ? allCategories : FEATURED_CATEGORIES.filter((c) => allCategories.includes(c))).map((category) => {
            const count = filteredSuppliers.filter((s) => s.category === category).length;
            if (count === 0) return null;
            return (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {CATEGORY_ICONS[category] || '📦'} {category} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Results */}
        <div className="space-y-8">
          {Object.entries(groupedSuppliers)
            .sort(([a], [b]) => {
              const aFeatured = FEATURED_CATEGORIES.indexOf(a);
              const bFeatured = FEATURED_CATEGORIES.indexOf(b);
              if (aFeatured !== -1 && bFeatured !== -1) return aFeatured - bFeatured;
              if (aFeatured !== -1) return -1;
              if (bFeatured !== -1) return 1;
              return a.localeCompare(b);
            })
            .map(([category, suppliers]) => {
              const isExpanded = expandedCategories.has(category) || searchTerm !== '';
              const displayedSuppliers = isExpanded ? suppliers : suppliers.slice(0, ITEMS_PER_CATEGORY);
              const hasMore = suppliers.length > ITEMS_PER_CATEGORY;

              return (
                <Card key={category} className="overflow-hidden" style={{ contentVisibility: 'auto' }}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span>{CATEGORY_ICONS[category] || '📦'}</span>
                      {category}
                      <Badge variant="secondary" className="ml-2">
                        {suppliers.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {displayedSuppliers.map((supplier, idx) => (
                        <div
                          key={`${supplier.name}-${idx}`}
                          className="rounded-lg border p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-sm">{supplier.name}</h3>
                            {supplier.service_rating === '5' && (
                              <StarIcon className="h-4 w-4 shrink-0 fill-[var(--color-energy)] text-[var(--color-energy)]" />
                            )}
                          </div>

                          {supplier.area && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              📍 {supplier.area}
                            </p>
                          )}

                          {supplier.notes && (
                            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                              {supplier.notes}
                            </p>
                          )}

                          {supplier.whatsapp && (
                            <a
                              href={`https://wa.me/${supplier.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    {hasMore && !isExpanded && (
                      <Button
                        variant="ghost"
                        className="mt-3 w-full"
                        onClick={() => toggleCategoryExpansion(category)}
                      >
                        Show {suppliers.length - ITEMS_PER_CATEGORY} more
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                    {hasMore && isExpanded && searchTerm === '' && (
                      <Button
                        variant="ghost"
                        className="mt-3 w-full"
                        onClick={() => toggleCategoryExpansion(category)}
                      >
                        Show less
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No suppliers found matching your search.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 rounded-lg border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            This directory is curated from word-of-mouth referrals in the Bali expat community.
            Contact information may change - always verify directly with suppliers.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>
      </div>
    </div>
  );
}

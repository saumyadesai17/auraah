"use client";

import { useEffect, useState } from "react";
import RecommendedContent from "@/components/recommended/RecommendedContent";

export default function RecommendedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="page-container">
      <RecommendedContent />
    </div>
  );
}
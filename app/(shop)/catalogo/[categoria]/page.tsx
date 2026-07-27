import CatalogContent from "./catalog-content";

export default async function CatalogPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  return <CatalogContent categoria={categoria} />;
}

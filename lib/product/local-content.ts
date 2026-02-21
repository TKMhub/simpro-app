import fs from 'fs';
import path from 'path';
import { ProductHeader } from './types';
import { getProductCoverPublicUrl } from './image';

const CONTENT_DIR = path.join(process.cwd(), 'content/products');

export async function getLocalProductList(): Promise<ProductHeader[]> {
  const types = ['application', 'template', 'tool'] as const;
  const items: ProductHeader[] = [];

  for (const type of types) {
    const dir = path.join(CONTENT_DIR, type);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        const json = JSON.parse(content);

        // Ensure date fields are properly strings (if they aren't already)
        // json files usually have strings for dates
        
        const headerImageUrl = getProductCoverPublicUrl({ 
            imgPath: json.headerImagePath, 
            slug: json.slug 
        });

        const product: ProductHeader = {
          ...json,
          // Directory determines type if not specified, but we expect it in JSON
          // If JSON type differs from directory, we might want to warn or override.
          // For now, trust the JSON but maybe enforce consistency?
          // Let's just trust JSON for now, assuming I wrote them correctly.
           type: json.type || (type === 'application' ? 'Application' : type === 'template' ? 'Template' : 'Tool'),
           headerImageUrl: headerImageUrl ?? undefined,
        };
        
        if (product.isPublic) {
            items.push(product);
        }
      } catch (e) {
        console.error(`Failed to parse product file: ${file}`, e);
      }
    }
  }

  // Sort by updatedAt desc
  return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getLocalProductBySlug(slug: string): Promise<ProductHeader | null> {
    const all = await getLocalProductList();
    return all.find(p => p.slug === slug) || null;
}


/**
 * Context Compression Utilities
 * Compress data to fit more context within token limits
 */

import { MenuItem } from '@/types/menu.types';
import { Order } from '@/types/order.types';

/**
 * Compress menu items into compact format
 * Format: Name|Price|Rating|Type
 * Example: ButterChicken|350|4.8|NV
 */
export function compressMenuItems(items: MenuItem[]): string {
  return items
    .map(item => {
      const name = item.name.replace(/\s+/g, ''); // Remove spaces
      const price = item.price;
      const rating = item.rating.toFixed(1);
      const type = item.isVeg ? 'V' : 'NV';
      return `${name}|${price}|${rating}|${type}`;
    })
    .join(', ');
}

/**
 * Compress menu items with descriptions (slightly more verbose)
 * Format: Name|Price|Rating|Type|ShortDesc
 */
export function compressMenuItemsWithDesc(items: MenuItem[]): string {
  return items
    .map(item => {
      const name = item.name.replace(/\s+/g, '');
      const price = item.price;
      const rating = item.rating.toFixed(1);
      const type = item.isVeg ? 'V' : 'NV';
      // Take first 20 chars of description
      const desc = item.description?.substring(0, 20).replace(/\s+/g, '_') || '';
      return `${name}|${price}|${rating}|${type}|${desc}`;
    })
    .join(', ');
}

/**
 * Compress order history
 * Format: ItemName1+ItemName2|ItemName3+ItemName4
 */
export function compressOrderHistory(orders: Order[]): string {
  return orders
    .map(order => {
      const items = order.items
        .map(item => item.name.replace(/\s+/g, ''))
        .join('+');
      return items;
    })
    .join('|');
}

/**
 * Create compressed menu context for AI
 */
export function createCompressedMenuContext(items: MenuItem[]): string {
  const compressed = compressMenuItems(items);
  
  return `
Menu (Format: Name|Price|Rating|V/NV):
${compressed}

Legend: V=Veg, NV=NonVeg, Rating out of 5`;
}

/**
 * Create ultra-compressed menu context (maximum compression)
 */
export function createUltraCompressedMenuContext(items: MenuItem[]): string {
  // Group by veg/non-veg
  const veg = items.filter(i => i.isVeg);
  const nonVeg = items.filter(i => !i.isVeg);
  
  const vegList = veg.map(i => `${i.name.replace(/\s+/g, '')}:${i.price}:${i.rating.toFixed(1)}`).join(',');
  const nonVegList = nonVeg.map(i => `${i.name.replace(/\s+/g, '')}:${i.price}:${i.rating.toFixed(1)}`).join(',');
  
  return `Menu(Name:Price:Rating)\nV:[${vegList}]\nNV:[${nonVegList}]`;
}

/**
 * Estimate token count (rough approximation)
 * 1 token ≈ 4 characters
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Smart menu filter based on query
 */
export function filterMenuByQuery(items: MenuItem[], query: string): MenuItem[] {
  const lowerQuery = query.toLowerCase();
  
  let filtered = items;
  
  // Filter by veg/non-veg
  if (lowerQuery.includes('veg') && !lowerQuery.includes('non')) {
    filtered = filtered.filter(i => i.isVeg);
  } else if (lowerQuery.includes('non-veg') || lowerQuery.includes('nonveg') || lowerQuery.includes('non veg')) {
    filtered = filtered.filter(i => !i.isVeg);
  }
  
  // Filter by rating
  if (lowerQuery.includes('top rated') || lowerQuery.includes('best') || lowerQuery.includes('highest rated')) {
    filtered = filtered.filter(i => i.rating >= 4.5);
    filtered.sort((a, b) => b.rating - a.rating);
  }
  
  // Filter by price
  if (lowerQuery.includes('cheap') || lowerQuery.includes('budget') || lowerQuery.includes('under')) {
    const priceMatch = lowerQuery.match(/under\s+(\d+)/);
    const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 300;
    filtered = filtered.filter(i => i.price <= maxPrice);
  }
  
  if (lowerQuery.includes('expensive') || lowerQuery.includes('premium')) {
    filtered = filtered.filter(i => i.price >= 400);
  }
  
  // Filter by category
  if (lowerQuery.includes('starter') || lowerQuery.includes('appetizer')) {
    filtered = filtered.filter(i => i.category.toLowerCase().includes('starter'));
  }
  
  if (lowerQuery.includes('main') || lowerQuery.includes('curry')) {
    filtered = filtered.filter(i => 
      i.category.toLowerCase().includes('main') || 
      i.category.toLowerCase().includes('curry')
    );
  }
  
  if (lowerQuery.includes('dessert') || lowerQuery.includes('sweet')) {
    filtered = filtered.filter(i => i.category.toLowerCase().includes('dessert'));
  }
  
  // Limit to top 15 items
  return filtered.slice(0, 15);
}

/**
 * Compression comparison for debugging
 */
export function compareCompression(items: MenuItem[]) {
  const verbose = items.map(i => 
    `${i.name} - ₹${i.price} - ${i.rating}⭐ - ${i.isVeg ? 'Veg' : 'Non-Veg'} - ${i.description}`
  ).join('\n');
  
  const compressed = compressMenuItems(items);
  const ultraCompressed = createUltraCompressedMenuContext(items);
  
  console.log('=== Compression Comparison ===');
  console.log(`Verbose: ${verbose.length} chars (${estimateTokens(verbose)} tokens)`);
  console.log(`Compressed: ${compressed.length} chars (${estimateTokens(compressed)} tokens)`);
  console.log(`Ultra: ${ultraCompressed.length} chars (${estimateTokens(ultraCompressed)} tokens)`);
  console.log(`Savings: ${Math.round((1 - ultraCompressed.length / verbose.length) * 100)}%`);
  
  return {
    verbose,
    compressed,
    ultraCompressed,
    verboseTokens: estimateTokens(verbose),
    compressedTokens: estimateTokens(compressed),
    ultraTokens: estimateTokens(ultraCompressed),
  };
}

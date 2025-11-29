import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, Search, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

// Single-source styled components
const SearchInput = (props: React.ComponentProps<typeof Input>) => (
  <Input {...props} />
);

const CategoryBadge = ({
  active,
  ...props
}: React.ComponentProps<typeof Badge> & { active?: boolean }) => (
  <Badge variant={active ? 'default' : 'outline'} {...props} />
);

const ProductCard = ({
  children,
  ...props
}: React.ComponentProps<typeof Card>) => <Card {...props}>{children}</Card>;

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  image: string;
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 89.99,
    category: 'Electronics',
    rating: 4.5,
    stock: 45,
    image: '🎧',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    rating: 4.8,
    stock: 23,
    image: '⌚',
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 34.99,
    category: 'Accessories',
    rating: 4.3,
    stock: 67,
    image: '💻',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 129.99,
    category: 'Electronics',
    rating: 4.7,
    stock: 34,
    image: '⌨️',
  },
  {
    id: 5,
    name: 'USB-C Hub',
    price: 49.99,
    category: 'Accessories',
    rating: 4.4,
    stock: 89,
    image: '🔌',
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    price: 39.99,
    category: 'Electronics',
    rating: 4.6,
    stock: 56,
    image: '🖱️',
  },
  {
    id: 7,
    name: 'Phone Case',
    price: 19.99,
    category: 'Accessories',
    rating: 4.2,
    stock: 120,
    image: '📱',
  },
  {
    id: 8,
    name: 'Portable Charger',
    price: 29.99,
    category: 'Electronics',
    rating: 4.5,
    stock: 78,
    image: '🔋',
  },
  {
    id: 9,
    name: 'Desk Lamp',
    price: 44.99,
    category: 'Furniture',
    rating: 4.4,
    stock: 43,
    image: '💡',
  },
  {
    id: 10,
    name: 'Webcam HD',
    price: 79.99,
    category: 'Electronics',
    rating: 4.6,
    stock: 31,
    image: '📷',
  },
  {
    id: 11,
    name: 'Monitor 27"',
    price: 299.99,
    category: 'Electronics',
    rating: 4.8,
    stock: 18,
    image: '🖥️',
  },
  {
    id: 12,
    name: 'Ergonomic Chair',
    price: 249.99,
    category: 'Furniture',
    rating: 4.7,
    stock: 12,
    image: '🪑',
  },
  {
    id: 13,
    name: 'Desk Organizer',
    price: 24.99,
    category: 'Accessories',
    rating: 4.3,
    stock: 95,
    image: '📦',
  },
  {
    id: 14,
    name: 'Bluetooth Speaker',
    price: 59.99,
    category: 'Electronics',
    rating: 4.5,
    stock: 52,
    image: '🔊',
  },
  {
    id: 15,
    name: 'Gaming Mouse Pad',
    price: 14.99,
    category: 'Accessories',
    rating: 4.2,
    stock: 110,
    image: '🎮',
  },
  {
    id: 16,
    name: 'Cable Management',
    price: 12.99,
    category: 'Accessories',
    rating: 4.1,
    stock: 145,
    image: '🔗',
  },
  {
    id: 17,
    name: 'External SSD 1TB',
    price: 119.99,
    category: 'Electronics',
    rating: 4.9,
    stock: 28,
    image: '💾',
  },
  {
    id: 18,
    name: 'Notebook Set',
    price: 16.99,
    category: 'Stationery',
    rating: 4.4,
    stock: 87,
    image: '📓',
  },
  {
    id: 19,
    name: 'Pen Collection',
    price: 22.99,
    category: 'Stationery',
    rating: 4.3,
    stock: 76,
    image: '✒️',
  },
  {
    id: 20,
    name: 'Coffee Mug',
    price: 9.99,
    category: 'Accessories',
    rating: 4.6,
    stock: 134,
    image: '☕',
  },
];

export default function ProductsApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<number[]>([]);

  const categories = [
    'All',
    ...Array.from(new Set(mockProducts.map((p) => p.category))),
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
      />
    ));
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Product Catalog</h1>
          <div className="relative">
            <ShoppingCart className="h-6 w-6 text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cart.length}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/70" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryBadge
                key={category}
                active={selectedCategory === category}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </CategoryBadge>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-auto p-4">
        {filteredProducts.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-white/60">No products found</p>
              <p className="text-sm text-white/40">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                className="group flex flex-col border-white/10 bg-white/5 p-3 transition-all hover:border-white/20 hover:bg-white/10"
              >
                {/* Product Image */}
                <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-white/5 text-5xl">
                  {product.image}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mb-2 text-xs text-white/50">
                    {product.category}
                  </p>

                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="ml-1 text-xs text-white/60">
                      {product.rating}
                    </span>
                  </div>

                  {/* Stock */}
                  <p className="mb-3 text-xs text-white/50">
                    Stock:{' '}
                    <span
                      className={
                        product.stock < 30
                          ? 'text-orange-400'
                          : 'text-green-400'
                      }
                    >
                      {product.stock}
                    </span>
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      ${product.price}
                    </span>
                    <Button onClick={() => addToCart(product.id)} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              </ProductCard>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-white/10 bg-black/20 p-3 text-center">
        <p className="text-xs text-white/50">
          Showing {filteredProducts.length} of {mockProducts.length} products
        </p>
      </div>
    </div>
  );
}

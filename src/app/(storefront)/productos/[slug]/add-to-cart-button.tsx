'use client';

/**
 * Botón de agregar al carrito con selector de cantidad
 */

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart-store';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);

    // Reset después de 2 segundos
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 2000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const increaseQuantity = () => {
    // Limitar al stock si está definido
    const maxQuantity = product.stock ?? 99;
    if (quantity < maxQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Selector de cantidad */}
      <div className="flex items-center border rounded-lg self-start sm:self-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-r-none"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="w-16 text-center font-medium">{quantity}</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-l-none"
          onClick={increaseQuantity}
          disabled={disabled || (product.stock !== undefined && quantity >= product.stock)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Botón agregar — w-full en mobile, flex-1 en sm+ */}
      <Button
        size="lg"
        className="w-full sm:flex-1 h-12 px-6 gap-2"
        onClick={handleAddToCart}
        disabled={disabled || isAdded}
      >
        {isAdded ? (
          <>
            <Check className="h-5 w-5 shrink-0" />
            ¡Agregado!
          </>
        ) : disabled ? (
          'Sin stock'
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 shrink-0" />
            Agregar al carrito
          </>
        )}
      </Button>
    </div>
  );
}

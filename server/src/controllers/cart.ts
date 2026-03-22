import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!._id }).populate(
      'items.product',
      'name images price stock category'
    );
    res.json({ success: true, cart: cart ?? { items: [] } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      res.status(400).json({ success: false, message: 'productId and quantity are required' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (quantity > 0 && product.stock < quantity) {
      res.status(400).json({ success: false, message: 'Insufficient stock' });
      return;
    }

    let cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (quantity <= 0) {
      if (itemIndex > -1) cart.items.splice(itemIndex, 1);
    } else if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        product: product._id as any,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price stock category');
    res.json({ success: true, cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user!._id });

    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'name images price stock category');
    res.json({ success: true, cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user!._id },
      { items: [] },
      { upsert: true }
    );
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

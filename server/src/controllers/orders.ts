import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      res.status(400).json({ success: false, message: 'Shipping address is required' });
      return;
    }

    const cart = await Cart.findOne({ user: req.user!._id }).populate(
      'items.product',
      'name price stock'
    );

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty' });
      return;
    }

    const items = cart.items.map((item: any) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user!._id,
      items,
      totalPrice,
      shippingAddress,
    });

    // Clear cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!._id,
    }).lean();

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

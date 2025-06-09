import supabase from '../services/supabaseClient.js';

// Helper to get query filter key and value for cart ownership
const getCartFilter = (req) => {
  if (req.user?.id) {
    return { column: 'userId', value: req.user.id };
  }
  if (req.sessionId) {
    return { column: 'sessionId', value: req.sessionId };
  }
  throw new Error('No user or session found');
};
// Add or increase quantity of item in cart
export const addItemToCart = async (req, res) => {
  try {
    console.log(req.body)
    const { productId, quantity, colorId } = req.body;
    if (!productId || !quantity || quantity < 1 || !colorId) {
      return res.status(400).json({ error: 'Invalid productId or quantity or colorid' });
    }

    const { column, value } = getCartFilter(req);

    // Check if item exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('Cart')
      .select('*')
      .eq(column, value)
      .eq('productId', productId)
      .eq('colorId', colorId)
      .single();


    if (fetchError && fetchError.code !== 'PGRST116') {
      // Ignore "no rows" error PGRST116, other errors throw
      throw fetchError;
    }

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from('Cart')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .single();

      if (error) throw error;
      return res.json({ cartItem: data });
    } else {
      // Insert new cart item
      const insertObj = {
        productId: productId,
        quantity,
        colorId : colorId
      };
      insertObj[column] = value;

      const { data, error } = await supabase
        .from('Cart')
        .insert([insertObj])
        .single();
        

      if (error) throw error;
      return res.json({ cartItem: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });

  }
};
// Get cart items
export const getCart = async (req, res) => {
  try {
    const { column, value } = getCartFilter(req);

    const { data, error } = await supabase
      .from('Cart')
      .select('id, productId, quantity, colorId, Product(*)')
      .eq(column, value);

    if (error) throw error;

    res.json({ cart: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Update quantity for a cart item
export const updateItemQuantity = async (req, res) => {
  try {
    console.log(req.body);
    const { cartItemId, quantity } = req.body;

    // Validate input
    if (!cartItemId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid cartItemId or quantity' });
    }

    // Get ownership context (user or session)
    const { column, value } = getCartFilter(req);

    // ✅ Verify cart item exists and belongs to user/session
    const { data: cartItem, error: fetchError } = await supabase
      .from('Cart')
      .select('*')
      .eq('id', cartItemId)
      .eq(column, value)
      .single();

    if (fetchError || !cartItem) {
      return res.status(404).json({ error: 'Cart item not found or not owned by you' });
    }
    console.log({ cartItemId, column, value });

    // ✅ Update the quantity
    const { data, error } = await supabase
        .from('Cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq(column, value)
        .select()    // add .select() to fetch updated rows
        .single();   // expects exactly one row returned


    if (error) throw error;

    res.json({ cartItem: data });
  } catch (error) {
    console.error('update qty Error:', error);
    res.status(500).json({ error: error.message });
  }
};


export const removeItemFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.body;
    if (!cartItemId) return res.status(400).json({ error: 'cartItemId is required' });

    const { column, value } = getCartFilter(req);

    // Verify ownership and get the cart item
    const { data: cartItem, error: fetchError } = await supabase
      .from('Cart')
      .select('*')
      .eq('id', cartItemId)
      .eq(column, value)
      .single();

    if (fetchError) return res.status(404).json({ error: 'Cart item not found' });

    // Delete and return the deleted item using .delete().select().single()
    const { data: deletedItem, error: deleteError } = await supabase
      .from('Cart')
      .delete()
      .eq('id', cartItemId)
      .eq(column, value)
      .select()
      .single();

    if (deleteError) throw deleteError;

    res.json({ removedItem: deletedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


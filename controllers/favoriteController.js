import supabase from '../services/supabaseClient.js';

// Helper to get query filter key and value for favorite ownership
const getFavoriteFilter = (req) => {
  if (req.user?.id) {
    return { column: 'userId', value: req.user.id };
  }
  if (req.sessionId) {
    return { column: 'sessionId', value: req.sessionId };
  }
  throw new Error('No user or session found');
};

// Get Favorite items
export const getFavorites = async (req, res) => {
    console.log('req', req)
  try {
    const { column, value } = getFavoriteFilter(req);

    const { data, error } = await supabase
      .from('Favorite')
      .select('id, productId, Product(*)')
      .eq(column, value);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle favorite item (add if missing, remove if exists)
export const toggleFavoriteItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const { column, value } = getFavoriteFilter(req);

    // Check if item is already favorited
    const { data: existingItem, error: fetchError } = await supabase
      .from('Favorite')
      .select('*')
      .eq('productId', productId)
      .eq(column, value)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Ignore "No rows found" error, handle others
      throw fetchError;
    }

    if (existingItem) {
      // Already favorited → remove it
      const { data: deleted, error: deleteError } = await supabase
        .from('Favorite')
        .delete()
        .eq('id', existingItem.id)
        .select()
        .single();

      if (deleteError) throw deleteError;

      return res.json({ status: 'removed', item: deleted });
    } else {
      // Not in favorites → add it
      const insertObj = { productId };
      insertObj[column] = value;

      const { data: addedItem, error: insertError } = await supabase
        .from('Favorite')
        .insert([insertObj])
        .select()
        .single();

      if (insertError) throw insertError;

      return res.json({ status: 'added', item: addedItem });
    }
  } catch (error) {
    console.error('toggleFavorite error:', error);
    res.status(500).json({ error: error.message });
  }
};

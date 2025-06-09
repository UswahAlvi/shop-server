import supabase from '../services/supabaseClient.js';

export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('Product').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .eq('id', id)
      .single(); // Ensure it returns a single object instead of an array

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(404).json({ error: 'Product not found' });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .ilike('category', `%${category}%`);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
export const searchProducts = async (req, res) => {
  console.log('Search route hit:', req.query.q);
  const search = req.query.q?.trim();

  if (!search) {
    return res.status(400).json({ error: 'Missing search query.' });
  }

  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .or(`name.ilike.%${search}%,description.ilike.%${search}%`);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

import supabase from "../services/supabaseClient.js";

export const getCouponByCode = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  try {
    const { data, error } = await supabase
      .from('Coupon')
      .select('discount')
      .ilike('code', code)
      .eq('enabled', true)
      .single();

    if (error || !data) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching coupon:', error?.message || error);
    res.status(404).json({ error: 'Coupon not found' });
  }
};

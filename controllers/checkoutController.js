import supabase from "../services/supabaseClient.js";

const getFilter = (req) => {
  if (req.user?.id) {
    return { column: 'userId', value: req.user.id };
  }
  if (req.sessionId) {
    return { column: 'sessionId', value: req.sessionId };
  }
  throw new Error('No user or session found');
};
export const handleCheckout = async (req, res) => {
  try {
    const { customerInfo, orderInfo } = req.body;

    if (!customerInfo || !orderInfo || !orderInfo.cart?.length) {
      return res.status(400).json({ message: "Invalid checkout data" });
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      province,
      postalCode,
      country,
    } = customerInfo;

    const {
      cart,
      subtotal,
      shippingCost,
      code, 
      discountAmount,
      total,
      userId = null, 
    } = orderInfo;

    const { data, error } = await supabase.from("Orders").insert([
      {
        user_id: userId,
        customer_name: name,
        email,
        phone,
        address,
        city,
        province,
        postal_code: postalCode,
        country,
        cart_items: cart,
        subtotal,
        shipping_cost: shippingCost,
        coupon_code: code,
        discount_amount: discountAmount,
        total,
        status: "pending", 
        placed_at: new Date().toISOString(),
      },
    ]).select("id");

    if (error) {
      console.error("Supabase Error:", error.message);
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    const orderId = data?.[0]?.id;
     
     try {
      const { column, value } = getFilter(req);
      const { error: deleteError } = await supabase
        .from("Cart")
        .delete()
        .eq(column, value);

      if (deleteError) {
        console.error("Cart Deletion Error:", deleteError.message);
      }
    } catch (e) {
      // No user or session found - maybe log but don't fail order creation
      console.warn("Cart deletion skipped:", e.message);
    }
    return res.status(201).json({
      message: "Order placed successfully",
      orderId,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return res.status(500).json({ message: "Server error during checkout" });
  }
};

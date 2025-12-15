import { Cart } from "Types/Cart";
import { CartSave } from "Types/CartSave";
import mitt from "mitt";

type Events = {
    loggedIn: {
        cartList: Cart[] | undefined,
        updateCustomerCart: any
    }
}

const emitter = mitt<Events>();


emitter.on('loggedIn', e => {
    if (e.cartList && e.cartList.length > 0) {
        var cartDbData: CartSave[] = [];
        e.cartList.map((item, i) => {
            return cartDbData.push({
                item: item.productId,
                quantity: item.quantity,
                size: item.size
            });
        });
        const updateCart = async (cartData: Array<CartSave>) => {
            try {
                let result = await e.updateCustomerCart(cartData).unwrap();
            } catch (err) {
                console.error(err);
            }

        }
        updateCart(cartDbData);
    }
});

export default emitter;